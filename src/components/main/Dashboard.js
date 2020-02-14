import React, {useState, useEffect} from "react";
import Board from "react-trello";
import debug from "../../utils/debug";
import {webService} from "../../utils/api/webservice";

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
    const [projectTask, setProjectTask] = useState([]);
    const lanesData = [];
    const cardsData = [];

    useEffect(() => {
        const fetchData = async () => {
            await webService.doLogin('admin', 'cdYTBpiMR9RfGgO', false)
                .then(async function (response) {
                    const query = 'select * from ProjectTask where projectid=33x5991';
                    await webService.doQuery(query)
                        .then(async function (tasksResponse) {
                            setProjectTask(tasksResponse);
                            await tasksResponse.map(task => {
                                const cardObj = {
                                    'id': task.projecttasknumber,
                                    'title': task.projecttask_no,
                                    'description': task.description,
                                    'label': task.projecttaskprogress
                                };
                                cardsData.push(cardObj);

                                const taskObj = {
                                    'id': task.id,
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

    return (
        <div>
            <div>
                <Board
                    draggable
                    editable
                    canAddLanes
                    editLaneTitle
                    onCardAdd={() => handleCardAdd()}
                    data={boardData}
                    onDataChange={shouldReceiveNewData}
                    eventBusHandle={setEventBus}
                    handleDragStart={handleDragStart}
                    handleDragEnd={handleDragEnd}
                    onLaneUpdate={(laneId, data) => debug(`onLaneUpdate: ${laneId} -> ${data.title}`)}
                    onLaneAdd={t => debug('You added a lane with title ' + t.title)}
                    tagStyle={{fontSize: '80%'}}
                />
            </div>
        </div>
    )
};


export default Dashboard;