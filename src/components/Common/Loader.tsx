import React from "react";

interface ILoader {
    color?: string;
    size?: number;
    className?: string;
}

export default function Loader({ color, size, className }: ILoader) {
    return (
        <span className="animate-fadeIn">
            <div
                style={{ borderTopColor: "transparent" }}
                className={`${
                    size ? `w-${size} h-${size}` : "w-4 h-4"
                } border-[2px] border-solid rounded-full animate-spin ${color ? color : "border-black"} ${
                    className ? className : ""
                }`}
            ></div>
        </span>
    );
}
