const gulp = require('gulp');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const rimraf = require('rimraf');

// Default build uses settings from 'tsconfig.json'

tsProject = ts.createProject('tsconfig.json');
tsProjectEsm = ts.createProject('tsconfig.json', {module: 'es2015'});
 
gulp.task('clean', function (cb) {
  rimraf.sync('cjs');
  rimraf('esm', cb);
})

gulp.task('cjs', function () {
    var tsResult = tsProject.src() 
      .pipe(sourcemaps.init())
      .pipe(tsProject());
    return tsResult.js
      .pipe(sourcemaps.write('sourcemaps'))
      .pipe(gulp.dest('cjs'))
});

gulp.task('esm', function () {
    var tsResult = tsProjectEsm.src() 
      .pipe(sourcemaps.init())
      .pipe(tsProjectEsm());
    return tsResult.js
      .pipe(sourcemaps.write('sourcemaps'))
      .pipe(gulp.dest('esm'))
});

gulp.task('src', ['cjs', 'esm']);

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


gulp.task('test', ['babel.test'] )

gulp.task('watch', ['src','test'], function () {
  gulp.watch('src/**/*', ['src'])
  gulp.watch('test/**/*', ['test'])
});

gulp.task('default', ['src', 'test']);
