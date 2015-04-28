class TestCtrl
  constructor: (@scope) ->
    console.log "test"
    @test = "test"

module.exports = ['$scope',TestCtrl]
