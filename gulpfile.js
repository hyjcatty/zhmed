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
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var htmlmin = require('gulp-htmlmin');
var mkdirp = require('mkdirp');
var fs=require('fs');
var option = {
    buildPath: "../www/zhmed"
}
var jsserverpath="../nodewww";
var expresspath="../exproot";
var expresswebpath="/view";
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
});
gulp.task('cleanjs',function(){
    return gulp.src(jsserverpath,{
        read:false
    }).pipe(clean({force:true}));
});
gulp.task('partlyclean',function(){
    var list = fs.readdirSync(jsserverpath);
    for(var i=0;i<list.length;i++){
        if(list[i]!="node_modules"){
            gulp.src(option.buildPath+"/"+list[i],{
                read:false
            }).pipe(clean({force:true}));
        }
    }
})
gulp.task("resourcecopy",function(){

    gulp.src("./build/bundle.js")
        .pipe(gulp.dest(option.buildPath+"/build/"));
    gulp.src("./*.php")
        .pipe(gulp.dest(option.buildPath+"/"));
    gulp.src("./*.ico")
        .pipe(gulp.dest(option.buildPath+"/"));
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
    gulp.src("./resource/nprogress/**/*")
        .pipe(gulp.dest(option.buildPath+"/resource/nprogress/"));
    gulp.src("./resource/colorpicker/**/*")
        .pipe(gulp.dest(option.buildPath+"/resource/colorpicker/"));
    gulp.src("./resource/fastclick/**/*")
        .pipe(gulp.dest(option.buildPath+"/resource/fastclick/"));
    gulp.src("./resource/bootstrap-progressbar/**/*")
        .pipe(gulp.dest(option.buildPath+"/resource/bootstrap-progressbar/"));
    gulp.src("./resource/select2/**/*")
        .pipe(gulp.dest(option.buildPath+"/resource/select2/"));
    //gulp.src("./resource/xhgrid/assets/**/*")
    //    .pipe(gulp.dest(option.buildPath+"/resource/xhgrid/assets/"));
    gulp.src("./resource/xhgrid/Web/**/*")
        .pipe(gulp.dest(option.buildPath+"/resource/xhgrid/Web/"));
    gulp.src("./resource/xhgrid/js/xhGrid.js")
        .pipe(gulp.dest(option.buildPath+"/resource/xhgrid/js/"));
    gulp.src("./resource/xhgrid/assets/**/*")
        .pipe(gulp.dest(option.buildPath+"/Assets/"));
    gulp.src("./resource/cropper/*.css")
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
    gulp.src("./img/*")
        .pipe(gulp.dest(option.buildPath+"/img/"));
    gulp.src("./flag/*")
        .pipe(gulp.dest(option.buildPath+"/flag/"));
    gulp.src("./msg/*")
        .pipe(gulp.dest(option.buildPath+"/msg/"));
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
})


