var test = require('tape')
var fs = require('fs')
var sizeStream = require('size-stream')
var files = require('test-audio')()
var Server = require('../server.js')
var Upload = require('../client.js')

test('ogg file', function (t) {
	var server = Server()
	var upload = Upload()

	server.listen(8080, function () {
		var filePath = files[3].path
		var fileBuffer = fs.readFileSync(filePath)
		fileBuffer.name = filePath

		upload(fileBuffer)

		upload.on('ready', function (file) {
			var size = sizeStream()
			size.once('size', function (bytes) {
				t.ok(bytes > 5800) // 5860
				t.ok(bytes < 5900) // 5860

				server.close()
				t.end()
			})

			file.pipe(size)
		})

		upload.on('error', t.fail.bind(t))
	})
})

/*
Another way to test is to open 2 command prompt windows, and run these commands:

node server.js

curl localhost:80/upload -F "file=@node_modules/test-audio/audio/30047__corsica-s__drippy.flac"
*/
