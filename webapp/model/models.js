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
            getSchedules: async function(){
                const oData = await this.localStorage.getItem("appointments")
                
                if(!oData) return false

                return JSON.parse(oData)
            },
            postSchedules: function(oData){
                this.localStorage.setItem("appointments", JSON.stringify(oData))
            },
            getAppointments: function(){
                const oData = this.getSchedules()

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
            postAppointment: function(oNewSessionForm){
                // Logica com meu queridissmo localStorage por enquanto!
                // Como estou utilizando o local vou puxar tudo!

                const oAppointments = this.getSchedules();

                return oAppointments.then(oData => {
                    oData.Orators.forEach(orator => {
                        if(orator.Id === oNewSessionForm.OratorId){
                            orator.Appointments.push({...oNewSessionForm, Id: String(+orator.Appointments.at(-1)?.Id + 1 || 100)})
                        }
                    })

                   this.postSchedules(oData)

                   return oData
                })
            },
            putAppointment: function(oAppointment, sPath){
                // Codigo super funcional pra localStorage, mas nada escalável
                const aPathSplited = sPath.split('/')
                const iOratorId = oAppointment.OratorId
                const OratorPath = aPathSplited.at(2)
                const AppointmentIndex = aPathSplited.at(-1); 

                const oAppointments = this.getSchedules();

                return oAppointments.then(oData => {
                    const oOrator = oData.Orators.find(orator => orator.Id === iOratorId)

                    //Removing Appointment in the last position
                    oData.Orators.at(OratorPath).Appointments.splice(AppointmentIndex, 1)

                    if(oOrator.Appointments.at(AppointmentIndex)?.Id === oAppointment.Id){
                        oOrator.Appointments.splice(AppointmentIndex, 1)
                    }


                    oOrator.Appointments.push(oAppointment)

                    this.postSchedules(oData)

                    return oData
                })
                
            },
            deleteAppointment: function(){

            }
    };
});