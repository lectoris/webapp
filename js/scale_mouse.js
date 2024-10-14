
(function() {
	const minScale = 0.1, maxScale = 2
	let main, pan

	window.addEventListener('DOMContentLoaded', function() {
		main = document.getElementById('main')
		pan = document.getElementById('pan')

		main.addEventListener('mousedown', mouseDown, true)
		main.addEventListener('mouseup', mouseUp, true)

		main.addEventListener('contextmenu', (e) => (y) && e.preventDefault())

		main.addEventListener('wheel', wheel, true)
	})

	let scale = 1.
	let factor = 600
	let offset, rel
	let y

	function wheel(e) {
		if (y) {
			e.preventDefault()
			return false
		}

		let sc = scale - e.deltaY / factor
		sc = bound(sc, minScale, maxScale)
		if (sc == scale) {
			e.preventDefault()
			return false
		}

		let poff = getOffset(pan)
		rel = {x: e.pageX - poff.left, y: e.pageY - poff.top}
		offset = getOffset(pan, main)

		let s = pan.style

		s['transform-origin'] = '0 0'
		s['transform'] = `scale(${sc})`

		s.left = offset.left + rel.x - Math.round(rel.x * sc / scale) + 'px'
		s.top = offset.top + rel.y - Math.round(rel.y * sc / scale) + 'px'

		scale = sc

		e.preventDefault()
		return false
	}

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
		sc = bound(sc, minScale, maxScale)
		if (sc == scale) {
			return sc
		}

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

	function bound(x, l, h) {
		if (x < l) return l
		if (x > h) return h
		return x
	}
})()
