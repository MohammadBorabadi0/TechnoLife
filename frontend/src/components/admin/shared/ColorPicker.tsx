"use client";

import React from "react";

interface ColorPickerProps {
    color: string;
    setColor: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, setColor }) => {
    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setColor(event.target.value);
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            {/* Display color picker using input type="color" */}
            <input
                type="color"
                value={color}
                onChange={handleColorChange}
                className="size-20"
            />

            {/* Display selected color */}
            <div
                className="size-16 rounded-full shadow-md"
                style={{ backgroundColor: color }}
            />

            {/* Display hex code */}
            <p className="text-sm">
                رنگ انتخاب شده :
                <span dir="ltr" className="uppercase">
                    {color}
                </span>
            </p>
        </div>
    );
};

export default ColorPicker;
