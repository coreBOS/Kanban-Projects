import React, {useState, useEffect, Link } from "react";
//import Board from "react-trello";
//import debug from "../../utils/debug";
import {webService} from "../../utils/api/webservice";
import 'tui-grid/dist/tui-grid.css';
import Grid from '@toast-ui/react-grid';

import {
    PROJECT,
  } from '../../settings/constants';


const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [offset, setOffset] = useState(0);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(20);

    const projectColumns = [
/*         {
            rowHeaders: [
                {
                  type: 'checkbox',
                  header: `
                    <label for="all-checkbox" class="checkbox">
                      <input type="checkbox" id="all-checkbox" class="hidden-input" name="_checked" />
                      <span class="custom-input"></span>
                    </label>
                  `
                }
            ]
        }, */
        { 
            header: 'Project name', 
            name: 'projectname',
            formatter: (rowData) => {
                return `<a href="#${PROJECT}?pid=${rowData.row.id}"> ${rowData.value} </a>`;
                //return `<Link to={#${PROJECT}/${rowData.row.id}}>${rowData.value}</Link>`;
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
                    setProjects(result);
                })
                .catch(function (error) {
                    console.log("Error: ", error)
                })
        };
        fetchProjects();
    }, []); 

    return (
        <Grid
            data={projects}
            columns={projectColumns}
            rowHeight={25}
            heightResizable={true}
            rowHeaders={['rowNum']}
            /* bodyHeight={100} */
        />
    )
};


export default Projects;