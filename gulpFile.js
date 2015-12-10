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
  simpleTodoDir: './example/simple-todo/',
  simpleTodoOutputFile: 'todo-app.js',
  todoMVCEntryFile: './example/todo-mvc/js/app.js',
  todoMVCOutputDir: './example/todo-mvc/dist/',
  todoMVCDir: './example/todo-mvc/',
  todoMVCOutputFile: 'todo-mvc.js',
  nuxOutputFile: 'nux.js',
  nuxOutputDir: './',
  nuxEntryFile: './lib/index.js'
};



var bundler;
function getBundler(prefix) {
  if (!bundler) {
    bundler = watchify(browserify(config[prefix + 'EntryFile'], _.extend({ debug: true }, watchify.args)));
  }
  return bundler;
};

function bundle(prefix) {
  return getBundler(prefix)
    .transform(babelify)
    .bundle()
    .on('error', function(err) { console.log('Error: ' + err.message); })
    .pipe(source(config[prefix + 'OutputFile']))
    .pipe(gulp.dest(config[prefix + 'OutputDir']))
    .pipe(reload({ stream: true }));
}

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


gulp.task('watch-simple-todo', function(cb) {
  rimraf(config.simpleTodoOutputDir, cb);

  browserSync({
    server: {
      baseDir: config.simpleTodoDir
    }
  });

  getBundler('simpleTodo').on('update', function() {
    bundle('simpleTodo')
  });

  bundle('simpleTodo')

});

gulp.task('build-simple-todo', ['clean-simple-todo'], function() {
  return bundle('todoTodo')
});

gulp.task('clean-simple-todo', function(cb){
    rimraf(config.simpleTodoOutputDir, cb);
});

gulp.task('watch-todo-mvc', ['build-todo-mvc'], function(cb) {
  browserSync({
    server: {
      baseDir: config.todoMVCDir
    }
  });

  getBundler('todoMVC').on('update', function() {
    gulp.start('build-todo-mvc')
  });
});

gulp.task('build-todo-mvc', ['clean-todo-mvc'], function() {
  return bundle('todoMVC')
});

gulp.task('clean-todo-mvc', function(cb){
    rimraf(config.todoMVCOutputDir, cb);
});

// WEB SERVER
gulp.task('serve', function () {
  browserSync({
    server: {
      baseDir: './example/'
    }
  });
});
