import React from 'react'
import {Table, Row, Col, Button, Icon, Switch} from 'antd'
import './index.less'
import {getThumbUrl70} from '../../utils/CommonUtils';

export default class BasicInformation extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        var sexIconContent = null;
        if (this.props.userInfo.gender == '1') {
            sexIconContent = <i className="iconfont female" >&#xe600;</i>
        }
        else if (this.props.userInfo.gender == '2') {
            sexIconContent = <i className="iconfont male" >&#xe603;</i>
        }
        
        if (this.props.livePauseVisible) {
            var disabled = this.props.disabled;
            var livePause = <Col span="4" className="btn_livePause">
                                <Button type="primary" disabled={disabled} onClick={this.props.livePause}>Live pause</Button>
                            </Col>
        } 
        
        if (this.props.banVisible) {
            var banSwitch = null;
            var banChecked = this.props.banChecked;
            banSwitch = <Col className="ban_switch" span="6">
                            <span className="switch_title">Ban Switch:</span>
                            <Switch checked={banChecked} onChange={this.props.onChangeBan} checkedChildren="ON"
                            unCheckedChildren="OFF"/>
                        </Col>
        }
        
        

        return (
            <div className="m-basic-information">
                <Row className="info1" type="flex" justify="start">
                    <Col className="avatar">
                        <img src={getThumbUrl70(this.props.userInfo.avatar)}></img>
                    </Col>
                    <Col className="content">
                        <Row className="r1" type="flex" justify="start">
                            <Col className="name" span="6">
                                {this.props.userInfo.name}
                            </Col>
                            <Col className="sex" span="2">
                                {sexIconContent}
                            </Col>
                            <Col className="lv f-vcenter f-hcenter" span="2">
                                {'Lv' + this.props.userInfo.level}
                            </Col>
                            {livePause}
                            {banSwitch}
                        </Row>
                        <Row className="r2" type="flex" justify="start">
                            <Col className="c1">
                                PIXY:
                            </Col>
                            <Col className="c2">
                                {this.props.userInfo.uid}
                            </Col>
                        </Row>
                        <Row type="flex" justify="start">
                            <Col className="r3">
                                {this.props.userInfo.signature}
                            </Col>
                        </Row>
                    </Col>
                    
                </Row>

                <Row className="info2" type="flex" justify="start">
                    <Col span="6">
                        {'Account Type : ' + (this.props.userInfo.register_type == 1?'email':(this.props.userInfo.register_type == 2?'facebook':'twitter'))}
                    </Col>
                    <Col span="6">
                        {'Diamonds : ' + this.props.userInfo.diamond_amount}
                    </Col>
                    <Col span="6">
                        {'Followers : ' + this.props.userInfo.follower_count}
                    </Col>
                </Row>
                <Row className="info2" type="flex" justify="start">
                    <Col span="6">
                        {'Email : ' + this.props.userInfo.email}
                    </Col>
                    <Col span="6">
                        {'Stars : ' + this.props.userInfo.star_amount}
                    </Col>
                    <Col span="6">
                        {'Following : ' + this.props.userInfo.following_count}
                    </Col>
                </Row>
                <Row className="info2" type="flex" justify="start">
                    <Col span="6">
                        {'EXP : ' + this.props.userInfo.currentScore}
                    </Col>
                    <Col span="6">
                        {'Earnings : $' + this.props.userInfo.earnings}
                    </Col>
                </Row>
                {this.props.children}
            </div>
        )
    }
}
