const CPM = require('comlog-process-manager');

function ComlogFileTimeWatcher(options) {
	require('comlog-event-handler')(this);

	var	_self = this;
	this.satus = null; // null = start, true = off, false = on
	this.debug = false;
	this.interval = 3000; // 1 Minute

	// Private funktionen
	var _running = false, _timer = null;

	function _watch() {
		if (_running) return;
		_running = true;

		CPM.lookup(options, function (err, resultList) {
			if (err !== null) {
				if (_self.debug) console.error(err.stack || err);
				_self.trigger('error', [new Error("Process check error \n"+err.message)]);
				if (_self.satus === true) _self.trigger('down');
				_self.satus = false;
			}
			else {
				if (resultList.length > 0) {
					if (_self.debug) console.info("Process check ok");
					if (_self.satus === false) _self.trigger('up');
					_self.satus = true;
				}
				else {
					if (_self.debug) console.info("Process not found");
					if (_self.satus === true) _self.trigger('down');
					_self.satus = false;
				}
			}

			_running = false;
			_timer = setTimeout(_watch, _self.interval);
		});
	}
	
	/**
	 * Überwachung starten
	 */
	this.start = function() {
		_watch();
	};

	/**
	 * Überwachung stoppen
	 */
	this.stop = function() {
		if (_timer !== null) clearInterval(_timer);
	};

	for(var i in options) this[i] = options[i];
}

module.exports = ComlogFileTimeWatcher;