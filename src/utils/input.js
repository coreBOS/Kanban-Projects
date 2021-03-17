import React from "react";
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
//import Select from "react-select";
import ReactQuill from "react-quill";

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
                render={({ onChange, value }) => <TextField id={field.name} readonly label={field.label} variant="outlined" onChange={onChange} value={value} /> }
            />
            {errors[field.name] && <span className="text-danger">This field is required</span>}
            </>
        );
    }

    if (field.editable === false) {
        return null;
    }

    switch (Number(field.uitype)) {
        case 13:
            return (
                <>
                    <Controller 
                        name={field.name} 
                        control={control} 
                        defaultValue={field.default}
                        rules={{ required: field.mandatory }}
                        render={({ onChange, value }) => <TextField id={field.name} type={'email'} label={field.label} variant="outlined" onChange={onChange} value={value} /> }
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
                                    <Select labelId={field.name} id={field.name} variant="outlined" onChange={onChange} value={value} >
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
        case 19:
            return (
                <>
                    <Controller 
                        name={field.name} 
                        control={control} 
                        defaultValue={field.default}
                        rules={{ required: field.mandatory }}
                        render={({ onChange, value }) => <TextField id={field.name} label={field.label} variant="outlined" multiline rows={2} onChange={onChange} value={value} /> }
                    />
                    {errors[field.name] && <span className="text-danger">This field is required</span>}
                </>
            );
        case 21:
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
                                    <Select labelId={field.name} id={field.name} variant="outlined" onChange={onChange} value={value} >
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
                        render={({ onChange, value }) => <TextField id={field.name} label={field.label} variant="outlined" onChange={onChange} value={value} /> }
                    />
                    {errors[field.name] && <span className="text-danger">This field is required</span>}
                </>
            );
    }
}