import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

//  Toastify import
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    {/*  ToastContainer globally mount */}
    <ToastContainer position="top-right" autoClose={3000} />
  </>
);
