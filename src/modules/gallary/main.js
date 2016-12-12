/**
 * Created by my on 2016/11/14.
 */

angular
	.module('module.gallary', [])
	.controller('gallaryCtrl', [
		"eventListener",
		"myLoader",
		"$$",
		"$timeout",
		"myHttp",
		function (eventListener, myLoader, $$, $timeout,myHttp) {
			var view = this;

			init();

			function init(){

				view.gallarys = [
					{
						url: 'http://tse1.mm.bing.net/th?&id=OIP.Mc85e1e160beff09e0ed3c3ed3cd65496o0',
						desc: '孤独的行者，如大漠的驼铃，徘徊没有终点的旅程。',
						id: 0
					},
					{
						url: 'http://tse1.mm.bing.net/th?&id=OIP.Md747454f6b44a62d8ac6a7d1a4cbb732o0',
						desc: '通向理想的途径往往不尽如人意，而你亦会为此受尽磨难。但是，孩子，你尽管去争取，理想主义者的结局悲壮而绝不可怜。',
						id: 1
					},
					{
						url: 'http://tse1.mm.bing.net/th?&id=OIP.Md06cc7d38f9e5037ecef1c448d3dfe71o0',
						desc: '3',
						id: 2
					},
					{
						url: 'http://tse1.mm.bing.net/th?&id=OIP.Mcd7a66cf8d60fa95dabafe13b8b0ba17o0',
						desc: '4',
						id: 3
					},
					{
						url: 'http://tse1.mm.bing.net/th?&id=OIP.M20a859a66f1320ff8b25f5bfd0d18b03o0',
						desc: 'asdfasdfa',
						id: 4
					}
				]

				eventListener.sub('scrollRefreshs', function (dy) {
					console.log('refresh', dy)
				})
			}
			view.showBig = showBig;
			function showBig(e){
				var target = e.target;
				// console.log(target)
				var ele = angular.element(target);
				var picId = ele.attr('pic-id');
				console.log(picId)
				if(picId){
					var t = view.gallarys[+picId];
					eventListener.trigger('myJigsawViewshow')(t.url, t.desc)
				}

			}
		}
	])
	.directive('cardBlk', [
		"$parse",
		function($parse){

			function link($scope, $ele, $attrs) {

			}

			return {
				scope: {

				},
				link: link
			}
		}
	])

;