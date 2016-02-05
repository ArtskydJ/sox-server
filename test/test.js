var test = require('tape')
var fs = require('fs')
var cp = require('child_process')
var sizeStream = require('size-stream')
var files = require('test-audio')()
var hasha = require('hasha')
var after = require('after')
var Server = require('../server.js')
var Upload = require('../client.js')

var expectedMp3FileSize = {
	flac: 1892,
	ogg: 50179,
	wav: 2507,
	mp3: 6006
}
var expectedMp3FileMd5s = {
	flac: '72cbe1ec103eee6dba4f0c2ecd022532',
	ogg: 'cbd234bb0baa13c6018ec87929690b1a',
	wav: '13d3fa49e665d4c70c24ef6f5731e1c0',
	mp3: 'f8165368cf2e5d5b1a8a07c12505661a'
}

test('wav [using curl]', function (t) {
	setupServer(t, 2, function (next) {
		var filePath = files.wav.path

		var fileStream = cp.spawn('curl', [ 'localhost:8080/upload', '-F', 'lolwut=@' + filePath ]).stdout

		fileStream.pipe(sizeStream()).once('size', function (bytes) {
			t.equal(expectedMp3FileSize.wav, bytes)
			next()
		})
		hasha.fromStream(fileStream, { algorithm: 'md5' }).then(function (md5) {
			t.equal(expectedMp3FileMd5s.wav, md5)
			next()
		})
	})
})

test('wav [using client]', function (t) {
	var upload = Upload()

	setupServer(t, 2, function (next) {
		var filePath = files.wav.path
		var fileBuffer = fs.readFileSync(filePath)
		fileBuffer.name = filePath

		upload(fileBuffer)

		upload.on('ready', function (fileStream) {
			fileStream.pipe(sizeStream()).once('size', function (bytes) {
				t.equal(expectedMp3FileSize.wav, bytes)
				next()
			})
			hasha.fromStream(fileStream, { algorithm: 'md5' }).then(function (md5) {
				t.equal(expectedMp3FileMd5s.wav, md5)
				next()
			})
		})

		upload.on('error', t.fail.bind(t))
	})
})

function setupServer(t, afterN, cb) {
	var server = Server()

	var next = after(afterN, function () {
		server.close()
		t.end()
	})

	server.listen(8080, function () {
		cb(next)
	})
}
