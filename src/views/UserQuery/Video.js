import React from 'react';
import videojs from 'video.js/dist/video';
import 'video.js/dist/video-js.css'

export default class Video extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount () {
        this.deleteVideoReactId();
    }

    componentDidUpdate () {
        this.deleteVideoReactId();
    }

    deleteVideoReactId () {
        if (document.getElementById(this.props.videoId)) {
            videojs(document.getElementById(this.props.videoId), {}, function(){
                $('div.video-js').attr('data-reactid', '');
            });
        }
    }

    render () {
        return (
            <span>
                <video id={this.props.videoId} className="video-js vjs-default-skin vjs-big-play-centered" controls="controls"
                       style={{width: 200, height: 300}} preload="autoplay">
                    <source src={this.props.videoUrl} type="video/mp4"/>
                </video>
            </span>
        )
    }
}
