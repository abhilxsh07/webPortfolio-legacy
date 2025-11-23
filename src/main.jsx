import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import ClickSpark from "./ClickSpark.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ClickSpark sparkColor="#ffffff" sparkCount={14}>
            <App />
        </ClickSpark>
    </React.StrictMode>
);
