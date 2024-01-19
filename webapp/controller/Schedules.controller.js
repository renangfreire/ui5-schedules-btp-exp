sap.ui.define([
    "com/lab2dev/schedulesbtpexp/controller/BaseController",
    "com/lab2dev/schedulesbtpexp/model/models",
    "sap/ui/model/json/JSONModel",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, models, JSONModel, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("com.lab2dev.schedulesbtpexp.controller.Schedules", {
            DialogTypes: [
                "CreateNewSession",
                "SessionDetails",
                "EditSession",
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
                        {
                            key: "180",
                            text: "3h"
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
                const oFormData = {
                    EventName: "",
                    EventType: "",
                    CompanyName: "Preenchimento automático",
                    OratorId: "",
                    Room: "",
                    Sector: "",
                    StartDate: "",
                    Duration: "" 
                }

                const oModel = new JSONModel(oFormData)

                this.setModel(oModel, "newSessionForm")

                this.onOpenDialog(oEvent)
            },
            handleEditDialog: function(oEvent){
                const oAppointment = oEvent.getSource().getBindingContext()
                const oData = oAppointment.getObject()

                // Removing unused property´s
                const {tentative, type, ...oRestUsed} = oData


                const oFormData = {
                    ...oRestUsed,
                    StartDate: new Date(oRestUsed.StartDate),
                    OratorId: this._getOratorId(oAppointment),
                    Duration: this._getDuration(oData),
                    AppointmentDetails: {
                        path: oAppointment.getPath()
                    }
                }

                const oModel = new JSONModel(oFormData);

                this.getView().setModel(oModel, "editSessionForm")

                this.onOpenDialog(oEvent)
            },
            _getOratorId: function(oAppointment){
                const oModel = oAppointment.getModel()
                const sPath = oAppointment.getPath()
                const sOratorPath = sPath.match(/\/Orators\/(\d+)/)[0]
            
                const oOrator = oModel.getProperty(sOratorPath)

                return oOrator.Id
            },
            _getDuration: function(oData){
                const iStartTimeTimestamp = new Date(oData.StartDate).getTime()
                const iEndDateTimestamp = new Date(oData.EndDate).getTime()

                const totalDuration = (iEndDateTimestamp - iStartTimeTimestamp) / 1000 / 60;

                return String(totalDuration)
            },
            filterSessions: function(){
                // Filtrando as Sessões para caso o usuário não possua nenhuma sessão no momento
                // Melhorar é filtrar com base no tempo selecionado!
                const filter = new Filter("Appointments", (appointment) => appointment.length ? true : false)
            
                const aCalendar = this.byId("sessionsCalendar")
                const aRows = aCalendar.getBinding("rows")

                aRows.filter([filter], "Application")
            },
            handleAppointmentSelect: function(oEvent){
                const oAppointment = oEvent.getParameter("appointment")
                const sPopover = this.DialogTypes.find(el => el === "SessionDetails")

                this.onOpenPopover(sPopover, oAppointment)
            },
            handleChangeInterval: function(oEvent){
                // Função que vai me deixar criar o filtro bom!
                // Porém é válido fazer isso? => Ver com o Marcelo!
                console.log("changed Interval")
            },
            onSelectOrator: function(oEvent){
                try {
                    const oModel = this.getModel();

                    const sSelectedKey = oEvent.getParameter("selectedItem").getProperty("key");

                    const oDialog = this.getDialogOpen()

                    oDialog.then(dialog => {
                        const sDialogId = dialog.getId()
                        let oInputCompany

                        if(sDialogId.includes("EditSession")){
                            oInputCompany = this.byId("companyName")
                        }

                        if(sDialogId.includes("CreateNewSession")){
                            oInputCompany = this.byId("inputCompanyName")
                        }

                        if(!oInputCompany){
                            return
                        }

                        const oSelectedOrator = oModel.getData().Orators.find(el => el.Id === sSelectedKey)       

                        oInputCompany.setValue(oSelectedOrator.CompanyName)
                    })
                } catch (error) {
                    this.MessageBox.error("Error: User not assigned in any company!")
                }
            },
            handleAddNewSession: async function(){
                // Format EndDate...
                try {
                    // create new object from model
                    const oDialog = this.byId("CreateNewSession");
                    const oNewSessionForm = {...this.getModel("newSessionForm").getData()}
                    
                    const ExistsValueEmpty = Object.values(oNewSessionForm).some(value => value.trim() === '')
                    
                    if(ExistsValueEmpty){
                        throw new Error("Por favor, preencha todos os campos!")
                    }

                    oDialog.setBusy(true)
                    
                    oNewSessionForm["EndDate"] = this.getEndDate(oNewSessionForm.Duration, oNewSessionForm.StartDate)
                    oNewSessionForm.StartDate = new Date(oNewSessionForm.StartDate).toISOString()
                    
                    // Verify if exist an another appointment in same time!    
                    const oAppointments = await models.getAppointments()

                    const oOrator = oAppointments.Orators.find(orator => orator.Id === oNewSessionForm.OratorId)

                    const ExistsAlreadySession = this.verifyAlreadySession(oOrator, oNewSessionForm)

                    if(ExistsAlreadySession){
                        throw new Error("Já existe alguma sessão agendada para esse palestrante durante os horários selecionados, por favor selecione outro horário!")
                    }

                    const {Duration, ...oData} = oNewSessionForm

                    const oUpdatedData = models.postSchedule(oData)
                    
                    this.MessageBox.success("Sessão criada com sucesso!")
                    oDialog.setBusy(false)
                    
                    // Como estou utilizando o localStorage, vou atualizar a model denovo!
                    this.updateModel(oUpdatedData)

                    this.onCloseDialog()
                    
                } catch (error) {
                    this.byId("CreateNewSession").setBusy(false)

                    this.MessageBox.warning(error.message)
                }
            },
            handleEditSession: async function(){
                try {
                    const oDialog = this.byId("EditSession");

                    const {AppointmentDetails, ...oEditSessionForm} = {...this.getModel("editSessionForm").getData()}

                    oEditSessionForm.StartDate = oEditSessionForm.StartDate.toISOString()
                    oEditSessionForm["EndDate"] = this.getEndDate(oEditSessionForm.Duration, oEditSessionForm.StartDate)

                    const ExistsValueEmpty = Object.values(oEditSessionForm).some(value =>  value.trim() === '')
                        
                    if(ExistsValueEmpty){
                        throw new Error("Por favor, preencha todos os campos!")
                    }

                    // Verify if exist an another appointment in same time!    
                    const oAppointments = await models.getAppointments()

                    const oOrator = oAppointments.Orators.find(orator => orator.Id === oEditSessionForm.OratorId)

                    const bCheckHaveChanges = this._verifySessionDates(oEditSessionForm, oOrator)


                    if(bCheckHaveChanges){
                        throw new Error("Não houve alterações")
                    }

                    const ExistsAlreadySession = this.verifyAlreadySession(oOrator, oEditSessionForm, oDialog.getId())

                    if(ExistsAlreadySession){
                        throw new Error("Já existe alguma sessão agendada para esse palestrante durante os horários selecionados, por favor selecione outro horário!")
                    }

                    const oUpdatedData = models.putSchedule(oEditSessionForm, AppointmentDetails.path)

                    this.updateModel(oUpdatedData)
                    this.onCloseDialog()
                    
                    this.MessageBox.success("Componente Editado!")
                } catch (error) {
                    this.MessageBox.warning(error.message)
                }
            },
            handleDeleteSession: function(oEvent){
            },
            _verifySessionDates: function(oSessionForm, oOrator){
                const oAppointment = oOrator.Appointments.find(appointment => appointment.Id === oSessionForm.Id)

                // Caso o Orator seja alterado
                if(!oAppointment){
                    return
                }

                if(oAppointment.StartDate === oSessionForm.StartDate && oAppointment.EndDate === oSessionForm.EndDate ){
                    return true
                }

            },
            getEndDate: function(iMinutes, sStartDate){
                const DurationTimestamp = iMinutes * 60 * 1000;

                const startDateTimestamp = new Date(sStartDate).getTime();
                const endDate = new Date(DurationTimestamp + startDateTimestamp)

                return endDate.toISOString()
            },
            verifyAlreadySession: function(oOrator, oFormData, sDialogId = ""){
                const {StartDate, EndDate} = oFormData
                const startDateTimestamp = new Date(StartDate).getTime()
                const endDateTimestamp = new Date(EndDate).getTime()

                return oOrator.Appointments.some(appointment => {
                    const appointmentStart = new Date(appointment.StartDate).getTime()
                    const appointmentEnd = new Date(appointment.EndDate).getTime()

                    if(sDialogId.includes("EditSession") && appointment.Id === oFormData.Id){
                        return
                    }

                    if(startDateTimestamp > appointmentStart && startDateTimestamp < appointmentEnd){
                        return true
                    }
                    if(endDateTimestamp > appointmentStart && endDateTimestamp < appointmentEnd){
                        return true
                    }
                    if(startDateTimestamp === appointmentStart && (endDateTimestamp > appointmentEnd || endDateTimestamp < appointmentEnd)){
                        return true
                    }
                    // Essa linha de code salva as edições, porém da algum problema quando cria?
                    if(startDateTimestamp < appointmentStart && endDateTimestamp === appointmentEnd){
                        return true
                    }
                    if(startDateTimestamp === appointmentStart && endDateTimestamp === appointmentEnd){
                        return true
                    }

                    return false
                })
            }
        });
    });