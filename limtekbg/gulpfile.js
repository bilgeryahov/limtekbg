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
const runSequence = require('run-sequence');
const clean  = require('gulp-clean');
const replace = require('gulp-replace');
const exec = require('child_process').exec;
const stringifyObject = require('stringify-object');

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

// Set the correct keys for dev env.
gulp.task('set_development_environment', function () {

    return gulp.src('./Deploy/JavaScript/EnvironmentHelper.js', { base : './' })
        .pipe(replace(configFileLimtek.firebase.placeholder,
            stringifyObject(
                configFileLimtek.firebase.development,
                {singleQuotes: true})
            )
        )
        .pipe(gulp.dest('./'));
});

// Set the correct keys for live env.
gulp.task('set_live_environment', function () {

    return gulp.src('./Deploy/JavaScript/EnvironmentHelper.js', { base : './' })
        .pipe(replace(configFileLimtek.firebase.placeholder,
            stringifyObject(
                configFileLimtek.firebase.live,
                {singleQuotes: true})
            )
        )
        .pipe(gulp.dest('./'));
});

// Deploy locally.
gulp.task('deploy_locally', function(){

    return runSequence('check_rights_development');
});

// Deploy live.
gulp.task('deploy_live', function(){

    return runSequence('check_rights_production');
});

gulp.task('check_rights_production', function () {

   return exec('firebase list --interactive', function (err, stdout, stderr) {

       if(err){

           console.error(err);
           return;
       }

       console.log(stdout);
       console.log(stderr);

	if(!stdout.includes('Project ID / Instance')){

		console.log('Unexpected output');
            	return;
	}

       if(stdout.includes('production-project')){

           console.log('You are allowed to deploy on production.');
           return runSequence('clean_content', 'copy_content', 'compile_css', 'compile_javascript', 'clean_scss',
               'set_live_environment', 'firebase_deploy');
       }

       console.log('You are not allowed to deploy on production.');
   });
});

gulp.task('firebase_deploy', function(){

    return exec('firebase deploy --only hosting', function(err, stdout, stderr){

        if(err){

            console.error(err);
            return;
        }

        console.log(stdout);
        console.log(stderr);
    });
});

gulp.task('check_rights_development', function () {

    return exec('firebase list --interactive', function (err, stdout, stderr) {

        if(err){

            console.error(err);
            return;
        }

        console.log(stdout);
        console.log(stderr);

	if(!stdout.includes('Project ID / Instance')){

		console.log('Unexpected output');
            	return;
	}

        if(stdout.includes('production-project')){

            console.log('You are not allowed to deploy on development.');
            return;
        }

        console.log('You are allowed to deploy on development.');
        return runSequence('clean_content', 'copy_content', 'compile_css', 'compile_javascript', 'clean_scss',
            'set_development_environment');
    });
});