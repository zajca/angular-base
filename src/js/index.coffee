require "angular"
TestCtrl = require "./TestCtrl"
console.log TestCtrl
angular.module("APP",[])
.controller('TestCtrl',TestCtrl)
