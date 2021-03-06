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
import './resultview.css';
import { Player } from 'video-react';

import "../../../../node_modules/video-react/dist/video-react.css";

export default class resultview extends Component {
    constructor(props) {
        super(props);
        this.timerhandle = -1;
        this.state={
            height:700,
            width:600,
            margin:75,
            hide:"none",
            tempconf:[],
            animate:"first-subcard-level animated fadeInDown",
            callback:null,
            margintop:20,
            content:null,
            image:null,
            result:null,
            video:null,
            vresult:null,
            videolength:0,
            defaultvalue:"",
            disabled:"",
            key:"pictureinfo",
            shield:"none",
            shieldnote:"",
            gettemp:null,
            savetemp:null,
            runtemp:null,
            shieldmsg:"",
            ifshowpic:true,
            playicon:"fa fa-play",
            language:{
                "pictureinfo":"拍摄照片",
                "consoletitle":"分析结果",
                "noresult":"没有分析结果",
                "choicetitle":"结果图片",
                "buttonmod":"训练参数",
                "buttonsave":"保存参数",
                "shieldtitle":"调整参数，重新分析"

            }
        }

        this.timeout = 1200;
        this.videor=null;
        this.videoa=null;
        this.processbar = null;
        this.interval = 0;
        this.lock = true;
    }
    update_timeout(timeout){
        this.timeout=timeout;
    }
    update_language(language){
        this.setState({language:language});
    }
    update_size(width,height,margin){
        this.setState({height:height,width:width,margin:margin});
    }
    update_callback(gettemp,savetemp,runtemp){
        this.setState({gettemp:gettemp,savetemp:savetemp,runtemp:runtemp});
    }
    calculate_margin(){
        let _modal = document.getElementById("shieldsmall");
        let module_height = _modal.offsetHeight;
        //if (_modal.innerHeight) module_height = _modal.innerHeight;
        //console.log("offsetHeight:"+_modal.offsetHeight+";innerHeight:"+_modal.clientHeight+",height"+_modal.style.height);
        if(((this.state.height - module_height)/2)>0){
            //console.log("Login marginTop:"+parseInt((this.state.height - module_height)/2)+",height:"+this.state.height+",module_height:"+module_height);
            this.setState({margintop:parseInt((this.state.height - module_height)/2)});
        }
    }
    update_content(content){
        console.log("Set content:");
        console.log(content);
        let defaultvalue = "";
        if(content.shoot.length>0) defaultvalue = "0";
        this.setState({content:content,defaultvalue:defaultvalue},this.show);

    }
    get_content(){
        return this.state.content;
    }
    handle_hide(){
        this.hide();
    }
    handle_change(){
        this.stop();
        if(this.state.ifshowpic ){
            this.setState({ifshowpic:false});
        }else{
            this.setState({ifshowpic:true});
        }
    }
    hide(){
        if(this.state.hide === "none") return;
        else{
            this.stop();
            this.lockhidebutton();
            this.setState({animate:"first-subcard-level animated fadeOutUp"});
            let self = this;

            self.distroycropper();
            setTimeout(function(){
                self.setState({hide:"none",defaultvalue:"",image:null,result:null,video:null,
                    vresult:null,
                    videolength:0,
                    ifshowpic:true,
                    playicon:"fa fa-play"});
                this.lock=true;
                this.videor=null;
                this.videoa=null;
                this.processbar = null;
            },this.timeout);
        }

    }
    componentDidMount(){
        this.interval = setInterval(function(){
            if(this.lock || this.processbar === null || this.videor === null ||this.videor.currentTime === undefined )return;
            let process = parseInt(this.videor.currentTime);
            //console.log("Playtime:"+process);
            this.processbar.value = process;
            if(this.videor.paused){
                this.setState({playicon:"fa fa-play"});
            }else{
                this.setState({playicon:"fa fa-stop"});
            }
        }.bind(this),1000);
    }

