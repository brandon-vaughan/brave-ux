/**
 *
 * @file Brave UX App Gulp build system
 *
 */

import gulp from 'gulp';
import browserSync from 'browser-sync';
import babel from 'gulp-babel';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';

const src = 'app'
const dest = 'dist';
const reload = browserSync.reload;

// Compile styles and autoprefix
gulp.task('styles', () => {
  return gulp.src([src + '/styles/**/*.scss'])
             .pipe(sass()).on('error', sass.logError)
             .pipe(autoprefixer(['ie >= 9']))
             .pipe(gulp.dest('.tmp/styles'))
             .pipe(gulp.dest(dest + '/styles'))
});

// Compile scripts
gulp.task('scripts', () => {
  return gulp.src([src + '/scripts/**/*.js'])
             .pipe(babel())
             .pipe(gulp.dest('.tmp/scripts'))
             .pipe(gulp.dest(dest + '/scripts'))
})

// Copy files for build
gulp.task('copy', () => {

});

// Watch files for changes & reload
gulp.task('default', ['styles', 'scripts'], () => {
  browserSync({
    notify: false,
    logPrefix: 'BUA',
    server: ['.tmp', src]
  });

  gulp.watch(['app/**/*.html'], reload);
  gulp.watch(['app/styles/**/*.{scss,css}'], ['styles', reload]);
  gulp.watch(['app/scripts/**/*.js'], ['scripts', reload]);
  gulp.watch(['app/images/**/*'], reload);
});
