// NOTES: pre commit hook is created by running npm install

import gulp, { task, src, dest, watch, parallel } from "gulp";
import gulpSass from "gulp-sass";
import * as dartSass from "sass";
import gitGuppy from "git-guppy";
import gulpFilter from "gulp-filter";
import jshint from "gulp-jshint";
import stylish from "jshint-stylish";
import exec from "gulp-exec";

const sass = gulpSass(dartSass);
const guppy = gitGuppy(gulp);

const execOptions = {
  continueOnError: false, // default = false, true means don't emit error event
  pipeStdout: false, // default = false, true means stdout is written to file.contents
};
const execReportOptions = {
  err: true, // default = true, false means don't write err
  stderr: true, // default = true, false means don't write stderr
  stdout: true, // default = true, false means don't write stdout
};

// task("sass", function (cb) {
//   src("src/styles/*.scss")
//     .pipe(sass().on("error", sass.logError))
//     .pipe(dest("public/css"));
//   cb();
// });

task("sass", function () {
  return gulp
    .src(".")
    .pipe(exec((file) => `sass ${file.path}`, execOptions))
    .pipe(exec.reporter(execReportOptions));
});

task("ts", function () {
  return gulp
    .src(".")
    .pipe(exec(() => `tsc -p .`, execOptions))
    .pipe(exec.reporter(execReportOptions));
});

task("default", function () {
  watch("src/styles/*.scss", parallel("sass"));
  watch("src/js/*.ts", parallel("ts"));
});

task("pre-commit", () => {
  return guppy.src("pre-commit", async (files, cb) => {
    const filter = gulpFilter(["*.js$"], { restore: true });
    const glob = files.length
      ? files
      : ["*.js", "!*public/js", "!*node_modules"];
    src(glob)
      .pipe(filter)
      .pipe(jshint())
      .pipe(jshint.reporter(stylish))
      .pipe(jshint.reporter("fail"));
    cb();
  });
});
