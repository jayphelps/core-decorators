var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
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

gulp.task('watch', ['src'], function () {
  gulp.watch('src/**/*', ['src'])
});

gulp.task('default', ['src']);
