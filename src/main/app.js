/**
 * Created by hyj on 2016/9/28.
 */

import React,  {
    Component,
    PropTypes
    }from "react";
import ReactDOM from "react-dom";
import classNames from 'classnames';
import Foot from "../foot/foot"
import Head from "../head/head"
import Loginview from "../container/loginview/loginview"
import Languageview from "../container/languageview/languageview"
import Alarmview from "../container/alarmview/alarmview"
import Basicview from "../container/basicview/basicview"
import Systeminfocard from "../container/cards/systeminfocard/systeminfo"
import './App.css';

import fetch from 'isomorphic-fetch';
require('es6-promise').polyfill();


var winWidth;
var winHeight;
var mqttconf={};
var basic_address = getRelativeURL()+"/";
var request_head= basic_address+"request.php";
var timeouthandle = null;
var temprun = false;
class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            width: 1024,
            height: 768,
            headfootheight: 50,
            headfootminheight: 50,
            canvasheight: 700,
            userid: "user",
            username:"",
            buttonlist: [],
            iconlist:[],
            originalconf:[],
            tempconf:[],
            tempruncallback:null,
            language:{
                "app":{
                    "modalhead":"Warning",
                    "modaltips":"Are u want do delete this configuration?",
                    "modaltips2":"Are u want stop current configuration?",
                    "modalconfirm":"confirm",
                    "modalcancel":"cancel",
                    "userunknown":"",
                    "tempmodaltitle":"训练参数",
                    "tempmodalrun":"分析",
                },

                "message":{
                    "alert1":"System Error, please contract Admin!",
                    "alert2":"Login Fail, please try again!",
                    "alert3":"Can not get mandatory information, please contract Admin!",
                    "alert4":"Fail while start case, please contract Admin!",
                    "alert5":"Fail while stop case, please contract Admin!",
                    "alert6":"Run error, system is shutting down!",
                    "alert7":"Can not save new config!",
                    "alert8":"Modify config save error!",
                    "alert9":"System config save error!",
                    "alert10":"Debug command error!",
                    "alert11":"Revolution error, the min size should be 1366x768",
                    "message1":"Warning:Delete Fail!!!",
                    "message2":"Delete successfully!",
                    "message3":"run successfully!",
                    "message4":"Save successfully!",
                    "message5":"",
                    "message6":"",
                    "message7":"",
                    "message8":"",
                    "message9":"",
                    "message10":"",
                    "title1":"Balance Calibration",
                    "title2":"new Configuration",
                    "title3":"System debug",
                    "title4":"System Configuration",
                    "title5":"Please Login",
                    "title6":"Log Export",
                    "title7":"Fetal Error"
                }
            },
        };
        this._footcallbackreturn=this.loginview.bind(this);
        this._footcallbacklanguage=this.languageview.bind(this);
        this._footcallbacksysteminfo=this.systeminfocard.bind(this);
        this._footcallbacktask=this.taskview.bind(this);
        this._footcallbackparameter=this.parameterview.bind(this);
        this._footcallbacklocation=this.locationview.bind(this);
        this._basiccallbacklockfoot=this.lockfoot.bind(this);


    }
    updatecallback(temprun){
        this.setState({tempruncallback:temprun});
    }
    lockfoot(bool){
        this.refs.foot.lock_all(bool);
    }
    removeuser(){
        this.setState({userid:"user",username:this.state.language.app.userunknown});
        this.refs.head.update_username(this.state.language.app.userunknown);
    }
    updateLanguage(language){
        this.setState({language:language});
        this.refs.Loginview.update_language(language.loginview);
        this.refs.head.update_language(language.head);
        this.refs.foot.update_language(language.foot);
        this.refs.Systeminfocard.update_language(language.systeminfo);
        this.refs.Alarmview.update_language(language.alarmview);

        this.refs.Basicview.update_language(language.basicview);
    }
    updateVersion(version){
        this.refs.foot.updateversion(version);
    }
    updateContent(content){
        this.refs.foot.update_content(content);
    }
    initializeSize(width,height){
        let winlength= (width>height)?width:height;
        let headfootheight = (parseInt(winlength/20)>this.state.headfootminheight)?parseInt(winlength/20):this.state.headfootminheight;
        if(headfootheight > 75) headfootheight = 75;
        let canvasheight = height - 2*headfootheight;
        console.log("headfootheight:"+headfootheight+"canvasheight:"+canvasheight);
        this.setState({width:width,height:height,headfootheight:headfootheight,canvasheight:canvasheight});
        this.refs.head.update_size(headfootheight);
        this.refs.foot.update_size(headfootheight);
        this.refs.Loginview.update_size(width,canvasheight);
        this.refs.Basicview.update_size(width,canvasheight);
        this.refs.Languageview.update_size(width,canvasheight);
        this.refs.Systeminfocard.update_size(parseInt(width/3),canvasheight,headfootheight);
    }
    initializeAlarmSize(width,height){
        this.refs.Alarmview.update_size(width,height);
    }
    initializeLogin(callback){
        this.refs.Loginview.update_callback(callback);
    }
    initializeLanguageview(Languagelist,callback){
        this.refs.Languageview.update_buttonlist(Languagelist,callback);
    }
    initializeBasic(callback,callbacksave,callbackgettempconf,callbacksavetempconf,callbackruntempconf){
        this.refs.Basicview.update_task_callback(callback,null,callbacksave);
        this.refs.Basicview.update_result_callback(callbackgettempconf,callbacksavetempconf,callbackruntempconf);
    }
    initializehead(){
        this.refs.head.update_username(this.state.username);
    }
    initializefoot(){
        this.refs.foot.hide_all();
    }
    initializesysconf(callback,configure){
        this.refs.Basicview.initializeparameter(callback,configure);
    }
    headButtonShow(buser){
        this.refs.head.show_user_button(buser);
    }
    footButtonShow(blanguage,bmain,btask,bparameter,blocation,bhistory,baudit){
        this.refs.foot.show_return_button(bmain);
        this.refs.foot.show_language_button(blanguage);
        this.refs.foot.show_task_button(btask);
        this.refs.foot.show_parameter_button(bparameter);
        this.refs.foot.show_location_button(blocation);
        this.refs.foot.show_history_button(bhistory);
        this.refs.foot.show_audit_button(baudit);
    }
    hideallmodal(){
        $('.modal').modal('hide') ;
    }
    loginview(){
        this.removeuser();
        this.refs.Loginview.show();
        this.refs.foot.hide_all();
        this.refs.foot.show_systeminfo_button(true);
        this.refs.Languageview.hide();
        this.refs.Basicview.hide();
        this.footButtonShow(true,false,false,false,false,false,false);
        //console.log(this.state.language);
        this.tipsinfo(this.state.language.message.title5);
        this.refs.head.hide_button();
    }
    languageview(){
        this.refs.Languageview.show();
        this.refs.Loginview.hide();
        this.refs.Basicview.hide();
        this.refs.foot.show_systeminfo_button(false);
        this.footButtonShow(false,false,false,false,false,false,false);
        this.tipsinfo("");
    }
    basicview(){
        this.refs.Languageview.hide();
        this.refs.Loginview.hide();
        this.refs.Basicview.show();
        this.refs.foot.show_systeminfo_button(true);
        this.footButtonShow(false,false,true,true,true,true,true);
        this.tipsinfo("");
    }
    taskview(){
        this.refs.Basicview.taskview();
    }
    parameterview(){
        this.refs.Basicview.parameterview();
    }
    locationview(){
        this.refs.Basicview.locationview();
    }
    systeminfocard(){
        this.refs.Systeminfocard.switch_system_info();
    }
    alarmview(bool){
        if(bool)
            this.refs.Alarmview.show();
        else
            this.refs.Alarmview.hide();
    }
    getuser(){
        return this.state.userid;
    }
    tipsinfo(tips){
        if(timeouthandle != null)  {
            clearTimeout(timeouthandle);
            timeouthandle = null;
        }
        this.refs.head.write_log(tips);
    }
    tipsinfo_withtimeout(tips){
        this.refs.head.write_log(tips);
    }
    update_clock(clock){
        this.refs.head.update_clock(clock);
    }
    revolution_alarm(){
        this.refs.Alarmview.update_alarm(this.state.language.message.alert11);
        this.alarmview(true);
    }
    revolution_solve(){
        this.alarmview(false);
    }
    system_error(error){
        this.refs.Alarmview.update_error(error);
        this.alarmview(true);
    }
    update_system_info(info){
        this.refs.Systeminfocard.update_content(info.info);
    }
    update_task_info(task){
        this.refs.Basicview.update_task(task);
    }
    update_logs(log){
        this.refs.Systeminfocard.update_msg(log);
    }
    setuser(username,userid){
        this.setState({userid:userid,username:username});
        this.refs.head.update_username(username);

    }
    setpanel(configure){
        this.refs.Basicview.update_panel(configure);
    }
    getpanel(){
        return this.refs.Basicview.get_current_panel_configure();
    }
    get_running(){
        return this.refs.Basicview.get_running();
    }
    getsysconfset(){
        return this.refs.Basicview.getsysconfset();
    }
    updatetempconf(conf,callback){
        this.setState({tempconf:conf,originalconf:conf},callback);
        //this.refs.Basicview.updatetempconf(conf);
    }
    gettempparameter(){
        return this.state.tempconf;
    }
    getmodalinfo(){
        /*
        let localconf = this.deepCopy(this.state.tempconf);
        for(let x in localconf){
            localconf[x] = $("#temp_conf_input_"+x).val();
        }
        return localconf;*/
        return this.state.tempconf;
    }
    valueequal(){
        for(let x in this.state.tempconf){
            if(!this.state.originalconf.hasOwnProperty(x) ){
                return false;
            }
            if(this.state.originalconf[x] !== this.state.tempconf[x]){
                return false
            }
        }
        return true;
    }
    handlemodalrunClick(e){
        let temp_change =  this.getmodalinfo();
        if(this.valueequal()) return;
        //console.log(this.state.temp_change);
        this.state.tempruncallback(temp_change);
    }
    handleTempChange(e){
        let change_value = e.target.value;
        let group_id= (e.target.getAttribute('data-key'));
        let new_state = this.deepCopy(this.state.tempconf);
        new_state[group_id]=change_value;
        this.setState({tempconf:new_state});
    }
    gettempconf(){
        return this.refs.Basicview.get_result_content();
    }
    showtemprunshield(){
        this.refs.Basicview.refs.Resultviewcard.showshield();
        this.lockfoot(true);
    }
    hidetemprunshield(){
        this.refs.Basicview.refs.Resultviewcard.hideshield();
        this.lockfoot(false);
    }
    updatetemprunshield(msg){
        this.refs.Basicview.refs.Resultviewcard.updateshieldmsg(msg);
    }
    updateresultcontentdirectly(content){
        this.refs.Basicview.refs.Resultviewcard.update_content(content);
    }
    deepCopy(o) {
        if (o instanceof Array) {
            var n = [];
            for (var i = 0; i < o.length; ++i) {
                n[i] = this.deepCopy(o[i]);
            }
            return n;
        } else if (o instanceof Function) {
            var n = new Function("return " + o.toString())();
            return n
        } else if (o instanceof Object) {
            var n = {}
            for (var i in o) {
                n[i] = this.deepCopy(o[i]);
            }
            return n;
        } else {
            return o;
        }
    }
    render() {

        let temp_conf=[];
        for( let x in this.state.tempconf){
            let className="form-control "+"temp_conf_input_text";
            temp_conf.push(
                <div className="col-xs-6 col-md-6 col-sm-6 col-lg-6" key={"temp_conf_"+x}>
                    <div className="input-group">
                        <span className="input-group-addon"  style={{minWidth: "100px",fontSize:"12px"}}>{x+":"}</span>
                        <input type="text" className={className} placeholder="CONFIG Value" aria-describedby="basic-addon1"
                               key={"temp_conf_input_"+x} id={"temp_conf_input_"+x}
                               data-key={x}
                               value={this.state.tempconf[x]}
                               onChange={this.handleTempChange.bind(this)}
                        />
                    </div>
                </div>   );
        }

        return(
        <div style={{overflowY:'hidden',overflowX:'hidden'}}>
            <div>
                <Alarmview ref="Alarmview"/>
            </div>
            <div>
                <Head ref="head" headcallbackuser={this._headcallbackuser}/>
            </div>
            <div>
                <Systeminfocard ref="Systeminfocard"/>
            </div>
            <div>
                <Languageview ref="Languageview"/>
                <Loginview ref="Loginview"/>
                <Basicview ref="Basicview"
                           basiccallbacklockfoot = {this._basiccallbacklockfoot}/>
            </div>
            <div>
                <Foot ref="foot"
                      footcallbackreturn={this._footcallbackreturn}
                      footcallbacksysteminfo={this._footcallbacksysteminfo}
                      footcallbacklanguage={this._footcallbacklanguage}
                      footcallbacktask={this._footcallbacktask}
                      footcallbackparameter={this._footcallbackparameter}
                      footcallbacklocation={this._footcallbacklocation} />
            </div>
            <div className="modal fade" id="ExpiredAlarm" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="ExpiredAlertModalLabel">{this.state.language.app.modalhead}</h4>
                        </div>
                        <div className="modal-body" id="ExpiredAlertModalContent">
                            {this.state.language.app.modaltips}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal" style={{width:100,height:50}}>{this.state.language.app.modalcancel}</button>
                            <button type="button" className="btn btn-default" data-dismiss="modal" style={{width:100,height:50}} id="ExpiredConfirm">{this.state.language.app.modalconfirm}</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="ExpiredAlarm3" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="ExpiredAlertModalLabel">{this.state.language.app.modalhead}</h4>
                        </div>
                        <div className="modal-body" id="ExpiredAlertModalContent3">
                            {this.state.language.app.modaltips2}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal" style={{width:100,height:50}}>{this.state.language.app.modalcancel}</button>
                            <button type="button" className="btn btn-default" data-dismiss="modal" style={{width:100,height:50}} id="ExpiredConfirm_stop">{this.state.language.app.modalconfirm}</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="ExpiredAlarm2" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="ExpiredAlertModalLabel2">{this.state.language.app.modalhead}</h4>
                        </div>
                        <div className="modal-body" id="ExpiredAlertModalContent2">
                            {this.state.language.app.modaltips}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal" >{this.state.language.app.modalconfirm}</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="TempConf" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="TempConfModalLabel">{this.state.language.app.tempmodaltitle}</h4>
                        </div>
                        <div className="modal-body" id="TempConfModalContent">
                            {temp_conf}
                        </div>
                        <div className="clearfix"></div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal" >{this.state.language.app.modalcancel}</button>
                            <button type="button" className="btn btn-primary" style={{marginBottom:0}}
                                    onClick={this.handlemodalrunClick.bind(this)}>{this.state.language.app.tempmodalrun}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }


}
var IconList=[];
var interval_handle = -1;
var Running=false;
var Alarming=false;
var wait_time_short=300;

