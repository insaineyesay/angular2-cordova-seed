'use strict';

/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 */

const path = require('path');
const gutil = require('gulp-util');
const _ = require('lodash');

const environments = ['SBX', 'DEV', 'SIT', 'UAT', 'PERF', 'PREPROD', 'PROD'];
const brands = ['ABC', 'ABCBS', 'BCBSGA', 'EBCBS'];

/**
 *  The main paths of your project handle these with care
 */
exports.paths = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e',
  tasks: 'gulp_tasks',
  templates: 'templates',
  cordova: 'cordova'
};

exports.path = {};
for (const pathName in exports.paths) {
  if (exports.paths.hasOwnProperty(pathName)) {
    exports.path[pathName] = function pathJoin() {
      const pathValue = exports.paths[pathName];
      const funcArgs = Array.prototype.slice.call(arguments);
      const joinArgs = [pathValue].concat(funcArgs);
      return path.join.apply(this, joinArgs);
    };
  }
}

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function (title) {
  return function (err) {
    gutil.log(gutil.colors.red(`[${title}]`), err.toString());
    this.emit('end');
  };
};

exports.environment = function() {
  let env = gutil.env.env || environments[2];
  return _.includes(environments, env) ? env : environments[2];
};

exports.brand = function() {
  let brand = gutil.env.brand || brands[1];
  return _.includes(brands, brand) ? brand : brands[1];
};

exports.feature = function() {
  return gutil.env.feature || '';
};
