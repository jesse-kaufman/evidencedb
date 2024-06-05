// NOTES: pre commit hook is created by running npm install

import gulp, { task, src, dest, watch, parallel } from "gulp";
import gulpSass from "gulp-sass";
import * as dartSass from "sass";
import gitGuppy from "git-guppy";
import gulpFilter from "gulp-filter";
import jshint from "gulp-jshint";
import stylish from "jshint-stylish";
import ts from "gulp-typescript";

const sass = gulpSass(dartSass);
const guppy = gitGuppy(gulp);

task("sass", function (cb) {
  src("src/styles/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(dest("public/css"));
  cb();
});

task("ts", function (cb) {
  src("src/js/*.ts")
    .pipe(ts({ noImplicitAny: true, target: "ES6" }))
    .pipe(dest("public/js"));
  cb();
});

task("default", function () {
  watch("src/styles/*.scss", parallel("sass"));
  watch("src/js/*.ts", parallel("ts"));
});

task("pre-commit", () => {
  return guppy.src("pre-commit", async (files, cb) => {
    const filter = gulpFilter(["*.js$"], { restore: true });
    const glob = files.length ? files : ["*.js", "utils/*.js"];
    src(glob)
      .pipe(filter)
      .pipe(jshint())
      .pipe(jshint.reporter(stylish))
      .pipe(jshint.reporter("fail"))
      .pipe(filter.restore)
      .pipe(dest("."));
    cb();
  });
});
