sap.ui.define([
	"com/bmc/hcm/drf/zhcmuxdrf/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.bmc.hcm.drf.zhcmuxdrf.controller.App", {

		onInit: function () {
			var oViewModel,
				fnSetAppNotBusy,
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

			oViewModel = new JSONModel({
				busy: true,
				delay: 0
			});
			this.setModel(oViewModel, "appView");

			fnSetAppNotBusy = function () {
				oViewModel.setProperty("/busy", false);
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			};

			// this.getOwnerComponent().getModel().metadataLoaded().then(fnSetAppNotBusy);
			// this.getOwnerComponent().getModel().attachMetadataFailed(fnSetAppNotBusy);
			// this.getOwnerComponent().getModel().setSizeLimit(9e3);
			// this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

			this.getOwnerComponent().getModel().metadataLoaded().
			then(fnSetAppNotBusy);
			this.getOwnerComponent().getModel().attachMetadataFailed(fnSetAppNotBusy);
			this.getOwnerComponent().getModel().setSizeLimit(9000);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		}
	});

});