import React, { useState } from 'react';
import {AddCardLink} from 'react-trello/src/styles/Base';
import AddTaskCardForm from "../utils/AddCard";

export default (props) => {
    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    return (
        <>
            <AddCardLink onClick={toggle}>
                {'Click to add task'}
            </AddCardLink>
            {modal && <AddTaskCardForm toggle={toggle} isOpen={modal} />}
        </>
    )
}