import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ErrorBoundary from './components/ErrorBoundary';
import "./index.css";
import "./App.css";
import "./styles/ui-overrides.css";

// suppress console output in production builds
if (process.env.NODE_ENV === 'production') {
	// keep no-ops minimal and fast
	console.log = () => {};
	console.error = () => {};
	console.warn = () => {};
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<ErrorBoundary>
		<App />
	</ErrorBoundary>
);