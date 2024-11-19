import { Button } from "@/components/ui/button";
import { FC } from "react";

interface ToggleButtonProps {
    label: string;
    active: boolean;
    onToggle: (newState: boolean) => void;
}

const ToggleButton: FC<ToggleButtonProps> = ({ label, active, onToggle }) => {
    const handleActiveClick = () => {
        onToggle(true);
    };

    const handleInactiveClick = () => {
        onToggle(false);
    };

    return (
        <div>
            <label htmlFor="active" className="text-sm mb-1 inline-block">
                {label}
            </label>
            <div className="flex bg-secondary max-w-fit p-1 rounded">
                <Button
                    type="button"
                    variant={active ? "default" : "ghost"}
                    onClick={handleActiveClick}
                >
                    فعال
                </Button>
                <Button
                    type="button"
                    variant={!active ? "default" : "ghost"}
                    onClick={handleInactiveClick}
                >
                    غیرفعال
                </Button>
            </div>
        </div>
    );
};

export default ToggleButton;
