// NOTES: pre commit hook is created by running npm install

import { task, src, dest, watch, parallel, series } from "gulp";
import { deleteAsync } from "del";
import gulpSass from "gulp-sass";
import * as dartSass from "sass";
import exec from "gulp-exec";
import nodemon from "gulp-nodemon";

const sass = gulpSass(dartSass);
const execOptions = {
  continueOnError: false, // default = false, true means don't emit error event
  pipeStdout: false, // default = false, true means stdout is written to file.contents
};
const execReportOptions = {
  err: true, // default = true, false means don't write err
  stderr: true, // default = true, false means don't write stderr
  stdout: true, // default = true, false means don't write stdout
};

/**
 * Builds Sass files into CSS files.
 */
const sassTask = (cb) => {
  src("src/public/src/sass/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(dest("src/public/css"));
  cb();
};

/**
 * Transpiles TypeScript into JavaScript.
 */
const tsTask = (cb) => {
  src(".")
    .pipe(exec(() => "tsc -p .", execOptions))
    .pipe(exec.reporter(execReportOptions));
  cb();
};

/**
 * Cleans build files.
 */
const clean = () => {
  return deleteAsync(["src/public/css/*", "src/public/js/*"]);
};

/**
 * Starts server in development mode and runs watch task.
 */
const startDev = () => {
  let nodemonOptions = {
    script: "src/index.js",
    ext: "js",
    env: { NODE_ENV: "development" },
    verbose: false,
    ignore: [],
    watch: [
      "src/index.js",
      "src/**/*.js",
      "!node_modules/**",
      "!src/public/**",
      "!gulpfile.js",
    ],
  };

  nodemon(nodemonOptions).on("restart", function () {
    console.log("restarted!");
  });
};

/**
 * Watches for changes and runs TypeScript / Sass tasks
 */
const watchTask = () => {
  watch("src/public/src/typescript/*.ts", parallel(tsTask));
  watch("src/public/src/sass/*", parallel(sassTask));
};

// import gitGuppy from "git-guppy";
// import gulpFilter from "gulp-filter";
// import jshint from "gulp-jshint";
// import stylish from "jshint-stylish";
// const guppy = gitGuppy(gulp);
// task("pre-commit", () => {
//   return guppy.src("pre-commit", async (files, cb) => {
//     const filter = gulpFilter(["*.js$"], { restore: true });
//     const glob = files.length
//       ? files
//       : ["*.js", "!*src/public/js", "!*node_modules"];
//     src(glob)
//       .pipe(filter)
//       .pipe(jshint())
//       .pipe(jshint.reporter(stylish))
//       .pipe(jshint.reporter("fail"));
//     cb();
//   });
// });

task("start-dev", parallel(startDev, watchTask));
task("watch", watchTask);
task("sass", sassTask);
task("ts", tsTask);
task("clean", clean);
task("build", series(clean, parallel(sassTask, tsTask)));
