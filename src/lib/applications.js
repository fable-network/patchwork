const APPS = {};

const subscriptions = {};

export function initialize() {
  if (typeof window.define === 'function') return;

  window.define = async (deps, factory) => {
    const initialize = typeof deps === 'function' ? deps : factory;
    const module = initialize();
    const { bootstrap, mount, unmount } = module;
    bootstrap().then((config) => {
      const { name, ...app } = config;
      console.log('>>>>> Registered child app: ', name);
      APPS[name] = { mount, unmount, ...app };
      if (subscriptions[name]) {
        subscriptions[name].forEach((callback) => callback(APPS[name]));
        delete subscriptions[name]; // unsub right away
      }
    });
  };
  window.define.amd = true;
}

export function subscribe(name, componentName, callback) {
  if (!subscriptions[name]) subscriptions[name] = [];
  if (APPS[name]) {
    callback(APPS[name]); // already loaded
    return () => {};
  }
  subscriptions[name].push(callback);
  return function unsubscribe() {
    console.log('>>>> unsubscribe called:', name, componentName);
    subscriptions[name] = subscriptions[name].filter((c) => c !== callback);
  };
}

export function getApp(name) {
  return APPS[name] || null;
}

window.__test = () => ({
  APPS,
  subscriptions,
});
