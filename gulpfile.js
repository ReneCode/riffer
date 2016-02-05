var gulp = require('gulp');
var mocha = require('gulp-mocha');
var browserify = require('gulp-browserify');


function handleError(err) {
	console.log("---- \=/ -----");
	console.log(err.toString());
}


gulp.task('browserify', function() {
  gulp.src('./javascript/audio.js')
    .pipe(browserify())
    .on('error', handleError) 
    .pipe(gulp.dest('./bin'))
    .on('error', handleError); 
});

gulp.task('watch-browserify', function() {
	gulp.watch(['./javascript/*.js'], ['browserify'])
		.on('error', handleError);
});

gulp.task('test', function() {
	gulp.src('./test/*.js')	
			.pipe(mocha({reporter:"spec"}))
			.on('error', handleError);
});

gulp.task('watch', ['test'], function() {
	gulp.watch(['./test/*.js', './javascript/*.js'], ['test'])
		.on('error', handleError);
});


