import React, {useEffect, useState} from "react";
import Board from "react-trello";
import debug from "../../utils/debug";


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

const App = () => {
    const [boardData, setBoardData] = useState({ lanes: []});
    const [eventBus, setEventBus] = useState([]);

    // const getBoard = () => {
    //     return new Promise(resolve => {
    //         resolve(data)
    //     });
    // };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const response = await getBoard();
    //         console.log("Response", response);
    //         setBoardData(response);
    //     };
        // fetchData();
    // }, []);

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
                <h3>CoreBOS Kanban View</h3>
            </div>
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
                    onLaneUpdate={ (laneId, data) => debug(`onLaneUpdate: ${laneId} -> ${data.title}`)}
                    onLaneAdd={t => debug('You added a line with title ' + t.title)}
                    tagStyle={{fontSize: '80%'}}
                />
            </div>
        </div>
    )
};


export default App;