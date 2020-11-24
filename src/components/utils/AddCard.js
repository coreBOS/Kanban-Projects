import React, {Component} from "react";
import {Button, Col, Form, FormGroup, Input, Row} from "reactstrap";

class AddTaskCardForm extends Component {

    render() {
        const {onCancel} = this.props;
        const handleAdd = () => this.props.onAdd({
            taskNumber: this.taskNameRef.value,
            taskName: this.taskNameRef.value,
            taskPriority: this.taskPriorityRef.value,
            assignedTo: this.assignedToRef.value,
            taskDescription: this.taskDescriptionRef.value
        });
        const setTitleRef = (ref) => this.taskNameRef = ref;
        //const setTaskNameRef = (ref) => this.taskNameRef = ref;
        const setAssignedToRef = (ref) => this.assignedToRef = ref;
        const setTaskPriorityRef = (ref) => this.taskPriorityRef = ref;
        const setTaskDescriptionRef = (ref) => this.taskDescriptionRef = ref;
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
                            <Input type="text" ref={setTitleRef} placeholder="Task Name" bsSize={'sm'}/>
                        </FormGroup>
                        <FormGroup>
                            <Input type="select" ref={setTaskPriorityRef} placeholder="Task Priority" bsSize={'sm'}>
                                <option value={'normal'}>Normal</option>
                                <option value={'high'}>High</option>
                                <option value={'low'}>Low</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Input type="text" ref={setTaskDescriptionRef} placeholder="Task Description" bsSize={'sm'} />
                        </FormGroup>
                        <FormGroup>
                            <Input type="text" ref={setAssignedToRef} placeholder="Assign To" bsSize={'sm'}/>
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