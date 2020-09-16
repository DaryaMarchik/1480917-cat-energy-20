const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require("csso");
const rename = require("gulp-rename");
const del = require("del");
const imagemin = require("gulp-imagemin");

// Styles

const styles = () => {
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

exports.styles = styles;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html").on("change", sync.reload);
}

exports.default = gulp.series(
  styles, server, watcher
);

//Copy

const copy = () => {
  return gulp.src([
    "source/*.html",
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
};

exports.copy = copy;

//Clean

const clean = () => {
  return del("build");
};

exports.clean = clean;

//Images
const images = () => {
  return gulp.src("build/img/**/*.{jpg,png,svg}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3 }),
    imagemin.mozjpeg({progressive:true}),
    imagemin.svgo()
  ]))
}

exports.images = images;
//Build

const build = gulp.series(
  "clean",
  "copy",
  "styles",
  "images"
);

exports.build = build;
