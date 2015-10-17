var each = require('async-each')
var superagent = require('superagent')

var UPLOAD_URL = '/upload'
if (typeof window === 'undefined') {
	UPLOAD_URL = 'localhost:8080' + UPLOAD_URL
}

module.exports = function upload(files, cb) {
	if (Array.isArray(files)) {
		each(files, uploadFile, cb)
	} else {
		uploadFile(files, cb)
	}
}

function uploadFile(file, next) {
	// file should be a blob in the browser, and a buffer in node
	if (!file.name) throw new Error('Must supply a file name')
	superagent.post(UPLOAD_URL).attach(file, file.name).end(next)
}