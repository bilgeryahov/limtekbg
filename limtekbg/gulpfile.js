/**
 * @file gulpfile.js
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

'use strict';

const gulp  = require('gulp');
const sass  = require('gulp-sass');
const babel = require('gulp-babel');
const run_sequence = require('run-sequence');
const clean  = require('gulp-clean');

const configFileLimtek = require('./configFileLimtek.json');

// Clean the folder.
gulp.task('clean_content', function(){

    return gulp.src('./Deploy/', {read : false})
        .pipe(clean());
});

// Clean the scss files.
gulp.task('clean_scss', function(){

    return gulp.src('./Deploy/**/*.scss', {read : false})
        .pipe(clean());
});

// Copy static files.
gulp.task('copy_content', function(){

    return gulp.src('./App/**')
        .pipe(gulp.dest('./Deploy/'));
});

// Compile JS ES6 to JS ES5.
gulp.task('compile_javascript',  function(){

    // Make sure to take everything from the modules.
    // Make sure to take only the EcmaScript 6 files, without Vendor folder.
    const paths = [
        './Deploy/Modules/**/*.js',
        './Deploy/JavaScript/*.js'
    ];

    return gulp.src(paths, {base: './'})
        .pipe(babel())
        .pipe(gulp.dest('./'));
});

// Compile SCSS to CSS.
gulp.task('compile_css', function(){

    // Make sure to take everything from the modules.
    // Make sure to take only the scss stylesheets, without Vendor folder.
    const paths = [
        './Deploy/Modules/**/*.scss',
        './Deploy/StyleSheets/*.scss'
    ];

    return gulp.src(paths, {base: './'})
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./'));
});

// Deploy locally.
gulp.task('deploy_locally', function(){

    return run_sequence('clean_content', 'copy_content', 'compile_css', 'compile_javascript', 'clean_scss',
    'set_development_environment');
});

// Set the correct keys and paths for dev env.
gulp.task('set_development_environment', function () {


});

// Set the correct keys and paths for live env.
gulp.task('set_live_environment', function () {


});