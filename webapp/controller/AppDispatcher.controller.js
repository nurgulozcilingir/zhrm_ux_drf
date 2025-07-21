sap.ui.define([
    "com/bmc/hcm/drf/zhcmuxdrf/controller/BaseController",
    "sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"com/bmc/hcm/drf/zhcmuxdrf/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"com/bmc/hcm/drf/zhcmuxdrf/controller/SharedData"
],
function (BaseController, JSONModel, History, formatter, Filter, FilterOperator, SharedData) {
    "use strict";

    return BaseController.extend("com.bmc.hcm.drf.zhcmuxdrf.controller.AppDispatcher", {

		formatter: formatter,
        
		onInit: function () {
			var oViewModel;
			// Model used to manipulate control states
			oViewModel = new JSONModel({
				busy: false,
				requestCounts: {},
				appList: [{
					"appName": "DrfcrApp",
					"visible": true,
					"count": 0,
					// "entitySet": "EmployeeRequestFormSet",
					// "filters": [
					// 	new Filter("Erfap", FilterOperator.EQ, "MY_REQUESTS"),
					// 	new Filter("Erfsf", FilterOperator.EQ, "ALL")
					// ],
					"title": this.getText("MY_EMPLOYEE_REQUEST_FORM"),
					"pressed": "onMyEmployeeRequestPage",
					"icon": "sap-icon://employee-lookup"
				}, {
					"appName": "DrfapApp",
					"visible": true,
					"count": 0,
					// "entitySet": "EmployeeRequestFormSet",
					// "filters": [
					// 	new Filter("Erfap", FilterOperator.EQ, "REQUESTS_ON_ME"),
					// 	new Filter("Erfsf", FilterOperator.EQ, "ALL")
					// ],
					"title": this.getText("EMPLOYEE_REQUEST_APPROVALS"),
					"pressed": "onEmployeeRequestApprovalPage",
					"icon": "sap-icon://validate"
				}, 
				// {
				// 	"appName": "DrfrcApp",
				// 	"visible": false,
				// 	"count": 0,
				// 	"entitySet": "CandidateProcessApprovalSet",
				// 	"filters": [new Filter("Appst", FilterOperator.EQ, "2")],
				// 	"title": this.getText("EMPLOYEE_REQUEST_FORM_LIST_CLOSED"),
				// 	"pressed": "onCandidateProcessClosedSet",
				// 	"icon": "sap-icon://validate"
				// }, {
				// 	"appName": "DrfraApp",
				// 	"visible": true,
				// 	"entitySet": "EmployeeRequestFormSet",
				// 	"count": 0,
				// 	"filters": [
				// 		new Filter("Erfap", FilterOperator.EQ, "REQUESTS_APPROVED"),
				// 		new Filter("Erfsf", FilterOperator.EQ, "APP"),
				// 		new Filter("Erfrf", FilterOperator.EQ, "APM")
				// 	],
				// 	"title": this.getText("RECRUITMENT_SPECIALIST_REQUESTS"),
				// 	"pressed": "onRecruiterEmployeeRequestPage",
				// 	"icon": "sap-icon://employee-approvals"
				// }, {
				// 	"appName": "DrfclApp",
				// 	"visible": false,
				// 	"entitySet": "CandidatePoolSet",
				// 	"count": 0,
				// 	"filters": [new Filter("Cplty", FilterOperator.EQ, "C")],
				// 	"title": this.getText("CANDIDATE_LIST_APP"),
				// 	"pressed": "onCandidateProfilePage",
				// 	"icon": "sap-icon://employee-pane"
				// }
			],
				appAuthorization: {
					DrfcrApp: true,
					DrfapApp: true
					// DrfrcApp: true,
					// DrfrcApp: true,
					// DrfclApp: true
				}
			});
			this.setModel(oViewModel, "appDispatcherView");

			// Add the requestList page to the flp routing history
			this.addHistoryEntry({
				title: this.getText("RECRUITMENT_APPLICATIONS"),
				icon: "sap-icon://employee-lookup",
				intent: "#RecruitmentApp-display"
			}, true);

			var oModel = this.getOwnerComponent().getModel();
			oModel.metadataLoaded().then(function () {
				SharedData.setRootLoaded();
			});

			this.getRouter().getRoute("appdispatcher").attachPatternMatched(this._onAppDispatcherMatched, this);

		},
		onAfterRendering: function () {
			var oRenderer = sap.ushell.Container.getRenderer("fiori2");
			oRenderer.setHeaderVisibility(false, false, ["app"]);
		},
		onNavHome: function () {
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			var oRenderer = sap.ushell.Container.getRenderer("fiori2");
			oRenderer.setHeaderVisibility(true, true, ["app"]);

			oCrossAppNavigator.toExternal({
				target: {
					semanticObject: "#"
				}
			});
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */
		onAppClickHandler: function (oEvent) {
			var sApp = oEvent.getSource().data("targetApp");
			var oThis = this;
			try {
				if (sApp) {
					var oViewModel = this.getModel("appDispatcherView");
					var aAppList = oViewModel.getProperty("/appList");
					var aTargetApp = _.filter(aAppList, ['appName', sApp]);
					if (aTargetApp[0]) {
						var oFunc = jQuery.proxy(oThis, aTargetApp[0].pressed);
						oFunc.call();
					}
				}
			} catch (oEx) {
				jQuery.sap.log.error("App click handler failed");
			}
		},
		onMyEmployeeRequestPage: function () {
			this.getRouter().navTo("mngrequestlist");
		},
		onEmployeeRequestApprovalPage: function () {
			this.getRouter().navTo("approvallist");

		},
		// onCandidateProcessClosedSet: function () {
		// 	this.getRouter().navTo("closedlist");
		// },
		onRecruiterEmployeeRequestPage: function () {
			this.getRouter().navTo("recrequestlist");
		},
		// onCandidateProfilePage: function () {
		// 	this.getRouter().navTo("candidatelist");
		// },
		// onCandidateProcessApprovalPage: function () {
		// 	this.getRouter().navTo("candidateprocessapproval");
		// },
		// onRecruitmentAdminPage: function () {
		// 	this.getRouter().navTo("recruitmentadmin");
		// },
		onRefreshRequestCounts: function () {
			var oModel = this.getModel();
			var oViewModel = this.getModel("appDispatcherView");
			var aAppList = oViewModel.getProperty("/appList");
			$.each(aAppList, function (sIndex, oApp) {
				if (oApp.visible) {
					oModel.read("/" + oApp.entitySet + "/$count", {
						filters: oApp.filters,
						success: function (oData, oResponse) {
							oApp.count = oResponse.body;
							oViewModel.setProperty("/appList/" + sIndex, oApp);
						},
						error: function (oError) {
							oApp.count = 0;
							oViewModel.setProperty("/appList/" + sIndex, oApp);
						}
					});
				} else {
					oApp.count = 0;
				}
			});
		},
		_onAppDispatcherMatched: function (oEvent) {
			debugger;
			var oModel = this.getModel();
			var oViewModel = this.getModel("appDispatcherView");
			var aAppList = oViewModel.getProperty("/appList");
			var oThis = this;
			var oPage = this.byId("idAppDispatcherPage");

			oPage.removeContent();
			oViewModel.setProperty("/busy", true);
			SharedData.setApplicationAuth(null);
			oModel.metadataLoaded().then(function () {
				SharedData.setCurrentUser({});
				oModel.read("/UserSet('ME')", {
					success: function (oData, oResponse) {
						SharedData.setCurrentUser(oData);
					},
					error: function (oError) {}
				});

				var sPath = oModel.createKey("/ApplicationAuthorizationSet", {
					Uname: "ME"
				});

				oModel.read(sPath, {
					success: function (oData) {
						SharedData.setApplicationAuth(oData);
						$.each(aAppList, function (sIndex, oApp) {
							oApp.visible = oData.hasOwnProperty(oApp.appName) ? oData[oApp.appName] : false;
						});

						oViewModel.setProperty("/appList", aAppList);

						//Get authorization for new request
						oThis.onRefreshRequestCounts();

						var oTileTemplate = new sap.m.GenericTile({
							header: "{appDispatcherView>title}",
							press: oThis.onAppClickHandler.bind(oThis),
							tileContent: [
								new sap.m.TileContent({
									content: new sap.m.NumericContent({
										value: "{appDispatcherView>count}",
										icon: "{appDispatcherView>icon}"
									})
								})
							],
							visible: "{appDispatcherView>visible}"
						}).addStyleClass("sapUiSmallMargin");
						var oDataTemplate = new sap.ui.core.CustomData({
							key: "targetApp"
						});
						oDataTemplate.bindProperty("value", "appDispatcherView>appName");
						oTileTemplate.addCustomData(oDataTemplate);

						oPage.bindAggregation("content", {
							path: "appDispatcherView>/appList",
							template: oTileTemplate
						});

						oViewModel.setProperty("/busy", false);
					},
					error: function () {

					}
				});

			});

		}
    });
});
