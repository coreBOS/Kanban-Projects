import React, {useState, useEffect, Link } from "react";
//import Board from "react-trello";
//import debug from "../../utils/debug";
import {webService} from "../../utils/api/webservice";
import 'tui-grid/dist/tui-grid.css';
import Grid from '@toast-ui/react-grid';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

import {
    PROJECT,
  } from '../../settings/constants';


const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [offset, setOffset] = useState(0);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [isLoading, setIsLoading] = useState(false);
    const searchQuery = `SELECT * from project ORDER BY id DESC LIMIT ${offset}, ${perPage}`;


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
    }, []);
    
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
        let currentOffset = offset;
        setPage(pageNumber + direction);
        let newOffset = direction >= 0 ? currentOffset + perPage : currentOffset - perPage;
        newOffset = newOffset >= 0 ? newOffset : 0;
        setOffset(newOffset);
        const q = `SELECT * from project ORDER BY id DESC LIMIT ${newOffset}, ${perPage}`;
        fetchProjects(q);
    };

    const Loader = () => {
        return (
            <div className="bg-transparent" style={{position: 'fixed', top: '50%', left: '50%', zIndex: '1000'}}>
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
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
            <div className="my-3 d-flex float-right">
                <button className="btn btn-primary mx-1" onClick={() => paginate(page, -1)} disabled={ page <= 1 || isLoading } >Previous</button>
                <button className="btn btn-primary mx-1" onClick={() => paginate(page, 1)} next="true" disabled={ isLoading } >Next</button>
            </div>
        </div>
    )
};


export default Projects;