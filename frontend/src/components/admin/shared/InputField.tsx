import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    errorMessage?: string;
    id: string;
    className?: string;
    required?: boolean;
}

const InputField = forwardRef<HTMLInputElement, IProps>(
    (
        {
            label,
            errorMessage,
            id,
            required = false,
            type = "text",
            placeholder = "",
            className = "",
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false);

        const togglePasswordVisibility = () => {
            setShowPassword((prev) => !prev);
        };

        // handle  change type input password
        const inputType = type === "password" && showPassword ? "text" : type;

        // handle change input direction
        const dir = ["email", "password", "number"].includes(type)
            ? "ltr"
            : "rtl";

        return (
            <div className="flex flex-col gap-1.5 relative">
                <label htmlFor={id} className="text-sm">
                    {label}{" "}
                    <span className="text-red-600">{required && "*"}</span>
                </label>
                <div className="relative">
                    <Input
                        ref={ref}
                        type={inputType}
                        placeholder={placeholder}
                        id={id}
                        dir={dir}
                        className={`border rounded-md focus:ring-0 focus:outline-none p-2 w-full ${
                            errorMessage && "border-red-500"
                        } ${className} ${
                            type === "password" ? "pl-8" : "pr-8"
                        }`}
                        {...props}
                    />
                    {/* آیکون نمایش رمز عبور */}
                    {type === "password" && (
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 left-2 flex items-center text-slate-600"
                        >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    )}
                </div>
                {errorMessage && (
                    <small className="text-red-500 text-xs">
                        {errorMessage}
                    </small>
                )}
            </div>
        );
    }
);

InputField.displayName = "InputField";

export default InputField;
