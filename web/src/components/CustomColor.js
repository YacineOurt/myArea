import React from "react";

export const CustomIcon = ({ name, color }) => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={color}
            xmlns="http://www.w3.org/2000/svg"
        >
            {name === 'ellipsis-vertical' && (
                <g fill={color}>
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                </g>
            )}
            {name === 'close' && (
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            )}
        </svg>
    );
};