var activeconf = null;
var language=null;
var language_list = null;
var default_language="en";
var react_element;
var app_handle;
react_element = <App/>;

get_size();
app_handle = ReactDOM.render(react_element,document.getElementById('app'));
app_handle.initializeSize(winWidth,winHeight);
app_handle.initializeAlarmSize(winWidth,winHeight);
app_handle.updatecallback(runtempanalysisfetch);
var clockcycle=setInterval(updateclock,10000);

var inteval_handle = setInterval(function(){
    if(!app_handle.get_running())return;
    else{
        taskrunningfetch();
    }
},5000);

var temp_inteval_handle = setInterval(function(){
    if(!temprun)return;
    else{
        gettempataskstatusfetch(app_handle.gettempconf());
    }
},5000);
syslanguagelistfetch();
var client;
//initialize_mqtt();
//fetchmqtt();
function initialize_mqtt(){

    client = mqtt.connect(mqttconf.server ,{
        username:mqttconf.username,
        password:mqttconf.password,
        clientId:mqttconf.clientId
    });
    client.on('connect', function () {

        console.log('mqtt connect :)');
        client.subscribe(mqttconf.subscribe);
    });
    client.on("error", function (error) {
        console.log(error.toString());
        window.alert("Lost connect to hcu, please contact administrator!")
    });
    client.on("message", function (topic, payload) {
        //console.log('收到topic = ' + topic + ' 消息: ' + payload.toString());
        let ret = JSON.parse(payload.toString());
        //if(Running===false)return;
        switch(ret.action)
        {
            case "XH_High_Speed_Balance_statistics_status":
                app_handle.update_status(ret.data);
                //console.log("updated");
                break;
            //case "XH_High_Speed_Balance_version_status":
                //app_handle.updateVersion(ret.data);
                //app_handle.initialize_animateview_chamber(ret.data);
                //break;
            case "XH_High_Speed_Balance_report_status":
                app_handle.updateContent(ret.data);
                //app_handle.initialize_animateview_chamber(ret.data);
                break;
            case "XH_High_Speed_Balance_alarm_status":
                app_handle.showalarm(ret.data.msg);
                //app_handle.update_animateview_chamber(ret.data);
                break;
            case "XH_High_Speed_Balance_debug_status":
                app_handle.debug_label_update(ret.data);
                //app_handle.update_animateview_statistics(ret.data);
                break;
            case "XH_High_Speed_Balance_fetal_status":
                app_handle.initializesyserror(resize,ret.data);
                app_handle.syserrorview();
                break;
            case "XH_High_Speed_Balance_calibration_zero_status":
                app_handle.update_cali_status(ret.data.balance,1,ret.data.msg,ret.data.debugmsg);break;
            case "XH_High_Speed_Balance_calibration_weight_status":
                app_handle.update_cali_status(ret.data.balance,2,ret.data.msg,ret.data.debugmsg);break;
            case "XH_High_Speed_Balance_calibration_dynamic_status":
                app_handle.update_cali_dynamic_status(ret.data);break;
            case "XH_High_Speed_Balance_calibration_zero_finish":
                app_handle.calibration_zero_finish();break;
            case "XH_High_Speed_Balance_calibration_full_finish":
                app_handle.calibration_full_finish();break;
            default:
                return;
        }
    });
}

