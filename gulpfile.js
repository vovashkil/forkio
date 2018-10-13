'use strict'

var gulp = require('gulp')
var minify = require('gulp-uglify')
var browserSync = require('browser-sync').create()
var sass = require('gulp-sass')
var clean = require('gulp-clean')
var concat = require('gulp-concat')
var rename = require('gulp-rename')
var imagemin = require('gulp-imagemin')
var eslint = require('gulp-eslint')
var sourcemaps = require('gulp-sourcemaps');

gulp.task('lint', () => {
    gulp.src(['**/*.js','!node_modules/**'])
        .pipe(eslint({
            rules: {
                "semi": ["error", "always"],
                "quotes": ["error", "double"]
            },
            globals: [
                'jQuery',
                '$'
            ],
            envs: [
                'browser'
            ]
        }))
        .pipe(eslint.formatEach('compact', process.stderr));
});


gulp.task('img', function(){
    return gulp.src('./src/img/*')
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]
        }))
        .pipe(gulp.dest('./build/img'))
})

gulp.task('minify', function(){
    return gulp.src('./src/js/*.js')
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('./build'))
        .pipe(minify())
        .pipe(rename('bundle.min.js'))
        .pipe(gulp.dest('./build'))
})

gulp.task('clean', function(){
    return gulp.src('./build', {read: false})
        .pipe(clean())
})

gulp.task('serve', ['clean'], function (){
    browserSync.init({
        server: "./build/"
    })
    gulp.src('./src/index.html').pipe(gulp.dest('./build/'));
    gulp.watch('./src/scss/*.scss',['sass']).on('change', browserSync.reload);
    gulp.watch('./src/js/*.js',['minify']).on('change', browserSync.reload);
    gulp.watch('./build/index.html').on('change', browserSync.reload)
})

gulp.task('sass', function(){
    return gulp.src('./src/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/css'))
})



gulp.task('clean', function () {
    return gulp.src('./build', {read: false})
        .pipe(clean())
})



gulp.task('img', function(){
    return gulp.src('./src/img/**/*')
        .pipe(imagemin({
                interlaced: true,
                progressive: true,
                svgoPlugins: [{removeViewBox:false}],
            })
        )
        .pipe(gulp.dest('./build/img'))
})

gulp.task('default', ['serve', 'lint'], function(){
    console.log('=== ALL DONE ===')
})
