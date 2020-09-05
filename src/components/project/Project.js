import React, {useState, useEffect, Link } from "react";
//import Board from "react-trello";
//import debug from "../../utils/debug";
import {webService} from "../../utils/api/webservice";
import ProjectTasks from './ProjectTasks';
import { useLocation} from "react-router";
import queryString from 'query-string';


const Project = (props) => {

    const [project, setProject] = useState({});
    const [projectTasks, setProjectTask] = useState([]);
    const [offset, setOffset] = useState(0);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);

    const location = useLocation();
    const { pid } = queryString.parse(location.search) ?? '';
    

    useEffect(() => {
        const fetchProject = async () => {
            const query = `SELECT * from project WHERE id = ${pid} LIMIT 1`;
            await webService.doQuery(query)
                .then(async function (result) {
                    setProject(result[0]);
                })
                .catch(function (error) {
                    console.log("Error: ", error)
                })
        };
        fetchProject();
    }, []); 

    return (    
        <>
            <h3 className="text-center"> {project?.projectname} </h3>
            <ProjectTasks  {...{projectId: pid}} />
        </>
    )
};


export default Project;