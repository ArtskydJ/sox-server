sox-server
==========

[![Build Status](https://travis-ci.org/ArtskydJ/sox-server.svg)](https://travis-ci.org/ArtskydJ/sox-server)

# example

*server.js*

```js
var casa = require('sox-server')
var http = require('http')
var ecstatic = require('ecstatic')

var server = http.createServer(ecstatic(__dirname))
casa(server)
server.listen(8080)
```

*client.js*

```js
var client = require('sox-server')
var dragDrop = require('drag-drop')

var upload = client()

dragDrop('body', function (files) {
	upload(files, function (err, responses) {
		if (err) throw err
		console.log(responses)
	})
})
```

# server api

```js
var casa = require('sox-server')
```

## `var emitter = casa(server)`

- `server` is an [`http.Server`](https://nodejs.org/api/http.html#http_class_http_server) instance. You have to call `server.listen()`.
- `emitter` is an [`events.EventEmitter`](https://nodejs.org/api/events.html#events_class_events_eventemitter) instance. You can call `emitter.on`, if you want.

## events

- `error` (err)
- `upload-request` (infoHash)
- `new-bundle` (bundle)

# browser api

Written for use with [browserify](https://github.com/substack/node-browserify).

```js
var client = require('sox-server')
```

## `var upload = client([fileValidator])`

`fileValidator(file)` is a function that given a file returns whether the file is valid. By default all files will be allowed.

### `upload(files, [cb])`

- `files` is a file or an array of files.
- `cb(err, infoHashes)`
	- `err` is null or an Error object
	- `responses` is an array of responses. If you uploaded one file, it is an array of one response.


# install

With [npm](http://nodejs.org/download) do:

	npm install sox-server

# license

[VOL](http://veryopenlicense.com)
