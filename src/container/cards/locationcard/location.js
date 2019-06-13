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
import { jsondeepCopy } from '../../../util/util.js';



export default class locationcard extends Component {
    constructor(props) {
        super(props);
        this.state={
            height:700,
            width:600,
            margin:75,
            hide:"none",
            animate:"animated fadeInLeft",
            callback:null,
            margintop:20,
            content:[],
            key:"locationinfo",

            key2:"location_conf_input",
            callbackmode:null,
            callbackrun:null,
            calimode:false,
            configure:null,
            language:{
                "locationinfo":"位置校准",
                "buttoncalimodeyes":"进入校准模式",
                "buttoncalimodeno":"保存并离开",
                "buttoncalimodecancel":"放弃并离开"
            }
        }

        this.timeout = 1200;
    }
    update_timeout(timeout){
        this.timeout=timeout;
    }
    if_show(){
        if(this.state.hide === "none") return false;
        else return true;
    }
    update_language(language){
        this.setState({language:language});
    }
    update_size(width,height,margin){
        this.setState({height:height,width:width,margin:margin});
    }
    updatecalibration(callbackmode,callbackrun,configure){
        this.setState({callbackmode:callbackmode,callbackrun:callbackrun,configure:configure},this.switchery_initialize);
    }
    updatecalimode(calimode){
        this.setState({calimode:calimode},this.switchery_initialize);
    }
    update_content(content){
        this.setState({content:content},this.switchery_initialize);
    }
    hide(){
        if(this.state.hide === "none") return;
        else{
            this.setState({animate:"animated fadeOutLeft"});
            let self = this;
            setTimeout(function(){
                self.setState({hide:"none"});
            },this.timeout);
        }
        //this.setState({hide:"none"});
    }
    show(){
        //this.setState({hide:"block"});
        if(this.state.hide === "block") return;
        else{
            this.setState({hide:"block",animate:"animated fadeInLeft"});
        }
    }
    switch_system_info(){
        if(this.state.hide == "none"){
            this.setState({hide:"block",animate:"animated fadeInLeft"});
        }else{
            this.setState({animate:"animated fadeOutleft"});
            let self = this;
            setTimeout(function(){
                self.setState({hide:"none"});
            },this.timeout);
        }
    }
    handle_click_send(event){
        let i = parseInt(event.target.getAttribute("data-i-series"));
        let j = parseInt(event.target.getAttribute("data-j-series"));
        console.log(this.state.configure.parameter.groups[i].list[j].action);
        this.state.callbackrun(this.state.configure.parameter.groups[i].list[j].action,this.getUpdatedValue());
    }
    handle_click_mode(){
        this.state.callbackmode(!this.state.calimode,"save");
    }
    handle_click_cancel(){
        this.state.callbackmode(!this.state.calimode,"cancel");
    }
    getUpdatedValue(){
        let config = this.state.configure;
        for(let i=0;i<config.parameter.groups.length;i++){
            for(let j=0;j<config.parameter.groups[i].list.length;j++){
                if(config.parameter.groups[i].list[j].type === "int"){
                    config.parameter.groups[i].list[j].value=$("#"+this.state.key2+"G"+i+"P"+j+config.parameter.groups[i].list[j].type).val();
                }
                if(config.parameter.groups[i].list[j].type === "float"){
                    config.parameter.groups[i].list[j].value=$("#"+this.state.key2+"G"+i+"P"+j+this.state.configure.parameter.groups[i].list[j].type).val();
                }
                if(this.state.configure.parameter.groups[i].list[j].type === "string"){
                    this.state.configure.parameter.groups[i].list[j].value=$("#"+this.state.key2+"G"+i+"P"+j+this.state.configure.parameter.groups[i].list[j].type).val();
                }
                if(this.state.configure.parameter.groups[i].list[j].type === "choice"){
                    this.state.configure.parameter.groups[i].list[j].value=$("#"+this.state.key2+"G"+i+"P"+j+this.state.configure.parameter.groups[i].list[j].type).get(0).selectedIndex+"";//val();
                }
                if(this.state.configure.parameter.groups[i].list[j].type === "checkbox"){
                    this.state.configure.parameter.groups[i].list[j].value=$("#"+this.state.key2+"G"+i+"P"+j+this.state.configure.parameter.groups[i].list[j].type).is(":checked");
                }
            }
        }
        return config;
    }
    handleChange(e){
        let change_value = e.target.value;
        let group_id= parseInt(e.target.getAttribute('data-group'));
        let parameter_id= parseInt(e.target.getAttribute('data-parameter'));

        let new_state = jsondeepCopy(this.state.configure);
        new_state.parameter.groups[group_id].list[parameter_id].value=change_value;
        this.setState({configure:new_state});
    }
    handleBlur(){

    }
    switchery_initialize(){
        $(".location-conf-checkbox-label").each(function(){
            $(this).find("span").each(function(){
                $(this).remove();
            });
        });
        /*
         let switchery_list = $("#preemption_tab").find("span").each(function(){
         $(this).remove();
         });*/
        if(this.state.configure!==null){

            for(let i=0;i<this.state.configure.parameter.groups.length;i++){
                for(let j=0;j<this.state.configure.parameter.groups[i].list.length;j++){
                    if(this.state.configure.parameter.groups[i].list[j].type === "checkbox"){
                        $("#"+this.state.key2+"G"+i+"P"+j+this.state.configure.parameter.groups[i].list[j].type).prop("checked",this.state.configure.parameter.groups[i].list[j].value);
                    }
                }

            }
        }

        if ($(".location_conf_checkbox")[0]) {
            var elems = Array.prototype.slice.call(document.querySelectorAll('.location_conf_checkbox'));
            //console.log("switchery list lenght:"+elems.length);
            elems.forEach(function (html) {
                var switchery = new Switchery(html, {
                    color: '#26B99A'
                });
            });
        }
    }
    handleChangecheck(){

    }
    componentDidUpdate(){
        //this.switchery_initialize();
    }
    render() {

        let groups1 = [];

        let grougs1size=0;
        let modebutton =
            <div className="col-xs-6 col-md-6 col-sm-6 col-lg-6" >
            <button  type="button" className="btn btn-warning btn-sm pull-left"
                     style={{marginLeft:"5px",marginTop:"5px",height:(this.state.height*0.1),width:"90%"}}
                     onClick={this.handle_click_mode.bind(this)}>
                <i style={{color:"#ffffff",fontSize:"15px",fontWeight:"bold"}}>
                    {this.state.language.buttoncalimodeyes}</i>
            </button>
        </div>;
        let disabled = "disabled";
        let button = [];
        if(this.state.calimode) {
            disabled = "";
            modebutton = [];
            modebutton.push(
                <div className="col-xs-6 col-md-6 col-sm-6 col-lg-6" key="calisave">
                    <button  type="button" className="btn btn-warning btn-sm pull-left"
                             style={{marginLeft:"5px",marginTop:"5px",height:(this.state.height*0.1),width:"90%"}}
                             onClick={this.handle_click_mode.bind(this)} >
                        <i style={{color:"#ffffff",fontSize:"15px",fontWeight:"bold"}}>
                            {this.state.language.buttoncalimodeno}</i>
                    </button>
                </div>);
            modebutton.push(
                <div className="col-xs-6 col-md-6 col-sm-6 col-lg-6" key="calicancel">
                        <button  type="button" className="btn btn-warning btn-sm pull-left"
                    style={{marginLeft:"5px",marginTop:"5px",height:(this.state.height*0.1),width:"90%"}}
                    onClick={this.handle_click_cancel.bind(this)} >
                <i style={{color:"#ffffff",fontSize:"15px",fontWeight:"bold"}}>
                    {this.state.language.buttoncalimodecancel}</i>
                </button>
                </div>
            );
        }
        if(this.state.configure!= null){

            for(let i=0;i<this.state.configure.parameter.groups.length;i++){
                let param = [];
                for(let j=0;j<this.state.configure.parameter.groups[i].list.length;j++){
                    if(this.state.configure.parameter.groups[i].list[j].type === "block"){
                        param.push(
                            <div className="col-xs-3 col-md-3 col-sm-3 col-lg-3" key={"block"+i+""+j}>
                                <div style={{height:75,width:"100%"}}/>
                            </div>
                        );
                    }
                    if(this.state.configure.parameter.groups[i].list[j].type === "button"){
                        param.push(
                            <div className="col-xs-3 col-md-3 col-sm-3 col-lg-3" key={"button"+i+""+j}>
                                <button  type="button" className="btn btn-warning btn-sm pull-left"
                                         style={{marginLeft:"10px",marginTop:"15px",height:60,width:"90%"}}
                                         data-i-series={""+i} data-j-series={""+j} onClick={this.handle_click_send.bind(this)}
                                         disabled={disabled}>
                                    <i data-i-series={""+i} data-j-series={""+j}
                                       style={{color:"#ffffff",fontSize:"15px",fontWeight:"bold"}}>
                                        {this.state.configure.parameter.groups[i].list[j].paraname}</i>
                                </button>
                            </div>
                        );
                    }
                    if(this.state.configure.parameter.groups[i].list[j].type === "int"){
                        let contentline = "["+this.state.configure.parameter.groups[i].list[j].min+"->"+this.state.configure.parameter.groups[i].list[j].max+"]:"+this.state.configure.parameter.groups[i].list[j].note;
                        let className="form-control "+"sys_conf_input_"+this.state.configure.parameter.groups[i].list[j].type;
                        param.push(
                            <div className="col-xs-6 col-md-6 col-sm-6 col-lg-6" key={this.state.key+i+"p"+j+"l"} style={{height:75}}>
                            <div className="count" style={{fontSize:20,marginTop:15,verticalAlign:'bottom',width:"90%"}} key={this.state.key+i+"p"+j+"l"}>
                                <div className="input-group">
                                    <span className="input-group-addon"  style={{minWidth: "100px",fontSize:"12px"}}>{this.state.configure.parameter.groups[i].list[j].paraname+":"}</span>
                                    <input type="text" className={className} placeholder="CONFIG Value" aria-describedby="basic-addon1"
                                           key={this.state.key2+"G"+i+"P"+j+this.state.configure.parameter.groups[i].list[j].type} id={this.state.key2+"G"+i+"P"+j+this.state.configure.parameter.groups[i].list[j].type} data-group={i} data-parameter={j}
                                           value={this.state.configure.parameter.groups[i].list[j].value} onChange={this.handleChange.bind(this)} onBlur={this.handleBlur.bind(this)}
                                           data-min={this.state.configure.parameter.groups[i].list[j].min} data-max={this.state.configure.parameter.groups[i].list[j].max}/>
                                </div>
                                <h3 style={{fontSize:15,marginRight:5,color:"#333"}}  key={this.state.key2+i+"p"+j+"2"}>{contentline}</h3>
                            </div>
                            </div>);
                    }
                    if(this.state.configure.parameter.groups[i].list[j].type === "float"){
                        let contentline = "["+this.state.configure.parameter.groups[i].list[j].min+"->"+this.state.configure.parameter.groups[i].list[j].max+"]:"+this.state.configure.parameter.groups[i].list[j].note;
                        let className="form-control "+"sys_conf_input_"+this.state.configure.parameter.groups[i].list[j].type;
                        param.push(
                            <div className="col-xs-6 col-md-6 col-sm-6 col-lg-6" key={this.state.key+i+"p"+j+"l"} style={{height:75}}>
                            <div className="count" style={{fontSize:20,marginTop:15,verticalAlign:'bottom',width:"90%"}} key={this.state.key+i+"p"+j+"l"}>
                                <div className="input-group">
                                    <span className="input-group-addon" style={{minWidth: "100px",fontSize:"12px"}}>{this.state.configure.parameter.groups[i].list[j].paraname+":"}</span>
                                    <input type="text" className={className} placeholder="CONFIG Value" aria-describedby="basic-addon1"
                                           key={this.state.key2+"G"+i+"P"+j+this.state.configure.parameter.groups[i].list[j].type} id={this.state.key2+"G"+i+"P"+j+this.state.configure.parameter.groups[i].list[j].type} data-group={i} data-parameter={j}
                                           value={this.state.configure.parameter.groups[i].list[j].value} onChange={this.handleChange.bind(this)} onBlur={this.handleBlur.bind(this)}
                                           data-min={this.state.configure.parameter.groups[i].list[j].min} data-max={this.state.configure.parameter.groups[i].list[j].max}/>
                                </div>
                                <h3 style={{fontSize:15,marginRight:5,color:"#333"}}  key={this.state.key2+i+"p"+j+"2"}>{contentline}</h3>
                            </div>
                            </div>);
                    }
                    if(this.state.configure.parameter.groups[i].list[j].type === "string"){
                        //let contentline = "Max length:["+this.state.configure.parameter.groups[i].list[j].max+"];Note:"+this.state.configure.parameter.groups[i].list[j].note;
                        let contentline = this.state.configure.parameter.groups[i].list[j].note;
                        let className="form-control "+"sys_conf_input_"+this.state.configure.parameter.groups[i].list[j].type;
                        param.push(
                            <div className="col-xs-6 col-md-6 col-sm-6 col-lg-6" key={this.state.key+i+"p"+j+"l"} style={{height:75}}>
                            <div className="count" style={{fontSize:20,marginTop:15,verticalAlign:'bottom',width:"90%"}} key={this.state.key+i+"p"+j+"l"}>
                                <div className="input-group">
                                    <span className="input-group-addon"  style={{minWidth: "100px",fontSize:"12px"}}>{this.state.configure.parameter.groups[i].list[j].paraname+":"}</span>
                                    <input type="text" className={className} placeholder="CONFIG Value" aria-describedby="basic-addon1"
                                           key={this.state.key2+"G"+i+"P"+j+this.state.configure.parameter.groups[i].list[j].type} id={this.state.key2+"G"+i+"P"+j+this.state.configure.parameter.groups[i].list[j].type} data-group={i} data-parameter={j}
                                           value={this.state.configure.parameter.groups[i].list[j].value} onChange={this.handleChange.bind(this)} onBlur={this.handleBlur.bind(this)}
                                           data-min={this.state.configure.parameter.groups[i].list[j].min} data-max={this.state.configure.parameter.groups[i].list[j].max}/>
                                </div>
                                <h3 style={{fontSize:15,marginRight:5,color:"#333"}}  key={this.state.key2+i+"p"+j+"2"}>{contentline}</h3>
                            </div>
                            </div>);
                    }
                    if(this.state.configure.parameter.groups[i].list[j].type === "choice"){
                        let contentline = this.state.configure.parameter.groups[i].list[j].note;
                        let className="form-control "+"sys_conf_choice";
                        let choice_items = [];
                        //this.state.configure.parameter.groups[i].list[j].value = this.state.configure.parameter.groups[i].list[j].items[parseInt(this.state.configure.parameter.groups[i].list[j].value)];
                        for(let k=0;k<this.state.configure.parameter.groups[i].list[j].items.length;k++){
                            /*if(k === parseInt(this.state.configure.parameter.groups[i].list[j].value))
                             choice_items.push(<option value={this.state.configure.parameter.groups[i].list[j].items[k]} key={"choice_item_"+i+"_"+j+"_"+k} selected="selected">{this.state.configure.parameter.groups[i].list[j].items[k]}</option>);
                             else*/
                            choice_items.push(<option value={k+""} key={"choice_item_"+i+"_"+j+"_"+k}>{this.state.configure.parameter.groups[i].list[j].items[k]}</option>);


                        }
                        param.push(
                            <div className="col-xs-6 col-md-6 col-sm-6 col-lg-6" key={this.state.key+i+"p"+j+"l"} style={{height:75}}>
                                <div className="count" style={{fontSize:20,marginTop:15,verticalAlign:'bottom',width:"90%"}} key={this.state.key+i+"p"+j+"l"}>
                                <div className="input-group">
                                    <span className="input-group-addon"  style={{minWidth: "100px",fontSize:"12px"}}>{this.state.configure.parameter.groups[i].list[j].paraname+":"}</span>
                                    <select className={className} placeholder="CONFIG Value" aria-describedby="basic-addon1"
                                            key={this.state.key2+"G"+i+"P"+j+this.state.configure.parameter.groups[i].list[j].type} id={this.state.key2+"G"+i+"P"+j+this.state.configure.parameter.groups[i].list[j].type} data-group={i} data-parameter={j}
                                            onChange={this.handleChange.bind(this)} onBlur={this.handleBlur.bind(this)}
                                            value={this.state.configure.parameter.groups[i].list[j].value} >{choice_items}</select>
                                </div>
                                <h3 style={{fontSize:15,marginRight:5,color:"#333"}}  key={this.state.key2+i+"p"+j+"2"}>{contentline}</h3>
                            </div></div>);



                    }
                    if(this.state.configure.parameter.groups[i].list[j].type === "checkbox"){
                        if(this.state.configure.parameter.groups[i].list[j].value){

                            let temp =
                                <div className="col-xs-3 col-md-3 col-sm-3 col-lg-3" key={this.state.key+i+"p"+j+"l"} style={{height:75}}>

                                <div className="count" style={{fontSize:20,marginTop:15,verticalAlign:'bottom',width:"90%"}} key={this.state.key+i+"p"+j+"l"}>
                                <div>
                                    <label className="location-conf-checkbox-label" style={{fontSize: "16px",color:"#555"}}>
                                        {this.state.configure.parameter.groups[i].list[j].paraname+":"}&nbsp;&nbsp;&nbsp;&nbsp;
                                        <input type="checkbox" id={this.state.key2+"G"+i+"P"+j+this.state.configure.parameter.groups[i].list[j].type} className="js-switch location_conf_checkbox" defaultChecked="checked" onChange={this.handleChangecheck.bind(this)} data-switchery="true" value="on"/>
                                    </label>
                                </div></div></div>;
                            param.push(temp);
                        }else{
                            let temp =

                                <div className="col-xs-3 col-md-3 col-sm-3 col-lg-3" key={this.state.key+i+"p"+j+"l"} style={{height:75}}>
                                <div className="count" style={{fontSize:20,marginTop:15,verticalAlign:'bottom',width:"90%"}} key={this.state.key+i+"p"+j+"l"}>
                                <div>
                                    <label className="location-conf-checkbox-label" style={{fontSize: "16px",color:"#555"}}>
                                        {this.state.configure.parameter.groups[i].list[j].paraname+":"}&nbsp;&nbsp;&nbsp;&nbsp;
                                        <input type="checkbox" id={this.state.key2+"G"+i+"P"+j+this.state.configure.parameter.groups[i].list[j].type} className="js-switch location_conf_checkbox" onChange={this.handleChangecheck.bind(this)} data-switchery="true" value="on"/>
                                    </label>
                                </div></div></div>;
                            param.push(temp);
                        }
                    }
                }
                groups1.push(
                    <div className="col-xs-12 col-md-12 col-sm-12 col-lg-12" key={this.state.key+i+"p"}>
                        <div className="tile-stats" key={"debug_group_"+this.state.configure.parameter.groups[i].groupname} style={{marginTop:"15px"}}>
                            <div key="statuspanel" className="count" style={{fontSize:24}}>{this.state.configure.parameter.groups[i].groupname}</div>
                            {param}
                        </div>
                    </div>
                );
                grougs1size = grougs1size+this.state.configure.parameter.groups[i].list.length;
            }

        }

        return (
        <div className={this.state.animate} style={{position:"absolute",background:"#FFFFFF",height:this.state.height,maxHeight:this.state.height,width:this.state.width,top:0,left:0,display:this.state.hide,overflow:'scroll',overflowX:'hidden',overflowY:'hidden',zIndex:"99",willChange: "transform, opacity"}}>

            <div className="col-xs-12 col-md-12 col-sm-12 col-lg-12" key="status-top">
                <div className="tile-stats"  style={{marginTop:"15px"}}>
                    <div className="count" style={{fontSize:24}}>{this.state.language.locationinfo}</div>
                    <div className="col-xs-12 col-md-12 col-sm-12 col-lg-12">

                        {modebutton}
                    </div>
                    {groups1}
                </div>
            </div>
        </div>
        );
    }
}