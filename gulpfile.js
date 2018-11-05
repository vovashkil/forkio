"use strict";

var gulp = require("gulp");
var minify = require("gulp-uglify");
var browserSync = require("browser-sync").create();
var sass = require("gulp-sass");
var clean = require("gulp-clean");
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var eslint = require("gulp-eslint");
var sourcemaps = require("gulp-sourcemaps");
var runSequence = require("run-sequence");

gulp.task("lint", function(){
    gulp.src(["**/*.js","!node_modules/**"])
        .pipe(eslint({
            rules: {
                "semi": ["error", "always"],
                "quotes": ["error", "double"]
            },
            globals: [
                "jQuery",
                "$"
            ],
            envs: [
                "browser"
            ]
        }))
        .pipe(eslint.formatEach("compact", process.stderr));
});


gulp.task("img", function(){
    return gulp.src("./src/img/*")
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]
        }))
        .pipe(gulp.dest("./dist/img"));
});

// gulp.task("minify", function(){
//     return gulp.src("./src/js/*.js")
//         .pipe(concat("bundle.js"))
//         .pipe(gulp.dest("./dist/js"))
//         .pipe(minify())
//         .pipe(rename("bundle.min.js"))
//         .pipe(gulp.dest("./dist/js"));
// });

gulp.task("minify", function(){
    return gulp.src("./src/js/*.js")
        .pipe(concat("bundle.js"))
        .pipe(minify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("./dist/js"));
});


gulp.task("clean", function(){
    return gulp.src("./dist", {read: false})
        .pipe(clean());
});

gulp.task("copyFonts", function(){
    return gulp.src("./src/fonts/**/*")
        .pipe(gulp.dest("./dist/fonts"));
});


gulp.task("serve", function (){
    runSequence("clean", ["sass","minify","copyFonts","img"], function(){
        browserSync.init({
            server: "./dist/"
        });

        gulp.src("./src/index.html").pipe(gulp.dest("./dist/"));
        gulp.watch("./src/scss/*.scss",["sass"]).on("change", browserSync.reload);
        gulp.watch("./src/js/*.js",["minify"]).on("change", browserSync.reload);
        gulp.watch("./src/index.html").on("change", function(){
            return gulp.src("./src/index.html").pipe(gulp.dest("./dist/"));
        });
        gulp.watch("./dist/index.html").on("change", browserSync.reload);
    });
});

gulp.task("sass", function(){
    return gulp.src("./src/scss/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./dist/css"));
});



gulp.task("clean", function () {
    return gulp.src("./dist", {read: false})
        .pipe(clean());
});



gulp.task("img", function(){
    return gulp.src("./src/img/**/*")
        .pipe(imagemin({
                interlaced: true,
                progressive: true,
                svgoPlugins: [{removeViewBox:false}],
            })
        )
        .pipe(gulp.dest("./dist/img"));
});

gulp.task("default", ["serve", "lint"], function(){
    console.log("=== ALL DONE ===");
});