function systemstart(){
    //xhbalanceiconlist();

    sysconffetch();
    //app_handle.initializeUrl(request_head);
//app_handle.initializefoot(footcallback_return,footcallback_back,footcallback_configure);
    //flushuserlistfetch();
    systeminfofetch();
    app_handle.initializefoot();
    app_handle.initializehead();
    app_handle.initializeLogin(xhbalancelogin);
    app_handle.initializeBasic(taskrunfetch,
        footcallback_save,
        gettempconffetch,
        savetempconffetch,
        runtempanalysisfetch);
    app_handle.loginview();
    update_log_test();
    if(winHeight < 768 || winWidth<1366){
        app_handle.revolution_alarm();
    }else{
        app_handle.revolution_solve();
    }
    updateclock();
}
var footcallback_back= function(){
    //xhbalanceconfiglist();
    tips("");
}
function updateclock(){
    var date = new Date();
    app_handle.update_clock(date.pattern("yy-MM-dd HH:mm"));
}
function get_size(){
    if (window.innerWidth)
        winWidth = window.innerWidth;
    else if ((document.body) && (document.body.clientWidth))
        winWidth = document.body.clientWidth;
    if (window.innerHeight)
        winHeight = window.innerHeight;
    else if ((document.body) && (document.body.clientHeight))
        winHeight = document.body.clientHeight;
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth)
    {
        winHeight = document.documentElement.clientHeight;
        winWidth = document.documentElement.clientWidth;
    }
    //console.log("winWidth = "+winWidth);
    //console.log("winHeight= "+winHeight);
}
function resize(){
    get_size();
    if(winHeight < 768 || winWidth<1024){
        app_handle.revolution_alarm();
        app_handle.initializeAlarmSize(winWidth,winHeight);
    }else{
        app_handle.revolution_solve();
        app_handle.initializeSize(winWidth,winHeight);

    }
    interval_handle = -1;
    //location.reload(true);
}
window.onresize= function(){
    if(interval_handle >=0) clearTimeout(interval_handle);
    interval_handle=setTimeout(function(){
        resize();
    },1000);
}

