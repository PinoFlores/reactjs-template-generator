const chalk = require('chalk');
const fs = require('fs');
const rimraf = require('rimraf');
const shell = require('shelljs');
const path = require('path');
const nodePlop = require('node-polp');

const ComponentProptNames = require('../../generators/component')
  .ComponentProptNames;
const rootStatePath = require('../../generators/component').rootStatePath;
const SliceProptNames = require('../../generators/slice').SliceProptNames;
const componentVariations = require('./componentVariations')
  .componentVariations;
const sliceVariations = require('./sliceVariations').sliceVariations;
const baseGeneratorPath = require('../../generators/paths').baseGeneratorPath;

process.chdir(path.join(__dirname, '../../generators'));

const plop = nodePlop('./plopfile.ts');
const componentGen = plop.getGenerator('component');
const sliceGen = plop.getGenerator('slice');

const BACKUPFILE_EXTENSION = 'rbgen';

async function generateComponents() {
  const variations = componentVariations();
  const promises = [];

  for (const variation of variations) {
    const p = componentGen
      .runActions(variation)
      .then(handleResult)
      .then(feedbackToUser(`Generated '${variation.componentName}'`))
      .then(_ => ({ name: variation.componentName, path: variation.path }));
    promises.push(p);
  }
  const components = await Promise.all(promises);

  // return a cleanup function
  const cleanup = () => {
    for (const component of components) {
      removeGeneratedComponent(component.path, component.name);
      feedbackToUser(`Cleaned '${component.name}'`)();
    }
  };
  return [cleanup];
}

async function generateSlices() {
  backupFile(rootStatePath);

  const variations = sliceVariations();
  const slices = [];

  for (const variation of variations) {
    const slice = await sliceGen
      .runActions(variation)
      .then(handleResult)
      .then(feedbackToUser(`Generated '${variation.sliceName}'`))
      .then(_ => ({ name: variation.sliceName, path: variation.path }));
    slices.push(slice);
  }

  // return a cleanup function
  const cleanup = () => {
    restoreBackupFile(rootStatePath);

    for (const slice of slices) {
      removeGeneratedSlice(slice.path);
      feedbackToUser(`Cleaned '${slice.name}'`)();
    }
  };
  return [cleanup];
}

/**
 * Run
 */
(async function () {
  const componentCleanup = await generateComponents().catch(reason => {
    reportErrors(reason);
    return [];
  });
  const slicesCleanup = await generateSlices().catch(reason => {
    reportErrors(reason);
    return [];
  });

  // Run lint when all the components are generated to see if they have any linting erros
  const lintingResult = await runLinting()
    .then(reportSuccess(`Linting test passed`))
    .catch(reason => {
      reportErrors(reason, false);
      return false;
    });

  const tsResult = await checkTypescript()
    .then(reportSuccess(`Typescript test passed`))
    .catch(reason => {
      reportErrors(reason, false);
      return false;
    });

  const cleanups = [...componentCleanup, ...slicesCleanup];
  // Everything is done, so run the cleanups synchronously
  for (const cleanup of cleanups) {
    if (typeof cleanup === 'function') {
      cleanup();
    }
  }

  if ((lintingResult && tsResult) === false) {
    process.exit(1);
  }
})();

function runLinting() {
  return new Promise((resolve, reject) => {
    shell.exec(
      `yarn run lint`,
      {
        silent: false, // so that we can see the errors in the console
      },
      code => (code ? reject(new Error(`Linting failed!`)) : resolve()),
    );
  });
}

function checkTypescript() {
  return new Promise((resolve, reject) => {
    shell.exec(
      `yarn run checkTs`,
      {
        silent: false, // so that we can see the errors in the console
      },
      code => (code ? reject(new Error(`Typescript failed!`)) : resolve()),
    );
  });
}

function removeGeneratedComponent(folderPath, name) {
  return rimraf.sync(path.join(baseGeneratorPath, folderPath, name));
}
function removeGeneratedSlice(folderPath) {
  return rimraf.sync(path.join(baseGeneratorPath, folderPath, 'slice'));
}

async function handleResult({ changes, failures }) {
  return new Promise((resolve, reject) => {
    if (Array.isArray(failures) && failures.length > 0) {
      reject(new Error(JSON.stringify(failures, null, 2)));
    }
    resolve(changes);
  });
}
function feedbackToUser(info) {
  return result => {
    console.info(chalk.blue(info));
    return result;
  };
}

function reportSuccess(message) {
  return result => {
    console.log(chalk.green(` ✓ ${message}`));
    return result;
  };
}

function reportErrors(reason, shouldExist = true) {
  console.error(chalk.red(` ✘ ${reason}`));
  if (shouldExist) {
    process.exit(1);
  }
}
function restoreBackupFile(path, backupFileExtension = BACKUPFILE_EXTENSION) {
  const backupPath = path.concat(`.${backupFileExtension}`);
  fs.copyFileSync(backupPath, path);
  fs.unlinkSync(backupPath);
}

function backupFile(path, backupFileExtension = BACKUPFILE_EXTENSION) {
  const targetFile = path.concat(`.${backupFileExtension}`);
  fs.copyFileSync(path, targetFile);
  return targetFile;
}
