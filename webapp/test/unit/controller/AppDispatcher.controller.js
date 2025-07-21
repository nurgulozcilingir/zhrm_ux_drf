/*global QUnit*/

sap.ui.define([
	"combmchcmdrf/zhcm_ux_drf/controller/AppDispatcher.controller"
], function (Controller) {
	"use strict";

	QUnit.module("AppDispatcher Controller");

	QUnit.test("I should test the AppDispatcher controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
