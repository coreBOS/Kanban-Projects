import React from "react";
import Button from '@material-ui/core/Button';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

const Pagination = (props) => {

    const paginate = (pageNumber, direction) => {
        let newOffset = direction >= 0 ? (pageNumber * props.perPage) : props.offset - props.perPage;
        newOffset = newOffset >= 0 ? newOffset : 0;
        props.setOffset(newOffset);
        props.setPage(pageNumber + direction);
    };

    return (
        <div className={'py-1'}>
            <Button color="primary" className="mx-1" onClick={() => paginate(props?.page, -1)} disabled={ props?.page <= 1 || props?.isLoading }><NavigateBeforeIcon /></Button>
                <span className={'mt-2 font-weight-bold'}>{props?.page}</span>
            <Button color="primary" className="mx-1" onClick={() => paginate(props?.page, 1)}  disabled={ props?.isLoading }><NavigateNextIcon /></Button>
        </div>
    )
}

export default Pagination;