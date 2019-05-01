import { initialize } from './applications';

export default (manifest = []) => {
  initialize();
  Object.keys(manifest).forEach((name) => {
    const script = document.createElement('script');
    script.setAttribute('src', manifest[name]);
    document.body.appendChild(script);
  });
};
