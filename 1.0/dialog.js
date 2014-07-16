KISSY.add(function (S, Base, Node) {
  var VOID_DEFAULT = "javascript:void(0)";
  var CURRENT_HANDLE_CLASS = 'kb-slider-cur J_KBSlider-cur';
  function Layter (handle, during) {
    this._handle = handle;
    this._during = during || 4000;
    return this;
  }
  Layter.prototype = {
    constructor: Layter,
    start: function () {
      this.stop();
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

  function Dialog () {}
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
          closeWarn: "不，我还要用这悲催的方式浏览",
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
        if (config.slider.length < 2) {
          S.log('Error: Dialog slider config error, the slider must be [Array]{2-5}');
          return false;
        }

        S.each(config.slider.slice(0,5), function (slide, i) {
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
      var $mask = Node('<div class="kb-mask"></div>').appendTo('body');
      var $dialog = self.$dialog = Node([
        '<div class="kb-dialog"><!--[if IE 6]><span class="kb-dialog-refer"></span><![endif]--><div class="kb-dialog-wrapper J_KBDialog">',
          '<a href="javascript:void(0);"  class="kb-dialog-close-wrapper J_KBClose">',
            '<span class="kb-close">✕</span>',
            config.closeWarn ? '<span class="kb-warn">'+config.closeWarn+'</span>':'',
          '</a>',
          '<div class="kb-dialog-content">',
            content,
          '</div>',
        '</div></div>'
      ].join('')).appendTo('body').delegate('click.close', '.J_KBClose', function () {
        self.hide();
      });
      if (!S.isString(config)) {
        self._bindSliderEvt($dialog, $mask);
      }
      self._bindEvt($dialog, $mask);
      return this;
    },
    _bindSliderEvt: function ($dialog, $mask) {
      var _later;
      var self = this;
      $dialog.on('slider.start', function () {
        if (!_later) {
          $dialog.one('.J_KBSlider-step').item(0).fire('click');
        }
        _later = _later || new Layter(function () {
          $dialog.one('.J_KBSlider-next').fire('click');
        });
        _later.start();
      }).on('slider.stop', function () {
        _later && _later.stop();
      }).delegate('mouseenter.stop', '.J_KBSlider', function () {
        $dialog.fire('slider.stop');
      }).delegate('mouseleave.start', '.J_KBSlider', function () {
        $dialog.fire('slider.start');
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
        if ($this.hasClass('.J_KBSlider-cur')) {return false}
        var $active = $dialog.one('.J_KBSlider-cur') || $this.parent().last('.J_KBSlider-step');
        $this.siblings().removeClass(CURRENT_HANDLE_CLASS);
        $this.addClass(CURRENT_HANDLE_CLASS);
        var $current = $dialog.one('.J_KBSlider-item' + $this.attr('data-index'));
        var $prev = $dialog.one('.J_KBSlider-item' + $active.attr('data-index'));
        $prev.fire('slider.hide');
        $current.fire('slider.show');
      });
    },
    _bindEvt: function ($dialog,$mask) {
      var self = this;
      $dialog.on('show', function () {
        Node.one('body').addClass('body-fix');
        $mask.show().animate({
          opacity: '.75'
        },'.4', 'easeBothStrong');
        $dialog.show().one('.J_KBDialog').animate({
          opacity: 1
        }, '.4', 'easeBothStrong', function () {
          self.fire('show');
        });
        $dialog.fire('slider.start');
      }).on('hide', function () {
        $dialog.fire('slider.stop');
        $mask.animate({
          opacity: 0
        }, '.4', 'easeBothStrong');
        $dialog.one('.J_KBDialog').animate({
          opacity:0
        }, '.4', 'backBothStrong', function () {
          $dialog.hide();
          $mask.hide();
          Node.one('body').addClass('body-fix');
          self.fire('hide');
        });
      });
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