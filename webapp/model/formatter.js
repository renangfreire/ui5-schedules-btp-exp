sap.ui.define([
], function() {
    'use strict';
    
    return {
        convertDate: function(sDate){
            const dateFormated = new Date(sDate)
            return dateFormated
        },
        formatDate: function(sDate){
            const dateFormated = new Date(sDate)
            const sLocale = 'pt-br' // Usar i18n
            const oOptions = {
                year: 'numeric',
                month: 'short', 
                day: 'numeric', 
                hour: 'numeric', 
                minute: 'numeric'
            }
            return dateFormated.toLocaleString(sLocale, oOptions)
        },
        defineColorTypeAppointment: function(sSection){
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
        },
        defineTypeAppointment: function(sType){
            switch(sType){
                case "lecture": {
                    return "Lecture"
                }
                case "keynote":{
                    return "Keynote"
                }
                case "handson": {
                    return "Hands-on"
                }
                case "onboarding": {
                    return "Onboarding"
                }
                default: {
                    return ""
                }
            }
        },
        firstWordToUpper: function(sString){
            if(!sString) return

            const [firstPosition, ...rest] = sString

            return firstPosition.toUpperCase() + rest.join("")
        }
    }
});