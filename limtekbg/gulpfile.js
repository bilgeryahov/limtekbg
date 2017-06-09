/**
 * @file gulpfile.js
 *
 * File which exposes deploy functionality for the project. There are two main
 * procedures - live and development deploy. Both make sure that
 * they apply the correct API keys as well as database paths.
 * After a live deploy the procedure makes sure that
 * live settings are cleared up, so no affection.
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

// Set the correct keys and paths for dev env.
gulp.task('set_development_environment', function () {

    return gulp.src('./Deploy/JavaScript/EnvironmentHelper.js', { base : './' })
        .pipe(replace(configFileLimtek.firebase.api_keys.default,configFileLimtek.firebase.api_keys.development))
        .pipe(replace(configFileLimtek.firebase.db_paths.default, configFileLimtek.firebase.db_paths.development))
        .pipe(gulp.dest('./'));
});

// Set the correct keys and paths for live env.
gulp.task('set_live_environment', function () {

    return gulp.src('./Deploy/JavaScript/EnvironmentHelper.js', { base : './' })
        .pipe(replace(configFileLimtek.firebase.api_keys.default,configFileLimtek.firebase.api_keys.live))
        .pipe(replace(configFileLimtek.firebase.db_paths.default, configFileLimtek.firebase.db_paths.live))
        .pipe(gulp.dest('./'));
});

// Clear live setting after live deployment.
gulp.task('clear_live_environment', function () {

    return gulp.src('./Deploy/JavaScript/EnvironmentHelper.js', { base : './' })
        .pipe(replace(configFileLimtek.firebase.api_keys.live,configFileLimtek.firebase.api_keys.development))
        .pipe(replace(configFileLimtek.firebase.db_paths.live, configFileLimtek.firebase.db_paths.development))
        .pipe(gulp.dest('./'));
});

// Firebase hosting deploy. Makes sure that after successful execution
// the live environment settings are cleared up.
gulp.task('firebase_deploy', function(){

    return exec('firebase deploy --only hosting', function(err, stdout, stderr){

        if(err){

            console.error(err);
            return run_sequence('clear_live_environment');
        }

        console.log(stdout);
        console.log(stderr);
        return run_sequence('clear_live_environment');
    });
});