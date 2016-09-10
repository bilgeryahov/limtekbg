/**
 * @author Bilger Yahov <bayahov1@gmail.com>
 * 
 * All rights reserved. 2016.
 * 
 * @type Module gulp|Module gulp
 */

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('styles', function(){

	gulp.src('SCSS/*scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('CSS/'));
});

gulp.task('default', function(){

     gulp.watch('SCSS/*.scss', ['styles']);
});
