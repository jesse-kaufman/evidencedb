// NOTES: pre commit hook is created by running npm install

import { task, src, dest, watch, parallel, series } from "gulp";
import { deleteAsync } from "del";
import gulpSass from "gulp-sass";
import * as dartSass from "sass";
import exec from "gulp-exec";
import nodemon from "gulp-nodemon";
import { writeFile } from "fs";
import randomString from "randomstring";
const sass = gulpSass(dartSass);

/**
 * Configuration objects for gulp-exec
 */
const execOptions = {
  continueOnError: false, // Default = false, true means don't emit error event
  pipeStdout: false, // Default = false, true means stdout is written to file.contents
};
const execReportOptions = {
  err: true, // Default = true, false means don't write err
  stderr: true, // Default = true, false means don't write stderr
  stdout: true, // Default = true, false means don't write stdout
};

/**
 * Updates the version strings to use at the end of JS and CSS files
 */
const updateVersionStringsTask = async (cb) => {
  const versionStringData = {
    js: randomString.generate(5),
    css: randomString.generate(5),
  };

  const versionString = `export default ${JSON.stringify(versionStringData)};`;

  writeFile("build/versions.js", versionString, (err) => {
    if (err) {
      console.error(err.toString());
    } else {
      console.log("Version strings updated successfully.");
    }
  });

  cb();
};

/**
 * Builds Sass files into CSS files.
 */
const buildSassTask = async (cb) => {
  src("src/public/styles/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(dest("build/public/css"));
  cb();
};

/**
 * Transpiles TypeScript into JavaScript.
 */
const buildTypeScriptTask = async (cb) => {
  src(".")
    .pipe(exec(() => "tsc -p .", execOptions))
    .pipe(exec.reporter(execReportOptions));
  cb();
};

/**
 * Cleans build files.
 */
const clean = async () => {
  return await deleteAsync(["build/*"]);
};

/**
 * Starts server in development mode and runs watch task.
 */
const startDev = async () => {
  const nodemonOptions = {
    script: "src/index.js",
    ext: "js",
    env: { NODE_ENV: "development" },
    verbose: false,
    ignore: [],
    watch: [
      "src/index.js",
      "src/**/*.js",
      "src/views/**/*.pug",
      "!node_modules/**",
      "!src/public/**",
      "!gulpfile.js",
    ],
  };

  nodemon(nodemonOptions).on("restart", async () => {
    console.log("restarted!");
  });
};

/**
 * Watches for changes and runs TypeScript / Sass tasks
 */
const watchTask = () => {
  watch(
    "src/public/scripts/*.ts",
    parallel(buildTypeScriptTask, updateVersionStringsTask)
  );
  watch(
    "src/public/styles/**/*.scss",
    parallel(buildSassTask, updateVersionStringsTask)
  );
};

//
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

task("update-version", updateVersionStringsTask);
task("start-dev", parallel(startDev, watchTask));
task("watch", watchTask);
task("sass", buildSassTask);
task("ts", buildTypeScriptTask);
task("clean", clean);
task(
  "build",
  series(
    clean,
    parallel(updateVersionStringsTask, buildSassTask, buildTypeScriptTask)
  )
);
