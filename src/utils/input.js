import React from "react";
//import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
//import Select from "react-select";
import ReactQuill from "react-quill";
import { BootstrapInput } from '../components/utils/styles';



const reactQuillModules = {
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
const reactQuillFormats = [
    'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
];


export const input = (field, Controller, control, errors, autogeneratedPlaceholder='') => {
    if(field.name === 'id') return;

    if (field.editable === false && field.uitype === 4) {
        return (
            <>
            <Controller 
                name={field.name} 
                control={control} 
                defaultValue={field.default}
                rules={{ required: field.mandatory }}
                render={({ onChange, value }) => {
                    return (
                        <>
                            <InputLabel htmlFor={field.name}>{field.label}</InputLabel>
                            <BootstrapInput id={field.name} readonly variant="outlined" onChange={onChange} value={value} />
                        </>
                    )
                } }
            />
            {errors[field.name] && <span className="text-danger">This field is required</span>}
            </>
        );
    }

    if (field.editable === false) {
        return null;
    }

    switch (Number(field.uitype)) {
        case 5:
            return (
                <>
                    <Controller 
                        name={field.name} 
                        control={control} 
                        defaultValue={field.default}
                        rules={{ required: field.mandatory }}
                        render={({ onChange, value }) => {
                            return (
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <InputLabel htmlFor={field.name}>{field.label}</InputLabel>
                                    <KeyboardDatePicker disableToolbar format="yyyy-MM-dd" margin="normal" id={field.name} onChange={onChange} value={value} input={<BootstrapInput />} KeyboardButtonProps={{'aria-label': 'change date'}} /> 
                                </MuiPickersUtilsProvider>
                            )}
                        }                      
                    />
                    {errors[field.name] && <span className="text-danger">This field is required</span>}
                </>
            );
        case 13: //email
            return (
                <>
                    <Controller 
                        name={field.name} 
                        control={control} 
                        defaultValue={field.default}
                        rules={{ required: field.mandatory }}
                        render={({ onChange, value }) => {
                            return (
                                <>
                                    <InputLabel htmlFor={field.name}>{field.label}</InputLabel>
                                    <BootstrapInput id={field.name} type={'email'} onChange={onChange} value={value} />
                                </>
                            )
                        } }
                    />
                    {errors[field.name] && <span className="text-danger">This field is required</span>}
                </>
            );
        case 15:
            const picklistValues = field.type?.picklistValues?? [];
            return (
                <>
                    <Controller
                        name={field.name}
                        control={control}
                        defaultValue={field.default}
                        rules={{ required: field.mandatory }}
                        render={({ onChange, value }) => {
                            return (
                                <>  
                                    <InputLabel id={field.name}>{field.label}</InputLabel>
                                    <Select labelId={field.name} id={field.name+'ID'} onChange={onChange} value={value} input={<BootstrapInput />} >
                                        {React.Children.toArray(
                                            picklistValues.map(option => <MenuItem value={option.value}>{option.label}</MenuItem>)
                                        )}
                                    </Select>
                                </>
                            )
                        } }
                    />
                    {errors[field.name] && <span className="text-danger">This field is required</span>}
                </>
            );
        case 19: //Textarea
            return (
                <>
                    <Controller 
                        name={field.name} 
                        control={control} 
                        defaultValue={field.default}
                        rules={{ required: field.mandatory }}
                        render={({ onChange, value }) => <TextareaAutosize id={field.name} label={field.label} rowsMin={2} onChange={onChange} value={value} input={<BootstrapInput />} /> }
                    />
                    {errors[field.name] && <span className="text-danger">This field is required</span>}
                </>
            );
        case 21: //RichTextEditor
            return (
                <>
                    <ReactQuill
                        theme="snow"
                        modules={reactQuillModules}
                        formats={reactQuillFormats}
                    />
                </>
            );
        case 53:
            const userlist = field.type?.assignto?.users?.options?? [];
            return (
                <>
                    <Controller
                        name={field.name}
                        control={control}
                        defaultValue={field.default}
                        rules={{ required: field.mandatory }}
                        render={({ onChange, value }) => {
                            return (
                                <>  
                                    <InputLabel id={field.name}>{field.label}</InputLabel>
                                    <Select labelId={field.name} id={field.name+'ID'} onChange={onChange} value={value} input={<BootstrapInput />}>
                                        {React.Children.toArray(
                                            userlist.map(option => <MenuItem value={option.userid}>{option.username}</MenuItem>)
                                        )}
                                    </Select>
                                </>
                            )
                        } }
                    />
                    {errors[field.name] && <span className="text-danger">This field is required</span>}
                </>
            );
        case 70: // Created and Modified Time
            return null;
        default:
            return (
                <>
                     <Controller 
                        name={field.name} 
                        control={control} 
                        defaultValue={field.default}
                        rules={{ required: field.mandatory }}
                        render={({ onChange, value }) => {
                            return (
                                <>
                                    <InputLabel htmlFor={field.name}>{field.label}</InputLabel>
                                    <BootstrapInput id={field.name} onChange={onChange} value={value} />
                                </>
                            )
                        } }
                    />
                    {errors[field.name] && <span className="text-danger">This field is required</span>}
                </>
            );
    }
}