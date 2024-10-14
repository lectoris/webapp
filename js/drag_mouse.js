
(function() {
	let main, pan

	window.addEventListener('DOMContentLoaded', function() {
		main = document.getElementById('main')
		pan = document.getElementById('pan')

		main.addEventListener('mousedown', mouseDown, true)
		main.addEventListener('mouseup', mouseUp, true)

		main.addEventListener('contextmenu', e => target && e.preventDefault())
	})

	let target
	let start
	let orig
	let scale

	function mouseDown(e) {
		if (e.ctrlKey) {
			return
		}

		target = draggable(e)
		if (!target) {
			return
		}

		start = {x: e.screenX, y: e.screenY}
		orig = offset(target, main)

		scale = pan.getAttribute('data-scale') || 1.

		main.addEventListener('mousemove', mouseMove)
		main.addEventListener('mouseleave', mouseUp, {once: true})
		main.classList.add('grabbing')

		e.preventDefault()
		return false
	}

	function mouseMove(e) {
		if (!target) {
			return
		}

		doMove(e)

		e.preventDefault()
		return false
	}

	function mouseUp(e) {
		if (!target) {
			return
		}

		doMove(e)
		target = null

		main.removeEventListener('mousemove', mouseMove)
		main.classList.remove('grabbing')

		e.preventDefault()
		return false
	}

	function doMove(e) {
		let dx = e.screenX - start.x
		let dy = e.screenY - start.y

		if (target != pan) {
			dx /= scale
			dy /= scale
		}

		target.style.left = orig.left + dx + 'px'
		target.style.top = orig.top + dy + 'px'
	}

	function offset(target, base) {
		if (target == pan) {
			return {left: target.offsetLeft, top: target.offsetTop}
		}

		let style = window.getComputedStyle(target)

		return {left: parseInt(style.left, 10), top: parseInt(style.top, 10)}
	}

	function draggable(e) {
		let relaxed = e.button == 2

		let dragger = e.target.closest('.dragger, .draggable')
		if (!dragger) {
			dragger = pan
		}
		if (!relaxed && !dragger.classList.contains('dragger')) {
			return
		}

		return dragger.closest('.draggable')
	}
})()
