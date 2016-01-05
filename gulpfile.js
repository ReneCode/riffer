var gulp = require('gulp');
var mocha = require('gulp-mocha');

var watching = false;

function handleError(err) {
	console.log(err.toString());
}


gulp.task('test', function() {
	gulp.src('./test/*.js')	
			.pipe(mocha({reporter:"spec"}))
			.on('error', handleError);
});

gulp.task('watch', ['test'], function() {
	gulp.watch(['./test/*.js', './javascript/*.js'], ['test']);
});

