/*! take-home | Version: 0.0.1 | Minified on 2014-01-22 */

angular.module("TH").controller("ctrlrSendMoney",["$scope","$rootScope","dataServices",function(a,b,c){"use strict";a.send={},a.send.currency="USD",a.currencySymbol="$",a.showSpinner=!1,a.changeSymbol=function(b){switch(console.log(b),b){case"USD":a.currencySymbol="$";break;case"EUR":a.currencySymbol="€";break;case"JPY":a.currencySymbol="¥"}},a.sendMoney=function(){var d="/api/send";a.sendMoneyForm.$valid?a.send.amount>0?(a.sending="active",a.showSpinner=!0,c.create(d,a.send).success(function(){a.sending=!1,b.animate.direction="forward",window.location.hash="#/sent-successfully"})):a.formMessage="Error: Amount cannot be a negative number.":a.formMessage="Error: Please feel in the required fields."},a.clearForm=function(){a.send={},a.sendMoneyForm.$setPristine()}}]);