import React, {useState, useEffect} from "react";
import Projects from "../project/Projects";

const Dashboard = () => {

    return (
        <div className={'kanban-container'} style={{padding: '0 15px'}}>
            <Projects />
        </div>
    )
    
};


export default Dashboard;