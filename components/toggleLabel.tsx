import React from "react";

type ToggleLabelProps = {
    tag: string;
    isSelected: boolean;
    onClick: () => void;
};

function ToggleLabel({ tag, isSelected, onClick }: ToggleLabelProps) {
    return (
        <button
            onClick={onClick}
            className="px-3 py-1 text-sm rounded-full shadow-sm border border-gray-300 hover:bg-gray-100"
            style={{
                backgroundColor: isSelected ? "#771D1D" : "white",
                color: isSelected ? "white" : "#771D1D",
            }}
        >
            {tag}
        </button>
    );
}

export default ToggleLabel;
