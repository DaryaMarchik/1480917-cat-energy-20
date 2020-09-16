const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require('autoprefixer');
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const sync = require("browser-sync").create();
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const htmlmin = require("gulp-htmlmin");
const uglify = require("gulp-uglify");
const del = require("del");

// Styles

const css = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.css = css;

const js = () => {
  return gulp.src("source/js//*.js")
    .pipe(uglify())
    .pipe(gulp.dest("build/js"));
};

exports.js = js;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "build"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

const refresh = (done) => {
  sync.reload();
  done();
}

exports.refresh = refresh;

// Watcher

const watcher = () => {
  gulp.watch("source/js//*.js", gulp.series(js, refresh));
  gulp.watch("source/sass//*.scss", gulp.series(css));
  gulp.watch("source/img/icon-*.svg", gulp.series(sprite, refresh));
  gulp.watch("source/*.html", gulp.series(html, refresh));
}

exports.default = gulp.series(
  css, server, watcher
);

const images = () => {
  return gulp.src("source/img//*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"))
};

exports.images = images;

const webpimages = () => {
  return gulp.src("source/img//*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"))
};

exports.webpimages = webpimages;

const sprite = () => {
  return gulp.src("source/img//icon-*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"))
};

exports.sprite = sprite;

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest("build"));
};

exports.html = html;

const copy = () => {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/*.ico"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
};

exports.copy = copy;

const clean =() => {
  return del("build");
};

exports.clean = clean;

exports.build = gulp.series(clean, copy, css, js, images, webpimages, sprite, html);
exports.start = gulp.series(exports.build, server, watcher);
