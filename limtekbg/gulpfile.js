/**
 * @file gulpfile.js
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

// ES6 features only in strict mode.
'use strict';

const gulp  = require('gulp');
const sass  = require('gulp-sass');
const babel = require('gulp-babel');
const run_sequence = require('run-sequence');
const replace = require('gulp-replace');
const exec = require('child_process').exec;

// Compile JS ES6 to JS ES5.
gulp.task('compile_javascript',  function(){

	return gulp.src('./JS_ES6/*.js')
		.pipe(babel())
		.pipe(gulp.dest('./Deploy/JS/'));
});

// Compile SCSS to CSS.
gulp.task('compile_css', function(){

	return gulp.src('./SCSS/*scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./Deploy/CSS/'));
});

// Copy static files.
gulp.task('copy_content', function(){

	return gulp.src('./Content/**')
		.pipe(gulp.dest('./Deploy/'));
});

gulp.task('apply_development_api_key', function(){

	return gulp.src('./JS_ES6/FirebaseEngine.js', {base: './'})
		.pipe(replace('api_key_goes_here', 'AIzaSyDV0mt85i0AFHU06uW-VmEwr20ebKPBd14'))
		.pipe(gulp.dest('./'));
});

gulp.task('remove_development_api_key', function(){

    return gulp.src('./JS_ES6/FirebaseEngine.js', {base: './'})
        .pipe(replace('AIzaSyDV0mt85i0AFHU06uW-VmEwr20ebKPBd14', 'api_key_goes_here'))
        .pipe(gulp.dest('./'));
});

gulp.task('apply_live_api_key', function(){

    return gulp.src('./JS_ES6/FirebaseEngine.js', {base: './'})
        .pipe(replace('api_key_goes_here', 'AIzaSyBSeUAE2adT-G2lSRREJhLuNAT5iv5v6HA'))
        .pipe(gulp.dest('./'));
});

gulp.task('remove_live_api_key', function(){

    return gulp.src('./JS_ES6/FirebaseEngine.js', {base: './'})
        .pipe(replace('AIzaSyBSeUAE2adT-G2lSRREJhLuNAT5iv5v6HA', 'api_key_goes_here'))
        .pipe(gulp.dest('./'));
});

gulp.task('firebase_deploy', function(){

	return exec('firebase deploy', function(err, stdout, stderr){

		console.log(stdout);
		console.log(stderr);
		console.log(err);
    });
});

// Deploy locally.
gulp.task('deploy_locally', function(){

	return run_sequence('copy_content', 'compile_css', 'apply_development_api_key', 'compile_javascript', 'remove_development_api_key');
});

// Deploy live.
gulp.task('deploy_live', function(){

    return run_sequence('copy_content', 'compile_css', 'apply_live_api_key', 'compile_javascript', 'remove_live_api_key', 'firebase_deploy');
});