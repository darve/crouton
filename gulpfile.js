
'use strict';

var gulp            = require('gulp'),
    bro             = require('gulp-bro'),
    gulpif          = require('gulp-if'),
    babelify        = require('babelify'),
    sass            = require('gulp-sass'),
    uglify          = require('gulp-uglify'),
    jshint          = require('gulp-jshint'),
    rename          = require('gulp-rename'),
    mincss          = require('gulp-minify-css'),
    sourcemaps      = require('gulp-sourcemaps'),
    autoprefixer    = require('gulp-autoprefixer'),
    argv            = require('yargs').argv,
    run             = require('gulp-run'),
    template        = require('gulp-template-compile'),
    concat          = require('gulp-concat');

gulp.task('views', function () {

    return gulp.src('./views/**/*.html')
        .pipe(template({
            name: function(file) {
                return file.relative.split('.')[0];
            },
            namespace: 'croutonviews',
            templateSettings: {
                interpolate: /{{([\s\S]+?)}}/g
            }
        }))
        .pipe(concat('views.js'))
        .pipe(gulpif(argv.production, uglify()))
        .pipe(gulp.dest('../public/js'));
});


/**
 * Bundle and minify all of the source script files
 */
gulp.task('scripts', function () {

    return gulp.src('./app.js')
        .pipe(bro({ transform: [ babelify.configure({ presets: ['es2015'] }) ] }))
        .pipe(rename('crouton.js'))
        .pipe(gulpif(argv.production, uglify()))
        .pipe(gulp.dest('./public/js'));

});


/**
 * This task is used to verify that I am not taking crazy pills
 * and that my javascript is in fact perfectly formed.
 */
gulp.task('jshint', function() {
    return gulp.src('./**/*.js')
        .pipe(jshint(require('./config/jshint.js')))
        .pipe(jshint.reporter('default'))
});


/**
 * This task compiles, nay transforms my sass into a hard
 * shiny peg of truth (CSS). Compiles scss files for dev.
 * Minifies if this task is run with the production argument.
 */
gulp.task('sass', function() {

    return gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulpif(argv.production, mincss()))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('concat', ['views', 'scripts'], function() {
    return gulp.src(['../server/public/js/views.js', '../server/public/js/bagel.js'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('../server/public/js'));
});

/**
 * This task is used to lint and minify everything and stick
 * it in a folder called 'prod'.
 */
gulp.task('build', ['views', 'sass', 'scripts', 'concat']);


/**
 *  Watch our source files and trigger a build when they change
 */
gulp.task('watch', function() {

    gulp.watch([
        './app.js', 
        './modules/**/*.js',
        './components/**/*.js',
        './modules/**/*.js',
        './scss/**',
        './views/**'
    ], ['build']);
});
