import React from "react";
//import {connect} from "react-redux";
import {MovableCardWrapper } from 'react-trello/src/styles/Base';

const ProjectTaskCard = (props) => {
    /* const getTaskLabel = (data, type) => {

    }; */

    const taskPriorityLabel = (priority) => {
        switch (priority) {
            case 'normal':
                return(
                    <span className={'badge badge-info'} style={{marginRight: 10}}>{priority}</span>
                );
            case 'high':
                return (
                    <span className={'badge badge-danger'}>{priority}</span>
                );
            case 'low':
                return (
                    <span className={'badge badge-primary'}>{priority}</span>
                )
            default: 
                return (
                    <span className={'badge badge-dark'}>{priority}</span>
                )
        }
    };

    return(
        <React.Fragment>
            <MovableCardWrapper
                data-id={props.id}
                onClick={props.onClick}
                className={props.className}>
                <header
                    style={{
                        borderBottom: '1px solid #eee',
                        display: 'flex',
                        flexDirection: 'row',
                        paddingBottom: 10,
                        justifyContent: 'space-between'
                    }}>
                    {taskPriorityLabel(props.taskPriority)}
                    <div style={{fontSize: 12, fontWeight: 'bold'}}>{props.taskNumber}</div>
                </header>
                <div style={{fontSize: 12}}>
                    <div>
                        <p>{props.taskDescription}</p>
                        <hr/>
                        <div className={'pull-left'}>
                            <b>Start Date: </b> {props.startDate}
                            <br/>
                            <b>End Date: </b> {props.endDate}
                        </div>
                        <div className={'pull-right'}></div>
                    </div>
                </div>
            </MovableCardWrapper>
        </React.Fragment>
    )
};


export default ProjectTaskCard;