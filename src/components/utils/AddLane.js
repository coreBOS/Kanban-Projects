import React, {Component} from "react";
import {Button, Col, Form, FormGroup, Input, Row} from "reactstrap";

class AddTaskLaneForm extends Component {

    render () {
        const {onCancel} = this.props;
        const handleAdd = () => this.props.onAdd({title: this.inputRef.value});
        const setInputRef = (ref) => this.inputRef = ref;
        return (
            <Row
                className={'custom-task-lane-form'}
                xl={12} lg={12} md={12} sm={12} xs={12}>
                <Col>
                    <Form style={{padding: '0 5px'}}>
                        <FormGroup>
                            <Input type="text" ref={setInputRef} placeholder="Task Name" bsSize={'sm'}/>
                        </FormGroup>
                        <FormGroup style={{marginBottom: '2px'}}>
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
export default AddTaskLaneForm;