function tips(tip){
    app_handle.tipsinfo_withtimeout(tip);
}
function GetRandomNum(Min,Max)
{
    var Range = Max - Min;
    var Rand = Math.random();
    return(Min + Math.round(Rand * Range));
}
function getRelativeURL(){
    var url = document.location.toString();
    var arrUrl= url.split("://");
    var start = arrUrl[1].indexOf("/");
    var reUrl=arrUrl[1].substring(start);
    if(reUrl.indexOf("?")!=-1) {
        reUrl = reUrl.split("?")[0];
    }
    var end = reUrl.lastIndexOf("/");
    reUrl=reUrl.substring(0,end);

    reUrl=reUrl.replace(/\/\/*/, "/");
    return reUrl;

}

function jsonParse(res) {
    return res.json().then(jsonResult => ({ res, jsonResult }));
}
function xhbalanceconfiglist(){

    var listreq = {
        action:"XH_Balance_config_list",
        type:"query",
        user:app_handle.getuser()
    };
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(listreq)
        }).then(jsonParse)
        .then(xhbalanceconfiglistcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function brickclickfetch(configuration,type){
    var body = {
        type:type,
        file:configuration.name
    };
    var map={
        action:"XH_Balance_config_detail",
        type:"query",
        lang:default_language,
        body: body,
        user:app_handle.getuser()
    };
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(map)
        }).then(jsonParse)
        .then(brickclickcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function brickclickcallback(res){
    if(res.jsonResult.status == "false"){
        alert(language.message.alert1);
        return;
    }
    if(res.jsonResult.auth == "false"){
        return;
    }
    let configuration = res.jsonResult.ret;

    app_handle.workview_run(configuration);
    //app_handle.workview();
}
function bricknewclickfetch(configuration,type){
    var body = {
        type:type,
        file:configuration.name
    };
    var map={
        action:"XH_Balance_config_detail",
        type:"query",
        lang:default_language,
        body: body,
        user:app_handle.getuser()
    };
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(map)
        }).then(jsonParse)
        .then(bricknewclickcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function bricknewclickcallback(res){
    if(res.jsonResult.status == "false"){
        alert(language.message.alert1);
        return;
    }
    if(res.jsonResult.auth == "false"){
        return;
    }
    let configuration = res.jsonResult.ret;
    //console.log(configuration);
    app_handle.workview_new(configuration);
    //app_handle.workview();
}
function xhbalanceconfiglistcallback(res){
    if(res.jsonResult.status == "false"){
        alert(language.message.alert1);
        app_handle.initializeLogin(xhbalancelogin);
        app_handle.loginview();
        return;
    }
    if(res.jsonResult.auth == "false"){
        return;
    }
    bricklist = res.jsonResult.ret.configure;
    baselist = res.jsonResult.ret.base;
    app_handle.initializeBrick(bricklist,baselist,brickclickfetch,bricknewclickfetch);
    app_handle.brickview();
    tips("");
}
function xhbalancelogin(username,password){

    var body = {
    username:username,
    password:b64_sha1(password)
    };
    var map={
        action:"XH_Balance_Login",
        type:"query",
        lang:default_language,
        body: body,
        user:"null"
    };

    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(map)
        }).then(jsonParse)
        .then(xhbalancelogincallback)
        //.then(fetchlist)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}

function xhbalancelogincallback(res){
    if(res.jsonResult.status == "false"){
        alert(language.message.alert2);
        app_handle.initializeLogin(xhbalancelogin);
        app_handle.loginview();
        return;
    }
    if(res.jsonResult.auth == "false"){
        return;
    }
    let userinfo = res.jsonResult.ret;
    app_handle.setuser(userinfo.username,userinfo.userid);
    //taskinfofetch();

    currentPanelfetch("");
    app_handle.basicview();
    app_handle.taskview();
    //xhbalanceconfiglist();
    tips("");
}

function sysconffetch(){
    var map={
        action:"XH_Balance_sys_config",
        type:"query",
        lang:default_language,
        user:null
    };
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(map)
        }).then(jsonParse)
        .then(sysconffetchcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function sysconffetchcallback(res){
    if(res.jsonResult.status == "false"){
        alert(language.message.alert1);
        return;
    }
    if(res.jsonResult.auth == "false"){
        return;
    }
    let configuration = res.jsonResult.ret;

    app_handle.initializesysconf(xhbalancesavesysconf,configuration);
    //app_handle.workview();
}
function xhbalancesavesysconf(configure){

    var map={
        action:"XH_Balance_sys_config_save",
        type:"mod",
        lang:default_language,
        body:configure,
        user:app_handle.getuser()
    };
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(map)
        }).then(jsonParse)
        .then(xhbalancesavesysconfcallback)
        //.then(fetchlist)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}

function xhbalancesavesysconfcallback(res){
    if(res.jsonResult.status == "false"){
        alert(language.message.alert9);
        return;
    }
    if(res.jsonResult.auth == "false"){
        return;
    }
    //xhbalanceconfiglist();
    sysconffetch();
    currentPanelfetch("");
    tips(language.message.message4);
}

function footcallback_save(){
    xhbalancesavesysconf(app_handle.getsysconfset());

}
function modal_middle(modal){

    setTimeout(function () {
        var _modal = $(modal).find(".modal-dialog");
        if(parseInt(($(window).height() - _modal.height())/2)>0){

            _modal.animate({'margin-top': parseInt(($(window).height() - _modal.height())/2)}, 300 );
        }
    },wait_time_short);
}

function show_expiredModule(){
    activeconf = app_handle.get_active_configuration();
    if(activeconf === null) return;
    let warning_content =  language.message.message5+" ["+activeconf.name+"]?";
    $('#ExpiredAlertModalContent').empty();
    $('#ExpiredAlertModalContent').append(warning_content);
    modal_middle($('#ExpiredAlarm'));
    $('#ExpiredAlarm').modal('show') ;
}
function show_Module(msg){
    $('#ExpiredAlertModalContent2').empty();
    $('#ExpiredAlertModalContent2').append(msg);
    modal_middle($('#ExpiredAlarm2'));
    $('#ExpiredAlarm2').modal('show') ;
}
function syslanguagefetch(language_list){
    var map={
        action:"XH_Balance_sys_language",
        type:"query",
        lang:default_language,
        user:null,
        body:language_list
    };
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(map)
        }).then(jsonParse)
        .then(syslanguagefetchcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function syslanguagefetchcallback(res){
    if(res.jsonResult.status == "false"){
        alert("Fetal Error, Can not get language file!");
        windows.close();
    }
    if(res.jsonResult.auth == "false"){
        alert("Fetal Error, Can not get language file!");
        windows.close();
    }
    language = res.jsonResult.ret;
    //console.log(language);
    app_handle.updateLanguage(language);
    systemstart();
    //app_handle.workview();
}

function syslanguagelistfetch(){
    var map={
        action:"XH_Balance_sys_language_list",
        type:"query",
        lang:default_language,
        user:null
    };
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(map)
        }).then(jsonParse)
        .then(syslanguagelistfetchcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function syslanguagelistfetchcallback(res){
    if(res.jsonResult.status == "false"){
        alert("Fetal Error, Can not get language file!");
        windows.close();
    }
    if(res.jsonResult.auth == "false"){
        alert("Fetal Error, Can not get language file!");
        windows.close();
    }
    language_list=res.jsonResult.ret;
    default_language = language_list.default;

    app_handle.initializeLanguageview(language_list.national,language_brick_callback);
    syslanguagefetch(language_list);

}
function language_brick_callback(language_conf){
    language_list.default = language_conf.abbreviation;
    default_language = language_list.default;
    syslanguagefetch(language_list);
}

function sysversionfetch(){
    var map={
        action:"XH_Balance_sys_version",
        type:"query",
        lang:default_language,
        user:null
    };
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(map)
        }).then(jsonParse)
        .then(sysversionfetchcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function sysversionfetchcallback(res){
    if(res.jsonResult.status == "false"){
        alert("Fetal Error, Can not get version info!");
        windows.close();
    }
    if(res.jsonResult.auth == "false"){
        alert("Fetal Error, Can not get version info!");
        windows.close();
    }
    let version=res.jsonResult.ret;
    app_handle.updateVersion(version);

}
function changepasswordfetch(username,oldpassword,newpassword){
    var body={
        username:username,
        password:b64_sha1(oldpassword),
        newpassword:b64_sha1(newpassword)
    }
    var map={
        action:"XH_Balance_change_passwd",
        body:body,
        type:"mod",
        lang:default_language,
        user:null
    };
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(map)
        }).then(jsonParse)
        .then(changepasswordfetchcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function changepasswordfetchcallback(res){
    if(res.jsonResult.status == "false"){
        show_Module(res.msg);
        return;//windows.close();
    }
    if(res.jsonResult.auth == "false"){
        alert("Fetal Error, Can not change password!");
        windows.close();
    }
    //show_Module("修改成功，请重新登陆");
    show_Module(language.message.message11);
    app_handle.loginview();

}
function flushuserlistfetch(){
    var map={
        action:"XH_Balance_get_user_list",
        type:"query",
        lang:default_language,
        user:null
    };
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(map)
        }).then(jsonParse)
        .then(flushuserlistfetchcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function flushuserlistfetchcallback(res){
    if(res.jsonResult.status == "false"){
        alert("Fetal Error, Can not get user list!");
        windows.close();
    }
    if(res.jsonResult.auth == "false"){
        alert("Fetal Error, Can not get user list!");
        windows.close();
    }
    let userlist = res.jsonResult.ret;
    app_handle.set_user_list(userlist);
}
function resetuserfetch(username){
    var map={
        action:"XH_Balance_reset_user",
        body:{
            username:username
        },
        type:"mod",
        lang:default_language,
        user:null
    };
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(map)
        }).then(jsonParse)
        .then(resetuserfetchcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function resetuserfetchcallback(res){
    if(res.jsonResult.status == "false"){
        alert("Fetal Error, Can not reset user password!");
        windows.close();
    }
    if(res.jsonResult.auth == "false"){
        alert("Fetal Error, Can not reset user password!");
        windows.close();
    }
    //show_Module("重置成功，默认密码为123456！");
    show_Module(language.message.message12);
}

function newuserfetch(username){
    var map={
        action:"XH_Balance_new_user",
        body:{
            username:username
        },
        type:"mod",
        lang:default_language,
        user:null
    };
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(map)
        }).then(jsonParse)
        .then(newuserfetchcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function newuserfetchcallback(res){
    if(res.jsonResult.status == "false"){
        show_Module(res.msg);
        return;
    }
    if(res.jsonResult.auth == "false"){
        alert("Fetal Error, Can not new user!");
        windows.close();
    }
    //show_Module("新建成功，默认密码为123456！");
    show_Module(language.message.message13);
    flushuserlistfetch();
}
function deluserfetch(username){
    var map={
        action:"XH_Balance_del_user",
        body:{
            username:username
        },
        type:"mod",
        lang:default_language,
        user:null
    };
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(map)
        }).then(jsonParse)
        .then(deluserfetchcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function deluserfetchcallback(res){
    if(res.jsonResult.status == "false"){
        alert("Fetal Error, Can not delete user!");
        windows.close();
    }
    if(res.jsonResult.auth == "false"){
        alert("Fetal Error, Can not delete user!");
        windows.close();
    }
    //show_Module("删除成功！");
    show_Module(language.message.message2);
    flushuserlistfetch();
}
function removealarmfetch(){
    var map={
        action:"XH_Balance_remove_alarm",
        type:"mod",
        lang:default_language,
        user:null
    };
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(map)
        }).then(jsonParse)
        .then(removealarmfetchcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function removealarmfetchcallback(res){
    if(res.jsonResult.status == "false"){
        alert("Fetal Error, system error while remove alarm!");
        windows.close();
    }
    if(res.jsonResult.auth == "false"){
        alert("Fetal Error, system error while remove alarm!");
        windows.close();
    }
}
function fetchmqtt(username){
    var map={
        action:"XH_Balance_mqtt_conf",
        type:"query",
        lang:default_language,
        user:null
    };
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(map)
        }).then(jsonParse)
        .then(fetchmqttcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function fetchmqttcallback(res){
    if(res.jsonResult.status == "false"){
        alert("Fetal Error, Can not get mqtt configure!");
        windows.close();
    }
    if(res.jsonResult.auth == "false"){
        alert("Fetal Error, Can not get mqtt configur!");
        windows.close();
    }
    mqttconf = res.jsonResult.ret;
    initialize_mqtt();
}



function searchlanguage(key){
    if(key === null || key === undefined|| key ==""){
        return "";
    }
    if(language === null || language === undefined){
        return key;
    }
    for(var i in language.message){
        if(i==key) return language.message[key];
    }
    return key;
}

/***
 * New ZH message
 */
function systeminfofetch(){
    var map={
        action:"ZH_Medicine_system_info",
        type:"query",
        lang:default_language,
        user:null
    };
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(map)
        }).then(jsonParse)
        .then(systeminfofetchcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function systeminfofetchcallback(res){
    if(res.jsonResult.status == "false"){
        alert("Fetal Error, Can not get system info!");
        windows.close();
    }
    if(res.jsonResult.auth == "false"){
        alert("Fetal Error, Can not get system info!");
        windows.close();
    }
    let systeminfo = res.jsonResult.ret;
    console.log(systeminfo);
    app_handle.update_system_info(systeminfo);
}
function update_log_test(){
    setInterval(function(){
        let x = GetRandomNum(5,50);
        let str = "["+x+"]:";
        for(let i=0;i<x;i++){
            str = str + "x ";
        }
        app_handle.update_logs(str);
    },4000);
}

function currentPanelfetch(selected){
    let select = selected;
    if(select === null){
        select = "";
    }
    var map={
        action:"ZH_Medicine_Panel_info",
        body:select,
        type:"query",
        lang:default_language,
        user:null
    };
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(map)
        }).then(jsonParse)
        .then(currentPanelfetchcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function currentPanelfetchcallback(res){
    if(res.jsonResult.status == "false"){
        alert("Fetal Error, Can not get panel info!");
        windows.close();
    }
    if(res.jsonResult.auth == "false"){
        alert("Fetal Error, Can not get panel info!");
        windows.close();
    }
    let panelinfo = res.jsonResult.ret;
    app_handle.setpanel(panelinfo);
    taskinfofetch(panelinfo);
}
function taskinfofetch(panel){
    var map={
        action:"ZH_Medicine_task_info",
        type:"query",
        body:{
            configure:panel
        },
        lang:default_language,
        user:null
    };
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(map)
        }).then(jsonParse)
        .then(taskinfofetchcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function taskinfofetchcallback(res){
    if(res.jsonResult.status == "false"){
        alert("Fetal Error, Can not get system info!");
        windows.close();
    }
    if(res.jsonResult.auth == "false"){
        alert("Fetal Error, Can not get system info!");
        windows.close();
    }
    let task = res.jsonResult.ret;
    app_handle.update_task_info(task);
    //app_handle.setpanel(task.configure);
}
function taskrunfetch(bool){
    let status = "false";
    if(bool) status = "true";
    let panel = app_handle.getpanel();
    if(panel.picture.length === 0) return;
    var map={
        action:"ZH_Medicine_task_run",
        type:"query",
        body:{
            configure:panel,
            status:status
        },
        lang:default_language,
        user:null
    };
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(map)
        }).then(jsonParse)
        .then(taskrunfetchcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function taskrunfetchcallback(res){
    if(res.jsonResult.status == "false"){
        alert("Fetal Error, Can not get system info!");
        windows.close();
    }
    if(res.jsonResult.auth == "false"){
        alert("Fetal Error, Can not get system info!");
        windows.close();
    }
    let task = res.jsonResult.ret;
    app_handle.update_task_info(task);
    //app_handle.setpanel(task.configure);
}
function taskrunningfetch(){
    let panel = app_handle.getpanel();
    var map={
        action:"ZH_Medicine_task_running",
        type:"query",
        body:{
            configure:panel
        },
        lang:default_language,
        user:null
    };
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(map)
        }).then(jsonParse)
        .then(taskrunningfetchcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function taskrunningfetchcallback(res){
    if(res.jsonResult.status == "false"){
        alert("Fetal Error, Can not get system info!");
        windows.close();
    }
    if(res.jsonResult.auth == "false"){
        alert("Fetal Error, Can not get system info!");
        windows.close();
    }
    let task = res.jsonResult.ret;
    app_handle.update_task_info(task);
    //app_handle.setpanel(task.configure);
}
function settempconffetch(conf){
    var map={
        action:"ZH_Medicine_set_temp_conf",
        type:"query",
        body:{
            configure:conf
        },
        lang:default_language,
        user:null
    };
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(map)
        }).then(jsonParse)
        .then(settempconffetchcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function settempconffetchcallback(res){
    if(res.jsonResult.status == "false"){
        alert("Fetal Error, Can not get system info!");
        windows.close();
    }
    if(res.jsonResult.auth == "false"){
        alert("Fetal Error, Can not get system info!");
        windows.close();
    }
    let conf = res.jsonResult.ret;
    //app_handle.update_task_info(task);
}
function gettempconffetch(){
    var map={
        action:"ZH_Medicine_get_temp_conf",
        type:"query",
        lang:default_language,
        user:null
    };
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(map)
        }).then(jsonParse)
        .then(gettempconffetchcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function gettempconffetchcallback(res){
    if(res.jsonResult.status == "false"){
        alert("Fetal Error, Can not get system info!");
        windows.close();
    }
    if(res.jsonResult.auth == "false"){
        alert("Fetal Error, Can not get system info!");
        windows.close();
    }
    let conf = res.jsonResult.ret;
    app_handle.updatetempconf(conf,showtempmodal);
}
function runtempanalysisfetch(conf){
    var map={
        action:"ZH_Medicine_run_temp_analysis",
        type:"query",
        body:{
            configure:conf
        },
        lang:default_language,
        user:null
    };
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(map)
        }).then(jsonParse)
        .then(runtempanalysisfetchcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function runtempanalysisfetchcallback(res){
    if(res.jsonResult.status == "false"){
        alert("Fetal Error, Can not get system info!");
        windows.close();
    }
    if(res.jsonResult.auth == "false"){
        alert("Fetal Error, Can not get system info!");
        windows.close();
    }
    let conf = res.jsonResult.ret;
    temprun= true;

    app_handle.showtemprunshield();
    $('#TempConf').modal('hide') ;
    //app_handle.update_task_info(task);
}
function gettempataskstatusfetch(resultconf){
    var map={
        action:"ZH_Medicine_get_temp_task_status",
        type:"query",
        body:resultconf,
        lang:default_language,
        user:null
    };
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(map)
        }).then(jsonParse)
        .then(gettempataskstatusfetchcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function gettempataskstatusfetchcallback(res){
    if(res.jsonResult.status == "false"){
        alert("Fetal Error, Can not get system info!");
        windows.close();
    }
    if(res.jsonResult.auth == "false"){
        alert("Fetal Error, Can not get system info!");
        windows.close();
    }
    let run_result = res.jsonResult.ret;
    let message = res.jsonResult.msg;
    app_handle.updatetemprunshield(message);
    if(run_result.status === "true"){
        let retconf = run_result.result;
        app_handle.updateresultcontentdirectly(retconf);
        app_handle.hidetemprunshield();
        temprun=false;
    }
    //app_handle.update_task_info(task);
}
function savetempconffetch(){
    let conf = app_handle.gettempparameter();
    if(conf.length === 0) return;
    var map={
        action:"ZH_Medicine_save_temp_conf",
        type:"query",
        body:
            conf
        ,
        lang:default_language,
        user:null
    };
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(map)
        }).then(jsonParse)
        .then(savetempconffetchcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function savetempconffetchcallback(res){
    if(res.jsonResult.status == "false"){
        alert("Fetal Error, Can not get system info!");
        windows.close();
    }
    if(res.jsonResult.auth == "false"){
        alert("Fetal Error, Can not get system info!");
        windows.close();
    }
    sysconffetch();
    tips(language.message.message7);

}
function showtempmodal(){
    modal_middle($('#TempConf'));
    $('#TempConf').modal('show') ;
}
var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase     */
var b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance  */
var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode    */
/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_sha1(s) {
    return binb2hex(core_sha1(str2binb(s), s.length * chrsz));
}
function b64_sha1(s) {
    return binb2b64(core_sha1(str2binb(s), s.length * chrsz));
}
function str_sha1(s) {
    return binb2str(core_sha1(str2binb(s), s.length * chrsz));
}
function hex_hmac_sha1(key, data) {
    return binb2hex(core_hmac_sha1(key, data));
}
function b64_hmac_sha1(key, data) {
    return binb2b64(core_hmac_sha1(key, data));
}
function str_hmac_sha1(key, data) {
    return binb2str(core_hmac_sha1(key, data));
}
/*
 * Perform a simple self-test to see if the VM is working
 */
function sha1_vm_test() {
    return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
}
/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function core_sha1(x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << (24 - len % 32);
    x[((len + 64 >> 9) << 4) + 15] = len;
    var w = Array(80);
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    var e = -1009589776;
    for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        var olde = e;
        for (var j = 0; j < 80; j++) {
            if (j < 16) w[j] = x[i + j];
            else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
            e = d;
            d = c;
            c = rol(b, 30);
            b = a;
            a = t;
        }
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
        e = safe_add(e, olde);
    }
    return Array(a, b, c, d, e);
}
/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d) {
    if (t < 20) return (b & c) | ((~b) & d);
    if (t < 40) return b ^ c ^ d;
    if (t < 60) return (b & c) | (b & d) | (c & d);
    return b ^ c ^ d;
}
/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t) {
    return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
}
/*
 * Calculate the HMAC-SHA1 of a key and some data
 */
