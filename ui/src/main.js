import { mount } from 'svelte'
import { generate_mandelbrot } from '../../mandelbrot/pkg/mandelbrot_bg.wasm';
import './app.css'
import App from './App.svelte'

let app;
const initialize = async () => {
  app = mount(App, {
    target: document.getElementById('app'),
    props: {
      generate_mandelbrot,
    },
  });
};
initialize();

export default app