gulp.task('scripts', function() {
    gulp.src('./resource/cropper/cropper.js')
        .pipe(concat('cropper.js'))
        // .pipe(gulp.dest('./dist/js'))
        .pipe(rename('cropper.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(option.buildPath+'/resource/cropper/'));
    gulp.src('./resource/xhgrid/js/xhgridout.js')
        .pipe(concat('xhgridout.js'))
        // .pipe(gulp.dest('./dist/js'))
        .pipe(rename('xhgridout.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(option.buildPath+'/resource/xhgrid/js/'));
    gulp.src('./index.html')
        .pipe(htmlmin(option_html))
        .pipe(gulp.dest(option.buildPath+'/'));
    gulp.src('./booting.html')
        .pipe(rename('booting.html'))
        .pipe(htmlmin(option_html))
        .pipe(gulp.dest(option.buildPath+'/'));
    gulp.src('./subplayer.html')
        .pipe(rename('subplayer.html'))
        .pipe(htmlmin(option_html))
        .pipe(gulp.dest(option.buildPath+'/'));
});
gulp.task("server",function(){
    gulp.src("./jsserver/ejs/req.js")
        .pipe(gulp.dest(option.buildPath+"/ejs/"));
    gulp.src("./jsserver/ejs/mqtt.js")
        .pipe(gulp.dest(option.buildPath+"/ejs/"));
    gulp.src("./jsserver/launch.js")
        .pipe(gulp.dest(option.buildPath+"/"));
    gulp.src("./jsserver/mqttserver.js")
        .pipe(gulp.dest(option.buildPath+"/"));
    gulp.src("./jsserver/debug.js")
        .pipe(gulp.dest(option.buildPath+"/"));
    gulp.src("./jsserver/boot.js")
        .pipe(gulp.dest(option.buildPath+"/"));
    gulp.src("./jsserver/jpg/*")
        .pipe(gulp.dest(option.buildPath+"/jpg/"));
});
gulp.task("server-module",function(){
    gulp.src("./target_module/node_modules/**/*")
        .pipe(gulp.dest(option.buildPath+"/node_modules/"));
});
gulp.task('default',['clean'], function(){
    gulp.run( 'scripts','resourcecopy');
});

gulp.task('jsserver',['cleanjs'],function(){
    option.buildPath = jsserverpath;
    gulp.run('scripts','resourcecopy','server','server-module');
});
gulp.task('jsupdate',['partlyclean'],function(){
    option.buildPath = jsserverpath;
    gulp.run('scripts','resourcecopy','server');
});

//Follow part is for express
gulp.task('express_clean',function(){
    return gulp.src(option.buildPath,{
        read:false
    }).pipe(clean({force:true}));
});
gulp.task('express_clean_web',function(){
    return gulp.src(option.buildPath+"/view",{
        read:false
    }).pipe(clean({force:true}));
});
gulp.task('express_clean_server',function(){
    var list = fs.readdirSync(jsserverpath);
    for(var i=0;i<list.length;i++){
        if(list[i]!="node_modules" && list[i]!="view" ){
            gulp.src(option.buildPath+"/"+list[i],{
                read:false
            }).pipe(clean({force:true}));
        }
    }
});

gulp.task('express_web',function() {
    gulp.src("./build/bundle.js")
        .pipe(gulp.dest(option.buildPath+expresswebpath+"/build/"));
    gulp.src("./*.php")
        .pipe(gulp.dest(option.buildPath+expresswebpath+"/"));
    gulp.src("./*.ico")
        .pipe(gulp.dest(option.buildPath+expresswebpath+"/"));
    gulp.src("./build/resource/**/*")
        .pipe(gulp.dest(option.buildPath+expresswebpath+"/resource/"));
    gulp.src("./resource/js/*")
        .pipe(gulp.dest(option.buildPath+expresswebpath+"/resource/js/"));
    gulp.src("./resource/css/*")
        .pipe(gulp.dest(option.buildPath+expresswebpath+"/resource/css/"));
    gulp.src("./resource/img/*")
        .pipe(gulp.dest(option.buildPath+expresswebpath+"/resource/img/"));
    gulp.src("./resource/image/*")
        .pipe(gulp.dest(option.buildPath+expresswebpath+"/resource/image/"));
    gulp.src("./resource/fonts/g*")
        .pipe(gulp.dest(option.buildPath+expresswebpath+"/resource/fonts/"));
    gulp.src("./resource/keyboardmaster/**/*")
        .pipe(gulp.dest(option.buildPath+expresswebpath+"/resource/keyboardmaster/"));
    gulp.src("./resource/iCheck/**/*")
        .pipe(gulp.dest(option.buildPath+expresswebpath+"/resource/iCheck/"));
    gulp.src("./resource/select2/**/*")
        .pipe(gulp.dest(option.buildPath+expresswebpath+"/resource/select2/"));
    gulp.src("./resource/switchery/*")
        .pipe(gulp.dest(option.buildPath+expresswebpath+"/resource/switchery/"));
    gulp.src("./resource/pnotify/*")
        .pipe(gulp.dest(option.buildPath+expresswebpath+"/resource/pnotify/"));
    gulp.src("./resource/nprogress/**/*")
        .pipe(gulp.dest(option.buildPath+expresswebpath+"/resource/nprogress/"));
    gulp.src("./resource/colorpicker/**/*")
        .pipe(gulp.dest(option.buildPath+expresswebpath+"/resource/colorpicker/"));
    gulp.src("./resource/fastclick/**/*")
        .pipe(gulp.dest(option.buildPath+expresswebpath+"/resource/fastclick/"));
    gulp.src("./resource/bootstrap-progressbar/**/*")
        .pipe(gulp.dest(option.buildPath+expresswebpath+"/resource/bootstrap-progressbar/"));
    gulp.src("./resource/select2/**/*")
        .pipe(gulp.dest(option.buildPath+expresswebpath+"/resource/select2/"));
    gulp.src("./resource/xhgrid/Web/**/*")
        .pipe(gulp.dest(option.buildPath+expresswebpath+"/resource/xhgrid/Web/"));
    gulp.src("./resource/xhgrid/js/xhGrid.js")
        .pipe(gulp.dest(option.buildPath+expresswebpath+"/resource/xhgrid/js/"));
    gulp.src("./resource/xhgrid/assets/**/*")
        .pipe(gulp.dest(option.buildPath+expresswebpath+"/Assets/"));
    gulp.src("./resource/cropper/*.css")
        .pipe(gulp.dest(option.buildPath+expresswebpath+"/resource/cropper/"));
    gulp.src("./svg/*")
        .pipe(gulp.dest(option.buildPath+expresswebpath+"/svg/"));
    gulp.src("./demo/**/*")
        .pipe(gulp.dest(option.buildPath+expresswebpath+"/demo/"));
    gulp.src("./img/*")
        .pipe(gulp.dest(option.buildPath+expresswebpath+"/img/"));
    gulp.src("./flag/*")
        .pipe(gulp.dest(option.buildPath+expresswebpath+"/flag/"));
    gulp.src('./resource/cropper/cropper.js')
        .pipe(concat('cropper.js'))
        // .pipe(gulp.dest('./dist/js'))
        .pipe(rename('cropper.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(option.buildPath+expresswebpath+'/resource/cropper/'));
    gulp.src('./resource/xhgrid/js/xhgridout.js')
        .pipe(concat('xhgridout.js'))
        // .pipe(gulp.dest('./dist/js'))
        .pipe(rename('xhgridout.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(option.buildPath+expresswebpath+'/resource/xhgrid/js/'));
    gulp.src('./index.html')
        .pipe(htmlmin(option_html))
        .pipe(gulp.dest(option.buildPath+expresswebpath+'/'));
    gulp.src('./booting.html')
        .pipe(rename('booting.html'))
        .pipe(htmlmin(option_html))
        .pipe(gulp.dest(option.buildPath+expresswebpath+'/'));
    gulp.src('./404.html')
        .pipe(rename('404.html'))
        .pipe(htmlmin(option_html))
        .pipe(gulp.dest(option.buildPath+expresswebpath+'/'));
    gulp.src('./info.html')
        .pipe(rename('info.html'))
        .pipe(htmlmin(option_html))
        .pipe(gulp.dest(option.buildPath+expresswebpath+'/'));
    gulp.src("./jsserver/jpg/*")
        .pipe(gulp.dest(option.buildPath+expresswebpath+"/jpg/"));

});
gulp.task('express_server',function() {
    gulp.src("./jsserver/ejs/req.js")
        .pipe(gulp.dest(option.buildPath+"/ejs/"));
    gulp.src("./jsserver/ejs/mqtt.js")
        .pipe(gulp.dest(option.buildPath+"/ejs/"));
    gulp.src("./jsserver/server.js")
        .pipe(gulp.dest(option.buildPath+"/"));
    gulp.src("./jsserver/mqttserver.js")
        .pipe(gulp.dest(option.buildPath+"/"));
    gulp.src("./jsserver/debug.js")
        .pipe(gulp.dest(option.buildPath+"/"));
    gulp.src("./jsserver/boot.js")
        .pipe(gulp.dest(option.buildPath+"/"));
    gulp.src("./jsserver/ecosystem.config.js")
        .pipe(gulp.dest(option.buildPath+"/"));
    gulp.src("./express_module/package.json")
        .pipe(gulp.dest(option.buildPath+"/"));
    gulp.src("./express_module/package-lock.json")
        .pipe(gulp.dest(option.buildPath+"/"));
    gulp.src("./baseconf/**/*")
        .pipe(gulp.dest(option.buildPath+"/baseconf/"));
    gulp.src("./language/**/*")
        .pipe(gulp.dest(option.buildPath+"/language/"));
    gulp.src("./msg/**/*")
        .pipe(gulp.dest(option.buildPath+"/msg/"));
    gulp.src("./sysconf/**/*")
        .pipe(gulp.dest(option.buildPath+"/sysconf/"));
    gulp.src("./baseconf/**/*")
        .pipe(gulp.dest(option.buildPath+"/baseconf/"));

});
gulp.task('express_module',function() {
    gulp.src("./express_module/node_modules/**/*")
        .pipe(gulp.dest(option.buildPath+"/node_modules/"));

});


gulp.task('exserver',['express_clean_server','express_clean_web'],function(){
    option.buildPath = expresspath;
    gulp.run('express_server','express_web');
});
gulp.task('exall',['express_clean'],function(){
    option.buildPath = expresspath;
    gulp.run('express_server','express_web','express_module');
});