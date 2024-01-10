sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/lab2dev/schedulesbtpexp/model/formatter"
], function(BaseController, formatter) {
    'use strict';
    return BaseController.extend("com.lab2dev.schedulesbtpexp.controller.BaseController", {
        formatter: formatter,

        
    })
});