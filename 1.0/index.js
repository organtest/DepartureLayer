/**
 * @fileOverview  @DepartureLayer
 * @extends  KISSY.Base
 * @creator 槿瑟<jinse.zjw@alibaba-inc.com>
 * @version 1.0
 * @update 2014
 * @example
 *
 *    KISSY.use('gallery/DepartureLayer/1.0/index', function(S,DepartureLayer){
 *           var departureLayer = new DepartureLayer(
 *           {   
 *               browser : [{ browser:'ie', maxversion: '10'},{ browser:'chrome', maxversion: '36'}], 
 *               intervalTime : '10000',     
 *               layer : 
 *               {
 *                   tip : '其实...亲有更好的选择',
 *                   btn_type_pic : 'http://gtms04.alicdn.com/tps/i4/TB1kLVqFVXXXXX1XpXXJPIyFpXX-143-56.png',
 *                   imgsrc : [ 'http://gtms01.alicdn.com/tps/i1/TB1UpxsFVXXXXbIXXXXIXul4XXX-860-342.png',
 *                              'http://gtms02.alicdn.com/tps/i2/TB1d9prFVXXXXc1XXXXl0Cl4XXX-860-343.png' ,
 *                              'http://gtms03.alicdn.com/tps/i3/TB1OORrFVXXXXcbXXXXIXul4XXX-860-342.png']
 *               },
 *               toptipBar : 
 *               {
 *                   enable : true,
 *                   toptip_text : '亲，您的浏览器版本过低导致图片打开速度过慢，提升打开速度您可以：',
 *                   toptip_btn_text : '升级浏览器'
 *               },
 *               updateLink : 'http://windows.microsoft.com/zh-cn/internet-explorer/download-ie' 
 *           }
 *           );
 *           departureLayer.show();
 *       });
 *   })(KISSY);
 */
