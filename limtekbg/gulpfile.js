/**
 * @file gulpfile.js
 *
 * Limtek - product specific deploy file.
 * This deploy file makes use of the publicly available one
 * on the NPM registry.
 *
 * The project, which makes use of the gulp tasks,
 * needs to have installed the same packages,
 * which are installed on the @bilgeryahov/deploy package.
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.1.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

'use strict';

const gulp  = require('gulp');
const configFileLimtek = require('./configFileLimtek.json');

require('@bilgeryahov/deploy/src/gulp-tasks')(configFileLimtek);

gulp.task('deploy_dev',['d_dev']);
gulp.task('deploy_prd',['d_prd']);