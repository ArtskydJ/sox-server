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
var upload = require('sox-server')
var dragDrop = require('drag-drop')

dragDrop('body', function (files) {
	upload(files, function (err, responses) {
		if (err) throw err
		console.log(responses)
	})
})
```

# server api

```js
var server = require('sox-server')()
```

### `server`

- `server` is an [`http.Server`](https://nodejs.org/api/http.html#http_class_http_server) instance. You have to call `server.listen(port)`.

# browser api

Written for use with [browserify](https://github.com/substack/node-browserify).

```js
var upload = require('sox-server')()
```

### `upload(files)`

`upload` is a function, as well as an event emitter.

- `files` is a file or an array of files.

### events

- `error(err)` - Emits an error that it got when trying to upload
- `ready(file)` - Emits the successfully converted `file`, or the same `file` if it was valid

```js
upload.on('error', console.error.bind(console))

upload.on('ready', function (file) {
	console.log('yeah, converted another file!')
})
```

# install

With [npm](http://nodejs.org/download) do:

	npm install sox-server

# license

[VOL](http://veryopenlicense.com)
