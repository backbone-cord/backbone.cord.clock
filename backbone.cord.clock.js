;(function(root) {
'use strict';

var Backbone = root.Backbone || require('backbone');

var _NAMESPACE = 'clock';

function _onSecond() {
	var date = new Date();
	this._invokeObservers(_NAMESPACE, 'seconds', date.getSeconds());
	this._secondtid = window.setTimeout(_onSecond.bind(this), (1000 - Date.now() % 1000));
}

function _onMinute() {
	var date = new Date();
	this._invokeObservers(_NAMESPACE, 'minutes', date.getMinutes());
	this._invokeObservers(_NAMESPACE, 'hours', date.getHours());
	this._invokeObservers(_NAMESPACE, 'day', date.getDate());
	this._invokeObservers(_NAMESPACE, 'month', date.getMonth() + 1);
	this._invokeObservers(_NAMESPACE, 'year', date.getFullYear());
	this._invokeObservers(_NAMESPACE, 'time', date.getTime());
	this._minutetid = window.setTimeout(_onMinute.bind(this), (60000 - Date.now() % 60000));
}

Backbone.Cord.plugins.push({
	name: 'clockscope',
	scope: {
		namespace: _NAMESPACE,
		observe: function(key) {
			if(key === 'milliseconds') {
				if(!this._hasObservers(_NAMESPACE, key))
					this._millisecondtid = window.setInterval(function() {
						this._invokeObservers(_NAMESPACE, 'milliseconds', (new Date()).getMilliseconds());
					}.bind(this), 50);
			}
			else if(key === 'seconds') {
				if(!this._hasObservers(_NAMESPACE, key))
					this._secondtid = window.setTimeout(_onSecond.bind(this), (1000 - Date.now() % 1000));
			}
			else if(!this._hasObservers(_NAMESPACE)) {
				this._minutetid = window.setTimeout(_onMinute.bind(this), (60000 - Date.now() % 60000));
			}
		},
		unobserve: function(key) {
			if(key === 'milliseconds') {
				if(!this._hasObservers(_NAMESPACE, key))
					window.clearInterval(this._millisecondtid);
			}
			else if(key === 'seconds') {
				if(!this._hasObservers(_NAMESPACE, key))
					window.clearTimeout(this._secondtid);
			}
			else if(!this._hasObservers(_NAMESPACE)) {
				window.clearTimeout(this._minutetid);
			}
		},
		getValue: function(key) {
			var date = new Date();
			switch(key) {
				case 'milliseconds':
					return date.getMilliseconds();
				case 'seconds':
					return date.getSeconds();
				case 'minutes':
					return date.getMinutes();
				case 'hours':
					return date.getHours();
				case 'day':
					return date.getDate();
				case 'month':
					return date.getMonth() + 1;
				case 'year':
					return date.getFullYear();
				case 'time':
					return date.getTime();
			}
		}
	},
	remove: function() {
		window.clearInterval(this._millisecondtid);
		window.clearTimeout(this._secondtid);
		window.clearTimeout(this._minutetid);
	}
});

})(((typeof self === 'object' && self.self === self && self) || (typeof global === 'object' && global.global === global && global)));
