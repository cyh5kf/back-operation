import React from 'react';
import { Row, Col, Input, Button, Dropdown, Menu, Icon, Select} from 'antd';
import classNames from 'classnames';
import ViewRow from './ViewRow';
import NewRow from './NewRow';
import {AjaxUtil} from '../../../views/auth';
import './index.less';

export default class ExchangeDiamonds extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isEdit: false,
            newRow: [],
            tableData: [],
        };
    }

    componentWillMount () {
        this.ajaxQueryStarChargeProduct();
    }

    /**
     *  ajax 获取所有数据
     */
    ajaxQueryStarChargeProduct () {
        AjaxUtil.queryStarChargeProduct(this.handleAjaxQueryStarChargeProduct.bind(this), this.props.challenge);
    }
    /**
     *  ajax 修改数据
     */
    ajaxPublishStarChargeProduct (data) {
        AjaxUtil.publishStarChargeProduct(this.handleAjaxPublishStarChargeProduct.bind(this), data);
    }

    handleAjaxQueryStarChargeProduct (data) {
        console.log('-----', data)
        this.setState({
            tableData: data,
        })
    }

    handleAjaxPublishStarChargeProduct (data) {
        console.log('-----', data)
        this.setState({
            tableData: data,
        })
    }


    handleEdit (e) {
        this.setState ({
            isEdit: true
        })
    }

    handlePublish (e) {
        for (let i=0, len=this.state.newRow.length; i<len; i++) {
            let data = this.state.newRow[i];
            if (data.diamonds_amount == '' || data.price == '') {
                this.errorModal('Input can not be empty');
                return
            }
        }

        var data = this.state.tableData.concat(this.state.newRow);
        console.log(data)
        this.ajaxPublishStarChargeProduct(data);
        this.setState ({
            isEdit: false,
            newRow: [],
        });
    }

    handleCancel (e) {
        this.ajaxQueryStarChargeProduct();
        this.setState ({
            isEdit: false,
            newRow: [],
        });
    }

    handleAddItem (e) {
        var length = this.state.tableData.length + this.state.newRow.length;
        this.setState({
            newRow: this.state.newRow.concat([{product_id: 0}])
        });
    }

    editRowCheckboxChange (rowIndex, value) {
        this.state.tableData[rowIndex].tag = value;
    }

    /**
     *  newRow 组件的回调
     */
    newRowCheckboxChange (rowIndex, value) {
        this.state.newRow[rowIndex].tag = value;
    }

    newRowDiamondInputChange (rowIndex, value) {
        this.state.newRow[rowIndex].diamond_amount = value;
    }

    newRowPriceInputChange (rowIndex, value) {
        this.state.newRow[rowIndex].price = value;
    }

    newRowDeleteBtn (rowIndex) {
        this.state.newRow.splice(rowIndex, 1);
        console.log(this.state.newRow)
        this.setState({
            newRow: this.state.newRow
        })
    }


    render () {
        if (this.state.isEdit) {
            var rowContent = this.state.tableData.map( (data, index) => {
                if (index <= 4) {
                    return (
                        <Row key={index} type="flex" justify="start">
                            <ViewRow rowIndex={index} data={data} isEdit={true}
                                     checkboxChange={this.editRowCheckboxChange.bind(this)}>
                            </ViewRow>
                        </Row>
                    )
                }
                else {
                    return (
                        <Row key={index} type="flex" justify="start">
                            <ViewRow rowIndex={index} data={data} isEdit={true}
                                     checkboxChange={this.editRowCheckboxChange.bind(this)}>
                            </ViewRow>
                            <Col className="f-vcenter" style={{fontSize: 18, marginLeft: 20}}>
                                <a onClick={this.editRowDeleteBtn.bind(this, index)}>
                                    Delete
                                </a>
                            </Col>

                        </Row>
                    )
                }

            });

            var newRowContent = this.state.newRow.map((data, index) => {
                return (
                    <Row key={index} type="flex" justify="start">
                        <NewRow
                            rowIndex={index}
                            checkboxChange={this.newRowCheckboxChange.bind(this)}
                            diamondInputChange={this.newRowDiamondInputChange.bind(this)}
                            priceInputChange={this.newRowPriceInputChange.bind(this)}
                            deleteBtn={this.newRowDeleteBtn.bind(this)}>
                        </NewRow>
                    </Row>
                )
            });
            var addButton = [
                <Col key="1">
                    <a onClick={this.handleAddItem.bind(this)}>
                        <Icon type="plus-circle-o" className="plusIcon" />
                        <span className="ml10">Add Staff</span>
                    </a>
                </Col>
            ];
            var editButton = [
                <Button key="1" type="primary" onClick={this.handlePublish.bind(this)}>Publish</Button>,
                <Button key="2" type="primary" onClick={this.handleCancel.bind(this)} style={{marginLeft: 50}}>Cancel</Button>
            ];
        }

        else {
            var rowContent = this.state.tableData.map( (data, index) => (
                <Row key={index} type="flex" justify="start">
                    <ViewRow data={data}></ViewRow>
                </Row>
            ));
            //var rowContent = [
            //    <Row type="flex" justify="start">
            //        <ViewRow></ViewRow>
            //    </Row>,
            //    <Row type="flex" justify="start">
            //        <ViewRow></ViewRow>
            //    </Row>,
            //    <Row type="flex" justify="start">
            //        <ViewRow></ViewRow>
            //    </Row>,
            //    <Row type="flex" justify="start">
            //        <ViewRow></ViewRow>
            //    </Row>,
            //    <Row type="flex" justify="start">
            //        <ViewRow tip="Donate 100 diamonds"></ViewRow>
            //    </Row>
            //];
            var addButton = null;
            var editButton = [
                <Button key="1" type="primary" onClick={this.handleEdit.bind(this)}>Edit</Button>
            ];
        }

        return(
            <div className="m-exchange-diamonds">
                {rowContent}
                {newRowContent}
                <Row className="abtn u-addbtn f-hcenter" type="flex" justify="start">
                    {addButton}
                </Row>
                <Row className="ebtn" type="flex" justify="start">
                    {editButton}
                </Row>
            </div>
        )
    }
}