import React, {useState, useEffect, Link } from "react";
import {webService} from "../../utils/api/webservice";
import Board from "react-trello";
import debug from "../../utils/debug";
import CommentDialog from "../dialog/comment";
import ProjectTaskCard from "../utils/Card";
import AddTaskCardForm from "../utils/AddCard";
import AddTaskLaneForm from "../utils/AddLane";

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
    const [projectTasks, setProjectTask] = useState([]);
    const [offset, setOffset] = useState(0);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);

    const [boardData, setBoardData] = useState({lanes: []});
    const [eventBus, setEventBus] = useState([]);
    const [clickedProjectTaskId, setClickedProjectTaskId] = useState('');
    const [clickedProjectTaskMetadata, setClickedProjectTaskMetadata] = useState('');
    const [clickedProjectTaskLaneId, setClickedProjectTaskLaneId] = useState('');
    const [openCommentDialog, setOpenCommentDialog] = useState(false);
    const lanesData = [];
    const cardsData = [];
    const components = {
        Card: ProjectTaskCard,
        NewCardForm: AddTaskCardForm,
        NewLaneForm: AddTaskLaneForm
    };

    useEffect(() => {
        const fetchProject = async () => {
            const query = `SELECT * FROM ProjectTask WHERE projectid = ${props?.projectId}  ORDER BY id DESC LIMIT ${offset}, ${limit}`;
            console.log(query);
            await webService.doQuery(query)
                .then(async function (result) {
                    setProjectTask(result);
                    await result.map(task => {
                        const cardObj = {
                            'id': task.id,
                            'taskNumber': task.projecttask_no,
                            'taskDescription': task.description,
                            'taskProgress': task.projecttaskprogress,
                            'taskPriority': task.projecttaskpriority,
                            'assignedTo': task,
                            'startDate': task.startdate,
                            'endDate': task.enddate
                        };
                        cardsData.push(cardObj);

                        const taskObj = {
                            'id': task.projecttask_no,
                            'title': task.projecttaskname,
                            'label': task.projecttaskhours,
                            'cards': cardsData
                        };
                        lanesData.push(taskObj)
                    });
                    setBoardData({...boardData, ['lanes']: lanesData});
                })
                .catch(function (error) {
                    console.log("Error: ", error)
                })
        };
        fetchProject();
    }, []); 

    const shouldReceiveNewData = nextData => {
        console.log('New card has been added');
        console.log(nextData);
    };

    const handleCardAdd = (card, laneId) => {
        console.log(`New card added to lane ${laneId}`);
        console.dir(card);

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
            <Board
                draggable
                editable
                canAddLanes
                editLaneTitle
                onCardAdd={() => handleCardAdd()}
                onCardClick={handleOnCardClick}
                data={boardData}
                onDataChange={shouldReceiveNewData}
                eventBusHandle={setEventBus}
                handleDragStart={handleDragStart}
                handleDragEnd={handleDragEnd}
                components={components}
                onLaneUpdate={(laneId, data) => debug(`onLaneUpdate: ${laneId} -> ${data.title}`)}
                onLaneAdd={t => debug('You added a lane with title ' + t.title)}
                tagStyle={{fontSize: '80%'}}
            />
            {openCommentDialog ? <CommentDialog projectTaskMetadata={clickedProjectTaskMetadata} projectTaskLaneId={clickedProjectTaskLaneId} projectTaskId={clickedProjectTaskId} isOpen={openCommentDialog} handleDialogOnClose={handleDialogOnClose}/> : null}
        </div>
    )

};


export default ProjectTasks;