KISSY.add(function (S, Base, Node) {
  var VOID_DEFAULT = "javascript:void(0)";
  var CURRENT_HANDLE_CLASS = 'kb-slider-cur J_KBSlider-cur';
  function Layter (handle, during) {
    this._handle = handle;
    this._during = during || 4000;
    this.start();
    return this;
  }
  Layter.prototype = {
    constructor: Layter,
    start: function () {
      if (this._id) {this.stop();}
      this._id = setInterval(this._handle, this._during);
      return this;
    },
    stop: function () {
      if (this._id){
        clearInterval(this._id);
        this._id = null;
        delete this._id;
      }
      return this;
    }
  };

  function Dialog () {
    
  }
  var props = {
    render: function (config) {
      var self = this;
      var content;
      if (S.isString(config)) {
        content = config;
      } else {
        config = S.mix({
          updateUrl: 'http://windows.microsoft.com/zh-cn/windows/downloads?spm=608.2291429.20140707.12.KdZxog',
          updateGuid: '其实...亲有更好的选择',
          updateBtn: 'http://gtms03.alicdn.com/tps/i3/TB1RcVQFVXXXXbvXFXXcgZpFXXX-140-48.png',
          slider : [ 
            {
              img: 'http://gtms01.alicdn.com/tps/i1/TB1UpxsFVXXXXbIXXXXIXul4XXX-860-342.png',
              href: VOID_DEFAULT,
              alt: ""
            }, {
              img:'http://gtms02.alicdn.com/tps/i2/TB1d9prFVXXXXc1XXXXl0Cl4XXX-860-343.png',
              href: VOID_DEFAULT,
              alt: ""
            },{
              img: 'http://gtms03.alicdn.com/tps/i3/TB1OORrFVXXXXcbXXXXIXul4XXX-860-342.png',
              href: VOID_DEFAULT,
              alt: ""
            }
          ]
        }, config, true, null, true);
        var _slides = [];
        var _handles = [];

        S.each(config.slider, function (slide, i) {
          _slides.push('<a class="kb-slider-item J_KBSlider-item J_KBSlider-item'+i+'" href="'+slide.href+'"><img src="' + slide.img + '" alt="'+(slide.alt||'')+'" /></a>');
          _handles.push('<a href="javascript:void(0);" data-index="' + i + '" class="kb-slider-step J_KBSlider-step"></a>');
        });
        var slider = [
          '<div class="kb-slider J_KBSlider">',
            '<div class="kb-slider-screen">',
              _slides.join(''),
            '</div>',
            '<div class="kb-slider-handle">',
              '<a href="javascript:void(0);" class="kb-slider-prev J_KBSlider-prev">‹</a><div>',
              _handles.join(''),
              '</div><a href="javascript:void(0);" class="kb-slider-next J_KBSlider-next">›</a>',
            '</div>',
          '</div>'
        ].join('');
        var footer = [
          '<a class="kb-dialog-btn" target="_blank" href="',config.updateUrl,'">',
            '<span>',config.updateGuid,'</span>',
            '<img src="',config.updateBtn,'" alt="" />',
          '</a>'
        ].join('');
        content = slider + footer;
      }
      var $mask = Node('<div class="kb-mask"></div>').appendTo('body').on('click', function () {
        self.hide();
      });
      var $dialog = self.$dialog = Node([
        '<div class="kb-dialog"><div class="kb-dialog-wrapper J_KBDialog">',
          '<a href="javascript:void(0);"  class="kb-dialog-close-wrapper J_KBClose">',
            '<span class="kb-warn-img"></span>',
            '<span class="kb-close">×</span>',
          '</a>',
          '<div class="kb-dialog-content">',
            content,
          '</div>',
        '</div></div>'
      ].join('')).appendTo('body').on('show', function () {
        $mask.show().animate({
          opacity: '.75'
        },'.4', 'easeBothStrong');
        $dialog.show().one('.J_KBDialog').animate({
          top: 180,
          opacity: 1
        }, '.4', 'easeBothStrong', function () {
          self.fire('show');
        });
        $dialog.one('.J_KBSlider-step').item(0).fire('click');
        $dialog.data('_later', new Layter(function () {
          $dialog.one('.J_KBSlider-next').fire('click');
        }));
      }).on('hide', function () {
        var later = $dialog.data('_later');
        later && later.stop();
        $mask.animate({
          opacity: 0
        }, '.4', 'easeBothStrong');
        $dialog.one('.J_KBDialog').animate({
          top: 10,
          opacity:0
        }, '.4', 'backBothStrong', function () {
          $dialog.hide();
          $mask.hide();
          self.fire('hide');
        });
      }).delegate('mouseenter.stop', '.J_KBSlider', function () {
        var later = $dialog.data('_later');
        later && later.stop();
      }).delegate('mouseleave.start', '.J_KBSlider', function () {
        var later = $dialog.data('_later');
        later && later.start();
      }).delegate('click.close', '.J_KBClose', function () {
        self.hide();
      }).delegate('click.prev', '.J_KBSlider-prev', function (e) {
        var $current = $dialog.one('.J_KBSlider-cur');
        var curIndex = $current.attr('data-index');
        ($current.prev() || $current.parent().last('.J_KBSlider-step')).fire('click');
      }).delegate('click.next', '.J_KBSlider-next', function (e) {
        var $current = $dialog.one('.J_KBSlider-cur');
        var curIndex = $current.attr('data-index');
        ($current.next() || $current.siblings().item(0)).fire('click');
      }).delegate('click.step', '.J_KBSlider-step', function (e) {
        var $this = Node.one(e.target);
        var $active = $dialog.one('.J_KBSlider-cur') || $this.parent().last('.J_KBSlider-step');
        $this.siblings().removeClass(CURRENT_HANDLE_CLASS);
        $this.addClass(CURRENT_HANDLE_CLASS);
        var $current = $dialog.one('.J_KBSlider-item' + $this.attr('data-index'));
        var $prev = $dialog.one('.J_KBSlider-item' + $active.attr('data-index'));
        $prev.fire('slider.hide');
        $current.fire('slider.show');
      }).delegate('slider.show', '.J_KBSlider-item', function (e) {
        Node.one(e.target).animate({
          left: 0
        }, '.4', 'easeBothStrong');
      }).delegate('slider.hide', '.J_KBSlider-item', function (e) {
        var $this = Node.one(e.target).animate({
          left: '-100%'
        }, '.4', 'easeBothStrong', function () {
          $this.css('left', '100%');
        });
      });
      return this;
    },
    show: function () {
      this.$dialog.fire('show');
      return this;
    },
    hide: function () {
      this.$dialog.fire('hide');
      return this;
    }
  };
  var members = {};
  if (Base.extend) {
    return Base.extend(props);
  } else {
    return S.extend(Dialog, props, members);
  }
}, {
  requires: [
    'base',
    'node'
  ]
});