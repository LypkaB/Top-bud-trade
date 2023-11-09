const {src, dest, watch, parallel, series} = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const concatCSS = require('gulp-concat-css');
/*const compressCSS  = require('gulp-csso');*/
const browserSync = require('browser-sync').create();
const autoprefixerOptions = {
    overrideBrowserslist: ['last 3 versions', 'ie >= 10'],
    cascade: false,
}
const stylesPaths = {
    mainScss: '../assets/scss/main.scss',
    mainCss: 'main.css',
    deliveryScss: '../assets/scss/delivery.scss',
    deliveryCss: 'delivery.css',
    returnsScss: '../assets/scss/returns.scss',
    returnsCss: 'returns.css',
}
const funcArr = [compileStylesMain, compileStylesDelivery, compileStylesReturns];

function compileStylesMain() {
    return src(stylesPaths.mainScss)
        .pipe(scss().on('error', scss.logError))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(concatCSS(stylesPaths.mainCss))
        /*.pipe(compressCSS())*/
        .pipe(dest('../assets/css/'))
        .pipe(browserSync.stream());
}

function compileStylesDelivery() {
    return src(stylesPaths.deliveryScss)
        .pipe(scss().on('error', scss.logError))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(concatCSS(stylesPaths.deliveryCss))
        /*.pipe(compressCSS())*/
        .pipe(dest('../assets/css/'))
        .pipe(browserSync.stream());
}

function compileStylesReturns() {
    return src(stylesPaths.returnsScss)
        .pipe(scss().on('error', scss.logError))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(concatCSS(stylesPaths.returnsCss))
        /*.pipe(compressCSS())*/
        .pipe(dest('../assets/css/'))
        .pipe(browserSync.stream());
}

function watching() {
    watch(['../*.html']).on('change', browserSync.reload)
    watch(['../assets/scss/**/*.scss'], series(funcArr))
    watch(['../assets/js/**/*.js']).on('change', browserSync.reload)
}

function sync() {
    browserSync.init({
        server: {
            baseDir: '../'
        }
    });
}

exports.default = parallel(series(funcArr), watching, sync);
