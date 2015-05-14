var gulp = require('gulp'),
  path = require('path'),
  fs = require('fs'),
  $ = require('gulp-load-plugins')(),
  del = require('del'),
  runSequence = require('run-sequence'),
  watchify = require('watchify'),
  browserify = require('browserify'),
  polyify = require('polyify').configure,
  buffer = require('vinyl-buffer'),
  assign = require('lodash.assign'),
  source = require('vinyl-source-stream');

const APP_CONFIG = {
  app: __dirname+'/src',
  dist: __dirname+'/web',
};

const AUTOPREFIXER_BROWSERS = [
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.3',
  'bb >= 10'
];

gulp.task('coffeehint', function () {
  return gulp.src(APP_CONFIG.app+'/**/*.coffee')
  .pipe($.coffeelint())
  .pipe($.coffeelint.reporter());
});

gulp.task('jshint', function () {
    return gulp.src(APP_CONFIG.app+'/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('clean', del.bind(null,
  [
    APP_CONFIG.dist+'/js',
  ],{dot: true}
));

// BROWSERIFY
const customOpts = {
  extensions: ['.coffee', '.js'],
  entries: [APP_CONFIG.app+'/js/index.coffee'],
  debug: true
};

const opts = assign({}, watchify.args, customOpts);
const bundler = watchify(browserify(APP_CONFIG.app+'/js/index.coffee',opts));
bundler.transform('coffeeify');
bundler.transform(polyify({ browsers: AUTOPREFIXER_BROWSERS }));

function bundle(){
  const start = Date.now();
  $.util.log('Rebundling');
  return bundler.bundle()
  .on('error', $.util.log.bind($.util, 'Browserify error'))
  .pipe(source('app.js'))
  .pipe(buffer())
  .pipe($.sourcemaps.init({loadMaps: true}))
  .pipe($.sourcemaps.write('./'))
  .pipe(gulp.dest(APP_CONFIG.dist+'/js'))
  .pipe($.livereload({auto: false}))
  bundler.on('update', bundle)
};

gulp.task('dev:js', bundle);
bundler.on('update', bundle);
bundler.on('log', $.util.log);

// SERVER
gulp.task('webserver',function() {
  gulp.src(APP_CONFIG.dist)
  .pipe($.webserver({
    livereload: true,
    directoryListing: false,
    open: true
  }));
});

gulp.task('watch', function () {
  gulp.watch([APP_CONFIG.app+'/**/*.coffee'], ['coffeehint']);
  gulp.watch([APP_CONFIG.app+'/**/*.js'], ['jshint']);
});

gulp.task('default',function(){
  runSequence('clean',['coffeehint','dev:js','webserver','watch']);
})
