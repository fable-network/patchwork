/* eslint no-console: 0 */
const fs = require('fs');
const { logInfo, logError, isComponentDirectory } = require('./scriptUtils');

const COMPONENTS_PATH = './src/components';
const existingComponents = fs
  .readdirSync(COMPONENTS_PATH)
  .map((name) => name)
  .filter(isComponentDirectory);

const componentName = process.argv[process.argv.indexOf('--name') + 1];
const withStorybook = process.argv.includes('--with-storybook');

if (existingComponents.indexOf(componentName) > -1) {
  logError(`A component with the name "${componentName}" already exists!`);
  return;
}

const componentPath = `${COMPONENTS_PATH}/${componentName}`;

const ComponentBoilerplate = `import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ${componentName} = (props) => (
  <div>${componentName}</div>
);

${componentName}.defaultProps = {};

${componentName}.propTypes = {};

export default ${componentName};
`;

const StorybookBoilerplate = `import React from 'react';
import { storiesOf } from '@storybook/react';

import ${componentName} from './';

storiesOf('${componentName}', ${componentName})
  .add('default', () => (
    <${componentName}>
      This will be a great story...
    </${componentName}>
  ))
;
`;

// Create new folder.
fs.mkdirSync(componentPath);

// Create JS file.
fs.writeFileSync(`${componentPath}/${componentName}.js`, ComponentBoilerplate);

// Create index file.
fs.writeFileSync(`${componentPath}/index.js`, `export default from './${componentName}';\n`);

// Create Storybook file.
if (withStorybook) {
  fs.writeFileSync(`${componentPath}/${componentName}.stories.js`, StorybookBoilerplate);
}

logInfo(`Your component can be found in ${componentPath}`);
