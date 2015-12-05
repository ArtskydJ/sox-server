var Sox = require('sox-stream')
//var fs = require('fs')
var Busboy = require('busboy')
var createTempFile = require('create-temp-file')()
var http = require('http')
var url = require('url')

function Server() {
	return http.createServer(function (req, res) {
		if (req.method === 'POST' && url.parse(req.url).pathname === '/upload') {
			onPost(req, res)
		} else {
			console.log('UNSUPPORTED!!!', req.method, req.url)
			// Should serve cached audio files
		}
	})
}

if (process.argv[1] === __filename) { // Called from the command line
	var port = Number(process.argv[2]) || 80
	Server().listen(port)
	console.log('Listening on ' + port)
} else {
	module.exports = Server
}

function onPost(req, res) {
	var busboy = new Busboy({ headers: req.headers })

	busboy.on('file', function(fieldname, fileStream, filename, encoding, mimetype) {
		if (mimetype === 'audio/mp3') { // already an mp3
			res.writeHead(415) // Unsupported Media Type
			res.end()
			fileStream.resume()
		} else {
			var initialType = filename.split('.').pop()

			var converted = fileStream.pipe(Sox(
				{ type:  initialType },
				{ type: 'mp3' }
			))

			var cachedFile = createTempFile('.mp3')

			res.writeHead(200, {
				'Connection': 'close',
				'Content-Type': 'audio/mp3'
			})

			converted.pipe(cachedFile)
			converted.pipe(res).on('finish', function () {
				//fs.createReadStream(tempFile.path).pipe(res).on('finish', res.end.bind(res)) // automatic maybe
			})


			converted.on('error', console.error.bind(null, 'converted'))
			cachedFile.on('error', console.error.bind(null, 'cachedFile'))
		}
	})

	busboy.on('finish', function () {})

	function onErr(err) {
		console.error('onErr', err)
		res.writeHead(500)
		res.end()
	}

	busboy.on('error', onErr)
	busboy.once('field', function (fieldname, value) {
		//console.log('field', fieldname, value.length)
		console.error('did not expect field')
	})
	busboy.on('partsLimit', console.log.bind(null, 'partsLimit'))
	busboy.on('filesLimit', console.log.bind(null, 'filesLimit'))
	busboy.on('fieldsLimit', console.log.bind(null, 'fieldsLimit'))
	req.on('error', onErr)

	req.pipe(busboy)
	//req.pipe(process.stdout)
}
