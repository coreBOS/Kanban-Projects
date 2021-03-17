import React from "react";
//import {connect} from "react-redux";
import {MovableCardWrapper } from 'react-trello/src/styles/Base';

const ProjectTaskCard = (props) => {
    //console.log(props);
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
                    {props?.projecttaskname} - {props.projecttask_no} <br />
                    <span>{taskPriorityLabel(props.projecttaskpriority)}</span>
                </header>
                <div style={{fontSize: 12}}>
                    <div className={'d-block'}>
                        <p>{props.description}</p>
                        <hr/>
                        <div className={'d-flex'}>
                            <span className={'mr-2'}>{props.startdate} - {props.enddate}</span>
                            <span className={'mr-2'}>Wor. Hours: {props.projecttaskhours}</span>
                        </div>
                    </div>
                </div>
            </MovableCardWrapper>
        </React.Fragment>
    )
};


export default ProjectTaskCard;