KISSY.add(function(S,CORE,UA,Anim,Storage) {
    var $= S.all,DOM = S.DOM,WEEK_MS= 1000 * 60 * 60 * 24 * 7;
    /**
    * @class xx
    * @constructor
    * @param {Object} config 配置对象   DepartureLayer
    */
    function DepartureLayer(comconfig){
        var self = this;
        
        if (!(self instanceof DepartureLayer)) {
            return new DepartureLayer(comconfig);
        }
        var newconfig = self._mymix(DepartureLayer.ATTRS, comconfig);

        // 负责ATTRS参数get,set，KISSY.Base处理配置参数
        DepartureLayer.superclass.constructor.call(self, newconfig);

    }
    //继承于KISSY.Base
    S.extend(DepartureLayer, S.Base);
    
    DepartureLayer.VERSION = 1.0;	// 不同版本号是不同目录

    /**
     * 设置参数
     */
    DepartureLayer.ATTRS = {
        //是否显示更新提示
		browser: {
			value: [{ browser:'ie', maxversion: '10'}],
			setter: function(v){
				return v;
			}
		},
		intervalTime: {
			value: WEEK_MS,			  //  间隔时间，以ms为单位，默认为WEEK_MS 
			setter: function(v){
				return v;
			}
		},
		layer: {
			value: {
                    tip : '其实...亲有更好的选择',
                    btn_type_pic : 'http://gtms04.alicdn.com/tps/i4/TB1kLVqFVXXXXX1XpXXJPIyFpXX-143-56.png',
                    imgsrc : [ 'http://gtms01.alicdn.com/tps/i1/TB1UpxsFVXXXXbIXXXXIXul4XXX-860-342.png',
                               'http://gtms02.alicdn.com/tps/i2/TB1d9prFVXXXXc1XXXXl0Cl4XXX-860-343.png' ,
                               'http://gtms03.alicdn.com/tps/i3/TB1OORrFVXXXXcbXXXXIXul4XXX-860-342.png']
                },
			setter: function(v){
				return v;
			}			
		},
		toptipBar: {
			value: {
                    enable : true,
                    toptip_text : '亲，您的浏览器版本过低导致图片打开速度过慢，提升打开速度您可以：',
                    toptip_btn_text : '升级浏览器'
                },
			setter: function(v){
				return v;
			}
		},
		updateLink: {
			value: 'http://windows.microsoft.com/zh-cn/internet-explorer/download-ie',
			setter: function(v){
				return v;
			}			
		}
    };
    /**
     * 方法
     */
    S.augment(DepartureLayer, {
         /**
         * 运行
         */
		 show:function(){
		 	var self = this;
			//	Storage.clear();
		    self._uaTest(Storage);
		 	
		 },
        /**
         * 运行
         * @return {Object} 对象
         */
		 render:function(Storage){
			 	var self = this;

			 	var html1 = self._getHtml(Storage);
			 	if(html1 == "err")
			 		return;
			 	var supernatant =  $(html1);
			 	supernatant.prependTo("body");

				if(Storage.get("tipBar")==1 && !self._promptIE(Storage)){
			   		var tipEl =S.get('#pupUplayer_tipel')
					DOM.show(tipEl);
				    var anim = new Anim(tipEl, {
		  		        height: 45
				    }, .3, "easeOut");
				    return anim.run();
			    }else{
					S.use('gallery/slide/1.3/index', function(S,Slide){
					Storage.remove("tipBar");
					C = new Slide('slides',{
									autoSlide:false,
									hoverStop:true,
									effect:'hSlide',
									timeout:2000,
									speed:400,
									invisibleStop:true,
									eventType:'click',
									triggerDelay:200,
									defaultTab:0,
									selectedClass:'current',
									carousel:true,
									touchmove:true
								}).on('afterSwitch',function(){
								});
						S.ready(function(S){
								DOM.style("#down","height",DOM.docHeight());
								var viewPortHeight = DOM.viewportHeight();
								var verticalHeight = DOM.viewportHeight()/2-266;
								DOM.style("#container","marginTop",verticalHeight+"px");
						});
						S.all("#pupUplayer").delegate('click','#container #slides .prev',function(e){
								e.halt();
								C.previous();
								if(C.autoSlide && C.stoped === false){
									C.stop().play();
								}
						});
						S.all("#pupUplayer").delegate('click','#container #slides .next',function(e){
								e.halt();
								C.next();
								if(C.autoSlide && C.stoped === false){
									C.stop().play();
								}
						});
						S.all("#pupUplayer").delegate('mouseenter','#container .close-btn .closebtnspan',function(){
								DOM.style("#container .down-close","visibility","visible");
						});
						S.all("#pupUplayer").delegate('mouseleave','#container .down-close',function(){
								DOM.style("#container .down-close","visibility","hidden");
						});
						S.all("#pupUplayer").delegate('click','#container .down-close .down_close_btn',function(){
								Storage.set("timeStamp",new Date().getTime());
								DOM.style("#pupUplayer","display","none");
								if(self.get('toptipBar').enable == true){
									Storage.set("tipBar",1);
									var tipEl =S.get('#pupUplayer_tipel')
									DOM.show(tipEl);
								    var anim = new Anim(tipEl, {
								       height: 45
								     }, .3, "easeOut");
								    return anim.run();
								}
						});
					});
				}
		 },
		 _getHtml : function(Storage){
			 	var self = this;
			 	var imageCount = self.get('layer').imgsrc.length;
			 	if(imageCount<3 || imageCount>5){
			 		alert("轮播数量建议在3-5张");
			 		return "err";
			 	}
			 	var slideImg = '';
			 	var slideLast = '';
			 	for(var i=0;i<imageCount;i++) { 
					slideImg = slideImg + '<div class="tab-pannel" data-spm-click="gostr=/departure;locaid=dot'+i+'">\
										<a href="#"><img src="'+self.get('layer').imgsrc[i]+'"></a>\
									</div>';
					slideLast = slideLast +	'<li><a href="javascript:void(0);"></a></li>';
				}
				
			 	var supernatantTipBarHtml ='<div class="browser-updator" data-spm="20140707" id="pupUplayer_tipel" style="display:none;">\
		        <div class="browser-updator-wrapper">\
		          <p>\
		            <span>'+self.get('toptipBar').toptip_text+'</span>\
		            <a target="_blank" href="'+self.get('updateLink')+'" class="browser-updator-browser browser-updator-ie" data-spm-click="gostr=/departure;locaid=btn2">\
		            <span>'+self.get('toptipBar').toptip_btn_text+'</span></a>\
		          </p>\
		        </div>\
		        </div>',
				supernatantHtml = supernatantTipBarHtml + 
				'<div id="pupUplayer" data-spm="20140707">\
					<div id="container">\
						<div id="explaSlide">\
							<div id="slides">\
								<div class="slides_container tab-content" id="slideinsert1">'
								+slideImg+
								'</div>\
								<a href="javascript:void(0);" class="prev" data-spm-click="gostr=/departure;locaid=prev">\
									<span>&lt;</span>\
								</a>\
								<a href="javascript:void(0);" class="next" data-spm-click="gostr=/departure;locaid=next">\
									<span>&gt;</span>\
								</a>\
								<ul class="tab-nav pagination">'
								+slideLast+
								'</ul>\
							</div>\
							<div class="close-btn" data-spm-click="gostr=/departure;locaid=close">\
								<a href="javascript:void(0);">\
									<span class="closebtnspan">×</span>\
								</a>\
							</div>\
							<div class="down-close">\
								<img src="http://gtms04.alicdn.com/tps/i4/TB1cnFlFVXXXXbaXVXX6ef0HXXX-202-29.png" />\
								<img src="http://gtms01.alicdn.com/tps/i1/TB1l18oFVXXXXaNXpXXnU4yFVXX-26-29.png" class="down_close_btn"/>\
							</div>\
						</div>\
						<div class="explaChoice">\
							<img src="http://gtms01.alicdn.com/tps/i1/TB1nDdnFVXXXXXLXpXXBsd24XXX-860-158.jpg" width="860px" height="158px" alt="More choices.." />\
							<a href="'+self.get('updateLink')+'" target="_blank">\
								<img src="'+self.get('layer').btn_type_pic+'" class="layer_btn_type" data-spm-click="gostr=/departure;locaid=btn1"/>\
								<span>'+self.get('layer').tip+'</span>\
							</a>\
						</div>\
					</div>\
					<div id="down"></div>\
				<div>';

	      		if (self._promptIE(Storage)){
					return supernatantHtml;
				}else if(Storage.get("tipBar")==1){
					return supernatantTipBarHtml;
				}
		 },
		 /**
         * 判断浏览器类型
         */
        _find : function(Storage, type, version){
        	var self = this;
				switch(type){
	            	case 'chrome': 
	            		if(UA.chrome <= version && (self._promptIE(Storage) || Storage.get("tipBar")==1) ){
	            			return true;
	            			// self.render(Storage);
	            		} break;
	            	case 'safari':
	            		if(UA.safari <= version && (self._promptIE(Storage) || Storage.get("tipBar")==1) ){
	            			return true;
	            		} break;
	            	case 'opera':
	            		if(UA.opera <= version && (self._promptIE(Storage) || Storage.get("tipBar")==1) ){
	            			return true;
	            		} break;
	            	case 'firefox':
	            		if(UA.firefox <= version && (self._promptIE(Storage) || Storage.get("tipBar")==1) ){
	            			return true;
	            		} break;
	            	case 'ie':
	            		if(UA.ie <= version && (self._promptIE(Storage) || Storage.get("tipBar")==1) ){
	            			return true;
	            		} break;	
	            	default:
	            		return false;
	            }
        },
        _uaTest : function(Storage){
            var self = this, count = self.get('browser').length, flag=false, i=0;
            while(!self._find(Storage, self.get('browser')[i].browser, self.get('browser')[i].maxversion)){
            	i++;
            	if(i == count)	break;
            }
            if(i < count)	self.render(Storage);
	    },
	    /**
         * IE的话，判断是否关闭超过一周
         */
        _promptIE : function(Storage){
        	var self = this;
            var o = Storage.get("timeStamp");
            var isMoreThanWeek = (new Date().getTime() - parseInt(o, 10)) > self.get('intervalTime');  
            if (!o || isMoreThanWeek)
            	return true;
            else
            	return false;
        },
		_mymix : function(defaultAttr, comconfig){
			var self = this;
			var attr = ['browser','toptipBar','intervalTime','layer','updateLink'];
			if(!comconfig){
				comconfig = defaultAttr;
				for(var i=0; i<attr.length; i++){
					comconfig[attr[i]] = defaultAttr[attr[i]].value;
				}		
				return comconfig;
			}	
			for(var i=0; i<attr.length; i++){
				if(!comconfig[attr[i]])	comconfig[attr[i]] = defaultAttr[attr[i]].value;
			}
			comconfig.toptipBar = S.mix(comconfig.toptipBar, defaultAttr.toptipBar.value, false);
			comconfig.layer = S.mix(comconfig.layer, defaultAttr.layer.value, false);		    
			return comconfig;
		}
    });
    return DepartureLayer;
}, { requires: ['core','ua','anim','./store'] });

