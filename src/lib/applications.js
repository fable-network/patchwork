const APPS = {};

const subscriptions = {};

export function initialize() {
  if (typeof window.define === 'function') return;

  window.define = async (deps, factory) => {
    const initialize = typeof deps === 'function' ? deps : factory;
    const module = initialize();
    const { bootstrap, mount, unmount } = module;
    const config = await bootstrap();
    const { name, ...app } = config;
    console.log('>>>>> Registered child app: ', name);
    APPS[name] = { mount, unmount, ...app };
    if (subscriptions[name]) {
      subscriptions[name].forEach((callback) => callback(APPS[name]));
    }
  };
  window.define.amd = true;
}

export function subscribe(name, componentName, callback) {
  if (!subscriptions[name]) subscriptions[name] = [];
  subscriptions[name].push(callback);
  if (APPS[name]) callback(APPS[name]); // already loaded
  return function unsubscribe() {
    subscriptions[name] = subscriptions[name].filter((c) => c !== callback);
  };
}

export function getApp(name) {
  return APPS[name] || null;
}
