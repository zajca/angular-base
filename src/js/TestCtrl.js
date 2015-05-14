class TestCtrl{
  constructor(scope){
    this.scope = scope;
    console.log("test");
    this.test = "test";
  }
}

export default ['$scope',TestCtrl];
