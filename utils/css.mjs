/* eslint-disable jsdoc/require-returns */
import gulp from "gulp";
import less from "gulp-less";


const LESS_DEST = "./";
const LESS_SRC = "less/castles_crusades.less";
const LESS_WATCH = ["less/*.less"];


/**
 * Compile the LESS sources into a single CSS file.
 */
function compileLESS() {
  return gulp.src(LESS_SRC)
    .pipe(less())
    .pipe(gulp.dest(LESS_DEST));
}
export const compile = compileLESS;


/**
 * Update the CSS if any of the LESS sources are modified.
 */
export function watchUpdates() {
  gulp.watch(LESS_WATCH, compile);
}
