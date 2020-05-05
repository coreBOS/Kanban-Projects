import React, {useState, useEffect} from "react";
import Board from "react-trello";
import debug from "../../utils/debug";
import {webService} from "../../utils/api/webservice";
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


const Dashboard = () => {
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
        const fetchData = async () => {
            await webService.doLogin('admin', 'cdYTBpiMR9RfGgO', false)
                .then(async function (response) {
                    const query = 'select * from ProjectTask where projectid=33x5991';
                    await webService.doQuery(query)
                        .then(async function (tasksResponse) {
                            console.log("Task Response: ", tasksResponse);
                            await tasksResponse.map(task => {
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
                            console.log("Lane Data", lanesData);
                            setBoardData({...boardData, ['lanes']: lanesData});
                        })
                        .catch(function (tasksError) {
                            console.log("Error: ", tasksError)
                        })
                })
                .catch(function (error) {
                    console.log("error", error)
                })
        };
        fetchData();
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


export default Dashboard;