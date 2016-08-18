/**
 * Created by zhengyingya on 16/7/14.
 */

import React from 'react';
//import EChart from 'rc-echarts';
import EChart from '../../components/Common/Echart';
import Theme from './EChartTheme';
import { Row, Col, Icon, Table, Select, DatePicker } from 'antd';
import './index.less';
import { Panel, PanelTool } from '../../components/Common/Panel';
import { PureTab, TabTool } from '../../components/Common/PureTab';
import TagSelect from '../../components/Common/TagSelect';
import { AjaxUtil } from '../auth';
import { dateFormat } from '../../utils/CommonUtils';
import EchartOption from '../../utils/echartOption';
import enUS from 'antd/lib/date-picker/locale/en_US';

const Option = Select.Option;

export default class UserRetentionChart extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            titleType: 'User Retention',        //panel显示的文字
            indicatorName: '',                  //ajax请求的一维key
            totalType: ['region'],              //ajax请求的二维key,对应tab中的各项菜单
            tabText: [],                        //tab各菜单显示的文字
            currentReqType: '',                 //当前请求的二维key,用于获取到数据后更新对应的echart option
            panelStartDate: '',
            legendData: '',
            xAxisData: '',
            totalRegisterUserData: '',          //总的注册人数
            countryRegisterUserData: {},        //各个国家的注册人数
            totalCountryData: {},               //总的留存数据
            countryData: {},                    //各个国家的留存数据
            titleTypeOption: {},                //panel图表的option
            selCountry: '',                     //country select当前选中值
            selCountryOptions: [],
        };
    }
    /**
     * 一维数据请求
     */
    ajaxRetainDataWithoutDim (data) {
        AjaxUtil.retainDataWithoutDim(this.handleAjaxRetainDataWithoutDim.bind(this), data);
    }
    /**
     * 二维数据请求
     */
    ajaxRetainDataWithOneDim (data) {
        AjaxUtil.retainDataWithOneDim(this.handleAjaxRetainDataWithOneDim.bind(this), data);
    }
    /**
     * 一维数据请求回调
     */
    handleAjaxRetainDataWithoutDim (data) {
        var legendData = [];
        var series = [];
        const seriesData = data.seriesData;
        for (let k in seriesData) {
            legendData.push(k);
            const retainData = seriesData[k].retainData;
            var _l = [];
            for (let _k in retainData) {
                _l.push(retainData[_k]);
            }
            series.push(_l);
        }
        var lineOption = EchartOption.getLineOption('', legendData, data.xAxisData, series);
        this.changeLineOption(lineOption,  data.registerUserCount);

        this.setState({
            legendData: legendData,
            xAxisData: data.xAxisData,
            titleTypeOption: lineOption,
            totalCountryData: series,
            totalRegisterUserData: data.registerUserCount,
        })
    }
    /**
     * 二维数据请求回调
     */
    handleAjaxRetainDataWithOneDim (data) {
        //获取所有的国家,用于select中选择
        const registerUserData = data.registerUserData;
        let country = ['All'];
        let countries = [];
        let countryRegisterUserData = {};
        for (let k in registerUserData) {
            country.push(k);
            countries.push(k);
            countryRegisterUserData[k] = registerUserData[k];
        }

        //解析各个国家的留存数据 后台数据格式:{seriesData: {userActive: {timeLineData: {2016-07-12: [{name: 'US', value: '1'}]}}}}
        var series = {};
        const seriesData = data.seriesData;
        for (let k in seriesData) {
            const timeLineData = seriesData[k].timeLineData;
            let _d = {};
            for (let date in timeLineData) {
                for (let i = 0, len = timeLineData[date].length; i < len; i++) {
                    let _k = timeLineData[date][i].name;
                    if (_d[_k] == undefined) {
                        _d[_k] = [];
                    }
                    _d[_k].push(timeLineData[date][i].value);
                }
            }

            for (let _c in countries) {
                let country = countries[_c];
                if (series[country] == undefined) {
                    series[country] = [];
                }
                series[country].push(_d[country]);
            }
        }

        this.setState({
            selCountry: country[0],
            selCountryOptions: country,
            countryData: series,
            countryRegisterUserData: countryRegisterUserData
        })
    }

    componentWillMount () {
        var nowDate = new Date();
        const endDate = dateFormat(nowDate, 'yyyy-MM-dd');          //获取当前的日期,并格式化
        var startDate = dateFormat(new Date(nowDate.valueOf() - 3600 * 24 * 7 * 1000), 'yyyy-MM-dd');      //计算开始日期,按往前15天计算
        this.state.panelStartDate = startDate;                      //分别设置开始日期和结束日期
        this.setState({
            panelStartDate: startDate
        })
        const data = {
            registerDateStr: startDate,
        };

        this.ajaxRetainDataWithoutDim(data);
        this.ajaxRetainDataWithOneDim(Object.assign({}, data, {type: this.state.totalType[0]}));
    }
    /**
     * 对lineoption一些配置参数做调整
     */
    changeLineOption (lineOption, totalRegister) {
        lineOption.tooltip = {
            trigger: 'axis',
            formatter: function (params) {
                let str = '';
                for (let i in params) {
                    str += `${params[i].seriesName}: ${params[i].value} (${(((params[i].value)/totalRegister)*100).toFixed(2)}%)<br>`;
                }
                return `Total register: ${totalRegister} <br>` + str
            }
        }
    }
    /**
     * panel组件的日期选择
     */
    panelDatePickerChange(value) {
        if (value == null) {
            return
        }
        console.log('----', value)
        const startDate = dateFormat(new Date(value.valueOf() - 3600 * 24 * 1000 * 0), 'yyyy-MM-dd');
        this.state.panelStartDate = startDate;
        const data = {
            registerDateStr: startDate,
        };
        this.ajaxRetainDataWithoutDim(data);
        this.ajaxRetainDataWithOneDim(Object.assign({}, data, {type: this.state.totalType[0]}));
        this.setState({
            titleTypeOption: {}
        })
    }
    /**
     * select选择变化回调函数
     */
    onSelect (value, option) {
        if (value == 'All') {
            var lineOption = EchartOption.getLineOption('', this.state.legendData, this.state.xAxisData, this.state.totalCountryData);
            this.changeLineOption(lineOption,  this.state.totalRegisterUserData);
        }
        else {
            const series = this.state.countryData[value];               //获取对应选中国家的留存数据
            var lineOption = EchartOption.getLineOption('', this.state.legendData, this.state.xAxisData, series);
            this.changeLineOption(lineOption,  this.state.countryRegisterUserData[value]);
        }

        this.setState({
            selCountry: value,
            titleTypeOption: lineOption
        })
    }

    render () {

        const optionsContent = this.state.selCountryOptions.map( (data, index) => {
            return (
                <Option key={index} value={data}>{data}</Option>
            )
        });

        return (
            <div>
                <Panel title={this.state.titleType}>
                    <TagSelect tag="Country" value={this.state.selCountry} options={optionsContent} onSelect={this.onSelect.bind(this)}></TagSelect>
                    <div style={{display:"flex"}}>
                        <EChart options={this.state.titleTypeOption} theme={Theme} style={{flex: 1}}></EChart>
                    </div>
                    <PanelTool>
                        <DatePicker
                            locale={{ ...enUS}}
                            style={{ width: 140 }}
                            placeholder={this.state.panelStartDate}
                            onChange={this.panelDatePickerChange.bind(this)}/>
                    </PanelTool>
                </Panel>
            </div>
        )
    }
}
