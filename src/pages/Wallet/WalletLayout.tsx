import { Outlet } from "react-router";
import Navbar from "../../components/Common/Navbar";
import FooterSelector from "../../components/Common/FooterSelector";

export default function WalletLayout() {
    return (
        <div className="flex flex-col items-center justify-between w-full h-full max-h-screen">
            <Navbar />
            <div className="relative flex flex-col items-center justify-start flex-1 w-full h-full overflow-y-auto scrollbar-hide">
                <Outlet />

                {/* <div className="absolute w-full h-[150px] bg-gradient-to-t bottom-0 left-0 from-primary to-transparent select-none" /> */}
            </div>
            <FooterSelector />
        </div>
    );
}
