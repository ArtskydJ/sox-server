var test = require('tape')
var fs = require('fs')
var cp = require('child_process')
var sizeStream = require('size-stream')
var files = require('test-audio')()
var hasha = require('hasha')
var after = require('after')
var Server = require('../server.js')
var Upload = require('../client.js')

var expectedMp3FileSize = [
	1892,  // 30047__corsica-s__drippy.flac
	50179, // 50775__smcameron__drips2.ogg
	2507,  // 75344__neotone__drip2.wav
	6006   // 8000__cfork__cf-fx-bloibb.mp3
]
var expectedMp3FileMd5s = [
	'72cbe1ec103eee6dba4f0c2ecd022532', // 30047
	'cbd234bb0baa13c6018ec87929690b1a', // 50775
	'13d3fa49e665d4c70c24ef6f5731e1c0', // 75344
	'f8165368cf2e5d5b1a8a07c12505661a'  // 8000
]

test('wav [using curl]', function (t) {
	setupServer(t, 2, function (next) {
		var filePath = files[2].path

		var fileStream = cp.spawn('curl', [ 'localhost:8080/upload', '-F', 'lolwut=@' + filePath ]).stdout

		fileStream.pipe(sizeStream()).once('size', function (bytes) {
			t.equal(expectedMp3FileSize[2], bytes)
			next()
		})
		hasha.fromStream(fileStream, { algorithm: 'md5' }).then(function (md5) {
			t.equal(expectedMp3FileMd5s[2], md5)
			next()
		})
	})
})

test('wav [using client]', function (t) {
	var upload = Upload()

	setupServer(t, 2, function (next) {
		var filePath = files[2].path
		var fileBuffer = fs.readFileSync(filePath)
		fileBuffer.name = filePath

		upload(fileBuffer)

		upload.on('ready', function (fileStream) {
			fileStream.pipe(sizeStream()).once('size', function (bytes) {
				t.equal(expectedMp3FileSize[2], bytes)
				next()
			})
			hasha.fromStream(fileStream, { algorithm: 'md5' }).then(function (md5) {
				t.equal(expectedMp3FileMd5s[2], md5)
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
