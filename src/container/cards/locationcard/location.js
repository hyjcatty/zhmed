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
            callbackmode:null,
            callbackrun:null,
            calimode:false,
            configure:null,
            language:{
                "locationinfo":"位置校准",
                "buttoncalimodeyes":"进入校准模式",
                "buttoncalimodeno":"离开校准模式",
            }
        }
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
        this.setState({callbackmode:callbackmode,callbackrun:callbackrun,configure:configure});
    }
    updatecalimode(calimode){
        this.setState({calimode:calimode});
    }
    update_content(content){
        this.setState({content:content});
    }
    hide(){
        if(this.state.hide === "none") return;
        else{
            this.setState({animate:"animated fadeOutLeft"});
            let self = this;
            setTimeout(function(){
                self.setState({hide:"none"});
            },800);
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
            },800);
        }
    }
    handle_click_send(event){
        let i = parseInt(event.target.getAttribute("data-i-series"));
        let j = parseInt(event.target.getAttribute("data-j-series"));
        console.log(this.state.configure.parameter.groups[i].list[j].action);
        this.state.callbackrun(this.state.configure.parameter.groups[i].list[j].action);
    }
    handle_click_mode(){
        this.state.callbackmode(!this.state.calimode);
    }
    render() {

        let groups1 = [];

        let grougs1size=0;
        let modebutton = this.state.language.buttoncalimodeyes;
        let disabled = "disabled";
        if(this.state.calimode) {
            disabled = "";
            modebutton = this.state.language.buttoncalimodeno;
        }
        if(this.state.configure!= null){

            for(let i=0;i<this.state.configure.parameter.groups.length;i++){
                let param = [];
                for(let j=0;j<this.state.configure.parameter.groups[i].list.length;j++){
                    if(this.state.configure.parameter.groups[i].list[j].type === "button"){
                        param.push(
                            <div className="col-xs-3 col-md-3 col-sm-3 col-lg-3" key={"button"+i+""+j}>
                                <button  type="button" className="btn btn-warning btn-sm pull-left"
                                         style={{marginLeft:"5px",marginTop:"5px",height:(this.state.height*0.1),width:"90%"}}
                                         data-i-series={""+i} data-j-series={""+j} onClick={this.handle_click_send.bind(this)}
                                         disabled={disabled}>
                                    <i data-i-series={""+i} data-j-series={""+j}
                                       style={{color:"#ffffff",fontSize:"15px",fontWeight:"bold"}}>
                                        {this.state.configure.parameter.groups[i].list[j].paraname}</i>
                                </button>
                            </div>
                        );
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
        <div className={this.state.animate} style={{position:"absolute",background:"#FFFFFF",height:this.state.height,maxHeight:this.state.height,width:this.state.width,top:0,left:0,display:this.state.hide,overflow:'scroll',overflowX:'hidden',overflowY:'hidden',zIndex:"99"}}>

            <div className="col-xs-12 col-md-12 col-sm-12 col-lg-12" key="status-top">
                <div className="tile-stats"  style={{marginTop:"15px"}}>
                    <div className="count" style={{fontSize:24}}>{this.state.language.locationinfo}</div>
                    <div className="col-xs-12 col-md-12 col-sm-12 col-lg-12">
                        <div className="col-xs-6 col-md-6 col-sm-6 col-lg-6" >
                            <button  type="button" className="btn btn-warning btn-sm pull-left"
                                     style={{marginLeft:"5px",marginTop:"5px",height:(this.state.height*0.1),width:"90%"}}
                                     onClick={this.handle_click_mode.bind(this)}>
                                <i style={{color:"#ffffff",fontSize:"15px",fontWeight:"bold"}}>
                                    {modebutton}</i>
                            </button>
                        </div>
                    </div>
                    {groups1}
                </div>
            </div>
        </div>
        );
    }
}