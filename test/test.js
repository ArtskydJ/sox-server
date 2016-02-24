var test = require('tape')
var fs = require('fs')
var cp = require('child_process')
var sizeStream = require('size-stream')
var files = require('test-audio')()
var after = require('after')
var Server = require('../server.js')
var Upload = require('../client.js')

var expectSize = 2507

test('wav [using curl]', function (t) {
	var server = Server()
	
	server.listen(8080, function () {
		var filePath = files.wav.path

		var fileStream = cp.spawn('curl', [ 'localhost:8080/upload', '-F', 'lolwut=@' + filePath ]).stdout

		fileStream.pipe(sizeStream()).once('size', function (bytes) {
			t.equal(expectSize, bytes)
			
			server.close()
			t.end()
		})
	})
})

test('wav [using client]', function (t) {
	var upload = Upload()
	var server = Server()
	
	server.listen(8080, function () {
		var filePath = files.wav.path
		var fileBuffer = fs.readFileSync(filePath)
		fileBuffer.name = filePath

		upload(fileBuffer)

		upload.on('ready', function (fileStream) {
			fileStream.pipe(sizeStream()).once('size', function (bytes) {
				t.equal(expectSize, bytes)
				
				server.close()
				t.end()
			})
		})

		upload.on('error', t.fail.bind(t))
	})
})
