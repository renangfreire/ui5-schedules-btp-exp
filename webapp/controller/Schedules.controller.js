sap.ui.define([
    "com/lab2dev/schedulesbtpexp/controller/BaseController",
    "com/lab2dev/schedulesbtpexp/model/models",
    "sap/ui/model/json/JSONModel",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, models, JSONModel, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("com.lab2dev.schedulesbtpexp.controller.Schedules", {
            DialogTypes: [
                "NewSession"
            ],
            onInit: function () {
                const oData = models.getSchedules();

                oData.then((data) => {
                    const oModel = new JSONModel(data);
                
                    this.getView().setModel(oModel)

                    this.filterSessions() 
                })

                const oModel = new JSONModel({
                    timeMock: [
                        // Key = time in minutes
                        {
                            key: "60",
                            text: "1h"
                        },
                        {
                            key: "120",
                            text: "2h"
                        },
                    ],
                    setorsMock: [
                        {
                            key:  "rosa",
                            text: "Setor Rosa"
                        },
                        {
                            key: "vermelho",
                            text: "Setor Vermelho"
                        },
                        {
                            key: "verde", 
                            text: "Setor Verde"
                        },
                        {
                            key: "roxo",
                            text: "Setor Roxo"
                        }
                    ],
                    roomsMock: [
                        {
                            key: "ronaldo",
                            text: "Sala Ronaldo"
                        },
                        {
                            key: "socrates",
                            text: "Sala Sócrates"
                        },
                        {
                            key: "dunga",
                            text: "Sala Dunga"
                        },
                        {
                            key: "taffarel",
                            text: "Sala Taffarel"
                        },
                        {
                            key: "neymar",
                            text: "Sala Neymar"
                        },
                    ],
                    typeEventMock: [
                        {
                            key: "lecture",
                            text: "Lecture"
                        },
                        {
                            key: "keynote",
                            text: "Keynote"
                        },
                        {
                            key: "handson",
                            text: "Hands-on"
                        },
                        {
                            key: "onboarding",
                            text: "Onboarding"
                        },
                    ]
                })
                             


                this.getView().setModel(oModel, "viewDetails")
            },
            openNewSessionDialog: function(oEvent){
                this.onOpenDialog(oEvent)
            },
            filterSessions: function(){
                // Filtrando as Sessões para caso o usuário não possua nenhuma sessão no momento
                // Melhorar é filtrar com base no tempo selecionado!
                const filter = new Filter("appointments", (appointment) => appointment.length ? true : false)
            
                const aCalendar = this.byId("planningCalendar")
                const aRows = aCalendar.getBinding("rows")

                aRows.filter([filter], "Application")
                console.log(aRows)
            },
            handleChangeInterval: function(oEvent){
                // Função que vai me deixar criar o filtro bom!
                // Porém é válido fazer isso? => Ver com o Marcelo!
                console.log("changed Interval")
            }
        });
    });
