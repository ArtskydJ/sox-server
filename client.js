var each = require('async-each')
var superagent = require('superagent')

var UPLOAD_URL = '/upload'
if (typeof window === 'undefined') {
	UPLOAD_URL = 'localhost:8080' + UPLOAD_URL
}

module.exports = function instance(customFileValidator) {
	// Bad abstraction? I think the file validation should be done elsewhere.
	var fileValidator = customFileValidator || Boolean

	function upload(files, cb) {
		var validFiles = ensureArray(files).filter(fileValidator)
		each(validFiles, uploadFile, cb)
	}

	return upload
}

function uploadFile(file, next) {
	// file should be a blob in the browser, and a buffer in node
	if (!file.name) throw new Error('Must supply a file name')
	superagent.post(UPLOAD_URL).attach(file, file.name).end(next)
}

function ensureArray(thing) {
	return (Array.isArray(thing)) ? thing : [ thing ]
}
