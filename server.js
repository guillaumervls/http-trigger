var http = require('http');
var childProcess = require('child_process');
var argv = require('minimist')(process.argv.slice(2));
var port = argv.port ||  1515;
var concurrency = argv.concurrency ||  3;
var timeout = Number(argv.timeout) * 1000 || 150000;
var activeProcessesCount = 0;
var command = argv.command;
var readReqBody = require('body');

if (!command) {
  console.error('--command argument required. See https://github.com/guillaumervls/http-trigger for more doc.');
  process.exit(1);
}

function endRes(res, statusCode) {
  if (res.headersSent) return;
  res.writeHead(statusCode || 500);
  res.end();
}

http.createServer(function (req, res) {
  if (req.url !== '/') return endRes(res, 404);
  if (req.method !== 'POST') return endRes(res, 405);
  if (activeProcessesCount >= concurrency) {
    console.error('Concurrency exceeded');
    return endRes(res, 429);
  };

  readReqBody(req, function (err, body) {
    if (err) return endRes(res, 413);
    activeProcessesCount++;
    var cp = childProcess.exec(command, {
      cwd: process.cwd(),
      env: process.env,
      timeout: timeout
    }, function (err) {
      activeProcessesCount--;
      var resCode = err ? 500 : 200;
      if (err && err.killed) {
        resCode = 504;
        console.error('Killed command after ' +
          (res.closedByClient ? 'client disconnect' : ('timeout of ' + timeout / 1000 + 'sec')));
      }
      endRes(res, resCode);
    });
    res.on('close', function () {
      res.closedByClient = true;
      cp.kill();
    });
    cp.stdout.pipe(process.stdout);
    cp.stderr.pipe(process.stderr);
    cp.stdin.end(body);
  });
}).listen(port);
