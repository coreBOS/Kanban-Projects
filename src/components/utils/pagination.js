import React from "react";
import Button from '@material-ui/core/Button';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

const Pagination = (props) => {
    return (
        <>
            <Button color="primary" className="mx-1" onClick={() => props.paginate(props?.page, -1)} disabled={ props?.page <= 1 || props?.isLoading }><NavigateBeforeIcon /></Button>
                <span className={'mt-2 font-weight-bold'}>{props?.page}</span>
            <Button color="primary" className="mx-1" onClick={() => props.paginate(props?.page, 1)}  disabled={ props?.isLoading }><NavigateNextIcon /></Button>
        </>
    )
}

export default Pagination;