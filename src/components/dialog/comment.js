import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { webService } from "../../utils/api/webservice";
import { loadModuleFields } from "../../utils/lib/WSClientHelper";
//import { sampleComments } from "./data";
//import ReactQuill from "react-quill";
//import { Button, CustomInput, FormGroup, Input, Label } from "reactstrap";
//import { TASK_STATUS } from '../../settings/constants';
import { input } from "../../utils/input";
import { useForm, Controller } from "react-hook-form";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { MOD_COMMENT }  from '../../settings/constants';

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '100%'
      },
    },
}));

const CommentDialog = (props) => {
    const [projectTask, setProjectTask] = useState({});
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    //const taskStatusList = Object.values(TASK_STATUS);

    const [fields, setFields] = useState([]);
    const classes = useStyles();
    const formMethods = useForm();
    const { handleSubmit, control, errors } = formMethods;

    useEffect(() => {
        /* eslint-disable react-hooks/exhaustive-deps */
        loadProjectTask(props.projectTaskId);
        loadComments(props.projectTaskId);
        loadModuleFields(MOD_COMMENT).then((modFields) => {
            setFields(modFields?.fields??[]);
        });
    }, []);

    const loadProjectTask = async (projectTaskId) => {
        setIsLoading(true);
        const projTask = await webService.doQuery(`SELECT * FROM ProjectTask WHERE id=${projectTaskId} LIMIT 1`);
        setProjectTask(projTask[0]??{});
        setIsLoading(false);
    };

    const loadComments = async (projectTaskId) => {
        setIsLoading(true);
        const comments = await webService.doQuery(`SELECT * FROM ModComments WHERE related.projecttask=${projectTaskId} ORDER BY createdtime DESC`);
        setComments(comments);
        setIsLoading(false);
    };

    const taskPriorityLabel = (priority) => {
        switch (priority) {
            case 'normal':
                return "badge badge-info";
            case 'high':
                return "badge badge-danger";
            case 'low':
                return "badge badge-primary";
            default:
                return "badge badge-dark";
        }
    };

    const Loader = () => {
        return (
            <div className="bg-transparent" style={{ position: 'fixed', top: '50%', left: '50%', zIndex: '1000' }}>
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        )
    }

    const onSubmit = data => {
        data.assigned_user_id = projectTask?.assigned_user_id;
        data.related_to = projectTask?.id;
        setIsLoading(true);
        webService.doCreate('ModComments', data)
        .then((result) => {
            console.log(result);
            loadComments(props.projectTaskId);
        })
        .catch(function (taskError) {
            console.log("Error: ", taskError);
        })
        .finally(() => {
            setIsLoading(false);
        })
    };

   /*  const loadMoreComments = () => {
        //alert("Loading More Comments....")
    }; */

    return (
        <React.Fragment>
            <div className="commentModal modal right fade" tabIndex="-1" role="dialog" aria-labelledby={props.projectTaskId}>
            { isLoading &&
                <Loader />
            }
                <div className="modal-dialog" role="document">
                    { isLoading &&
                        <Loader />
                    }
                    <div className="modal-content">
                        <div className="modal-header d-flex">
                            <h5 className="modal-title" id={props.projectTaskId}>{projectTask.projecttaskname}</h5>
                            <span className="fillRemainingSpace"></span>
                            <div className="d-flex">
                                <span className={`${taskPriorityLabel(projectTask.projecttaskpriority)} 'mx-1'`}>{projectTask.projecttaskpriority}</span>
                                <span className="badge badge-success mx-1">{projectTask.projecttaskprogress}</span>
                            </div>
                            <button 
                                onClick={props.handleDialogOnClose}
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div style={{ fontSize: '13px' }}>
                                <p>{projectTask.description}</p>
                            </div>
                            <div className="my-1">
                                <h6>Comments</h6>
                                <div style={{ maxHeight: '20rem', overflow: 'auto' }}>
                                    {comments.map((comment, commentIndex) => {
                                        return (
                                            <div className="card mb-2" key={commentIndex}>
                                                <div className="card-body">
                                                    <h5 className="card-title">{comment.creator_firstname}</h5>
                                                    <p style={{ fontSize: '12px' }} className="card-text">{comment.commentcontent}</p>
                                                </div>
                                                <div className="card-footer bg-transparent border">
                                                    <p className="card-text"><small className="text-muted">{comment.createdtime}</small></p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                 </div>
                                {/* <div style={{ textAlign: 'center' }}>
                                    <a className={'link'} href={'#'} onClick={loadMoreComments}>
                                        More Comments
                                        </a>
                                </div> */}
                                <div className="row mt-3">
                                    <div className="col-lg-12">
                                        {fields.length > 0 &&
                                            <form onSubmit={handleSubmit(onSubmit)} className={classes.root} noValidate autoComplete="off">
                        
                                                {React.Children.toArray(
                                                    fields.map((field) => {
                                                        if(field.name === 'commentcontent'){
                                                            return (
                                                                input(field, Controller, control, errors)
                                                            );
                                                        }else {
                                                            return null;
                                                        }
                                                    })
                                                )}

                                                <Button type="submit" variant="contained" color="primary">Comment</Button>
                                            </form>
                                        }
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </React.Fragment>
    )
};

//const mapStateToProps = (state) => ({});

//const mapDispatchToProps = (dispatch) => ({});

export default connect(
    null,
    null
)(CommentDialog)