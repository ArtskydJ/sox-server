var test = require('tape')
var fs = require('fs')
var timer = require('./helpers/timer.js')
var path = require('path')
var files = require('test-audio')
var rootTestAudioPath = path.dirname( require.resolve('test-audio') )
var ServerInstance = require('../server.js')
var ClientInstance = require('../client.js')

function shorten(s) {
	return s.slice(0, 6)
}

test('ogg file', function (t) {
	var emitter = ServerInstance()
	var client = ClientInstance()

	var timeDiff = timer()

	var fileName = path.join(rootTestAudioPath, files[0].name)
	var fileBuffer = fs.readFileSync(fileName)
	// fileBuffer.name = files[0].name

	client.upload(fileBuffer, function onSeed(err, responses) {
		t.equal(responses.length, 1, 'recieved one response after ' + timeDiff() + ' sec')

		var response = responses[0]
		console.log(response) // Should assert stuff about the response

		t.end()
	})
})
