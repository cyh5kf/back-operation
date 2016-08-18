/**
 * Created by zhengyingya on 16/7/25.
 */

import React from 'react';
import EChart from 'rc-echarts';
import BasicChart from './BasicChart';
import FunctionDataChart from './FunctionDataChart';

/**
 *
 */
export class EventCode extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <FunctionDataChart></FunctionDataChart>
        )
    }
}