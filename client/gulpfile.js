const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));

gulp.task("sass", function (cb) {
  gulp
    .src("src/styles/sass/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("src/styles/css"));
  cb();
});

gulp.task("default", function () {
  gulp.watch("src/styles/sass/*", gulp.parallel("sass"));
});
