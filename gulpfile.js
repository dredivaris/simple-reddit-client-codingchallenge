'use strict';

// requirements
var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    size = require('gulp-size'),
    clean = require('gulp-clean');

gulp.task('transform', function () {
  return gulp.src('./app/static/scripts/jsx/reddit_client.js')
    .pipe(browserify({transform: ['reactify']}))
    .pipe(gulp.dest('./app/static/scripts/js'))
    .pipe(size());
});

gulp.task('clean', function () {
  return gulp.src(['./app/static/scripts/js'], {read: false})
    .pipe(clean());
});

gulp.task('default', function() {
  gulp.start('transform');
  gulp.watch('./app/static/scripts/jsx/reddit_client.js', ['transform']);
});