function core_hmac_sha1(key, data) {
    var bkey = str2binb(key);
    if (bkey.length > 16) bkey = core_sha1(bkey, key.length * chrsz);
    var ipad = Array(16),
        opad = Array(16);
    for (var i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }
    var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
    return core_sha1(opad.concat(hash), 512 + 160);
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */
function rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
}
/*
 * Convert an 8-bit or 16-bit string to an array of big-endian words
 * In 8-bit function, characters >255 have their hi-byte silently ignored.
 */
function str2binb(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz)
        bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
    return bin;
}
/*
 * Convert an array of big-endian words to a string
 */
function binb2str(bin) {
    var str = "";
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < bin.length * 32; i += chrsz)
        str += String.fromCharCode((bin[i >> 5] >>> (24 - i % 32)) & mask);
    return str;
}
/*
 * Convert an array of big-endian words to a hex string.
 */
function binb2hex(binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
        str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
    }
    return str;
}
/*
 * Convert an array of big-endian words to a base-64 string
 */
function binb2b64(binarray) {
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i += 3) {
        var triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16) | (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8) | ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF);
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
            else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
        }
    }
    return str;
}

Date.prototype.pattern=function(fmt) {
    var o = {
        "M+" : this.getMonth()+1, //月份
        "d+" : this.getDate(), //日
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
        "H+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S" : this.getMilliseconds() //毫秒
    };
    var week = {
        "0" : "/u65e5",
        "1" : "/u4e00",
        "2" : "/u4e8c",
        "3" : "/u4e09",
        "4" : "/u56db",
        "5" : "/u4e94",
        "6" : "/u516d"
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}