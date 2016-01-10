var gulp = require('gulp');
var mocha = require('gulp-mocha');
var browserify = require('gulp-browserify');


function handleError(err) {
	console.log(err.toString());
}


gulp.task('browserify', function() {
  return gulp.
    src('./javascript/audio.js').
    pipe(browserify()).
    pipe(gulp.dest('./bin'));
});


gulp.task('test', function() {
	gulp.src('./test/*.js')	
			.pipe(mocha({reporter:"spec"}))
			.on('error', handleError);
});

gulp.task('watch', ['test'], function() {
	gulp.watch(['./test/*.js', './javascript/*.js'], ['test']);
});

