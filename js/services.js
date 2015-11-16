/**
 * Created by Z.JM on 2015/9/10.
 */

angular.module('app.services', [])
    .factory('GestureLockService', [function () {
        return {
            getPassword: function () {
                return JSON.parse(window.localStorage.getItem('GestureLockPassword'));
            },
            setPassword: function (_password) {
                window.localStorage.setItem('GestureLockPassword', JSON.stringify(_password));
            }
        };
    }]);
