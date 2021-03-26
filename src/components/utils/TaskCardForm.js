import React, {useState, useEffect} from "react";
import { webService } from "../../utils/api/webservice";
import {Button, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { dateParser } from "../../utils/lib/WSClientHelper";
import { input } from "../../utils/input";
import { useForm, Controller } from "react-hook-form";
import { makeStyles } from '@material-ui/core/styles';
import Loader from "./Loader";
import { MOD_PROJECT_TASK }  from '../../settings/constants';

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '100%'
      },
    },
}));

const TaskCardForm = (props) => {
    //console.log(props);
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

    useEffect(() => {
        reset(props?.projectTask??{});
    }, [reset])


    const handleCard = async (data) => {
        data.projectid = props?.project?.id??'';
        if(props.projectTask){
            data.id = props.projectTask.id;
        }
        if(data.startdate){
            data.startdate = dateParser(data.startdate); 
        }
        if(data.enddate){
            data.enddate = dateParser(data.enddate); 
        }
        setIsLoading(true);
        if(props.projectTask){ //Edit
            const result = await webService.doUpdate(MOD_PROJECT_TASK, data);
            reset(result);
            props.handleCardUpdate();
        }else{
            await webService.doCreate(MOD_PROJECT_TASK, data);
            props.handleCardUpdate();
            reset();
        }
        setIsLoading(false);
    };


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
                        <form onSubmit={handleSubmit(handleCard)} className={classes.root} noValidate autoComplete="off" style={{padding: '0 5px'}}>
        
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
                                <Button disabled={isLoading} type="submit" variant="contained" color="primary" className={'w-100'}>Save</Button>
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

export default TaskCardForm;