var test = require('tape')
var fs = require('fs')
var timer = require('./helpers/timer.js')
var path = require('path')
var files = require('test-audio')
var rootTestAudioPath = path.dirname( require.resolve('test-audio') )
var ServerInstance = require('../server.js')
var ClientInstance = require('../client.js')

test('ogg file', function (t) {
	var server = ServerInstance(8080)
	var upload = ClientInstance()

	var timeDiff = timer()

	server.on('listening', function () {
		var fileName = path.join(rootTestAudioPath, files[0].name)
		var fileBuffer = fs.readFileSync(fileName)
		fileBuffer.name = fileName

		upload(fileBuffer, function onSeed(err, responses) {
			t.notOk(err, err ? err.message : 'no error')
			t.equal(responses.length, 1, 'recieved one response after ' + timeDiff() + ' sec')

			var response = responses[0]
			//console.log(response) // Should assert stuff about the response

			server.close()
			t.end()
		})
	})
})
