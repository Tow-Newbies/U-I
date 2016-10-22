/**
 * Created by my on 2016/10/19.
 */
angular
    .module('common.utils', [])
    .directive('myAlerts', [
        "$parse",
        "$rootScope",
        "$interval",
        "myGLOBAL",
        function($parse, $rootScope, $interval, myGLOBAL){
            function link($scope, $ele){
                /*
                * alert {
                *     id: hash,
                *     type: long
                *     msg: " This is alert"
                *   }
                */

                var timer = null;
                var delay = {
                    "long": 2500,
                    "short": 1000
                };
                $scope.alerts = [];
                $rootScope.$on("alerts:in", function(){
                    console.log("alerts:in")
                    registerAlerts();
                    if(!timer){
                        timer = $interval(function(){
                            checkAlerts();
                            if(!$scope.alerts.length){
                                    $interval.cancel(timer);
                                  timer = null;
                            }
                        },100)
                    }

                });

                function registerAlerts(){
                    console.log($scope.alerts);
                    var nullNo = 0;

                    myGLOBAL.alerts.forEach(function(item, index, arr){
                        if(item && !item.fired){
                            item.fired = true;
                            $scope.alerts.push(item);

                        }else{
                            item = null;
                            arr.splice(index, 1);
                            nullNo++;
                        }

                    });
                    if(nullNo == myGLOBAL.alerts.length){
                        myGLOBAL.alerts.length = 0;
                    }

                }

                /**
                 * 从最开始的检查，若已经超时，则进入下一个循环；若未超时，等待下一次调用
                 */
                function checkAlerts(){
                    console.log("check Alerts");
                    if(!$scope.alerts[0]){
                        return
                    }
                    if(Date.now()-$scope.alerts[0].start> delay[$scope.alerts[0].type]){
                        var t = $scope.alerts.shift();
                        console.log(t);
                        checkAlerts();
                    }else{
                        return
                    }
                }

            }
            return{
                link: link
            }

        }
    ])
    .service("utils", [
        "myGLOBAL",
        "$rootScope",
        function (myGLOBAL, $rootScope) {
            this.notice = utilnotice;

            function utilnotice(msg, type){
                msg = msg?msg:"";
                type = type?type:"short";

                var alertsDelay = ["short", "long"];
                var alertPos = ["top", "middle", "bottom"];
                var hashNo = Math.floor(Math.random()*1000000);
                myGLOBAL.alerts.push({
                    type: type,
                    id: Date.now()+hashNo+hashNo.toString(16),
                    msg: msg,
                    start: Date.now(),
                    fired: false
                });
                console.log(Date.now()+hashNo+hashNo.toString(16));
                $rootScope.$emit("alerts:in");
            }
        }
    ])
;