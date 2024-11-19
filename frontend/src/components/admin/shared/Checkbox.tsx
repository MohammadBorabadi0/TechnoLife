import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface IProps {
    id: string;
    label: string;
    checked?: boolean; // Optional prop to control checked state
    onChange?: (checked: boolean) => void; // Function that receives a boolean
}

const GCheckbox: React.FC<IProps> = ({
    id,
    label,
    checked = false,
    onChange,
}) => {
    const handleChange = (checked: boolean) => {
        if (onChange) {
            onChange(checked);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Checkbox
                id={id}
                checked={checked}
                onCheckedChange={handleChange}
            />
            <Label htmlFor={id}>{label}</Label>
        </div>
    );
};

export default GCheckbox;
