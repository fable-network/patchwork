## Patchwork

Patchwork is a bootstrap library that supports our micro-frontends infrastructure.

## Usage

### Initializing a parent app.

```javascript
import { registerManifest } from '@fashiontrade/patchwork';
...

const manifest = {
  childApp: 'http://localhost:5000/index.js',
  anotherChildApp: 'http://localhost:4000/index.js',
};
registerManifest(manifest) // called at the very top level of your parent app.
...

```

### Loading a child app

```javascript
import PatchworkComponent from '@fashiontrade/patchwork';
...

<PatchworkComponent name="childApp" basePath="/childApp" />
...

```

### Registering a child app and it's components

```javascript
...
import { registerComponent } from '@fashiontrade/patchwork';
...

function bootstrap() {
  return Promise.resolve({
    name: 'childApp',
    components: {
      AddToCartButton: registerComponent('AddToCartButton', AddToCartButton),
    },
  });
}

function mount(node, basePath, props) {
  // whatever you want to do when mounting here.
  ReactDOM.render(<App basePath={basePath} {...props} />, node);
  return Promise.resolve();
}

function unmount() {
  // Whatever you want to do before unmounting here.
  return Promise.resolve();
}

export default {
  bootstrap,
  mount,
  unmount,
};

if (process.env.NODE_ENV === 'development') {
  ReactDOM.render(<App />, document.getElementById('ft-app'));
}
```

### Rendering a child app component from the parent app

```javascript
import PatchworkComponent from '@fashiontrade/patchwork';
...

<PatchworkComponent name="childApp" componentName="AddToCartButton" />
...

```

## Setting up a new client app

Things to consider:

- Changing a default development PORT
- Passing app settings (incl. sentry)
- Internationalisation (passing down i18n config)
- Setting up .gitignore & environment variables
- Setting up fonts / translations on development environment

## Additional info

A similar setup with Single-SPA: https://gitlab.com/TheMcMurder/single-spa-portal-example/tree/master
