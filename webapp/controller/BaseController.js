/*global MaterialSnackbar*/
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/Dialog",
	"sap/m/MessageToast",
	"com/bmc/hcm/drf/zhcmuxdrf/controller/SharedData",
	"com/bmc/hcm/drf/zhcmuxdrf/utils/FormValidator",
	"com/bmc/hcm/drf/zhcmuxdrf/utils/confetti",
	"com/bmc/hcm/drf/zhcmuxdrf/utils/swal"
], function (Controller, Dialog, MessageToast, SharedData, FormValidator,confetti,swalJs) {
	"use strict";

	return Controller.extend("com.bmc.hcm.drf.zhcmuxdrf.controller.BaseController", {

		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},
		/**
		 * Generic method for navigating back
		 * @public
		 * @param {sap.ui.core.routing.History} History class
		 */
		goBack: function (History) {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				jQuery.sap.log.error("Hash is not defined. Nav back failed");
			}
		},
		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		initOperations: function () {
			var oThis = this;
			if (!SharedData.getRootLoaded()) {
				this.getRouter().navTo("appdispatcher", {}, true);
			}
			var oModel = this.getOwnerComponent().getModel();
			oModel.metadataLoaded().then(function () {
				oThis.readUpperLevelJob(oModel);
			});
		},
		readUpperLevelJob: function (oModel) {
			var sPath = "/UpperLevelJobSet";

			oModel.read(sPath, {
				method: "GET",
				success: function (oData, oResponse) {
					SharedData.setUpperLevelJobs(oData.results);
				},
				error: function (oError) {}
			});

		},
		getText: function (sTextCode, aParam) {
			var aTextParam = aParam;
			if (!aTextParam) {
				aTextParam = [];
			}
			return this.getResourceBundle().getText(sTextCode, aTextParam);
		},

		_openBusyFragment: function (sTextCode, aMessageParameters) {
			var oDialog = this._getBusyFragment();

			if (sTextCode) {
				oDialog.setText(this.getText(sTextCode, aMessageParameters));
			} else {
				oDialog.setText(this.getText("PLEASE_WAIT"));
			}

			oDialog.open();
		},

		_closeBusyFragment: function () {
			var oDialog = this._getBusyFragment();
			oDialog.close();
		},

		_getBusyFragment: function () {
			if (!this._oBusyDialog) {
				this._oBusyDialog = sap.ui.xmlfragment("com.bmc.hcm.drf.zhcmuxdrf.fragment.GenericBusyDialog", this);
				this.getView().addDependent(this.oBusyDialog);
			} else {
				this._oBusyDialog.close();
			}

			return this._oBusyDialog;
		},
		_sweetToast: function (sMessage, sMessageType) {
			var sTitle, sText, sIcon;
			var sI18n = this.getView().getModel("i18n").getResourceBundle();
			switch (sMessageType) {
				case "S":
					sTitle = sI18n.getText("SUCCESS_TEXT");
					sText = sMessage;
					sIcon = "success";
					break;
				case "W":
					sTitle = sI18n.getText("WARNING_TEXT");
					sText = sMessage;
					sIcon = "warning";
					break;
				case "E":
					sTitle = sI18n.getText("ERROR");
					sText = sMessage;
					sIcon = "error";
					break;
				case "I":
					sTitle = sI18n.getText("INFO_TEXT");
					sText = sMessage;
					sIcon = "info";
					break;
				default:
					sText = sMessage;
					sIcon = "info";
			}
			var Toast = Swal.mixin({
				toast: true,
				position: "bottom-end",
				showConfirmButton: false,
				timer: 3000,
				timerProgressBar: true,
				didOpen: (toast) => {
					toast.onmouseenter = Swal.stopTimer;
					toast.onmouseleave = Swal.resumeTimer;
				},
				customClass: {
					popup: "swal2-custom-zindex", // CSS ile z-index artırılabilir,
					popup: "swal2-custom-popup",
					title: "swal2-custom-title",
					confirmButton: "swal2-custom-confirm",
					cancelButton: "swal2-custom-cancel",
				},
			});
			Toast.fire({
				icon: sIcon,
				title: sText,
			});
		},
		_callConfirmDialog: function (sTitle, sDialogType, sState, sConfirmation, oBeginButtonProp, oEndButtonProp) {
			var oEndButton;
			var oBeginButton;
			var dialog;

			if (oEndButtonProp) {
				oEndButton = new sap.m.Button({
					text: oEndButtonProp.text,
					type: oEndButtonProp.type,
					icon: oEndButtonProp.icon
				});
				oEndButton.attachPress(function () {
					dialog.close();
					oEndButtonProp.onPressed();
				});
			} else {
				oEndButton = new sap.m.Button({
					text: "{i18n>CANCEL_ACTION}",
					press: function () {
						dialog.close();
					}
				});
			}

			oBeginButton = new sap.m.Button({
				text: oBeginButtonProp.text,
				type: oBeginButtonProp.type,
				icon: oBeginButtonProp.icon
			});

			oBeginButton.attachPress(function () {
				dialog.close();
				oBeginButtonProp.onPressed();
			});

			dialog = new Dialog({
				title: sTitle,
				type: sDialogType,
				state: sState,
				content: new sap.m.Text({
					text: sConfirmation
				}),
				beginButton: oBeginButton,
				endButton: oEndButton,
				afterClose: function () {
					dialog.destroy();
				},
				escapeHandler: function (oPromise) {
					oPromise.reject();
				}
			});
			this.getView().addDependent(dialog);
			return dialog;
		},
		_callPDFViewer: function (sPath, sTitle) {
			/*this._pdfViewerDialog = sap.ui.xmlfragment(
				"com.bmc.hcm.erf.fragment.PDFViewer",
				this
			);

			this._pdfViewerDialog.data("pdfPath", sPath);
			this.getView().addDependent(this._pdfViewerDialog);
			this._pdfViewerDialog.setTitle(sTitle);
			this._pdfViewerDialog.open();*/
			var oDevice = this.getModel("device").getData();

			
			if(oDevice.browser.name === "cr" && oDevice.system.desktop){
				var oPDFViewer = new sap.m.PDFViewer();
				oPDFViewer.setSource(sPath);
				oPDFViewer.setTitle(sTitle);
				oPDFViewer.open();	
			}else{
				sap.m.URLHelper.redirect(sPath, true);
			}
			
			
			
		},
		_callMessageToast: function (sMessg, sMsgty) {
			var oElem = $(".mdl-js-snackbar")[0];
			if (oElem) {
				try {
					var oMS = new MaterialSnackbar(oElem);

					var data = {
						message: sMessg,
						messageType: sMsgty
					};

					oMS.showSnackbar(data);
				} catch (ex) {
					MessageToast.show(sMessg);
				}
			} else {
				MessageToast.show(sMessg);
			}
		},
		_deleteRequest: function (sDrfid) {
			debugger;
			var oModel = this.getModel();
			var oThis = this;

			var sPath = oModel.createKey("/DocumentRequestFormSet", {
				Drfid: sDrfid
			});

			oThis._openBusyFragment("FORM_BEING_DELETED");

			oModel.remove(sPath, {
				success: function () {
					oThis._closeBusyFragment();
					oThis._callMessageToast(oThis.getText("FORM_DELETE_SUCCESSFUL"), "S");
					oModel.refresh();
				},
				error: function () {
					oThis._closeBusyFragment();
				}
			});
		},
		_updateRequest: function (oFormData, sNewRequest, sNavBack, sStatusChange, History, fnCallBack) {
			debugger;
			var oModel = this.getModel();
			var oViewModel = this.getModel("employeeRequestView");
			var oThis = this;
			// var oRequestData = oViewModel.getProperty("/request");
			var aEmployeeIds = [];
			// var aEmployeeIds = oRequestData.DocumentRequestEmployeeSet.map(function (oEmployee) {
			// 	return {
			// 	  Pernr: oEmployee.Pernr
			// 	};
			//   });
			if (oFormData.DocumentRequestEmployeeSet) {
				var aEmployees = Array.isArray(oFormData.DocumentRequestEmployeeSet)
					? oFormData.DocumentRequestEmployeeSet
					: oFormData.DocumentRequestEmployeeSet.results || [];
			
				aEmployeeIds = aEmployees.map(function (oEmployee) {
					return { 
						Pernr: oEmployee.Pernr,
						Renwl: oEmployee.Renwl || "", // Yenileme talebi (1=Evet, 2=Hayır)
						Rendc: oEmployee.Rendc || "", // Yenileme gerekçesi
						Drfrs: oEmployee.Drfrs || ""  // Talep gerekçesi
					 };
				});
			}
			oFormData.DocumentRequestEmployeeSet = aEmployeeIds;
			if (oFormData.DocumentRequestHistorySet) {
				delete oFormData.DocumentRequestHistorySet;
			}
			if (oFormData.DocumentRequestPrintOut) {
				delete oFormData.DocumentRequestPrintOut;
			}
			// if(oFormData.DocumentRequestEmployeeSet){
			// 	delete oFormData.DocumentRequestEmployeeSet;
			// }

			if (sStatusChange) {
				oThis._openBusyFragment("FORM_STATUS_BEING_CHANGED");
			} else {
				oThis._openBusyFragment("FORM_BEING_SAVED");
			}
			if (sNewRequest) {
				oModel.create("/DocumentRequestFormSet", oFormData, {
					success: function (oData, oResponse) {
						oThis._closeBusyFragment();

						if (sStatusChange) {
							oThis._callMessageToast(oThis.getText("FORM_STATUS_CHANGE_SUCCESSFUL"), "S");
						} else {
							oThis._callMessageToast(oThis.getText("FORM_SAVE_SUCCESSFUL"), "S");
						}

						if (sNavBack) {
							oThis.goBack(History);
						} else {
							if (typeof fnCallBack === "function") {
								fnCallBack();
							}
						}
					},
					error: function (oError) {
						oThis._closeBusyFragment();
					}
				});
			} else {
				// var sPath = oModel.create("/DocumentRequestFormSet", oFormData, {
					// var sPath = oModel.createKey("/DocumentRequestFormSet", {
					// 	Drfid: oFormData.Drfid
					// });

					oModel.create("/DocumentRequestFormSet", oFormData, {
						success: function (oData, oResponse) {
							oThis._closeBusyFragment();
							if (sStatusChange) {
								oThis._callMessageToast(oThis.getText("FORM_STATUS_CHANGE_SUCCESSFUL"), "S");
							} else {
								oThis._callMessageToast(oThis.getText("FORM_SAVE_SUCCESSFUL"), "S");
							}
							if (sNavBack) {
								oThis.goBack(History);
							}
						},
						error: function (oError) {
							oThis._closeBusyFragment();
						}
					});
			
				// oModel.create('/DocumentRequestFormSet', oFormData, {
				// 	success: function (oData, oResponse) {
				// 		oThis._closeBusyFragment();
				// 		if (sStatusChange) {
				// 			oThis._callMessageToast(oThis.getText("FORM_STATUS_CHANGE_SUCCESSFUL"), "S");
				// 		} else {
				// 			oThis._callMessageToast(oThis.getText("FORM_SAVE_SUCCESSFUL"), "S");
				// 		}
				// 		if (sNavBack) {
				// 			oThis.goBack(History);
				// 		}
				// 	},
				// 	error: function (oError) {
				// 		oThis._closeBusyFragment();
				// 	}
				// });
			}

		},
		_assignRequest: function (sErfid, sPernr, oSuccessCallback) {
			var oModel = this.getModel();
			var oThis = this;

			var oUrlParameters = {
				"Erfid": sErfid,
				"Pernr": sPernr
			};
			this._openBusyFragment(oThis.getText("FORM_BEING_ASSIGNED"));
			oModel.callFunction("/SetEmpReqRecruiter", {
				method: "POST",
				urlParameters: oUrlParameters,
				success: function (oData, oResponse) {
					oThis._closeBusyFragment();
					oThis._callMessageToast(oThis.getText("FORM_ASSIGN_SUCCESSFUL"), "S");
					oSuccessCallback.call();
				},
				error: function (oError) {
					oThis._closeBusyFragment();
				}
			});

		},
		onDownloadFile: function (sUrl) {

			$.fileDownload(sUrl)
				.done(function () {
					jQuery.sap.log.error("Dosya indirildi");
				})
				.fail(function () {
					jQuery.sap.log.error("Hata oluştu");
				});

		},

		_formatDate: function (sDate, sTime) {
			try {
				if (sTime) {
					sDate.setMilliseconds(sTime.ms);
				}
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: sTime ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy",
					UTC: true
				});

				return oDateFormat.format(sDate);

			} catch (ex) {
				return "";
			}
		},
		_validateForm: function (oForm) {
			var oValidator = new FormValidator(this);

			if (oForm) {
				oValidator.clearTraces(oForm);
				var sResult = oValidator.validate(oForm);
				return sResult;
			} else {
				return true;
			}
		},
		_clearValidationTraces: function (oForm) {
			var oValidator = new FormValidator(this);
			if (oForm) {
				oValidator.clearTraces(oForm);
			}
		},
		_getConfetti: function (caseNumber) {
			function randomInRange(min, max) {
				return Math.random() * (max - min) + min;
			}
			if (!caseNumber || caseNumber === -1) {
				// Rastgele bir sayı üret
				let randomNumber = Math.floor(Math.random() * 100); // 0 ile 99 arasında bir sayı

				// Mod işlemi ile 10'a bölünen sonucu al
				caseNumber = randomNumber % 10;
			}
			const end = Date.now() + 15 * 150;
			// go Buckeyes!
			const colors = ["#bb0000", "#ffffff"];

			// Canvas'ın arkaya alınması için stil ekleyelim
			const style = document.createElement("style");
			style.innerHTML = `
canvas {
position: fixed !important;
top: 0;
left: 0;
width: 100vw;
height: 100vh;
z-index: -1 !important;
pointer-events: none !important;
}
`;
			document.head.appendChild(style);

			switch (caseNumber) {
				case 0:
					(function frame() {
						window.confetti({
							particleCount: 2,
							angle: 60,
							spread: 55,
							origin: { x: 0 },
							colors: colors,
						});

						window.confetti({
							particleCount: 2,
							angle: 120,
							spread: 55,
							origin: { x: 1 },
							colors: colors,
						});

						if (Date.now() < end) {
							requestAnimationFrame(frame);
						}
					})();
					break;
				case 1:
					window.confetti({
						angle: randomInRange(55, 125),
						spread: randomInRange(50, 70),
						particleCount: randomInRange(50, 100),
						origin: { y: 0.6 },
					});
					break;
				case 2:
					const count = 200,
						defaults = {
							origin: { y: 0.7 },
						};

					function fire(particleRatio, opts) {
						window.confetti(
							Object.assign({}, defaults, opts, {
								particleCount: Math.floor(count * particleRatio),
							})
						);
					}

					fire(0.25, {
						spread: 26,
						startVelocity: 55,
					});

					fire(0.2, {
						spread: 60,
					});

					fire(0.35, {
						spread: 100,
						decay: 0.91,
						scalar: 0.8,
					});

					fire(0.1, {
						spread: 120,
						startVelocity: 25,
						decay: 0.92,
						scalar: 1.2,
					});

					fire(0.1, {
						spread: 120,
						startVelocity: 45,
					});
					break;
				case 3:
					const defaults2 = {
						spread: 360,
						ticks: 100,
						gravity: 0,
						decay: 0.94,
						startVelocity: 30,
						shapes: ["heart"],
						colors: ["FFC0CB", "FF69B4", "FF1493", "C71585"],
					};

					window.confetti({
						...defaults2,
						particleCount: 50,
						scalar: 2,
					});

					window.confetti({
						...defaults2,
						particleCount: 25,
						scalar: 3,
					});

					window.confetti({
						...defaults2,
						particleCount: 10,
						scalar: 4,
					});
					break;
				case 4:
					const defaults3 = {
						spread: 360,
						ticks: 50,
						gravity: 0,
						decay: 0.94,
						startVelocity: 30,
						shapes: ["star"],
						colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
					};

					function shoot1() {
						window.confetti({
							...defaults3,
							particleCount: 40,
							scalar: 1.2,
							shapes: ["star"],
						});

						window.confetti({
							...defaults3,
							particleCount: 10,
							scalar: 0.75,
							shapes: ["circle"],
						});
					}

					setTimeout(shoot1, 0);
					setTimeout(shoot1, 100);
					setTimeout(shoot1, 200);
					break;
				case 5:
					const defaults4 = {
						spread: 360,
						ticks: 100,
						gravity: 0,
						decay: 0.94,
						startVelocity: 30,
					};

					function shoot2() {
						window.confetti({
							...defaults4,
							particleCount: 30,
							scalar: 1.2,
							shapes: ["circle", "square"],
							colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
						});

						window.confetti({
							...defaults4,
							particleCount: 20,
							scalar: 2,
							shapes: ["emoji"],
							shapeOptions: {
								emoji: {
									value: [
										"🦄",
										"🔥",
										"🚀",
										"💎",
										"🎉",
										"🌟",
										"💖",
										"⚡",
										"🍀",
									],
								},
							},
						});
					}

					setTimeout(shoot2, 0);
					setTimeout(shoot2, 100);
					setTimeout(shoot2, 200);
					break;
				case 6:
					var defaults5 = {
						scalar: 2,
						spread: 270,
						particleCount: 25,
						origin: { y: 0.4 },
						startVelocity: 35,
					};

					window.confetti({
						...defaults5,
						shapes: ["image"],
						shapeOptions: {
							image: {
								src: "https://particles.js.org/images/pumpkin.svg",
								replaceColor: true,
								width: 32,
								height: 40,
							},
						},
						colors: ["#ff9a00", "#ff7400", "#ff4d00"],
					});
					window.confetti({
						...defaults5,
						shapes: ["image"],
						shapeOptions: {
							image: {
								src: "https://particles.js.org/images/pine-tree.svg",
								replaceColor: true,
								width: 271,
								height: 351.5,
							},
						},
						colors: ["#8d960f", "#be0f10", "#445404"],
					});
					window.confetti({
						...defaults5,
						shapes: ["heart"],
						colors: ["#f93963", "#a10864", "#ee0b93"],
					});
					break;
				case 7:
					const duration = 15 * 1000,
						animationEnd = Date.now() + duration,
						defaults6 = {
							startVelocity: 30,
							spread: 360,
							ticks: 60,
							zIndex: 0,
						};

					const interval = setInterval(function () {
						const timeLeft = animationEnd - Date.now();

						if (timeLeft <= 0) {
							return clearInterval(interval);
						}

						const particleCount = 50 * (timeLeft / duration);

						// since particles fall down, start a bit higher than random
						window.confetti(
							Object.assign({}, defaults6, {
								particleCount,
								origin: {
									x: randomInRange(0.1, 0.3),
									y: Math.random() - 0.2,
								},
							})
						);
						window.confetti(
							Object.assign({}, defaults6, {
								particleCount,
								origin: {
									x: randomInRange(0.7, 0.9),
									y: Math.random() - 0.2,
								},
							})
						);
					}, 250);
					break;
				case 8:
					window.confetti({
						spread: 360,
						ticks: 200,
						gravity: 1,
						decay: 0.94,
						startVelocity: 30,
						particleCount: 100,
						scalar: 3,
						shapes: ["image"],
						shapeOptions: {
							image: [
								{
									src: "https://particles.js.org/images/fruits/apple.png",
									width: 32,
									height: 32,
								},
								{
									src: "https://particles.js.org/images/fruits/avocado.png",
									width: 32,
									height: 32,
								},
								{
									src: "https://particles.js.org/images/fruits/banana.png",
									width: 32,
									height: 32,
								},
								{
									src: "https://particles.js.org/images/fruits/berries.png",
									width: 32,
									height: 32,
								},
								{
									src: "https://particles.js.org/images/fruits/cherry.png",
									width: 32,
									height: 32,
								},
								{
									src: "https://particles.js.org/images/fruits/grapes.png",
									width: 32,
									height: 32,
								},
								{
									src: "https://particles.js.org/images/fruits/lemon.png",
									width: 32,
									height: 32,
								},
								{
									src: "https://particles.js.org/images/fruits/orange.png",
									width: 32,
									height: 32,
								},
								{
									src: "https://particles.js.org/images/fruits/peach.png",
									width: 32,
									height: 32,
								},
								{
									src: "https://particles.js.org/images/fruits/pear.png",
									width: 32,
									height: 32,
								},
								{
									src: "https://particles.js.org/images/fruits/pepper.png",
									width: 32,
									height: 32,
								},
								{
									src: "https://particles.js.org/images/fruits/plum.png",
									width: 32,
									height: 32,
								},
								{
									src: "https://particles.js.org/images/fruits/star.png",
									width: 32,
									height: 32,
								},
								{
									src: "https://particles.js.org/images/fruits/strawberry.png",
									width: 32,
									height: 32,
								},
								{
									src: "https://particles.js.org/images/fruits/watermelon.png",
									width: 32,
									height: 32,
								},
								{
									src: "https://particles.js.org/images/fruits/watermelon_slice.png",
									width: 32,
									height: 32,
								},
							],
						},
					});
					break;
				case 9:
					const duration2 = 15 * 1000,
						animationEnd2 = Date.now() + duration2;

					let skew = 1;

					function randomInRange(min, max) {
						return Math.random() * (max - min) + min;
					}

					(function frame2() {
						const timeLeft2 = animationEnd2 - Date.now(),
							ticks = Math.max(200, 500 * (timeLeft2 / duration2));

						skew = Math.max(0.8, skew - 0.001);

						window.confetti({
							particleCount: 1,
							startVelocity: 0,
							ticks: ticks,
							origin: {
								x: Math.random(),
								// since particles fall down, skew start toward the top
								y: Math.random() * skew - 0.2,
							},
							colors: ["#ffffff"],
							shapes: ["circle"],
							gravity: randomInRange(0.4, 0.6),
							scalar: randomInRange(0.4, 1),
							drift: randomInRange(-0.4, 0.4),
						});

						if (timeLeft2 > 0) {
							requestAnimationFrame(frame2);
						}
					})();
					break;
				default:
					window.confetti({
						particleCount: 100,
						spread: 70,
						origin: { y: 0.6 },
					});
			}
		},
		createGUID: function () {
			return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				var r = Math.random() * 16 | 0,
					v = c === "x" ? r : (r & 0x3 | 0x8);
				return v.toString(16).toUpperCase();
			});
		},
		/**
		 * Adds a history entry in the FLP page history
		 * @public
		 * @param {object} oEntry An entry object to add to the hierachy array as expected from the ShellUIService.setHierarchy method
		 * @param {boolean} bReset If true resets the history before the new entry is added
		 */
		addHistoryEntry: (function () {
			var aHistoryEntries = [];

			return function (oEntry, bReset) {
				if (bReset) {
					aHistoryEntries = [];
				}

				var bInHistory = aHistoryEntries.some(function (entry) {
					return entry.intent === oEntry.intent;
				});

				if (!bInHistory) {
					aHistoryEntries.push(oEntry);
					this.getOwnerComponent().getService("ShellUIService").then(function (oService) {
						oService.setHierarchy(aHistoryEntries);
					});
				}
			};
		})()
	});

});