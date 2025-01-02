import { mount } from 'svelte'
import { add } from '../../mandelbrot/pkg/mandelbrot_bg.wasm';
import './app.css'
import App from './App.svelte'

let app;
const initialize = async () => {
  app = mount(App, {
    target: document.getElementById('app'),
    props: {
      add,
    },
  });
};
initialize();

export default app
