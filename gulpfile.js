var gulp = require('gulp'),
    concatCss = require('gulp-concat-css'),
    minifyCSS = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    prefix = require('gulp-autoprefixer'), 
    connect = require('gulp-connect');


gulp.task('connect', function(){
    return connect.server({
        root:'./build',
        livereload:true
    });
});

gulp.task('html', function () {
    return gulp.src('./b-component-comments/index.html')
        .pipe(connect.reload())
        .pipe(gulp.dest('./build/'))
});

gulp.task('script', function() {
    return gulp.src([
        './b-component-comments/b-button/*.js',
        './b-component-comments/b-form-comment/*.js',
        './b-component-comments/b-form-replay/*.js',
        './b-component-comments/b-replay/*.js',
        './b-component-comments/b-comment/*.js',
        './b-component-comments/b-comments/*.js'])
        .pipe(concat('script.min.js'))
        .pipe(gulp.dest('./build/'))
        .pipe(connect.reload());
});


gulp.task('icon', function() {
    return gulp.src(['./b-component-comments/n-icon/*.png'])
        .pipe(gulp.dest('./build/icon/'))
});


gulp.task('style', ['icon'], function () {
    return gulp.src('./b-component-comments/**/*.css')
        .pipe(concatCss("style.min.css"))
        .pipe(prefix({ browsers: ['last 10 versions'],
            cascade: false
        }))
        .pipe(minifyCSS("style.min.css"))
        .pipe(gulp.dest('./build/'))
        .pipe(connect.reload())
});

gulp.task('watch', ['connect', 'style', 'html', 'script'], function() {
    gulp.watch('./b-component-comments/**/*.css', ['style']);
    gulp.watch('./b-component-comments/*.html', ['html']);
    gulp.watch('./b-component-comments/**/*.js', ['script']);
});


gulp.task('default', ['watch']);


