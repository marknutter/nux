var gulp = require('gulp');
var fs = require('fs');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var rimraf = require('rimraf');
var source = require('vinyl-source-stream');
var _ = require('lodash');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var karma = require('karma').server;
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var rename = require("gulp-rename");

var config = {
  simpleTodoEntryFile: './example/simple-todo/todo-app.js',
  simpleTodoOutputDir: './example/simple-todo/dist/',
  simpleTodoOutputFile: 'todo-app.js',
  todoMVCEntryFile: './example/todo-mvc/todo-app.js',
  todoMVCOutputDir: './example/todo-mvc/dist/',
  todoMVCOutputFile: 'todo-mvc.js',
  nuxOutputFile: 'nux.js',
  nuxOutputDir: './',
  nuxEntryFile: './lib/index.js'
};

// clean the output directory
gulp.task('clean', function(cb){
    rimraf(config.exampleOutputDir, cb);
});

var bundler;
function getBundler() {
  if (!bundler) {
    bundler = watchify(browserify(config.exampleEntryFile, _.extend({ debug: true }, watchify.args)));
  }
  return bundler;
};

function bundle(prefix) {
  return getBundler()
    .transform(babelify)
    .bundle()
    .on('error', function(err) { console.log('Error: ' + err.message); })
    .pipe(source(config.exampleOutputFile))
    .pipe(gulp.dest(config.exampleOutputDir))
    .pipe(reload({ stream: true }));
}


gulp.task('build-persistent', ['clean'], function() {
  return bundle('example');
});

gulp.task('build', ['build-persistent'], function() {
  process.exit(0);
});

gulp.task('build-nux', function() {
  browserify(config.nuxEntryFile)
  .transform(babelify)
  .bundle()
  .on('error', function(err) { console.log('Error: ' + err.message); })
  .pipe(source(config.nuxOutputFile))
  .pipe(gulp.dest(config.nuxOutputDir))
  .pipe(streamify(uglify()))
  .pipe(rename({
    extname: '.min.js'
  }))
  .pipe(gulp.dest('./'));
});

gulp.task('watch', ['build-persistent'], function() {

  browserSync({
    server: {
      baseDir: './example/'
    }
  });

  getBundler().on('update', function() {
    gulp.start('build-persistent')
  });
});

gulp.task('watch-simple-todo', ['clean'], function() {
  return bundle('example');
});

gulp.task('watch-todo-mvc', ['clean'], function() {
  return bundle('example');
});

// WEB SERVER
gulp.task('serve', function () {
  browserSync({
    server: {
      baseDir: './example/'
    }
  });
});
