import React from "react";


const Loader = () => {
    return (
        <div className="bg-transparent w-100 h-100" style={{position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, zIndex: '10000'}}>
            <div className="text-dark py-1 font-weight-bold w-25 mx-auto text-center position-relative" style={{top: '50%'}}>
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading Icon</span>
                </div>
                <div><span>Loading...</span></div>
            </div>
        </div>
    )
}

export default Loader;