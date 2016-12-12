/**
 * Created by my on 2016/11/12.
 *
 *
 */

angular
    .module('common.eventListener', [])
    /**
     * eventListenr
     * 用于创建事件监听，即信号监听
     * 用于事件驱动
     *
     * 基于发布订阅模式
     * 调用方式
     * eventListener
     */
    .factory('eventListener', [
        function () {
            // 事件信号
            var signalsPool = [];

            /**
             * 订阅事件，
             * @param signal 信号
             * @param id  订阅信号的id
             *
             * 如传递id， 且信号触发也传递了相同的id，那么事件信号只传递给
             * 相应的回调处理
             */
            function subscribe(signal, func, id) {
                var id = id || (Date.now() + ~~(Math.random()*10000));
                if(signalsPool[signal]){
                    signalsPool[signal].push({
                        id: id,
                        func: func
                    });
                }else{
                    signalsPool[signal] = [];
                    signalsPool[signal].push({
                        id: id,
                        func: func
                    });
                }
                return id;
            }

            // 取消订阅
            function unsubscribe(signal, id) {
                if(!signalsPool[signal]){
                    return false;
                }

                if(signal && id){
                    signalsPool[signal] && signalsPool[signal].forEach(function (item, index, arr) {
                        if(item.id == id){
                            item = null;
                        }
                    });
                    return
                }
                signalsPool[signal] = null;

            }

            function trigger(signal, id, context){
                return function(opts){
                    var args = Array.prototype.slice.call(arguments);
                    signalsPool[signal] && signalsPool[signal].forEach(function (item) {
                        if(id && item.id !== id){
                            return;
                        }
                        context && "function" == typeof item.func && item.func.apply(context, args);
                        !context && "function" == typeof item.func  && item.func.apply(null, args);
                    });
                }

            }

            // 监听信号

            var eventListener = {
                sub: subscribe,
                unsub: unsubscribe,
                trigger: trigger
            };

            return eventListener;

        }
    ])

    // someFn.before(beforeFn)
    // 装饰， 在某些需要重用，但是部分代码不一样的地方使用
    // 不使用 Function.prototype.before 方式实现，避免污染
    // 原型链
    // 可用于顺序话执行一系列函数
    // 使用方式
    // decoratorFunc(someFn, beforefn)

    .factory('decoratorFunc', [
        function () {
            var decorator = {
                before: beforeDecorate,
                after: afterDecorate
            };

            function beforeDecorate(someFn, beforeFn) {
                var self = this;
                return function () {
                    beforeFn.apply(self, arguments);
                    return someFn.apply(this, arguments)
                }

            }

            function afterDecorate(someFn, afterFn) {
                var self = this;

                return function () {
                    var ret = someFn.apply(this, arguments);
                    afterFn.apply(this, arguments);
                    return ret;
                }
            }

            return decorator;

        }
    ])
    .factory('eventDelegate', [
        "$parse",
        "$window",
        function($parse, $window){
            
        }
    ])
;
