/**
 * Created by Huang Yuanjie on 2019/5/4.
 */
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
import { compareJSON } from '../../../util/util.js';



export default class historycard extends Component {
    constructor(props) {
        super(props);
        this.state={
            height:700,
            width:600,
            footheight:100,
            margin:75,
            hide:"none",
            animate:"animated fadeInLeft",
            callback:null,

            margintop:20,
            content:[],
            configure:null,
            key:"sys_conf_key",
            key2:"sys_conf_input",
            language:{
                "historyinfo":"操作历史"
            }
        }
    }
    update_language(language){
        this.setState({language:language});
    }
    update_size(width,height,margin){
        this.setState({height:height,width:width,margin:margin});
        xhgridresize();
    }
    update_content(content){
        if(compareJSON({'json':this.state.content},{'json':content})){
            this.show();
        }else{
            this.setState({content:content},this.initializegrid);
        }

    }
    update_callback(callback){
        this.setState({callback:callback});
    }
    update_config(configure){
        this.setState({configure:configure});
    }
    initializegrid(){
        this.show();
        this.state.callback(this.state.content);
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
    componentDidMount(){
    }
    componentDidUpdate(){
    }

    //<!--div id="gridHolder" style={{height: 405,width:"100%"}}></div-->
    render() {

        return (
            <div className={this.state.animate} style={{position:"absolute",background:"#FFFFFF",height:this.state.height,maxHeight:this.state.height,width:this.state.width,top:0,left:0,display:this.state.hide,overflow:'scroll',overflowX:'hidden',overflowY:'hidden',zIndex:"99"}}>
                <div className="col-xs-12 col-md-12 col-sm-12 col-lg-12" key="status-top" style={{height:this.state.height,maxHeight:this.state.height}}>
                    <div className="tile-stats"  style={{marginTop:"15px",height:(this.state.height-30),maxHeight:(this.state.height-30)}}>
                        <div className="count" style={{fontSize:24}}>{this.state.language.historyinfo}</div>
                        <div className="content">
                            <div id="gridHolder" style={{height:(this.state.height-80),width:"100%"}}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}