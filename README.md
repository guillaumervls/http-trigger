# HTTP Trigger
_Listen to HTTP POST requests to trigger executions of a command_

Requires [Node.js](https://nodejs.org/)

## Install
`npm install (-g) http-trigger`

## Use
`http-trigger`

## Configure
Available options (and default values) :

**`--command <COMMAND>`**

  Command to execute on every POST request. **Required argument.** Environment vars are forwarded. Request body is passed via `stdin`. `stdout` and `stderr` are forwarded to `http-trigger`'s ones.

**`--port 1515`**

  Listen on this port.

**`--concurrency 3`**

  Maximum number of parallel executions. When reached, a HTTP 429 (Too Many Requests) is sent.

**`--timeout 150`**

  Timeout after which the command is killed (SIGTERM) and a HTTP 504 (Gateway Timeout) is sent.

## Notes
- The command is executed in a shell in the current directory
- If the command fails (non-zero exit code) a HTTP 500 (Server Error) is sent.
- If the client disconnects the command is killed (SIGTERM).

### License
MIT
