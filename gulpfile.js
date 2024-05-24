const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const guppy = require("git-guppy")(gulp);
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

gulp.task(
  "pre-commit",
  guppy.src("pre-commit", function (files) {
    const jshint = require("gulp-jshint");
    const stylish = require("jshint-stylish");

    const glob = files.length
      ? files
      : //["node-only/*.js", "node-only/utils/*.js"];
        ["node-only/**/*"];

    return gulp
      .src(glob)
      .pipe(gulpFilter(["*.js", "!*node_modules"], { restore: true }))
      .pipe(jshint())
      .pipe(jshint.reporter(stylish))
      .pipe(jshint.reporter("fail"));
  })
);
