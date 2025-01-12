compile:
	wasm-pack build mandelbrot --target web

dev:
	cd ui && npm run dev
