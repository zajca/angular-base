require "angular"
TestCtrl = require "./TestCtrl"
console.log TestCtrl
angular.module("PRIAApp",[])
.controller('TestCtrl',TestCtrl)
