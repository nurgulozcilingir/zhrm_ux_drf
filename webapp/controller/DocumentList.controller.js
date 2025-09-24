sap.ui.define([
    "com/bmc/hcm/drf/zhcmuxdrf/controller/BaseController",
    "com/bmc/hcm/drf/zhcmuxdrf/controller/SharedData",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "com/bmc/hcm/drf/zhcmuxdrf/utils/FormValidator",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/richtexteditor/RichTextEditor",
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV",
    "sap/ui/core/util/ExportType",
    "com/bmc/hcm/drf/zhcmuxdrf/model/formatter",
], function(
    BaseController,
    SharedData,
    JSONModel,
    History,
    Filter,
    FilterOperator,
    FormValidator,
    MessageToast,
    MessageBox,
    RichTextEditor,
    Export,
    ExportTypeCSV,
    ExportType,
    formatter
) {
	"use strict";

	return BaseController.extend("com.bmc.hcm.drf.zhcmuxdrf.controller.DocumentList", {
		formatter: formatter,
		onInit: function() {
			// View Model oluştur
            var oViewModel = new JSONModel({
				busy: false,
				DocumentCollection: [],
                tableNoDataText: this.getText("EMPTY_REQUEST_LIST"),
                drfssList: [],
                search: {
					Zbelt: "",
					Zbeln: "",
					Zznot: ""
				},
				diplomaCount: 0,
				certificateCount: 0,
				masterCount: 0,
				phdCount: 0
            });
            
            // Named model olarak kaydet
            this.setModel(oViewModel, "DocumentListRequestView");
            
            // Route matched event'ini dinle
            this.getRouter()
            .getRoute("documentlist")
            .attachPatternMatched(this._onNewDocumentRequestMatched, this);
		},
		
		_onNewDocumentRequestMatched: function(oEvent) {
        },
		
		onNavBack: function() {
			// Geri navigasyon işlemi
			var oHistory = sap.ui.core.routing.History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				// Ana sayfaya yönlendir
				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("appdispatcher", {}, true);
			}
		},
		
		onRefresh: function() {
		},
        onChangeDrfst: function () {
			this._getChangeDrfst();
			this.onRequestSearch();
		},
        _getChangeDrfst:function(){
			debugger;
			var oModel = this.getModel();
			var oViewModel = this.getModel("DocumentListRequestView"),
				oSearch = oViewModel.getProperty("/search");
			oViewModel.setProperty("/DrfssList", []);
			oViewModel.setProperty("/busy", true);
			var aFilters = [
				new Filter("Selky", FilterOperator.EQ, oSearch.Zbelt),
				new Filter("Drfvh", FilterOperator.EQ, "Drfbn")
			];
			oModel.read("/ValueHelpSet", {
				filters: aFilters,
				success: function (oData, oResponse) {
					this._sweetToast(this.getText("READ_ERFSS_SUCCESS"), "S");
					let results = oData.results;
					results = results.filter(item => item.Fldky !== '000');
					oViewModel.setProperty("/busy", false);
					oViewModel.setProperty("/drfssList", results);
				}.bind(this),
				error: function (oError) {
					oViewModel.setProperty("/busy", false);
					this._sweetToast(this.getText("READ_ERFSS_ERROR"), "E");
				}.bind(this)
			});
		},
        onRequestSearch: function (oEvent) {
			debugger;

			var oIconTabBar = this.byId("idIconTabBar"),
				oViewModel = this.getModel("DocumentListRequestView"),
				oSearch = oViewModel.getProperty("/search"),
				aFilters = [];
			if(oSearch.Zbelt === ""){
				oSearch.Zbeln = "";
			}
			// Aranacak alanlar
			var aFields = ["Zbelt", "Zbeln","Zznot"]

			aFields.forEach(function (sField) {
				var sValue = oSearch[sField];
				if (sValue) {
					aFilters.push(new Filter(sField, FilterOperator.EQ, sValue));
				}
			});

			this._applySearch(aFilters);
		},
        _applySearch: function (aTableSearchState) {
			debugger;
			var oTable = this.byId("idDocumentsTable"),
				oViewModel = this.getModel("DocumentListRequestView");
			oTable.getBinding("items").filter(aTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getText("EMPTY_REQUEST_LIST_SEARCH"));
			}
		},
		// onAttachDownloadDocLink: function (oEvent) {
		// 	debugger;
		// 	var oSource = oEvent.getSource();
  
		// 	var oBindingContext = oSource.getBindingContext("DocumentListRequestView");
		
		// 	if (oBindingContext) {
  
		// 		var oRowData = oBindingContext.getObject();  
		// 		this._selectedAttidData = oRowData;
		
		// 		var Attid = oRowData.Attid;
  
		// 		var oModel = this.getModel();
		// 		var oUrlPath = oModel.sServiceUrl + "/EmployeeAttachmentSet(Attid=guid'" + Attid + "')/$value";
		
		// 		window.open(oUrlPath);
		// 	}
		// },
		onAttachDownloadDoc: function (oEvent) {
			debugger;
			var oModel = this.getModel();
			var Attid = oEvent
			  .getSource()
			  .getBindingContext()
			  .getProperty("Attid");
			var oUrlPath =
			  oModel.sServiceUrl +
			  "/EmployeeAttachmentSet(Attid=guid'" +
			  Attid +
			  "')/$value";
			window.open(oUrlPath);
		  },
	});
});