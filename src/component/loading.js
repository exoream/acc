import React from 'react';
import DM1 from './image/dm1.png';
import '../App.css';

const Loading = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin-3d h-24 w-24">
                <img src={DM1} alt="Loading" />
            </div>
        </div>
    );
};

export default Loading;