var gulp = require('gulp'),
    gutil = require('gulp-util'),
    webserver = require('gulp-webserver'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat-sourcemap'),
    rename = require("gulp-rename"),
    minifyCss = require('gulp-minify-css'),
    gutil = require('gulp-util'),
    sass = require("gulp-ruby-sass"),
    sourcemaps = require('gulp-sourcemaps'),
    fs = require('fs');

// Sass & CSS configuration
gulp.task('sass', function () {
    return sass('app/dev/sass/', {style: 'compressed', sourcemap: true})
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(sourcemaps.write({
            includeContent: false,
            sourceRoot: function(file) {
                return 'app/dev/sass/';
            }
        }))
        .pipe(gulp.dest('app/prod/css/'));
});

// Uglify configuration 
gulp.task('compress', function() {
    return gulp.src(['app/dev/js/*.js', '!app/dev/js/*.min.js'])
    .pipe(uglify().on('error', gutil.log))
    .pipe(concat('all.js'))
    .pipe(rename({
        extname: '.min.js'
    }))
    .pipe(gulp.dest('app/prod/js'));
});

// Watch items
gulp.task('js', function() {
    gulp.src('app/dev/js/*.js')
});

gulp.task('html', function() {
    gulp.src('*.html')
});

gulp.task('css', function() {
    gulp.src('app/prod/css/*.css')
});

// Watch task
gulp.task('watch', function() {
    gulp.watch('app/dev/js/**/*', ['js']);
    gulp.watch('app/prod/css/*.css', ['css']);
    gulp.watch(['app/*.html',
    'app/dev/views/*.html'], ['html']);
});

// Webserver
gulp.task('webserver', function() {
    gulp.src('app/')
    .pipe(webserver({
    	livereload: true,
    	open: true
    }));
});

// Set of tasks
gulp.task('default', ['sass','compress', 'watch', 'html', 'js', 'css', 'webserver']);