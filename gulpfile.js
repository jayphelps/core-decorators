const gulp = require('gulp');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');

const srcFiles = 'src/**/*';
const testFiles = 'test/**/*';

// Default build uses settings from 'tsconfig.json'

tsProject = ts.createProject('tsconfig.json');
tsProjectEsm = ts.createProject('tsconfig.json', {module: 'es2015'});
tsProjectTest = ts.createProject('tsconfig.json', {rootDir: '.'});
 
gulp.task('clean', function () {
  return del(['lib', 'esm', 'testBabel', 'testTsc']);
})

gulp.task('lib', function () {
    var tsResult = gulp.src(srcFiles) 
      .pipe(sourcemaps.init())
      .pipe(tsProject());
    return tsResult.js
      .pipe(sourcemaps.write('sourcemaps'))
      .pipe(gulp.dest('lib'))
});

gulp.task('esm', function () {
    var tsResult = gulp.src(srcFiles) 
      .pipe(sourcemaps.init())
      .pipe(tsProjectEsm());
    return tsResult.js
      .pipe(sourcemaps.write('sourcemaps'))
      .pipe(gulp.dest('esm'))
});

gulp.task('tsc.test', ['src'], function () {
  return gulp.src(testFiles)
    .pipe(sourcemaps.init())
    .pipe(tsProjectTest())
    .pipe(sourcemaps.write('sourcemaps'))
    .pipe(gulp.dest('testTsc'))
})

gulp.task('src', ['lib', 'esm']);

gulp.task('babel.test', ['src'], function () {
  return gulp.src('test/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      "presets": [["es2015", { "modules": false }]],
      "plugins": [
        "transform-object-rest-spread",
        "transform-flow-strip-types",
        "transform-decorators-legacy",
        "transform-class-properties"
      ],
    "env": {
      "es": {},
      "development": {
        "plugins": [
          "transform-es2015-modules-commonjs"
        ]
      }}}))
    .pipe(sourcemaps.write('sourcemaps'))
    .pipe(gulp.dest('testBabel'))
})


gulp.task('test', ['babel.test', 'tsc.test'] )

gulp.task('watch', ['src','test'], function () {
  gulp.watch('src/**/*', ['src'])
  gulp.watch('test/**/*', ['test'])
});

gulp.task('default', ['src', 'test']);
