"use client";

import { Minus, Plus } from "lucide-react";
import { useState, FC, ReactNode } from "react";

interface IProps {
    legend: string;
    children: ReactNode;
}

const GFieldset: FC<IProps> = ({ legend, children }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <fieldset className="border rounded-lg">
            <legend
                className="flex justify-between items-center gap-1 p-2 cursor-pointer select-none"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <span className="text-lg font-semibold">{legend}</span>
                <button type="button" className="focus:outline-none">
                    {isOpen ? <Minus size="20" /> : <Plus size="20" />}
                </button>
            </legend>
            <div
                className={`overflow-hidden transition-all duration-100 ${
                    isOpen ? "max-h-screen p-4" : "max-h-0 p-0"
                }`}
            >
                {isOpen && <div className="space-y-4">{children}</div>}
            </div>
        </fieldset>
    );
};

export default GFieldset;
