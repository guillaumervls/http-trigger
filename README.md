# HTTP Trigger
_Listen to HTTP POST requests to trigger executions of a command_

## Install
`npm install (-g) http-trigger`

## Use
`http-trigger`

## Configure
Available options (and default values) :
- `--command <COMMAND>` : command to execute on every POST request. **Required argument.** Environment vars are forwarded. Request body is passed via `stdin`. `stdout` and `stderr` are forwarded to `http-trigger`'s ones.
- `--port 1515` : listen on this port
- `--concurrency 3` : maximum number of parallel executions. When reached, a HTTP 429 (Too Many Requests) is sent.
