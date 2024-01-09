/*global QUnit*/

sap.ui.define([
	"comlab2dev/schedules-btp-exp/controller/Schedules.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Schedules Controller");

	QUnit.test("I should test the Schedules controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
