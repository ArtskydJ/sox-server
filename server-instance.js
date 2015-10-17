var EventEmitter = require('events').EventEmitter
var Sox = require('sox-stream')
var Busboy = require('busboy')
// var createTempFile = require('create-temp-file')

module.exports = function Instance() {
	var emitter = new EventEmitter()
	return {
		emitter: emitter,
		onPost: onRequest.bind(null, emitter)
	}
}

function onRequest(emitter, req, res) {
	var busboy = new Busboy({ headers: req.headers })

	function onFinish() {
		// This function is called too many places. Wrap it with `after`?
		// This function is called on convert and not convert... WAT
		// Should return an error if it does not need to be converted
		res.writeHead(200, { 'Connection': 'close' })
		res.end()
	}

	busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
		// Should pipe to a temp file...
		if (mimetype === 'audio/mp3') { // already an mp3
			onFinish()
		} else {
			var convert = Sox({ type: 'mp3' })
			file.pipe(convert).pipe(res).on('finish', onFinish)
		}
	})

	busboy.on('finish', onFinish)

	busboy.on('error', emitter.emit.bind(emitter, 'error'))
	req.on('error', emitter.emit.bind(emitter, 'error'))

	req.pipe(busboy)
}
