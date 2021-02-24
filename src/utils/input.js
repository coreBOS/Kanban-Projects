import React from "react";
import TextField from '@material-ui/core/TextField';
import Select from "react-select";
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


export const input = (field, Controller, control, errors) => {
    if(field.name === 'id') return;

    switch (Number(field.uitype)) {
        case 19:
            return (
                <>
                    <Controller 
                        name={field.name} 
                        control={control} 
                        defaultValue={field.default}
                        render={({ onChange, value }) => <TextField id={field.name} label={field.label} variant="outlined" onChange={onChange} value={value} /> }
                    />
                    {errors[field.name] && <span>This field is required</span>}
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
                        defaultValue=""
                        options={
                            userlist.map(user => {
                                return { value: user.userid, label: user.username }
                            })
                        }
                        as={Select}
                    />
                    {errors[field.name] && <span>This field is required</span>}
                </>
            );
        default:
            return (
                <>
                     <Controller 
                        name={field.name} 
                        control={control} 
                        defaultValue={field.default}
                        render={({ onChange, value }) => <TextField id={field.name} label={field.label} variant="outlined" onChange={onChange} value={value} /> }
                    />
                    {errors[field.name] && <span>This field is required</span>}
                </>
            );
    }
}