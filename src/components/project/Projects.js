import React, {useState, useEffect } from "react";
//import Board from "react-trello";
//import debug from "../../utils/debug";
import {webService} from "../../utils/api/webservice";
import 'tui-grid/dist/tui-grid.css';
import Grid from '@toast-ui/react-grid';
//import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import Loader from "../utils/Loader";
import Pagination from '../utils/pagination';

import {
    PROJECT,
  } from '../../settings/constants';


const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [offset, setOffset] = useState(0);
    const [page, setPage] = useState(1);
    const [perPage] = useState(20);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState(`SELECT * from project ORDER BY id DESC LIMIT ${offset}, ${perPage}`);


    const projectColumns = [
        { 
            header: 'Project name', 
            name: 'projectname',
            formatter: (rowData) => {
                return `<a href="#${PROJECT}?pid=${rowData.row.id}"> ${rowData.value} </a>`;
            } 
        }, 
        { header: 'Project #', name: 'project_no' }, 
        { header: 'Created date', name: 'createdtime' }, 
        { header: 'Start date', name: 'startdate' }, 
        { header: 'Target end date', name: 'targetenddate' }, 
        { header: 'Progress', name: 'progress' },
        { header: 'Status', name: 'projectstatus' }
    ];

    useEffect(() => {
        fetchProjects(searchQuery);
    }, [searchQuery]);
    
    const fetchProjects = (query) => {
        setIsLoading(true);
        webService.doQuery(query).then((result) => {
            setProjects(result);
        })
        .catch(function (error) {
            console.log("Error: ", error)
        })
        .finally(() => {
            setIsLoading(false);
        })
    };

    const paginate = (pageNumber, direction) => {
        let newOffset = direction >= 0 ? offset + perPage : offset - perPage;
        newOffset = newOffset >= 0 ? newOffset : 0;
        setOffset(newOffset);
        setPage(pageNumber + direction);
        const q = `SELECT * from project ORDER BY id DESC LIMIT ${newOffset}, ${perPage}`;
        setSearchQuery(q);
    };


    return (
        <>
            <div className="container">
                { isLoading &&
                    <Loader />
                }
                <Grid
                    data={projects}
                    columns={projectColumns}
                    usageStatistics={false}
                    rowHeight={25}
                    heightResizable={true}
                    rowHeaders={['rowNum']}  
                />
            </div>
            <div className={'position-fixed w-100 mx-n3'} style={{ bottom: '0px', 'zIndex': '100', background: '#ddd' }}>
                {projects && projects.length > 0 &&
                    <div className="my-2 w-25 mx-auto text-center">
                        <Pagination paginate={paginate} page={page} isLoading={isLoading}  />
                    </div>
                }
            </div>
        </>
    )
};


export default Projects;