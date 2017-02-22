/**
 * @file gulpfile.js
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

// ES6 features only in strict mode.
'use strict';

let gulp  = require('gulp');
let sass  = require('gulp-sass');
let babel = require('gulp-babel');
let run_sequence = require('run-sequence');

// Compile JS ES6 to JS ES5.
gulp.task('compile_javascript',  function(){

	gulp.src('./JS_ES6/*.js')
		.pipe(babel())
		.pipe(gulp.dest('./Deploy/JS/'));
});

// Compile SCSS to CSS.
gulp.task('compile_css', function(){

	gulp.src('./SCSS/*scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./Deploy/CSS/'));
});

// Copy static files.
gulp.task('copy_content', function(){

	return gulp.src('./Content/**')
		.pipe(gulp.dest('./Deploy/'));
});

// Deploy locally.
gulp.task('deploy', function(){

	return run_sequence('copy_content', 'compile_css', 'compile_javascript');
});