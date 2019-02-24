const { src, dest, parallel } = require('gulp');
const stylus = require('gulp-stylus');
const minify = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const inject = require('gulp-inject-string');

const inputFile = './src/grid.styl';
const outputFileName = 'flexbox-grid';

function common() {
  return src(inputFile)
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      })
    )
    .pipe(rename({ basename: outputFileName }))
    .pipe(sourcemaps.write('.'))
    .pipe(
      inject.prepend(
        `/* Generated with https://github.com/musewick/stylus-flexbox-grid */\n\n`
      )
    )
    .pipe(dest('dist'));
}

function minified() {
  return src(inputFile)
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      })
    )
    .pipe(
      minify({ debug: true, compatibility: '*' }, details => {
        console.log(
          '\x1b[33m%s\x1b[0m',
          `\nOriginal: ${details.stats.originalSize / 1000}KB`
        );
        console.log(
          '\x1b[32m%s\x1b[0m',
          `Minified: ${details.stats.minifiedSize / 1000}KB`
        );
        console.log(
          `Difference: ${(details.stats.originalSize -
            details.stats.minifiedSize) /
            1000}KB\n`
        );
      })
    )
    .pipe(rename({ basename: outputFileName, suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(
      inject.prepend(
        `/* Generated with https://github.com/musewick/stylus-flexbox-grid */`
      )
    )
    .pipe(dest('dist'));
}

exports.default = parallel(common, minified);
