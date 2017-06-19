/**
 * @file gulpfile.js
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 * @copyright © 2017 Bilger Yahov, all rights reserved.
 */

'use strict';

// All the development dependencies needed.
const gulp  = require('gulp');
const sass  = require('gulp-sass');
const babel = require('gulp-babel');
const run_sequence = require('run-sequence');
const clean  = require('gulp-clean');
const replace = require('gulp-replace');
const exec = require('child_process').exec;

// Config file, from which the api keys and db paths are taken.
const configFileLimtek = require('./configFileLimtek.json');

// Clean the folder for a fresh deploy.
gulp.task('clean_content', function(){

    return gulp.src('./Deploy/', {read : false})
        .pipe(clean());
});

// Clean up the scss files after a successful deploy.
gulp.task('clean_scss', function(){

    return gulp.src('./Deploy/**/*.scss', {read : false})
        .pipe(clean());
});

// Copy static files to the folder which will be publicly available.
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

// Deploy live.
gulp.task('deploy_live', function(){

    return run_sequence('clean_content', 'copy_content', 'compile_css', 'compile_javascript', 'clean_scss',
        'set_live_environment', 'firebase_deploy');
});

// Set the correct keys for dev env.
gulp.task('set_development_environment', function () {

    return gulp.src('./Deploy/JavaScript/EnvironmentHelper.js', { base : './' })
        .pipe(replace(configFileLimtek.firebase.placeholder.apiKey,
                        configFileLimtek.firebase.development.apiKey))
        .pipe(replace(configFileLimtek.firebase.placeholder.authDomain,
                        configFileLimtek.firebase.development.authDomain))
        .pipe(replace(configFileLimtek.firebase.placeholder.databaseURL,
            configFileLimtek.firebase.development.databaseURL))
        .pipe(replace(configFileLimtek.firebase.placeholder.messagingSenderId,
            configFileLimtek.firebase.development.messagingSenderId))
        .pipe(replace(configFileLimtek.firebase.placeholder.projectId,
            configFileLimtek.firebase.development.projectId))
        .pipe(replace(configFileLimtek.firebase.placeholder.storageBucket,
            configFileLimtek.firebase.development.storageBucket))
        .pipe(gulp.dest('./'));
});

// Set the correct keys for live env.
gulp.task('set_live_environment', function () {

    return gulp.src('./Deploy/JavaScript/EnvironmentHelper.js', { base : './' })
        .pipe(replace(configFileLimtek.firebase.placeholder.apiKey,
            configFileLimtek.firebase.live.apiKey))
        .pipe(replace(configFileLimtek.firebase.placeholder.authDomain,
            configFileLimtek.firebase.live.authDomain))
        .pipe(replace(configFileLimtek.firebase.placeholder.databaseURL,
            configFileLimtek.firebase.live.databaseURL))
        .pipe(replace(configFileLimtek.firebase.placeholder.messagingSenderId,
            configFileLimtek.firebase.live.messagingSenderId))
        .pipe(replace(configFileLimtek.firebase.placeholder.projectId,
            configFileLimtek.firebase.live.projectId))
        .pipe(replace(configFileLimtek.firebase.placeholder.storageBucket,
            configFileLimtek.firebase.live.storageBucket))
        .pipe(gulp.dest('./'));
});