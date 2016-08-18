import React from 'react';
import { Row, Col, Input, Button} from 'antd';
import classNames from 'classnames';
import './index.less';

export default class HotRank extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isEdit: false
        };
    }

    handleEdit (e) {
        this.setState ({
            isEdit: true
        })
    }

    handlePublish (e) {
        this.setState ({
            isEdit: false
        })
    }

    handleCancel (e) {
        this.setState ({
            isEdit: false
        })
    }

    render () {
        var rankFactorsRowCls = classNames('row-cnt');

        if (this.state.isEdit) {
            var iptCls = classNames('w40');

            var rankFactorsContent = [
                <Row key="r1" className={rankFactorsRowCls} type="flex" justify="start"><Input className={iptCls}/></Row>,
                <Row key="r2" className={rankFactorsRowCls} type="flex" justify="start"><Input className={iptCls}/></Row>,
                <Row key="r3" className={rankFactorsRowCls} type="flex" justify="start"><Input className={iptCls}/></Row>,
                <Row key="r4" className={rankFactorsRowCls} type="flex" justify="start"><Input className={iptCls}/></Row>,
            ];

            var autoRefreshInterval = [
                <Input key="1" className={iptCls}/>,
                <span key="2" className="ml10">minutes</span>
            ];

            var editButton = [
                <Button key="1" type="primary" onClick={this.handlePublish.bind(this)}>Publish</Button>,
                <Button key="2" type="primary" onClick={this.handleCancel.bind(this)} style={{marginLeft: 50}}>Cancel</Button>
            ];
        }

        else {
            var rankFactorsContent = [
                <Row key="r1" className={rankFactorsRowCls} type="flex" justify="start"><span>10%</span></Row>,
                <Row key="r2" className={rankFactorsRowCls} type="flex" justify="start"><span>80%</span></Row>,
                <Row key="r3" className={rankFactorsRowCls} type="flex" justify="start"><span>20%</span></Row>,
                <Row key="r4" className={rankFactorsRowCls} type="flex" justify="start"><span>40%</span></Row>,
            ];

            var autoRefreshInterval = [
                <span key="s1" className="cred">2</span>,
                <span key="s2" className="ml10">minutes</span>
            ];

            var editButton = [
                <Button key="1" type="primary" onClick={this.handleEdit.bind(this)}>Edit</Button>
            ];
        }

        return(
            <div>
                <Row type="flex" justify="start">
                    <Col span="24" className="titleHead">
                        Hot Rank
                    </Col>
                </Row>
                <div className="m-hot-rank">
                    <Row type="flex" justify="start">
                        <Col span="24">
                            <span>Rank Factors:</span>
                        </Col>
                    </Row>
                    <Row className="rkcnt" type="flex" justify="start">
                        <Col className="c1">
                            <Row className={rankFactorsRowCls} type="flex" justify="start">Number of audiences:</Row>
                            <Row className={rankFactorsRowCls} type="flex" justify="start">Number of stars
                                received:</Row>
                            <Row className={rankFactorsRowCls} type="flex" justify="start">Number of messages:</Row>
                            <Row className={rankFactorsRowCls} type="flex" justify="start">Number of likes:</Row>
                        </Col>
                        <Col className="c2">
                            {rankFactorsContent}
                        </Col>
                    </Row>
                    <Row className="rfcnt" type="flex" justify="start">
                        <Col className="c1">
                            Auto Refresh Interval:
                        </Col>
                        <Col span="6">
                            {autoRefreshInterval}
                        </Col>
                    </Row>
                    <Row type="flex" justify="start">
                        {editButton}
                    </Row>
                </div>
            </div>
        )
    }
}