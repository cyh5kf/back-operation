/**
 * Created by zhengyingya on 16/7/1.
 */
import React from 'react'
import './common.less'

export const PanelTool = React.createClass({
    render: () => {
        return null
    }
})

export class Panel extends React.Component {
    constructor () {
        super()
    }

    render () {
        const _props = this.props;
        const tabHeaderTool = _props.children.map( (child, index) => {
            if (child.type.displayName == 'PanelTool') {
                return (
                    <div key={index} style={{marginRight: 10}}>
                        {child.props.children}
                    </div>
                )
            }
        })

        return (
            <div className="m-panel">
                <div className="header">
                    <div style={{flex: '1', display:'flex', }}>{this.props.title}</div>
                    {tabHeaderTool}
                </div>
                <div className="body">
                    <div>
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}
