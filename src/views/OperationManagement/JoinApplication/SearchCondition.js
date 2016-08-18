import React from 'react';
import {Table, Row, Col, Button, Radio, Input,message,Modal,Select,Spin,Icon,DatePicker} from 'antd';
import enUS from 'antd/lib/date-picker/locale/en_US';
const RangePicker = DatePicker.RangePicker;
import {AjaxUtil} from '../../auth';
import {i18n} from '../../../utils/i18n'
import {getThumbUrl40,getTimeOnlyDate} from '../../../utils/CommonUtils';


export default class SearchCondition extends React.Component {
    constructor(props) {
        super(props);
    }

    searchInputKeyPress (e) {
        //监听enter键
        if (e.keyCode == '13') {
            this.props.queryTableContent();
        }
    }


    render(){


        var queryCondition = this.props.queryCondition;
        var changeSelectLanguage = this.props.changeSelectLanguage;
        var changeSelectStatus = this.props.changeSelectStatus;
        var changeSelectGender = this.props.changeSelectGender;
        var onChangeDatePicker = this.props.onChangeDatePicker;
        var queryTableContent = this.props.queryTableContent;
        var onChangeSearchInput = this.props.onChangeSearchInput;
        var onChangeSearchTextField = this.props.onChangeSearchTextField;


        const selectBefore = (
            <Select value={queryCondition.searchTextField} style={{ width: 80 }} onChange={onChangeSearchTextField}>
                <Option value="pixyId">PixyId</Option>
                <Option value="name">Name</Option>
                <Option value="email">Email</Option>
            </Select>
        );

        return (
            <div className="joinApplicationSearchCondition">

                <div style={{ height: 20 }}></div>
                <Row className="search" type="flex" justify="start">
                    <Col span="24">
                        Language : &nbsp;&nbsp;&nbsp;
                        <Select style={{ width: 120 }} value={queryCondition.language}
                                onChange={changeSelectLanguage}>
                            <Option value="all">all</Option>
                            <Option value="en">en</Option>
                            <Option value="ar">ar</Option>
                        </Select>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        Status : &nbsp;&nbsp;&nbsp;
                        <Select style={{ width: 120 }} value={queryCondition.status}
                                onChange={changeSelectStatus}>
                            <Option value="-1">all</Option>
                            <Option value="0">unhandled</Option>
                            <Option value="1">approved</Option>
                            <Option value="2">rejected</Option>
                        </Select>

                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        Gender : &nbsp;&nbsp;&nbsp;
                        <Select style={{ width: 120 }} value={queryCondition.gender}
                                onChange={changeSelectGender}>
                            <Option value="-1">all</Option>
                            <Option value="0">unknown</Option>
                            <Option value="1">female</Option>
                            <Option value="2">male</Option>
                        </Select>

                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        CreateTime : &nbsp;&nbsp;&nbsp;
                        <RangePicker locale={{...enUS}} format="yyyy-MM-dd"
                                     style={{ width: 184 }}
                                     startPlaceholder='start date'
                                     endPlaceholder='end date'
                                     onOk={onChangeDatePicker}
                                     onChange={onChangeDatePicker}/>
                    </Col>
                </Row>

                <Row className="search" type="flex" justify="start">

                    <Col span="24">
                        <div style={{ height: 15 }}></div>
                        <div>
                            <div className="searchByE searchByE1" >Search by</div>
                            <div className="searchByE" style={{width:300}}>
                                <Input
                                    onChange={onChangeSearchInput}
                                    addonBefore={selectBefore}
                                    value={queryCondition.searchText}
                                    style={{ width: 200 }}
                                    onKeyUp={this.searchInputKeyPress.bind(this)}
                                />
                            </div>
                            <Button type="primary" onClick={queryTableContent}>Query</Button>
                            <div className="clear"></div>
                        </div>
                    </Col>
                </Row>

                <div style={{ height: 20 }}></div>

            </div>
        );
    }

}