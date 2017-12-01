# Watch a system process

Installation via
```sh
$ npm install -s comlog-system-monitor-process
```

# Usage
```javascript
var Service = require('comlog-system-monitor-process');

var csmf = new Service({
	interval: 60000, // 1 Minute
	name: 'notepad++.exe' // Required
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
