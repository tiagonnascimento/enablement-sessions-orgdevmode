vlocity.cardframework.registerModule.controller('RestartOSController', ['$scope', '$rootScope', '$timeout', '$controller', function($scope, $rootScope, $timeout, $controller) {
    'use strict';
    $scope.customTemplates = baseCtrl.prototype.$scope.bpTree.propSetMap.elementTypeToHTMLTemplateMapping;

    $scope.restartOS = function () {
        location.reload();
    }
}]);