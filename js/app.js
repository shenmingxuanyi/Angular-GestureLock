/**
 * Created by Z.JM on 2015/9/10.
 */
var msp = angular.module('app', ['ui.router', 'ui.gestureLock', 'app.controllers'])

    .run(['$rootScope', '$state', function ($rootScope, $state) {


    }])

    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('gesture', {
                url: '/gesture',
                abstract: true,
                cache: false,
                templateUrl: 'templates/nav.html',
                controller: 'GestureNavCtrl'
            })
            .state('gesture.signInGestureLock', {
                url: '/signInGestureLock',
                cache: false,
                views: {
                    '': {
                        templateUrl: 'templates/unLock.html',
                        controller: 'SignInGestureLockCtrl'
                    }
                }
            })
            .state('gesture.resetGestureLock', {
                url: '/resetGestureLock',
                cache: false,
                views: {
                    '': {
                        templateUrl: 'templates/resetLock.html',
                        controller: 'ResetGestureLockCtrl'
                    }
                }
            })
            .state('gesture.setGestureLock', {
                url: '/setGestureLock',
                cache: false,
                views: {
                    '': {
                        templateUrl: 'templates/setLock.html',
                        controller: 'SetGestureLockCtrl'
                    }
                }
            });

        $urlRouterProvider.otherwise('gesture/setGestureLock');
    });
