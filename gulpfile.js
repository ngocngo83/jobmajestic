'use strict';
const {src, dest, watch, series, parallel} = require('gulp');
const del = require('del');
const cfg = require('config');
const browserSync = require('browser-sync');

const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');

const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');

const rename = require('gulp-rename');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

const htmlmin = require('gulp-htmlmin');
const nunjucks = require('gulp-nunjucks-render');
const spacelessExt = require('nunjucks-tag-spaceless');


function browserStart() {
    browserSync({
        server: {
            baseDir: cfg.get('dist.dir')
        }
    });
}

function browserReload() {
    browserSync.reload();
}

function destroy() {
    return del(cfg.get('dist.*'));
}

function img() {
    return src(cfg.get('src.img.*'))
        .pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
        .pipe(dest(cfg.get('dist.img.dir')))
        .pipe(browserSync.reload({stream: true}));
}

function css() {
    return src(cfg.get('src.css.*'))
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(dest(cfg.get('dist.assets.dir')))
        .pipe(rename({suffix: '.min'}))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(dest(cfg.get('dist.assets.dir')))
        .pipe(browserSync.reload({stream: true}));
}

function plugins3rd() {
    return src('./src/assets/3rd/**/*')
        .pipe(dest('./dist/assets/plugins'));
}

function plugins() {
    return src(cfg.get('src.plugins.*'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        //.pipe(concat('main.js'))
        .pipe(dest(cfg.get('dist.plugins.dir')))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(dest(cfg.get('dist.plugins.dir')))
        .pipe(browserSync.reload({stream: true}));
}

function js() {
    return src(cfg.get('src.js.*'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        //.pipe(concat('main.js'))
        //.pipe(dest(cfg.get('dist.js.dir')))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(dest(cfg.get('dist.js.dir')))
        .pipe(browserSync.reload({stream: true}));
}

function template() {
    return src(cfg.get('src.html.*'))
        .pipe(nunjucks({
            path: [cfg.get('src.html.dir')], // String or Array
            manageEnv: (env) => {
                env.addExtension('spaceless', new spacelessExt());
            }
        }))
        /*
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))*/
        .pipe(dest(cfg.get('dist.dir')))
        .pipe(browserSync.reload({stream: true}));
}

function clean() {
    return del(cfg.get('remove'));
}

exports.destroy = destroy;
exports.img = img;
exports.css = css;
exports.p3rd = plugins3rd;
//exports.js = series(plugins3rd, plugins, js);
exports.js = series(plugins, js);
exports.html = series(template, clean);

exports.build = series(
    clean,
    series(template, clean),
    parallel(
        img,
        css,
        //series(plugins3rd, plugins, js)
        series(plugins, js)
    )
);

exports.default = () => {
    browserStart();
    watch(cfg.get('src.img.*'), img);
    watch(cfg.get('src.html.*'), series(template, clean));
    watch(cfg.get('src.css.*'), css);
    watch(cfg.get('src.plugins.*'), plugins);
    watch(cfg.get('src.js.*'), js);
    watch(cfg.get('dist.*'), browserReload);
};