/**
 * Created by hyj on 2016/9/28.
 */

//require('babel-polyfill');
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
import Debugcard from "../container/cards/debugcard/debug"
import './App.css';
import fetch from 'isomorphic-fetch';
import { b64_sha1,jsondeepCopy } from '../util/util.js';
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
            margintop:20,
            userid: "user",
            username:"",
            buttonlist: [],
            iconlist:[],
            originalconf:[],
            tempconf:[],
            tempruncallback:null,
            shieldmsg:"",
            shielddisplay:"none",
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
                    "debugmodaltitle":"调试中",
                    "debugmodalcontent":"调试命令执行中，请稍候..."
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
                    "message5":"On Process,please wait!",
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
        this._footcallbackdebug=this.debugcard.bind(this);
        this._footcallbackhidedebug=this.hidedebugcard.bind(this);
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
        this.refs.Debugcard.update_language(language.debug);
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

        let _modal = document.getElementById("shieldsmall");
        let module_height = _modal.offsetHeight;
        if(((height - module_height)/2)>0){
            this.setState({margintop:parseInt((height - module_height)/2)});
        }


        this.setState({width:width,height:height,headfootheight:headfootheight,canvasheight:canvasheight});
        this.refs.head.update_size(headfootheight);
        this.refs.foot.update_size(headfootheight);
        this.refs.Loginview.update_size(width,canvasheight);
        this.refs.Basicview.update_size(width,canvasheight);
        this.refs.Languageview.update_size(width,canvasheight);
        this.refs.Systeminfocard.update_size(parseInt(width/3),canvasheight,headfootheight);
        this.refs.Debugcard.update_size(parseInt(width/3),canvasheight,headfootheight);
    }
    showshield(){
        this.setState({shielddisplay:"block"});
    }
    hideshield(){
        this.setState({shielddisplay:"none"});
    }
    updateshieldmsg(msg){
        this.setState({shieldmsg:msg});
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
    initializeBasic(callback,callbacksave,callbackgettempconf,callbacksavetempconf,callbackruntempconf
        ,callbackbuildgrid,
                    callbacksynctempconf,
                    callbacklasthistoryinfo){
        this.refs.Basicview.update_task_callback(callback,null,callbacksave,
            callbacksynctempconf,
            callbacklasthistoryinfo);
        this.refs.Basicview.update_result_callback(callbackgettempconf,callbacksavetempconf,callbackruntempconf);
        this.refs.Basicview.refs.Historycard.update_callback(callbackbuildgrid);
    }
    initializehead(){
        this.refs.head.update_username(this.state.username);
    }
    initializefoot(historycallback){
        this.refs.foot.updatecallback(historycallback);
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
        this.refs.foot.show_systeminfo_button(true);
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
    /*
    updatehistory(historylist){
        this.refs.Basicview.clearview();
        this.refs.Basicview.refs.Historycard.update_content(historylist);
    }*/
    historyview(historylist){
        this.refs.Basicview.historyview(historylist);
    }
    locationview(){
        this.refs.Basicview.locationview();
    }
    systeminfocard(){
        this.refs.Systeminfocard.switch_system_info();
    }
    debugcard(){
        this.refs.Debugcard.switch_system_info();
    }
    hidedebugcard(){
        this.refs.Debugcard.hide();
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
        //this.refs.Basicview.refs.Taskcard.updatetempconf(conf);
    }
    updateidentifyconf(conf){
        //this.setState({tempconf:conf,originalconf:conf},callback);
        this.refs.Basicview.refs.Taskcard.update_identify_conf(conf);
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
        let new_state = jsondeepCopy(this.state.tempconf);
        new_state[group_id]=change_value;
        this.setState({tempconf:new_state});
    }
    gettempconf(){
        return this.refs.Basicview.get_result_content();
    }
    showtemprunshield(){
        //this.refs.Basicview.refs.Resultviewcard.showshield();
        this.showshield();
        this.updateshieldmsg(this.state.language.message.message8);
        this.lockfoot(true);
    }
    hidetemprunshield(){
        //this.refs.Basicview.refs.Resultviewcard.hideshield();
        this.hideshield();
        this.lockfoot(false);
    }
    updatetemprunshield(msg){
        //this.refs.Basicview.refs.Resultviewcard.updateshieldmsg(msg);
        this.updateshieldmsg(msg);
    }
    updateresultcontentdirectly(content){
        this.refs.Basicview.refs.Resultviewcard.update_content(content);
    }
    updatecalibration(callbackmode,callbackrun,configure){
        this.refs.Basicview.refs.Locationcard.updatecalibration(callbackmode,callbackrun,configure);
    }
    updatedebug(callbackrun,configure){
        this.refs.Debugcard.updatedebug(callbackrun,configure);
    }
    calibrationmode(triger){
        if(triger){
            if(!this.refs.Basicview.refs.Locationcard.if_show()){
                this.refs.Basicview.locationview();
            }
                this.footButtonShow(false,false,false,false,false,false,false);
            this.refs.Debugcard.lockdebug(true);
                this.refs.Basicview.refs.Locationcard.updatecalimode(true);

        }else{
            this.refs.Basicview.refs.Locationcard.updatecalimode(false);
            this.refs.Debugcard.lockdebug(false);
            this.footButtonShow(false,false,true,true,true,true,true);
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

            <div className="shield-level" style={{position:"absolute",background:"rgba(55,55,55,0.4)",height:this.state.height,maxHeight:this.state.height,width:this.state.width,top:0,right:0,display:this.state.shielddisplay}}>
                <div className="container">
                    <div className="leaderboard" style={{marginTop: this.state.margintop}}>
                        <div className="panel panel-default" id="shieldsmall" >
                            <div className="panel-body">
                                <a><i className="fa fa-spinner fa-spin" style={{marginRight:15}}/>{this.state.shieldmsg}</a>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Alarmview ref="Alarmview"/>
            </div>
            <div>
                <Head ref="head" headcallbackuser={this._headcallbackuser}/>
            </div>
            <div>
                <Systeminfocard ref="Systeminfocard"/>
                <Debugcard ref="Debugcard"/>
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
                      footcallbackdebug={this._footcallbackdebug}
                      footcallbackhidedebug={this._footcallbackhidedebug}
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
            <div className="modal fade" id="DebugLock" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title" id="TempConfModalLabel">{this.state.language.app.debugmodaltitle}</h4>
                        </div>
                        <div className="modal-body" id="TempConfModalContent">
                            {this.state.language.app.debugmodalcontent}
                        </div>
                        <div className="clearfix"></div>
                        <div className="modal-footer">
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

updatexhchartcallback(historytaskinfofetch);
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
},1600);

var temp_inteval_handle = setInterval(function(){
    if(!temprun)return;
    else{
        gettempataskstatusfetch(app_handle.gettempconf());
    }
},5000);
syslanguagelistfetch();
var client;
//initialize_mqtt();
fetchmqtt();
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
            case "ZH_Medicine_Log_Update":
                update_log_test(ret.msg);
                return;
            case "ZH_Medicine_Realtime_Picture_Update":
                update_image_test(ret.msg,ret.blur);
                return;
            case "ZH_Medicine_Boot_start":
                location.reload(true);
                return;
            default:
                return;
        }
    });
}

