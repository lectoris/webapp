
window.addEventListener('load', function() {
	let main = document.getElementById('main')
	let pan = document.getElementById('pan')

	let pkg = createBlock('tlog.app/go/tlog/cmd/tlog', null, {
		classList: ['namespace'],
		style: {
			width: '80%',
			height: '80%',
		},
	})

	let fun1 = createFunc('main', `func main() {
	x := f(1)

	fmt.Println("Hello world", x)
}`, {classList: ['func']})

	let fun2 = createFunc('f', `func f(x int) int {
	y := g(x) + g(x * 2)

	return y
}`, {classList: ['func']})

	let fun3 = createFunc('g', `func g(x int) int {
	x = x + x
	x = x + x
	x = x + x
	x = x + x
	x = x + x

	return x
}`, {classList: ['func']})

	pan.appendChild(pkg)

	pkg.blockAppend(fun1)
	pkg.blockAppend(fun2)
	pkg.blockAppend(fun3)
})
