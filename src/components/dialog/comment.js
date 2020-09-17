import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { webService } from "../../utils/api/webservice";
//import { sampleComments } from "./data";
import ReactQuill from "react-quill";
import { Button, CustomInput, FormGroup, Input, Label } from "reactstrap";
import { TASK_STATUS } from '../../settings/constants';

const CommentDialog = (props) => {
    console.log("Opening Dialog:", props);
    const [projectTask, setProjectTask] = useState({});
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const taskStatusList = Object.values(TASK_STATUS);
    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' },
            { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ],
        clipboard: {
            matchVisual: false,
        }
    };
    const formats = [
        'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        setIsLoading(true);
        webService.doQuery(`SELECT * FROM ProjectTask WHERE id=${props.projectTaskId} LIMIT 1`)
        .then((task) => {
            setProjectTask(task[0]);
            webService.doQuery(`SELECT * FROM ModComments WHERE related.projecttask=${props.projectTaskId} ORDER BY createdtime DESC`)
            .then((comments) => {
                console.log(comments    );
                setComments(comments);
            })
            .catch(function (taskError) {
                console.log("Error: ", taskError)
            })
        })
        .catch(function (taskError) {
            console.log("Error: ", taskError);
        })
        .finally(() => {
            setIsLoading(false);
        })
    };

    const taskPriorityLabel = (priority) => {
        switch (priority) {
            case 'normal':
                return "badge badge-info";
            case 'high':
                return "badge badge-danger";
            case 'low':
                return "badge badge-primary";
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

    const loadMoreComments = () => {
        //alert("Loading More Comments....")
    };

    return (
        <React.Fragment>
            <div className="modal right fade" tabIndex="-1" role="dialog" aria-labelledby={props.projectTaskId}>
            { isLoading &&
                <Loader />
            }
                <div className="modal-dialog" role="document">
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
                                        <div className={'form-group'}>
                                            <label htmlFor={'status'}>Status</label>
                                            <Input type="select" name="status" value={projectTask.projecttaskstatus} id="status" bsSize="sm">
                                                {taskStatusList.map((status, statusIndex) => {
                                                    return <option value={status} key={statusIndex}>{status}</option>
                                                })}
                                            </Input>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <FormGroup>
                                            <Label for="attachment">Attachment</Label>
                                            <CustomInput type="file" id="attachment" name="customFile" label="Add an attachment" />
                                        </FormGroup>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className={'form-group'}>
                                            <ReactQuill
                                                theme="snow"
                                                modules={modules}
                                                formats={formats}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <Button color="primary" size="sm">
                                                Comment
                                            </Button>
                                        </div>
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

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
    null,
    null
)(CommentDialog)