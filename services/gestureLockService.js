/**
 * Created by Z.JM on 2015/11/15.
 */

'use strict';
angular.module("ui.gestureLock", [])
    .factory("$gestureLock", [function () {

        /***
         * 画密码圆环
         * @param point     object{x,y}  圆环的圆心坐标 X,Y
         * @param strokeStyle   string   填充颜色
         * @param lineWidth     number  线宽
         */
        var drawRing = function (context2d, point, radii, lineWidth, strokeStyle) {
            context2d.strokeStyle = strokeStyle;
            context2d.lineWidth = lineWidth;
            context2d.beginPath();
            context2d.arc(point.x, point.y, radii, 0, Math.PI * 2, true);
            context2d.closePath();
            context2d.stroke();
        };

        /***
         * 画密码圆环
         * @param points    Array<object{x,y}>
         * @param strokeStyle   string  填充颜色
         * @param lineWidth     number  线宽
         */
        var drawRings = function (context2d, points, radii, lineWidth, strokeStyle) {
            for (var i = 0, n = points.length; i < n; i++) {
                drawRing(context2d, points[i], radii, lineWidth, strokeStyle);
            }
        };

        /***
         * 圆心填充
         * @param fillPoints    string   填充实心点集合
         * @param fillStyle     string   填充颜色
         */
        var drawPoint = function (context2d, point, radii, fillStyle) {
            context2d.fillStyle = fillStyle;
            context2d.beginPath();
            context2d.arc(point.x, point.y, radii, 0, Math.PI * 2, true);
            context2d.closePath();
            context2d.fill();
        };

        /***
         * 圆心填充
         * @param fillPoints    string   填充实心点集合
         * @param fillStyle     string   填充颜色
         */
        var drawPoints = function (context2d, points, radii, fillStyle) {
            for (var i = 0, n = points.length; i < n; i++) {
                drawPoint(context2d, points[i], radii, fillStyle);
            }
        };


        /***
         * 划触点轨迹线条
         * @param cipherPoints  节点集合
         * @param lineWidth number  线条宽度
         */
        var drawLine = function (context2d, points, lineWidth, strokeStyle) {
            context2d.strokeStyle = strokeStyle;
            context2d.lineWidth = lineWidth;

            context2d.beginPath();
            for (var i = 0, n = points.length; i < n; i++) {
                if (i > 0) {
                    context2d.lineTo(points[i].x, points[i].y);
                } else {
                    context2d.moveTo(points[0].x, points[0].y);
                }
            }
            context2d.stroke();
            context2d.closePath();

        };


        // 获取touch点相对于canvas的坐标
        var getPositionbyTouchEvent = function (e) {
            var rect = e.currentTarget.getBoundingClientRect();
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        };

        /***
         *
         * @param gestureLock 手势对象
         * @param e
         */
        function touchStartController(gestureLock, e) {

            if (typeof(gestureLock.gestureStart) == "function") {
                gestureLock.gestureStart.call(gestureLock, e);
            }
            var point = getPositionbyTouchEvent(e);

            for (var i = 0; i < gestureLock.activityPoints.length; i++) {
                if (Math.abs(point.x - gestureLock.activityPoints[i].x) < gestureLock.radii && Math.abs(point.y - gestureLock.activityPoints[i].y) < gestureLock.radii) {
                    gestureLock.cipherPoints.push(gestureLock.activityPoints[i]);
                    gestureLock.activityPoints.splice(i, 1);
                    //根据有效节点+当前节点重新划线
                    drawLine(gestureLock.context2d, gestureLock.cipherPoints, gestureLock.config.default.lineWidth, gestureLock.config.default.lineStrokeStyle);
                    //根据有效节点恢复圆心
                    drawPoints(gestureLock.context2d, gestureLock.cipherPoints, gestureLock.radii / 2, gestureLock.config.default.pointStrokeStyle);

                    break;
                }
            }

        }

        /***
         * touchmove事件回调 更新选中节点
         * @param gestureLock
         * @param currentPosition
         */
        function touchMoveController(gestureLock, e) {
            if (typeof(gestureLock.gestureChange) == "function") {
                gestureLock.gestureChange.call(gestureLock, e);
            }

            var currentPosition = getPositionbyTouchEvent(e);
            for (var i = 0; i < gestureLock.activityPoints.length; i++) {
                if (Math.abs(currentPosition.x - gestureLock.activityPoints[i].x) < gestureLock.radii && Math.abs(currentPosition.y - gestureLock.activityPoints[i].y) < gestureLock.radii) {
                    gestureLock.cipherPoints.push(gestureLock.activityPoints[i]);
                    gestureLock.activityPoints.splice(i, 1);

                    if (typeof(gestureLock.gesturePointChange) == "function") {
                        gestureLock.gesturePointChange.call(gestureLock, e);
                    }

                    break;
                }
            }

            //清除所有经过的划线
            gestureLock.context2d.clearRect(0, 0, gestureLock.canvas.width, gestureLock.canvas.height);
            //画出密码单元格
            drawRings(gestureLock.context2d, gestureLock.originalPoints, gestureLock.radii, gestureLock.config.default.ringWidth, gestureLock.config.default.ringStrokeStyle);
            //根据有效节点+当前节点重新划线
            drawLine(gestureLock.context2d, gestureLock.cipherPoints.concat(currentPosition), gestureLock.config.default.lineWidth, gestureLock.config.default.lineStrokeStyle);
            //根据有效节点恢复圆心
            drawPoints(gestureLock.context2d, gestureLock.cipherPoints, gestureLock.radii / 2, gestureLock.config.default.pointStrokeStyle);
        };

        function touchEndController(gestureLock, e) {
            //清除所有经过的划线
            gestureLock.context2d.clearRect(0, 0, gestureLock.canvas.width, gestureLock.canvas.height);
            //画出密码单元格
            drawRings(gestureLock.context2d, gestureLock.originalPoints, gestureLock.radii, gestureLock.config.default.ringWidth, gestureLock.config.default.ringStrokeStyle);
            //根据有效节点+当前节点重新划线
            drawLine(gestureLock.context2d, gestureLock.cipherPoints, gestureLock.config.default.lineWidth, gestureLock.config.default.lineStrokeStyle);
            //根据有效节点恢复圆心
            drawPoints(gestureLock.context2d, gestureLock.cipherPoints, gestureLock.radii / 2, gestureLock.config.default.pointStrokeStyle);

            if (typeof(gestureLock.gestureEnd) == "function") {
                gestureLock.gestureEnd.call(gestureLock, e);
            }
        }


        /**
         * 绑定touchstart、touchmove、touchend事件
         * */
        var bindEvent = function (_self) {

            document.addEventListener('touchmove', function (e) {
                //阻止document 的 touchmove事件
                e.preventDefault();
            }, false);

            _self.canvas.addEventListener("touchstart", function (e) {
                //某些android的touchmove不宜触发 所以增加此行代码
                e.preventDefault();

                if (!_self.touchFlag && !_self.disabled) {
                    _self.touchFlag = true;
                    _self.disabled = true;
                    touchStartController(_self, e);
                }
            }, false);

            _self.canvas.addEventListener("touchmove", function (e) {
                if (_self.touchFlag) {
                    touchMoveController(_self, e);
                }
            }, false);

            _self.canvas.addEventListener("touchend", function (e) {
                if (_self.touchFlag) {
                    touchEndController(_self, e);
                    _self.touchFlag = false;
                }
            }, false);

        };


        var GestureLock = function (_canvas, _config) {
            var defaultConfig = {
                success: {
                    lineWidth: 3,
                    lineStrokeStyle: "#5cb85c",
                    ringWidth: 2,
                    ringStrokeStyle: "#5cb85c",
                    pointStrokeStyle: "#5cb85c"
                },
                error: {
                    lineWidth: 3,
                    lineStrokeStyle: "#d9534f",
                    ringWidth: 2,
                    ringStrokeStyle: "#d9534f",
                    pointStrokeStyle: "#d9534f"
                },
                warning: {
                    lineWidth: 3,
                    lineStrokeStyle: "#f0ad4e",
                    ringWidth: 2,
                    ringStrokeStyle: "#f0ad4e",
                    pointStrokeStyle: "#f0ad4e"
                },
                default: {
                    lineWidth: 3,
                    lineStrokeStyle: "#5bc0de",
                    ringWidth: 2,
                    ringStrokeStyle: "#5bc0de",
                    pointStrokeStyle: "#5bc0de"
                },
                matrix: 3
            };

            this.gestureStart = undefined;
            this.gestureChange = undefined;
            this.gesturePointChange = undefined;
            this.gestureEnd = undefined;

            this.config = angular.extend(defaultConfig, _config || {});

            this.touchFlag = false;

            this.disabled = false;

            this.radii = 0;

            this.cipherPoints = [];
            this.activityPoints = [];
            this.originalPoints = [];
            this.canvas = _canvas;
            this.context2d = _canvas.getContext('2d');
            //绑定事件
            bindEvent(this);
        };

        /***
         * 初始化矩阵 数组
         * @param _self初始化对象
         */
        GestureLock.prototype.init = function () {
            var matrix = this.config.matrix;
            var count = 0;
            this.radii = this.canvas.width / ( 4 * matrix);
            //原始点集合
            this.originalPoints = [];

            for (var i = 0, n = matrix; i < n; i++) {
                for (var j = 0, m = matrix; j < m; j++) {
                    count++;
                    var _o = {
                        x: j * 4 * this.radii + 2 * this.radii,
                        y: i * 4 * this.radii + 2 * this.radii,
                        index: count
                    };
                    this.originalPoints.push(_o);
                }
            }
            this.reset();
            return this;
        };


        GestureLock.prototype.reset = function () {
            //擦除面板
            this.activityPoints = [].concat(this.originalPoints);
            this.cipherPoints = [];
            this.context2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
            drawRings(this.context2d, this.originalPoints, this.radii, this.config.default.ringWidth, this.config.default.ringStrokeStyle);
            this.disabled = false;
        };

        GestureLock.prototype.viewStatus = function (_type, _viewConfig) {
            var viewConfig = {
                ring: true,
                line: false,
                point: false,
            };
            viewConfig = angular.extend(viewConfig, _viewConfig);
            if (viewConfig.ring) {
                drawRings(this.context2d, this.cipherPoints, this.radii, this.config[_type].ringWidth, this.config[_type].ringStrokeStyle);
            }
            if (viewConfig.line) {
                drawLine(this.context2d, this.cipherPoints, this.config[_type].lineWidth, this.config[_type].lineStrokeStyle);
            }
            if (viewConfig.point) {
                drawPoints(this.context2d, this.cipherPoints, this.radii / 2, this.config[_type].pointStrokeStyle);
            }
        };

        GestureLock.prototype.getGesturePassword = function () {
            return this.cipherPoints.map(function (_object) {
                return _object.index;
            });
        };

        GestureLock.prototype.validatePassword = function (originalPassword, password) {
            var result = true;
            if (!originalPassword || !password) {
                return false;
            }
            if (originalPassword.length != password.length) {
                return false;
            }
            for (var i = 0, n = originalPassword.length; i < n; i++) {
                if (originalPassword[i] !== password[i]) {
                    result = false;
                    break;
                }
            }
            return result;
        };

        return GestureLock;

    }]);