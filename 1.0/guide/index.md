## 综述

DepartureLayer是一个可配置的弹出浮层，在检测到一定的浏览器版本时弹出，提供了默认主题，用户可自行配置浮层样式及浮层弹出的条件、间隔时间等。

* 版本：1.0
* 作者：槿瑟
* demo：[http://gallery.kissyui.com/DepartureLayer/1.0/demo/index.html](http://gallery.kissyui.com/DepartureLayer/1.0/demo/index.html)

## 初始化组件
### 使用默认配置
    
1.引入js文件

```
    S.use('gallery/DepartureLayer/1.0/index', function (S, DepartureLayer) {
        var departureLayer = new DepartureLayer();
        departureLayer.show();
    })
 ```
2.引入默认css：

```   
    <link rel="stylesheet" href="http://a.tbcdn.cn/s/kissy/gallery/DepartureLayer/1.0/DepartureLayer.css" />
```
### 自定义配置
用户可自定义部分或全部配置项，未配置项将采用默认配置。
## API说明
用户在初始化DepartureLayer对象时可通过传入全部或部分配置项实现浮层内容及样式的自定义构造，使用格式形如：
    
    var departureLayer = new DepartureLayer({ /* configuration items */ });
        departureLayer.show();

### 配置属性
DepartureLayer可配置的属性包括如下：

* `browser` ：配置浏览器类型及版本，DepartureLayer的浮层将在检测到对应的浏览器及版本的情况下弹出。设置为[{'ie','10'}]则浮层在浏览器为ie且版本号小于等于10时弹出；设置为[{ browser:'ie', maxversion: '10'},{ browser:'chrome', maxversion: '36'}]则将在浏览器<=ie10且<=chrome36时弹出。
* `intervalTime` ： 配置DepartureLayer浮层两次弹出的间隔时间，以`ms`为单位，默认为WEEK_MS，即1000 x 60 x 60 x 24 x 7 = 604800000ms，浮层被关闭后将在1周后再次弹出。
* `layer` ： 配置浮层样式，用户可配置浮层提示文案（tip）、图片按钮的样式（btn_type_pic）及轮播张数和样式（imgsrc，基于kissy gallery slide）。
* `updateLink` ： 配置DepartureLayer上按钮被点击后的跳转地址。
* `toptipBar` ： 配置浮层被关闭后的提示条是否显示（enable=true）以及提示条的提示文本（toptip_text）及按钮文本。（toptip_btn_text）。

 ```
  // 默认配置：
  {
    browser : [{browser:'ie', maxversion: '10'}], 
    intervalTime : '604800000',     
        layer : 
        {
      tip : '其实...亲有更好的选择',
      btn_type_pic : 'http://gtms04.alicdn.com/tps/i4/TB1kLVqFVXXXXX1XpXXJPIyFpXX-143-56.png',
      imgsrc : [ 'http://gtms01.alicdn.com/tps/i1/TB1UpxsFVXXXXbIXXXXIXul4XXX-860-342.png',
                       'http://gtms02.alicdn.com/tps/i2/TB1d9prFVXXXXc1XXXXl0Cl4XXX-860-343.png',
                       'http://gtms03.alicdn.com/tps/i3/TB1OORrFVXXXXcbXXXXIXul4XXX-860-342.png']
            },
    toptipBar : 
    {
      enable : true,
      toptip_text : '亲，您的浏览器版本过低导致图片打开速度过慢，提升打开速度您可以：',
      toptip_btn_text : '升级浏览器'
    },
    updateLink : 'http://windows.microsoft.com/zh-cn/internet-explorer/download-ie' ‘
  }
```
                
## 说明：
以 ua 判断浏览器真正版本可能不准确，比如用户切换 浏览器模式或文本模式。 这时候请在 html head 标签内添加如下代码，使浏览器以最新引擎渲染。

```
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
```