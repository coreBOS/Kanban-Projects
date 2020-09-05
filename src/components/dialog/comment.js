import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {webService} from "../../utils/api/webservice";
import {sampleComments} from "./data";
import ReactQuill from "react-quill";
import {Button, CustomInput, FormGroup, Input, Label} from "reactstrap";

const CommentDialog = (props) => {
    console.log("Opening Dialog:", props);
    const[projectTask, setProjectTask] = useState({});
    const[loading, setLoading] = useState(true);
    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'},
                {'indent': '-1'}, {'indent': '+1'}],
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
        const fetchData = async () => {
            const query = `SELECT * FROM ProjectTask WHERE id=${props.projectTaskId}`;
            await webService.doQuery(query)
                .then(async function (taskResponse) {
                    console.log("Task Response: ", taskResponse);
                    setProjectTask(taskResponse[0]);
                    setLoading(false)
                })
                .catch(function (taskError) {
                    console.log("Error: ", taskError)
                })
        };
        fetchData();
    }, []);

    const taskPriorityLabel = (priority) => {
        switch (priority) {
            case 'normal':
                return(
                    <span className={'badge badge-info'} style={{marginRight: 10}}>{priority}</span>
                );
            case 'high':
                return (
                    <span className={'badge badge-danger'} style={{marginRight: 10}}>{priority}</span>
                );
            case 'low':
                return (
                    <span className={'badge badge-primary'} style={{marginRight: 10}}>{priority}</span>
                )
        }
    };

    const loadMoreComments = () => {
        alert("Loading More Comments....")
    };

    return (
        <React.Fragment>
            {!loading && (
                <div className="modal right fade" tabIndex="-1" role="dialog" aria-labelledby={props.projectTaskId}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button
                                    onClick={props.handleDialogOnClose}
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                {taskPriorityLabel(projectTask.projecttaskpriority)}
                                <span className={'badge badge-success'}>{projectTask.projecttaskprogress}</span>
                                <h4 className="modal-title" id={props.projectTaskId}>{projectTask.projecttaskname}</h4>
                            </div>
                            <div className="modal-body">
                                <div className={'project-details'} style={{fontSize: '13px'}}>
                                    <p>{projectTask.description}</p>
                                </div>
                                <div className={'project-comments'} style={{fontSize: 12}}>
                                    <h6>Comments</h6>
                                    {sampleComments.results.map((comment, commentIndex) => {

                                        return(
                                            <React.Fragment>
                                                <div className={'card'} key={commentIndex}>
                                                    <div className={'card-body'}>
                                                        <b>{comment.user}</b>
                                                        <p>{comment.comment}</p>
                                                    </div>
                                                </div>
                                                <hr/>
                                            </React.Fragment>
                                        )
                                    })}
                                    <div style={{textAlign: 'center'}}>
                                        <a className={'link'} href={'#'} onClick={loadMoreComments}>
                                            More Comments
                                        </a>
                                    </div>
                                    <br/>
                                    <br/>
                                    <div className={'row'}>
                                        <div className={'col-lg-12'}>
                                            <div className={'form-group'}>
                                                <label htmlFor={'status'}>Status</label>
                                                <Input type="select" name="status" id="status" bsSize="sm">
                                                    <option>Closed</option>
                                                    <option>Pending</option>
                                                </Input>
                                            </div>
                                        </div>
                                        <div className={'col-lg-12'}>
                                            <FormGroup>
                                                <Label for="attachment">Attachment</Label>
                                                <CustomInput type="file" id="attachment" name="customFile" label="Add an attachment" />
                                            </FormGroup>
                                        </div>
                                        <div className={'col-lg-12'}>
                                            <div className={'form-group'}>
                                                <ReactQuill
                                                    theme={'snow'}
                                                    modules={modules}
                                                    formats={formats}
                                                />
                                            </div>
                                        </div>
                                        <div className={'col-lg-12'}>
                                            <div className={'form-group'}>
                                                <Button color={'primary'} size={'sm'}>
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
            )}
        </React.Fragment>
    )
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
    null,
    null
)(CommentDialog)