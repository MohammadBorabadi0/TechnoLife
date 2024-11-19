import { LoaderCircle } from "lucide-react";

const Loading = ({ size = 24, color = "" }) => {
    return (
        <div className="flex justify-center items-center">
            <LoaderCircle
                className={`animate-spin ${color}`}
                width={size}
                height={size}
            />
        </div>
    );
};

export default Loading;
