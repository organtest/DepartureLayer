/*
combined files : 

gallery/DepartureLayer/1.0/store
gallery/DepartureLayer/1.0/toptip
gallery/DepartureLayer/1.0/index

*/
/**
 * @fileOverview 本地存储
 * @creator 槿瑟<jinse.zjw@alibaba-inc.com>
 * @modify 良田<chenhao.lch@alibaba-inc.com>
 * @update 2014-07-15
 * @log 
 *   更新 var 按照规范
 *   更新 tabsize 按照规范
 */
KISSY.add('gallery/DepartureLayer/1.0/store',function(S) {
	var api               = {};
	var win               = window;
	var doc               = win.document;
	var localStorageName  = 'localStorage';
	var globalStorageName = 'globalStorage';
	var storage;

	api.set    = function (key, value) {};
	api.get    = function (key)        {};
	api.remove = function (key)        {};
	api.clear  = function ()           {};

	if (localStorageName in win && win[localStorageName]) {
		storage    = win[localStorageName];
		api.set    = function (key, val) { storage.setItem(key, val) };
		api.get    = function (key)      { return storage.getItem(key) };
		api.remove = function (key)      { storage.removeItem(key) };
		api.clear  = function ()         { storage.clear() };
	} else if (globalStorageName in win && win[globalStorageName]) {
		storage    = win[globalStorageName][win.location.hostname];
		api.set    = function (key, val) { storage[key] = val };
		api.get    = function (key)      { return storage[key] && storage[key].value };
		api.remove = function (key)      { delete storage[key] };
		api.clear  = function ()         { for (var key in storage ) { delete storage[key] } };
	} else if (doc.documentElement.addBehavior) {
		function getStorage() {
			if (storage) { return storage }
			storage = doc.body.appendChild(doc.createElement('div'));
			storage.style.display = 'none';
			// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
			// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
			storage.addBehavior('#default#userData');
			storage.load(localStorageName);
			return storage;
		}
		api.set = function (key, val) {
			var storage = getStorage();
			storage.setAttribute(key, val);
			storage.save(localStorageName);
		};
		api.get = function (key) {
			var storage = getStorage();
			return storage.getAttribute(key);
		};
		api.remove = function (key) {
			var storage = getStorage();
			storage.removeAttribute(key);
			storage.save(localStorageName);
		}
		api.clear = function () {
			var storage = getStorage();
			var attributes = storage.XMLDocument.documentElement.attributes;;
			storage.load(localStorageName);
			for (var i=0, attr; attr = attributes[i]; i++) {
				storage.removeAttribute(attr.name);
			}
			storage.save(localStorageName);
		}
	}
	return api;
});
KISSY.add('gallery/DepartureLayer/1.0/toptip',function (S, Base, Node) {
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
/**
 * @fileOverview  @DepartureLayer
 * @creator 槿瑟<jinse.zjw@alibaba-inc.com>
 * @uses 良田 <chenhao.lch@alibaba-inc.com>
 * @version 1.0
 * @update 2014-07-16
 * @example
 *
 *    KISSY.use('gallery/DepartureLayer/1.0/index', function(S,BK){
 *           var killer = new BK({   
 *               browser : [
 *                 { 
 *                   browser:'ie', 
 *                   version: '<8',
 *                   show: 'all'
 *                 },
 *                 { 
 *                   browser: 'chrome', 
 *                   version: '<36',
 *                   show: 'toptip'
 *                 },
 *                 {
 *                   browser: 'firefox',
 *                   version: '<=10',
 *                   show: 'dialog'
 *                 }
 *               ], 
 *               expires: 20000000,
 *               theme: 'work/resetui.css',
 *               dialog : {
 *                   updateUrl : 'http://windows.microsoft.com/zh-cn/internet-explorer/download-ie',
 *                   updateGuid : '其实...亲有更好的选择',
 *                   closeWarn: "不，我还要用这悲催的方式浏览",
 *                   updateBtn: 'http://gtms03.alicdn.com/tps/i3/TB1RcVQFVXXXXbvXFXXcgZpFXXX-140-48.png',
 *                   slider : [ 
 *                   {
 *                     img: 'http://gtms01.alicdn.com/tps/i1/TB1UpxsFVXXXXbIXXXXIXul4XXX-860-342.png',
 *                     href: VOID_DEFAULT,
 *                     alt: ""
 *                   }, {
 *                     img:'http://gtms02.alicdn.com/tps/i2/TB1d9prFVXXXXc1XXXXl0Cl4XXX-860-343.png',
 *                     href: VOID_DEFAULT,
 *                     alt: ""
 *                   },{
 *                     img: 'http://gtms03.alicdn.com/tps/i3/TB1OORrFVXXXXcbXXXXIXul4XXX-860-342.png',
 *                     href: VOID_DEFAULT,
 *                     alt: ""
 *                   }
 *                 ]
 *               },
 *               toptip : 
 *               {
 *                   title : '亲，您的浏览器版本过低导致图片打开速度过慢，提升打开速度您可以：',
 *                   button : '升级浏览器',
 *                   href: 'http://windows.microsoft.com/zh-cn/internet-explorer/download-ie' 
 *               }
 *           });
 *           killer.kill();
 *       });
 *   })(KISSY);
 * 
 */
KISSY.add('gallery/DepartureLayer/1.0/index',function (S, UA, Store) {
  // This package path
  var packagePath = 'gallery/DepartureLayer/1.0/';
  // Support tokens < > <= >= = ~ d-d
  var reToken = /^\s*([<>=~]{0,2})\s*(\d+)\s*$|^\s*(\d+)\s*\-\s*(\d+)\s*$/i;
  // noop func for hack
  var noop = S.noop;
  // one week time (ms)
  var ONE_WEEK_TIME = 1000 * 60 * 60 * 24 * 7;
  // localStorage key
  var BROWSER_KILLER_TIME_STAMP = 'bk_timestamp';
  /**
   * get a version string like `>=12` => function (version) {return boolean}
   * @param  {String} version   All support string for version check 
   * @return {Function}         The function for check version
   */
  function _version2func (version) {
    // all version
    if (version === '*') {
      return function () {
        return true;
      };
    }
    var matched = version.match(reToken);
    // Match nothing
    if (!matched) {
      S.log('Unexpacted version: ' + version);
      return noop;
    }

    // use `<=` as default 
    var rangeCheckToken = matched[1] || '<=';
    // get the max version number (in first case <=d)
    var maxVersion = +matched[2];
    // get the min version number (in second case d-d)
    var minVersion = +matched[3];
    // < > <= >= ~ =  first case
    if (rangeCheckToken && maxVersion) {
      // range check 
      if (rangeCheckToken === '~') {
        var min = maxVersion;
        var max = (maxVersion / 10 | 0) + 10; // what to do this ?
        return function (version) {
          return version && version < max && version >= min;
        };
      }
      // equal check
      if (rangeCheckToken === '=') {
        rangeCheckToken = '==';
      }
      // create function
      return new Function('version', 'return null != version && version > 0.1 && (version '+ rangeCheckToken + ' ' + maxVersion +');');
    // d-d second case
    } else if ((maxVersion = matched[4]) && minVersion) {
      return function (version) {
        return version >= minVersion && version <= maxVersion;
      }
    // don't support ? throw Error
    } else {
      S.log('Unexpacted version: ' + version);
    }
  }
  /**
   * UACheck , check ua and do something
   * @param {Object} config the config for init
   * @example
   *   new UACheck({
   *     'ua': [],
   *     'dialog': '',
   *     'toptip': {},
   *     'theme': '',
   *     'expires': 123123
   *   });
   */
  function UACheck (config) {
    if (!(this instanceof UACheck)) {
      return new UACheck(config);
    }
    return this.config(config);
  }

  UACheck.prototype = {
    constructor: UACheck,
    config: function (config) {
      var self = this;
      /**
       * The default config
       * @type {Object}
       * @member ua {Array} The ua set
       * @member theme {String} The theme wanted reset
       * @member expires {long} The time for expires
       * @member dialog {Object || String} The dialog config or the content html
       * @member toptip {Object || String} The toptip config or the content html
       */
      var options = self.options = S.mix(self.options || {
        // {
        //   browser: 'ie',
        //   version: '<7',
        //   show: 'all'
        // },
        // {
        //   browser: 'ie',
        //   version: '<8',
        //   show: 'toptip'
        // }
      
        ua: [],
        theme: '',
        expires: ONE_WEEK_TIME,
        dialog: {},
        toptip: {}
      }, config, true, null, true);
      var uacheck = options.ua;
      var ALL = 'all';
      var DIALOG = 'dialog';
      var TOPTIP = 'toptip';
      var DEFAULT_SHOW = ALL;
      S.each(uacheck, function (rule, i) {
        if (self.matched) {return}
        var browser = rule.browser;
        var version = rule.version;
        self.show = rule.show || DEFAULT_SHOW;
        var target = +UA[browser];
        if (!target) {
          S.log('Warning: `config.ua[' + i + '].browser` is invalid. Found `' + UA[browser] + '` under the `KISSY.UA.' + browser + '`.');
          return;
        }
        if (!version) {
          S.log('Warning: `config.ua[' + i + '].version` is undefined!');
          return;
        }
        self.browser = browser;
        self.version = target;
        self.rule = version;
        self.match = _version2func(version);
        self.matched = self.match(target);
      });
      return self;
    },
    matched: false,
    /**
     * check is out of expires
     * @param  {long} time ms
     * @return {integer}  enum 0 1
     */
    _outOfExpires: function (time) {
      var timestamp = +Store.get(BROWSER_KILLER_TIME_STAMP);
      if (!timestamp || !time || (+new Date - timestamp) > time) {
        return 1;
      }
      return 0;
    },
    /**
     * load the toptip only
     * @param  {Function} callback when the toptip init finished
     * @return {null}            
     */
    _showToptip: function (callback) {
      var self = this;
      var options = self.options;
      KISSY.use([
        packagePath + 'toptip.js',
        options.theme ? 
          options.theme : 
          packagePath + 'toptip.less.css'
      ], function (S, Toptip) {
        callback.call(self, Store, null, new Toptip().render(options.toptip).show());
      });
    },
    /**
     * load the dialog only
     * @param  {Function} callback callback when the dialog init finished
     * @return {null}           
     */
    _showDialog: function (callback) {
      var self = this;
      var options = self.options;
      KISSY.use([
        packagePath + 'dialog.js',
        options.theme ? 
          options.theme : 
          packagePath + 'dialog.less.css'
      ], function (S, Dialog) {
        callback.call(self, Store, new Dialog().render(options.dialog).show());
      });
    },
    /**
     * load dialog and toptip
     * @param  {Function} callback when the dialog and toptip init finished
     * @notice When the dialog hide, the toptip show. But U can control this;
     * @return {Null}
     */
    _showAll: function (callback) {
      var self = this;
      var options = self.options;
      var modules = [packagePath + 'dialog.js',packagePath + 'toptip.js'];
      if (options.theme) {
        modules.push(options.theme);
      } else {
        modules.push(packagePath + 'dialog.less.css');
        modules.push(packagePath + 'toptip.less.css');
      }
      KISSY.use(modules, function (S, Dialog, Toptip) {
        var toptip = new Toptip().render(options.toptip);
        callback.call(self, Store, new Dialog().render(options.dialog).show().on('hide', function () {
          toptip && toptip.show();
          Store.set(BROWSER_KILLER_TIME_STAMP, +new Date);
        }), toptip);
      });
    },
    /**
     * run kill
     * @param  {Function} callback 
     * @return {UACheck}            self
     */
    kill: function (callback) {
      var self = this;
      var options = self.options;
      callback = callback || noop;
      if (self.matched) {
        // out of expires ,just show the toptip
        if (!self._outOfExpires(options.expires)) {
          self.show = 'toptip';
        }
        if (self.show === 'toptip') {
          self._showToptip(callback);
          return self;
        }
        if (self.show === 'dialog') {
          self._showDialog(callback);
          return self;
        }
        self._showAll(callback);
      }
      return self;
    }
  };
  // for version check 
  UACheck.VERSION = '1.0';
  return UACheck;
}, {
  requires: [
    'ua',
    './store.js',
    './toptip.less.css',
    './toptip.js'
  ]
});
