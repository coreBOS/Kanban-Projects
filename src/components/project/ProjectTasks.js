import React, { useState, useEffect } from "react";
import { webService } from "../../utils/api/webservice";
import { TASK_STATUS } from '../../settings/constants';
import Board from "react-trello";
import debug from "../../utils/debug";
import CommentDialog from "../dialog/comment";
import ProjectTaskCard from "../utils/Card";
import AddTaskCardForm from "../utils/AddCard";
import AddTaskLaneForm from "../utils/AddLane";
//import AddCardLink from '../utils/AddCardLink';
import { loadModuleFields } from "../../utils/lib/WSClientHelper";
import { MOD_PROJECT_TASK }  from '../../settings/constants'; 
import {AddCardLink} from 'react-trello/src/styles/Base';


const handleDragStart = (cardId, laneId) => {
    console.log('drag started');
    console.log(`cardId: ${cardId}`);
    console.log(`laneId: ${laneId}`)
};

const handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
    console.log('drag ended');
    console.log(`cardId: ${cardId}`);
    console.log(`sourceLaneId: ${sourceLaneId}`);
    console.log(`targetLaneId: ${targetLaneId}`);
};

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
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);


    const AddTaskCardLink = () => {
        return (
            <>
                <AddCardLink onClick={toggle}>
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
        setIsLoading(true);
        fetchProjectTasks(props?.projectId).then((result) => {
            return result;
        })
        .then((tasks) => {
            prepareCardLanes(tasks);
            loadModuleFields(MOD_PROJECT_TASK).then((modFields) => {
                //console.log(MOD_PROJECT_TASK, modFields);
                setTaskFields(modFields?.fields??[]);
            });
        })
        .catch(function (error) {
            console.log("Error: ", error)
        })
        .finally(() => {
            setIsLoading(false);
        })
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
                if (task.projecttaskstatus === lane.id) {
                    lane.label = `${Number(lane.label) + Number(task.projecttaskhours)}`;
                    lane.cards.push({
                        'id': task.id,
                        'taskNumber': task.projecttask_no,
                        'taskDescription': task.description,
                        'taskProgress': task.projecttaskprogress,
                        'taskPriority': task.projecttaskpriority,
                        'assignedTo': task,
                        'startDate': task.startdate,
                        'endDate': task.enddate,
                    });
                }
            });
        });

        setBoardData({ ...boardData, lanes: lanesData });
    }

    const fetchProjectTasks = async (projectId) => {
       
        const query = `SELECT * FROM ProjectTask WHERE projectid = ${projectId}  ORDER BY id DESC`;
        setIsLoading(true);
        const tasks = await webService.doQuery(query);
        return tasks;
        
    };

    const Loader = () => {
        return (
            <div className="bg-transparent text-white" style={{position: 'fixed', top: '50%', left: '50%', zIndex: '1000'}}>
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        )
    }

    const shouldReceiveNewData = nextData => {
        console.log('New card has been added');
        console.log(nextData);
    };

    const handleCardAdd = (card) => {
        console.log(card);
        //console.log(`New card added to lane ${laneId}`);
        //console.dir(card);
    };

    const handleOnCardClick = (projectTaskId, projectTaskMetadata, projectTaskLaneId) => {
        setClickedProjectTaskId(projectTaskId);
        setClickedProjectTaskLaneId(projectTaskLaneId);
        setClickedProjectTaskMetadata(projectTaskMetadata);
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
                canAddLanes
                editLaneTitle
                onCardAdd={(card) => handleCardAdd(card)}
                onCardClick={handleOnCardClick}
                data={boardData}
                onDataChange={shouldReceiveNewData}
                eventBusHandle={setEventBus}
                handleDragStart={handleDragStart}
                handleDragEnd={handleDragEnd}
                components={components}
                onLaneUpdate={(laneId, data) => debug(`onLaneUpdate: ${laneId} -> ${data.title}`)}
                onLaneAdd={t => debug('You added a lane with title ' + t.title)}
                tagStyle={{ fontSize: '80%' }}
            />
            {openCommentDialog ? <CommentDialog projectTaskMetadata={clickedProjectTaskMetadata} projectTaskLaneId={clickedProjectTaskLaneId} projectTaskId={clickedProjectTaskId} isOpen={openCommentDialog} handleDialogOnClose={handleDialogOnClose} /> : null}
            {modal && <AddTaskCardForm toggle={toggle} isOpen={modal} project={props?.project} taskFields={taskFields} />}
        </div>
    )

};


export default ProjectTasks;