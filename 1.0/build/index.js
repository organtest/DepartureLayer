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
KISSY.add('gallery/DepartureLayer/1.0/index',function (S, UA, Store) {
  var packagePath = 'gallery/DepartureLayer/1.0/';
  var reToken = /^([<>=~]{0,2})(\d+)$|^(\d+)\-(\d+)$/i;
  var noop = S.noop;
  var ONE_WEEK_TIME = 1000 * 60 * 60 * 24 * 7;
  var BROWSER_KILLER_TIME_STAMP = 'bk_timestamp';

  function _version2func (version) {
    // all version
    if (version === '*') {
      return function () {
        return true;
      };
    }
    var matched = version.match(reToken);
    if (!matched) {
      S.log('Unexpacted version: ' + version); 
    }
    // 默认是小于等于
    var rangeCheckToken = matched[1] || '<=';
    var maxVersion = +matched[2];
    var minVersion = +matched[3];
    // < > <= >= ~ = 
    if (rangeCheckToken && maxVersion) {
      if (rangeCheckToken === '~') {
        var min = maxVersion;
        var max = (maxVersion / 10 | 0) + 10; // what to do this ?
        return function (version) {
          return version && version < max && version >= min;
        };
      }
      if (rangeCheckToken === '=') {
        rangeCheckToken === '==';
      }
      return new Function('version', 'return version && (version '+ rangeCheckToken + ' ' + maxVersion +');');
    } else if ((maxVersion = matched[4]) && minVersion) {
      return function (version) {
        return version >= minVersion && version <= maxVersion;
      }
    } else {
      S.log('Unexpacted version: ' + version);
    }
  }
  function UACheck (config) {
    if (!(this instanceof UACheck)) {
      return new UACheck(config);
    }
    return this.config(config);
  }

  UACheck.prototype = {
    constructor: UACheck,
    config: function (config, callback) {
      var self = this;
      var options = self.options = S.mix(S.mix({}, self.options || UACheck.CONFIG, true, null, true), config, true, null, true);
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
        self.matched = _version2func(version)(target);
      });
      return self;
    },
    matched: false,
    _outOfExpires: function (time) {
      var timestamp = +Store.get(BROWSER_KILLER_TIME_STAMP);
      if (!timestamp || !time || (+new Date - timestamp) > time) {
        return 1;
      }
      return 0;
    },
    _showToptip: function (callback) {
      var self = this;
      var options = self.options;
      KISSY.use([
        packagePath + 'toptip.js',
        options.theme ? options.theme : packagePath + 'toptip.less.css'
      ], function (S, Toptip) {
        var toptip = new Toptip;
        callback.call(self, toptip.render(options.toptip).show());
      });
    },
    _showDialog: function (callback) {
      var self = this;
      var options = self.options;
      KISSY.use([
        packagePath + 'dialog.js',
        options.theme ? options.theme : packagePath + 'dialog.less.css'
      ], function (S, Dialog) {
        var dialog = new Dialog;
        callback.call(self, dialog.render(options.dialog).show());
      });
    },
    _showAll: function (callback) {
      var self = this;
      var options = self.options;
      var modules = [
        packagePath + 'dialog.js',
        packagePath + 'toptip.js'
      ];
      if (options.theme) {
        modules.push(options.theme);
      } else {
        modules.push(packagePath + 'dialog.less.css');
        modules.push(packagePath + 'toptip.less.css');
      }
      KISSY.use(modules, function (S, Dialog, Toptip) {
        var dialog = new Dialog;
        var toptip = new Toptip;
        dialog.render(options.dialog).show();
        toptip.render(options.toptip);
        dialog.on('hide', function () {
          toptip.show();
          // Store.set(BROWSER_KILLER_TIME_STAMP, +new Date);
        });
        callback.call(self, dialog, toptip);
      });
    },
    kill: function (callback) {
      var self = this;
      var options = self.options;
      callback = callback || noop;
      if (self.matched) {
        // 未过期的时候只展示toptip
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
  UACheck.CONFIG = {
    ua: [],
    theme: '',
    expires: ONE_WEEK_TIME,
    dialog: {},
    toptip: {}
  };
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
