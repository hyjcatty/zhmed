/**
 * Created by Huang Yuanjie on 2019/1/5.
 */
/**
 * Created by hyj on 2016/12/22.
 */

/**
 * Created by hyj on 2016/9/29.
 */
import React, {
    Component,
    PropTypes
} from 'react';

import classNames from 'classnames';
import '../../../../resource/css/font-awesome.min.css';



export default class taskcard extends Component {
    constructor(props) {
        super(props);
        this.state={
            height:700,
            width:600,
            margin:75,
            hide:"none",
            animate:"animated fadeInLeft",
            callback:null,
            footcallback:null,
            synccallback:null,
            historycallback:null,
            margintop:20,
            disabled:"",
            disabledreset:"",
            key:"taskinfo",
            identify:{

            },
            parameter:[
                {"title":"状态1","value":"123","alarm":false},
                {"title":"状态2","value":"123","alarm":false},
                {"title":"状态3","value":"123","alarm":false},
                {"title":"状态4","value":"123","alarm":false},
                {"title":"状态5","value":"123","alarm":false},
                {"title":"状态6","value":"123","alarm":false},
                {"title":"状态7","value":"123","alarm":false}
            ],
            configure:null,
            running:false,

            language:{
                "systemparameter":"系统识别参数",
                "taskparameter":"当前批次识别参数",
                "taskresult":"分析结果",
                "usesystem":"使用系统参数",
                "onlyshoot":"仅拍照",
                "start":"开始",
                "stop":"停止",
                "reset":"重置点位",
                "analysis":"重新分析",
                "lasthistory":"上次数据",
                "parametersync":"同步设置",
                "batch":"批次",
                "date":"日期",
                "owner":"操作人",
                "tupid":"TUPID"
            }
        };

        this.bufferstate={};
        this.transform = false;

        this.timeout = 1200;
    }
    update_timeout(timeout){
        this.timeout=timeout;
    }

    syncSetState(state,callback){
        if(!this.transform){
            this.setState(state,callback);
        }else{
            Object.assign(this.bufferstate,state);
        }
    }
    update_language(language){
        this.syncSetState({language:language});
    }
    update_size(width,height,margin){
        this.syncSetState({height:height,width:width,margin:margin});
    }
    get_batch_info(){
        if(this.state.configure === null) return [];
        else{
            let temp = [];
            temp.push({
                "title":this.state.language.batch,
                "value":this.state.configure.basic.batch
            });
            temp.push({
                "title":this.state.language.date,
                "value":this.state.configure.basic.date
            });
            temp.push({
                "title":this.state.language.owner,
                "value":this.state.configure.basic.owner
            });
            temp.push({
                "title":this.state.language.tupid,
                "value":this.state.configure.basic.tupid
            });
            for(let i=0; i < this.state.configure.basic.extra.length;i++){
                temp.push(this.state.configure.basic.extra[i]);
            }
            return temp;
        }
    }
    transformcallback(){
        this.transform=false;
        if(this.bufferstate !== {})
        this.syncSetState(this.bufferstate,function(){
            this.bufferstate = {};
        })
    }
    update_configure(task){
        let x = false;
        if(task.running==="true"){
            console.log("task set running true");
            this.props.basiccallbacklockfoot(true);
            x=true;

        }
        else this.props.basiccallbacklockfoot(false);
        this.syncSetState({running:x,configure:task.configure},this.switchery_initialize);
        this.set_running(x);
        //console.log("Update task"+JSON.stringify(task.configure));
    }
    update_identify_conf(identify){
        this.syncSetState({identify:identify});
    }
    update_configure_panel(configure){
        this.syncSetState({configure:configure});
    }
    update_callback(callback,footcallback,
                    callbacksynctempconf,
                    callbacklasthistoryinfo){
        this.syncSetState({callback:callback,footcallback:footcallback
        ,synccallback:callbacksynctempconf,historycallback:callbacklasthistoryinfo});
    }
    set_running(bool){
        if(bool){
            this.syncSetState({running:true,disabledreset:"disabled"});
        }else
            this.syncSetState({running:false,disabledreset:""});
    }
    get_running(){
        return this.state.running;
    }

