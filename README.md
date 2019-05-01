## Patchwork

Patchwork is a bootstrap library that supports our micro-frontends infrastructure.

## Usage

### Initializing a parent app.

```javascript
import { registerManifest } from '@fashiontrade/patchwork';
...

const manifest = {
  childApp: 'http://localhost:5000/index.js',
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
  ReactDOM.render(<App basePath={basePath} {...props} />, node);
  return Promise.resolve();
}

function unmount() {
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
