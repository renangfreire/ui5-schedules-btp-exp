sap.ui.define([
    "com/lab2dev/schedulesbtpexp/controller/BaseController",
    "com/lab2dev/schedulesbtpexp/model/models",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, models, JSONModel) {
        "use strict";

        return Controller.extend("com.lab2dev.schedulesbtpexp.controller.Schedules", {
            onInit: function () {
                const oData = models.getSchedules();

                oData.then((data) => {
                    const oModel = new JSONModel(data);
                
                    console.log(oModel)
                    this.getView().setModel(oModel)
                })

            }
        });
    });
