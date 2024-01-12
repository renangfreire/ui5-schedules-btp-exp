sap.ui.define([
], function() {
    'use strict';
    
    return {
        formatDate: function(sDate){
            const dateFormated = new Date(sDate)
            return dateFormated
        },
        defineTypeAppointment: function(sSection){
            switch(sSection){
                case "rosa": {
                    return "Type01"
                }
                case "roxo": {
                    return "Type02"
                }
                case "vermelho": {
                    return "Type09"
                }
                case "verde": {
                    return "Type12"
                }
                default: {
                    return "Type04"
                }
            }
        }
    }
});