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
const cofigFileLimtek = require('./configFileLimtek.json');
const clean  = require('gulp-clean');

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

// Clean the folder.
gulp.task('clean_content', function(){

    return gulp.src('./Deploy/', {read : false})
        .pipe(clean());
});

// Copy static files.
gulp.task('copy_content', function(){

	return gulp.src('./Content/**')
		.pipe(gulp.dest('./Deploy/'));
});

gulp.task('apply_development_api_key', function(){

	return gulp.src('./Deploy/JS/FirebaseEngine.js', {base: './'})
		.pipe(replace(cofigFileLimtek.api_key_default, cofigFileLimtek.api_key_development))
		.pipe(gulp.dest('./'));
});

gulp.task('remove_development_api_key', function(){

    return gulp.src('./Deploy/JS/FirebaseEngine.js', {base: './'})
        .pipe(replace(cofigFileLimtek.api_key_development, cofigFileLimtek.api_key_default))
        .pipe(gulp.dest('./'));
});

gulp.task('apply_live_api_key', function(){

    return gulp.src('./Deploy/JS/FirebaseEngine.js', {base: './'})
        .pipe(replace(cofigFileLimtek.api_key_default, cofigFileLimtek.api_key_live))
        .pipe(gulp.dest('./'));
});

gulp.task('remove_live_api_key', function(){

    return gulp.src('./Deploy/JS/FirebaseEngine.js', {base: './'})
        .pipe(replace(cofigFileLimtek.api_key_live, cofigFileLimtek.api_key_default))
        .pipe(gulp.dest('./'));
});

// After Firebase deploys, make sure that you perform applying the dev api key again.
gulp.task('firebase_deploy', function(){

	return exec('firebase deploy', function(err, stdout, stderr){

		if(err){

			console.error(err);
			return;
		}

		console.log(stdout);
		console.log(stderr);

		return run_sequence('remove_live_api_key', 'apply_development_api_key');
    });
});

// Deploy locally.
gulp.task('deploy_locally', function(){

	return run_sequence('clean_content', 'copy_content', 'compile_css', 'compile_javascript', 'apply_development_api_key');
});

// Deploy live.
gulp.task('deploy_live', function(){

    return run_sequence('clean_content', 'copy_content', 'compile_css', 'compile_javascript', 'apply_live_api_key', 'firebase_deploy');
});