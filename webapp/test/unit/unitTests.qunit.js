/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"combmchcmdrf/zhcm_ux_drf/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
