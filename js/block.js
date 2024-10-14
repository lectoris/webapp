
window.addEventListener('DOMContentLoaded', function() {
	let main = document.getElementById('main')
	let pan = document.getElementById('pan')

	pan.appendBlock = appendBlock

	main.addEventListener('mousedown', (e) => moveToForeground(e.target))
	main.addEventListener('touchstart', (e) => moveToForeground(e.target))
})

function createFunc(title, text = "", opts = {}) {
	let template = document.getElementById('func-body-template').content
	let body = document.importNode(template, true).children[0]

	body.querySelector('slot[name=text]').innerText = text

	return createBlock(title, body, opts)
}

function createBlock(title, body, opts = {}) {
	let template = document.getElementById('block-template').content
	let block = document.importNode(template, true).children[0]

	block.appendBlock = appendBlock

	block.querySelector('.block-title').innerHTML = title

	block.querySelector('slot[name="body"]').remove()
	block.appendBlock(body)


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

function appendBlock(block) {
	if (!block) {
		return
	}

	this.zorder = this.zorder || []

	let [left, top] = [20, 60]
	let prev = this.zorder.at(-1)
	if (prev) {
		left += prev.offsetLeft
		top += prev.offsetTop
	}

	[block.style.left, block.style.top] = [left + 'px', top + 'px']

	let container = this

	if (!container.classList.contains('block-container')) {
		container = container.querySelector('.block-container')
	}

	container.appendChild(block)
	this.zorder.push(block)
}

function moveToForeground(target) {
	let block = target.closest('.block')
	if (!block) {
		return
	}

	let parent = block.parentElement?.closest('.block')
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
