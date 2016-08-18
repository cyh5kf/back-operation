/**
 * Created by zhengyingya on 16/7/18.
 * 实时数据绘制的组件
 */

import React from 'react';
//import EChart from 'rc-echarts';
import EChart from '../../components/Common/Echart';
import Theme from './EChartTheme';
import { Icon, Table, Input, Button, Checkbox, Select, DatePicker } from 'antd';
import './index.less';
import { Panel, PanelTool } from '../../components/Common/Panel';
import { PureTab, TabTool } from '../../components/Common/PureTab';
import { AjaxUtil } from '../auth';
import { dateFormat } from '../../utils/CommonUtils';
import EchartOption from '../../utils/echartOption';
import TagSelect from '../../components/Common/TagSelect';

import enUS from 'antd/lib/date-picker/locale/en_US';

const Option = Select.Option;

export default class OnlineStatisticsChart extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            titleType: props.titleType,         //panel显示的文字
            indicatorName: props.indicatorName, //ajax请求的一维key
            options: {},
            selectOptions: [],
            countries: [],
            versions: [],
            selDeviceType: 'All',                    //select当前选中值
            selViewUnit: 'daily',
            selCountry: '',
            selVersion: '',
            selMessageType: 'All',
            selRegisterType: 'All',
        };
        this.timer = null;
        this.dailyInterval = 1000 * 60;         //daily查看方式的刷新时间间隔(ms)
        this.hourlyInterval = 1000 * 60;                //hourly查看方式的刷新时间间隔(ms)
    }
    /**
     * 一维数据请求
     */
    ajaxOnlineStatisticsData (data) {
        AjaxUtil.onlineStatisticsData(this.handleAjaxOnlineStatisticsData.bind(this), data);
    }
    /**
     * 获取各个维度的可选项,目前主要是region和version
     */
    ajaxOnlineStatisticsDim (data, callback) {
        AjaxUtil.onlineStatisticsDim(callback.bind(this), data);
    }
    /**
     * 一维数据请求回调
     */
    handleAjaxOnlineStatisticsData (data) {
        var keyDict = {};                   //存储结果数据中的所有key,并把数据初始化为0,如注册类型则遍历后的结果为{'email':'0', 'facebook':'0', 'twitter':'0', 'instagram':'0'}
        for (let k in data.timeLineData) {
            let oneData = data.timeLineData[k];
            for (let i=0, len=oneData.length; i<len; i++) {
                let data = oneData[i];
                //对于注册类型的替换处理,1表示email,2表示facebook,...
                if (this.state.currentReqType == 'register_type'){
                    data.name = data.name == '1' ? 'email' : (data.name == '2' ? 'facebook' : (data.name == '3' ? 'twitter' : (data.name == '4'?'instagram': 'other') ) );
                }
                else if (this.state.currentReqType == 'gender'){
                    data.name = data.name == '0' ? 'not set' : (data.name == '1' ? 'female' : (data.name == '2' ? 'male' : 'secret' ) );
                }
                else if (this.state.currentReqType == 'dev_type'){
                    const type = {'0': 'iOS', '1': 'Android', 'IPHONE': 'iOS', 'ANDROID': 'Android'}
                    data.name = type[data.name];
                }
                keyDict[data.name] = '';
            }
        }

        var d = {};
        var xAxisData = [];
        //遍历timeLineData,取出各日期对应的数据,由于后台返回的数据中,如果某项数据没有,则不会出现,如
        //{'2016-07-01':[{'name':'0', 'value': 200}]},需要利用前面的keyDict将未出现项的数据填为'0'用于绘图
        for (let k in data.timeLineData) {
            xAxisData.push(k)
            let oneData = data.timeLineData[k];
            for (let i=0, len=oneData.length; i<len; i++) {
                let data = oneData[i];
                keyDict[data.name] = data.value;
            }
            for (let k in keyDict) {
                if (d[k] == undefined) {
                    d[k] = [];
                }
                d[k].push(keyDict[k]);
                keyDict[k] = '';
            }
        }

        var keys = [];
        var values = [];
        for (let k in d) {
            keys.push(k);
            values.push(d[k]);
        }

        const lineOption = EchartOption.getLineOption('', keys, xAxisData, values)
        this.setState({
            options: lineOption
        })
    }

    handleAjaxOnlineStatisticsDimRegion (data) {
        var countries = data.dimList;
        countries.unshift('All');
        this.setState({
            countries: countries,
            selCountry: countries[0],
        })
    }
    handleAjaxOnlineStatisticsDimVersion (data) {
        var versions = data.dimList;
        versions.unshift('All');
        this.setState({
            versions: versions,
            selVersion: versions[0]
        })
    }

    componentWillMount () {
        const data = {
            indicatorName: this.state.indicatorName,
            viewUnit: this.state.selViewUnit,
        };

        this.ajaxOnlineStatisticsData(data);
        this.ajaxOnlineStatisticsDim({dimName: 'region'}, this.handleAjaxOnlineStatisticsDimRegion);
        this.ajaxOnlineStatisticsDim({dimName: 'version'}, this.handleAjaxOnlineStatisticsDimVersion);
        var timeDelay = this.hourlyInterval;
        if (this.state.selViewUnit == 'daily') {
            timeDelay = this.dailyInterval;
        }
        console.log(timeDelay)
        this.timer = setInterval( () => {
            this.ajaxOnlineStatisticsData(data)
        }, timeDelay);
    }

    componentWillUnmount () {
        clearInterval(this.timer);
    }

    onSelect (key, value, option) {
        var d = {};
        d[key] = value;
        this.state[key] = value;
        var data = {
            indicatorName: this.state.indicatorName,
            viewUnit: this.state.selViewUnit,
        };
        if (this.state.selCountry != 'All') {
            data.region = this.state.selCountry;
        }
        if (this.state.selDeviceType != 'All') {
            data.devType = this.state.selDeviceType;
        }
        if (this.state.selVersion != 'All') {
            data.version = this.state.selVersion;
        }
        if (this.state.selMessageType != 'All') {
            data.messageType = this.state.selMessageType;
        }
        if (this.state.selRegisterType != 'All') {
            data.registerType = this.state.selRegisterType;
        }
        this.ajaxOnlineStatisticsData(data);

        var timeDelay = this.hourlyInterval;
        if (this.state.selViewUnit == 'daily') {
            timeDelay = this.dailyInterval;
        }
        clearInterval(this.timer);
        this.timer = setInterval( () => {
            this.ajaxOnlineStatisticsData(data)
        }, timeDelay);
        this.setState({...d, options: {}});
    }

    render () {

        const viewUnitOptionContent = [
            <Option key="1" value="daily">Daily</Option>,
            <Option key="2" value="hourly">Hourly</Option>
        ];
        const devTypeOptionContent = [
            <Option key="1" value="All">All</Option>,
            <Option key="2" value="0">iOS</Option>,
            <Option key="3" value="1">Android</Option>
        ];
        const messageTypeOptionContent = [
            <Option key="1" value="All">All</Option>,
            <Option key="2" value="1">TEXT</Option>,
            <Option key="3" value="2">LIKE</Option>,
            <Option key="4" value="3">DANMAKU</Option>,
            <Option key="5" value="4">GIFT</Option>
        ];
        const registerTypeOptionContent = [
            <Option key="1" value="All">All</Option>,
            <Option key="2" value="1">email</Option>,
            <Option key="3" value="2">facebook</Option>,
            <Option key="4" value="3">twitter</Option>,
            <Option key="5" value="4">instagram</Option>
        ];
        const countryOptionContent = this.state.countries.map( (data, index) => (
            <Option key={index} value={data}>{data}</Option>
        ));
        const versionOptionContent = this.state.versions.map( (data, index) => (
            <Option key={index} value={data}>{data}</Option>
        ));

        var selectContent = [
            <TagSelect key="1" tag="ViewUnit" value={this.state.selViewUnit} options={viewUnitOptionContent} onSelect={this.onSelect.bind(this, 'selViewUnit')}></TagSelect>,
            <TagSelect key="2" tag="DeviceType" value={this.state.selDeviceType} options={devTypeOptionContent} onSelect={this.onSelect.bind(this, 'selDeviceType')}></TagSelect>,
            <TagSelect key="3" tag="Country" value={this.state.selCountry} options={countryOptionContent} onSelect={this.onSelect.bind(this, 'selCountry')}></TagSelect>,
            <TagSelect key="4" tag="Version" value={this.state.selVersion} options={versionOptionContent} onSelect={this.onSelect.bind(this, 'selVersion')}></TagSelect>

        ];
        if (this.state.indicatorName == 'channelMessage') {
            selectContent.push(<TagSelect key="5" tag="MessageType" value={this.state.selMessageType} options={messageTypeOptionContent} onSelect={this.onSelect.bind(this, 'selMessageType')}></TagSelect>)
        }
        else if (this.state.indicatorName == 'newRegisterUser') {
            selectContent.push(<TagSelect key="6" tag="RegisterType" value={this.state.selRegisterType} options={registerTypeOptionContent} onSelect={this.onSelect.bind(this, 'selRegisterType')}></TagSelect>);
        }

        return (
            <div>
                <Panel title={this.state.titleType}>
                    <div style={{display: "flex", justifyContent:"space-between", marginBottom: "30px"}}>
                        {selectContent}
                    </div>
                    <div style={{display:"flex"}}>
                        <EChart options={this.state.options} theme={Theme} style={{flex: 1}}></EChart>
                    </div>
                </Panel>
            </div>
        )
    }
}
