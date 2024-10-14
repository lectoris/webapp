
(function() {
	let main, pan

	window.addEventListener('DOMContentLoaded', function() {
		main = document.getElementById('main')
		pan = document.getElementById('pan')

		main.addEventListener('mousedown', mouseDown, true)
		main.addEventListener('mouseup', mouseUp, true)
	})

	let scale = 1.
	let factor = 400
	let offset, rel
	let y

	function mouseDown(e) {
		if (e.button != 2 || !e.metaKey && !e.ctrlKey) {
			return
		}

		let poff = getOffset(pan)
		rel = {x: e.pageX - poff.left, y: e.pageY - poff.top}
		offset = getOffset(pan, main)
		y = e.screenY

		main.addEventListener('mousemove', mouseMove)
		main.addEventListener('mouseleave', mouseUp, {once: true})

		e.preventDefault()
		return false
	}

	function mouseMove(e) {
		if (!y) {
			return
		}

		doScale(e)

		e.preventDefault()
		return false
	}

	function mouseUp(e) {
		if (!y) {
			return
		}

		scale = doScale(e)
		pan.setAttribute('data-scale', scale)
		y = null

		main.removeEventListener('mousemove', mouseMove)

		e.preventDefault()
		return false
	}

	function doScale(e) {
		let dy = e.screenY - y
		let sc = scale + dy / factor

		let s = pan.style

		s['transform-origin'] = '0 0'
		s['transform'] = `scale(${sc})`

		s.left = offset.left + rel.x * (1 - sc / scale) + 'px'
		s.top = offset.top + rel.y * (1 - sc / scale) + 'px'

		return sc
	}

	function getOffset(target, base) {
		let l = 0, t = 0

		while(target && target != base) {
			l += target.offsetLeft
			t += target.offsetTop

			target = target.offsetParent
		}

		return {left: l, top: t}
	}
})()
