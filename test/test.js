var Watcher = require('../');

mon = new Watcher({
	name: 'node.exe'
});

mon.on('error', function(err) {
	console.error(err);
});

// bind event
mon.on('down', function() {
	console.info('Process ist down');
});

// bind event
mon.on('up', function() {
	console.info('Process is up');
});

mon.start();