'use strict';

const gulp  = require('gulp');

require('@bilgeryahov/deploy/src/gulp-tasks.js')('../../../../');

gulp.task('test', ['clean_content']);