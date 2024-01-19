sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "com/lab2dev/schedulesbtpexp/model/formatter",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
], function(BaseController, formatter, Fragment, MessageBox) {
    'use strict';
    return BaseController.extend("com.lab2dev.schedulesbtpexp.controller.BaseController", {
        formatter: formatter,
        MessageBox: MessageBox,
        getModel: function(sNameModel){
            return this.getView().getModel(sNameModel)
        },
        setModel: function(oModel, sNameModel){
            return this.getView().setModel(oModel, sNameModel)
        },
        onOpenDialog: function(oEvent){
            const sDialog = this.DialogTypes.find(el => oEvent.getSource().getId().includes(el))

            if(!this[sDialog]){
                this[sDialog] = this._createFragment(sDialog)
                }

                this[sDialog].then(oDialog => {
                    this.getView().insertDependent(oDialog)
                    oDialog.open()
                })
        },
        onOpenPopover: function(sPopover, oAppointment){
            const oView = this.getView()

            if(!this[sPopover]){
                this[sPopover] = this._createFragment(sPopover).then(function(oDetailsPopover){
                    oView.addDependent(oDetailsPopover);
                    return oDetailsPopover;
                });
                }

                this[sPopover].then(oDetailsPopover => {
                    oDetailsPopover.setBindingContext(oAppointment.getBindingContext())
                    oDetailsPopover.openBy(oAppointment)
                })
        },
        _createFragment: function(sFragment){
            return Fragment.load({
                name: `com.lab2dev.schedulesbtpexp.view.fragments.${sFragment}`,
                id: this.getView().getId(),
                controller: this
              })
        },
        onCloseDialog: function(){
            const oDialog = this.getDialogOpen()
            debugger

            oDialog.then((oDialog) => {
                debugger
                oDialog.close()
            })
        },
        updateModel: function(oData, sModelName){

            oData.then(data => {
                this.getModel(sModelName).setData(data)
            })

        },
        getDialogOpen: function(){
            const sDialog = this.DialogTypes.find(
                    sDialog => {
                        const sId = this.getView().getDependents().find(el => el.isOpen()).getId()
                        return sId.includes(sDialog)
                    }
                )
            return this[sDialog]
        }
    })
});