"use client";

import React, { forwardRef } from "react";
import { Textarea } from "@/components/ui/textarea";

interface IProps {
    id: string;
    label: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    errorMessage?: string;
}

const GTextarea = forwardRef<HTMLTextAreaElement, IProps>(
    (
        { id, label, placeholder, value, onChange, errorMessage, ...props },
        ref
    ) => {
        return (
            <div className="flex flex-col gap-1.5">
                <label htmlFor={id} className="text-sm">
                    {label}
                </label>
                <Textarea
                    placeholder={placeholder}
                    id={id}
                    ref={ref}
                    value={value}
                    onChange={onChange}
                    className={`resize-none ${
                        errorMessage && "border-red-500"
                    }`}
                    {...props}
                />
                {errorMessage && (
                    <span className="text-red-500 text-xs">{errorMessage}</span>
                )}
            </div>
        );
    }
);

GTextarea.displayName = "GTextarea";

export default GTextarea;
