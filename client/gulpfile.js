const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));

gulp.task('sass', function (cb) {
    gulp.src('src/styles/src/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/styles'));
    cb();
});

gulp.task('default', function () {
    gulp.watch('src/styles/src/*', gulp.parallel('sass'));
});