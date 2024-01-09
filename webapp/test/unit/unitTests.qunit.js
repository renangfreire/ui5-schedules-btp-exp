/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comlab2dev/schedules-btp-exp/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
