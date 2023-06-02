import React from 'react'

const USRSeperatorMerger = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const visibility_mode = searchParams.get('visibility_mode')

    function usrSeperator() {
        return (
            <div>This is USR Seperator</div>
        );
    }
    function usrMerger() {
        return (
            <div>This is USR Merger</div>
        );
    }

    return (
        <>
            {visibility_mode ? usrSeperator() : usrMerger()}
        </>
    );
}

export default USRSeperatorMerger