
window.addEventListener('DOMContentLoaded', function() {
	let main = document.getElementById('main')

	main.addEventListener('mousedown', (e) => moveToForeground(e.target))
	main.addEventListener('touchstart', (e) => moveToForeground(e.target))

	document.addEventListener('keydown', (e) => {
		e.shiftKey && main.classList.add('shifted')
	})
	document.addEventListener('keyup', (e) => {
		e.key == "Shift" && main.classList.remove('shifted')
	})
})

function createFunc(title, text = "", opts = {}) {
	let template = document.getElementById('func-body-template').content
	let body = document.importNode(template, true).children[0]

	body.querySelector('slot[name="text"]').contentText = text

	return createBlock(title, body, opts)
}

function createBlock(title, body = null, opts = {}) {
	let template = document.getElementById('block-template').content
	let block = document.importNode(template, true).children[0]

	block.zorder = []

	block.blockAppend = function(body) {
		if (!body) {
			return
		}

		let [left, top] = [20, 60]
		let prev = block.zorder.at(-1)
		if (prev) {
			let s = window.getComputedStyle(prev)
			left += parseInt(s.left, 10) || 0
			top += parseInt(s.top, 10) || 0
		}

		[body.style.left, body.style.top] = [left + 'px', top + 'px']

		block.querySelector('slot[name="body"]').appendChild(body)
		block.zorder.push(body)
	}

	block.querySelector('slot[name="title"]').innerHTML = title
	block.blockAppend(body)

	if (!opts) {
		return block
	}

	if (opts.classList) {
		opts.classList.forEach(name => {
			block.classList.add(name)
		})
	}

	if (opts.style) {
		for (const [k, v] of Object.entries(opts.style)) {
			block.style[k] = v
		}
	}

	return block
}

function moveToForeground(target) {
	let block = target.closest('.block')
	if (!block) {
		return
	}

	let parent = block.parentElement?.closest('.block')
	//console.log("to fg", block, parent)
	if (!parent || !parent.zorder) {
		return
	}

	bubbleUp(block, parent.zorder)
}

function bubbleUp(block, at) {
	let i = at.indexOf(block)
	if (i === -1) {
		return
	}

	at.push(at.splice(i, 1)[0])

	at.forEach((v, i) => { v.style['z-index'] = 1 + i })
}
