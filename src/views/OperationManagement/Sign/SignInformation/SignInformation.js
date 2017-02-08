import React from 'react'
import {Table, Row, Col, Button, Icon, Switch, message} from 'antd'
import './index.less'
import '../../../../components/Common/common.less'
import {AjaxUtil,CheckToken} from '../../../auth';
import {i18n} from '../../../../utils/i18n';

export default class SignInformation extends React.Component {
    constructor (props) {
        super(props);
    }


    render () {

        var sexIconContent = null;
        if (this.props.userInfo.ban_level == '1') {
            sexIconContent = <i className="iconfont female">&#xe600;</i>
        }
        else if (this.props.userInfo.ban_level == '2') {
            sexIconContent = <i className="iconfont male">&#xe603;</i>
        }

        var certChecked = this.props.userInfo.cert ? true : false;
        var talkerChecked = this.props.userInfo.talker ? true : false;

        return (
            <div className="m-basic-information">
                <Row className="info1" type="flex" justify="start">
                    <Col className="avatar">
                        <img src={this.props.userInfo.avatar}></img>
                    </Col>
                    <Col className="content">
                        <Row className="r1" type="flex" justify="start">
                            <Col className="name">
                                {this.props.userInfo.name}
                            </Col>
                            <Col className="sex">
                                {sexIconContent}
                            </Col>
                            <Col className="lv f-vcenter f-hcenter">
                                {'Lv' + this.props.userInfo.level}
                            </Col>
                        </Row>
                        <Row className="r2" type="flex" justify="start">
                            <Col className="c1">
                                PIXY:
                            </Col>
                            <Col className="c2">
                                {this.props.userInfo.uid}
                            </Col>
                        </Row>
                        <Row className="r3" type="flex" justify="start">
                            <Col>
                                {this.props.userInfo.Signature}
                            </Col>
                        </Row>
                    </Col>
                    <Col className="Sign_switch">
                        <span>Talker switch:</span>
                        <Switch checked={talkerChecked}  disabled={!talkerChecked} onChange={this.props.onChangeSigned} checkedChildren="ON"
                                unCheckedChildren="OFF"/>
                    </Col>
                    <Col className="Sign_switch">
                        <span>Cert switch:</span>
                        <Switch checked={certChecked} onChange={this.props.onChangeCert} checkedChildren="ON"
                                unCheckedChildren="OFF"/>
                    </Col>
                </Row>

                <Row className="info2" type="flex" justify="start">
                    <Col span="6">
                        {'Account Type : ' + (this.props.userInfo.register_type == 1 ? 'email' : (this.props.userInfo.register_type == 2 ? 'facebook' : 'twitter'))}
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
                    <Col span="6">
                        {'Status : ' +  this.props.userInfo.status }
                    </Col>
                    <Col span="6">
                    </Col>
                </Row>
                {this.props.children}
            </div>
        )
    }
}
