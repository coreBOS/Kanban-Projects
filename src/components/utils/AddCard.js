import React, {Component} from "react";
import {Button, Col, Form, FormGroup, Input, Row} from "reactstrap";
import {webService} from "../../utils/api/webservice";

class AddTaskCardForm extends Component {

    render() {
        const {onCancel} = this.props;
        const setTaskNameRef = (ref) => this.taskNameRef = ref;
        const setAssignedToRef = (ref) => this.assignedToRef = ref;
        const setTaskPriorityRef = (ref) => this.taskPriorityRef = ref;
        const setTaskDescriptionRef = (ref) => this.taskDescriptionRef = ref;
        const setStartDateRef = (ref) => this.startDateRef = ref;
        const setEndDateRef = (ref) => this.endDateRef = ref;

        const handleAdd = async () => {
            await webService.doLogin('admin', 'cdYTBpiMR9RfGgO', false)
                .then(async function (response) {
                        // @TODO Perform New Task Insert query and return task details as JSON response
                        const query = '#';
                        await webService.doQuery(query)
                            .then(async function (tasksResponse) {
                                console.log("New task: ", tasksResponse)
                                await this.props.onAdd({
                                    taskNumber: this.taskNameRef.value,
                                    taskName: this.taskNameRef.value,
                                    taskPriority: this.taskPriorityRef.value,
                                    assignedTo: this.assignedToRef.value,
                                    taskDescription: this.taskDescriptionRef.value,
                                    startDate: this.startDateRef.value,
                                    endDate: this.endDateRef.value,
                                });
                            })
                            .catch(function (tasksError) {
                                console.log("Error: ", tasksError)
                            })
                })
                .catch(function (tasksError) {
                    console.log("Error: ", tasksError)
                })
        }

        return (
            <Row
                style={{
                    padding: 5,
                    background: '#fff',
                    borderRadius: 5
                }}
                xl={12} lg={12} md={12} sm={12} xs={12}>
                <Col>
                    <Form style={{padding: '0 5px'}}>
                        <FormGroup>
                            <Input type="text" innerRef={setTaskNameRef} placeholder="Task Name" bsSize={'sm'}/>
                        </FormGroup>
                        <FormGroup>
                            <Input type="select" innerRef={setTaskPriorityRef} placeholder="Task Priority" bsSize={'sm'}>
                                <option value={'normal'}>Normal</option>
                                <option value={'high'}>High</option>
                                <option value={'low'}>Low</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Input type="text" innerRef={setTaskDescriptionRef} placeholder="Task Description" bsSize={'sm'} />
                        </FormGroup>
                        <FormGroup>
                            <Input type="text" innerRef={setAssignedToRef} placeholder="Assign To" bsSize={'sm'}/>
                        </FormGroup>
                        <FormGroup>
                            <Input type="text" innerRef={setAssignedToRef} placeholder="Assign To" bsSize={'sm'}/>
                        </FormGroup>
                        <FormGroup>
                            <Input type="text"  innerRef={setStartDateRef} placeholder="Start Date" />
                        </FormGroup>
                        <FormGroup>
                            <Input type="text"  innerRef={setEndDateRef} placeholder="End Date" />
                        </FormGroup>
                        <FormGroup style={{marginBottom: 2}}>
                            <Button color={'success'} className={'pull-left'} size={'sm'} onClick={handleAdd}>
                                Add
                            </Button>
                            <Button color={'danger'} size={'sm'} onClick={onCancel} style={{float: 'right'}}>
                                Cancel
                            </Button>
                        </FormGroup>
                    </Form>
                </Col>
            </Row>
        )
    }
}

export default AddTaskCardForm;