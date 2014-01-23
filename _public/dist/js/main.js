/*! take-home | Version: 0.0.1 | Minified on 2014-01-23 */

angular.module("TH").controller("ctrlrGlobal",["$rootScope","$scope",function(a,b){"use strict";a.animate={},a.animate.direction="forward",b.setDirection=function(b){a.animate.direction=b}}]),angular.module("TH").directive("lazyLoad",["$rootScope",function(a){"use strict";return{link:function(b,c){function d(a){var b=a.getBoundingClientRect();return b.top>=0&&b.left>=0&&b.bottom<=(window.innerHeight||document.documentElement.clientHeight)&&b.right<=(window.innerWidth||document.documentElement.clientWidth)}function e(b){d(b)&&a.$broadcast("loadMorePost")}var f,g=document.getElementById("js_scrollable"),h=$("#js_scrollable").scrollTop(),i=!0;a.$on("setScrollPosition",function(){f=$("#js_scrollable").scrollTop()}),a.$on("scrollToPosition",function(){setTimeout(function(){$("#js_scrollable").scrollTop(f)},750)}),angular.element(c).ready(function(){var a=c[0].getElementsByTagName("tr").length,b=c[0].getElementsByTagName("tr")[a-1];e(b)}),angular.element(window).on("resize",function(){var a=c[0].getElementsByTagName("tr").length,b=c[0].getElementsByTagName("tr")[a-1];e(b)}),angular.element(g).on("scroll",function(){if(i){var a,b,d;i=!1,setTimeout(function(){i=!0},100),h<$("#js_scrollable").scrollTop()?(h=$("#js_scrollable").scrollTop(),a=c[0].getElementsByTagName("tr").length,b=c[0].getElementsByTagName("tr")[a-16],d=c[0].getElementsByTagName("tr")[0],e(b)):(i=!1,setTimeout(function(){i=!0},500))}})}}}]),function(){"use strict";window.PHI={},requirejs.config({paths:{"angular-route":"/vendor-bower/angular-route/angular-route.min","angular-animate":"/vendor-bower/angular-animate/angular-animate.min",jquery:"/vendor-bower/jquery/jquery.min","send-money":"/js/send",transactions:"/js/trans",overlay:"/phi/framework/components/overlay/overlay",alerts:"/phi/framework/components/alerts/alerts","common-inputs":"/phi/framework/directives/dir-common-components","action-table":"/phi/framework/directives/dir-action-table"},shim:{overlay:["jquery"],alerts:["jquery"]}}),require(["angular-route","angular-animate","send-money","transactions","common-inputs","action-table","overlay"],function(){var a=document.getElementsByTagName("body");$(a).on("click","#js_menuButton",function(){var a=document.getElementById("js_mainPanel");$(a).toggleClass("menuOpen"),$(a).toggleClass("menuClose"),setTimeout(function(){$(a).toggleClass("menuClose")},500)}),angular.bootstrap(document,["TH"])})}(),angular.module("TH").config(["$routeProvider",function(a){"use strict";var b=window.location.pathname;-1!==b.indexOf("send")?a.when("/",{template:document.getElementById("sendForm").innerHTML,controller:"ctrlrSendMoney"}).when("/sent-successfully",{template:document.getElementById("sentSuccess").innerHTML,controller:"ctrlrSentSuccess"}).otherwise({template:document.getElementById("sendForm").innerHTML,controller:"ctrlrSendMoney"}):-1!==b.indexOf("transactions")&&a.when("/",{template:document.getElementById("list").innerHTML,controller:"ctrlrTransactions"}).when("/new",{template:document.getElementById("new").innerHTML,controller:"ctrlrTransNew"}).when("/:id",{template:document.getElementById("view").innerHTML,controller:"ctrlrTransItem"}).otherwise({template:document.getElementById("list").innerHTML,controller:"ctrlrTransactions"})}]),angular.module("TH").factory("dataServices",["$http","$rootScope","$q","sectionData",function(a,b,c,d){"use strict";var e={};return d&&(e[d.type]||(e[d.type]={}),e[d.type]=d),{query:function(d){var f="/api/"+d.type,g=c.defer();return d.item&&(f=f+"/"+d.item,e[d.type]||(e[d.type]={}),e[d.type][d.item]||(e[d.type][d.item]={})),d.next&&(f=f+"?next="+d.next),d.previous&&(f=f+"?previous="+d.previous),d.next||d.previous||!e[d.type]||d.item?a.get(f).then(function(a){return d.item?e[d.type][d.item]=a.collection:e[d.type].collection=d.next?e[d.type].collection.concat(a.data.data):a.data,a}):(setTimeout(function(){b.$apply(function(){g.resolve(d.item?{data:e[d.type][d.item]}:{data:e[d.type]})})},0),g.promise)},search:function(b,c){return a.post(b,{terms:c})},create:function(b,c){return a.post(b,c).then(function(a){e[a.data.type]=a.data})},update:function(b,c){return a.put(b,c)},destroy:function(b){var c="Are you sure you want to delete this?",d=window.confirm(c);return d?a.delete(b):{success:function(){}}}}}]);