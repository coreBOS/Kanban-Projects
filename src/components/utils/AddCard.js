import React, {useState} from "react";
import { webService } from "../../utils/api/webservice";
import {Button, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { input } from "../../utils/input";
import { useForm, Controller } from "react-hook-form";
import { makeStyles } from '@material-ui/core/styles';
import { MOD_PROJECT_TASK }  from '../../settings/constants';

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '100%'
      },
    },
}));

const AddTaskCardForm = (props) => {
    console.log(props);
    //const {onCancel} = props;
    const classes = useStyles();
    const formMethods = useForm();
    const { handleSubmit, control, errors, reset } = formMethods;
    const [isLoading, setIsLoading] = useState(false);


    const {
        //buttonLabel,
        className,
        toggle,
        isOpen
      } = props;

    const handleAdd = (data) => {
        data.projectid = props?.project?.id??'';
        setIsLoading(true);
        webService.doCreate(MOD_PROJECT_TASK, data)
        .then(() => {
            reset();
        })
        .catch(function (taskError) {
            console.log("Error: ", taskError);
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    const Loader = () => {
        return (
            <div className="bg-transparent text-primary w-100 h-100" style={{position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, zIndex: '10000'}}>
                <div className="text-center" style={{position: 'absolute', top: '50%', left: '50%'}}>
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        )
    }


        return (
            <div>
                <Modal isOpen={isOpen} toggle={toggle} className={className}>
                    <ModalHeader toggle={toggle}>
                        New Task
                    </ModalHeader>
                    <ModalBody className={'pl-2 pr-4'}>
                        { isLoading &&
                            <Loader />
                        }
                        <h5 className={'text-center'}>{props?.project?.projectname}</h5>
                        <form onSubmit={handleSubmit(handleAdd)} className={classes.root} noValidate autoComplete="off" style={{padding: '0 5px'}}>
        
                            {React.Children.toArray(
                                props?.taskFields?.map((field) => {
                                    if(field.name !== 'projectid'){
                                        return (
                                            input(field, Controller, control, errors)
                                        );
                                    }
                                    return null;
                                })
                            )}
                            <FormGroup className="w-50 mx-auto">
                                <Button type="submit" variant="contained" color="primary" className={'w-100'}>Add</Button>
                            </FormGroup>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    
}

export default AddTaskCardForm;