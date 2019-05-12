var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var babel = require("gulp-babel");
var plumber = require("gulp-plumber");

var paths = {
  src: ['./www/js/*.js'],
  sass: ['./scss/**/*.scss']
};

gulp.task('default', [ 'babel', 'sass', 'watch']);

gulp.task("babel", function () {
  return gulp.src(paths.src)
    .pipe(plumber())
    .pipe(babel({presets: ['@babel/preset-env']}))
    .pipe(gulp.dest("www/js/es5/"));
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(cleanCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', ['babel', 'sass'], function() {
  gulp.watch(paths.src, ['babel']);
  gulp.watch(paths.sass, ['sass']);
});
