require('dotenv').load();

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    webserver = require('gulp-webserver'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat-sourcemap'),
    rename = require("gulp-rename"),
    minifyCss = require('gulp-minify-css'),
    gutil = require('gulp-util'),
    sass = require("gulp-ruby-sass"),
    compass = require('gulp-compass'),
    sourcemaps = require('gulp-sourcemaps'),
    browserify = require('gulp-browserify'),
    livereload = require('gulp-livereload'),
    replace = require('gulp-replace'),
    s3 = require("gulp-s3"),
    deploy = require('gulp-deploy-ftp'),
    ftp = require('gulp-ftp'),
    changed = require('gulp-changed'),
    fs = require('fs');
    
var html_src = ['app/*.html'];
var sass_src = ['app/dev/sass/'];
var css_src = ['app/prod/css/'];
var js_src = ['app/prod/js'];

var all_js = ['app/dev/js/*.js'];
var all_sass = ['app/dev/sass/*'];
var all_css = ['app/prod/css/*.css'];
var all_html = ['app/*.html'];

var amazon_aws = ['app/prod/**'];

// ============= Main Site ============= //
// ***
// ***
// ***
// ***
// ***
// ***
// ***

    gulp.task('prod', function() {
        gulp.src('app/index.html')
            .pipe(replace('"prod/', '"'))
            .pipe(gulp.dest('app/prod/'));
    });
    
    //Final Deployment - Not needed anymore 
    /*
     
    var options = {
      port: '21',
      host: 'alexisphanor.com',
      uploadPath: '/'
    };
    
    gulp.task('push', ['prod'], function() { 
        gutil.log(gutil.colors.cyan('Deploying to prod...'));
        setTimeout(function() {
            return gulp.src('app/prod/**')
                .pipe(ftp({
                    host: 'alexisphanor.com'
                }))
                .pipe(gutil.noop());
        }, 800)
    });
    
    */
    
    //Amazon S3 configuration
    gulp.task('aws', ['prod'], function() { 
        aws = JSON.parse(fs.readFileSync('./aws.json'));
        gutil.log(gutil.colors.cyan('Starting Upload...'));
        setTimeout(function() {
            gulp.src(amazon_aws)
                .pipe(changed('/**', {hasChanged: changed.compareSha1Digest}))
                .pipe(s3(aws).on('error', gutil.log));
        }, 800)
    });
     
    // Sass & CSS configuration
    gulp.task('sass', function () {
        return sass('app/dev/sass/', {style: 'compressed', sourcemap: false})
            .on('error', function (err) {
                console.error('Error!', err.message);
            })
            .pipe(concat('all.css'))
            .pipe(rename({
                extname: '.min.css'
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
        //livereload.listen();
        gulp.watch('app/dev/js/**/*', ['compress']).on('change', function(file) { //livereload.changed(file.path);
            gutil.log(gutil.colors.yellow('JS changed' + ' (' + file.path + ')'));
        });
        
        /*gulp.watch(all_css, ['css']).on('change', function(file) { //livereload.changed(file.path);
            gutil.log(gutil.colors.yellow('CSS changed' + ' (' + file.path + ')'));
        });*/
        
        gulp.watch(['app/*.html','app/dev/views/*.html'], ['html']).on('change', function(file) { //livereload.changed(file.path);
            gutil.log(gutil.colors.cyan('HTML changed' + ' (' + file.path + ')'));
        });
        
        gulp.watch(all_sass, ['sass']).on('change', function(file) { //livereload.changed(file.path);
            gutil.log(gutil.colors.grey('SASS changed' + ' (' + file.path + ')'));
        });
    });
    
    // Webserver
    gulp.task('webserver', ['sass'], function() {
        gulp.src('app/')
        .pipe(webserver({
        	livereload: true,
        	open: true
        }));
    });
    
    // Set of tasks
    gulp.task('default', ['compress', 'watch', 'html', 'js', 'webserver']);

// ***
// ***
// ***
// ***
// ***
// ***
// ***
// ============= End - Main Site ============= //


// ============= BV API APP ============= //
// ***
// ***
// ***
// ***
// ***
// ***
// ***

    // Sass & CSS configuration
    gulp.task('mini-sass', function () {
        return sass('app/bvapp/sass/', {style: 'compressed', sourcemap: false})
            .on('error', function (err) {
                console.error('Error!', err.message);
            })
            .pipe(concat('style.css'))
            .pipe(rename({
                extname: '.min.css'
            }))
            .pipe(gulp.dest('app/bvapp/css/'));
    });
    
    // Uglify configuration 
    gulp.task('minify', function() {
        return gulp.src(['app/bvapp/js/*.js', '!app/bvapp/js/*.min.js'])
        .pipe(uglify().on('error', gutil.log))
        .pipe(concat('all.js'))
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('app/bvapp/js'));
    });
    
    gulp.task('htm', function() {
        gulp.src('app/bvapp/*.html')
    });
    
    // Watch task
    gulp.task('check', function() {
        //livereload.listen();
        gulp.watch('app/bvapp/js/**/*', ['minify']).on('change', function(file) { //livereload.changed(file.path);
            gutil.log(gutil.colors.yellow('JS has been updated' + ' (' + file.path + ')'));
        });
        
        gulp.watch(['app/bvapp/*.html'], ['htm']).on('change', function(file) { //livereload.changed(file.path);
            gutil.log(gutil.colors.cyan('HTML has been updated' + ' (' + file.path + ')'));
        });
        
        gulp.watch(['app/bvapp/sass/**/*'], ['mini-sass']).on('change', function(file) { //livereload.changed(file.path);
            gutil.log(gutil.colors.grey('SASS has been updated' + ' (' + file.path + ')'));
        });
    });
    
    // Webserver
    gulp.task('server', ['mini-sass'], function() {
        gulp.src('app/bvapp/')
        .pipe(webserver({
        	livereload: true,
        	open: true
        }));
    });
    
    gulp.task('bvapi', ['minify', 'mini-sass' , 'check', 'server']);

// ***
// ***
// ***
// ***
// ***
// ***
// ***
// ============= End - BV API APP ============= //