    playstop(){
        if (this.videor.paused) {
            this.videor.play();
            if(undefined!=this.videoa.play) this.videoa.play();
            this.setState({playicon:"fa fa-stop"});
        } else {
            this.videor.pause();
            if(undefined!=this.videoa.pause) this.videoa.pause();
            this.setState({playicon:"fa fa-play"});
        }
    }
    stop(){
        if(this.videor === null) return;
        if(undefined!=this.videor.pause) this.videor.pause();
        if(undefined!=this.videoa.pause) this.videoa.pause();
    }
    moveprocess(){
        this.lock=true;
        let current = this.processbar.value;
        if(this.videoa !== null  ) this.videoa.currentTime= current;
        this.videor.currentTime = current;
        this.lock=false;
    }
    show(){
            this.setState({hide:"block",animate:"first-subcard-level animated fadeInDown",ifshowpic:true,videoicon:"fa fa-play"});


            setTimeout(function(){
                let id = null;
                if(this.state.content != null && this.state.content.shoot.length>0) id = 0;
                if(id != null){

                    this.setselectpicture(id);
                }
                else{
                    this.setState({defaultvalue:"",image:null,result:null});
                }
                //self.addcropper();
            }.bind(this),this.timeout);

    }

    switch_system_info(){
        if(this.state.hide == "none"){
            this.setState({hide:"block",animate:"first-subcard-level animated fadeInDown"});
        }else{
            this.setState({animate:"first-subcard-level animated fadeOutUp"});
            let self = this;
            setTimeout(function(){
                self.setState({hide:"none"});
            },this.timeout);
        }
    }
    distroycropper(){
        let $image = $('#image');
        let $result = $('#result');
        if(undefined !== $image.cropper){
            $image.cropper('destroy');
        }
        if(undefined !== $result.cropper){
            $result.cropper('destroy');
        }
    }
    setselectpicture(id){
        if(id === undefined || id === null){
            this.setState({image:null,result:null,video:null,vresult:null});
            return;
        }
        if(this.state.content === null || this.state.content.shooting !== "done"){
            this.setState({image:null,result:null,video:null,vresult:null});
            return;
        }
        if(this.state.content.videoing !== "done"){
            this.setState({video:null,vresult:null});
        }else{

            let videourl = null;
            let vresulturl = null;
            let videolength = null;
            videourl = this.state.content.video;
            videolength = parseInt(this.state.content.videolength);
            if(this.state.content.analysising === "done") {
                vresulturl = this.state.content.analysis.resultVideo;
            }
            this.setState({video:videourl,vresult:vresulturl,videolength:videolength},function(){

                this.videor = document.getElementById('videoR');
                this.videoa = document.getElementById('videoA');
                /*
                this.videor = this.refs.videoR;
                this.videoa = this.refs.videoA;*/
                this.processbar = document.getElementById('h5pro');
                this.lock=false;
            }.bind(this));
        }
        this.lockhidebutton();
        let imageurl = null;
        let resulturl = null;
        imageurl = this.state.content.shoot[parseInt(id)];
        if(this.state.content.analysising === "done") {
            resulturl = this.state.content.analysis.resultPic[parseInt(id)];
        }
        this.setState({image:imageurl,result:resulturl},this.addcropper);
    }
    addcropper(){
        let $image = $('#image');
        let $result = $('#result');
        let options = {
            aspectRatio: 4 / 3,
            preview: '.img-preview',
            viewMode: '1',
            autoCrop:false,
            responsive: false,
            restore: false,
            checkCrossOrigin:false,
            checkOrientation:false,
            modal: false,
            guides: false,
            center:false,
            hightlight:false,
            background:true,
            movable:true,
            rotatable:false,
            scalable:false,
            zoomable:true,
            zoomOnTouch:false,
            zoomOnWheel:true,
            cropBoxMovable:false,
            cropBoxResizable:false,
            toggleDragModeOnDblclick:false,
            dragMode:"move",
            crop: function (e) {
            }
        };
        // Cropper
        if(this.state.image != null){
            $image.on({
                'build.cropper': function (e) {
                },
                'built.cropper': function (e) {
                },
                'cropstart.cropper': function (e) {
                },
                'cropmove.cropper': function (e) {
                },
                'cropend.cropper': function (e) {
                },
                'crop.cropper': function (e) {
                },
                'zoom.cropper': function (e) {
                }
            }).cropper(options);
        }
        if(this.state.result != null){
            $result.on({
                'build.cropper': function (e) {
                },
                'built.cropper': function (e) {
                },
                'cropstart.cropper': function (e) {
                },
                'cropmove.cropper': function (e) {
                },
                'cropend.cropper': function (e) {
                },
                'crop.cropper': function (e) {
                },
                'zoom.cropper': function (e) {
                }
            }).cropper(options);
        }
        if(this.state.image != null && this.state.result != null){
            $image.cropper('updateCallback',$result.cropper('getZoomback'),$result.cropper('getMoveback'),$result.cropper('gethandler'));
            $result.cropper('updateCallback',$image.cropper('getZoomback'),$image.cropper('getMoveback'),$image.cropper('gethandler'));
        }




    }
    lockhidebutton(){
        if(this.timerhandle>0){
            clearTimeout(this.timerhandle);
        }
        this.setState({disabled:"disabled"})
        let self= this;
        this.timerhandle = setTimeout(function(){
            self.setState({disabled:""});
            self.timerhandle = -1;
        },1500);

    }

