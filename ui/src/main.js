import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

let app;
const initialize = async () => {
  app = mount(App, {
    target: document.getElementById('app'),
  });
};
initialize();

export default app
