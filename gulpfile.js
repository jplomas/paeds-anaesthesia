const { src, dest, parallel } = require('gulp');
// const pug = require('gulp-pug');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');

function html() {
  return src('src/*.html')
    .pipe(dest('build'))
}

function css() {
  return src('src/styles/*.scss')
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(dest('build/styles'))
}

function js() {
  return src('src/scripts/*.js', { sourcemaps: true })
    .pipe(concat('main.js'))
    .pipe(dest('build/scripts', { sourcemaps: true }))
}

function assets() {
  return src(['src/edit.svg',
             'src/*.png',
             'src/browserconfig.xml',
             'src/*.ico',
             'src/manifest.json',
             'src/pwabuilder-sw.js'])
    .pipe(dest('build'))
}

function mathjs() {
  return src('node_modules/mathjs/dist/math.min.js').pipe((dest('build/scripts')))
}

function bootstrap() {
  return src('node_modules/bootstrap/dist/js/bootstrap.min.js').pipe((dest('build/scripts')))
}

function jquery() {
  return src('node_modules/jquery/dist/jquery.min.js').pipe((dest('build/scripts')))
}

exports.js = js;
exports.css = css;
exports.html = html;
exports.assets = assets;
exports.mathjs = mathjs;
exports.default = parallel(html, css, js, assets, mathjs, bootstrap, jquery);