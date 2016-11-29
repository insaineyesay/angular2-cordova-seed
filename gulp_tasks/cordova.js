'use strict';

const path = require('path');

const change = require('gulp-change');
const data = require('gulp-data');
const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const rename = require('gulp-rename');
const spawn = require('child_process').spawn;
const template = require('gulp-template');

const conf = require('../conf/gulp.conf');
const brandConfig = require('../conf/brands.json');
const environmentConfig = require('../conf/environments.json');

// ==============================
// Cordova Android platform tasks
// ==============================
gulp.task('cordova:platform:android:rm', function (cb) {
  runCordovaCommand('cordova', ['platform', 'rm', 'android'], cb);
});

gulp.task('cordova:platform:android:add', function (cb) {
  runCordovaCommand('cordova', ['platform', 'add', 'android'], cb);
});

gulp.task('cordova:platform:android:build:prepare', function (cb) {
  runCordovaCommand('cordova', ['prepare', 'android'], cb);
});

gulp.task('cordova:platform:android:build:filter', function () {
  const src = path.join(conf.paths.cordova, '/platforms/android/assets/www/index.html');
  const dest = path.join(conf.paths.cordova, '/platforms/android/assets/www');
  return gulp.src(src)
    .pipe(change(replaceAndroidContent))
    .pipe(gulp.dest(dest));
});

gulp.task('cordova:platform:android:build:compile', function (cb) {
  runCordovaCommand('cordova', ['compile', 'android'], cb);
});

gulp.task('cordova:platform:android:build', gulp.series(
  'cordova:platform:android:build:prepare',
  'cordova:platform:android:build:filter',
  'cordova:platform:android:build:compile'
));

gulp.task('cordova:platform:android', gulp.series(
  'cordova:platform:android:rm',
  'cordova:platform:android:add',
  'cordova:platform:android:build'
));

// ==============================
// Cordova iOS platform tasks
// ==============================
gulp.task('cordova:platform:ios:rm', function (cb) {
  runCordovaCommand('cordova', ['platform', 'rm', 'ios'], cb);
});

gulp.task('cordova:platform:ios:add', function (cb) {
  runCordovaCommand('cordova', ['platform', 'add', 'ios'], cb);
});

gulp.task('cordova:platform:ios:build', function (cb) {
  runCordovaCommand('cordova', ['build', 'ios'], cb);
});

gulp.task('cordova:platform:ios', gulp.series(
  'cordova:platform:ios:rm',
  'cordova:platform:ios:add',
  'cordova:platform:ios:build'
));

// ==============================
// Cordova template tasks
// ==============================
gulp.task('cordova:template:clean', function () {
  return del([
    path.join(conf.paths.cordova, '/config.xml')
  ]);
});

gulp.task('cordova:template:config', function () {
  return gulp.src(path.join(conf.paths.templates, '/config.xmlt'))
    .pipe(data({
      brand: conf.brand(),
      brandConfig: brandConfig[conf.brand()],
      environment: conf.environment(),
      environmentConfig: environmentConfig[conf.environment()],
      widgetName: getWidgetName()
    }))
    .pipe(template())
    .pipe(rename({
      extname: '.xml'
    }))
    .pipe(gulp.dest(conf.paths.cordova));
});

gulp.task('cordova:template', gulp.series(
  'cordova:template:clean', gulp.parallel(
    'cordova:template:config'
  )
));

// ==============================
// Cordova general tasks
// ==============================
gulp.task('cordova:prepare:clean', function () {
  return del([
    path.join(conf.paths.cordova, '/www/**/*'),
    path.join(`!${conf.paths.cordova}`, '/www/.keep')
  ]);
});

gulp.task('cordova:prepare:copy', function () {
  return gulp.src(path.join(conf.paths.dist, '/**/*'))
    .pipe(gulp.dest(path.join(conf.paths.cordova, '/www')));
});

gulp.task('cordova:prepare', gulp.series(
  'cordova:prepare:clean', gulp.parallel(
    'cordova:prepare:copy'
  )
));

gulp.task('cordova:build', gulp.series(
  'cordova:template',
  'cordova:prepare',
  'cordova:platform:android'
));

// ==============================
// Functions used by tasks
// ==============================

function runCordovaCommand(command, args, callback) {
  const execOptions = {
    cwd: conf.paths.cordova
  };
  let build = spawn(command, args, execOptions);
  build.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  build.stderr.on('data', (data) => {
    console.log(gutil.colors.red(data.toString()));
  });
  build.on('close', (code) => {
    callback(code);
  });
}

function getWidgetName() {
  const environment = conf.environment();
  const feature = conf.feature();
  let widgetName = `com.wellpoint.consumer.${conf.brand()}`;
  if (environment && environment !== 'PROD') {
    if (feature) {
      widgetName += `.${feature}`;
    }
    widgetName += `.${environment}`;
  }
  return widgetName;
}

function replaceAndroidContent(content) {
  return content.replace(/base href="\/"/g, 'base href="file:///android_asset/www/"');
}
