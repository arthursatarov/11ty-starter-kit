/* ====================================
 * Plugins
 * ================================= */

const { src, dest, parallel, series, watch } = require('gulp');
const newer = require('gulp-newer');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const uglify = require('gulp-uglify');
const webpack = require('webpack-stream');

/* ====================================
 * Paths
 * ================================= */

const srcFolder = './src/';
const distFolder = './dist/';

const path = {
  src: {
    styles: srcFolder + 'assets/styles/styles.css',
    scripts: srcFolder + 'assets/scripts/index.js',
    images: srcFolder + 'assets/images/**/*.{jpg,png,svg,gif,webp}',
    fonts: srcFolder + 'assets/fonts/**/*.{ttf,eof,woff,woff2}',
  },
  dist: {
    styles: distFolder + 'styles/',
    scripts: distFolder + 'scripts/',
    images: distFolder + 'images/',
    fonts: distFolder + 'fonts/',
  },
  watch: {
    styles: srcFolder + 'assets/styles/**/*.css',
    scripts: srcFolder + 'assets/scripts/**/*.js',
    images: srcFolder + 'assets/images/**/*.{jpg,png,svg,gif,webp}',
    fonts: srcFolder + 'assets/fonts/**/*.{ttf,eof,woff,woff2}',
  },
};

/* ====================================
 * Tasks
 * ================================= */

// Styles
const styles = () => {
  let postcssConfig = [
    require('postcss-import'),
    require('postcss-sort-media-queries'),
    require('postcss-csso'),
  ];

  return src(path.src.styles)
    .pipe(plumber())
    .pipe(postcss(postcssConfig))
    .pipe(dest(path.dist.styles));
};

// Scripts
const scripts = () => {
  let webpackConfig = {
    mode: 'development',
    output: { filename: 'scripts.js' },
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /(node_modules)/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      ],
    },
  };

  return src(path.src.scripts)
    .pipe(plumber())
    .pipe(webpack(webpackConfig))
    .pipe(uglify())
    .pipe(dest(path.dist.scripts));
};

// Fonts
const fonts = () => {
  return src(path.src.fonts)
    .pipe(plumber())
    .pipe(newer(path.dist.fonts))
    .pipe(dest(path.dist.fonts));
};

// images
const images = () => {
  return src(path.src.images)
    .pipe(plumber())
    .pipe(newer(path.dist.images))
    .pipe(dest(path.dist.images));
};

// Watch
const watchFiles = () => {
  watch([path.watch.styles], styles);
  watch([path.watch.scripts], scripts);
  watch([path.watch.images], images);
  watch([path.watch.fonts], fonts);
};

exports.default = series(
  parallel(
    styles,
    scripts,
    fonts,
    images
  ),
  watchFiles
);

exports.build = parallel(
  styles,
  scripts,
  fonts,
  images
);
