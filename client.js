var each = require('async-each')
var superagent = require('superagent')
var path = require('path')
var makeEmitter = require('make-object-an-emitter')

var inNode = typeof window === 'undefined'
var UPLOAD_URL = inNode ? 'localhost:8080/upload' : '/upload'

module.exports = function () {
	var upload = function (files) {
		if (Array.isArray(files)) {
			each(files, uploadFile)
		} else {
			uploadFile(files)
		}
		//return upload // Allow upload(files).on('error', console.error)
	}
	makeEmitter(upload)
	return upload

	function uploadFile(file, next) {
		if (inNode && !Buffer.isBuffer(file)) throw new Error('Expected file to be a buffer in node')
		if (!inNode && file.size) throw new Error('Expected file to be a buffer in node')
		if (!file.name) throw new Error('Must supply a file name')

		var name = path.basename(file.name)

		superagent.post(UPLOAD_URL)
		//.type('multipart/form-data')
		.type('form')
		.attach(name, file, file.name)
		.end(function (err, res) {
			if (err) {
				upload.emit('error', err)
			} else if (res.status === 200) {
				upload.emit('ready', res)
			} else {
				upload.emit('ready', file)
			}

			if (next) next()
		})
	}
}
