import React, { useState, useEffect } from "react";
import { webService } from "../../utils/api/webservice";
import { TASK_STATUS } from '../../settings/constants';
import Board from "react-trello";
import { AddCardLink } from 'react-trello/src/styles/Base';
import debug from "../../utils/debug";
import CommentDialog from "../dialog/comment";
import ProjectTaskCard from "../utils/Card";
import AddTaskCardForm from "../utils/AddCard";
import AddTaskLaneForm from "../utils/AddLane";
import Loader from "../utils/Loader";
//import AddCardLink from '../utils/AddCardLink';
import { loadModuleFields, capitalizeText } from "../../utils/lib/WSClientHelper";
import { MOD_PROJECT_TASK, MOD_COMMENT }  from '../../settings/constants'; 
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { styledInput, BootstrapInput } from '../utils/styles';
import IconButton from '@material-ui/core/IconButton';
import SortIcon from '@material-ui/icons/Sort';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { useForm, Controller } from "react-hook-form";
import Button from '@material-ui/core/Button';
import { input } from "../../utils/input";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';



const ProjectTasks = (props) => {
    //const [projectTasks, setProjectTasks] = useState([]);
    const [boardData, setBoardData] = useState({ lanes: [] });
    /* eslint-disable no-unused-vars */
    const [eventBus, setEventBus] = useState([]);
    const [clickedProjectTaskId, setClickedProjectTaskId] = useState('');
    const [clickedProjectTaskMetadata, setClickedProjectTaskMetadata] = useState('');
    const [clickedProjectTaskLaneId, setClickedProjectTaskLaneId] = useState('');
    const [openCommentDialog, setOpenCommentDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const lanesData = [];
    const [taskFields, setTaskFields] = useState([]);
    const [taskFilterFields, setTaskFilterFields] = useState([]);
    const [commentFields, setCommentFields] = useState([]);
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const classes = styledInput();
    const [sortField, setSortField] = useState({name: 'id', sortOrder: 'DESC', label: 'ID'});
    const formMethods = useForm();
    const { handleSubmit, control, errors, reset } = formMethods;

    const defaultQuery = `SELECT * FROM ${MOD_PROJECT_TASK} WHERE projectid = ${props?.projectId}`;
    const [query, setQuery] = useState(defaultQuery);


    const handleAddCardLink = () => {
        toggle();
    }

    const AddTaskCardLink = () => {
        return (
            <>
                <AddCardLink onClick={handleAddCardLink}>
                    {'Click to add task'}
                </AddCardLink>
            </>
        )
    }
    
    const components = {
        Card: ProjectTaskCard,
        //NewCardForm: AddTaskCardForm,
        NewLaneForm: AddTaskLaneForm,
        AddCardLink: AddTaskCardLink
    };

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        loadModuleFields(MOD_PROJECT_TASK).then((modDescribe) => {
            let filterFields = modDescribe?.filterFields?.fields??[];
            for(let index = 0; index < filterFields.length; index++) {
                filterFields[index] = modDescribe?.fields.filter(field => field.name === filterFields[index])[0];
            }
            setTaskFilterFields(filterFields);
            setTaskFields(modDescribe?.fields??[]);
        });
        loadModuleFields(MOD_COMMENT).then((modFields) => {
            setCommentFields(modFields?.fields??[]);
        });
    }, []);

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        const q = query +`${' ORDER BY '}+${sortField.name} ${sortField.sortOrder}`;
        reloadProjectTasks(q, true);
    }, [query, sortField]);

    const prepareCardLanes = (tasks) => {
        for (const key in TASK_STATUS) {
            if (TASK_STATUS.hasOwnProperty(key)) { 
                lanesData.push({
                    'id': TASK_STATUS[key],
                    'title': TASK_STATUS[key] || key,
                    'label': '0',
                    'cards': [],
                });
            }
        } 

        tasks.forEach(task => {
            lanesData.forEach(lane => {
                if (capitalizeText(task.projecttaskstatus) === capitalizeText(lane.id)) {
                    lane.label = `${Number(lane.label) + 1}`;
                    //lane.label = lane.label+1;
                    lane.cards.push(task);
                }
            });
        });

        setBoardData({ ...boardData, lanes: lanesData });
    }

    const fetchProjectTasks = async (query) => {
        const tasks = await webService.doQuery(query);
        return tasks;
    };

    const reloadProjectTasks = (q,showLoader = false) => {
        setIsLoading(showLoader);
        fetchProjectTasks(q).then((result) => {
            return result;
        })
        .then((tasks) => {
            prepareCardLanes(tasks);
        })
        .catch(function (error) {
            console.log("Error: ", error)
        })
        .finally(() => {
            setIsLoading(false);
        })
    }

    /*  const shouldReceiveNewData = nextData => {
        console.log('New card has been added');
        console.log(nextData);
    }; */

   /*  const handleDragStart = (cardId, laneId) => {
        console.log('drag started');
        console.log(`cardId: ${cardId}`);
        console.log(`laneId: ${laneId}`)
    }; */
    
    const handleDragEnd = (cardId, sourceLaneId, targetLaneId, position, cardDetails) => {
        cardDetails.projecttaskstatus = cardDetails.laneId;
        delete cardDetails['laneId'];
        webService.doUpdate(MOD_PROJECT_TASK, cardDetails)
        .then(() => {
            reloadProjectTasks(query, false);
        })
        .catch(function (taskError) {
            console.log("Error: ", taskError);
        });
    };

    const handleCardAdd = () => {
        reloadProjectTasks(query, false);
    };

    const handleOnCardClick = (taskId, metadata, laneId) => {
        setClickedProjectTaskId(taskId);
        setClickedProjectTaskLaneId(laneId);
        setClickedProjectTaskMetadata(metadata);
        setOpenCommentDialog(true);
    };

    const handleDialogOnClose = () => {
        setOpenCommentDialog(false)
    };

    const handleSortChange = (event=null) => {
        const sortObj = taskFields.filter(field => field.name === event?.target?.value)?.[0];
        let sortOrder = '';
        if(sortObj){
            sortOrder = sortField.sortOrder;
        }else{
            sortOrder = sortField.sortOrder === 'ASC' ? 'DESC' : 'ASC';
        }
        const newSort = {name: sortObj?.name??sortField.name, label: sortObj?.label??sortField.label, sortOrder: sortOrder};
        setSortField(newSort);
    }

    const doFilter = data => {
        let filterQuery = '';
        for (const key in data) {
            if (data.hasOwnProperty(key) && data[key] !=='') {
                if(filterQuery){
                    filterQuery = filterQuery +`${' AND '}+ ${key+'='}+ '${data[key]}'`;
                }else{
                    filterQuery = `${'AND '}+ ${key+'='}+ '${data[key]}'`;
                }
            }
        }
        if(filterQuery){
            const q = `SELECT * FROM ${MOD_PROJECT_TASK} WHERE projectid = ${props?.projectId} ${filterQuery}`;
            setQuery(q);
        }
    };

    const clearFilter = () => {
       reset();
       setQuery(defaultQuery);
    };

    return (
        <>
            <h3 className="text-center"> {props?.project?.projectname} </h3>
            <div className={'row'}>
                <div className={'col-md-4'}>
                    {taskFields.length > 0 && 
                        <div className={'d-flex'}>
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <InputLabel id="sortByInputLabel" className={'ml-n2'}>{'Sort by'}</InputLabel>
                                    <Select
                                        labelId="sortByInputLabel"
                                        id="sortByInput"
                                        value={sortField.name}
                                        onChange={handleSortChange}
                                        label={sortField.label}
                                        input={<BootstrapInput />}
                                        className={'ml-1'}
                                    >
                                        {React.Children.toArray(
                                            taskFields.map(field => (field.name !== 'email' && field.name !== 'description') ? <MenuItem value={field.name}>{field.label}</MenuItem> : null)
                                        )}
                                    </Select>
                                </FormControl>

                                <div className={'mt-2'}>
                                    <IconButton onClick={handleSortChange} aria-label="sort" className={classes.margin +' IconButtonStyled'} size="medium">
                                        <SortIcon fontSize="large" />
                                        {
                                        sortField.sortOrder === 'DESC' ? <ArrowDownwardIcon fontSize="large" />:<ArrowUpwardIcon fontSize="large" />
                                        }
                                    </IconButton>
                                </div>
                        </div>
                    }
                </div>
                {taskFilterFields.length > 0 && 
                    <div className={'px-2'}>
                    <Accordion>
                        <AccordionSummary
                            className={'w-25 px-4'}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            >
                            Advanced Filter
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className={'row'}>
                                <form onSubmit={handleSubmit(doFilter)} className={classes.root +' filterForm'} noValidate>
                                    <div className={'row'}>
                                        {React.Children.toArray(
                                            taskFilterFields.map((field) => {
                                                if(field.name !== 'projectid'){
                                                    field.default = '';
                                                    field.mandatory = false;
                                                    const fieldInput = input(field, Controller, control, errors);
                                                    return (
                                                        <div className={'col-md-2 mt-3'}>
                                                            {fieldInput}
                                                        </div>
                                                    )
                                                }else{
                                                    return null;
                                                }
                                            })
                                        )}
                                        <div className="col-md-4 mt-4">
                                            <Button type="submit" variant="contained" color="primary" className={'mt-4'}>Filter</Button>
                                            <Button variant="contained" onClick={handleSubmit(clearFilter)} color="secondary" className={'mt-4 mx-1'}>Clear</Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
                }
            </div>
            <div className={'kanban-container'}>

                { isLoading &&
                    <Loader />
                }
                <Board
                    draggable
                    editable
                    //canAddLanes
                    //editLaneTitle
                    onCardAdd={handleCardAdd}
                    onCardClick={(cardId, metadata, laneId) => handleOnCardClick(cardId, metadata, laneId)}
                    data={boardData}
                    //onDataChange={shouldReceiveNewData}
                    eventBusHandle={setEventBus}
                    //handleDragStart={handleDragStart}
                    handleDragEnd={handleDragEnd}
                    components={components}
                    onLaneUpdate={(laneId, data) => debug(`onLaneUpdate: ${laneId} -> ${data.title}`)}
                    onLaneAdd={t => debug('You added a lane with title ' + t.title)}
                    tagStyle={{ fontSize: '80%' }}
                />
                {openCommentDialog ? <CommentDialog projectTaskMetadata={clickedProjectTaskMetadata} projectTaskLaneId={clickedProjectTaskLaneId} projectTaskId={clickedProjectTaskId} isOpen={openCommentDialog} handleDialogOnClose={handleDialogOnClose} commentFields={commentFields} /> : null}
                {modal && <AddTaskCardForm toggle={toggle} isOpen={modal} project={props?.project} taskFields={taskFields} handleCardAdd={handleCardAdd} />}
            </div>
        </>
    )

};


export default ProjectTasks;