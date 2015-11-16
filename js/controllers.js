/**
 * Created by Z.JM on 2015/9/10.
 */
angular.module('app.controllers', ['app.services'])
    .controller('GestureNavCtrl', ['$scope', '$state', function ($scope, $state) {
        
    }])
    .controller('SignInGestureLockCtrl', ['$scope', '$state', '$gestureLock', '$timeout', 'GestureLockService', '$window', function ($scope, $state, $gestureLock, $timeout, GestureLockService, $window) {

        $scope.title = "绘制图案解锁";

        var password = GestureLockService.getPassword();

        var gestureLockCanvas = document.getElementById("gestureLock");
        gestureLockCanvas.width = window.innerWidth < (window.innerHeight - 200) ? window.innerWidth : (window.innerHeight - 200);
        gestureLockCanvas.height = gestureLockCanvas.width;

        var gestureLock = new $gestureLock(gestureLockCanvas, {
            matrix: 3
        });

        gestureLock.gestureStart = function (e) {
            return;
        };

        gestureLock.gestureEnd = function (e) {

            var validateResult = gestureLock.validatePassword(password, gestureLock.getGesturePassword());

            if (validateResult) {
                gestureLock.viewStatus("success", {ring: true});
                $timeout(function () {
                    gestureLock.reset();
                }, 500);
            } else {
                gestureLock.viewStatus("error", {ring: true});
                $timeout(function () {
                    gestureLock.reset();
                }, 500);
            }
        };

        gestureLock.init();

        angular.element($window).bind('resize', function () {
            gestureLockCanvas.width = window.innerWidth < (window.innerHeight - 200) ? window.innerWidth : (window.innerHeight - 200);
            gestureLockCanvas.height = gestureLockCanvas.width;
            gestureLock.init();
        });

    }])
    .controller('ResetGestureLockCtrl', ['$scope', '$state', '$gestureLock', '$timeout', 'GestureLockService', '$window', function ($scope, $state, $gestureLock, $timeout, GestureLockService, $window) {

        var oldPassword = GestureLockService.getPassword();
        var isValidate = false;
        $scope.title = "绘制图案设置锁";

        var passwords = [2];
        var count = 1;

        var gestureLockCanvas = document.getElementById("gestureLock");
        gestureLockCanvas.width = window.innerWidth < (window.innerHeight - 200) ? window.innerWidth : (window.innerHeight - 200);
        gestureLockCanvas.height = gestureLockCanvas.width;
        var gestureLock = new $gestureLock(gestureLockCanvas, {
            matrix: 3
        });

        if (!isValidate) {
            $scope.title = "请输入原密码";
        }

        gestureLock.gestureEnd = function (e) {
            if (!isValidate) {
                if (gestureLock.validatePassword(oldPassword, gestureLock.getGesturePassword())) {

                    gestureLock.viewStatus("success", {ring: true});
                    $scope.title = "绘制图案设置锁";

                    $timeout(function () {
                        isValidate = true;
                        gestureLock.reset();
                    }, 500);
                } else {
                    gestureLock.viewStatus("error", {ring: true});
                    $scope.title = "密码输入错误,请重新输入";

                    $timeout(function () {
                        gestureLock.reset();
                    }, 500);
                }
            } else {

                passwords[count % 2] = gestureLock.getGesturePassword();

                // 输入单次了
                if (count % 2 === 1) {
                    gestureLock.viewStatus("success", {ring: true});
                    $scope.title = "请在输入一次";
                    $timeout(function () {
                        gestureLock.reset();
                    }, 500);
                } else if (count % 2 === 0) {
                    if (gestureLock.validatePassword(passwords[0], passwords[1])) {
                        gestureLock.viewStatus("success", {ring: true});
                        GestureLockService.setPassword(passwords[0]);

                        $scope.title = "设置成功";
                        $timeout(function () {
                            gestureLock.reset();
                        }, 500);

                    } else {
                        $scope.title = "两次设置不一致，请重新设置";
                        gestureLock.viewStatus("error", {ring: true});
                        $timeout(function () {
                            gestureLock.reset();
                        }, 500);
                    }
                }

                ++count;

            }

        };

        gestureLock.init();

        angular.element($window).bind('resize', function () {
            gestureLockCanvas.width = window.innerWidth < (window.innerHeight - 200) ? window.innerWidth : (window.innerHeight - 200);
            gestureLockCanvas.height = gestureLockCanvas.width;
            gestureLock.init();
        });

    }])
    .controller('SetGestureLockCtrl', ['$scope', '$state', '$gestureLock', '$timeout', 'GestureLockService', '$window', function ($scope, $state, $gestureLock, $timeout, GestureLockService, $window) {

        $scope.title = "绘制图案设置锁";

        var passwords = [2];
        var count = 1;

        var gestureLockCanvas = document.getElementById("gestureLock");

        function getWidth() {
            if (window.innerWidth < window.innerHeight) {
                return window.innerWidth;
            } else {
                return window.innerHeight - 200;
            }
        }

        gestureLockCanvas.width = window.innerWidth < (window.innerHeight - 200) ? window.innerWidth : (window.innerHeight - 200);
        gestureLockCanvas.height = gestureLockCanvas.width;
        var gestureLock = new $gestureLock(gestureLockCanvas, {
            matrix: 3
        });

        gestureLock.gestureEnd = function (e) {
            passwords[count % 2] = gestureLock.getGesturePassword();

            // 输入单次了
            if (count % 2 === 1) {
                gestureLock.viewStatus("success", {ring: true});
                $scope.title = "请在输入一次";
                $timeout(function () {
                    gestureLock.reset();
                }, 500);
            } else if (count % 2 === 0) {
                if (gestureLock.validatePassword(passwords[0], passwords[1])) {
                    gestureLock.viewStatus("success", {ring: true});
                    GestureLockService.setPassword(passwords[0]);

                    $scope.title = "设置成功";
                    $timeout(function () {
                        gestureLock.reset();
                    }, 500);

                } else {

                    $scope.title = "两次设置不一致，请重新设置";
                    gestureLock.viewStatus("error", {ring: true});
                    $timeout(function () {
                        gestureLock.reset();
                    }, 500);
                }
            }

            ++count;
        };

        gestureLock.init();

        angular.element($window).bind('resize', function () {
            gestureLockCanvas.width = window.innerWidth < (window.innerHeight - 200) ? window.innerWidth : (window.innerHeight - 200);
            gestureLockCanvas.height = gestureLockCanvas.width;
            gestureLock.init();
        });

    }]);
