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
    browserify = require('gulp-browserify'),
    livereload = require('gulp-livereload'),
    fs = require('fs');
    
var html_src = ['app/*.html'];
var sass_src = ['app/dev/sass/'];
var css_src = ['app/prod/css/'];
var js_src = ['app/prod/js'];

var all_js =['app/dev/js/*.js'];
var all_sass = ['app/dev/sass/*'];
var all_css = ['app/prod/css/*.css'];
var all_html = ['app/*.html'];

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
    return gulp.src(['app/dev/js/*.js', '!app/dev/js/*.min.js', '!app/dev/sass/jquery.onepage-scroll.js'])
    .pipe(uglify().on('error', gutil.log))
    .pipe(concat('all.js'))
    .pipe(rename({
        extname: '.min.js'
    }))
    .pipe(gulp.dest('app/prod/js'));
});

// Watch items
gulp.task('js', function() {
    gulp.src(all_js)
});

gulp.task('html', function() {
    gulp.src(all_html)
});

gulp.task('css', function() {
    gulp.src(all_css)
});

// Watch task
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('app/dev/js/**/*', ['compress']).on('change', function(file) { livereload.changed(file.path);
        gutil.log(gutil.colors.yellow('JS changed' + ' (' + file.path + ')'));
    });
    
    gulp.watch(all_css, ['css']).on('change', function(file) { livereload.changed(file.path);
        gutil.log(gutil.colors.yellow('CSS changed' + ' (' + file.path + ')'));
    });
    
    gulp.watch(['app/*.html','app/dev/views/*.html'], ['html']).on('change', function(file) { livereload.changed(file.path);
        gutil.log(gutil.colors.cyan('HTML changed' + ' (' + file.path + ')'));
    });
    
    gulp.watch(all_sass, ['sass']).on('change', function(file) { livereload.changed(file.path);
        gutil.log(gutil.colors.grey('SASS changed' + ' (' + file.path + ')'));
    });
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