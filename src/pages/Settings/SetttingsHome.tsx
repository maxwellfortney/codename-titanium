import { Outlet } from "react-router-dom";

export default function SettingsHomePage() {
    return (
        <div className="flex flex-col items-center justify-start w-full h-full">
            <Outlet />
        </div>
    );
}
