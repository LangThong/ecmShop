import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { Toaster } from "./components/ui/toaster.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <GoogleOAuthProvider clientId="346644264342-5cn2lsrpllr4u6kmvsi45bdd40cp39oj.apps.googleusercontent.com">
        <App />
        <Toaster />
      </GoogleOAuthProvider>
    </Provider>
  </BrowserRouter>
);
