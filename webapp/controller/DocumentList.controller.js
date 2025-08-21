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
	
	});
});