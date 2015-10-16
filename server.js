var http = require('http')
var url = require('url')
var Instance = require('./server-instance.js')


function Server(port) {
	var instance = Instance()
	var onPost = instance.onPost
	var emitter = instance.emitter
	emitter.on('error', console.error)

	var server = http.createServer(function (req, res) {
		console.log(req.method, req.url)
		if (req.method === 'POST' && url.parse(req.url).pathname === '/upload') {
			onPost(req, res)
		} else {
			// serve cached audio files
		}
	})

	server.listen(port || 80)

	return server
}

var CALLED_FROM_COMMANDLINE = process.argv[1] === __filename
if (CALLED_FROM_COMMANDLINE) {
	var srv = Server(process.argv[2])
	console.log('Listening on ' + srv.address().port)
} else {
	module.exports = Server
}
