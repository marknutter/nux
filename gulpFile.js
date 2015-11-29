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

var config = {
  exampleEntryFile: './example/todo-app.js',
  exampleOutputDir: './example/dist/',
  exampleOutputFile: 'todo-app.js',
  nuxOutputFile: 'nux.js',
  nuxOutputDir: './',
  nuxEntryFile: './lib/index.js'
};

// clean the output directory
gulp.task('clean', function(cb){
    rimraf(config.outputDir, cb);
});

var bundler;
function getBundler(prefix) {
  if (!bundler) {
    bundler = watchify(browserify(config[prefix+'EntryFile'], _.extend({ debug: true }, watchify.args)));
  }
  return bundler;
};

function bundle(prefix) {
  return getBundler(prefix)
    .transform(babelify)
    .bundle()
    .on('error', function(err) { console.log('Error: ' + err.message); })
    .pipe(source(config[prefix+'OutputFile']))
    .pipe(gulp.dest(config[prefix+'OutputDir']))
    .pipe(reload({ stream: true }));
}

gulp.task('compress', function() {
  return gulp.src('lib/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('build-persistent', ['clean'], function() {
  return bundle('example');
});

gulp.task('build', ['build-persistent'], function() {
  process.exit(0);
});

gulp.task('build-nux', function() {
  bundle('nux')
    .pipe(uglify())
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

// WEB SERVER
gulp.task('serve', function () {
  browserSync({
    server: {
      baseDir: './example/'
    }
  });
});
