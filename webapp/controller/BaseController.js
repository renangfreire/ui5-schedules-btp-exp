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
                this[sDialog] = Fragment.load({
                    name: `com.lab2dev.schedulesbtpexp.view.fragments.${sDialog}`,
                    id: this.createId("").slice(0, -2),
                    controller: this
                  })
                }

                this[sDialog].then(oDialog => {
                    this.getView().insertDependent(oDialog)
                    oDialog.open()
                })
        },
        onCloseDialog: function(){
            const sDialog = this.DialogTypes.find(
                                sDialog => {
                                    const sId = this.getView().getDependents().find(el => el.isOpen()).getId()
                                    return sId.includes(sDialog)
                                }
                        )


            this[sDialog].then((oDialog) => {
                oDialog.close()
            })
        },
        updateModel: function(oData, sModelName){

            oData.then(data => {
                this.getModel(sModelName).setData(data)
            })

        }
    })
});