KISSY.add(function (S, UA, Store) {
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