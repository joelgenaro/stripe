import React, { Suspense, useLayoutEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { createBrowserHistory } from "history";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";

import LoadingContainer from "./components/LoadingContainer.jsx";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import './scss/style.scss'

export const history = createBrowserHistory();
const spinner = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)
const UserLayout = React.lazy(() => import("./layouts/UserLayout"));
const AdminLayout = React.lazy(() => import("./layouts/AdminLayout"));

const Wrapper = ({ children }) => {
  const location = useLocation();

  useLayoutEffect(() => {
    setTimeout(function () {
      window.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
    }, 500);
  }, [location.pathname]);
  return children
}

function App() {
  const loading = useSelector(state => state.user.loading);
  return (
    <GoogleOAuthProvider clientId="961402803749-qkh486mh2lso54m57iss5s9gcrf8es5e.apps.googleusercontent.com">
      {/* <GoogleOAuthProvider clientId="217798610891-9n0osbb7gg0qgcu5gp4thrr29e14m7os.apps.googleusercontent.com"> */}
      <BrowserRouter history={history}>
        <Wrapper>
          <Suspense fallback={spinner}>
            <Routes>
              <Route path="/admin/*" element={<AdminLayout />} />
              <Route path="/*" element={<UserLayout />} />
            </Routes>
            <ToastContainer position="top-right" autoClose="4000" hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable theme="colored" />
            {loading && <LoadingContainer />}
          </Suspense>
        </Wrapper>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
