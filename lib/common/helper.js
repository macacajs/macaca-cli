/* ================================================================
 * mobile-driver by xdf(xudafeng[at]126.com)
 *
 * first created at : Tue Mar 17 2015 00:16:10 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

'use strict';

var _ = require('lodash');
var moment = require('moment');

_.moment = moment;

_.camelcase = function(str) {
  return str.split('-').reduce(function(str, word){
    return str + word[0].toUpperCase() + word.slice(1);
  });
};

_.getConfig = function(program) {
  var cfg = {};

  program.options.forEach(function(item) {
    var key = _.camelcase(item.name());

    if(key in program) {

      if (typeof program[key] !== 'function') {
        cfg[key] = program[key];
      }
    }
  });
  return cfg;
};

module.exports = _;
