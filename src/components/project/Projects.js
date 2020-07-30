import React, {useState, useEffect} from "react";
//import Board from "react-trello";
//import debug from "../../utils/debug";
import {webService} from "../../utils/api/webservice";
import Grid from 'tui-grid'; 
import {
    PROJECTS,
  } from '../../settings/constants';


const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [offset, setOffset] = useState(0);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);

    let projectGrid;
    const projectColumns = [
        { 
            header: 'Project name', 
            name: 'projectname',
            formatter: function(rowData) {
                return `<a href={${PROJECTS}/${rowData.row.id}}> ${rowData.value} </a>`;
            }
        }, 
        { header: 'Project #', name: 'project_no' }, 
        { header: 'Created date', name: 'createdtime' }, 
        { header: 'Start date', name: 'startdate' }, 
        { header: 'Target end date', name: 'targetenddate' }, 
        { header: 'Progress', name: 'progress' },
        { header: 'Status', name: 'projectstatus' }
    ]

    useEffect(() => {
        const fetchProjects = async () => {
            const query = `SELECT * from project ORDER BY id DESC LIMIT ${offset}, ${limit}`;
            await webService.doQuery(query)
                .then(async function (result) {
                    //Set projects 
                    projectGrid = new Grid({
                        el: document.getElementById('projectsGrid'),
                        data: result,
                        scrollX: false,
                        scrollY: false,
                        columns: projectColumns
                    }); 
                })
                .catch(function (error) {
                    console.log("Error: ", error)
                })
        };
        fetchProjects();
    }, []); 


    return (
        <div style={{padding: '0 15px'}}>
            <div id="projectsGrid"></div>
        </div>
    )
};


export default Projects;