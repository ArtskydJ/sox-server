function msToSec(ms) {
	return Math.round(ms / 100) / 10
}

module.exports = function timer() {
	var startTime = new Date().getTime()
	return function timeDiff() {
		var now = new Date().getTime()
		var seconds = msToSec(now - startTime)
		startTime = now
		return seconds
	}
}