    hide(){
        if(this.state.hide === "none") return;
        else{
            this.syncSetState({animate:"animated fadeOutLeft"});
            this.transform=true;
            let self = this;
            setTimeout(function(){
                self.setState({hide:"none"},
                    self.transformcallback);
            },this.timeout);
        }
        //this.syncSetState({hide:"none"});
    }
    show(){
        //this.syncSetState({hide:"block"});
        if(this.state.hide === "block") return;
        else{

            this.syncSetState({hide:"block",animate:"animated fadeInLeft"});
            this.transform=true;
            let self = this;
            setTimeout(function(){
                self.transformcallback();
            },this.timeout);
        }
    }
    switch_system_info(){
        if(this.state.hide == "none"){
            this.syncSetState({hide:"block",animate:"animated fadeInLeft"});
        }else{
            this.syncSetState({animate:"animated fadeOutleft"});
            let self = this;
            setTimeout(function(){
                self.syncSetState({hide:"none"});
            },this.timeout);
        }
    }
    switchery_initialize(){
        $(".task-conf-checkbox-label").each(function(){
            $(this).find("span").each(function(){
                $(this).remove();
            });
        });
        /*
         let switchery_list = $("#preemption_tab").find("span").each(function(){
         $(this).remove();
         });*/
        if(this.state.configure!==null){
            /*
            for(let i=0;i<this.state.configure.parameter.groups.length;i++){
                for(let j=0;j<this.state.configure.parameter.groups[i].list.length;j++){
                    if(this.state.configure.parameter.groups[i].list[j].type === "checkbox"){
                        $("#"+this.state.key2+"G"+i+"P"+j+this.state.configure.parameter.groups[i].list[j].type).prop("checked",this.state.configure.parameter.groups[i].list[j].value);
                    }
                }

            }*/
            $("#checkboxonlycheck").prop("checked",false);
            $("#checkboxonlyidentifypara").prop("checked",false);
        }

        if ($(".task_conf_checkbox")[0]) {
            var elems = Array.prototype.slice.call(document.querySelectorAll('.task_conf_checkbox'));
            //console.log("switchery list lenght:"+elems.length);
            elems.forEach(function (html) {
                var switchery = new Switchery(html, {
                    color: '#26B99A'
                });
            });
        }
    }
    getUpdatedValue(){
        let tempconf = {
            "onlyshoot":false,
            "usesystem":false
        };
        tempconf.onlyshoot = $("#checkboxonlycheck").is(":checked");
        tempconf.usesystem = $("#checkboxonlyidentifypara").is(":checked");

        return tempconf;
    }
    handle_click(){
        this.syncSetState({disabled:"disabled"});
        if(this.get_running()){
            this.state.callback(false,false,false,this.state.identify);
        }else{
            let temp = this.getUpdatedValue;
            let temppara = this.state.identify;
            if(!$.isEmptyObject(this.state.configure.basic.parameter) && temp.usesystem ){
                temppara = this.state.configure.basic.parameter;
            }
            if(temp.onlyshoot){
                this.state.callback(true,true,false,temppara);
            }else{
                this.state.callback(true,true,true,temppara);
            }
        }
        setTimeout(function(){
            this.syncSetState({disabled:""});
        }.bind(this),this.timeout);
        //console.log("click start button");
    }
    handle_analysis(){
        if(this.get_running()){
            return;
        }else{

            this.syncSetState({disabled:"disabled"});
            let temp = this.getUpdatedValue;
            let temppara = this.state.identify;
            if(!$.isEmptyObject(this.state.configure.basic.parameter) && temp.usesystem ){
                temppara = this.state.configure.basic.parameter;
            }
            this.state.callback(true,false,true,temppara);

            setTimeout(function(){
                this.syncSetState({disabled:""});
            }.bind(this),this.timeout);
        }
    }
    handle_sync(){
        if($.isEmptyObject(this.state.configure.basic.parameter))return;
        this.state.synccallback(this.state.configure.basic.parameter);
    }
    handle_history(){
        this.state.historycallback();
    }
    handle_reset(){
        //console.log("click reset button");
        this.props.taskcallbackreset();
    }
    handleChangecheck(){

    }
    render() {
        if(this.state.configure== null){
            return (
                <div className={this.state.animate} style={{position:"absolute",background:"#FFFFFF",height:this.state.height,maxHeight:this.state.height,width:this.state.width,top:0,left:0,display:this.state.hide,overflow:'scroll',overflowX:'hidden',overflowY:'hidden',zIndex:"99",willChange: "transform, opacity"}}>

                </div>
            );
        }
        /*
        let center_panel=[];
        for(let i=0;i<this.state.parameter.length;i++){
            let temp = <h3 style={{fontSize:15,marginRight:5,color:"#333"}}  key={this.state.key+i}>{this.state.parameter[i].title+":"+this.state.parameter[i].value}</h3>
            if(this.state.parameter[i].alarm)
                temp = <h3 style={{fontSize:15,marginRight:5,color:"#FF6633"}}  key={this.state.key+i}>{this.state.parameter[i].title+":"+this.state.parameter[i].value}</h3>
            center_panel.push(temp);
        }*/
        let sysindentify = [];

        for(let i in this.state.identify){
            let temp = <h3 style={{fontSize:15,marginRight:5,color:"#333"}}  key={this.state.key+i}>{i+":"+this.state.identify[i]}</h3>
            sysindentify.push(temp);
        }
        let sysindentifyblock=
            <div className="col-xs-12 col-md-12 col-sm-12 col-lg-12" key="firstblock" style={{height:this.state.height/6}}>
                <div className="tile-stats"  style={{marginTop:"15px"}}>
                    <div className="count" style={{fontSize:24}}>{this.state.language.systemparameter}</div>
                    <div style={{height:this.state.height/6-73,overflow:'scroll',overflowX:'hidden',overflowY:'scroll'}}>
                        {sysindentify}
                    </div>
                </div>
            </div>
        let batchindentifyblock = <div key="secondblock"></div>
        //console.log("this.state.configure.basic.parameter:["+this.state.configure.basic.parameter.toString()+"]")
        if(!$.isEmptyObject(this.state.configure.basic.parameter)){
            let batchindentify = [];
            for(let i in this.state.configure.basic.parameter){
                let temp = <h3 style={{fontSize:15,marginRight:5,color:"#333"}}  key={this.state.key+i}>{i+":"+this.state.identify[i]}</h3>
                batchindentify.push(temp);
            }
            batchindentifyblock=
                <div className="col-xs-12 col-md-12 col-sm-12 col-lg-12" key="secondblock" style={{height:this.state.height/6}}>
                    <div className="tile-stats"  style={{marginTop:"15px"}}>
                        <div className="count" style={{fontSize:24}}>{this.state.language.taskparameter}</div>
                        <div style={{height:this.state.height/6-73,overflow:'scroll',overflowX:'hidden',overflowY:'scroll'}}>

                            {batchindentify}
                        </div>
                    </div>
                </div>
        }

        let analysisresult = <div key="thirdblock"></div>
        let info_list = this.get_batch_info();
        if(this.state.configure.basic.batch!=""){
            let task_detai=[];
            for(let i=0;i<info_list.length;i++){
                let temp = <h3 style={{fontSize:15,marginRight:5,color:"#333"}}  key={this.state.key+i}>{info_list[i].title+":"+info_list[i].value}</h3>
                task_detai.push(temp);
            }
            analysisresult=
                <div className="col-xs-12 col-md-12 col-sm-12 col-lg-12" key="thirdblock" style={{height:this.state.height/6}}>
                    <div className="tile-stats"  style={{marginTop:"15px"}}>
                        <div className="count" style={{fontSize:24}}>{this.state.language.taskresult}</div>
                        <div style={{height:this.state.height/6-73,overflow:'scroll',overflowX:'hidden',overflowY:'scroll'}}>
                            {task_detai}
                        </div>

                    </div>
                </div>
        }
        let checkshoot =
            <div className="col-xs-6 col-md-6 col-sm-6 col-lg-6" key="check1">
                <div className="count" style={{fontSize:20,marginTop:15,verticalAlign:'bottom',width:"90%"}} >
                    <div>
                        <label className="task-conf-checkbox-label" style={{fontSize: "16px",color:"#555"}}>
                            {this.state.language.onlyshoot+":"}&nbsp;&nbsp;&nbsp;&nbsp;
                            <input type="checkbox" id={"checkboxonlycheck"} className="js-switch task_conf_checkbox" onChange={this.handleChangecheck.bind(this)} data-switchery="true" value="on" disabled={this.state.disabledreset}/>
                        </label>
                    </div></div></div>;
        let checkidentifyparadisplay = "none";
        if(!$.isEmptyObject(this.state.configure.basic.parameter)) checkidentifyparadisplay = "block";

        let checkidentifypara =
            <div className="col-xs-6 col-md-6 col-sm-6 col-lg-6" key="check2" style={{display:checkidentifyparadisplay}}>
                <div className="count" style={{fontSize:20,marginTop:15,verticalAlign:'bottom',width:"90%"}} >
                    <div>
                        <label className="task-conf-checkbox-label" style={{fontSize: "16px",color:"#555"}}>
                            {this.state.language.usesystem+":"}&nbsp;&nbsp;&nbsp;&nbsp;
                            <input type="checkbox" id={"checkboxonlyidentifypara"} className="js-switch task_conf_checkbox" onChange={this.handleChangecheck.bind(this)} data-switchery="true" value="on" disabled={this.state.disabledreset}/>
                        </label>
                    </div></div></div>;
        let button_text = this.state.language.start;
        if(this.state.running) button_text = this.state.language.stop;
        let buttonstart =
            <div className="col-xs-6 col-md-6 col-sm-6 col-lg-6" key={"buttonstart"}>
                <button  type="button" className="btn btn-warning btn-sm pull-left"
                         style={{marginLeft:"10px",marginTop:"15px",height:60,width:"90%"}}
                         onClick={this.handle_click.bind(this)} disabled={this.state.disabled}>
                    <i style={{color:"#ffffff",fontSize:"15px",fontWeight:"bold"}}>
                        {button_text}</i>
                </button>
            </div>
        let buttonpoint =
            <div className="col-xs-6 col-md-6 col-sm-6 col-lg-6" key={"buttonpoint"}>
                <button  type="button" className="btn btn-warning btn-sm pull-left"
                         style={{marginLeft:"10px",marginTop:"15px",height:60,width:"90%"}}
                         onClick={this.handle_reset.bind(this)} disabled={this.state.disabledreset}>
                    <i style={{color:"#ffffff",fontSize:"15px",fontWeight:"bold"}}>
                        {this.state.language.reset}</i>
                </button>
            </div>
        let displaybuttonanalysis = "none";
        if(this.state.configure.basic.batch!=""){ displaybuttonanalysis = "block";}
        let buttonanalysis =
            <div className="col-xs-6 col-md-6 col-sm-6 col-lg-6" key={"buttonanalysis"} style={{display:displaybuttonanalysis}}>
                <button  type="button" className="btn btn-warning btn-sm pull-left"
                         style={{marginLeft:"10px",marginTop:"15px",height:60,width:"90%"}}
                         onClick={this.handle_analysis.bind(this)} disabled={this.state.disabledreset}>
                    <i style={{color:"#ffffff",fontSize:"15px",fontWeight:"bold"}}>
                        {this.state.language.analysis}</i>
                </button>
            </div>

        let displaybuttonsync = "none";
        if(!$.isEmptyObject(this.state.configure.basic.parameter)){ displaybuttonsync = "block";}
        let buttonsync =
            <div className="col-xs-6 col-md-6 col-sm-6 col-lg-6" key={"buttonsync"} style={{display:displaybuttonsync}}>
                <button  type="button" className="btn btn-warning btn-sm pull-left"
                         style={{marginLeft:"10px",marginTop:"15px",height:60,width:"90%"}}
                         onClick={this.handle_sync.bind(this)} disabled={this.state.disabledreset}>
                    <i style={{color:"#ffffff",fontSize:"15px",fontWeight:"bold"}}>
                        {this.state.language.parametersync}</i>
                </button>
            </div>
        let buttonhistory =
            <div className="col-xs-6 col-md-6 col-sm-6 col-lg-6" key={"buttonhistory"} >
                <button  type="button" className="btn btn-warning btn-sm pull-left"
                         style={{marginLeft:"10px",marginTop:"15px",height:60,width:"90%"}}
                         onClick={this.handle_history.bind(this)} disabled={this.state.disabledreset}>
                    <i style={{color:"#ffffff",fontSize:"15px",fontWeight:"bold"}}>
                        {this.state.language.lasthistory}</i>
                </button>
            </div>

        return (
            <div className={this.state.animate} style={{position:"absolute",background:"#FFFFFF",height:this.state.height,maxHeight:this.state.height,width:this.state.width,top:0,left:0,display:this.state.hide,overflow:'scroll',overflowX:'hidden',overflowY:'hidden',zIndex:"99",willChange: "transform, opacity"}}>
                {sysindentifyblock}
                {batchindentifyblock}
                {analysisresult}
                <div className="col-xs-12 col-md-12 col-sm-12 col-lg-12" style={{height:5}} ></div>
                {checkshoot}
                {checkidentifypara}
                <div className="col-xs-12 col-md-12 col-sm-12 col-lg-12" style={{height:5}} ></div>
                {buttonstart}{buttonpoint}{buttonanalysis}{buttonsync}{buttonhistory}
            </div>
        );





/*

        let button_text = this.state.language.start;
        let task_information =[];
        if(this.state.configure!= null && this.state.configure.basic.batch != ""){
            let task_detai=[];
            let info_list = this.get_batch_info();
            for(let i=0;i<info_list.length;i++){
                let temp = <h3 style={{fontSize:15,marginRight:5,color:"#333"}}  key={this.state.key+i}>{this.state.parameter[i].title+":"+this.state.parameter[i].value}</h3>
                task_detai.push(temp);
            }
            task_information=
                <div className="col-xs-12 col-md-12 col-sm-12 col-lg-12" key="status-second">
                    <div className="tile-stats"  style={{marginTop:"15px"}}>
                        <div className="count" style={{fontSize:24}}>{this.state.language.taskinfo}</div>
                        {task_detai}
                    </div>
                </div>
        }
        if(this.state.running) button_text = this.state.language.stop;
        return (
            <div className={this.state.animate} style={{position:"absolute",background:"#FFFFFF",height:this.state.height,maxHeight:this.state.height,width:this.state.width,top:0,left:0,display:this.state.hide,overflow:'scroll',overflowX:'hidden',overflowY:'hidden',zIndex:"99",willChange: "transform, opacity"}}>
                <div className="col-xs-12 col-md-12 col-sm-12 col-lg-12" key="status-top">
                    <div className="tile-stats"  style={{marginTop:"15px"}}>
                        <div className="count" style={{fontSize:24}}>{this.state.language.taskparameter}</div>
                        {center_panel}
                    </div>
                </div>
                {task_information}
                <div className="col-xs-12 col-md-12 col-sm-12 col-lg-12" key="status-bottom">
                    <button  type="button" className="btn btn-warning btn-sm pull-left" style={{marginLeft:(this.state.width*0.1-5),marginTop:"5px",height:(this.state.width-10)*0.2,width:(this.state.width-10)*0.8}} disabled={this.state.disabled} onClick={this.handle_click.bind(this)}>
                        <i style={{fontSize:25}}> {button_text}</i>
                    </button>
                    <button  type="button" className="btn btn-warning btn-sm pull-left" style={{marginLeft:(this.state.width*0.1-5),marginTop:"5px",height:(this.state.width-10)*0.2,width:(this.state.width-10)*0.8}} disabled={this.state.disabledreset} onClick={this.handle_reset.bind(this)}>
                        <i style={{fontSize:25}}> {this.state.language.reset}</i>
                    </button>
                </div>
            </div>
        );*/
    }
}