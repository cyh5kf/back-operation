import React from 'react'
import classNames from 'classnames';
import {getThumbUrl40,isArray} from '../../utils/CommonUtils';


export default class RobotCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }


    onClickRobot(robot){
        if(!robot.robotDisabled){
            this.props.onSelectRobot(robot);
        }
    }

    renderRobotList(){
        var robotList = this.props.robotList;
        if (!isArray(robotList)){
            robotList = [];
        }

        var that = this;

        if(robotList.length==0){
            return (<div style={{padding:20}}>no data ...</div>);
        }
        debugger;
        var robotDOM = robotList.map(function(robot,i){
            robot.robotDisabled = (robot.isJoined!==true);
            robot.key = 'robot_key_' + ('pixy_'+robot.pixy_id || i);
            var robotCls = classNames({
                robot:true,
                robotDisabled:robot.robotDisabled,
                robotCurrent:robot.isSelected
            });
            return (
                <div key={robot.key} className={robotCls} onClick={that.onClickRobot.bind(that,robot)}>
                    <img className="robotImg" src={getThumbUrl40(robot.avator || robot.avatar)} />
                    <div className="robotMsg" >
                        <div className="robotName">{robot.name}</div>
                        <div className="robotLastMsg"></div>
                    </div>
                </div>
            );
        });
        return robotDOM;
    }

    render(){
        var robotList = this.props.robotList||[];
        var that = this;

        return (
            <div className="robotList">
                {this.renderRobotList()}
            </div>
        )
    }
}