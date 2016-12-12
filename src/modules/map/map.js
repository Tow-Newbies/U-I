//cordova plugin add https://github.com/mrwutong/cordova-qdc-baidu-location --variable API_KEY="G62PZw8TjGiceOwvT8lHkoR0VWjYdFNF"


angular
	.module("module.map", ["ngRoute"])
	.controller("mapCtrl", [
		"$scope",
		function($scope){
			var view = this;
			view.curPos = "";
		}
	])
	.directive("myMap", [
		"$window",
		"$parse",
		"$timeout",
		"$rootScope",
		"$q",
		"myGLOBAL",
		function($window, $parse, $timeout, $rootScope, $q, myGLOBAL){

			var map = null;
			var centerAddr = null;
			var geoCoder = null; // 地址解析
			var infoCmpt = null;
			var _pos = myGLOBAL.userInfo.pos ||{lng:104.06, lat:30.67}




			function compile(ele, attr, ngModel) {
				var mapId = attr["mapId"];

				console.log(infoCmpt,"infocmpt");

				console.log(mapId, ngModel);

				// 创建地图实例
				map = new BMap.Map(mapId);    // 创建Map实例
				geoCoder = new BMap.Geocoder(); // 初始化解析工具
				
				map.centerAndZoom(new BMap.Point(_pos.lng, _pos.lat), 11);  // 初始化地图,设置中心点坐标和地图级别
				map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
				map.setCurrentCity("成都");          // 设置地图显示的城市 此项是必须设置的
				map.enableScrollWheelZoom(true);

				// 百度地图重写了div，所以，createInfo 要在地图实例化后执行
				infoCmpt = createInfo();
				infoCmpt.info.html("点击获取惊喜");
				// 初始化数据

				// getCtrAndAddr(map, geoCoder).then(function(data){
				// 	infoCmpt.info.html(data.lnglat.lng);
                //
				// });

				// eventListen(map, infoCmpt, geoCoder, attr);

				return{
					post:function($scope, $ele, $attr, ngModel){
						// $attr["ctrAddr"] =
						// 绑定事件时传入$scope,以便值得回传
						geoAndSetAddr(map, geoCoder, $scope);
						eventListen(map, infoCmpt, geoCoder, attr, $scope);
						// BMapLib.EventWrapper.trigger(map, "touchend");

					}
				}




				// return {
				// 	post:function ($scope) {
				// 		postLink();
				// 		$scope.$watch(centerAddr, function(){
				// 			console.log("changed:"+centerAddr)
				// 		})
				// 		$scope.curPos = "测试";
				// 		console.log("changed:"+centerAddr)
				// 		// scope.ctrAddr = centerAddr;
				// 	}
				// }
			}

			/**
			 * 绑定 touchstart、touchend 事件
			 * @param map
			 * @param infoCmpt
			 * @param geoCoder
			 */
			function eventListen(map, infoCmpt, geoCoder ,attr, $scope){
				// 添加地图拖动事件，对 icon 进行class 的操作
				map.addEventListener("touchstart", function(){
					console.log("地图开始拖动");
					infoCmpt.info.removeClass("slow_long");
					infoCmpt.info.triggerHandler("shorter");
					$scope.ctrAddr = "...";

				});
				map.addEventListener("touchend", function(){
					// infoCmpt.info.addClass("slow_long");
					$scope.ctrAddr = null;
					infoCmpt.icon.addClass("bounce-icon");
					$timeout(function(){
						infoCmpt.info.removeClass("slow_shorter");
						infoCmpt.info.addClass("slow_long");

					},450)
					// var center = map.getViewport();
					/*geoCoder.getLocation(center.center, function(rslt){
						console.log(rslt);
						if(!rslt || !addr){
							$scope.ctrAddr = "获取地址失败";
						}
						var addr = rslt.addressComponents;
						console.log(addr.street);
						if(!addr){

						}
						if(addr.street){
							$scope.ctrAddr = addr.street;
						}else{
							$scope.ctrAddr = addr.address;
						}
					});*/
					geoAndSetAddr(map, geoCoder, $scope);

					// infoCmpt.info.html(center.center.lng);

					$timeout(function () {
						// icon.removeClass("my-map-drag");
						infoCmpt.icon.removeClass("bounce-icon");
						infoCmpt.info.removeClass("slow_long");
					},1000)
				});
			}

			/**
			 * 创建定位标识
			 * @returns {{info: Object, icon: Object}}
			 */
			function createInfo() {
				var frame = document.createDocumentFragment();
				var tmp = document.createElement("div");
				var infoDiv = document.createElement("div");
				var infoWindow = document.createElement("span");
				var _icon = document.createElement("span");
				var info =angular.element(infoWindow);
				var icon = angular.element(_icon);

				tmp.className = "info";
				infoDiv.className = "info-div";
				infoWindow.className = "info-span ";


				icon.addClass("map-geo my-icon-geo-flag");
				icon.addClass("animated");


				infoDiv.appendChild(infoWindow);
				infoDiv.appendChild(_icon);
				tmp.appendChild(infoDiv);
				frame.appendChild(tmp);
				document.querySelector("#myMap").appendChild(frame);



				info.bind("shorter", function () {
					console.log("hover");
					info.addClass("slow_shorter");
				});
				console.log("create infowindow");

				return {
					info: info,
					icon: icon
				}

			}

			/**
			 * 解析地址
			 * @param map
			 * @returns {Promise}
			 */
			function getCtrAndAddr(map, geoCoder){
				var ctr = map.getViewport();
				var defer = $q.defer();
				var address = null;
				var v = {
					lnglat: ctr.center,
					addr: null
				};
				BMap.Convertor.translate(ctr.center, 0, function (ctrlng) {
					geoCoder.getLocation(ctrlng, function (rslt) {
						console.log(rslt);
						if(!rslt || !rslt.addressComponents || !rslt.address){

							defer.reject();
						}else{
							v.addr = rslt.addressComponents;
							v.addr.address = rslt.address;

							defer.resolve(v);
						}

						ctr = null;
						v = null;

					});
				});




				return defer.promise;
			}

			function geoAndSetAddr(map, geoCoder, $scope){
				console.log("ddd")
				return getCtrAndAddr(map, geoCoder).then(function(addr){
					// infoCmpt.info.html(data.lnglat.lng);
					// console.log(data.street);
					var data = addr.addr;
					if(data.street&& data.street!=""){
						$scope.ctrAddr = data.street;
					}else{
						$scope.ctrAddr = data.address;
						if(!data.address){
							$scope.ctrAddr = "请手动输入地址";
						}
					}

				}, function (err) {
					$scope.ctrAddr = "请手动输入地址";
				});
			}

			
			return{
				restrict: 'AEC',
				scope:{
					ctrAddr: "="
				},
				compile: compile

			}
		}
	])
;