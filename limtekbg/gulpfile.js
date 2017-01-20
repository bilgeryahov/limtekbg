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

// Compile JS ES6 to JS ES5.
gulp.task('javascript_compiler',  function(){

	gulp.src('JS_ES6/*.js')
		.pipe(babel())
		.pipe(gulp.dest('public/JS/'));
});

// Compile SCSS to CSS.
gulp.task('css_compiler', function(){

	gulp.src('SCSS/*scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('public/CSS/'));
});