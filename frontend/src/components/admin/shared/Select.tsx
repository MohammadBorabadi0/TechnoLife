"use client";

import * as React from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ReusableSelectProps {
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    errorMessage?: string;
}

const GSelect: React.FC<ReusableSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = "انتخاب کنید",
    label,
    errorMessage,
}) => {
    return (
        <div className="flex flex-col gap-1.5">
            {label && <label className="text-sm">{label}</label>}
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger
                    className={`${errorMessage && "border-red-600"}`}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>انتخاب کنید</SelectLabel>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            {errorMessage && (
                <small className="text-red-500 text-xs">{errorMessage}</small>
            )}
        </div>
    );
};

export default GSelect;
