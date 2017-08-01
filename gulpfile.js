const del = require('del');
const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const sourcemaps = require('gulp-sourcemaps');
const replace = require('gulp-replace');
const tsb = require('gulp-tsb');
const runSequence = require('run-sequence');
const fs = require('graceful-fs');
const os = require('os');
const path = require('path');

const srcFiles = 'src/**/*.ts';
const testFiles = 'test/*.js';
const unitTestFiles = 'test/unit/*.js';
const miscFiles = ['*.js', 'scripts/**/*.js'];
const watchFiles = [srcFiles, testFiles, unitTestFiles, miscFiles];
const jsFiles = [testFiles, unitTestFiles, '*.js', 'scripts/**/*.js'];

// Typescript configuration options (tsb caches for speed)

const cjs = tsb.create('tsconfig.json');
const esm = tsb.create('tsconfig.esm.json');
const tst = tsb.create('test/tsconfig.json');

// Babel settings (used only for testing)
const babelSettings = {
  'presets': [['es2015', { 'modules': false }]],
  'plugins': [
    'transform-object-rest-spread',
    'transform-flow-strip-types',
    'transform-decorators-legacy',
    'transform-class-properties'
  ],
  'env': {
    'es': {},
    'development': {
      'plugins': [
        'transform-es2015-modules-commonjs'
      ]
    }
  }
};

// Build tasks - TypeScript

gulp.task('build.cjs', function () {
  return gulp.src(srcFiles)
    .pipe(sourcemaps.init())
    .pipe(cjs())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('lib'));
});

gulp.task('build.esm', function () {
  return gulp.src(srcFiles)
    .pipe(sourcemaps.init())
    .pipe(esm())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('esm'));
});

gulp.task('build.test.typescript', ['build.cjs'], function () {
  return gulp.src(unitTestFiles)
    .pipe(sourcemaps.init())
    .pipe(tst())
    .pipe(replace(/describe\('(.*)',/g, "describe('$1 (from TypeScript)',"))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('test/typescript'));
});

// Build tasks - Babel

gulp.task('build.test.babel', ['build.cjs'], function () {
  return gulp.src(unitTestFiles)
    .pipe(sourcemaps.init())
    .pipe(babel(babelSettings))
    .pipe(replace(/describe\('(.*)',/g, "describe('$1 (from Babel)',"))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('test/babel'));
});

gulp.task('build', ['build.cjs', 'build.esm', 'build.test.typescript', 'build.test.babel', 'symlink']);

gulp.task('clean', function () {
  return del(['lib', 'esm', 'test/typescript', 'test/babel', 'test/node_modules']);
});

gulp.task('clean.tests', function () {
  return del(['test/typescript', 'test/babel']);
});

gulp.task('rebuild.tests', function (cb) {
  runSequence('clean.tests', 'build', cb);
});

/**
 * Install a symlink in test/node_modules/core-decorators to allow tests to run
 */
// Note: [the Yarn package manager](https://yarnpkg.com) has added a feature called workspaces which may be
// a simpler  way of implementing this.   July 2017, yarn docs still are lacking info on workspaces, but 
// this should be reviewed as yarn matures.  
//
// CONSIDER:  replacing this with configuration in package.json + yarn 2017-07-31.

gulp.task('symlink', function (cb) {
  const target = path.resolve('.');
  const dirPath = 'test/node_modules';
  const symlinkPath = 'test/node_modules/core-decorators';
  const symlinkType = os.platform() === 'win32' ? 'junction' : 'dir';

  fs.mkdir(dirPath, function (err) {
    if (err && err.code !== 'EEXIST') { cb(err); return; }
    fs.symlink(target, symlinkPath, symlinkType, function (err) {
      if (err) {
        if (err.code !== 'EEXIST') {
          cb(new Error(`Failed to create ${symlinkType} ${symlinkPath} -> ${target}: ${err}`));
        }
      } else {
        console.log(`Created ${symlinkType} ${symlinkPath} -> ${target} for tests`);
      }
      cb();
    });
  });
});

gulp.task('eslint', function () {
  return gulp.src(jsFiles)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('test', ['symlink'], function () {
  gulp.src(['test/babel/*.spec.js', 'test/typescript/*.spec.js'], {read: false})
    .pipe(mocha());
});

gulp.task('watch', ['default'], function () {
  gulp.watch(watchFiles, ['eslint', 'build']);
});

gulp.task('default', function (cb) {
  runSequence('clean', ['eslint', 'build'], cb);
});
