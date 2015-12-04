var test = require('tape')
var fs = require('fs')
var cp = require('child_process')
var sizeStream = require('size-stream')
var files = require('test-audio')()
var Server = require('../server.js')
var Upload = require('../client.js')

test('ogg file using curl', function (t) {
	var server = Server()

	server.listen(8080, function () {
		var filePath = files[2].path

		var curl = cp.spawn('curl', [
			'localhost:8080/upload',
			'-F', 'lolwut=@' + filePath
		])

		var size = sizeStream()
		size.once('size', function (bytes) {
			t.ok(bytes > 5600 && bytes < 6100, '5600 > ' + bytes + ' > 6100') // this fails because it is looking at the expected size of converting the mp3 file

			server.close()
			t.end()
		})

		curl.stdout.pipe(size)
	})
})

test('ogg file using the client', function (t) {
	var server = Server()
	var upload = Upload()

	server.listen(8080, function () {
		var filePath = files[2].path
		var fileBuffer = fs.readFileSync(filePath)
		fileBuffer.name = filePath

		upload(fileBuffer)

		upload.on('ready', function (file) {
			var size = sizeStream()
			size.once('size', function (bytes) {
				t.ok(bytes > 5600 && bytes < 6100, '5600 > ' + bytes + ' > 6100')

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
