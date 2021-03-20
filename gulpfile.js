// --------------------------------------------------
// [Gulpfile]
// --------------------------------------------------

'use strict';
 
var gulp 		= require('gulp'),
	sass 		= require('gulp-sass'),
	changed 	= require('gulp-changed'),
	cleanCSS 	= require('gulp-clean-css'),
	rtlcss 		= require('gulp-rtlcss'),
	rename 		= require('gulp-rename'),
	uglify 		= require('gulp-uglify'),
	pump 		= require('pump'),
	htmlhint  	= require('gulp-htmlhint');


// Gulp plumber error handler
function errorLog(error) {
	console.error.bind(error);
	this.emit('end');
}


// --------------------------------------------------
// [Libraries]
// --------------------------------------------------

// Sass - Compile Sass files into CSS
gulp.task('sass',  () => {
return	gulp.src('./HTML/sass/**/*.scss')
		.pipe(changed('./HTML/css/'))
		.pipe(sass({ outputStyle: 'expanded' }))
		.on('error', sass.logError)
		.pipe(gulp.dest('./HTML/css/'));
});


// Minify CSS
gulp.task('minify-css',  gulp.series(() => {
	// Theme
  return  gulp.src(['./HTML/css/layout.css', '!./HTML/css/layout.min.css'])
        .pipe(cleanCSS({debug: true}, (details) => {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./HTML/css/'));

    // RTL
    gulp.src(['./HTML/css/layout-rtl.css', '!./HTML/css/layout-rtl.min.css'])
        .pipe(cleanCSS({debug: true}, (details) => {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./HTML/css/'));
}));


// RTL CSS - Convert LTR CSS to RTL.
gulp.task('rtlcss',  gulp.series( () => {
	return	gulp.src(['./HTML/css/layout.css', '!./HTML/css/layout.min.css', '!./HTML/css/layout-rtl.css', '!./HTML/css/layout-rtl.min.css'])
	.pipe(changed('./HTML/css/'))
		.pipe(rtlcss())
		.pipe(rename({ suffix: '-rtl' }))
		.pipe(gulp.dest('./HTML/css/'));
}));


// Minify JS - Minifies JS
gulp.task('uglify',  gulp.series((cb) => {
  return	pump([
	        gulp.src(['./HTML/js/**/*.js', '!./HTML/js/**/*.min.js']),
	        uglify(),
			rename({ suffix: '.min' }),
	        gulp.dest('./HTML/js/')
		],
		cb
	);
}));


// Htmlhint - Validate HTML
gulp.task('htmlhint', gulp.series( () => {
	return	gulp.src('./HTML/*.html')
		.pipe(htmlhint())
		.pipe(htmlhint.reporter())
	  	.pipe(htmlhint.failReporter({ suppress: true }))
}));


// --------------------------------------------------
// [Gulp Task - Watch]
// --------------------------------------------------

// This handles watching and running tasks
gulp.task('watch',  gulp.series(() => {
	gulp.watch('./HTML/sass/**/*.scss', gulp.series('sass'));
	gulp.watch('./HTML/css/layout.css', gulp.series('minify-css'));
	gulp.watch('./HTML/css/layout.css', gulp.series('rtlcss'));
	gulp.watch('./HTML/js/**/*.js', gulp.series('uglify'));
	gulp.watch('./HTML/*.html', gulp.series('htmlhint'));
}));

// Lets us type "gulp" on the command line and run all of our tasks
gulp.task('default',  gulp.series('sass', 'minify-css', 'rtlcss', 'uglify', 'htmlhint', 'watch'));

