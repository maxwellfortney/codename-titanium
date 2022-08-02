import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Popup, { PopupWrapper } from "./Popup";
import { HashRouter as Router } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <React.StrictMode>
        <Router>
            <div id="Titanium_Wrapper">
                <div className="css-blurry-gradient" />
                <PopupWrapper>
                    <Popup />
                </PopupWrapper>
            </div>
        </Router>
    </React.StrictMode>
);
