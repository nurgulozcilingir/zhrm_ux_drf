/*global location*/
/*global _*/
sap.ui.define(
  [
    'sap/m/MessagePopover',
    'sap/m/MessageItem',
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
  ],
  function (
    MessagePopover,
    MessageItem,
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
    var oMessageTemplate = new MessageItem({
      type: 'Error',
      title: '{Infty}-{Subty} bilgi tipinde hata',
      description: '{Message}',
      subtitle: '{Message}'
    });
    var oMessagePopover = new MessagePopover({
      items: {
        path: '/',
        template: oMessageTemplate
      }
    });
    var mModel = new JSONModel();
    oMessagePopover.setModel(mModel);

    return BaseController.extend(
      "com.bmc.hcm.drf.zhcmuxdrf.controller.EmployeeRequest",{
        formatter: formatter,
        _formFragments: {},

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the employeerequest controller is instantiated.
         * @public
         */
        onInit: function () {
          // Model used to manipulate control states. The chosen values make sure,
          // detail page is busy indication immediately so there is no break in
          // between the busy indication for loading the view's meta data
          var oViewModel = new JSONModel({
              busy: false,
              delay: 0,
              request: null,
              requestDefaults: null,
              positionList: null,
              organizationList: null,
              virtualCompanyList: null,
              positionListProxy: null,
              organizationListProxy: null,
              virtualCompanyListProxy: null,
              positionHelp: {
                enableAdd: false,
              },
              requestDocument:{},
              valueHelpList: {
                Drfev: []
              },
              selectedDocumentType: "",
              selectedDocumentTypeText: "",
              downloadButtonVisible: false,

              organizationHelp: {
                enableAdd: false,
              },
              dataList: {
                DocumentRequestEmployeeSet: [],
              },
              attachmentFilters: {},
              uploadFilters: {},
              viewFilters: {},
              documentList: [],
              request: {},
              formActions: [],
              formHistory: [],
              candidateList: [],
              candidateCount: 0,
              requestOwner: null,
              statusChangeDialog: null,
              candidateListStyle: "display-in-table",
              selectedEmployees: [],
              applicationSettings: {
                DisplayMode: false,
                Edit: true,
                CallerRole: null
              },
            }),
            oCandidateList = new JSONModel({
              SearchResults: {
                C: 0,
                P: 0,
                R: 0,
              },
              FilterBarExpanded: false,
              CandidateActionSettings: {
                DiscardFromPool: false,
                AssignToPotential: false,
                AssignToRejected: false,
                ActionsColumnVisible: false,
                SelectColumnVisible: false,
              },

              Filters: {
                Cplty: "C",
                Ename: "",
                Gesch: "",
                Slart: "",
                Wdart: "",
                Lstcm: "",
                Lstps: "",
                Hscmn: false,
                Hasrf: false,
                Isvic: false,
              },
            });
      
          this.getRouter()
            .getRoute("employeerequestnew")
            .attachPatternMatched(this._onNewRequestMatched, this);
          this.getRouter()
            .getRoute("employeerequestedit")
            .attachPatternMatched(this._onRequestMatched, this);

          this.setModel(oViewModel, "employeeRequestView");
          
          this._updateApplicationSettings();
          this.setModel(oCandidateList, "candidateListModel");
          // this.initOperations();
        },

        onExit: function () {
          this._initiateModels();
        },
        

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */
        onCancelForm: function (oEvent) {
          var oApplicationSettings = SharedData.getApplicationSettings();
          if (oApplicationSettings.CallerRole === "RECRUITMENT_ADMIN") {
            this.getRouter().navTo("recruitmentadmin", {}, true);
          } else if (oApplicationSettings.CallerRole === "RECRUITER") {
            this.getRouter().navTo("recrequestlist", {}, true);
          } else if (oApplicationSettings.CallerRole === "MANAGER") {
            this.getRouter().navTo("mngrequestlist", {}, true);
          } else if (oApplicationSettings.CallerRole === "APPROVER") {
            this.getRouter().navTo("approvallist", {}, true);
          } else {
            this.getRouter().navTo("appdispatcher", {}, true);
          }

          this._initiateModels();
        },
        onNavBack: function (oEvent) {
          var oApplicationSettings = SharedData.getApplicationSettings();
          if (oApplicationSettings.callerRole === "MANAGER") {
            this.getRouter().navTo("mngrequestlist", {}, true);
          } else if (oApplicationSettings.callerRole === "RECRUITER") {
            this.getRouter().navTo("recrequestlist", {}, true);
          } else {
            this.getRouter().navTo("appdispatcher", {}, true);
          }
          this._initiateModels();
        },
        onResetEmployee: function (oEvent) {
          var oViewModel = this.getModel("employeeRequestView");
          var sSourceField = oEvent.getSource().data("sourceField");
          var sTextField = "";

          switch (sSourceField) {
            case "Leaem":
              sTextField = "Leaen";
              break;
            case "Trnem":
              sTextField = "Trnen";
              break;
            default:
              jQuery.sap.log.error("Source field not supplied!");
              return;
          }

          // oViewModel.setProperty("/request/" + sSourceField, "00000000");
          // oViewModel.setProperty("/request/" + sTextField, "");
          // oViewModel.setProperty("/request/" + oViewModel.Plans, "00000000");
          // oViewModel.setProperty("/request/" + oViewModel.Plstx, "");
        },
        onResetPosition: function (oEvent) {
          var oViewModel = this.getModel("employeeRequestView");

          oViewModel.setProperty("/request/Plans", "00000000");
          oViewModel.setProperty("/request/Plstx", "");
          oViewModel.setProperty("/request/Plaft", "");
          oViewModel.setProperty("/request/Stell", "00000000");
          oViewModel.setProperty("/request/Stetx", "");
          oViewModel.setProperty("/request/Orgeh", "00000000");
          oViewModel.setProperty("/request/Orgtx", "");
          oViewModel.setProperty("/request/Hrcomp", "");
        },
        onResetFreePosition: function (oEvent) {
          var oViewModel = this.getModel("employeeRequestView");

          oViewModel.setProperty("/request/Nopln", false);
          oViewModel.setProperty("/request/Plaft", "");
          oViewModel.setProperty("/request/Plans", "00000000");
          oViewModel.setProperty("/request/Plstx", "");
          oViewModel.setProperty("/request/Plaft", "");
          oViewModel.setProperty("/request/Stell", "00000000");
          oViewModel.setProperty("/request/Stetx", "");
          oViewModel.setProperty("/request/Orgeh", "00000000");
          oViewModel.setProperty("/request/Orgtx", "");
          oViewModel.setProperty("/request/Hrcomp", "");
        },
        onResetOrganization: function (oEvent) {
          var oViewModel = this.getModel("employeeRequestView");

          oViewModel.setProperty("/request/Orgeh", "00000000");
          oViewModel.setProperty("/request/Orgtx", "");
        },

        onResetVirtualCompany: function (oEvent) {
          var oViewModel = this.getModel("employeeRequestView");

          // oViewModel.setProperty("/request/Orgeh", "00000000");
          oViewModel.setProperty("/request/Hrcomp", "");
        },

        onResetJob: function (oEvent) {
          var oViewModel = this.getModel("employeeRequestView");

          oViewModel.setProperty("/request/Stell", "00000000");
          oViewModel.setProperty("/request/Stetx", "");
        },

        onEmployeeSearchValueHelpRequest: function (oEvent) {
          debugger;
          var oModel = this.getModel();
          var oViewModel = this.getModel("employeeRequestView");
          var that = this;

          var oRequest = oViewModel.getProperty("/request");
          
          if (!oRequest || !oRequest.Drfrt || !oRequest.Drfbl || !oRequest.Drfbn) {
            this._sweetToast("Lütfen önce Talep Türü, Belge Türü ve Belge Adı alanlarını seçiniz.", "W");
            return;
          }

          this._openEmployeeSearchDialog(oModel, oViewModel);
        },
        
        /**
         * Opens employee search dialog
         * @private
         */
        _openEmployeeSearchDialog: function(oModel, oViewModel) {
          debugger;
          var that = this;
          
          oModel.read("/ValueHelpSet", {
            filters: [
              new sap.ui.model.Filter(
                "Drfvh",
                sap.ui.model.FilterOperator.EQ,
                "Emplye"
              ),
            ],
            success: function (oData) {
              oViewModel.setProperty("/List", oData.results);

              if (!that._employeeValueHelpDialog) {
                that._employeeValueHelpDialog = sap.ui.xmlfragment(
                  "EmployeeSearchFragment",
                  "com.bmc.hcm.drf.zhcmuxdrf.fragment.EmployeeSearch",
                  that
                );
                that.getView().addDependent(that._employeeValueHelpDialog);
              }

              that._employeeValueHelpDialog.open();
            },
            error: function (oError) {
              console.error("Hata:", oError);
              that._sweetToast(
                "Personel listesi yüklenirken hata oluştu", "E"
              );
            },
          });
        },
        onCloseButtonEmployeePress:function(){
          debugger;
          if (this._employeeValueHelpDialog) {
            this._employeeValueHelpDialog.close();
          }
        },
        
        /**
         * Refresh personel data before remove operation
         * @private
         */
        _refreshPersonelDataBeforeRemove: function(sDrfid, fnCallback) {
          var oModel = this.getModel();
          var oViewModel = this.getModel("employeeRequestView");
          var that = this;
          
          var sPath = "/DocumentRequestFormSet('" + sDrfid + "')";
          var sExpand = "DocumentRequestEmployeeSet" +
                       ",DocumentRequestEmployeeSet/EmployeeAttachmentSet";
                       
          oModel.read(sPath, {
            urlParameters: {
              "$expand": sExpand
            },
            success: function(oData) {
              oViewModel.setProperty("/request", oData);
              // Sadece DocumentRequestEmployeeSet'i güncelle
              oViewModel.setProperty("/dataList/DocumentRequestEmployeeSet", _.cloneDeep(oData.DocumentRequestEmployeeSet.results));
              
              console.log("Employee data refreshed successfully before remove");
              
              // Callback'i çağır
              if (fnCallback && typeof fnCallback === 'function') {
                fnCallback();
              }
            },
            error: function(oError) {
              console.error("Error refreshing employee data:", oError);
              that._sweetToast("Veri yenilenirken hata oluştu, eski veri ile devam ediliyor", "W");
              
              // Hata durumunda da callback'i çağır (eski veri ile devam etsin)
              if (fnCallback && typeof fnCallback === 'function') {
                fnCallback();
              }
            }
          });
        },  
        onEmployeeValueRequest: function (oEvent) {
          debugger;
          var sSourceField = oEvent.getSource().data("sourceField");
          var sInactive = oEvent.getSource().data("includeInactive");
          var sMyEmployee = oEvent.getSource().data("onlyMyEmployee");

          if (!sInactive || sInactive === "false") {
            sInactive = false;
          } else {
            sInactive = true;
          }

          if (!sMyEmployee || sMyEmployee === "false") {
            sMyEmployee = false;
          } else {
            sMyEmployee = true;
          }

          if (!this._employeeValueHelpDialog) {
            this._employeeValueHelpDialog = sap.ui.xmlfragment(
              "com.bmc.hcm.drf.zhcmuxdrf.fragment.EmployeeSearch",
              this
            );
            this.getView().addDependent(this._employeeValueHelpDialog);
          }
          // setRememberSelections removed - not applicable for regular Dialog
          this._employeeValueHelpDialog.data("sourceField", sSourceField);
          this._employeeValueHelpDialog.data("includeInactive", sInactive);
          this._employeeValueHelpDialog.data("onlyMyEmployee", sMyEmployee);
          this._employeeValueHelpDialog.open();
        },
        onEmployeeSearch: function (oEvent) {
          var sValue = oEvent.getParameter("value");
          var aFilters = [];
          var sInactive = this._employeeValueHelpDialog.data("includeInactive");
          var sMyEmployee =
            this._employeeValueHelpDialog.data("onlyMyEmployee");

          aFilters.push(new Filter("Ename", FilterOperator.EQ, sValue));

          if (sInactive) {
            aFilters.push(new Filter("Incin", FilterOperator.EQ, true));
          }

          //Only my employee
          aFilters.push(new Filter("Myemp", FilterOperator.EQ, sMyEmployee));

          oEvent.getSource().getBinding("items").filter(aFilters);
        },
        onEmployeeSelect: function (oEvent) {
          var aSelectedContexts = oEvent.getParameter("selectedContexts");
          if (aSelectedContexts && aSelectedContexts.length > 0) {
            var oViewModel = this.getModel("employeeRequestView");
            var aSelectedEmployees =
              oViewModel.getProperty("/selectedEmployees") || [];

            // Tek personel seçimi kontrolü
            if (aSelectedContexts.length > 1) {
              this._sweetToast(this.getText("SINGLE_EMPLOYEE_ONLY"), "W");
              return;
            }

            // Zaten personel seçilmiş mi kontrolü
            if (aSelectedEmployees.length > 0) {
              this._sweetToast(this.getText("SINGLE_EMPLOYEE_ONLY"), "W");
              return;
            }

            var oSelectedEmployee = aSelectedContexts[0].getObject();

            // Aynı personelin daha önce eklenip eklenmediğini kontrol et
            var bAlreadyExists = aSelectedEmployees.some(function (
              oEmployee
            ) {
              return oEmployee.Pernr === oSelectedEmployee.Pernr;
            });

            if (!bAlreadyExists) {
              aSelectedEmployees.push({
                Pernr: oSelectedEmployee.Pernr,
                Ename: oSelectedEmployee.Ename,
                Plstx: oSelectedEmployee.Plstx || oSelectedEmployee.Plans,
                Orgtx: oSelectedEmployee.Orgtx || oSelectedEmployee.Orgeh,
                Plans: oSelectedEmployee.Plans,
                Orgeh: oSelectedEmployee.Orgeh,
                Stell: oSelectedEmployee.Stell,
              });
              oViewModel.setProperty("/selectedEmployees", aSelectedEmployees);
              this._sweetToast(this.getText("EMPLOYEE_ADDED_SUCCESS"), "S");
            } else {
              this._sweetToast(this.getText("EMPLOYEE_ALREADY_ADDED"), "W");
            }
          }

          // Dialog'u kapat ve filtreleri temizle
          oEvent.getSource().getBinding("items").filter([]);
          oEvent.getSource().getBinding("items").refresh();
          // setRememberSelections removed - not applicable for regular Dialog
        },
        onNoPositionSelected: function (oEvent) {
          this.onResetPosition();
        },
        onPositionValueRequest: function (oEvent) {
          debugger;
          var oThis = this;
          var oViewModel = this.getModel("employeeRequestView");
          var sErfrs = oViewModel.getProperty("/request/Erfrs");

          // if (
          //   sErfrs === "" ||
          //   sErfrs === "0" ||
          //   sErfrs === null ||
          //   sErfrs === undefined
          // ) {
          //   this._callMessageToast(
          //     this.getText("SELECT_REQUEST_REASON_FIRST"),
          //     "E"
          //   );
          //   return;
          // }
          var _doCallDialog = function () {
            oThis._positionValueHelpDialog = sap.ui.xmlfragment(
              "com.bmc.hcm.drf.zhcmuxdrf.fragment.PositionSearch",
              oThis
            );
            oThis.getView().addDependent(oThis._positionValueHelpDialog);
            oThis._positionValueHelpDialog.open();
          };

          this._refreshPositionUsed(_doCallDialog);
        },
        onPositionTreeToggled: function (oEvent) {
          var oViewModel = this.getModel("employeeRequestView");
          oViewModel.setProperty("/positionHelp/enableAdd", false);
          this._positionSelected = null;
          var oTreeOriginal =
            this.byId("idPositionTreeOriginal") ||
            sap.ui.getCore().byId("idPositionTreeOriginal");
          var oTreeProxy =
            this.byId("idPositionTreeProxy") ||
            sap.ui.getCore().byId("idPositionTreeProxy");
          try {
            if (oTreeOriginal) oTreeOriginal.clearSelection();
          } catch (oEx) {
            jQuery.sap.log.error("Tree clear failed");
          }
          try {
            if (oTreeProxy) oTreeProxy.clearSelection();
          } catch (oEx) {
            jQuery.sap.log.error("Tree clear failed");
          }
        },
        
        /**
         * Formatter for action button visibility
         * @param {boolean} bDisplayMode - Whether in display mode
         * @param {string} sDrfsf - Status field
         * @returns {boolean} - Whether button should be visible
         */
        formatActionButtonVisibility: function(bDisplayMode, sDrfsf) {
          if (bDisplayMode) {
            return false;
          }
          // Call the existing formatter if needed
          return this.onCheckActionAvailable ? this.onCheckActionAvailable(sDrfsf) : true;
        },
        
        /**
         * Formatter for Rendc input enabled state
         * @param {boolean} bDisplayMode - Whether in display mode
         * @param {string} sRenwl - Renewal value ("1" means renewal required)
         * @returns {boolean} - Whether Rendc input should be enabled
         */
        formatRendcEnabled: function(bDisplayMode, sRenwl) {
          // If in display mode, always disabled
          if (bDisplayMode) {
            return false;
          }
          // If Renwl is "1", Rendc should be disabled (not editable)
          if (sRenwl === "1" || sRenwl === 1) {
            return false;
          }
          // Otherwise enabled
          return true;
        },
        onPositionRowSelected: function (oEvent) {
          var oContext = oEvent.getParameters("rowContext");
          var oViewModel = this.getModel("employeeRequestView");
          var oSource = oEvent.getSource();
          var aPositionUsed = oViewModel.getProperty("/usedPositionList");

          var oPosition = null;
          try {
            var sIndices = oSource.getSelectedIndices().length;
            if (sIndices === 0) {
              oSource.clearSelection();
              oViewModel.setProperty("/positionHelp/enableAdd", false);
              this._positionSelected = null;
              return;
            } else if (sIndices > 1) {
              oSource.clearSelection();
              oViewModel.setProperty("/positionHelp/enableAdd", false);
              this._sweetToast("Sadece bir pozisyon seçiniz", "W");
              this._positionSelected = null;
              return;
            }
            oPosition = oViewModel.getProperty(oContext.rowContext.sPath);
            this._positionHelpTree = oEvent.getSource();
            this._positionSelected = null;

            if (oPosition.Otype === "S") {
              var oUsed = _.find(aPositionUsed, ["Plans", oPosition.Objid]);
              if (oUsed) {
                oSource.clearSelection();
                this._positionSelected = null;
                MessageBox.warning(
                  this.getText("POSITION_SELECTED_BEFORE", [
                    oUsed.Plans,
                    oUsed.Plstx,
                    oUsed.Rqowe,
                    oUsed.Erfno,
                  ])
                );
                return;
              } else {
                if (this._checkPositionReasonConsistency(oPosition)) {
                  this._positionSelected = oPosition;
                  oViewModel.setProperty(
                    "/positionHelp/enableAdd",
                    oPosition.Otype === "S" ? true : false
                  );
                } else {
                  oSource.clearSelection();
                  this._positionSelected = null;
                }
              }
            } else {
              oSource.clearSelection();
              this._sweetToast("Sadece pozisyon ekleyebilirsiniz", "W");
            }
          } catch (oErr) {
            this._positionSelected = null;
            oViewModel.setProperty("/positionHelp/enableAdd", false);
          }
        },
        onPositionAdd: function (oEvent) {
          var oViewModel = this.getModel("employeeRequestView");

          oViewModel.setProperty(
            "/request/Plans",
            this._positionSelected.Objid
          );
          oViewModel.setProperty(
            "/request/Plstx",
            this._positionSelected.Stext
          );
          oViewModel.setProperty(
            "/request/Stell",
            this._positionSelected.ObjidR3
          );
          oViewModel.setProperty(
            "/request/Stetx",
            this._positionSelected.StextR3
          );
          oViewModel.setProperty(
            "/request/Orgeh",
            this._positionSelected.ObjidR2
          );
          oViewModel.setProperty(
            "/request/Orgtx",
            this._positionSelected.StextR2
          );
          oViewModel.setProperty(
            "/request/Hrcomp",
            this._positionSelected.Hrcomp
          );

          this._positionValueHelpDialog.close();
          this._positionHelpTree.clearSelection();
        },

        onDialogClosed: function (oEvent) {
          oEvent.getSource().destroy();
        },

        onReasonChanged: function (oEvent) {
          var oViewModel = this.getModel("employeeRequestView");
          var sErfrs = oViewModel.getProperty("/request/Erfrs");
          // if (sErfrs === "4") {
          //   oViewModel.setProperty("/request/Nopln", true);
          // } else {
          //   oViewModel.setProperty("/request/Nopln", false);
          // }
          // oViewModel.setProperty("/request/Plaft", "");
          // oViewModel.setProperty("/request/Plans", "00000000");
          // oViewModel.setProperty("/request/Plstx", "");
          // oViewModel.setProperty("/request/Plaft", "");
          // oViewModel.setProperty("/request/Stell", "00000000");
          // oViewModel.setProperty("/request/Stetx", "");
          // oViewModel.setProperty("/request/Orgeh", "00000000");
          // oViewModel.setProperty("/request/Orgtx", "");
          // oViewModel.setProperty("/request/Hrcomp", "");
          // oViewModel.setProperty("/request/Erfct", "1");
        },

        onCancelPositionAdd: function (oEvent) {
          this._positionValueHelpDialog.close();
          if (this._positionHelpTree) {
            this._positionHelpTree.clearSelection();
            this._positionSelected = null;
          }
        },
        onOrganizationTreeToggled: function (oEvent) {
          var oViewModel = this.getModel("employeeRequestView");
          oViewModel.setProperty("/organizationHelp/enableAdd", false);
          this._organizationSelected = null;
          var oTreeOriginal =
            this.byId("idOrganizationTreeOriginal") ||
            sap.ui.getCore().byId("idOrganizationTreeOriginal");
          var oTreeProxy =
            this.byId("idOrganizationTreeProxy") ||
            sap.ui.getCore().byId("idOrganizationTreeProxy");
          try {
            if (oTreeOriginal) oTreeOriginal.clearSelection();
          } catch (oEx) {
            jQuery.sap.log.error("Tree clear failed");
          }
          try {
            if (oTreeProxy) oTreeProxy.clearSelection();
          } catch (oEx) {
            jQuery.sap.log.error("Tree clear failed");
          }
        },
        onVirtualCompanyRequest: function (oEvent) {
          if (this._organizationValueHelpDialog) {
            this._organizationValueHelpDialog.destroy();
            this._organizationValueHelpDialog = null;
          }

          if (!this._organizationValueHelpDialog) {
            this._organizationValueHelpDialog = sap.ui.xmlfragment(
              "com.bmc.hcm.erf.fragment.VirtualCompanySearch",
              this
            );
            this.getView().addDependent(this._organizationValueHelpDialog);
          }

          this._organizationValueHelpDialog.open();
        },
        onOrganizationValueRequest: function (oEvent) {
          if (this._organizationValueHelpDialog) {
            this._organizationValueHelpDialog.destroy();
            this._organizationValueHelpDialog = null;
          }
          if (!this._organizationValueHelpDialog) {
            this._organizationValueHelpDialog = sap.ui.xmlfragment(
              "com.bmc.hcm.erf.fragment.OrganizationSearch",
              this
            );
            this.getView().addDependent(this._organizationValueHelpDialog);
          }
          this._organizationValueHelpDialog.open();
        },
        onOrganizationRowSelected: function (oEvent) {
          var oContext = oEvent.getParameters("rowContext");
          var oViewModel = this.getModel("employeeRequestView");

          var oOrganization = null;
          try {
            oOrganization = oViewModel.getProperty(oContext.rowContext.sPath);
            this._organizationHelpTree = oEvent.getSource();
            this._organizationSelected = null;

            if (oOrganization.Otype === "O") {
              this._organizationSelected = oOrganization;
            }

            oViewModel.setProperty(
              "/organizationHelp/enableAdd",
              oOrganization.Otype === "O" ? true : false
            );
          } catch (oErr) {
            oOrganization = null;
            oViewModel.setProperty("/organizationHelp/enableAdd", false);
          }
        },

        onVirtualCompanyAdd: function (oEvent) {
          var oViewModel = this.getModel("employeeRequestView");

          // oViewModel.setProperty("/request/Orgeh", this._organizationSelected.Objid);
          oViewModel.setProperty(
            "/request/Hrcomp",
            this._organizationSelected.Stext
          );

          this._organizationValueHelpDialog.close();
          this._organizationHelpTree.clearSelection();
        },

        onOrganizationAdd: function (oEvent) {
          var oViewModel = this.getModel("employeeRequestView");

          oViewModel.setProperty(
            "/request/Orgeh",
            this._organizationSelected.Objid
          );
          oViewModel.setProperty(
            "/request/Orgtx",
            this._organizationSelected.Stext
          );

          this._organizationValueHelpDialog.close();
          this._organizationHelpTree.clearSelection();
        },
        onCancelOrganizationAdd: function (oEvent) {
          this._organizationValueHelpDialog.close();
          if (this._organizationValueHelpDialog) {
            this._organizationHelpTree.clearSelection();
            this._organizationSelected = null;
          }
        },

        onJobValueRequest: function (oEvent) {
          if (!this._jobValueHelpDialog) {
            this._jobValueHelpDialog = sap.ui.xmlfragment(
              "com.bmc.hcm.erf.fragment.JobSearch",
              this
            );
            this.getView().addDependent(this._jobValueHelpDialog);
          }
          this._jobValueHelpDialog.setRememberSelections(false);
          this._jobValueHelpDialog.open();
        },
        onJobSearch: function (oEvent) {
          var sValue = oEvent.getParameter("value");
          var aFilters = [];

          aFilters.push(new Filter("Otype", FilterOperator.EQ, "C"));
          aFilters.push(new Filter("Stext", FilterOperator.EQ, sValue));

          oEvent.getSource().getBinding("items").filter(aFilters);
        },
        onJobSelect: function (oEvent) {
          var oSelectedObject = oEvent
            .getParameter("selectedContexts")[0]
            .getObject();
          var oViewModel = this.getModel("employeeRequestView");

          if (oSelectedObject) {
            oViewModel.setProperty("/request/Stell", oSelectedObject.Objid);
            oViewModel.setProperty("/request/Stetx", oSelectedObject.Stext);
          }
          oEvent
            .getSource()
            .getBinding("items")
            .filter(new Filter("Otype", FilterOperator.EQ, "C"));
          oEvent.getSource().getBinding("items").refresh();
          this._jobValueHelpDialog.setRememberSelections(false);
        },

        onOpenFormActions: function (oEvent) {
          debugger;
          var oSource = oEvent.getSource();
          if (!this._formActions) {
            this._formActions = sap.ui.xmlfragment(
              "com.bmc.hcm.drf.zhcmuxdrf.fragment.FormActions",
              this
            );
            this.getView().addDependent(this._formActions);
          }
          this._formActions.openBy(oSource);
        },

        onFormActionSelected: function (oEvent) {
          debugger;
          var oSource = oEvent.getSource();
          var oViewModel = this.getModel("employeeRequestView");
          var oFormData = oViewModel.getProperty("/request");
          var aFormActions = oViewModel.getProperty("/formActions");
          var sButtonId = oSource.data("buttonId");
          var aButtonProp = _.filter(aFormActions, {
            Drfbt: sButtonId,
          });
          var sStatusChange = false;
          var oStatusChange = {};

          try {
            oFormData.Actio = aButtonProp[0].Drfbt;
            oFormData.DrfstN = aButtonProp[0].DrfstN;
            oFormData.DrfssN = aButtonProp[0].DrfssN;
            oViewModel.setProperty("/request", oFormData);
            // if (!this._validateForm()) {
            //   return;
            // }
            switch (aButtonProp[0].Drfbs) {
              case "S": //Save
                this._updateRequest(
                  oFormData,
                  this._sNewRequest,
                  true,
                  false,
                  History
                );
                return;
              case "A": //Approve
                oStatusChange.statusChangeNoteRequired = false;
                oStatusChange.statusChangePlaceholder = this.getText(
                  "ENTER_STATUS_CHANGE_REASON"
                );
                sStatusChange = true;
                break;
              case "B": //Back
                oStatusChange.statusChangeNoteRequired = true;
                oStatusChange.statusChangePlaceholder = this.getText(
                  "ENTER_REVISION_REASON"
                );
                sStatusChange = true;
                break;
              case "R": //Reject
                oStatusChange.statusChangeNoteRequired = true;
                oStatusChange.statusChangePlaceholder = this.getText(
                  "ENTER_REJECTION_REASON"
                );
                sStatusChange = true;
                break;
              default:
                return;
            }

            if (sStatusChange) {
              oStatusChange.statusChangeNote = "";
              oStatusChange.beginButtonText = aButtonProp[0].Drfbx;
              oStatusChange.beginButtonType = aButtonProp[0].Drfbs;
              oStatusChange.beginButtonIcon = aButtonProp[0].Drfbi;
              if (this._sNewRequest) {
                oStatusChange.informationNote = this.getText(
                  "NEW_EMPLOYEE_REQUEST_INFORMATION_NOTE"
                );
              } else {
                oStatusChange.informationNote = this.getText(
                  "STATUS_CHANGE_NOTE",
                  aButtonProp[0].DrfsyN === ""
                    ? aButtonProp[0].DrfsxN
                    : aButtonProp[0].DrfsxN + "-" + aButtonProp[0].DrfsyN
                );
              }

              oViewModel.setProperty("/statusChangeDialog", oStatusChange);

              if (
                !this._statusChangeDialog ||
                this._statusChangeDialog.bIsDestroyed
              ) {
                this._statusChangeDialog = sap.ui.xmlfragment(
                  "com.bmc.hcm.drf.zhcmuxdrf.fragment.StatusChange",
                  this
                );
                this.getView().addDependent(this._statusChangeDialog, this);
              }
              this._statusChangeDialog.open();
            }
          } catch (oErr) {
            jQuery.sap.log.error("Form action failed!");
          }
        },

        onStatusChangeConfirmed: function (oEvent) {
          debugger;
          var oViewModel = this.getModel("employeeRequestView");
          var oFormData = oViewModel.getProperty("/request");
          var oStatusChange = oViewModel.getProperty("/statusChangeDialog");

          this._statusChangeDialog.close();

          oFormData.Stcnt = oStatusChange.statusChangeNote;

          this._updateRequest(
            oFormData,
            this._sNewRequest,
            true,
            true,
            History
          );
        },
        onStatusChangeCancelled: function (oEvent) {
          this._statusChangeDialog.close();
        },
        onStatusChangeDialogClosed: function (oEvent) {
          this._statusChangeDialog.destroy();
        },
        onCreateInternalJobPosting: function (oEvent) {
          var oViewModel = this.getModel("employeeRequestView");
          var oFormData = oViewModel.getProperty("/request");

          this.getRouter().navTo("internaljobposting", {
            Erfid: oFormData.Erfid,
          });
        },
        onCreateExternalJobPosting: function (oEvent) {
          var oViewModel = this.getModel("employeeRequestView");
          var oFormData = oViewModel.getProperty("/request");

          this.getRouter().navTo("externaljobposting", {
            Erfid: oFormData.Erfid,
          });
        },

        onApplicantPressed: function (oEvent) {
          var oSource = oEvent.getSource();
          this._currentCandidate = oSource.data();
          if (!this._candidateActionSheet) {
            this._candidateActionSheet = sap.ui.xmlfragment(
              "com.bmc.hcm.erf.fragment.CandidateActions",
              this
            );
            this.getView().addDependent(this._candidateActionSheet);
          }

          this._candidateActionSheet.openBy(oSource);
        },
        onCandidateResume: function (oEvent) {
          var oViewModel = this.getModel("employeeRequestView");
          var sCandidatePath = null;
          try {
            sCandidatePath = oEvent
              .getSource()
              .getParent()
              .getParent()
              .getParent()
              .getBindingContextPath();
          } catch (oEx1) {
            try {
              sCandidatePath = oEvent
                .getSource()
                .getParent()
                .getBindingInfo("cardHeaderTitle").binding.oContext.sPath;
            } catch (oEx2) {
              jQuery.sap.log.error("Candidate not read!");
              return;
            }
          }

          var oCurrentCandidate = oViewModel.getProperty(sCandidatePath);
          var sPath =
            "/sap/opu/odata/sap/ZHCM_RECRUITMENT_SRV/CandidateResumeSet(Tclas='" +
            oCurrentCandidate.Tclas +
            "',Pernr='" +
            oCurrentCandidate.Pernr +
            "')/$value";
          var sTitle = this.getText("CANDIDATE_RESUME", [
            oCurrentCandidate.Ename,
            this.getText(
              oCurrentCandidate.Tclas === "A"
                ? "INTERNAL_APPLICANT"
                : "EXTERNAL_APPLICANT"
            ),
          ]);

          this._callPDFViewer(sPath, sTitle);
        },

        onCandidateEdit: function (oEvent) {
          var oModel = this.getModel();
          var oViewModel = this.getModel("employeeRequestView");
          var oThis = this;
          var sCandidatePath = null;
          try {
            sCandidatePath = oEvent
              .getSource()
              .getParent()
              .getParent()
              .getParent()
              .getBindingContextPath();
          } catch (oEx1) {
            try {
              sCandidatePath = oEvent
                .getSource()
                .getParent()
                .getBindingInfo("cardHeaderTitle").binding.oContext.sPath;
            } catch (oEx2) {
              jQuery.sap.log.error("Candidate not read!");
              return;
            }
          }
          var oCurrentCandidate = oViewModel.getProperty(sCandidatePath);

          SharedData.setCandidateProcess({
            Drfid: oCurrentCandidate.Drfid,
            Tclas: oCurrentCandidate.Tclas,
            Pernr: oCurrentCandidate.Pernr,
          });

          this.getRouter().navTo("candidateprocess");
        },

        onCandidateDelete: function (oEvent) {
          var oModel = this.getModel();
          var oViewModel = this.getModel("employeeRequestView");
          var oThis = this;
          var sCandidatePath = null;
          try {
            sCandidatePath = oEvent
              .getSource()
              .getParent()
              .getParent()
              .getParent()
              .getBindingContextPath();
          } catch (oEx1) {
            try {
              sCandidatePath = oEvent
                .getSource()
                .getParent()
                .getBindingInfo("cardHeaderTitle").binding.oContext.sPath;
            } catch (oEx2) {
              jQuery.sap.log.error("Candidate not read!");
              return;
            }
          }
          var oCurrentCandidate = oViewModel.getProperty(sCandidatePath);

          var _doDelete = function () {
            var sPath = oModel.createKey("/CandidateProcessSet", {
              Erfid: oCurrentCandidate.Erfid,
              Tclas: oCurrentCandidate.Tclas,
              Pernr: oCurrentCandidate.Pernr,
            });

            oThis._openBusyFragment("CANDIDATE_BEING_UNASSIGNED");

            oModel.remove(sPath, {
              success: function () {
                oThis._closeBusyFragment();
                oThis._sweetToast(
                  oThis.getText("CANDIDATE_DELETED"),
                  "S"
                );
                oThis._getCandidateList(oCurrentCandidate.Erfid);
              },
              error: function () {
                oThis._closeBusyFragment();
              },
            });
          };

          var oBeginButtonProp = {
            text: this.getText("UNASSIGN_CANDIDATE"),
            type: "Reject",
            icon: "sap-icon://disconnected",
            onPressed: _doDelete,
          };

          var aParam = [];

          aParam[0] =
            oCurrentCandidate.Tclas === "A"
              ? this.getText("INTERNAL_APPLICANT")
              : this.getText("EXTERNAL_APPLICANT");
          aParam[1] = oCurrentCandidate.Ename;
          this._callConfirmDialog(
            this.getText("CONFIRMATION_REQUIRED"),
            "Message",
            "Warning",
            this.getText("CANDIDATE_UNASSIGN_CONFIRMATION", aParam),
            oBeginButtonProp,
            null
          ).open();
        },
        onInternalCandidateAdd: function (oEvent) {
          var oRequest = SharedData.getCurrentRequest();
          var aFilters = [];
          if (!this._oInternalCandidateValueHelpDialog) {
            this._oInternalCandidateValueHelpDialog = sap.ui.xmlfragment(
              "com.bmc.hcm.erf.fragment.InternalCandidateSearch",
              this
            );
            this.getView().addDependent(
              this._oInternalCandidateValueHelpDialog
            );
          }
          aFilters.push(new Filter("Erfid", FilterOperator.EQ, oRequest.Erfid));
          this._oInternalCandidateValueHelpDialog
            .getBinding("items")
            .filter(aFilters);
          this._oInternalCandidateValueHelpDialog.getBinding("items").refresh();
          this._oInternalCandidateValueHelpDialog.setRememberSelections(false);
          this._oInternalCandidateValueHelpDialog.open();
        },
        onPerformInternalCandidateSearch: function (oEvent) {
          var oRequest = SharedData.getCurrentRequest();
          var sValue = oEvent.getParameter("value");
          var aFilters = [];

          aFilters.push(new Filter("Drfid", FilterOperator.EQ, oRequest.Drfid));
          aFilters.push(new Filter("Ename", FilterOperator.EQ, sValue));

          oEvent.getSource().getBinding("items").filter(aFilters);
        },
        onConfirmInternalCandidateSelection: function (oEvent) {
          var aSelectedContext = oEvent.getParameter("selectedContexts");
          var oThis = this;
          var oModel = this.getModel();
          var oRequest = SharedData.getCurrentRequest();
          var oSelectedObject = {};

          var _doAdd = function () {
            var oCandidate = {
              Erfid: oRequest.Erfid,
              Tclas: "A",
              Pernr: oSelectedObject.Pernr,
              Actio: "ASSIGN",
              CanstN: "010",
              CanssN: "000",
            };
            oThis._openBusyFragment("CANDIDATE_BEING_ASSIGNED");
            oThis._oInternalCandidateValueHelpDialog
              .getBinding("items")
              .filter();
            oThis._oInternalCandidateValueHelpDialog
              .getBinding("items")
              .refresh();
            oThis._oInternalCandidateValueHelpDialog.setRememberSelections(
              false
            );
            oModel.create("/CandidateProcessSet", oCandidate, {
              success: function (oData, oResponse) {
                oThis._closeBusyFragment();
                oThis._sweetToast(oThis.getText("CANDIDATE_ADDED"), "S");
                oThis._getCandidateList(oRequest.Erfid);
              },
              error: function () {
                oThis._closeBusyFragment();
              },
            });
          };

          try {
            oSelectedObject = aSelectedContext[0].getObject();
          } catch (oEx) {
            jQuery.sap.log.error(oEx);
            return;
          }

          if (oSelectedObject.Isass) {
            oThis._sweetToast(
              oThis.getText("ALREADY_ADDED", [oSelectedObject.Ename]),
              "W"
            );
            return;
          } else {
            var oBeginButtonProp = {
              text: this.getText("ASSIGN_CANDIDATE"),
              type: "Accept",
              icon: "sap-icon://add-employee",
              onPressed: _doAdd,
            };

            this._callConfirmDialog(
              this.getText("CONFIRMATION_REQUIRED"),
              "Message",
              "Success",
              this.getText("INTERNAL_CANDIDATE_ASSIGN_CONFIRMATION", [
                oSelectedObject.Ename,
              ]),
              oBeginButtonProp,
              null
            ).open();
          }
        },
        onCancelInternalCandidateSelection: function (oEvent) {
          oEvent.getSource().getBinding("items").filter();
          oEvent.getSource().getBinding("items").refresh();
          this._oInternalCandidateValueHelpDialog.setRememberSelections(false);
        },
        onApplicantAdd: function (oEvent) {
          if (!this._applicantValueHelpDialog) {
            this._applicantValueHelpDialog = sap.ui.xmlfragment(
              "com.bmc.hcm.erf.fragment.CandidateSearch",
              this
            );
            this.getView().addDependent(this._applicantValueHelpDialog);
          }
          //this._applicantValueHelpDialog.setRememberSelections(false);
          var oListModel = this.getModel("candidateListModel");
          oListModel.setProperty(
            "/CandidateActionSettings/ActionsColumnVisible",
            false
          );
          oListModel.setProperty(
            "/CandidateActionSettings/SelectColumnVisible",
            true
          );
          this._applicantValueHelpDialog.open();
        },
        onCloseCandidateSearch: function (oEvent) {
          this._applicantValueHelpDialog.close();
        },
        onCandidateSelected: function (oEvent) {
          var oModel = this.getModel();
          var oSelectedObject = oModel.getProperty(
            oEvent.getSource().getBindingContext().sPath
          );
          var oRequest = SharedData.getCurrentRequest();
          var oThis = this;
          var oViewModel = this.getModel("employeeRequestView");
          var aPrev = oViewModel.getProperty("candidateList");

          var oExist = _.find(aPrev, {
            Tclas: "B",
            Pernr: oSelectedObject.Pernr,
          });

          if (oExist) {
            oThis._sweetToast(
              oThis.getText("ALREADY_ADDED", [oSelectedObject.Ename]),
              "W"
            );
            return;
          }

          var _doAdd = function () {
            var oCandidate = {
              Erfid: oRequest.Erfid,
              Tclas: "B",
              Pernr: oSelectedObject.Pernr,
              Actio: "ASSIGN",
              CanstN: "010",
              CanssN: "000",
            };
            oThis._applicantValueHelpDialog.close();
            oThis._openBusyFragment("CANDIDATE_BEING_ASSIGNED");

            oModel.create("/CandidateProcessSet", oCandidate, {
              success: function (oData, oResponse) {
                oThis._closeBusyFragment();
                oThis._sweetToast(oThis.getText("CANDIDATE_ADDED"), "S");
                oThis._getCandidateList(oRequest.Erfid);
              },
              error: function () {
                oThis._closeBusyFragment();
              },
            });
          };

          var oBeginButtonProp = {
            text: this.getText("ASSIGN_CANDIDATE"),
            type: "Accept",
            icon: "sap-icon://add-employee",
            onPressed: _doAdd,
          };

          this._callConfirmDialog(
            this.getText("CONFIRMATION_REQUIRED"),
            "Message",
            "Success",
            this.getText("CANDIDATE_ASSIGN_CONFIRMATION", [
              oSelectedObject.Ename,
            ]),
            oBeginButtonProp,
            null
          ).open();

          oEvent.getSource().getBinding("items").filter();
          oEvent.getSource().getBinding("items").refresh();
          this._applicantValueHelpDialog.setRememberSelections(false);
        },
        onInternalCandidateResumePrintOut: function (oEvent) {
          var oButton = oEvent.getSource();
          var oBindingContext = oButton.getBindingContext();
          var oBindingObject = oBindingContext.getObject();
          var sPath =
            "/sap/opu/odata/sap/ZHCM_RECRUITMENT_SRV/CandidateResumeSet(Tclas='A'," +
            "Pernr='" +
            oBindingObject.Pernr +
            "')/$value";
          var sTitle = this.getText("CANDIDATE_RESUME", [
            oBindingObject.Ename,
            this.getText("INTERNAL_APPLICANT"),
          ]);

          this._callPDFViewer(sPath, sTitle);
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */
        /**
         * Initiate models
         * @function
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */    
        _initiateModels: function () {
          var oViewModel = this.getModel("employeeRequestView");
          
          oViewModel.setProperty("/request", null);
          oViewModel.setProperty("/formActions", []);
          oViewModel.setProperty("/formHistory", []);
          oViewModel.setProperty("/statusChangeDialog", null);
          oViewModel.setProperty("/requestOwner", null);
          oViewModel.setProperty("/positionList", null);
          oViewModel.setProperty("/virtualCompanyList", null);
          oViewModel.setProperty("/organizationList", null);
          oViewModel.setProperty("/positionListProxy", null);
          oViewModel.setProperty("/organizationListProxy", null);
          oViewModel.setProperty("/virtualCompanyListProxy", null);
          oViewModel.setProperty("/usedPositionList", null);

          SharedData.setCurrentRequest(null);

          for (var sPropertyName in this._formFragments) {
            if (!this._formFragments.hasOwnProperty(sPropertyName)) {
              return;
            }

            this._formFragments[sPropertyName].destroy();
            this._formFragments[sPropertyName] = null;
          }
        },
        _checkPositionReasonConsistency: function (oPosition) {
          var oViewModel = this.getModel("employeeRequestView");
          var sErfrs = oViewModel.getProperty("/request/Erfrs");

          if (
            sErfrs === "1" &&
            oPosition.OtypeR1 === "P" &&
            !(
              oPosition.ObjidR1 === "00000000" ||
              oPosition.ObjidR1 === null ||
              oPosition.ObjidR1 === undefined ||
              oPosition.ObjidR1 === ""
            )
          ) {
            MessageBox.error(this.getText("SELECT_EMPTY_POSITION"));
            return false;
          } else {
            return true;
          }
        },
        _loadRequestDataAndNavigate: function (sDrfid) {
          debugger;
          var oModel = this.getModel();
          var oViewModel = this.getModel("employeeRequestView");
          var that = this;

          var sPath = "/DocumentRequestFormSet('" + sDrfid + "')";
          var sExpand =
            "DocumentRequestEmployeeSet" +
            ",DocumentRequestEmployeeSet/EmployeeAttachmentSet"
            ",DocumentRequestHistorySet" +
            ",DocumentRequestPrintOut";

          oModel.read(sPath, {
            urlParameters: {
              $expand: sExpand,
            },
            success: function (oData) {
              oViewModel.setProperty("/request", oData);
              oViewModel.setProperty(
                "/dataList/DocumentRequestEmployeeSet",
                _.cloneDeep(oData.DocumentRequestEmployeeSet.results)
              );
              that.getRouter().navTo("employeerequestedit", {
                Drfid: sDrfid,
              });
            },
            error: function (oError) {
              oViewModel.setProperty("/busy", false);

              // Show error message
              that._sweetToast("Error loading request data", "E");

              // Navigate anyway with original data
              that.getRouter().navTo(sRouteName, {
                Drfid: sDrfid,
              });
            },
          });
        },
        /**
         * Pattern matched
         * @function
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */
        _onNewRequestMatched: function (oEvent) {
          this._sNewRequest = true;
          this._setChangeListeners();
          
          this._updateApplicationSettings();
          
          this._getRequestDefaults();
          this._getManagerHierarchy();
        },
        _onRequestMatched: function (oEvent) {
          debugger;
          var sDrfid = oEvent.getParameter("arguments").Drfid;
          var oApplicationSettings = SharedData.getApplicationSettings();
          var oViewModel = this.getModel("employeeRequestView");
          this._sDrfid = sDrfid;
          this._sNewRequest = false;
          this._setChangeListeners();
          
          this._updateApplicationSettings();
          
          // this._getRequest(sDrfid);
          this._loadRequestDataAndNavigate(sDrfid);
          this._getFormActions(sDrfid);
          this._getFormHistory(sDrfid);
          this._getManagerHierarchy();
          this._getCandidateList(sDrfid);
          this.getModel("employeeRequestView")
          .bindProperty("/request/Drfbl")
          .attachChange(
            function (oEvent) {
              var sDrfbn = oEvent.getSource().getValue();
              this._handleConryChange(sDrfbn);
            }.bind(this)
          );
        },
        _onCandidateListMatched: function (oEvent) {
          var oListModel = this.getModel("candidateListModel");
          oListModel.setProperty(
            "/CandidateActionSettings/ActionsColumnVisible",
            true
          );
          oListModel.setProperty(
            "/CandidateActionSettings/SelectColumnVisible",
            false
          );
        },

        _setChangeListeners: function () {
          var oViewModel = this.getModel("employeeRequestView");
          var oThis = this;
          var oRequestModel = new sap.ui.model.Binding(
            oViewModel,
            "/",
            oViewModel.getContext("/request")
          );
          oRequestModel.attachChange(function (oEvent) {
            oThis._clearValidationTraces();
          }, this);
          // oViewModel.setProperty("/request", null);
        },

        /**
         * Gets the default request
         * @function
         * @param sFragmentName type string, name of the fragment
         * @private
         */
        _getFragment: function (sFragmentName) {
          var oFormFragment = this._formFragments[sFragmentName];

          if (oFormFragment) {
            return oFormFragment;
          }

          oFormFragment = sap.ui.xmlfragment(
            "com.bmc.hcm.drf.zhcmuxdrf.fragment." + sFragmentName,
            this
          );

          this._formFragments[sFragmentName] = oFormFragment;
          return this._formFragments[sFragmentName];
        },

        _getRequest: function (sErfid) {
          var oModel = this.getModel();
          var oViewModel = this.getModel("employeeRequestView");
          var oThis = this;
          var oChangeFragment = this._getFragment("EmployeeRequestChange");
          var oDisplayFragment = this._getFragment("EmployeeRequestDisplay");
          var sPath = oModel.createKey("/EmployeeRequestFormSet", {
            Erfid: sErfid,
          });
          var oRequest = SharedData.getCurrentRequest();
          var sForceRefresh = SharedData.getForceRefresh();
          var oSettings = SharedData.getApplicationSettings();
          try {
            var oFilter = this.byId("idRequestInfoFilter");
            if (oFilter) {
              oFilter.removeAllContent();
              if (oSettings.CallerRole !== "PNDAPP") {
                if (
                  oSettings.Edit ||
                  oRequest.Erfso === "H03" ||
                  oRequest.Erfso === "H06"
                ) {
                  oFilter.insertContent(oChangeFragment, 0);
                } else {
                  oFilter.insertContent(oDisplayFragment, 0);
                }
              } else {
                oFilter.insertContent(oDisplayFragment, 0);
              }
            }
          } catch (ex) {
            jQuery.sap.log.error("Fragment error:", ex);
          }

          if (sForceRefresh) {
            oRequest = null;
            SharedData.setForceRefresh(false);
          }
          if (oRequest) {
            oViewModel.setProperty("/request", oRequest);
            this._getManagerData();
          } else {
            oViewModel.setProperty("/busy", true);
            oModel.read(sPath, {
              method: "GET",
              success: function (oData, oResponse) {
                oViewModel.setProperty("/busy", false);
                oViewModel.setProperty("/request", oData);
                SharedData.setCurrentRequest(_.cloneDeep(oData));
                oThis._getManagerData();
                oViewModel.refresh(true);
              },
              error: function (oError) {
                oViewModel.setProperty("/busy", false);
              },
            });
          }
        },

        _getRequestDefaults: function () {
          var oModel = this.getModel();
          var oViewModel = this.getModel("employeeRequestView");
          var oRequestDefaults = oViewModel.getProperty("/requestDefaults");
          var oButton = this.byId("idFormActionsButton");

          // if (oRequestDefaults) {
          //   oRequestDefaults.ErfrqTr =
          //     "Erkek adaylar için askerlik hizmetini tamamlamış olmak.";
          //   oViewModel.setProperty("/request", _.cloneDeep(oRequestDefaults));
          // } else {
          //   oViewModel.setProperty("/busy", true);
          //   oModel.callFunction("/GetNewEmpReqDefaults", {
          //     method: "GET",
          //     success: function (oData, oResponse) {
          //       oViewModel.setProperty("/busy", false);
          //       oData.ErfrqTr =
          //         "Erkek adaylar için askerlik hizmetini tamamlamış olmak.";
          //       oViewModel.setProperty("/request", _.cloneDeep(oData));
          //       oViewModel.setProperty("/requestDefaults", _.cloneDeep(oData));
          //     },
          //     error: function (oError) {
          //       oViewModel.setProperty("/busy", false);
          //     },
          //   });
          // }
          // oButton.setBusy(true);
          // oButton.setVisible(false);
          // oViewModel.setProperty("/formActions", []);
          oModel.callFunction("/GetNewDocReqDefaultActions", {
            method: "GET",
            success: function (oData, oResponse) {
              oButton.setBusy(false);
              if (oData.results.length > 0) {
                oButton.setVisible(true);
              }
              oViewModel.setProperty("/formActions", oData.results);
            },
            error: function (oError) {
              oButton.setBusy(false);
            },
          });
        },

        _getManagerData: function () {
          var oGenericModel = this.getModel("GenericServices");
          var oViewModel = this.getModel("employeeRequestView");
          var oSharedRequest = SharedData.getCurrentRequest();

          var sPath = oGenericModel.createKey("/EmployeeSearchSet", {
            Pernr: oSharedRequest.Rqowp,
          });

          oGenericModel.read(sPath, {
            method: "GET",
            success: function (oData, oResponse) {
              oViewModel.setProperty("/requestOwner", oData);
            },
            error: function (oError) {
              oViewModel.setProperty("/requestOwner", null);
            },
          });
        },
        _handleConryChange: function (sDrfbn) {
          debugger;
          var oDocComboBox = this.byId("idDocumentNameComboBox");

          if (sDrfbn && oDocComboBox) {
            var aFilters = [new Filter("Selky", FilterOperator.EQ, sDrfbn)];
  
            var oBinding = oDocComboBox.getBinding("items");
            oBinding.filter(aFilters);
         }
        },
        _getManagerHierarchy: function () {
          var oViewModel = this.getModel("employeeRequestView");
          var oPositionList = oViewModel.getProperty("/positionList");
          var oOrganizationList = oViewModel.getProperty("/organizationList");
          var oVirtualCompanyList = oViewModel.getProperty(
            "/virtualCompanyList"
          );
          var oPositionListProxy = oViewModel.getProperty("/positionListProxy");
          var oOrganizationListProxy = oViewModel.getProperty(
            "/organizationListProxy"
          );
          var oVirtualCompanyListProxy = oViewModel.getProperty(
            "/virtualCompanyListProxy"
          );

          if (!oVirtualCompanyList) {
            this._refreshHierarchy("ZMNGVC", "/virtualCompanyList");
            // this._refreshHierarchy("ZMNGOO", "/virtualCompanyList");
          }
          if (!oPositionList) {
            this._refreshHierarchy("ZMNGOOSC", "/positionList");
          }
          if (!oOrganizationList) {
            this._refreshHierarchy("ZMNGOO", "/organizationList");
          }
          if (!oPositionListProxy) {
            this._refreshHierarchy("ZMNVOOSC", "/positionListProxy");
          }
          if (!oOrganizationListProxy) {
            this._refreshHierarchy("ZMNVOO", "/organizationListProxy");
          }
          // if (!oVirtualCompanyListProxy) {
          // 	this._refreshHierarchy("ZMNGVC", "/virtualCompanyListProxy");
          // }
        },
        _refreshPositionUsed: function (oCallBack) {
          debugger;
          var oModel = this.getModel();
          var aFilters = [];
          var oRequest = SharedData.getCurrentRequest();
          var oViewModel = this.getModel("employeeRequestView");
          var oThis = this;

          if (oRequest) {
            aFilters.push(
              new Filter("Erfid", FilterOperator.EQ, oRequest.Erfid)
            );
          }

          oViewModel.setProperty("/usedPositionList", []);
          this._openBusyFragment();
          oModel.read("/UsedPositionSet", {
            filters: aFilters,
            success: function (oData, oResponse) {
              oThis._closeBusyFragment();
              oViewModel.setProperty("/usedPositionList", oData.results);
              oCallBack();
            },
            error: function (oError) {
              oThis._closeBusyFragment();
            },
          });
        },
        _refreshHierarchy: function (sWegid, sPath) {
          var oGenericModel = this.getModel("GenericServices");
          var oViewModel = this.getModel("employeeRequestView");
          var oHierarchy = {
            children: [],
          };
          var oUrlParameters = {};
          var oSharedRequest = SharedData.getCurrentRequest();

          oViewModel.setProperty(sPath, oHierarchy);

          var _generateHierarchy = function (aHierarchy) {
            var aRooto = _.filter(aHierarchy, "Rooto");

            var _getChild = function (oParent) {
              var oLine = oParent;
              oLine.children = [];
              if (oLine.Otype === "O") {
                oLine.children = _.filter(aHierarchy, {
                  Loopc: oParent.Loopc,
                  Pupsq: oParent.Seqnr,
                });
              }

              _.forEach(oLine.children, function (oChild) {
                if (oChild.Otype === "O") {
                  _getChild(oChild);
                }
              });

              if (oParent.Rooto) {
                oHierarchy.children.push(oLine);
              }
            };

            _.forEach(aRooto, function (oRooto) {
              _getChild(oRooto);
            });
            oViewModel.setProperty(sPath, oHierarchy);
          };

          /*Get all position list or org acc to evaluation path*/
          oUrlParameters.Wegid = sWegid;

          if (oSharedRequest) {
            oUrlParameters.Mngun = oSharedRequest.Rqown;
          } else {
            oUrlParameters.Mngun = "";
          }

          oGenericModel.callFunction("/GetManagerHierarchy", {
            method: "GET",
            urlParameters: oUrlParameters,
            success: function (oData, oResponse) {
              _generateHierarchy(oData.results);
            },
            error: function (oError) {
              jQuery.sap.log.error("Manager hierarchy could not be retrieved!");
            },
          });
        },

        // _validateForm: function () {
        //   var oValidator = new FormValidator(this);
        //   var oViewModel = this.getModel("employeeRequestView");
        //   var oFormData = oViewModel.getProperty("/request");
        //   var oFormToValidate =
        //     sap.ui.getCore().byId("idEmployeeRequestForm") ||
        //     this.byId("idEmployeeRequestForm");

        //   if (!oFormData.Extja && !oFormData.Intja) {
        //     this._callMessageToast(this.getText("AT_LEAST_ONE_RESOURCE"), "E");
        //     return false;
        //   }

        //   if (oFormData.Cnted) {
        //     oFormData.Cnted.setHours(9);
        //     oViewModel.setProperty("/request", oFormData);
        //   }
        //   if (oFormToValidate) {
        //     var sResult = oValidator.validate(oFormToValidate);
        //     if (!sResult) {
        //       this._callMessageToast(this.getText("FORM_HAS_ERRORS"), "E");
        //     }
        //     return sResult;
        //   } else {
        //     return true;
        //   }
        // },
        _clearValidationTraces: function () {
          var oValidator = new FormValidator(this);
          var oFormToValidate =
            sap.ui.getCore().byId("idEmployeeRequestForm") ||
            this.byId("idEmployeeRequestForm");
          if (oFormToValidate) {
            oValidator.clearTraces(oFormToValidate);
          }
        },

        _getFormActions: function (sDrfid) {
          var oButton = this.byId("idFormActionsButton");
          var oModel = this.getModel();
          var oViewModel = this.getModel("employeeRequestView");
          var sPath =
            "/DocumentRequestFormSet('" + sDrfid + "')/FormActionsSet";
          var oSettings = SharedData.getApplicationSettings();

          if (oButton) {
            oButton.setBusy(true);
            oButton.setVisible(false);
            oButton.getParent().setVisible(false);
            oViewModel.setProperty("/formActions", []);

            oModel.read(sPath, {
              method: "GET",
              success: function (oData, oResponse) {
                oButton.setBusy(false);
                var aActions = [];
                aActions = oSettings.Edit
                  ? oData.results
                  : _.remove(oData.results, function (oLine) {
                      return oLine.Drfbs !== "S";
                    });

                if (aActions.length > 0) {
                  oButton.setVisible(true);
                  oButton.getParent().setVisible(true);
                }

                oViewModel.setProperty("/formActions", aActions);
              },
              error: function (oError) {
                oButton.setBusy(false);
              },
            });
          }
        },

        _checkJobHigherLevel: function (sStell) {
          var aUpperLevelJobs = SharedData.getUpperLevelJobs();

          var oJob = _.find(aUpperLevelJobs, ["Objid", sStell]);

          return oJob ? true : false;
        },

        _getFormHistory: function (sDrfid) {
          var oModel = this.getModel();
          var oViewModel = this.getModel("employeeRequestView");
          var sPath =
            "/DocumentRequestFormSet('" +
            sDrfid +
            "')/DocumentRequestHistorySet";

          oViewModel.setProperty("/formHistory", []);

          oModel.read(sPath, {
            method: "GET",
            success: function (oData, oResponse) {
              oViewModel.setProperty("/formHistory", oData.results);
            },
            error: function (oError) {
              jQuery.sap.log.error("Form history could not be fetched");
            },
          });
        },

        onRefreshCandidate: function () {
          var oRequest = SharedData.getCurrentRequest();
          this._getCandidateList(oRequest.Erfid);
        },

        _getCandidateList: function (sErfid) {
          var aCandidates = [];
          var oGrid = this.byId("idCandidateListGrid");
          var oViewModel = this.getModel("employeeRequestView");
          var oModel = this.getModel();
          var oRequest = SharedData.getCurrentRequest();
          oViewModel.setProperty("/candidateList", []);
          oViewModel.setProperty("/candidateCount", 0);

          if (oGrid) {
            var sPath =
              "/EmployeeRequestFormSet('" +
              oRequest.Erfid +
              "')/CandidateProcessSet";
            oGrid.setBusy(true);
            oModel.read(sPath, {
              success: function (oData, oResponse) {
                oGrid.setBusy(false);
                aCandidates = oData.results;

                $.each(aCandidates, function (sKey, oCandidate) {
                  oCandidate.chartData = [
                    {
                      data: [oCandidate.Perct, 100 - oCandidate.Perct],
                      backgroundColor:
                        oCandidate.Perct < 33
                          ? ["#ff6384", "#e0e0e0"]
                          : oCandidate.Perct < 66
                          ? ["#e78c07", "#e0e0e0"]
                          : ["#2b7d2b", "#e0e0e0"],
                    },
                  ];
                });
                oViewModel.setProperty("/candidateList", aCandidates);
                oViewModel.setProperty(
                  "/candidateCount",
                  aCandidates.length ? aCandidates.length : 0
                );
                //_formGrid();
              },
              error: function (oError) {
                oGrid.setBusy(false);
              },
            });
          }
          // } //if (oGrid)
        },
        onToggleFilterBar: function () {
          var oViewModel = this.getModel("candidateListModel");
          var sExpanded = oViewModel.getProperty("/FilterBarExpanded");
          oViewModel.setProperty(
            "/FilterBarExpanded",
            sExpanded ? false : true
          );
        },

        _getFilters: function (sExceptCplty) {
          var oViewModel = this.getModel("candidateListModel");
          var oFilter = oViewModel.getProperty("/Filters");
          var aFilters = [];
          if (!sExceptCplty) {
            if (oFilter.Cplty !== "") {
              aFilters.push(
                new Filter("Cplty", FilterOperator.EQ, oFilter.Cplty)
              );
            }
          }
          if (oFilter.Ename !== "") {
            aFilters.push(
              new Filter("Ename", FilterOperator.EQ, oFilter.Ename)
            );
          }
          if (oFilter.Gesch !== "") {
            aFilters.push(
              new Filter("Gesch", FilterOperator.EQ, oFilter.Gesch)
            );
          }
          if (oFilter.Slart !== "") {
            aFilters.push(
              new Filter("Slart", FilterOperator.EQ, oFilter.Slart)
            );
          }
          if (oFilter.Wdart !== "") {
            aFilters.push(
              new Filter("Wdart", FilterOperator.EQ, oFilter.Wdart)
            );
          }
          if (oFilter.Lstcm !== "") {
            aFilters.push(
              new Filter("Lstcm", FilterOperator.EQ, oFilter.Lstcm)
            );
          }
          if (oFilter.Lstps !== "") {
            aFilters.push(
              new Filter("Lstps", FilterOperator.EQ, oFilter.Lstps)
            );
          }
          if (oFilter.Hscmn) {
            aFilters.push(
              new Filter("Hscmn", FilterOperator.EQ, oFilter.Hscmn)
            );
          }
          if (oFilter.Hasrf) {
            aFilters.push(
              new Filter("Hasrf", FilterOperator.EQ, oFilter.Hasrf)
            );
          }
          if (oFilter.Isvic) {
            aFilters.push(
              new Filter("Isvic", FilterOperator.EQ, oFilter.Isvic)
            );
          }
          return aFilters;
        },
        onShowReference: function (oEvent) {
          var oSource = oEvent.getSource();
          sap.m.MessageToast.show(
            this.getText("REFERENCE_PERSON", oSource.data("referenceName"))
          );
        },
        onCommentDialogClose: function () {
          this._oCandidateNotesDialog.close();
        },
        onShowCandidateComments: function (oEvent) {
          var oSource = oEvent.getSource();
          var sPernr = oSource.data("candidateNumber");
          var sEname = oSource.data("candidateName");
          var oModel = this.getModel();
          var oThis = this;
          var oViewModel = this.getModel("candidateListModel");
          var oNotesModel = this.getModel("candidateNotes");
          if (!oNotesModel) {
            oNotesModel = new JSONModel({
              Notes: [],
            });
            this.setModel(oNotesModel, "CandidateNotes");
          }

          if (!this._oCandidateNotesDialog) {
            // create dialog via fragment factory
            this._oCandidateNotesDialog = sap.ui.xmlfragment(
              "com.bmc.hcm.erf.fragment.CandidateNotesDisplay",
              this
            );
            // connect dialog to view (models, lifecycle)
            this.getView().addDependent(this._oCandidateNotesDialog);
          }

          this._oCandidateNotesDialog.setTitle(
            this.getText("COMMENTS_ABOUT_CANDIDATE", [sEname])
          );

          var aFilters = [
            new Filter("Tclaskey", FilterOperator.EQ, "B"),
            new Filter("Pernrkey", FilterOperator.EQ, sPernr),
          ];
          oViewModel.setProperty("/busy", true);
          oNotesModel.setProperty("/Notes", []);
          oModel.read("/CandidateNotesSet", {
            filters: aFilters,
            success: function (oData, oResponse) {
              oViewModel.setProperty("/busy", false);
              oNotesModel.setProperty("/Notes", oData.results);
              oThis._oCandidateNotesDialog.open();
            },
            error: function (oError) {
              oViewModel.setProperty("/busy", false);
            },
          });
        },
        onApplyCandidateFilter: function () {
          var oTable = this.byId("idCandidatePoolTable");
          if (!oTable) {
            oTable = sap.ui.getCore().byId("idCandidatePoolTable");
          }
          oTable
            .getBinding("items")
            .filter(this._getFilters(false), "Application");
        },
        onResetCandidateFilter: function () {
          var oViewModel = this.getModel("candidateListModel");
          oViewModel.setProperty("/Filters/Ename", "");
          oViewModel.setProperty("/Filters/Gesch", "");
          oViewModel.setProperty("/Filters/Slart", "");
          oViewModel.setProperty("/Filters/Wdart", "");
          oViewModel.setProperty("/Filters/Lstcm", "");
          oViewModel.setProperty("/Filters/Lstps", "");
          oViewModel.setProperty("/Filters/Hscmn", false);
          oViewModel.setProperty("/Filters/Hasrf", false);
          oViewModel.setProperty("/Filters/Isvic", false);

          this.onApplyCandidateFilter();
        },

        onPoolFilterSelect: function (oEvent) {
          var oViewModel = this.getModel("candidateListModel");
          var sKey = oEvent.getParameter("key");

          oViewModel.setProperty("/Filters/Cplty", sKey);

          this.onApplyCandidateFilter();
        },
        onCandidateListUpdateStarted: function (oEvent) {
          var oViewModel = this.getModel("candidateListModel");
          oViewModel.setProperty("/busy", true);
        },
        onCandidateListUpdated: function (oEvent) {
          var oViewModel = this.getModel("candidateListModel");
          var oModel = this.getModel();
          var aFilters = [];
          var oThis = this;
          var oSearchResults = oViewModel.getProperty("/SearchResults");

          oViewModel.setProperty("/busy", false);

          Object.keys(oSearchResults).forEach(function (sKey) {
            aFilters = oThis._getFilters(true);
            aFilters.push(new Filter("Cplty", FilterOperator.EQ, sKey));
            oModel.read("/CandidatePoolSet/$count", {
              filters: aFilters,
              success: function (oData, oResponse) {
                oViewModel.setProperty(
                  "/SearchResults/" + sKey,
                  oResponse.body
                );
              },
              error: function (oError) {
                oViewModel.setProperty("/SearchResults/" + sKey, 0);
              },
            });
          });
        },

        onCandidateActionSheet: function (oEvent) {
          var oSource = oEvent.getSource();
          if (!this._oCandidateActionSheet) {
            this._oCandidateActionSheet = sap.ui.xmlfragment(
              "com.bmc.hcm.erf.fragment.CandidateListActions",
              this
            );
            this.getView().addDependent(this._oCandidateActionSheet);
          }
          var oLine = this.getModel().getProperty(
            oSource.getParent().getBindingContextPath()
          );
          this._oCandidateActionSheet.data("CandidateLine", oLine);
          var oViewModel = this.getModel("candidateListModel");
          var oSettings = oViewModel.getProperty("/CandidateActionSettings");

          oSettings.DiscardFromPool = oLine.Cplty === "" ? false : true;
          oSettings.AssignToPotential = oLine.Cplty === "P" ? false : true;
          oSettings.AssignToRejected = oLine.Cplty === "R" ? false : true;
          oViewModel.setProperty("/CandidateActionSettings", oSettings);

          this._oCandidateActionSheet.openBy(oSource);
        },
        onCandidateListResume: function (oEvent) {
          var oLine = this._oCandidateActionSheet.data("CandidateLine");
          var sPath =
            "/sap/opu/odata/sap/ZHCM_RECRUITMENT_SRV/CandidateResumeSet(Tclas='B'," +
            "Pernr='" +
            oLine.Pernr +
            "')/$value";
          var sTitle = this.getText("CANDIDATE_RESUME", [
            oLine.Ename,
            this.getText("EXTERNAL_APPLICANT"),
          ]);

          this._callPDFViewer(sPath, sTitle);
        },
        onChangeCandidatePool: function (oEvent) {
          var oSource = oEvent.getSource();
          var sCplty = oSource.data("poolType");
          var oModel = this.getModel();
          var oThis = this;
          var oLine = this._oCandidateActionSheet.data("CandidateLine");

          var _assignConfirmed = function () {
            var oUrlParameters = {
              Pernr: oLine.Pernr,
              Cplty: sCplty,
            };
            oThis._openBusyFragment(oThis.getText("POOL_ASSIGN_STARTED"));
            oModel.callFunction("/SetCandidatePool", {
              method: "POST",
              urlParameters: oUrlParameters,
              success: function (oData, oResponse) {
                oThis._closeBusyFragment();
                oThis._sweetToast(
                  oThis.getText("POOL_ASSIGN_SUCCESSFUL"),
                  "S"
                );
                oModel.refresh();
              },
              error: function (oError) {
                oThis._closeBusyFragment();
                oThis._sweetToast(
                  oThis.getText("POOL_ASSIGN_FAILED"),
                  "E"
                );
              },
            });
          };

          var oBeginButtonProp = {
            text: oSource.getText(),
            type: oSource.getType(),
            icon: oSource.getIcon(),
            onPressed: _assignConfirmed,
          };

          this._callConfirmDialog(
            this.getText("CONFIRMATION_REQUIRED"),
            "Message",
            "Warning",
            this.getText("POOL_ASSIGN_CONFIRMATION"),
            oBeginButtonProp,
            null
          ).open();
        },
        onCandidateListEdit: function (oEvent) {
          var oLine = this._oCandidateActionSheet.data("CandidateLine");
          var oViewModel = this.getModel("candidateListModel");
          oViewModel.setProperty("/busy", true);
          this.getRouter().navTo("candidateedit", {
            Pernr: oLine.Pernr,
          });
        },
        onPressCandidate: function (oEvent) {
          var oViewModel = this.getModel("candidateListModel");
          var sPernr = oEvent
            .getSource()
            .getBindingContext()
            .getProperty("Pernr");
          oViewModel.setProperty("/busy", true);
          this.getRouter().navTo("candidateedit", {
            Pernr: sPernr,
          });
        },
        onNewCandidateCreate: function (oEvent) {
          var oViewModel = this.getModel("candidateListModel");
          oViewModel.setProperty("/busy", true);
          this.getRouter().navTo("candidatecreate");
        },
        onDataExport: function (oEvent) {
          // var sPath = "/sap/opu/odata/sap/ZHCM_RECRUITMENT_SRV/CandidatePoolSet?$filter=Cplty eq 'C'&$format=xlsx";

          // sap.m.URLHelper.redirect(sPath, true);

          // return;
          var oExport = new Export({
            // Type that will be used to generate the content. Own ExportType's can be created to support other formats

            exportType: new ExportTypeCSV({
              separatorChar: ";",
            }),

            // Pass in the model created above
            models: this.getModel(),

            // binding information for the rows aggregation
            rows: {
              path: "/CandidatePoolSet",
            },

            // column definitions with column name and binding info for the content

            columns: [
              {
                name: "Aday Havuzu",
                template: {
                  content: "{Cplty}",
                },
              },
              {
                name: "Aday Numarası",
                template: {
                  content: "{Pernr}",
                },
              },
              {
                name: "Adayın Adı Soyadı",
                template: {
                  content: "{Ename}",
                },
              },
              {
                name: "Cinsiyeti",
                template: {
                  content: "{Gescx}",
                },
              },
              {
                name: "Doğum Tarihi",
                template: {
                  content:
                    "{ path:'Gbdat', type: 'sap.ui.model.type.Date', formatOptions:{ UTC: true, pattern: 'dd.MM.yyyy'}}",
                },
              },
              {
                name: "Eğitim Durumu",
                template: {
                  content: "{Slarx}",
                },
              },
              {
                name: "Askerlik Durumu",
                template: {
                  content: "{Wdarx}",
                },
              },
              {
                name: "Telefonu",
                template: {
                  content: "{Phone}",
                },
              },
              {
                name: "Şirketi",
                template: {
                  content: "{Lstcm}",
                },
              },
              {
                name: "Görevi",
                template: {
                  content: "{Lstps}",
                },
              },
              {
                name: "Referans Bilgisi",
                template: {
                  content: {
                    parts: ["Hasrf", "Isvic", "Refnm"],
                    formatter: function (sHasrf, sIsvic, sRefnm) {
                      if (sHasrf) {
                        return (
                          (sIsvic ? "VIP Referans," : "Normal Referans,") +
                          sRefnm
                        );
                      } else {
                        return "Hayır";
                      }
                    },
                  },
                },
              },
            ],
          });

          oExport
            .saveFile("Aday_Listesi")
            .catch(function (oError) {})
            .then(function () {
              oExport.destroy();
            });
        },
        onDrfvhInputValueHelpRequest: function (oEvent) {
          debugger;
          var oView = this.getView();
          var oModel = this.getModel();
          var oViewModel = this.getModel("employeeRequestView");
          var oRequest = oViewModel.getProperty("/request");
          var oRequestEmployee = oViewModel.getProperty("/dataList/DocumentRequestEmployeeSet");
          var that = this;
  
          if (!oRequest.Drfrt || !oRequest.Drfbl || !oRequest.Drfbn) {
            this._sweetToast(this.getText("FILL_IN_ALL_REQUIRED_FIELDS"), "E");
            return;
          }
          
          this._openEmployeeChangeSearchDialog(oModel, oViewModel);
        },
        
        /**
         * Opens employee change search dialog
         * @private
         */
        _openEmployeeChangeSearchDialog: function(oModel, oViewModel) {
          var that = this;
          
          oModel.read("/ValueHelpSet", {
            filters: [
              new sap.ui.model.Filter(
                "Drfvh",
                sap.ui.model.FilterOperator.EQ,
                "Emplye"
              ),
            ],
            success: function (oData) {
              oViewModel.setProperty("/changeList", oData.results);
      
              if (!that._oEmployeeChangeSearchDialog) {
                that._oEmployeeChangeSearchDialog = sap.ui.xmlfragment(
                  "EmployeeSearchChangeFragment",
                  "com.bmc.hcm.drf.zhcmuxdrf.fragment.EmployeeChangeSearch",
                  that
                );
                that.getView().addDependent(that._oEmployeeChangeSearchDialog);
              }
              that._oEmployeeChangeSearchDialog.open();
            },
            error: function () {},
          });
        },
        onCloseButtonEmployeeChangePress:function(){
          debugger;
          if (this._oEmployeeChangeSearchDialog) {
            this._oEmployeeChangeSearchDialog.close();
          }
        },
        onSaveButtonEmployeePress: function (oEvent) {
          var oTable = sap.ui.core.Fragment.byId(
            "EmployeeSearchFragment",
            "idListEmployeeTable"
          );
          if (!oTable) {
            oTable = this.getView().byId("idListEmployeeTable");
          }

          if (!oTable) {
            console.error("Table not found");
            sap.m.MessageToast.show("Tablo bulunamadı");
            return;
          }

          var aSelectedItems = oTable.getSelectedItems();
          if (!aSelectedItems || aSelectedItems.length === 0) {
            this._sweetToast("Lütfen en az bir personel seçiniz", "W");
            return;
          }

          var oViewModel = this.getModel("employeeRequestView");
          var aSelectedEmployees =
            oViewModel.getProperty("/selectedEmployees") || [];

          // Birden fazla seçim kontrolü
          if (aSelectedItems.length > 1) {
            this._sweetToast(this.getText("SINGLE_EMPLOYEE_ONLY"), "W");
            return;
          }

          // Zaten personel eklenmiş mi kontrolü
          if (aSelectedEmployees.length > 0) {
            this._sweetToast(this.getText("SINGLE_EMPLOYEE_ONLY"), "W");
            return;
          }

          var oItem = aSelectedItems[0];
          var oEmployee = oItem
            .getBindingContext("employeeRequestView")
            .getObject();
          var bAlreadyExists = aSelectedEmployees.some(function (
            oExistingEmployee
          ) {
            return oExistingEmployee.Pernr === oEmployee.Fldky;
          });

          if (!bAlreadyExists) {
            aSelectedEmployees.push({
              Pernr: oEmployee.Fldky,
              Ename: oEmployee.Fldvl,
            });
            oViewModel.setProperty("/selectedEmployees", aSelectedEmployees);
            this._sweetToast(this.getText("EMPLOYEE_ADDED_SUCCESS"), "S");
          } else {
            this._sweetToast(this.getText("EMPLOYEE_ALREADY_ADDED"), "W");
          }

          if (this._employeeValueHelpDialog) {
            this._employeeValueHelpDialog.close();
          }

          oTable.removeSelections();
        },
        onColumnListItemEmployeePress: function (oEvent) {
          var oSelectedItem = oEvent.getSource();
          var aSelectedContexts = oSelectedItem.getSelectedContexts(
            "employeeRequestView"
          );
          var oViewModel = this.getModel("employeeRequestView");
          var aSelectedEmployees =
            oViewModel.getProperty("/selectedEmployees") || [];

          // Birden fazla seçim kontrolü
          if (aSelectedContexts.length > 1) {
            this._sweetToast(this.getText("SINGLE_EMPLOYEE_ONLY"), "W");
            return;
          }

          // Zaten personel eklenmiş mi kontrolü
          if (aSelectedEmployees.length > 0) {
            this._sweetToast(this.getText("SINGLE_EMPLOYEE_ONLY"), "W");
            return;
          }

          if (aSelectedContexts.length > 0) {
            var oSelectedEmployee = aSelectedContexts[0].getObject();

            var bAlreadyExists = aSelectedEmployees.some(function (oEmployee) {
              return oEmployee.Pernr === oSelectedEmployee.Fldky;
            });

            if (!bAlreadyExists) {
              aSelectedEmployees.push({
                Pernr: oSelectedEmployee.Fldky,
                Ename: oSelectedEmployee.Fldvl,
              });
              oViewModel.setProperty("/selectedEmployees", aSelectedEmployees);
              this._sweetToast(this.getText("EMPLOYEE_ADDED_SUCCESS"), "S");
            } else {
              this._sweetToast(this.getText("EMPLOYEE_ALREADY_ADDED"), "W");
            }
          }
        },
        
        // onSelectEmployeeFromDialog: function (oEvent) {
        //   var oTable = sap.ui.core.Fragment.byId(
        //     "EmployeeChangeSearchDialog",
        //     "idListEmployeeChangeTable"
        //   );
        //   if (!oTable) {
        //     oTable = this.getView().byId("idListEmployeeChangeTable");
        //   }

        //   if (!oTable) {
        //     console.error("Table not found");
        //     sap.m.MessageToast.show("Tablo bulunamadı");
        //     return;
        //   }

        //   var aSelectedItems = oTable.getSelectedItems();
        //   if (!aSelectedItems || aSelectedItems.length === 0) {
        //     this._sweetToast(this.getText("PLEASE_SELECT_EMPLOYEE"), "W");
        //     return;
        //   }

        //   var oViewModel = this.getModel("employeeRequestView");
        //   var aSelectedEmployees =
        //     oViewModel.getProperty("/selectedEmployees") || [];

        //   if (aSelectedItems.length > 1) {
        //     this._sweetToast(this.getText("SINGLE_EMPLOYEE_ONLY"), "W");
        //     return;
        //   }

        //   if (aSelectedEmployees.length > 0) {
        //     this._sweetToast(this.getText("SINGLE_EMPLOYEE_ONLY"), "W");
        //     return;
        //   }

        //   var oItem = aSelectedItems[0];
        //   var oEmployee = oItem
        //     .getBindingContext("employeeRequestView")
        //     .getObject();
        //   var bAlreadyExists = aSelectedEmployees.some(function (
        //     oExistingEmployee
        //   ) {
        //     return oExistingEmployee.Pernr === oEmployee.Fldky;
        //   });

        //   if (!bAlreadyExists) {
        //     aSelectedEmployees.push({
        //       Pernr: oEmployee.Fldky,
        //       Ename: oEmployee.Fldvl,
        //     });
        //     oViewModel.setProperty("/selectedEmployees", aSelectedEmployees);
        //     this._sweetToast(this.getText("EMPLOYEE_ADDED_SUCCESS"), "S");
        //   } else {
        //     this._sweetToast(this.getText("EMPLOYEE_ALREADY_ADDED"), "W");
        //   }

        //   if (this._oEmployeeSearchDialog) {
        //     this._oEmployeeSearchDialog.close();
        //   }

        //   oTable.removeSelections();
        // },
        onRemoveSelectedEmployee: function (oEvent) {
          var oSource = oEvent.getSource();
          var sEmployeeId = oSource.data("employeeId");
          var sEmployeeName = oSource.data("employeeName");
          var that = this;

          sap.m.MessageBox.confirm(
            sEmployeeName +
              " adlı personeli listeden kaldırmak istediğinizden emin misiniz?",
            {
              title: "Onay Gerekli",
              actions: [
                sap.m.MessageBox.Action.YES,
                sap.m.MessageBox.Action.NO,
              ],
              emphasizedAction: sap.m.MessageBox.Action.YES,
              onClose: function (sAction) {
                if (sAction === sap.m.MessageBox.Action.YES) {
                  that._removeEmployeeFromTable(sEmployeeId);
                }
              },
            }
          );
        },
        _removeEmployeeFromTable: function (sEmployeeId) {
          var oViewModel = this.getModel("employeeRequestView");
          var aSelectedEmployees =
            oViewModel.getProperty("/selectedEmployees") || [];

          var aFilteredEmployees = aSelectedEmployees.filter(function (
            oEmployee
          ) {
            return oEmployee.Pernr !== sEmployeeId;
          });

          oViewModel.setProperty("/selectedEmployees", aFilteredEmployees);
          this._sweetToast("Personel listeden kaldırıldı", "S");
        },

        onSaveEmployeeRequest: function (oEvent) {
          debugger;
          var oViewModel = this.getModel("employeeRequestView");
          var oRequestData = oViewModel.getProperty("/request");
          var aSelectedEmployees =
            oViewModel.getProperty("/selectedEmployees") || [];

          var that = this;

          if (aSelectedEmployees.length === 0) {
            that._sweetToast(that.getText("PLEASE_SELECT_EMPLOYEE"), "W");
            return;
          }

          var aEmployeeIds = aSelectedEmployees.map(function (oEmployee) {
            return {
              Pernr: oEmployee.Pernr,
              Renwl: oEmployee.Renwl || "", 
              Rendc: oEmployee.Rendc || "",
              Drfrs: oEmployee.Drfrs || ""
            };
          });
          oRequestData.DocumentRequestEmployeeSet = aEmployeeIds;
          oRequestData.Actio = "SAVE";

          var oModel = this.getModel();

          oModel.create("/DocumentRequestFormSet", oRequestData, {
            success: function (oData, oResponse) {
              that._sweetToast("Talep başarıyla kaydedildi. Personele evrak eklemek için talep detayına gidiniz.", "S");
              setTimeout(function() {
                that.getRouter().navTo("mngrequestlist");
              }, 3000);
              oViewModel.setProperty("/request", {});
              oViewModel.setProperty("/selectedEmployees", []);
            },
            error: function (oError) {
              console.error("Create error:", oError);
              that._sweetToast("Kaydetme sırasında hata oluştu", "E");
            },
          });
        },
        onShowRequestActions: function (oEvent) {
          debugger;
          var oRequestModel = this.getModel("employeeRequestView");
          var oRequestData = oRequestModel.getProperty("/request");
          var oSource = oEvent.getSource();

          var oBindingContext = oSource
            .getParent()
            .getBindingContext("employeeRequestView");

          if (oBindingContext) {
            var oRowData = oBindingContext.getObject();
            this._selectedRowData = oRowData;
            this._openRequestActions(oRowData, oSource);
          } else {
            this._sweetToast("Satır verisi alınamadı", "E");
          }
        },

        _openRequestActions: function (oRequestData, oSource) {
          console.log("oData", oRequestData);
          if (!this._requestActions) {
            this._requestActions = sap.ui.xmlfragment(
              "com.bmc.hcm.drf.zhcmuxdrf.fragment.DocumentRequestActions",
              this
            );
            this.getView().addDependent(this._requestActions);
          }

          this._requestActions.data("selectedRowData", this._selectedRowData);

          this._requestActions.openBy(oSource);
        },
        onAddDocument: function (oEvent) {
          debugger;
          var oModel = this.getModel();
          var oRowData = this._selectedRowData;
          var oViewModel = this.getModel("employeeRequestView");
          
          oViewModel.setProperty("/attachmentFilters/Pernr", oRowData.Pernr);
          oViewModel.setProperty("/attachmentFilters/Drfid", oRowData.Drfid);
          var sDrfrt = oViewModel.getProperty("/request/Drfrt");
          var sDrfbl = oViewModel.getProperty("/request/Drfbl");
          var sDrfbn = oViewModel.getProperty("/request/Drfbn");

          console.log(sDrfrt, sDrfbl, sDrfbn);

          if (!oViewModel.getProperty("/valueHelpList")) {
            oViewModel.setProperty("/valueHelpList", {});
          }
          
          var aFilters = [
            new Filter("Selk3", FilterOperator.EQ, sDrfrt),
            new Filter("Selky", FilterOperator.EQ, sDrfbl),
            new Filter("Selk2", FilterOperator.EQ, sDrfbn),
            new Filter("Drfvh", FilterOperator.EQ, "Drfev")
          ];
          
          var that = this;
          
          oModel.read("/ValueHelpSet", {
            filters: aFilters,
            success: function (oData) {
              oViewModel.setProperty("/valueHelpList/Drfev", oData.results);
              
              console.log("Data loaded successfully", oData);
              console.log("valueHelpList:", oViewModel.getProperty("/valueHelpList"));
   
              oViewModel.setProperty("/downloadButtonVisible", false);
              oViewModel.setProperty("/selectedDocumentType", "");
              
              if (!that._documentAddDialog) {
                that._documentAddDialog = sap.ui.xmlfragment(
                  "com.bmc.hcm.drf.zhcmuxdrf.fragment.DocumentAddDialog",
                  that
                );
                that.getView().addDependent(that._documentAddDialog);
              }
              
              that._documentAddDialog.open();
              
              setTimeout(function () {
                var oTable = sap.ui.getCore().byId("idCandidateAttachmentList");
                if (oTable && oRowData) {
                  var aTableFilters = [
                    new sap.ui.model.Filter(
                      "Pernr",
                      sap.ui.model.FilterOperator.EQ,
                      oRowData.Pernr
                    ),
                    new sap.ui.model.Filter(
                      "Drfid",
                      sap.ui.model.FilterOperator.EQ,
                      oRowData.Drfid
                    ),
                    new sap.ui.model.Filter(
                      "Attyp",
                      sap.ui.model.FilterOperator.EQ,
                      '1'
                    ),
                  ];

                  var oBinding = oTable.getBinding("items");
                  if (oBinding) {
                    oBinding.filter(aTableFilters);
                  }
                }
              }, 300);
            },
            error: function (oError) {
              console.error("ValueHelpSet read error:", oError);
              that._sweetToast("Evrak türleri yüklenirken hata oluştu", "E");
            },
          });
        },
        
        onUploadDocument: function(oEvent) {
          debugger;
          var oRowData = this._selectedRowData;
          var that = this;
          
          if (!this._uploadDocumentDialog) {
            this._uploadDocumentDialog = sap.ui.xmlfragment(
              "com.bmc.hcm.drf.zhcmuxdrf.fragment.UploadDocumentDialog",
              this
            );
            this.getView().addDependent(this._uploadDocumentDialog);
          }
          
          // Seçili personel bilgilerini dialog'a aktar
          var oViewModel = this.getModel("employeeRequestView");
          oViewModel.setProperty("/uploadFilters/Pernr", oRowData.Pernr);
          oViewModel.setProperty("/uploadFilters/Drfid", oRowData.Drfid);
          oViewModel.setProperty("/uploadFilters/Ename", oRowData.Ename);
          
          this._uploadDocumentDialog.open();
        },
        
        onViewDocument: function(oEvent) {
          debugger;
          var oModel = this.getModel();
          var oViewModel = this.getModel("employeeRequestView");
          var oRowData = this._selectedRowData;
          var that = this;
          
          if (!this._viewDocumentDialog) {
            this._viewDocumentDialog = sap.ui.xmlfragment(
              "com.bmc.hcm.drf.zhcmuxdrf.fragment.ViewDocumentDialog",
              this
            );
            this.getView().addDependent(this._viewDocumentDialog);
          }
        
          var sPath = oModel.createKey("/DocumentListSet", {
            Drfid: oRowData.Drfid,
            Pernr: oRowData.Pernr,
            Attyp: '2'
          });
          
          oViewModel.setProperty("/viewFilters/Ename", oRowData.Ename);
          
          // Önce boş listeyi set et - böylece dialog her zaman açılır
          oViewModel.setProperty("/documentList", []);
          
          // Dialog'ı hemen aç
          that._viewDocumentDialog.open();
          
          // Belgeleri yükle
          oModel.read(sPath, {
            success: function(oData) {
              var aData = Array.isArray(oData) ? oData : [oData];
              oViewModel.setProperty("/documentList", aData);
            },
            error: function(oError) {
              oViewModel.setProperty("/documentList", []);
              // that._callMessageToast("Belge bulunamadı.", "W");
            }
          });
        },
        onDocumentUploadPress: function(){
          var that = this;
          var oRowData = this._selectedRowData;
          var oModel = this.getView().getModel();
          var oEmployeeModel = this.getView().getModel("employeeRequestView");
          var oRequestDocument = oEmployeeModel.getProperty("/requestDocument");
          var oRequestDoc = {
            Drfid: oRowData.Drfid,
            Pernr: oRowData.Pernr,
            Zbelt: oRequestDocument.Zbelt,
            Zbeln: oRequestDocument.Zbeln,
            Zblno: oRequestDocument.Zblno,
            Zkurm: oRequestDocument.Zkurm,
            // Zbolm: oRequestDocument.Zbolm,
            Ztarh: oRequestDocument.Ztarh,
            Zgecr: oRequestDocument.Zgecr,
            Zznot: oRequestDocument.Zznot,
          }
          var oFormToValidate =
          sap.ui.getCore().byId("idUploadAttachmentForm2") || this.byId("idUploadAttachmentForm2"),
          oEmployeeModel = this.getModel("employeeRequestView"),
          oModel = this.getModel();
          if (!this._validateForm(oFormToValidate)) {
            this._sweetToast(this.getText("FILL_IN_ALL_REQUIRED_FIELDS"), "W");
            return;
          }
          oModel.create("/DocumentListSet", oRequestDoc, {
            success: function (oData, oResponse) {
              that._closeBusyFragment();
              that._sweetToast(that.getText("DOCUMENT_ADDED"), "S");
              that.onAttachmentDocumentUploadPress();
              that._uploadDocumentDialog.close();
            },
            error: function (oError) {
              that._closeBusyFragment();
              that._sweetToast("Belge eklenirken hata oluştu", "E");
            },
          });
        },
        onAttachmentDocumentUploadPress:function(oEvent){
          debugger;
          var oFileUploader = sap.ui.getCore().byId("idAttachmentFileUploaderDocument");
          var oModel = this.getModel();
          var oProcess = SharedData.getCandidateProcess();
          var oRowData = this._selectedRowData;
          // requestDocument verilerini al

          if (!oFileUploader.getValue()) {
            this._sweetToast(
              this.getText("FILE_SELECTION_REQUIRED"),
              "W"
            );
            return;
          }

          /*Destroy header parameters*/
          oFileUploader.destroyHeaderParameters();

          /*Set security token*/
          oModel.refreshSecurityToken();
          oFileUploader.addHeaderParameter(
            new sap.ui.unified.FileUploaderParameter({
              name: "x-csrf-token",
              value: oModel.getSecurityToken(),
            })
          );

          /*Set filename*/
          var sFileName = oFileUploader.getValue();
          sFileName = encodeURIComponent(sFileName);
          oFileUploader.addHeaderParameter(
            new sap.ui.unified.FileUploaderParameter({
              name: "content-disposition",
              value: "inline; filename='" + sFileName + "'",
            })
          );

          /*Set upload path*/
          var sPath = "";
          sPath =
            oModel.sServiceUrl +
            "/EmployeeAttachmentOperationSet(Pernr='" +
            oRowData.Pernr +
            "',Drfid='" +
            oRowData.Drfid +
            "',Attyp='" +
            '2' +
            "',Zevrt='" +
            '' +
            "')/EmployeeAttachmentSet";

          oFileUploader.setUploadUrl(sPath);

          /*Upload file*/

          oFileUploader.upload();
        },
        onAttachmentUploadPress: function (oEvent) {
          debugger;
          var oFileUploader = sap.ui.getCore().byId("idAttachmentFileUploader");
          var oModel = this.getModel();
          var oProcess = SharedData.getCandidateProcess();
          var oRowData = this._selectedRowData;
          var oDocumentType = this.getModel("employeeRequestView").getProperty("/selectedDocumentType");
          if (!oFileUploader.getValue()) {
            this._sweetToast(
              this.getText("FILE_SELECTION_REQUIRED"),
              "W"
            );
            return;
          }

          /*Destroy header parameters*/
          oFileUploader.destroyHeaderParameters();

          /*Set security token*/
          oModel.refreshSecurityToken();
          oFileUploader.addHeaderParameter(
            new sap.ui.unified.FileUploaderParameter({
              name: "x-csrf-token",
              value: oModel.getSecurityToken(),
            })
          );

          /*Set filename*/
          var sFileName = oFileUploader.getValue();
          sFileName = encodeURIComponent(sFileName);
          oFileUploader.addHeaderParameter(
            new sap.ui.unified.FileUploaderParameter({
              name: "content-disposition",
              value: "inline; filename='" + sFileName + "'",
            })
          );

          /*Set upload path*/
          var sPath = "";
          sPath =
            oModel.sServiceUrl +
            "/EmployeeAttachmentOperationSet(Pernr='" +
            oRowData.Pernr +
            "',Drfid='" +
            oRowData.Drfid +
            "',Attyp='" +
            '1' +
            "',Zevrt='" +
            oDocumentType +
            "')/EmployeeAttachmentSet";

          oFileUploader.setUploadUrl(sPath);

          /*Upload file*/

          oFileUploader.upload();
        },
        onAttachmentDocumentUploadComplete:function(oEvent){
          var oFileUploader = sap.ui.getCore().byId("idAttachmentFileUploaderDocument");
          oFileUploader.destroyHeaderParameters();
          oFileUploader.clear();

          var sStatus = oEvent.getParameter("status");
          var sResponse = oEvent.getParameter("response");
          this._closeBusyFragment();
          if (sStatus == "201" || sStatus == "200") {
            this._sweetToast(this.getText("FILE_UPLOAD_SUCCESS"), "S");
            // this._oUploadAttachmentDialog.close();
          } else {
            this._sweetToast(
              this.getText("FILE_UPLOAD_ERROR", [sResponse]),
              "E"
            );
          }
          this.getModel().refresh(true);
        },
        onAttachmentUploadComplete: function (oEvent) {
          var oFileUploader = sap.ui.getCore().byId("idAttachmentFileUploader");
          oFileUploader.destroyHeaderParameters();
          oFileUploader.clear();

          var sStatus = oEvent.getParameter("status");
          var sResponse = oEvent.getParameter("response");
          this._closeBusyFragment();
          if (sStatus == "201" || sStatus == "200") {
            this._sweetToast(this.getText("FILE_UPLOAD_SUCCESS"), "S");
            // this._oUploadAttachmentDialog.close();
          } else {
            this._sweetToast(
              this.getText("FILE_UPLOAD_ERROR", [sResponse]),
              "E"
            );
          }
          this.getModel().refresh(true);
        },
        onAttachmentFileChange: function (oEvent) {
          this._sweetToast(
            this.getText("FILE_UPLOAD_WARNING", [
              oEvent.getParameter("newValue"),
            ]),
            "W"
          );
        },
        onValueHelpSetNameComboBoxChange:function(oEvent){
          debugger;
          var oComboBox = oEvent.getSource();
          var sSelectedKey = oComboBox.getSelectedKey();
          var oCityComboBox = this.byId("idDocumentNameComboBox");

          if (oCityComboBox) {
            var aFilters = [];
            aFilters.push(new Filter("Selky", FilterOperator.EQ, sSelectedKey));

            var oBinding = oCityComboBox.getBinding("items");
            oBinding.filter(aFilters);
        }
        },
        onValueHelpSetName2ComboBoxChange:function(oEvent){
          debugger;
          var oName2 = oEvent.getSource();
          var sSelectedKeys = oName2.getSelectedKey();
          var oName2ComboBox = this.byId("idDocumentName2ComboBox") ? this.byId("idDocumentName2ComboBox") : sap.ui.getCore().byId("idDocumentName2ComboBox");

          if (oName2ComboBox) {
            var aFilters = [];
            aFilters.push(new Filter("Selky", FilterOperator.EQ, sSelectedKeys));

            var oBinding = oName2ComboBox.getBinding("items");
            oBinding.filter(aFilters);
        }
        },
        
        onDrfrsComboBoxChange: function(oEvent) {
          debugger;
          var oComboBox = oEvent.getSource();
          var sSelectedKey = oComboBox.getSelectedKey();
          
          // Hangi satırın ComboBox'ı değiştirildiğini bul
          var oBindingContext = this._getCurrentEmployeeBindingContext(oEvent);
          if (oBindingContext) {
            var oModel = this.getModel("employeeRequestView");
            var aSelectedEmployees = oModel.getProperty("/selectedEmployees") || [];
            var sPath = oBindingContext.getPath();
            var iIndex = parseInt(sPath.split("/")[2]);
            
            aSelectedEmployees[iIndex].Drfrs = sSelectedKey;
            oModel.setProperty("/selectedEmployees", aSelectedEmployees);
          }
        },
        onFileTypeMissmatch: function (oEvent) {
          debugger;
          var aFileTypes = oEvent.getSource().getFileType();
          jQuery.each(aFileTypes, function (key, value) {
            aFileTypes[key] = "*." + value;
          });
          var sSupportedFileTypes = aFileTypes.join(", ");
          MessageBox.warning(
            this.getResourceBundle().getText("FILE_TYPE_MISMATCH", [
              oEvent.getParameter("fileType"),
              sSupportedFileTypes,
            ])
          );
        },
        onNopeMenuItemPress: function(oEvent) {
          debugger;
          var oBindingContext = this._getCurrentEmployeeBindingContext(oEvent);
          if (oBindingContext) {
            var oModel = this.getModel("employeeRequestView");
            var aSelectedEmployees = oModel.getProperty("/selectedEmployees") || [];
            var sPath = oBindingContext.getPath();
            var iIndex = parseInt(sPath.split("/")[2]);
            
            aSelectedEmployees[iIndex].Renwl = "2";
            oModel.setProperty("/selectedEmployees", aSelectedEmployees);
            
            this._currentEmployeeIndex = iIndex;
            oModel.setProperty("/currentEmployee", aSelectedEmployees[iIndex]);
            
            // Dialog'u aç
            if (!this._renewalRequestDialog) {
              this._renewalRequestDialog = sap.ui.xmlfragment(
                "com.bmc.hcm.drf.zhcmuxdrf.fragment.RenewalRequestDialog",
                this
              );
              this.getView().addDependent(this._renewalRequestDialog);
            }
            this._renewalRequestDialog.open();
          }
        },
        
        onRenewalReasonConfirm: function(oEvent) {
          debugger;
          var oModel = this.getModel("employeeRequestView");
          var sReason = sap.ui.getCore().byId("renewalChangeReasonTextArea").getValue();
          
          if (!sReason || sReason.trim() === "") {
            this._sweetToast("Lütfen gerekçe giriniz", "E");
            return;
          }
          
          if (this._currentEmployeeIndex !== undefined) {
            var aSelectedEmployees = oModel.getProperty("/dataList/DocumentRequestEmployeeSet") || [];
            aSelectedEmployees[this._currentEmployeeIndex].Rendc = sReason.trim();
            oModel.setProperty("/dataList/DocumentRequestEmployeeSet", aSelectedEmployees);
            oModel.refresh(true);
          }
          
          this._renewalRequestDialog.close();
          this._currentEmployeeIndex = undefined;
        },
        onRenewalChangeReasonConfirm: function(){
          var oModel = this.getModel("employeeRequestView");
          var sReason = sap.ui.getCore().byId("renewalReasonTextArea").getValue();
          
          if (!sReason || sReason.trim() === "") {
            this._sweetToast("Lütfen gerekçe giriniz", "E");
            return;
          }
          
          if (this._currentEmployeeIndex !== undefined) {
            var aSelectedEmployees = oModel.getProperty("/selectedEmployees") || [];
            aSelectedEmployees[this._currentEmployeeIndex].Rendc = sReason.trim();
            oModel.setProperty("selectedEmployees", aSelectedEmployees);
            oModel.refresh(true);
          }
          
          this._renewalRequestDialog.close();
          this._currentEmployeeIndex = undefined;
        },
        
        onRenewalReasonCancel: function(oEvent) {
          debugger;
          if (this._currentEmployeeIndex !== undefined) {
            var oModel = this.getModel("employeeRequestView");
            var aSelectedEmployees = oModel.getProperty("/selectedEmployees") || [];
            aSelectedEmployees[this._currentEmployeeIndex].Renwl = "";
            aSelectedEmployees[this._currentEmployeeIndex].Rendc = "";
            oModel.setProperty("/selectedEmployees", aSelectedEmployees);
  
            oModel.refresh(true);
          }
          
          this._renewalRequestDialog.close();
          this._currentEmployeeIndex = undefined;
        },
        onRenewalChangeReasonCancel:function(){
          if (this._currentEmployeeIndex !== undefined) {
            var oModel = this.getModel("employeeRequestView");
            var aSelectedEmployees = oModel.getProperty("/dataList/DocumentRequestEmployeeSet") || [];
            aSelectedEmployees[this._currentEmployeeIndex].Renwl = "";
            aSelectedEmployees[this._currentEmployeeIndex].Rendc = "";
            oModel.setProperty("/dataList/DocumentRequestEmployeeSet", aSelectedEmployees);
  
            oModel.refresh(true);
          }
          
          this._renewalRequestDialog.close();
          this._currentEmployeeIndex = undefined;
        },
        onYesMenuItemPress: function(oEvent) {
          debugger;
          var oBindingContext = this._getCurrentEmployeeBindingContext(oEvent);
          if (oBindingContext) {
            var oModel = this.getModel("employeeRequestView");
            var aSelectedEmployees = oModel.getProperty("/selectedEmployees") || [];
            var sPath = oBindingContext.getPath();
            var iIndex = parseInt(sPath.split("/")[2]);
            
            aSelectedEmployees[iIndex].Renwl = "1";
            aSelectedEmployees[iIndex].Rendc = "";
            oModel.setProperty("/selectedEmployees", aSelectedEmployees);
 
          }
        },
        onYesMenuItemChangePress: function(oEvent) {
          debugger;
          var oBindingContext = this._getCurrentEmployeeBindingContext(oEvent);
          if (oBindingContext) {
            var oModel = this.getModel("employeeRequestView");
            var aSelectedEmployees = oModel.getProperty("/dataList/DocumentRequestEmployeeSet") || [];
            var sPath = oBindingContext.getPath();
            var iIndex = parseInt(sPath.split("/").pop());
      
            if (sPath.includes("/dataList/DocumentRequestEmployeeSet/")) {
              iIndex = parseInt(sPath.substring(sPath.lastIndexOf("/") + 1));
            }
            
            if (aSelectedEmployees[iIndex]) {
              aSelectedEmployees[iIndex].Renwl = "1";
              aSelectedEmployees[iIndex].Rendc = "";
              oModel.setProperty("/dataList/DocumentRequestEmployeeSet", aSelectedEmployees);
        
              oModel.refresh(true);
            }
          }
        },
        onNopeMenuItemChangePress:function(oEvent){
          debugger;
          var oBindingContext = this._getCurrentEmployeeBindingContext(oEvent);
          if (oBindingContext) {
            var oModel = this.getModel("employeeRequestView");
            var aSelectedEmployees = oModel.getProperty("/dataList/DocumentRequestEmployeeSet") || [];
            var sPath = oBindingContext.getPath();
            var iIndex = parseInt(sPath.split("/").pop());
            
            if (sPath.includes("/dataList/DocumentRequestEmployeeSet/")) {
              iIndex = parseInt(sPath.substring(sPath.lastIndexOf("/") + 1));
            }
            
            if (aSelectedEmployees[iIndex]) {
              aSelectedEmployees[iIndex].Renwl = "2";
              oModel.setProperty("/dataList/DocumentRequestEmployeeSet", aSelectedEmployees);
              
              this._currentEmployeeIndex = iIndex;
              oModel.setProperty("/currentChangeEmployee", aSelectedEmployees[iIndex]);
              
              if (!this._renewalRequestDialog) {
                this._renewalRequestDialog = sap.ui.xmlfragment(
                  "com.bmc.hcm.drf.zhcmuxdrf.fragment.RenewalChangeRequestDialog",
                  this
                );
                this.getView().addDependent(this._renewalRequestDialog);
              }
              this._renewalRequestDialog.open();
            }
          }
        },
        onFileSizeExceed: function (oEvent) {
          this._sweetToast(
            this.getText("FILE_SIZE_EXCEEDED", [
              oEvent.getSource().getMaximumFileSize(),
            ]),
            "E"
          );
        },
        onAttachDownload: function (oEvent) {
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
        onAttachDownloadLink: function (oEvent) {
          debugger;
          var oSource = oEvent.getSource();

          var oBindingContext = oSource.getBindingContext("employeeRequestView");
      
          if (oBindingContext) {

              var oRowData = oBindingContext.getObject();  
              this._selectedAttidData = oRowData;
      
              var Attid = oRowData.Attid;

              var oModel = this.getModel();
              var oUrlPath = oModel.sServiceUrl + "/EmployeeAttachmentSet(Attid=guid'" + Attid + "')/$value";
      
              window.open(oUrlPath);
          }
      },
        onCloseUploadFormDialog: function () {
          this._documentAddDialog.close();
        },        
        onUploadFileChange: function(oEvent) {
          var sFileName = oEvent.getParameter("newValue");
          this._sweetToast("Seçilen dosya: " + sFileName, "I");
        },
        onCancelUpload: function(oEvent) {
          this._uploadDocumentDialog.close();
        },
        
        onDownloadDocument: function(oEvent) {
          debugger;
          var oContext = oEvent.getSource().getBindingContext("employeeRequestView");
          var oDocument = oContext.getObject();
          var oModel = this.getModel();
          
          var sDownloadUrl = oModel.sServiceUrl + "/EmployeeAttachmentSet(Attid=guid'" + 
                            oDocument.Attid + "')/$value";
          window.open(sDownloadUrl, "_blank");
        },
        
        onDisplayDocument: function(oEvent) {
          debugger;
          var oContext = oEvent.getSource().getBindingContext("employeeRequestView");
          var oDocument = oContext.getObject();
          var oModel = this.getModel();
          
          var sDisplayUrl = oModel.sServiceUrl + "/EmployeeAttachmentSet(Attid=guid'" + 
                           oDocument.Attid + "')/$value";
          
          // PDF Viewer ile aç
          var sTitle = "Belge Görüntüle - " + oDocument.Filename;
          this._callPDFViewer(sDisplayUrl, sTitle);
        },
        
        onCloseViewDialog: function(oEvent) {
          this._viewDocumentDialog.close();
        },
        _getCurrentEmployeeBindingContext: function(oEvent) {
          debugger;
          const oSource = oEvent.getSource();
          
          // Bazen source'un kendisinde binding context olabilir
          let oBindingContext = oSource.getBindingContext("employeeRequestView");
          
          if (!oBindingContext) {
              // Parent'larda ara
              let oParent = oSource.getParent();
              while (oParent && !oBindingContext) {
                  oBindingContext = oParent.getBindingContext("employeeRequestView");
                  oParent = oParent.getParent();
              }
          }
          
          return oBindingContext;
      },
        formatRenewalText: function(sRenwl) {
          debugger;
          switch(sRenwl) {
            case "1":
              return "Evet";
            case "2":
              return "Hayır";
            default:
              return "Seçiniz";
          }
        },
        onSelectEmployeeFromDialog: function() {
          debugger;
          var oViewModel = this.getView().getModel("employeeRequestView");
          var oTable = sap.ui.core.Fragment.byId(
              "EmployeeSearchChangeFragment",
              "idListEmployeeChangeTable"
          );
          if (!oTable) {
              oTable = this.byId("idListEmployeeChangeTable");
          }
          
          if (!oTable) {
              sap.m.MessageToast.show("Tablo bulunamadı");
              return;
          }
          
          var aSelectedItems = oTable.getSelectedItems();
          
          if (aSelectedItems.length === 0) {
              sap.m.MessageToast.show("Lütfen en az bir personel seçiniz");
              return;
          }
 
          if (aSelectedItems.length > 1) {
              this._sweetToast(this.getText("SINGLE_EMPLOYEE_ONLY"), "W");
              return;
          }
          
          var aCurrentEmployees = oViewModel.getProperty("/dataList/DocumentRequestEmployeeSet") || [];

          if (aCurrentEmployees.length > 0) {
              this._sweetToast(this.getText("EMPLOYEE_ALREADY_EXISTS"), "W");
              return;
          }
          
          var aSelectedEmployees = [];
          var aCurrentSelected = oViewModel.getProperty("/selectedEmployees") || [];
          
          aSelectedItems.forEach(function(oItem) {
              var oContext = oItem.getBindingContext("employeeRequestView");
              var oEmployee = oContext.getObject();
      
              var bAlreadyExists = aCurrentSelected.some(function(oExisting) {
                  return oExisting.Pernr === oEmployee.Fldky;
              });
              
              if (!bAlreadyExists) {
                  aSelectedEmployees.push({
                      Pernr: oEmployee.Fldky,
                      Ename: oEmployee.Fldvl,
                      // isNew: true 
                  });
              }
          }.bind(this));
          
          if (aSelectedEmployees.length === 0) {
              sap.m.MessageToast.show("Seçilen personel zaten mevcut");
              return;
          }
      
          var aMergedSelected = aCurrentSelected.concat(aSelectedEmployees);
          oViewModel.setProperty("/selectedEmployees", aMergedSelected);
          
          this._oEmployeeChangeSearchDialog.close();
          oTable.removeSelections();
          this._updateEmployeeTable();
      },
        onSaveButtonEmployeeChangePress: function() {
            var oViewModel = this.getView().getModel("employeeRequestView");
            
       
            var aSelectedEmployees = oViewModel.getProperty("/selectedEmployees") || [];
            var aNewEmployees = aSelectedEmployees.filter(function(emp) {
                return emp.isNew === true;
            });
            
            if (aNewEmployees.length === 0) {
                sap.m.MessageToast.show("Eklenecek yeni personel bulunmamaktadır");
                return;
            }
            
            var aOriginalEmployees = oViewModel.getProperty("/dataList/_originalDocumentRequestEmployeeSet") || 
                                     oViewModel.getProperty("/dataList/DocumentRequestEmployeeSet") || [];
            

            aNewEmployees.forEach(function(oNewEmployee) {
          
                delete oNewEmployee.isNew;
                aOriginalEmployees.push(oNewEmployee);
            });
            
            oViewModel.setProperty("/dataList/DocumentRequestEmployeeSet", aOriginalEmployees);
         
            oViewModel.setProperty("/selectedEmployees", []);
            oViewModel.setProperty("/dataList/_originalDocumentRequestEmployeeSet", null);
            
      
            sap.m.MessageToast.show(aNewEmployees.length + " personel başarıyla eklendi");
        },


        _updateEmployeeTable: function() {
          debugger;
            var that = this;
            var oTable = this.byId("idEmployeeRequestChangeTable");
            var oViewModel = this.getView().getModel("employeeRequestView");
            var oModel = this.getView().getModel(); 
            var oFormData = oViewModel.getProperty("/request");
            if (!oTable) {
                return;
            }
      
            var aCurrentEmployees = oViewModel.getProperty("/dataList/DocumentRequestEmployeeSet") || [];
            var aSelectedEmployees = oViewModel.getProperty("/selectedEmployees") || [];
 
            var aTempData = aCurrentEmployees.concat(aSelectedEmployees);
     
            var aOriginalData = oViewModel.getProperty("/dataList/DocumentRequestEmployeeSet");
            oViewModel.setProperty("/dataList/DocumentRequestEmployeeSet", aTempData);
            oFormData.DocumentRequestEmployeeSet = aTempData;
            oFormData.Actio = "SAVE";
            // oViewModel.setProperty("/dataList/_originalDocumentRequestEmployeeSet", aOriginalData);
            oModel.create("/DocumentRequestFormSet", oFormData, {
              success: function(oData) {
                  that._sweetToast("Personel başarıyla eklendi.", "S");
                  
                  // View model'i güncelle
                  // oViewModel.setProperty("/dataList/DocumentRequestEmployeeSet", oData.DocumentRequestEmployeeSet.results);
                  oViewModel.setProperty(
                    "/dataList/DocumentRequestEmployeeSet",
                    _.cloneDeep(oData.DocumentRequestEmployeeSet.results)
                  );
                  // window.location.reload();
              },
              error: function(oError) {
                  console.log("Backend Create Error:", oError);
                  
                  that._sweetToast(sErrorMsg, "E");
              }
          });
        },

        onRemoveSelectedChangeEmployee: function(oEvent) {
          debugger;
            // var oSource = oEvent.getSource();
            // var oContext = oSource.getBindingContext("employeeRequestView");
            // var oEmployee = oContext.getObject();
            var oViewModel = this.getView().getModel("employeeRequestView");
            var oModel = this.getView().getModel(); 
            var oFormData = oViewModel.getProperty("/request");
            var oRowData = this._selectedRowData;
            var oViewModel = this.getView().getModel("employeeRequestView");
            var that = this;

            if (!oRowData || !oRowData.Drfid) {
              this._sweetToast("Personel verisi bulunamadı", "E");
              return;
            }

            this._refreshPersonelDataBeforeRemove(oRowData.Drfid, function() {
              var aCurrentEmployees = oViewModel.getProperty("/dataList/DocumentRequestEmployeeSet") || [];
              var oCurrentEmployee = aCurrentEmployees.find(function(emp) {
                return emp.Pernr === oRowData.Pernr;
              });

              if (!oCurrentEmployee) {
                that._sweetToast("Personel bulunamadı", "E");
                return;
              }

              if (oCurrentEmployee && oCurrentEmployee.EmployeeAttachmentSet && 
                  oCurrentEmployee.EmployeeAttachmentSet.results && 
                  oCurrentEmployee.EmployeeAttachmentSet.results.length > 0) {
                
                that._sweetToast("Bu personelin evrakları mevcut. Önce evrakları silin, sonra personeli silebilirsiniz.", "W");
                return;
              }

              var aSelectedEmployees = oViewModel.getProperty("/selectedEmployees") || [];
              var bIsNewEmployee = aSelectedEmployees.some(function(emp) {
                  return emp.Pernr === oRowData.Pernr && emp.isNew === true;
              });
              
              that._removeFromBackendData(oFormData,oRowData);
            });
        },
      
        _removeFromBackendData: function(oFormData, oRowData) {
        debugger;
        var oViewModel = this.getView().getModel("employeeRequestView");
        var oModel = this.getView().getModel(); 
        var that = this;
    
        var aCurrentEmployees = oViewModel.getProperty("/dataList/DocumentRequestEmployeeSet") || [];

        var aUpdatedEmployees = aCurrentEmployees.filter(function(emp) {
            return emp.Pernr !== oRowData.Pernr;
        });
        oViewModel.setProperty("/dataList/DocumentRequestEmployeeSet", aUpdatedEmployees);

        var aCurrentEmployeesNew = oViewModel.getProperty("/dataList/DocumentRequestEmployeeSet") || [];

        var aEmployeeChangeIds = aCurrentEmployeesNew.map(function (oEmployee) {
          return {
            Pernr: oEmployee.Pernr,
            Drfid: oEmployee.Drfid,
            Drfno: oEmployee.Drfno,
            Renwl: oEmployee.Renwl || "", 
            Rendc: oEmployee.Rendc || "", 
            Drfrs: oEmployee.Drfrs || "" 
          };
        });
        oFormData.DocumentRequestEmployeeSet = aEmployeeChangeIds;
        oFormData.Actio = "SAVE";
    
        oModel.create("/DocumentRequestFormSet", oFormData, {
            success: function(oData) {
                that._sweetToast("Personel başarıyla silindi.", "S");
                
                // View model'i güncelle
                oViewModel.setProperty("/dataList/DocumentRequestEmployeeSet", aUpdatedEmployees);
            },
            error: function(oError) {
                console.log("Backend Create Error:", oError);
                
                that._sweetToast(sErrorMsg, "E");
            }
        });
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
        onDocumentTypeSelectionChange: function(oEvent) {
          debugger;
          var oModel = this.getModel();
          var oComboBox = oEvent.getSource();
          var sSelectedKey = oComboBox.getSelectedKey();
          var sSelectedText = oComboBox.getSelectedItem() ? oComboBox.getSelectedItem().getText() : "";
          var oViewModel = this.getModel("employeeRequestView");
          var that = this;

          if (!sSelectedKey) {
            oViewModel.setProperty("/selectedDocumentType", "");
            oViewModel.setProperty("/selectedDocumentTypeText", "");
            return;
          }


          var sPath = "/DocumentInfoOperationSet(Zevrt='" + sSelectedKey + "')";
          console.log("sSelectedKey:", sSelectedKey);
          console.log("sPath:", sPath);

          oModel.read(sPath, {
            // filters: aFilters,
            success: function(oData) {
            
              var oTable = sap.ui.getCore().byId("idCandidateAttachmentList");
              if (oTable) {
                var aItems = oTable.getItems();
                var bDocumentExists = false;
                
                for (var i = 0; i < aItems.length; i++) {
                  var oContext = aItems[i].getBindingContext();
                  if (oContext) {
                    var oData = oContext.getObject();
                    if (oData.Zevrt === sSelectedKey) {
                      bDocumentExists = true;
                 
                      break;
                    }
                  }
                }
                
                if (bDocumentExists) {
                  sap.m.MessageBox.warning(
                    "Bu evrak türü (" + sSelectedText + ") zaten yüklü. Farklı bir evrak türü seçiniz.",
                    {
                      title: "Evrak Türü Uyarısı",
                      actions: [sap.m.MessageBox.Action.OK],
                      onClose: function() {
                        // ComboBox'ı temizle
                        oComboBox.setSelectedKey("");
                        oViewModel.setProperty("/selectedDocumentType", "");
                        oViewModel.setProperty("/selectedDocumentTypeText", "");
                      }
                    }
                  );
                  return;
                }
              }
              oViewModel.setProperty("/downloadButtonVisible", true);
              oViewModel.setProperty("/selectedDocumentType", sSelectedKey);
              oViewModel.setProperty("/selectedDocumentTypeText", sSelectedText);
            },
            error: function(oError) {
              that._sweetToast("Bu evrak türü için PDF indirme mevcut değil.", "W");
              // oComboBox.setSelectedKey("");
              // oViewModel.setProperty("/selectedDocumentType", "");
              // oViewModel.setProperty("/selectedDocumentTypeText", "");
            }
          });
        },

        onPdfDowlandPress: function(oEvent) {
          debugger;
          var oViewModel = this.getModel("employeeRequestView");
          var sSelectedDocumentType = oViewModel.getProperty("/selectedDocumentType");
          var sSelectedDocumentTypeText = oViewModel.getProperty("/selectedDocumentTypeText");
          
          if (!sSelectedDocumentType) {
            this._sweetToast("Lütfen önce bir evrak türü seçiniz.", "W");
            return;
          }

          var sPath = "/sap/opu/odata/sap/ZHCM_UX_DRF_SRV/DocumentInfoSet(Zevrt='" + sSelectedDocumentType + "')/$value";
          var sTitle = "Evrak: " + sSelectedDocumentTypeText;
          
          this._callPDFViewer(sPath, sTitle);
        },
        onMessagePress: function (oEvent) {
          oMessagePopover.toggle(oEvent.getSource());
        },
        onDeleteAttachment: function (oEvent) {
          debugger;
          var oModel = this.getModel();
          var oThis = this;
          var oViewModel = this.getModel("employeeRequestView");
          var Attid = oEvent.getSource().getBindingContext().getProperty("Attid");
          var sPath = "/EmployeeAttachmentSet(Attid=guid'" + Attid + "')";
          var _doDeleteAttachment = function () {
            var oMessageModel = oMessagePopover.getModel();
            var oMessageData = {};
            oMessageModel.setData(oMessageData);
            oViewModel.setProperty("/busy", true);
    
            oModel.remove(sPath, {
              success: function (oData, oResponse) {
                if (oResponse["headers"]["message"]) {
                  oThis._callMessageToast("Evrak silinirken hata", "E");
                } else {
                  oThis._callMessageToast("Evrak başarıyla silindi", "S");
                }
                oViewModel.setProperty("/busy", false);
              },
              error: function (oError) {
    
              }
            });
    
          };
          var oBeginButtonProp = {
            text: this.getText("DELETE"),
            type: "Reject",
            icon: "sap-icon://delete",
            onPressed: _doDeleteAttachment
    
          };
    
          this._callConfirmDialog(this.getText("CONFIRMATION_REQUIRED"), "Message", "Warning", this.getText("CONFIRM_DELETION"),
            oBeginButtonProp, null).open();
        },
        
        /**
         * Updates application settings from SharedData to the view model
         * @private
         */
        _updateApplicationSettings: function() {
          var oViewModel = this.getModel("employeeRequestView");
          var oApplicationSettings = SharedData.getApplicationSettings();
          
          if (oApplicationSettings) {
            oViewModel.setProperty("/applicationSettings", {
              DisplayMode: oApplicationSettings.DisplayMode || false,
              Edit: oApplicationSettings.Edit || false,
              CallerRole: oApplicationSettings.CallerRole || null
            });
          }
        },
      });
      
  }
);
