var each = require('async-each')
var Upload = require('upload-component-browserify')

module.exports = function instance(customFileValidator) {
	// Bad abstraction? I think the file validation should be done elsewhere.
	var fileValidator = customFileValidator || function () { return true }

	function upload(files, cb) {
		var validFiles = ensureArray(files).filter(fileValidator)
		each(validFiles, uploadFile, cb)
	}

	return upload
}

function uploadFile(file, next) {
	new Upload(file).to('/upload', next)
}

function ensureArray(thing) {
	return (Array.isArray(thing)) ? thing : [ thing ]
}
