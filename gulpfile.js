const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const gulpFilter = require("gulp-filter");

console.error(gulpFilter);
gulp.task("sass", function (cb) {
  gulp
    .src("src/styles/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("public/css"));
  cb();
});

gulp.task("default", function () {
  gulp.watch("src/styles/*", gulp.parallel("sass"));
});
