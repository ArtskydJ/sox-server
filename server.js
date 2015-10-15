var http = require('http')
var instance = require('./server-instance.js')()
var onPost = instance.onPost
var emitter = instance.emitter

http.createServer(function (req, res) {
	if (req.method === 'POST' && req.url = '/upload') {
		onPost(req, res)
	} else {
		// serve cached audio files
	}
})

emitter.on('error', console.error)
