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



export default class systeminfocard extends Component {
    constructor(props) {
        super(props);
        this.state={
            height:700,
            width:600,
            consoleheight:420,
            margin:75,
            hide:"none",
            animate:"animated fadeInRight",
            callback:null,
            margintop:20,
            content:[],
            key:"systeminfo",
            language:{
                "systeminfo":"系统信息",
                "consoletitle":"实时日志"
            }
        }
        this.topref = ref => {this.refDom = ref};
    }
    update_language(language){
        this.setState({language:language});
    }
    update_size(width,height,margin){
        this.setState({height:height,width:width,margin:margin},this.calculate_height);
    }
    update_content(content){

        console.log(content);
        this.setState({content:content},this.calculate_height);
    }
    hide(){
        this.setState({hide:"none"});
    }
    show(){
        this.setState({hide:"block"});
    }
    switch_system_info(){
        if(this.state.hide == "none"){
            this.setState({hide:"block",animate:"animated fadeInRight"},this.calculate_height);
        }else{
            this.setState({animate:"animated fadeOutRight"});
            let self = this;
            setTimeout(function(){
                self.setState({hide:"none"});
            },800);
        }
    }
    update_msg(msg){
        $("#screen").prepend("<p style='width:100%'>"+msg+"</p><p style='width:100%'>----------------</p>");
        while($("#screen").children('p').length>200){
            $("#screen").children('p')[$("#screen").children('p').length-1].remove();
        }
    }
    calculate_height(){
        const {clientWidth, clientHeight} = this.refDom;
        this.setState({consoleheight:(this.state.height-clientHeight-39-34)});
    }
    render() {
        let center_panel=[];
        for(let i=0;i<this.state.content.length;i++){
            let temp = <h3 style={{fontSize:15,marginRight:5,color:"#333"}}  key={this.state.key+i}>{this.state.content[i].title+":"+this.state.content[i].value}</h3>
            if(this.state.content[i].alarm)
                temp = <h3 style={{fontSize:15,marginRight:5,color:"#FF6633"}}  key={this.state.key+i}>{this.state.content[i].title+":"+this.state.content[i].value}</h3>
            center_panel.push(temp);
        }
        console.log(center_panel);
        return (
            <div className={this.state.animate} style={{position:"absolute",background:"#FFFFFF",height:this.state.height,maxHeight:this.state.height,width:this.state.width,top:this.state.margin,right:0,display:this.state.hide,overflow:'scroll',overflowX:'hidden',overflowY:'hidden',zIndex:"999",willChange: "transform, opacity"}}>
                <div className="col-xs-12 col-md-12 col-sm-12 col-lg-12" key="status-top" ref={this.topref}>
                    <div className="tile-stats"  style={{marginTop:"15px"}}>
                        <div className="count" style={{fontSize:24}}>{this.state.language.systeminfo}</div>
                        {center_panel}
                    </div>
                </div>
                <div className="col-xs-12 col-md-12 col-sm-12 col-lg-12" key="status-bottom" >
                    <div className="tile-stats"  style={{marginTop:"15px"}}>
                        <div key="statuspanel" className="count" style={{fontSize:24}}>{this.state.language.consoletitle}</div>
                        <div  id="screen" style={{width:"calc(100%- 35px)",height:this.state.consoleheight,marginLeft:"15px",overflow:'scroll',overflowX:'hidden'}}>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}