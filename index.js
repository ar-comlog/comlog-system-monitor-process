const CPM = require('comlog-process-manager');

function ComlogFileTimeWatcher(options) {
	require('comlog-event-handler')(this);

	var	_self = this;
	this.satus = null; // null = start, true = off, false = on
	this.debug = false;
	this.interval = 3000; // 1 Minute
	this.maxMemory = -1;
	this.minMemory = -1;
	this.maxCount = -1;
	this.minCount = -1;

	// Private funktionen
	var _running = false, _timer = null;

	function _toFloat(num) {
		num = num+'';
		if (num.indexOf(',') > -1 && num.indexOf(',') > -1) {
			if (num.indexOf(',') > num.indexOf('.')) num = num.split('.').join('').split(',').join('.');
			if (num.indexOf('.') > num.indexOf(',')) num = num.split(',').join('');
		}
		else if (num.indexOf(',') > -1) num = num.split(',').join('.');
		if (isNaN(num)) num = num.replace(/[^0-9.]/g, '');
		if (isNaN(num)) num = 0;
		return parseFloat(num);
	}

	function _memConvert(size) {
		if (typeof size == 'string') {
			var m = size.match(/([0-9.,]+)(.*)/);
			switch (m[2]) {
				case 'G':
				case 'GB':
				case 'g':
				case 'gb':
					size = _toFloat(m[1])*8589934592;
					break;
				case 'Gb':
					size = _toFloat(m[1])*1000000000;
					break;
				case 'M':
				case 'MB':
				case 'm':
				case 'mb':
					size = _toFloat(m[1])*8388608;
					break;
				case 'Mb':
					size = _toFloat(m[1])*1000000;
					break;
				case 'KB':
				case 'kb':
					size = _toFloat(m[1])*1024;
					break;
				case 'Kb':
					size = _toFloat(m[1])*1000*8;
					break;
				case 'B':
				case 'Byte':
					size = _toFloat(m[1])*8;
					break;
				default:
					size = _toFloat(m[1]);
					break;
			}
		}
		if (isNaN(size)) size = 0;
		return size;
	}

	function _watch() {
		if (_running) return;
		_running = true;

		// Extracting local options
		for(var i in options) {
			if (typeof this[i] != 'undefined') {
				options[i] = options[i];
				delete options[i];
			}
		}

		CPM.lookup(options, function (err, resultList) {
			debugger;
			if (err !== null) {
				if (_self.debug) console.error(err.stack || err);
				_self.trigger('error', [new Error("Process check error \n"+err.message)]);
				if (_self.satus === true) _self.trigger('down');
				_self.satus = false;
			}
			else {
				if (resultList.length > 0) {
					var new_status = true, msg = 'Process check ok';
					_self.maxMemory = _memConvert(_self.maxMemory);
					_self.minMemory = _memConvert(_self.minMemory);

					// to many processes
					if (_self.maxCount > -1 && _self.maxCount < resultList.length) {
						new_status = false;
						msg = "To many processes";
					}
					// To few processes
					else if (_self.minCount > -1 && _self.minCount > resultList.length) {
						new_status = false;
						msg = "To few processes";
					}
					// out of memory
					else if (_self.maxMemory > -1 || _self.minMemory > -1) {
						var memsum = 0;
						for(var p=0; p < resultList.length; p++) {
							memsum += _toFloat(resultList[p].memory);
						}
						if (_self.maxMemory > -1 && _self.maxMemory < memsum) {
							new_status = false;
							msg = "Big memory usage";
						}
						else if (_self.maxMemory > -1 && _self.minMemory > memsum) {
							new_status = false;
							msg = "Low memory usage";
						}
					}

					// check result
					if (_self.debug) console.info(msg);
					if (_self.satus !== null && _self.satus !== new_status) _self.trigger(new_status ? 'up' : 'down');
					_self.satus = new_status;
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