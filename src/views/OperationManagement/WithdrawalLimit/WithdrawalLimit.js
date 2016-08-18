import React from 'react';
import { Row, Col, Button, Table, Icon, Input, Modal} from 'antd';
import classNames from 'classnames';
import './index.less';
import {AjaxUtil} from '../../../views/auth'
const confirm = Modal.confirm;

export default class WithdrawalLimit extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isEdit: false,
            newRow: [],
            tableData: [],              //后台请求过来的数据,对于修改后的数据,同样要修改此数组,再将此数组传到后台
        };
        this.tableStrData = [];         //对tableData的数据进行一些格式化处理,方便显示
        this.priceSettingData = {};     //对money_limit进行修改的数据,key为对应的行号
        this.levelSettingData = {};     //对level_limit进行修改的数据,key为对应的行号
        this.newRowSettingData = {};    //对新添加行的数据保存,格式为{行号:{start_level: , end_level: , money_limit: ,star_limit}, }
    }

    error(e) {
        Modal.error({
            title: 'warning',
            content: '输入有误!',
            okText: 'OK',
            onOk() {
            }
        });
    }

    ajaxQueryWithdrawLimit () {
        AjaxUtil.querywithdrawlimit(this.handleQueryWithdrawLimit.bind(this));
    }

    ajaxPublishStarChargeProduct (data) {
        AjaxUtil.publishWithdrawlimit(this.handlePublishStarChargeProduct.bind(this), data);
    }


    handleQueryWithdrawLimit (data) {
        data.sort(function (a, b) {
            return a.start_level > b.start_level ? true : false
        })

        function starLimitToStr(star_limit) {
            var str = '';
            while (star_limit > 1000) {
                var remainder = star_limit % 1000;
                if (remainder == 0) {
                    remainder = '000';
                }
                str = ',' +  remainder + str;
                star_limit = Math.floor(star_limit / 1000);
            }
            str = star_limit + str;
            return str
        }

        var tableStrData = [];
        for (var i=0, len=data.length; i<len; i++) {
            var levelStr = '';
            var moneyStr = '$' + data[i].money_limit + '.00';
            var starStr = starLimitToStr(data[i].star_limit);
            if (data[i].start_level == 1) {
                levelStr = 'Lv > ' + data[i].end_level;
            }
            else if (data[i].end_level == 0) {
                levelStr = 'Lv < ' + data[i].start_level;
            }
            else {
                levelStr = data[i].start_level + ' ≤ Lv < ' + data[i].end_level;
            }
            tableStrData.push({
                levelStr: levelStr,
                moneyStr: moneyStr,
                starStr: starStr
            });
        }

        this.tableStrData = tableStrData;
        this.setState({
            tableData: data
        });
    }

    handlePublishStarChargeProduct (data) {
        this.handleQueryWithdrawLimit(data);
    }

    componentWillMount () {
        this.ajaxQueryWithdrawLimit();
    }

    handleEdit (e) {
        this.setState ({
            isEdit: true
        })
    }
    /**
     *  点击publish按钮调用
     */
    handlePublish (e) {
        const self = this;
        confirm({
            title: 'Are you sure to publish',
            onOk() {

                /**
                 *  检查money_limit修改列表,将更改更新到tableData
                 */
                for (let key in self.priceSettingData) {
                    if (self.priceSettingData[key] != '') {
                        self.state.tableData[key].money_limit = self.priceSettingData[key];
                        self.state.tableData[key].star_limit = parseInt(self.priceSettingData[key]) * 365;
                    }
                }
                /**
                 *  检查等级修改列表,将更改更新到tableData
                 */
                for (let key in self.levelSettingData) {
                    if (self.levelSettingData[key] != '') {
                        if (self.state.tableData[key].start_level > self.levelSettingData[key]) {
                            self.error();
                            return;
                        }
                        else {
                            self.state.tableData[key].end_level = self.levelSettingData[key];
                        }

                    }
                }
                /**
                 *  检查新添加的行
                 */
                for (let key in self.newRowSettingData) {
                    let lastRowData = self.state.tableData[self.state.tableData.length-1];
                    let data = self.newRowSettingData[key];
                    //如果start_level或money_limit未填,提示错误信息
                    if (!('start_level' in data) || !('money_limit' in data)) {
                        self.error();
                        return;
                    }
                    //如果end_level未填,表示只设置了上限,将end_level设置为0
                    if (data.end_level == '') {
                        data.end_level = 0;
                    }
                    //计算star_limit
                    data.star_limit = parseInt(data.money_limit) * 365
                    //将新行数据添加到tableData
                    self.state.tableData.push(data);
                }
                //console.log(this.state.tableData, this.newRowSettingData)
                self.ajaxPublishStarChargeProduct(self.state.tableData);
                self.setState ({
                    isEdit: false
                });
            },
            onCancel() {},
        });

    }

    handleCancel (e) {
        this.setState({
            isEdit: false
        });
    }

    /**
     *  添加新行
     */
    handleAddItem (e) {
        this.setState({
            newRow: this.state.newRow.concat([''])
        });
    }
    /**
     *  删除一行
     */
    handleDelItem (index, e) {
        this.state.newRow.splice(index, 1)
        this.setState({
            newRow: this.state.newRow
        });
    }
    /**
     *  删除原有数据一行
     */
    handleDelOldItem (index, e) {
        this.tableStrData.splice(index, 1);
        this.state.tableData.splice(index, 1)
        this.setState({
            tableData: this.state.tableData
        });
    }
    /**
     *  money_limit input值变化调用函数
     */
    priceInputChange(e) {
        var key = e.target.getAttribute('data-key');  //获取data-key属性,用来判断哪一行
        this.priceSettingData[key] = e.target.value;
    }
    /**
     *  level_limit input值变化调用函数
     */
    levelInputChange(e) {
        var key = e.target.getAttribute('data-key');  //获取data-key属性,用来判断哪一行
        this.levelSettingData[key] = parseInt(e.target.value);
    }
    /**
     *  新行 input值变化调用函数
     */
    newRowInputChange(e) {
        var row = e.target.getAttribute('data-row');  //行数
        var key = e.target.getAttribute('data-key');  //关键字,可以是start_level,end_level,money_limit
        var value = e.target.value;
        this.newRowSettingData[row] = this.newRowSettingData[row] || {};
        this.newRowSettingData[row][key] = value;
    }

    render () {
        const tdCls = classNames('price');
        const iptPriceCls = classNames('ipt-price');
        const iptLvCls = classNames('ipt-lv');

        /**
         *  编辑状态
         */
        if (this.state.isEdit) {
            let self = this;
            let newRowInputChange = this.newRowInputChange.bind(this);
            let i = 0;

            //add新行后的渲染內容
            var newRowContent = [];
            for (let len=this.state.newRow.length-1; i<len; i++) {
                newRowContent.push(
                    <tr key={i}>
                        <td><Input data-row={"row"+i} data-key="start_level" className={iptLvCls} onChange={newRowInputChange}></Input> &le; Lv &lt; <Input data-row={"row"+i} data-key="end_level" className={iptLvCls} onChange={newRowInputChange}></Input></td>
                        <td className={tdCls}><Input data-row={"row"+i} data-key="money_limit" className={iptPriceCls} onChange={newRowInputChange}></Input></td>
                        <td></td>
                        <td>
                        </td>
                    </tr>
                )
            }
            //最后一行添加delete按钮
            if (this.state.newRow.length > 0) {
                newRowContent.push(
                    <tr key="ntrlast">
                        <td><Input data-row={"row"+i} data-key="start_level" className={iptLvCls} onChange={newRowInputChange}></Input> &le; Lv &lt; <Input data-row={"row"+i} data-key="end_level" className={iptLvCls} onChange={newRowInputChange}></Input></td>
                        <td className={tdCls}><Input data-row={"row"+i} data-key="money_limit" className={iptPriceCls} onChange={newRowInputChange}></Input></td>
                        <td></td>
                        <td>
                            <a onClick={self.handleDelItem.bind(self, i)}>
                                <span>Delete</span>
                            </a>
                        </td>
                    </tr>
                )
            }


            const priceInputChange = this.priceInputChange.bind(this);

            //根据tableStrData数组数据渲染
            let j = -1;
            var tbodyContent = this.tableStrData.map(function (data) {
                j++;
                //规定前4行就系统设定,不能删除,后续的行为用户设置,在表格最后加入delete按钮,可以进行删除操作
                if (j < 4) {
                    return (
                        <tr key={j}>
                            <td>{data.levelStr}</td>
                            <td className={tdCls}><Input data-key={j} className={iptPriceCls}
                                                         placeholder={data.moneyStr.replace('.00', '').replace('$', '')}
                                                         onChange={priceInputChange}></Input></td>
                            <td>{data.starStr}</td>
                            <td></td>
                        </tr>
                    )
                }
                else {
                    return (
                        <tr key={j}>
                            <td>{data.levelStr}</td>
                            <td className={tdCls}><Input data-key={j} className={iptPriceCls}
                                                         placeholder={data.moneyStr.replace('.00', '').replace('$', '')}
                                                         onChange={priceInputChange}></Input></td>
                            <td>{data.starStr}</td>
                            <td>
                                <a onClick={self.handleDelOldItem.bind(self, j)}>
                                    <span>Delete</span>
                                </a>
                            </td>
                        </tr>
                    )
                }

            });

            var lastRow = this.state.tableData[this.state.tableData.length - 1];
            var lastRowStr = this.tableStrData[this.state.tableData.length - 1];
            //如果最后一行的end_level为0,表示只有上限,需要不同的渲染显示
            if (lastRow.end_level == 0) {
                tbodyContent.pop();
                if (this.state.tableData.length < 5) {
                    tbodyContent.push(
                        <tr key="trlast">
                            <td>{lastRow.start_level + ' ≤ Lv < '}<Input data-key={this.state.tableData.length-1} className={iptLvCls} onChange={this.levelInputChange.bind(this)}></Input></td>
                            <td className={tdCls}><Input data-row={"row"+(this.state.tableData.length-1)} data-key={this.state.tableData.length-1} className={iptPriceCls} placeholder={lastRowStr.moneyStr.replace('.00', '').replace('$', '')} onChange={priceInputChange}></Input></td>
                            <td>{lastRowStr.starStr}</td>
                            <td></td>
                        </tr>
                    );
                }
                else {
                    tbodyContent.push(
                        <tr key="trlast">
                            <td>{lastRow.start_level + ' ≤ Lv < '}<Input data-key={this.state.tableData.length-1} className={iptLvCls} onChange={this.levelInputChange.bind(this)}></Input></td>
                            <td className={tdCls}><Input data-row={"row"+(this.state.tableData.length-1)} data-key={this.state.tableData.length-1} className={iptPriceCls} placeholder={lastRowStr.moneyStr.replace('.00', '').replace('$', '')} onChange={priceInputChange}></Input></td>
                            <td>{lastRowStr.starStr}</td>
                            <td>
                                <a onClick={self.handleDelOldItem.bind(self, j)}>
                                    <span>Delete</span>
                                </a>
                            </td>
                        </tr>
                    );
                }

            }
            tbodyContent.push(newRowContent);

            //添加新行按钮
            var addButton = [
                <Col key="c1">
                    <a onClick={this.handleAddItem.bind(this)}>
                        <Icon type="plus-circle-o" className="plusIcon" />
                        <span className="ml10">Add New</span>
                    </a>
                </Col>
            ];
            //编辑按钮
            var editButton = [
                <Button key="b1" type="primary" onClick={this.handlePublish.bind(this)}>Publish</Button>,
                <Button key="b2" type="primary" onClick={this.handleCancel.bind(this)} style={{marginLeft: 50}}>Cancel</Button>
            ];
        }

        /**
         *  正常查看状态
         */
        else {
            var tbodyContent = this.tableStrData.map(function (data, index) {
                return <tr key={index}><td>{data.levelStr}</td><td className={tdCls}>{data.moneyStr}</td><td>{data.starStr}</td><td></td></tr>
            })

            var addButton = null;
            var editButton = [
                <Button key="b1" type="primary" onClick={this.handleEdit.bind(this)}>Edit</Button>
            ];
        }

        return(
            <div className="m-withdrawal-limit">
                <Row type="flex" justify="start">
                    <table className="m-lmt-tbl">
                        <thead>
                            <tr>
                                <th>Level</th>
                                <th>Maxinum Amount</th>
                                <th>Star Deduction</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tbodyContent}
                        </tbody>
                    </table>
                </Row>
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