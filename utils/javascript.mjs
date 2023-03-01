/* eslint-disable jsdoc/require-returns */
import eslint from "gulp-eslint-new";
import gulp from "gulp";
import gulpIf from "gulp-if";
import mergeStream from "merge-stream";
import nodeResolve from "@rollup/plugin-node-resolve";
import { rollup } from "rollup";
import yargs from "yargs";


/**
 * Parsed arguments passed in through the command line.
 * @type {object}
 */
const parsedArgs = yargs(process.argv).argv;

/**
 * Paths of javascript files that should be linted.
 * @type {string[]}
 */
// const LINTING_PATHS = ["./castles_crusades.mjs", "./module/"];
const LINTING_PATHS = ["./module/"];

/**
 * Compile javascript source files into a single output file.
 *
 * - `gulp buildJS` - Compile all javascript files into into single file & build source maps.
 */
async function compileJavascript() {
  const bundle = await rollup({
    input: "./castles_crusades.mjs",
    plugins: [nodeResolve()]
  });
  await bundle.write({
    file: "./castles_crusades-compiled.mjs",
    format: "es",
    sourcemap: true,
    sourcemapFile: "castles_crusades.mjs"
  });
}
export const compile = compileJavascript;


/**
 * Lint javascript sources and optionally applies fixes.
 *
 * - `gulp lint` - Lint all javascript files.
 * - `gulp lint --fix` - Lint and apply available fixes automatically.
 */
function lintJavascript() {
  const applyFixes = !!parsedArgs.fix;
  const tasks = LINTING_PATHS.map(path => {
    const src = path.endsWith("/") ? `${path}**/*.mjs` : path;
    const dest = path.endsWith("/") ? path : `${path.split("/").slice(0, -1).join("/")}/`;
    return gulp
      .src(src)
      .pipe(eslint({ fix: applyFixes }))
      .pipe(eslint.format())
      .pipe(eslint.failAfterError())
      .pipe(gulpIf(file => file.eslint != null && file.eslint.fixed, gulp.dest(dest)));
  });
  return mergeStream(tasks);
}
export const lint = lintJavascript;
