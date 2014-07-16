## 综述

DepartureLayer是一个可配置的弹出浮层，在检测到一定的浏览器版本时弹出，提供了默认主题，用户可自行配置浮层样式及浮层弹出的条件、间隔时间等。

* 版本：1.0
* 作者：槿瑟
* demo：[http://gallery.kissyui.com/DepartureLayer/1.0/demo/index.html](http://gallery.kissyui.com/DepartureLayer/1.0/demo/index.html)

## 如何引入组件

```
KISSY.use('gallery/DepartureLayer/1.0/index')
```

## 初始化组件
```
KISSY.use('gallery/DepartureLayer/1.0/index', function (S, Killer) {
  var killer = new Killer({
    // 可选参数，用以匹配浏览器
    ua: [
      {
        // 浏览器名称 具体配置名称请参考[KISSY 1.3 KISSY.UA](http://docs.kissyui.com/1.3/docs/html/api/core/ua/) [KISSY 1.4 KISSY.UA](http://docs.kissyui.com/1.4/docs/html/api/ua/index.html)
        browser: 'chrome',
        // 支持多种校验模式 
        // 目前支持 
        // `<=${version}` 所有小于等于该版本的都会命中
        // `>=${version}` 所有大于等于该版本的都会命中
        // `=${version}`  所有等于该版本的都会命中
        // `<${version}`  所有小于该版本的都会命中
        // `>${version}`  所有大于该版本的都会命中
        // `~${version}`  所有大于等于该版本，小于下一版本区间的都会命中 （~12 => 12-20）
        // `${version}-${version}` 某个区间内都会命中
        version: '<12',
        // 枚举： all dialog toptip
        show: 'all'
      }
    ],
    // 可配置html 如果配置html 则需要手动
    dialog: {
      // 提示升级的链接地址
      updateUrl: 'http://windows.microsoft.com/zh-cn/windows/downloads?spm=608.2291429.20140707.12.KdZxog',
      // 升级提醒的引导文案
      updateGuid: '其实...亲有更好的选择',
      // 关闭按钮部分的文案配置。
      closeWarn: "不，我还要用这悲催的方式浏览",
      // 升级按钮样式
      updateBtn: 'http://gtms03.alicdn.com/tps/i3/TB1RcVQFVXXXXbvXFXXcgZpFXXX-140-48.png',
      // slider 配置 最多5个最少2个
      slider : [ 
        {
          // slider图片内容
          img: 'http://gtms01.alicdn.com/tps/i1/TB1UpxsFVXXXXbIXXXXIXul4XXX-860-342.png',
          // 链接地址
          href: VOID_DEFAULT,
          // 图片的alt属性配置
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
    },
    // 和dialog相同，可配置html，但配置html后的事件，行为需要开发者自己维护。
    toptip: {
      // 左侧提示文案
      title : '亲，您的浏览器版本过低导致网页打开速度过慢，为享受极速体验，我们建议亲：',
      // 按钮文案
      button : '升级浏览器',
      // 链接地址
      href: 'http://windows.microsoft.com/zh-cn/windows/downloads'
    },
    // 自定义的css样式地址
    theme: 'css path',
    // 毫秒数，失效时间配置，用以控制dialog的失效，失效后如果配置的`show`是`dialog` 或者`all` 则会弹出`dialog`
    expires: 1020012
  });
  // 使用默认配置进行浏览器弹窗
  // callback 捕捉到的参数分别为 
  // `Store` 用来操作本地存储。 
  // `dialog` 初始化完成的`dialog`对象 当`show`不为 `dialog` 或者 `all` 的时候为 `null` 
  // `toptip` 初始化完成的`toptip`对象 当`show`不为 `toptip` 或者 `all` 的时候为 `null` 
  // `context` 当前的 `killer` 对象
  function callback(Store, dialog, toptip) {}
  // 开始弹窗
  killer.kill(callback);

  // matched version
  killer.browser
  // matched version
  killer.version
  // matched user rule 
  killer.rule
  // function to match the version
  killer.match
  // the matched result
  killer.matched
});
```
                
## 说明：
以 ua 判断浏览器真正版本可能不准确，比如用户切换 浏览器模式或文本模式。 这时候请在 html head 标签内添加如下代码，使浏览器以最新引擎渲染。

```
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
```