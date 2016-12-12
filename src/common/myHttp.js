
angular
	.module("common.http", [])
	.service("myHttp", [
		"$window",
		function($window) {


			var http = {
				init: function () {
					return this;
				},
				xhr: createXhr,
				post: function () {

				},
				get: function (data, url, prefix) {
					var self = this;
					//转换
					var toPostData = JSON.stringify(data);
					toPostData = toPostData.replace(/[\{\}\'\"]/g, "").replace(/\:/g, "=").replace(/\,/g, "&")
					var _xhr = http.xhr();
					var defer = new Promise(function (resolve, reject) {
						_xhr.open('get', (prefix || "") + url + "?" + toPostData, true);
						_xhr.onreadystatechange = function (res) {
							if (('4' == _xhr.readyState && '200' == _xhr.status) || '304' == self.xhr.status) {
								console.log(_xhr.responseText);
								resolve(res);
							} else {
								reject(res);
							}
						}
						_xhr.send(null);
					});

					return defer;

				},
				jsonp: function () {

				}
			}

			/**
			 * 生成xhr，并复写createXhr
			 * @return {[type]} [description]
			 */
			function createXhr() {
				console.log("createXhr")
				if (window.XMLHttpRequest) {
					createXhr = function () {
						return new XMLHttpRequest();
					};
					return new XMLHttpRequest();
				} else {
					var IEXHRVers = ["Msxml3.XMLHTTP", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
					for (var i = 0, len = IEXHRVers.length; i < len; i++) {
						try {
							xhr = new ActiveXObject(IEXHRVers[i]);
							if (xhr) {
								createXhr = function () {
									return new ActiveXObject(IEXHRVers[i]);
								}
								return xhr;
							}
						} catch (e) {
							continue;
						}
					}
				}
			}
			// http.xhr();
			this.xhr = http.xhr();
			this.get = http.get;
			this.jsonp = http.jsonp;
			this.post = http.post;

		}
	])


 