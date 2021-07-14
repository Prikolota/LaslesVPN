const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const gcmq = require('gulp-group-css-media-queries');
const sassGlob = require('gulp-sass-glob');
const pug = require('gulp-pug');
const del = require('del');

// Таск для сборки gulp-файлов
gulp.task('pug', function(cb) {
    return gulp.src('./src/pug/pages/**/*.pug')
        .pipe(plumber({
            errorhandler: notify.onError(function (err) {
                return {
                    title: 'Pug',
                    sound: false,
                    message: err.message
                }
            })
        }))
        .pipe(pug({
            pretty: true
        }) )
        .pipe(gulp.dest('./build/'))
        .pipe(browserSync.stream())
        cb();
});

// Таск для компиляции scss в css
gulp.task('scss', function (cb) {
    return gulp.src('./src/scss/main.scss')
        .pipe(plumber({
            errorhandler: notify.onError(function (err) {
                return {
                    title: 'Styles',
                    sound: false,
                    message: err.message
                }
            })
        }))
        .pipe(sourcemaps.init())
        .pipe(sassGlob())
        .pipe(sass({
            indentType: 'tab',
            indentWidth: 1,
            outputStyle: 'expanded'
        })
        )
        .pipe(gcmq())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 4 versions']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/css/'))
        .pipe(browserSync.stream())
    cb();
})

// Копирование изображений
gulp.task('copy:img', function(cb) {
    return gulp.src('./src/img/**/*')
    .pipe(gulp.dest('./build/img/'))
    cb();
})

// Копирование скриптов
gulp.task('copy:js', function(cb) {
    return gulp.src('./src/js/**/*')
    .pipe(gulp.dest('./build/js/'))
    cb();
})

gulp.task('watch', function () {

    // Слежение за картинками и скриптами и обновлением браузера
    watch( ['./build/js/**/*.*', './build/img/**/*.*'], gulp.parallel(browserSync.reload) );
  
    // Слежение за SCSS и компиляция в CSS
    watch('./src/scss/**/*.scss', gulp.parallel('scss'));

    // Слежение за Pug и сборка страниц и шаблонов
    watch('./src/pug/**/*.pug', gulp.parallel('pug'))

    // Слежение за картинками и скриптами и копирование их в папку build
    watch('./src/img/**/*.*', gulp.parallel('copy:img'))
    watch('./src/js/**/*.*', gulp.parallel('copy:js'))
});

// Задача для старта сервера 
gulp.task('server', function () {
    browserSync.init({
        server: {
            baseDir: "./build/"
        }
    });
});

gulp.task('clean:build', function() {
    return del('./build')
})

gulp.task(
    'default', 
    gulp.series(
        gulp.parallel('clean:build'),
        gulp.parallel('scss', 'pug', 'copy:img', 'copy:js'),
        gulp.parallel('server', 'watch') 
        )
    );