import React, { useState, useEffect } from "react";
import { webService } from "../../utils/api/webservice";
import { TASK_STATUS } from '../../settings/constants';
import Board from "react-trello";
import { AddCardLink } from 'react-trello/src/styles/Base';
import debug from "../../utils/debug";
import CommentDialog from "../dialog/comment";
import ProjectTaskCard from "../utils/Card";
import AddTaskCardForm from "../utils/AddCard";
import AddTaskLaneForm from "../utils/AddLane";
import Loader from "../utils/Loader";
//import AddCardLink from '../utils/AddCardLink';
import { loadModuleFields, capitalizeText } from "../../utils/lib/WSClientHelper";
import { MOD_PROJECT_TASK, MOD_COMMENT }  from '../../settings/constants'; 


const ProjectTasks = (props) => {
    //const [projectTasks, setProjectTasks] = useState([]);
    const [boardData, setBoardData] = useState({ lanes: [] });
    /* eslint-disable no-unused-vars */
    const [eventBus, setEventBus] = useState([]);
    const [clickedProjectTaskId, setClickedProjectTaskId] = useState('');
    const [clickedProjectTaskMetadata, setClickedProjectTaskMetadata] = useState('');
    const [clickedProjectTaskLaneId, setClickedProjectTaskLaneId] = useState('');
    const [openCommentDialog, setOpenCommentDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const lanesData = [];
    const [taskFields, setTaskFields] = useState([]);
    const [commentFields, setCommentFields] = useState([]);
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const handleAddCardLink = () => {
        toggle();
    }

    const AddTaskCardLink = () => {
        return (
            <>
                <AddCardLink onClick={handleAddCardLink}>
                    {'Click to add task'}
                </AddCardLink>
            </>
        )
    }
    
    const components = {
        Card: ProjectTaskCard,
        //NewCardForm: AddTaskCardForm,
        NewLaneForm: AddTaskLaneForm,
        AddCardLink: AddTaskCardLink
    };

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        reloadProjectTasks(true);
        loadModuleFields(MOD_PROJECT_TASK).then((modFields) => {
            setTaskFields(modFields?.fields??[]);
        });
        loadModuleFields(MOD_COMMENT).then((modFields) => {
            setCommentFields(modFields?.fields??[]);
        });
    }, []);

    const prepareCardLanes = (tasks) => {
        for (const key in TASK_STATUS) {
            if (TASK_STATUS.hasOwnProperty(key)) { 
                lanesData.push({
                    'id': TASK_STATUS[key],
                    'title': TASK_STATUS[key] || key,
                    'label': '0',
                    'cards': [],
                });
            }
        } 

        tasks.forEach(task => {
            lanesData.forEach(lane => {
                if (capitalizeText(task.projecttaskstatus) === capitalizeText(lane.id)) {
                    lane.label = `${Number(lane.label) + 1}`;
                    //lane.label = lane.label+1;
                    lane.cards.push(task);
                }
            });
        });

        setBoardData({ ...boardData, lanes: lanesData });
    }

    const fetchProjectTasks = async (projectId) => {
       
        const query = `SELECT * FROM ${MOD_PROJECT_TASK} WHERE projectid = ${projectId}  ORDER BY id DESC`;
        const tasks = await webService.doQuery(query);
        return tasks;
        
    };

    const reloadProjectTasks = (showLoader = false) => {
        setIsLoading(showLoader);
        fetchProjectTasks(props?.projectId).then((result) => {
            return result;
        })
        .then((tasks) => {
            prepareCardLanes(tasks);
        })
        .catch(function (error) {
            console.log("Error: ", error)
        })
        .finally(() => {
            setIsLoading(false);
        })
    }

    /*  const shouldReceiveNewData = nextData => {
        console.log('New card has been added');
        console.log(nextData);
    }; */

   /*  const handleDragStart = (cardId, laneId) => {
        console.log('drag started');
        console.log(`cardId: ${cardId}`);
        console.log(`laneId: ${laneId}`)
    }; */
    
    const handleDragEnd = (cardId, sourceLaneId, targetLaneId, position, cardDetails) => {
        cardDetails.projecttaskstatus = cardDetails.laneId;
        delete cardDetails['laneId'];
        webService.doUpdate(MOD_PROJECT_TASK, cardDetails)
        .then(() => {
            reloadProjectTasks(false);
        })
        .catch(function (taskError) {
            console.log("Error: ", taskError);
        });
    };

    const handleCardAdd = () => {
        reloadProjectTasks(false);
    };

    const handleOnCardClick = (taskId, metadata, laneId) => {
        setClickedProjectTaskId(taskId);
        setClickedProjectTaskLaneId(laneId);
        setClickedProjectTaskMetadata(metadata);
        setOpenCommentDialog(true);
    };

    const handleDialogOnClose = () => {
        setOpenCommentDialog(false)
    };

    return (
        <div className={'kanban-container'}>

            { isLoading &&
                <Loader />
            }
            <Board
                draggable
                editable
                //canAddLanes
                //editLaneTitle
                onCardAdd={handleCardAdd}
                onCardClick={(cardId, metadata, laneId) => handleOnCardClick(cardId, metadata, laneId)}
                data={boardData}
                //onDataChange={shouldReceiveNewData}
                eventBusHandle={setEventBus}
                //handleDragStart={handleDragStart}
                handleDragEnd={handleDragEnd}
                components={components}
                onLaneUpdate={(laneId, data) => debug(`onLaneUpdate: ${laneId} -> ${data.title}`)}
                onLaneAdd={t => debug('You added a lane with title ' + t.title)}
                tagStyle={{ fontSize: '80%' }}
            />
            {openCommentDialog ? <CommentDialog projectTaskMetadata={clickedProjectTaskMetadata} projectTaskLaneId={clickedProjectTaskLaneId} projectTaskId={clickedProjectTaskId} isOpen={openCommentDialog} handleDialogOnClose={handleDialogOnClose} commentFields={commentFields} /> : null}
            {modal && <AddTaskCardForm toggle={toggle} isOpen={modal} project={props?.project} taskFields={taskFields} handleCardAdd={handleCardAdd} />}
        </div>
    )

};


export default ProjectTasks;