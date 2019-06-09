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



export default class realpicturecard extends Component {
    constructor(props) {
        super(props);
        this.state={
            height:700,
            width:600,
            margin:75,
            hide:"none",
            animate:"animated fadeInRight",
            callback:null,
            margintop:20,
            marginleft:10,
            content:[],
            key:"pictureinfo",
            language:{
                "pictureinfo":"实时成像",
                "consoletitle":"实时日志"
            }
        }

        this.timeout = 1200;
    }
    update_timeout(timeout){
        this.timeout=timeout;
    }
    update_language(language){
        this.setState({language:language});
    }
    update_size(width,height,margin){
        this.setState({height:height,width:width,margin:margin},function(){
            this.setState({marginleft:(width-680)/2});
        });
    }
    update_content(content){
        this.setState({content:content});
    }
    hide(){
        if(this.state.hide === "none") return;
        else{
            this.setState({animate:"animated fadeOutRight"});
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
            this.setState({hide:"block",animate:"animated fadeInRight"});
        }
    }
    switch_system_info(){
        if(this.state.hide == "none"){
            this.setState({hide:"block",animate:"animated fadeInRight"});
        }else{
            this.setState({animate:"animated fadeOutRight"});
            let self = this;
            setTimeout(function(){
                self.setState({hide:"none"});
            },this.timeout);
        }
    }
    componentDidUpdate(){

    }
    render() {

        return (
            <div className={this.state.animate} style={{position:"absolute",background:"#FFFFFF",height:this.state.height,maxHeight:this.state.height,width:this.state.width,top:0,right:0,display:this.state.hide,overflow:'scroll',overflowX:'hidden',overflowY:'hidden',zIndex:"99",willChange: "transform, opacity"}}>
                <div className="col-xs-12 col-md-12 col-sm-12 col-lg-12" key="status-top">
                    <div className="tile-stats"  style={{marginTop:"15px"}}>
                        <div className="count" style={{fontSize:24}}>{this.state.language.pictureinfo}</div>
                        <div id="imgview" style={{position:"relative",minHeight:520,paddingLeft:10,paddingRight:10,width:660,marginLeft:this.state.marginleft}}>
                            <img src="./img/default.jpg" style={{position: "absolute", left: 10, top: 20,zIndex:99}}/>
                        </div>
                        <div className="clearfix"/>
                    </div>

                    <div className="clearfix"/>
                </div>

                <div className="clearfix"/>
            </div>
        );
    }
}