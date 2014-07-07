/**
 * @fileOverview 浮层
 * @extends  KISSY.Base
 * @creator 槿瑟<jinse.zjw@alibaba-inc.com>
 * @version 1.0
 * @update 2014-06-26
 * @example
 *     var slidecmp = new S.Slidecomponent({'updateBar':true,'updateTxt':'测试'});
 */
KISSY.add(function(S,CORE,UA,Anim) {
    var $= KISSY.all,DOM = S.DOM,choiceBtn='',storageEl  = null,WEEK_MS= 1000 * 60 * 60 * 24 * 7,browser=null;
    /**
    * @class xx
    * @constructor
    * @param {Object} config 配置对象
    */
    function Slidecomponent(config){
        var self = this;

        if (!(self instanceof Slidecomponent)) {
            return new Slidecomponent(config);
        }

        Slidecomponent.superclass.constructor.call(self, config);
    }
    //继承于KISSY.Base
    S.extend(Slidecomponent, S.Base);
    Slidecomponent.VERSION = 1.0;
    /**
     *支持的事件列表
     */
    Slidecomponent.event = {
        RENDER : 'render'
    };
    /**
     * 设置参数
     */
    Slidecomponent.ATTRS = {
        //是否显示更新提示
		updateBar:{
			value:false,
			setter:function(v){
				return v;
			}
		},
        //激活
        updateTxt : {
            value : "亲，您的浏览器版本过低导致图片打开速度过慢，提升打开速度您可以：",
            setter : function(v){
                return v;
            }
        }
    };
    /**
     * 方法
     */
    S.augment(Slidecomponent, {
         /**
         * 运行
         */
		 show:function(){
		 	var self = this;
		 	self._uaTest();
		 },
        /**
         * 运行
         * @return {Object} 对象
         */
		 render:function(){
			 	var self = this;
			 	var supernatantTipBarHtml ='<div class="browser-updator" id="updateBar" style="display:none;">\
		        <div class="browser-updator-wrapper">\
		          <p>\
		            <span>'+self.get('updateTxt')+'</span>\
		            <a target="_blank" href="http://www.microsoft.com/zh-cn/download/details.aspx?id=43" class="browser-updator-browser browser-updator-ie">'+browser+'</a>\
		          </p>\
		        </div>\
		        </div>';
				supernatantHtml = supernatantTipBarHtml + 
				'<div id="filter">\
					<div id="container">\
						<div id="explaSlide">\
							<div id="slides">\
								<div class="slides_container tab-content">\
									<div class="tab-pannel">\
										<a href="#"><img src="http://gtms01.alicdn.com/tps/i1/TB1UpxsFVXXXXbIXXXXIXul4XXX-860-342.png"></a>\
									</div>\
									<div class="tab-pannel">\
										<img src="http://gtms02.alicdn.com/tps/i2/TB1d9prFVXXXXc1XXXXl0Cl4XXX-860-343.png">\
									</div>\
									<div class="tab-pannel">\
										<img src="http://gtms03.alicdn.com/tps/i3/TB1OORrFVXXXXcbXXXXIXul4XXX-860-342.png">\
									</div>\
								</div>\
								<a href="javascript:void(0);" class="prev" id="J_pre">\
									<img src="http://gtms04.alicdn.com/tps/i4/TB1UiFmFVXXXXcNXFXXewj8FpXX-22-44.png" width="24" height="43" alt="Arrow Prev">\
								</a>\
								<a href="javascript:void(0);" class="next" id="J_next">\
									<img src="http://gtms02.alicdn.com/tps/i2/TB1AsXoFVXXXXb0XpXXewj8FpXX-22-44.png" width="24" height="43" alt="Arrow Next">\
								</a>\
								<ul class="tab-nav pagination">\
									<li>\
										<a href="javascript:void(0);"></a>\
									</li>\
									<li>\
										<a href="javascript:void(0);"></a>\
									</li>\
									<li>\
										<a href="javascript:void(0);"></a>\
									</li>\
								</ul>\
							</div>\
							<div class="close-btn">\
								<a href="javascript:void(0);">\
									<img src="http://gtms03.alicdn.com/tps/i3/TB183NlFVXXXXcBXVXXQweWFVXX-30-30.png" id="closebtn"/>\
								</a>\
							</div>\
							<div id="down-close">\
								<img src="http://gtms04.alicdn.com/tps/i4/TB1cnFlFVXXXXbaXVXX6ef0HXXX-202-29.png" />\
								<img src="http://gtms01.alicdn.com/tps/i1/TB1l18oFVXXXXaNXpXXnU4yFVXX-26-29.png"  id="down_close_btn"/>\
							</div>\
						</div>\
						<div class="explaChoice">\
							<img src="http://gtms01.alicdn.com/tps/i1/TB1fxtnFVXXXXXzXFXXfsJ24XXX-860-158.png" width="860px" height="158px" alt="More choices.." />\
							<a href="http://windows.microsoft.com/zh-cn/internet-explorer/download-ie" target="_blank">\
								<img src="'+choiceBtn+'" id="infact_btn" />\
							</a>\
						</div>\
					</div>\
					<div id="down"></div>\
				<div>';
				supernatantTipBar =  $(supernatantTipBarHtml);
				supernatant =  $(supernatantHtml);
				if(self._getCookie("tipBar")){
					supernatantTipBar.prependTo("body");
				}else
	      			supernatant.prependTo("body");

	      		DOM.style("#filter",{position: 'absolute', zIndex: '10000 !important', width: '100%', height: '100%', textAlign :'center', top :'0'});

				KISSY.use('depatureie6/1.0/demo/global.css', function (S) {
					if(self._getCookie("tipBar")==1){
			      		var tipEl =S.get('#updateBar')
							DOM.show(tipEl);
						    var anim = new Anim(tipEl, {
						       height: 45
						     }, .3, "easeOut");
						    return anim.run();
			      	}else{
						S.use('gallery/slide/1.3/index', function(S,Slide){
									C = new Slide('slides',{
									autoSlide:false,
									hoverStop:true,
									effect:'hSlide',
									timeout:2000,
									speed:300,
									invisibleStop:true,
									eventType:'click',
									triggerDelay:200,
									defaultTab:0,
									selectedClass:'current',
									carousel:true,
									touchmove:true
								}).on('afterSwitch',function(){
								});
							S.one('#J_pre').on('click',function(e){
								e.halt();
								C.previous();
								if(C.autoSlide && C.stoped === false){
									C.stop().play();
								}
							});
							S.one('#J_next').on('click',function(e){
								e.halt();
								C.next();
								if(C.autoSlide && C.stoped === false){
									C.stop().play();
								}
							});
							S.ready(function(S){
								DOM.style("#down","height",DOM.docHeight());
								var viewPortHeight = DOM.viewportHeight();
								var verticalHeight = DOM.viewportHeight()/2-266;
								DOM.style("#container","marginTop",verticalHeight+"px");
							});
							S.all('#closebtn').on('mouseenter',function(){
								DOM.style("#down-close","visibility","visible");
							});
							S.all('#down-close').on('mouseleave',function(){
								DOM.style("#down-close","visibility","hidden");
							});
							S.all('#down_close_btn').on('click',function(){
								self._setCookie("timeStamp",new Date().getTime());
								DOM.style("#filter","display","none");
								if(self.get('updateBar') == true){
									self._setCookie("tipBar",1);
									var tipEl =S.get('#updateBar')
									DOM.show(tipEl);
								    var anim = new Anim(tipEl, {
								       height: 45
								     }, .3, "easeOut");
								    return anim.run();
								}
							});
						});
					}
				});
		 },
		 /**
         * 判断浏览器类型
         */
        _uaTest : function(){
            var self = this;
            if(UA.chrome > 0){
            	browser = '升级IE浏览器';
	            choiceBtn='http://gtms04.alicdn.com/tps/i4/TB1NsNpFVXXXXcdXXXXJPIyFpXX-143-56.png';
	            self.render();
	        }else if(UA.safari > 0){
	        	browser = '升级Safari浏览器';
	            choiceBtn='pic/infact_btn.png';
	        }else if(UA.opera > 0){
	        	browser = '升级Opera浏览器';
	            choiceBtn='pic/infact_btn.png';
	        }else if(UA.firefox > 0){
	        	browser = '升级Firefox浏览器';
	            choiceBtn='pic/infact_btn.png';
	            if (self._promptIE() || self._getCookie("tipBar")==1) {
	        		self.render();
	        	}
	        }else if(UA.ie > 0){
	        	choiceBtn='http://gtms04.alicdn.com/tps/i4/TB1NsNpFVXXXXcdXXXXJPIyFpXX-143-56.png';
	        	browser = '升级IE浏览器';
	        	if (UA.ie == 6 && (self._promptIE() || self._getCookie("tipBar")==1) ) {
	        		self.render();
	        	}
	        }
	    },
		/**
         * 写Cookie
         */
	    _setCookie : function(name,value){
		    var Days = 30;
		    var exp = new Date();
		    exp.setTime(exp.getTime() + Days*24*60*60*1000);
		    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
		},
		/**
         * 读Cookie
         */
		_getCookie : function(name){
		    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		    if(arr=document.cookie.match(reg))
		        return (arr[2]);
		    else
		        return null;
		},
	    /**
         * IE的话，判断是否关闭超过一周
         */
        _promptIE : function(){
        	var self = this;
            var o = self._getCookie("timeStamp");
            var isMoreThanWeek = (new Date().getTime() - parseInt(o, 10)) > WEEK_MS;
            if (!o || isMoreThanWeek)
            	return true;
            else
            	return false;
        }
    });
    return Slidecomponent;
}, { requires: ['core','ua','anim'] });