    showshield(){
        //this.setState({shield:"block"},this.calculate_margin);
    }
    hideshield(){
        //this.setState({shield:"none"});
    }
    updateshieldmsg(msg){
        //this.setState({shieldmsg:msg});
    }
    handleClick(e){
        this.setState({shield:"block"},this.calculate_margin);
        let self= this;
        setTimeout(function(){
            self.setState({shield:"none"});
        },60000);
    }
    handleChange(e){
        let change_value = e.target.value;
        console.log("change to:"+change_value);
        this.setState({defaultvalue:change_value});
        this.distroycropper();
        let self = this;
        setTimeout(function(){
            self.setselectpicture(change_value);
        },1200);

    }
    handleBlur(){

    }

    handleshowmodalClick(e){
        if(this.state.gettemp!==null)
        {this.state.gettemp();}
    }
    handlesaveconfClick(e){

        if(this.state.savetemp!==null)
        {this.state.savetemp();}
    }


    updatetempconf(conf){
        this.setState({tempconf:conf},this.showmodal);
    }
    monitorcycle(){

    }
    modal_middle(modal){

        setTimeout(function () {
            var _modal = $(modal).find(".modal-dialog");
            if(parseInt(($(window).height() - _modal.height())/2)>0){

                _modal.animate({'margin-top': parseInt(($(window).height() - _modal.height())/2)}, 300 );
            }
        },300);
    }

