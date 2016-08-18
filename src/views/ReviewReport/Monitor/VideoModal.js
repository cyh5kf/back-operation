import React from 'react'
import {Modal, Radio, Row, Button} from 'antd'
import './index.less'
import videojs from 'video.js/dist/video';
import 'video.js/dist/video-js.css'


const RadioGroup = Radio.Group;

export default class VideoModal extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            value: 1
        }
    }

    handleOk () {
        this.props.cancleVideoModal();
    }

    handleCancel () {
        this.props.cancleVideoModal();
    }

    onChange (e) {
        this.setState({
            value: e.target.value,
        });
    }

    componentDidMount () {
        videojs.options.flash.swf = "https://d1wqhktyyjtm52.cloudfront.net/data/video-js.swf";
        videojs(document.getElementById('video1'), {}, function(){
            $('div.video-js').attr('data-reactid', '');
        });
    }

    componentWillUnmount () {
        videojs(document.getElementById('video1')).dispose();
    }


    render () {
        var videoModalVisibal = this.props.videoModalVisibal;
        var channel_id = this.props.channel_id;

        var rtmpUrl = "rtmp://121.43.61.222:51120/live/"+channel_id+"?timestamp=1465898134987&sdkVersion=1.0.0&signupmd5=4da759fb5cd95730d6083b26a3448e2f&appuid=10120779&failServer=121.43.61.222%3A41443&devType=1&stream=C10010042-1465896231805&appid=pixy&appversion=1.0.0";

        //console.log(rtmpUrl);

        return (
            <div>
                <Modal title="Video" visible={videoModalVisibal} className="videoModalStyle" onCancel={this.handleCancel.bind(this)}
                 footer={<Button type="primary" onClick={this.handleCancel.bind(this)}>OK</Button>}>
                    <video data-setup='{
                                "controls": true,
                                "autoplay": true, 
                                "preload": "true"}' id='video1' className="video-js vjs-default-skin vjs-big-play-centered"
                       style={{width: 360, height: 640}} >
                        <source src={rtmpUrl} type="rtmp/flv"/>
                    </video>
                </Modal>
            </div>
        )
    }
}
