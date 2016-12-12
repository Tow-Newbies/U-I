/**
 * Created by my on 2016/10/30.
 */
angular
    .module("module.walkMate", [])
    .controller("walkMateCtrl", [
        "$scope",
        "$timeout",
        "eventListener",
        "decoratorFunc",
        function ($scope, $timeout, eventListener, decoratorFunc) {
            var view = this;


            init();
            function init(){
                eventListener.sub('scrollRefreshs', function (dd) {
                    console.log(dd);
                })
            }


        }
    ])
    .factory("myMapFacory", [
        function () {
            function Map(){
                this.map = null;
            }
            var _proto = {
                init: initMap
            }

            /**
             * 创建地图实例
             * 并根据mapOpts 进行相应的初始化
             * @param mapId
             * @param mapOpts
             */
            function initMap(mapId, mapOpts){
                var defaultOpts = {
                    cityName: '',
                    center: null,
                    controls: true,
                    enableZoom: true
                };
                // 功能映射表，方便以后扩展其他功能
                var fnOptsMap = {
                    center: 'centerAndZoom',
                    controls: 'addControl',
                    cityName: 'setCurrentCity',
                    enableZoom:  'enableScrollWheelZoom'
                };

                angular.extend(mapOpts, defaultOpts);
                var map = new BMap.Map(mapId);

                for(var i in fnOptsMap){
                    if(defaultOpts[i]){
                        map[fnOptsMap[i]](mapOpts[i]);
                    }
                }

                return;
            }
        }
    ])
    .directive("myMap1", [
        "myGLOBAL",
        "$parse",
        "eventListener",
      function (myGLOBAL, $parse, eventListener) {

          var map = null;
          var centerAddr = null;
          var geoCoder = null; // 地址解析
          var infoCmpt = null;
          var _pos = myGLOBAL.userInfo.pos ||{lng:104.06, lat:30.67};

        function compile(ele, attr){

            var mapId = attr["mapId"];
            map = initMap(mapId, _pos);
            // 初始化工具
            initUi(map);

            // 事件绑定

            return {
                post: function ($scope, $ele, $attr, $ngModel) {
                    // $scope.bindEvent
                    // var t = $scope.bindEvent();
                    // bindEvent(map, $scope.eventType, t);
                    var walkMate_move = eventListener.sub('move', move, 'walkMate_move');
                    var walkMate_drawRoute = eventListener.sub('drawRoutes', drawRoutes, 'walkMate_drawRoute');
                    var walkMate_geos = eventListener.sub('geos', geos, 'walkMate_geos');
                    var geosTimer = null;
                    function move(){
                        map.addEventListener('move', function () {
                            eventListener.trigger('move',  walkMate_move);
                        })
                    }

                    function drawRoutes(lnglats) {
                        lnglats = lnglats || [];

                    }

                    function geos(){
                        var id = $filter('date')(new Date(),  'yyyy-MM-dd');
                        if(!myGLOBAL.userInfo.walkMateRoutes[id]){
                            myGLOBAL.userInfo.walkMateRoutes[id] = {
                                routes: [],
                                id: id
                            }
                        }

                        geosTimer && setInterval(function () {
                            getLocation(geosTimer);
                        }, 1100)

                    }

                    function getLocation(timer){
                        timer && baidu_location.getCurrentPosition(function (data) {
                            var rslt = JSON.parse(data);
                            myGLOBAL.userInfo.walkMateRoutes[id].routes.push({
                                lng: rslt.lng,
                                lat: rslt.lat
                            })
                        })
                    }
                }
            }

        }

          /**
           * 创建地图实例
           * @param mapId
           * @param mapCenter
           * @returns {BMap.Map}
           */
        function initMap(mapId, mapCenter){
            var map = new BMap.Map(mapId);
            map.centerAndZoom(new BMap.Point(mapCenter.lng, mapCenter.lat), 11);  // 初始化地图,设置中心点坐标和地图级别
            map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
            map.setCurrentCity("成都");          // 设置地图显示的城市 此项是必须设置的
            map.enableScrollWheelZoom(true);

            return map;
        }

          /**
           * 初始化UI
           * @param map
           */
        function initUi(map) {
            var d = document;
            var frameElement = d.createDocumentFragment();



            function createHTMLTag(tagName){
                return document.createElement(tagName);
            }

        }

          /**
           * 地图事件绑定
           * @param map
           * @param eventType
           * @param eventFunc
           */
        function bindEvent(map, eventType, eventFunc){
            var self = this;
            map.addEventListener(eventType, function () {
                return eventFunc.apply(self, arguments);
                console.log("Event triggerd")
                /*return function () {
                    return event.func.call(self, arguments);
                }*/
            }, false);
        }




        return {
            scope:{
                bindEvent: "&",
                eventType: '@'
            },
            compile: compile
        }

      }
    ])
;