    render() {
        let picchoice;
        let buttonmod;
        let buttonsave;
        let contentline = this.state.language.choicetitle;
        let className="form-control "+"result_pic_choice";
        let choice_items = [];

        let message = this.state.language.shieldtitle+":"+this.state.shieldmsg;
        if(this.state.shieldmsg === "") message = this.state.language.shieldtitle;
        //this.state.configure.parameter.groups[i].list[j].value = this.state.configure.parameter.groups[i].list[j].items[parseInt(this.state.configure.parameter.groups[i].list[j].value)];
        if(this.state.content!== null && this.state.content.shooting === "done"){
            for(let k=0;k<this.state.content.shoot.length;k++){
                choice_items.push(<option value={k+""} key={"choice_picture_"+k}>{(k+1)+""}</option>);
            }
        }
        picchoice=
            <div className="count" style={{fontSize:20,marginTop:15,verticalAlign:'bottom',width:"90%"}} key={this.state.key+"_picchoice"}>
                <div className="input-group">
                    <span className="input-group-addon"  style={{minWidth: "100px",fontSize:"12px"}}>{contentline+":"}</span>
                    <select className={className} placeholder="CONFIG Value" aria-describedby="basic-addon1"
                            key={"result_pic_select"} id={"result_pic_select"}
                            onChange={this.handleChange.bind(this)} onBlur={this.handleBlur.bind(this)}
                            value={this.state.defaultvalue}
                    disabled={this.state.disabled}>{choice_items}</select>
                </div>
            </div>

        buttonmod =
            <button  type="button" className="btn btn-warning btn-sm pull-left" style={{marginLeft:'calc(5% - 5px)',marginTop:"5px",height:50,width:"90%"}} disabled={this.state.disabled} onClick={this.handleshowmodalClick.bind(this)}>
            <i style={{fontSize:25}}> {this.state.language.buttonmod}</i>
        </button>
        buttonsave =
            <button  type="button" className="btn btn-warning btn-sm pull-left" style={{marginLeft:'calc(5% - 5px)',marginTop:"5px",height:50,width:"90%"}} disabled={this.state.disabled} onClick={this.handlesaveconfClick.bind(this)}>
                <i style={{fontSize:25}}> {this.state.language.buttonsave}</i>
            </button>


        let result_information =[];
        if(this.state.content!= null && this.state.content.analysising === "done"){
            let task_detai=[];
            let info_list = this.state.content.analysis.result;
            for(let i=0;i<info_list.length;i++){
                let temp = <h3 style={{fontSize:15,marginRight:5,color:"#333"}}  key={this.state.key+i+"result"}>{this.state.content.analysis.result[i].title+":"+this.state.content.analysis.result[i].value}</h3>
                task_detai.push(temp);
            }
            result_information=
                <div className="col-xs-12 col-md-12 col-sm-12 col-lg-12" key="status-second">
                    <div className="tile-stats"  style={{marginTop:"15px"}}>
                        <div className="count" style={{fontSize:24}}>{this.state.language.taskinfo}</div>
                        {task_detai}
                    </div>
                </div>
        }else if(this.state.content!= null && this.state.analysising !== "done"){
            result_information = <div className="col-xs-12 col-md-12 col-sm-12 col-lg-12" key="status-second">
                <div className="tile-stats"  style={{marginTop:"15px"}}>
                    <div className="count" style={{fontSize:24}}>{this.state.language.consoletitle}</div>
                    {this.state.language.noresult}
                </div>
            </div>
        }
        let imagecontainer;
        if(this.state.image !== null){
            imagecontainer = <img id="image" src={this.state.image} alt="Picture"/>;
        }else{
            imagecontainer = <div id="image"/>;
        }
        let resultcontainer;
        if(this.state.result !== null){
            resultcontainer = <img id="result" src={this.state.result} alt="Picture"/>;
        }else{
            resultcontainer = <div id="result"/>;
        }
        let videocontainer;
        if(this.state.video !== null){
            videocontainer = <video src={this.state.video}  muted width="640px"  height="480px" id="videoR" type="video/mp4" preload="auto"></video>
            //videocontainer = <Player ref="videoR" videoId="video-1" muted={true} width={640}  height={480} ><source src={this.state.video}/></Player>
        }else{
            videocontainer = <div id="video"/>;
        }
        let vresultcontainer;
        if(this.state.vresult !== null){
            vresultcontainer = <video src={this.state.vresult} muted width="640px"  height="480px" id="videoA" type="video/mp4" preload="auto"></video>
            //vresultcontainer = <Player ref="videoA" videoId="video-2" muted={true} width={640}  height={480} ><source src={this.state.vresult}/></Player>
        }else{
            vresultcontainer = <div id="vresult"/>;
        }
        let videocontroler;
        if(this.state.videolength>0){
            videocontroler=
                <div>
                    <button id="play" onClick={this.playstop.bind(this)} className="pull-left"  style={{width:"50px"}}><i className={this.state.playicon} > </i></button>
                    <input type="range" name="points" min="0" max={this.state.videolength-1}
                           className="pull-left" style={{width:'calc(100% - 130px)',marginLeft:"50px"}} id="h5pro" onClick={this.moveprocess.bind(this)} />
                </div>
        }else{
            videocontroler=
                <div/>
        }
        let iconname = "fa fa-file-video-o expand";
        let marginleft = 0;
        if (!this.state.ifshowpic)
        { iconname = "fa fa-file-photo-o expand"; marginleft="-100%";}

        return (
            <div className={this.state.animate} style={{position:"absolute",background:"#FFFFFF",height:this.state.height,maxHeight:this.state.height,width:this.state.width,top:0,right:0,display:this.state.hide,overflow:'scroll',overflowX:'hidden',overflowY:'hidden',willChange: "transform, opacity"}}>

                <div style={{width:"200%",marginLeft:marginleft}}>
                    <div className="col-xs-1 col-md-1 col-sm-1 col-lg-1" key="status-left">
                        <div className="tile-stats"  style={{marginTop:"15px",height:this.state.height-67}}>
                            {picchoice}
                            {buttonmod}

                            {buttonsave}
                            {result_information}
                        </div>
                    </div>
                    <div className="col-xs-5 col-md-5 col-sm-5 col-lg-5" key="status-top">
                        <div className="tile-stats"  style={{marginTop:"15px",height:this.state.height-67}}>
                            <div className="count" style={{fontSize:24}}>{this.state.language.pictureinfo}</div>
                            <div className="container cropper" >
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="img-container">
                                            {imagecontainer}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="img-container">
                                            {resultcontainer}
                                        </div>
                                    </div>
                                </div>

                                <div className="first-subcard-level-float" style={{position:"absolute",height:100,width:100,bottom:25,right:55}}>
                                    <a className="fa fa-youtube-play" style={{fontSize:"100px",opacity:0.3}} onClick={this.handle_change.bind(this)} disabled={this.state.disabled}></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-6 col-md-6 col-sm-6 col-lg-6" key="status-video">
                        <div className="tile-stats"  style={{marginTop:"15px",height:this.state.height-67}}>
                            <div className="count" style={{fontSize:24}}>{this.state.language.pictureinfo}</div>
                            <div className="container cropper" >
                                <div className="row">

                                    <div className="col-md-6">
                                        <div className="img-container">
                                            {videocontainer}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="img-container">
                                            {vresultcontainer}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-md-12 col-sm-12 col-lg-12" key="status-bottom">
                                    {videocontroler}
                                </div>

                            </div>
                        </div>
                        <div className="first-subcard-level-float" style={{position:"absolute",height:100,width:100,bottom:25,right:55}}>
                            <a className="fa fa-picture-o" style={{fontSize:"100px",opacity:0.3}} onClick={this.handle_change.bind(this)} disabled={this.state.disabled}></a>
                        </div>

                    </div>
                </div>
                <div className="col-xs-12 col-md-12 col-sm-12 col-lg-12" key="status-bottom">

                    <button  type="button" className="btn btn-warning  btn-sm pull-left hidebutton blingbling-LGRAY" style={{marginLeft:0,marginTop:"5px",height:25,width:"100%",background:"rgba(0,0,0,0.3)"}} onClick={this.handle_hide.bind(this)} disabled={this.state.disabled}>
                        <i className="fa fa-angle-double-up expand" > </i>
                    </button>
                </div>

            </div>
        );
    }

}

/*
 <div className="col-md-6">
 <div className="img-container">
 {videocontainer}
 </div>
 </div>
 <div className="col-md-6">
 <div className="img-container">
 {vresultcontainer}
 </div>
 </div>
 </div>
 <div className="col-xs-12 col-md-12 col-sm-12 col-lg-12" key="status-bottom">
 {videocontroler}
 </div>
 <div className="shield-level" style={{position:"absolute",background:"rgba(55,55,55,0.4)",height:this.state.height,width:this.state.width,top:0,right:0,display:this.state.shield}}>
 <div className="container">
 <div className="leaderboard" style={{marginTop: this.state.margintop}}>
 <div className="panel panel-default" id="shieldsmall" >
 <div className="panel-body">
 <a><i className="fa fa-spinner fa-spin" style={{marginRight:15}}/>{message}</a>

 </div>
 </div>
 </div>
 </div>
 </div>

 */