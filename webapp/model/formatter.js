sap.ui.define([
], function() {
    'use strict';
    
    return {
        formatDate: function(sDate){
            const dateFormated = new Date(...sDate)
            return dateFormated
        }
    }
});