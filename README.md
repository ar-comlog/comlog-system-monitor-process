# Watch a system process

Installation via
```sh
$ npm install -s comlog-system-monitor-process
```

# Usage
```javascript
var Service = require('comlog-system-monitor-process');

var csmf = new Service({
	name: 'notepad++.exe', // Required
	interval: 60000, // Optional 1 Minute
	maxMemory: '10M', // Optional maximal memory usage of all processes
	minMemory: '1M', // Optional minimal memory usage of all processes
	maxCount: 10, // Optional max count of processes
	minCount: 3 // Optional min count of processes
});

csmf.on('error', function(err) {
    console.error(err);
});

// bind event
csmf.on('down', function() {
    console.info('Process Nontepad++ is donw');
});

// bind event
csmf.on('up', function() {
    console.info('Process Nontepad++ is donw');
});

csmf.start()
```
