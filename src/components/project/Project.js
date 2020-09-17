import React, {useState, useEffect, Link } from "react";
//import Board from "react-trello";
//import debug from "../../utils/debug";
import {webService} from "../../utils/api/webservice";
import ProjectTasks from './ProjectTasks';
import { useLocation} from "react-router";
import queryString from 'query-string';
//import { SetRandomValue } from '../../utils/lib/WSClientHelper';
//import { TASK_STATUS } from '../../settings/constants';


const Project = (props) => {

    const [project, setProject] = useState({});
    const location = useLocation();
    const { pid } = queryString.parse(location.search) ?? '';
    

    useEffect(() => {
        fetchProject();
        //const taskStatusList = Object.values(TASK_STATUS);
        //SetRandomValue('ProjectTask', 'projecttaskstatus' ,taskStatusList);
    }, []); 

    const fetchProject = () => {
        const query = `SELECT * from project WHERE id = ${pid} LIMIT 1`;
        webService.doQuery(query)
            .then(async function (result) {
                setProject(result[0]);
            })
            .catch(function (error) {
                console.log("Error: ", error)
            })
    };

    return (    
        <>
            <h3 className="text-center"> {project?.projectname} </h3>
            <ProjectTasks  {...{projectId: pid}} />
        </>
    )
};


export default Project;