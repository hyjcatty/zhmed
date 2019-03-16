/**
 * Created by hyj on 2016/8/9.
 */
/**
 * Created by hyj on 2016/7/25.
 */
var gulp=require('gulp');

//var jshint = require('gulp-jshint');
//var sass = require('gulp-sass');
//var minifycss = require("gulp-minify-css");
var concat = require('gulp-concat');
//var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var htmlmin = require('gulp-htmlmin');
var mkdirp = require('mkdirp');
var option = {

    buildPath: "../www/zhmed"
    //buildPath: "./dist"
}
var option_html = {
    collapseWhitespace:true,
    collapseBooleanAttributes:true,
    removeComments:true,
    removeEmptyAttributes:true,
    removeStyleLinkTypeAttributes:true,
    minifyJS:true,
    minifyCSS:true
};

/*
 gulp.task('lint', function() {
 gulp.src('./js/*.js')
 .pipe(jshint())
 .pipe(jshint.reporter('default'));
 });*/
gulp.task('clean',function(){
    return gulp.src(option.buildPath,{
        read:false
    }).pipe(clean({force:true}));
})
/*
 gulp.task('sass', function() {
 gulp.src('./scss/*.scss')
 .pipe(sass())
 .pipe(gulp.dest('./css'));
 });*/
gulp.task("resourcecopy",function(){

    gulp.src("./build/bundle.js")
        .pipe(gulp.dest(option.buildPath+"/build/"));/*
     gulp.src("./js/*")
     .pipe(gulp.dest(option.buildPath+"/js/"));
     gulp.src("./css/*")
     .pipe(gulp.dest(option.buildPath+"/css/"));*/
    gulp.src("./*.php")
        .pipe(gulp.dest(option.buildPath+"/"));
    /*
     gulp.src("./*.ico")
     .pipe(gulp.dest(option.buildPath+"/"));*/

    //gulp.src("./build/**/*")
    //    .pipe(gulp.dest(option.buildPath+"/build/"));

    gulp.src("./build/resource/**/*")
        .pipe(gulp.dest(option.buildPath+"/resource/"));
    gulp.src("./resource/js/*")
        .pipe(gulp.dest(option.buildPath+"/resource/js/"));
    gulp.src("./resource/css/*")
        .pipe(gulp.dest(option.buildPath+"/resource/css/"));
    gulp.src("./resource/img/*")
        .pipe(gulp.dest(option.buildPath+"/resource/img/"));
    gulp.src("./resource/image/*")
        .pipe(gulp.dest(option.buildPath+"/resource/image/"));
    gulp.src("./resource/fonts/g*")
        .pipe(gulp.dest(option.buildPath+"/resource/fonts/"));
    gulp.src("./resource/keyboardmaster/**/*")
        .pipe(gulp.dest(option.buildPath+"/resource/keyboardmaster/"));
    gulp.src("./resource/iCheck/**/*")
        .pipe(gulp.dest(option.buildPath+"/resource/iCheck/"));
    gulp.src("./resource/select2/**/*")
        .pipe(gulp.dest(option.buildPath+"/resource/select2/"));
    gulp.src("./resource/switchery/*")
        .pipe(gulp.dest(option.buildPath+"/resource/switchery/"));
    gulp.src("./resource/pnotify/*")
        .pipe(gulp.dest(option.buildPath+"/resource/pnotify/"));
    gulp.src("./resource/colorpicker/**/*")
        .pipe(gulp.dest(option.buildPath+"/resource/colorpicker/"));
    gulp.src("./resource/cropper/*")
        .pipe(gulp.dest(option.buildPath+"/resource/cropper/"));
    mkdirp.sync(option.buildPath+"/upload/");
    gulp.src("./svg/*")
        .pipe(gulp.dest(option.buildPath+"/svg/"));
    gulp.src("./json/**/*")
        .pipe(gulp.dest(option.buildPath+"/json/"));
    gulp.src("./demo/**/*")
        .pipe(gulp.dest(option.buildPath+"/demo/"));
    gulp.src("./sysconf/*")
        .pipe(gulp.dest(option.buildPath+"/sysconf/"));
    //gulp.src("./language/*")
    //    .pipe(gulp.dest(option.buildPath+"/language/"));
    gulp.src("./flag/*")
        .pipe(gulp.dest(option.buildPath+"/flag/"));
    gulp.src("./mqttclient.js")
        .pipe(gulp.dest(option.buildPath+"/"));
    gulp.src("./mqttserver.js")
        .pipe(gulp.dest(option.buildPath+"/"));

    gulp.src("./baseconf/**/*")
        .pipe(gulp.dest(option.buildPath+"/baseconf/"));

    gulp.src("./language/language_en.json")
        .pipe(gulp.dest(option.buildPath+"/language/"))
        .pipe(rename('language_de.json'))
        .pipe(gulp.dest(option.buildPath+"/language/"))
        .pipe(rename('language_ar.json'))
        .pipe(gulp.dest(option.buildPath+"/language/"));
    gulp.src("./language/language_ch.json")
        .pipe(gulp.dest(option.buildPath+"/language/"))
        .pipe(rename('language_th.json'))
        .pipe(gulp.dest(option.buildPath+"/language/"))
        .pipe(rename('language_jp.json'))
        .pipe(gulp.dest(option.buildPath+"/language/"))
        .pipe(rename('language_fr.json'))
        .pipe(gulp.dest(option.buildPath+"/language/"));
    /*
     gulp.src("./*.html")
     .pipe(gulp.dest(option.buildPath+"/"));*/
})


gulp.task('scripts', function() {
    /*
     gulp.src('./js/util.js')
     .pipe(concat('util.js'))
     //.pipe(gulp.dest('./dist/js'))
     .pipe(rename('util.js'))
     .pipe(uglify())
     .pipe(gulp.dest(option.buildPath+'/js/'));
     gulp.src('./js/app.js')
     .pipe(concat('app.js'))
     //.pipe(gulp.dest('./dist/js'))
     .pipe(rename('app.js'))
     .pipe(uglify())
     .pipe(gulp.dest(option.buildPath+'/js/'));
     gulp.src('./js/test.js')
     .pipe(concat('test.js'))
     // .pipe(gulp.dest('./dist/js'))
     .pipe(rename('test.js'))
     .pipe(uglify())
     .pipe(gulp.dest(option.buildPath+'/js/'));


     gulp.src('./test.html')
     .pipe(htmlmin(option_html))
     .pipe(gulp.dest(option.buildPath+'/'));*/
    gulp.src('./index.html')
        .pipe(htmlmin(option_html))
        .pipe(gulp.dest(option.buildPath+'/'));
    gulp.src('./Loading.html')
        .pipe(rename('login.html'))
        .pipe(htmlmin(option_html))
        .pipe(gulp.dest(option.buildPath+'/'));
});

gulp.task('default',['clean'], function(){
    gulp.run( 'scripts','resourcecopy');
});