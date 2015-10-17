var test = require('tape')
var fs = require('fs')
var files = require('test-audio')()
var ServerInstance = require('../server.js')
var upload = require('../client.js')

test('ogg file', function (t) {
	var server = ServerInstance(8080)

	server.on('listening', function () {
		var filePath = files[3].path
		var fileBuffer = fs.readFileSync(filePath)
		fileBuffer.name = filePath

		upload(fileBuffer, function onSeed(err, response) {
			t.notOk(err, err ? err.message : 'no error')

			console.log(response) // Should assert stuff about the response

			server.close()
			t.end()
		})
	})
})
