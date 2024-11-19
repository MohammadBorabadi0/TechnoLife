// Stepper.tsx
import React from "react";
import { Check } from "lucide-react";
import { En_To_Fa } from "@/utils/functions";

interface StepperProps {
    steps: string[];
    currentStep: number;
    onStepClick: (step: number) => void;
}

const Stepper: React.FC<StepperProps> = ({
    steps,
    currentStep,
    onStepClick,
}) => {
    return (
        <div className="flex items-center mb-8">
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    <div
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => onStepClick(index)}
                    >
                        <div
                            className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold transition-colors duration-300 
                ${
                    index < currentStep
                        ? "bg-green-500 text-white"
                        : index === currentStep
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-gray-600"
                }`}
                        >
                            {index < currentStep ? (
                                <Check size={20} className="text-white" />
                            ) : (
                                <>{En_To_Fa(index + 1)}</>
                            )}
                        </div>
                        <span
                            className={`mt-2 text-sm font-medium ${
                                index === currentStep
                                    ? "text-blue-600"
                                    : "text-primary"
                            }`}
                        >
                            {step}
                        </span>
                    </div>

                    {index < steps.length - 1 && (
                        <div className="flex-1 h-1 bg-gray-300 mx-2 relative -top-3">
                            <div
                                className={`h-full ${
                                    index < currentStep ? "bg-green-500" : ""
                                }`}
                            />
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default Stepper;
