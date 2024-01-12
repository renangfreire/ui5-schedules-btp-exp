sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], 
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device) {
        "use strict";
       
        return {
            localStorage: window.localStorage,
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },
            initLocalStorage: async function(){
                const oModel = new JSONModel();
                    await oModel.loadData("/model/appointments.json")

                    if(oModel.getData() ){
                        this.localStorage.setItem("appointments", JSON.stringify(oModel.getData()))

                        return oModel.getData()
                    }

                    throw new Error("Error")
                
            },
            getAppointments: async function(){
                const oData = await this.localStorage.getItem("appointments")
                
                if(!oData) return false

                return JSON.parse(oData)
            },
            postAppointments: function(oData){
                this.localStorage.setItem("appointments", JSON.stringify(oData))
            },
            getSchedules: function(){
                const oData = this.getAppointments()

                return oData
                    .then(                        
                        data => {
                            if(!data){
                                return this.initLocalStorage()
                            }

                            return data
                        }
                    )
                    .catch(err => console.log(err))
            },
            postSchedule: function(oNewSessionForm){
                // Logica com meu queridissmo localStorage por enquanto!
                // Como estou utilizando o local vou puxar tudo!

                const oAppointments = this.getAppointments();

                return oAppointments.then(oData => {
                    oData.Orators.forEach(orator => {
                        if(orator.Id === oNewSessionForm.OratorId){
                            const {OratorId, ...newSessionData} = oNewSessionForm

                            orator.Appointments.push(newSessionData)
                        }
                    })

                   this.postAppointments(oData)

                   return oData
                })
            }
    };
});