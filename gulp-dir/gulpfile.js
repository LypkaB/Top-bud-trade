const {src, dest, watch, parallel} = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const concatCSS = require('gulp-concat-css');
/*const compressCSS  = require('gulp-csso');*/
const browserSync = require('browser-sync').create();

function compileStyles() {
    return src('../assets/scss/main.scss')
        .pipe(scss().on('error', scss.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 3 versions', 'ie >= 10'],
            cascade: false
        }))
        .pipe(concatCSS('style.css'))
        /*.pipe(compressCSS())*/
        .pipe(dest('../assets/css/'))
        .pipe(browserSync.stream());
}

function watching() {
    watch(['../*.html']).on('change', browserSync.reload)
    watch(['../assets/scss/**/*.scss'], compileStyles)
    watch(['../assets/js/**/*.js']).on('change', browserSync.reload)
}

function sync() {
    browserSync.init({
        server: {
            baseDir: '../'
        }
    });
}

exports.default = parallel(compileStyles, watching, sync);
