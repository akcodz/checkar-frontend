import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";
import store from "./app/store";

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="bottom-right" />
        <App />
      </BrowserRouter>
    </Provider>
)
