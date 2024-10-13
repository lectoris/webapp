
window.addEventListener('load', function() {
	let main = document.getElementById('main')

	main.addEventListener('mousedown', handleDragStart)
	main.addEventListener('touchstart', handleDragStart)

	main.addEventListener('touchcancel', handleDragCancel)

//	main.addEventListener('touchstart', (e) => { console.log("touch start", e, e.changedTouches[0]) })
//	main.addEventListener('touchmove', (e) => { console.log("touch move", e, e.changedTouches[0]) })
//	main.addEventListener('touchend', (e) => { console.log("touch end", e, e.changedTouches[0]) })
//	main.addEventListener('touchcancel', (e) => { console.log("touch cancel", e) })

	addFunction("main", `func main() {
	x := f(3)
	fmt.Println("Hello world", x)
}`)

	addFunction("f", `func f(x int) int {
	return g(x * 2) + 3
}`)

	addFunction("g", `func g(x int) int {
	x = x + x
	x = x + x
	x = x + x
	x = x + x
	x = x + x
	x = x + x

	return x
}`)
})

var funcs = []
var last = {x: 0, y: 0}

function addFunction(name, text) {
	let pan = document.getElementById('pan')
	let templ = document.getElementById('func-block-template').content
	let func = document.importNode(templ, true).children[0]

	func.querySelector('slot[name="name"]').textContent = name
	func.querySelector('slot[name="text"]').textContent = text

	func.style.left = last.x + 'px'
	func.style.top = last.y + 'px'

	last.x += 20
	last.y += 100

	funcs.push(func)
	pan.appendChild(func)
}

var drag = {}

function handleDragStart(e) {
	let main = document.getElementById('main')
	let pan = document.getElementById('pan')

	let block = e.target.closest('.func-block')
	if (block) {
		bubbleUp(block, funcs)
	}

	let target = e.target.closest('.draggable, .dragger')
	if (!target && this == main) {
		target = pan
	}

//	console.log("drag start", target, e.target, this)
	if (!target || !target.classList.contains('dragger')) {
		return false
	}

	target = target.closest('.draggable')
	let style = window.getComputedStyle(target)
	let touch = getTouch(e)
	if (!touch) {
		return false
	}

	drag = {
		target: target,
		touch: touch,
		left: parseInt(style.left, 10),
		top: parseInt(style.top, 10),
	}

	main.addEventListener('mousemove', handleDragMove)
	main.addEventListener('mouseup', handleDragEnd)

	main.addEventListener('touchmove', handleDragMove)
	main.addEventListener('touchend', handleDragEnd)

	e.preventDefault()

	return false
}

function handleDragMove(e) {
	target = drag.target
//	console.log("drag move", target, e, drag)

	moveTarget(target, drag, e)

	target.classList.add('dragged')

	e.preventDefault()

	return false
}

function handleDragEnd(e) {
	target = drag.target
//	console.log("drag end", target, e, drag)

	moveTarget(target, drag, e)

//	log("drag end")

	target.classList.remove('dragged')

	main.removeEventListener('mousemove', handleDragMove)
	main.removeEventListener('mouseup', handleDragEnd)

	main.removeEventListener('touchmove', handleDragMove)
	main.removeEventListener('touchend', handleDragEnd)

	e.preventDefault()

	return false
}

function handleDragCancel(e) {
//	console.log("drag cancel", this, e)

	moveTarget(target, drag)

	target.classList.remove('dragged')

	main.removeEventListener('mousemove', handleDragMove)
	main.removeEventListener('mouseup', handleDragEnd)

	main.removeEventListener('touchmove', handleDragMove)
	main.removeEventListener('touchend', handleDragEnd)
}

function bubbleUp(target, of) {
	let i = funcs.indexOf(target)
	funcs.splice(i, 1)
	funcs.push(target)

	funcs.forEach((v, i) => { v.style['z-index'] = 1 + i })
}

function moveTarget(target, drag, e) {
	let start = drag.touch
	let t = getTouch(e, start)

	target.style.left = drag.left + (t.x - start.x) + 'px'
	target.style.top = drag.top + (t.y - start.y) + 'px'
}

function getTouch(e, track) {
	if (e.clientX && e.clientY) {
		return {x: e.clientX, y: e.clientY}
	}

	var t

	if (!track) {
		t = e.targetTouches.item(0)
	} else {
		t = Array.from(e.changedTouches).find(t => t.identifier == track.id)
	}
	if (!t) {
		return
	}

	return {
		id: t.identifier,
		x: t.clientX,
		y: t.clientY,
	}
}

function log(m) {
	let log = document.getElementById('log')
	log.innerHTML += "<p>" + m + "</p>\n"
}

function fullscreen() {
	if (!document.fullscreenEnabled) {
		return
	}

	let el = document.fullscreenElement
	if (el) {
		document.exitFullscreen()
		return
	}

	document.body.requestFullscreen()
}
