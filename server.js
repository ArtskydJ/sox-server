var Sox = require('sox-stream')
//var fs = require('fs')
var Busboy = require('busboy')
var createTempFile = require('create-temp-file')
var http = require('http')
var url = require('url')

function Server() {
	return http.createServer(function (req, res) {
		console.log(req.method, req.url)
		if (req.method === 'POST' && url.parse(req.url).pathname === '/upload') {
			onPost(req, res)
		} else {
			console.log('UNSUPPORTED!!!')
			// serve cached audio files
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
	console.log('awesome=', req && res && true)
	var busboy = new Busboy({ headers: req.headers })

	busboy.on('file', function(fieldname, fileStream, filename, encoding, mimetype) {
		if (mimetype === 'audio/mp3') { // already an mp3
			console.log('already an mp3')
			res.writeHead(415) // Unsupported Media Type
			res.end()
			fileStream.resume()
		} else {
			console.log('converting to mp3')
			var initialType = mimetype.split('/').pop()

			var converted = fileStream.pipe(Sox([
				{ type:  initialType },
				{ type: 'mp3' }
			]))
			console.log(converted)

			//var cachedFile = createTempFile('.mp3')

			res.writeHead(200, {
//				'Connection': 'close',
				'Content-Type': 'audio/mp3'
			})

			//converted.pipe(cachedFile)
			converted.pipe(res).on('finish', function () {
				console.log('so for so supes')
				//fs.createReadStream(tempFile.path).pipe(res).on('finish', res.end.bind(res)) // automatic maybe
			})


			converted.on('error', console.error)
			//cachedFile.on('error', console.error)
		}
	})

	busboy.on('finish', function () {})

	function onErr(err) {
		console.error(err)
		res.writeHead(500)
		res.end()
	}

	busboy.on('error', onErr)
	busboy.once('field', function (fieldname, value) {
		console.log('field', fieldname, value.length)
	})
	busboy.on('partsLimit', console.log.bind(null, 'partsLimit'))
	busboy.on('filesLimit', console.log.bind(null, 'filesLimit'))
	busboy.on('fieldsLimit', console.log.bind(null, 'fieldsLimit'))
	req.on('error', onErr)

	req.pipe(busboy)
	//req.pipe(process.stdout)
}
