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

    /**
     * projecttaskname: "Charles Davies"
     projecttask_no: "prjt-0000692"
     projecttaskpriority: "normal"
     projecttasktype: "design"
     projecttasknumber: "2147483647"
     projectid: "33x5991"
     assigned_user_id: "19x5"
     email: "soledad_mockus@yahoo.com"
     projecttaskstatus: ""
     created_user_id: "19x1"
     projecttaskprogress: "30%"
     projecttaskhours: "134"
     startdate: "2016-11-04"
     enddate: "2016-11-20"
     createdtime: "2015-05-26 01:21:08"
     modifiedtime: "2015-12-19 15:36:10"
     modifiedby: "19x1"
     description: "non ante bibendum ullamcorper. Duis cursus, diam at pretium aliquet, metus urna convallis erat, eget tincidunt dui augue eu tellus. Phasellus elit pede, malesuada vel, venenatis vel, faucibus id, libero. Donec consectetuer mauris id sapien. Cras dolor dolor, tempus non, lacinia at, iaculis quis, pede. Praesent eu dui. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean"
     id: "32x7551"
     */

    useEffect(() => {
        const fetchData = async () => {
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