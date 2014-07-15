KISSY.add(function (S, Base, Node) {
  function Toptip () {}
  var props = {
    render: function (config) {
      var self = this;
      var content;
      if (S.isString(config)) {
        content = config;
      } else {
        config = S.mix({
          title : '亲，您的浏览器版本过低导致网页打开速度过慢，为享受极速体验，我们建议亲：',
          button : '升级浏览器',
          href: 'http://windows.microsoft.com/zh-cn/windows/downloads'
        }, config, true, null, true);

        content = '<span class="kb-toptip-title">'+
          config.title+
          '</span><a href="'+
          config.href+
          '" target="_blank" class="kb-toptip-btn">'+config.button+'</a>';
      }
      var $toptip = self.$toptip = Node('<div class="kb-toptip kb-toptip-wrapper">' + 
          content + 
          '</div>').prependTo('body').hide().on('show', function () {
        $toptip.show().animate({
          marginTop: 0
        }, '.4', 'easeBothStrong', function(){
          self.fire('show');
        });
      }).on('hide', function () {
        $toptip.animate({
          marginTop: -45
        }, '.4','easeBothStrong', function () {
          $toptip.hide();
          self.fire('hide');
        });
      });
      return this;
    },
    show: function () {
      this.$toptip.fire('show');
      return this;
    },
    hide: function () {
      this.$toptip.fire('hide');
      return this;
    }
  };
  var members = {};
  if (Base.extend) {
    return Base.extend(props, members);
  } else {
    return S.extend(Toptip, props, members);
  }
},{
  requires:['base', 'node']
});