function systemstart(){

    sysconffetch();
    caliconffetch();
    debugconffetch();

    systeminfofetch();
    getIdentifyconffetch();
    app_handle.initializefoot(historyfetch);
    app_handle.initializehead();
    app_handle.initializeLogin(zhmedlogin);
    app_handle.initializeBasic(taskrunfetch,
        footcallback_save,
        gettempconffetch,
        savetempconffetch,
        runtempanalysisfetch,
        buildgrid,
        synctempconffetch,
        lasthistoryinfofetch
        );
    app_handle.loginview();
    //update_log_test();
    if(winHeight < 768 || winWidth<1366){
        app_handle.revolution_alarm();
    }else{
        app_handle.revolution_solve();
    }
    updateclock();
}
var footcallback_back= function(){
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
    if(winHeight < 768 || winWidth<1366){
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

/*
function zhmedconfiglist(){

    var listreq = {
        action:"ZH_Medicine_config_list",
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
        .then(zhmedconfiglistcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}

function zhmedconfiglistcallback(res){
    if(res.jsonResult.status == "false"){
        alert(language.message.alert1);
        app_handle.initializeLogin(zhmedlogin);
        app_handle.loginview();
        return;
    }
    if(res.jsonResult.auth == "false"){
        return;
    }
    bricklist = res.jsonResult.ret.configure;
    baselist = res.jsonResult.ret.base;
    //app_handle.initializeBrick(bricklist,baselist,brickclickfetch,bricknewclickfetch);
    app_handle.brickview();
    tips("");
}
function brickclickfetch(configuration,type){
    var body = {
        type:type,
        file:configuration.name
    };
    var map={
        action:"ZH_Medicine_config_detail",
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
        action:"ZH_Medicine_config_detail",
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
}*/
function zhmedlogin(username,password){

    var body = {
    username:username,
    password:b64_sha1(password)
    };
    var map={
        action:"ZH_Medicine_Login",
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
        .then(zhmedlogincallback)
        //.then(fetchlist)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}

function zhmedlogincallback(res){
    if(res.jsonResult.status == "false"){
        alert(language.message.alert2);
        app_handle.initializeLogin(zhmedlogin);
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
    zhmedcheckcalimode();
    tips("");
}

function sysconffetch(){
    var map={
        action:"ZH_Medicine_sys_config",
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
        alert(res.jsonResult.msg);//alert(language.message.alert1);
        return;
    }
    if(res.jsonResult.auth == "false"){
        return;
    }
    let configuration = res.jsonResult.ret;

    app_handle.initializesysconf(zhmedsavesysconf,configuration);
    //app_handle.workview();
}

function zhmedsavesysconf(configure){

    var map={
        action:"ZH_Medicine_sys_config_save",
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
        .then(zhmedsavesysconfcallback)
        //.then(fetchlist)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}

function zhmedsavesysconfcallback(res){
    if(res.jsonResult.status == "false"){
        alert(language.message.alert9);
        return;
    }
    if(res.jsonResult.auth == "false"){
        return;
    }
    //zhmedconfiglist();
    sysconffetch();
    currentPanelfetch("");
    tips(language.message.message4);
}
function debugconffetch(){
    var map={
        action:"ZH_Medicine_debug_config",
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
        .then(debugconffetchcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function debugconffetchcallback(res){
    if(res.jsonResult.status == "false"){
        alert(res.jsonResult.msg);//alert(language.message.alert1);
        return;
    }
    if(res.jsonResult.auth == "false"){
        return;
    }
    let configuration = res.jsonResult.ret;

    //app_handle.updatecalibration(zhmedcalimode,zhmedruncaliconf,configuration);

    app_handle.updatedebug(zhmedrundebugconf,configuration);

}
function zhmedrundebugconf(command,conf){

    var map={
        action:"ZH_Medicine_debug_command",
        type:"mod",
        lang:default_language,
        body:{
            command:command,
            parameter:conf
        },
        user:app_handle.getuser()
    };

    modal_middlestatic($("#DebugLock"));
    $("#DebugLock").modal({backdrop: "static",keyboard: false,show:true});

    //$("#DebugLock").modal("show");
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(map)
        }).then(jsonParse)
        .then(zhmedrundebugconfcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function zhmedrundebugconfcallback(res){
    if(res.jsonResult.status == "false"){
        alert(res.jsonResult.msg);//alert(language.message.alert9);
        return;
    }
    if(res.jsonResult.auth == "false"){
        return;
    }
    $('.modal-backdrop').remove();
    $("#DebugLock").modal('hide');

    //TODO: Do not know what to do in this period
    console.log(res.jsonResult.msg);
}
function caliconffetch(){
    var map={
        action:"ZH_Medicine_cali_config",
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
        .then(caliconffetchcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function caliconffetchcallback(res){
    if(res.jsonResult.status == "false"){
        alert(res.jsonResult.msg);//alert(language.message.alert1);
        return;
    }
    if(res.jsonResult.auth == "false"){
        return;
    }
    let configuration = res.jsonResult.ret;

    app_handle.updatecalibration(zhmedcalimode,zhmedruncaliconf,configuration);

}
function zhmedruncaliconf(command,conf){
    var map={
        action:"ZH_Medicine_cali_command",
        type:"mod",
        lang:default_language,
        body:{
            command:command,
            parameter:conf
        },
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
        .then(zhmedruncaliconfcallback)
        .catch( (error) => {
            console.log('request error', error);
            console.log('request error', error);
            return { error };
        });
}
function zhmedruncaliconfcallback(res){
    if(res.jsonResult.status == "false"){
        alert(res.jsonResult.msg);//alert(language.message.alert9);
        return;
    }
    if(res.jsonResult.auth == "false"){
        return;
    }

    //TODO: Do not know what to do in this period
    console.log(res.jsonResult.msg);
}
function zhmedcalimode(triger,action){
    let x = "false"; if(triger) x= "true";
    var map={
        action:"ZH_Medicine_cali_mode",
        type:"mod",
        lang:default_language,
        body:{
            triger:x,
            action:action
        },
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
        .then(zhmedcalimodecallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function zhmedcalimodecallback(res){
    if(res.jsonResult.status == "false"){
        alert(res.jsonResult.msg);//alert(language.message.alert9);
        return;
    }
    if(res.jsonResult.auth == "false"){
        return;
    }
    let output = true;
    if(res.jsonResult.ret == "false") output = false;
    app_handle.calibrationmode(output);
    if(output === false){
        clearwebview();
        caliconffetch();
    }
}
function zhmedcheckcalimode(){
    var map={
        action:"ZH_Medicine_cali_mode",
        type:"mod",
        lang:default_language,
        body:"check",
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
        .then(zhmedcheckcalimodecallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function zhmedcheckcalimodecallback(res){
    if(res.jsonResult.status == "false"){
        alert(res.jsonResult.msg);//alert(language.message.alert9);
        return;
    }
    if(res.jsonResult.auth == "false"){
        return;
    }
    if(res.jsonResult.ret == "true")
        app_handle.calibrationmode(true);
    else{
        app_handle.taskview();
    }

}
function footcallback_save(){
    zhmedsavesysconf(app_handle.getsysconfset());

}
function modal_middle(modal){

    setTimeout(function () {
        var _modal = $(modal).find(".modal-dialog");
        if(parseInt(($(window).height() - _modal.height())/2)>0){

            _modal.animate({'margin-top': parseInt(($(window).height() - _modal.height())/2)}, 300 );
        }
    },wait_time_short);
}
function modal_middlestatic(modal){
    var _modal = $(modal).find(".modal-dialog");
    _modal.css('marginTop', parseInt(($(window).height() - 150)/2));
    setTimeout(function () {
        if(parseInt(($(window).height() - _modal.height())/2)>0){

            //_modal.animate({'margin-top': parseInt(($(window).height() - _modal.height())/2)}, 100 );
            _modal.css('marginTop', parseInt(($(window).height() - _modal.height())/2));
        }
    },wait_time_short);

        //_modal.modal({backdrop: "static",keyboard: false});
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
        action:"ZH_Medicine_sys_language",
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
        action:"ZH_Medicine_sys_language_list",
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
        action:"ZH_Medicine_sys_version",
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
        action:"ZH_Medicine_change_passwd",
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
        action:"ZH_Medicine_get_user_list",
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
        action:"ZH_Medicine_reset_user",
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
        action:"ZH_Medicine_new_user",
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
        action:"ZH_Medicine_del_user",
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
        action:"ZH_Medicine_remove_alarm",
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
function fetchmqtt(){
    var map={
        action:"ZH_Medicine_mqtt_conf",
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
function update_log_test(str){
    /**
    setInterval(function(){
        let x = GetRandomNum(5,50);
        let str = "["+x+"]:";
        for(let i=0;i<x;i++){
            str = str + "x ";
        }
        app_handle.update_logs(str);
    },4000);*/
    app_handle.update_logs(str);
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
function lasthistoryinfofetch(panel){
    var map={
        action:"ZH_Medicine_last_history",
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
        .then(lasthistoryinfofetchcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function lasthistoryinfofetchcallback(res){
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
function taskrunfetch(bool,shoot,analysis,parameter){
    let status = "false";
    if(bool) status = "true";
    let panel = app_handle.getpanel();
    if(panel.picture.length === 0) return;
    panel.basic.parameter = parameter;
    var map={
        action:"ZH_Medicine_task_run",
        type:"query",
        body:{
            configure:panel,
            status:status,
            shoot:shoot,
            analysis:analysis
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
function getIdentifyconffetch(){
    var map={
        action:"ZH_Medicine_get_identify_conf",
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
        .then(getIdentifyconffetchcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function getIdentifyconffetchcallback(res){
    if(res.jsonResult.status == "false"){
        alert("Fetal Error, Can not get system info!");
        windows.close();
    }
    if(res.jsonResult.auth == "false"){
        alert("Fetal Error, Can not get system info!");
        windows.close();
    }
    let conf = res.jsonResult.ret;
    app_handle.updateidentifyconf(conf);
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
function synctempconffetch(conf){
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
    getIdentifyconffetch()
    tips(language.message.message7);

}
function historyfetch(){
    var map={
        action:"ZH_Medicine_history_list",
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
        .then(historyfetchcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function historyfetchcallback(res){
    if(res.jsonResult.status == "false"){
        alert("Fetal Error, Can not get system info!");
        windows.close();
    }
    if(res.jsonResult.auth == "false"){
        alert("Fetal Error, Can not get system info!");
        windows.close();
    }
    app_handle.historyview( res.jsonResult.ret);
    //tips(language.message.message7);

}
function historytaskinfofetch(batch){
    var map={
        action:"ZH_Medicine_history_task_info",
        type:"query",
        body:{
            batch:batch
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
        .then(historytaskinfofetchcallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function historytaskinfofetchcallback(res){
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
    app_handle.taskview();
    //app_handle.setpanel(task.configure);
}
function showtempmodal(){
    modal_middle($('#TempConf'));
    $('#TempConf').modal('show') ;
}


/**
 * for image_show
 */
//var socket = io.connect();
var start = 249;
var startid=0;
function update_image_test(src,blur){
    var coverid = startid;
    var imageid = startid+1;
    if(imageid>9) imageid = 0;
    var imgcover = document.getElementById("img"+coverid);
    var img = document.getElementById("img"+imageid);
    var blur_handle = document.getElementById("blurvalue");
    if(img === null || img === undefined){
        console.log("imgview can not find")
        return;
    }
    var radom = GetRandomNum(100000,999999);
    //var img = document.createElement('img');
    img.src = src+"?"+radom;
    img.onload = function(){
        imgcover.style.zIndex= imgcover.style.zIndex -10;
        blur_handle.innerHTML="blur:"+blur;
        if(imgcover.style.zIndex<=50){
            for(let i=0;i<10;i++){
                let image_handle = document.getElementById("img"+i); //need optimize
                image_handle.style.zIndex= 249 -i;
            }
        }

    };



    startid = imageid;

}
/*
function update_image_test(src,blur){
    var image_handle = document.getElementById("imgview");
    var blur_handle = document.getElementById("blurvalue");
    if(image_handle === null || image_handle === undefined){
        console.log("imgview can not find")
        return;
    }
    var img = document.createElement('img');
    img.src = src;
    img.style="position: absolute; left: 10px; top: 20px;z-index: "+(start--);
    img.onload = function(){
        window.URL.revokeObjectURL(src);
    };
    //removeAllChild(document.body);
    image_handle.appendChild(img);
    image_handle.removeChild(image_handle.firstChild);
    blur_handle.innerHTML="blur:"+blur;
    if(start==0) start = 199;
}*/
/*
socket.on('news',function(data){

    var image_handle = document.getElementById("imgview");
    if(image_handle === null || image_handle === undefined){
        console.log("imgview can not find")
        return;
    }
    var blob = new Blob([data.shuju],{"type":"image\/jpeg"});
    var src = window.URL.createObjectURL(blob);
    var img = document.createElement('img');
    img.src = src;
    img.style="position: absolute; left: 10px; top: 20px;z-index: "+(start--);
    img.onload = function(){
        window.URL.revokeObjectURL(src);
    };
    console.log("add image");
    //removeAllChild(document.body);
    image_handle.appendChild(img);
    image_handle.removeChild(image_handle.firstChild);
    if(start==-99) start = 99;
});*/
function clearwebview(){
    for(var i=0;i<10;i++){
        var image_handle = document.getElementById("img"+i);
        image_handle.src = "./img/default.jpg";
        image_handle.style.zIndex= 249 -i;
    }
    var blur_handle = document.getElementById("blurvalue");
    blur_handle.innerHTML="";
    /*
    var image_handle = document.getElementById("imgview");
    var blur_handle = document.getElementById("blurvalue");
    removeAllChild(image_handle);
    var src = "./img/default.jpg";
    var img = document.createElement('img');
    img.src = src;
    img.style="position: absolute; left: 10px; top: 20px;z-index: 99";
    image_handle.appendChild(img);
    blur_handle.innerHTML="";
    start = 199;*/
}
function removeAllChild(_element)  {

    while(_element.hasChildNodes()) //当div下还存在子节点时 循环继续
    {
        _element.removeChild(_element.firstChild);
    }

}
function buildgrid(content){
    updatexhchartcontent(content);
}


