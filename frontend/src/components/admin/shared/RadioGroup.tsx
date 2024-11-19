import { FC } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RadioGroupOption {
    value: string;
    label: string;
}

interface RadioGroupProps {
    options: RadioGroupOption[];
    defaultValue?: string;
    onChange?: (value: string) => void;
    label: string;
}

const GRadioGroup: FC<RadioGroupProps> = ({
    options,
    defaultValue,
    onChange,
    label,
}) => {
    return (
        <div className="space-y-4">
            <Label>{label}</Label>
            <RadioGroup
                defaultValue={defaultValue}
                onValueChange={onChange}
                className="space-y-4"
            >
                {options.map((option) => (
                    <div key={option.value} className="flex items-center gap-2">
                        <RadioGroupItem
                            value={option.value}
                            id={option.value}
                        />
                        <Label htmlFor={option.value}>{option.label}</Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
};

export default GRadioGroup;
