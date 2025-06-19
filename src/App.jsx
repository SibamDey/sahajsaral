import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Karmashree_logo } from "./components/Logo";
import "./App.css";
import React, { useState, useEffect, Suspense, lazy } from "react";
import { sideBarList } from "./components/Sidebar";
import { ConfirmUser, ResetPassword } from "./views/ResetPassword";
import { ToastContainer, toast } from "react-toastify";
import { useNetworkState } from "@uidotdev/usehooks";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./views/forms/LandingPage/LandingPage";
import Idle from "./views/forms/Idle/Idle";
import SessionTimeoutPage from "./views/forms/Idle/SessionTimeoutPage";
// import Home from "./views/Home";
// import Auth from "./auth/Auth";
// import Login from "./views/Login";
// import Contact from "./views/Contact";
// import Dashboard from "./views/Dashboard";
// import Profile from "./views/forms/Profile";
// import OTPConfirm from "./views/OtpConfirm";
// import ViewProfile from "./views/forms/ViewProfile";
// import Edit from "./components/Edit";
// import Dno from "./views/forms/Dno";
// import Error404 from "./views/Error404";
// import ActionPlanReport1 from "./views/reports/ActionPlanReport1";
// import ActionPlanReport3 from "./views/reports/ActionPlanReport3";
// import ActionPlanReport2 from "./views/reports/ActionPlanReport2";
// import WorkAllocationView from "./views/forms/WorkAllocationView";
// import SchemeEdit from "./views/forms/SchemeEdit";
// import SchemeView from "./views/forms/SchemeView";
// const Home = lazy(() => import("./views/Home"));
// const Auth = lazy(() => import("./auth/Auth"));
// const Login = lazy(() => import("./views/Login"));
// const Contact = lazy(() => import("./views/Contact"));
const Dashboard = lazy(() => import("./views/Dashboard"));
// const Profile = lazy(() => import("./views/forms/Profile"));
// const OTPConfirm = lazy(() => import("./views/OtpConfirm"));
// const ViewProfile = lazy(() => import("./views/forms/ViewProfile"));
const Edit = lazy(() => import("./components/Edit"));
// const Dno = lazy(() => import("./views/forms/Dno"));
const Error404 = lazy(() => import("./views/Error404"));
// const ActionPlanReport1 = lazy(() =>
//   import("./views/reports/ActionPlanReport1")
// );
// const ActionPlanReport3 = lazy(() =>
//   import("./views/reports/ActionPlanReport3")
// );
// const ActionPlanReport2 = lazy(() =>
//   import("./views/reports/ActionPlanReport2")
// );
// const WorkAllocationView = lazy(() =>
//   import("./views/forms/WorkAllocationView")
// );
// const UserManual = lazy(() => import("./views/UserManual"))
// const ManualEdit = lazy(() => import("./views/UsermanualEdit"));
// const SchemeEdit = lazy(() => import("./views/forms/SchemeEdit"));
// const SchemeView = lazy(() => import("./views/forms/SchemeView"));

function App() {
  const [currentVersion, setCurrentVersion] = useState(null);
  const [latestVersion, setLatestVersion] = useState(null);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);

  // Initial fetch when app loads
  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await fetch(`${window.location.origin}/SahajSaral/version.txt?_=${new Date().getTime()}`);
        const version = (await response.text()).trim();
        setCurrentVersion(version);
        setLatestVersion(version);
        // Save to localStorage
        localStorage.setItem('appVersion', version);
      } catch (err) {
        console.error('Error fetching version:', err);
      }
    };

    fetchVersion();
  }, []);

  // Periodically check for version changes
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/SahajSaral/version.txt?_=${new Date().getTime()}`);
        const newVersion = (await response.text()).trim();

        const savedVersion = localStorage.getItem('appVersion');

        // If version changed and not already applied
        if (savedVersion && newVersion !== savedVersion) {
          setShowUpdatePopup(true);
        }
      } catch (error) {
        console.error("Error checking version:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    // On refresh, store new version to prevent popup from showing again
    localStorage.setItem('appVersion', latestVersion);
    window.location.href = `${window.location.origin}/SahajSaral/?_=${new Date().getTime()}`;
  };


  return (
    <>
      {/* Modal: Only "Click to Refresh" is allowed */}
      {showUpdatePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
            <h2 className="text-lg font-semibold text-cyan-700 mb-2">🔁 New Update Available</h2>
            <p className="text-gray-700 text-sm mb-4">Please refresh to get the latest version.</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-800 transition"
            >
              Click to Refresh
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
      <Idle />
      <Routes>


        {sideBarList.map(({ route, Component, text }) => {
          return (
            <Route
              key={text}
              path={route}
              element={

                <Dashboard>
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center flex-grow p-8 px-12">
                        <Karmashree_logo className="fill-blue-400 h-[10rem] animate-pulse w-fit" />
                      </div>
                    }
                  >
                    <Component />
                  </Suspense>
                </Dashboard>

              }
            />
          );
        })}
        <Route
          path={"/profile"}
          element={

            <Dashboard>
              <Suspense>
                {/* <ViewProfile /> */}
              </Suspense>
            </Dashboard>

          }
        />
        <Route
          path={"/profile-edit"}
          element={

            <Dashboard>
              <Suspense>
                {/* <Profile /> */}
              </Suspense>
            </Dashboard>

          }
        />
        <Route
          path={"/edit/:userId"}
          element={

            <Dashboard>
              <Suspense>
                <Edit />
              </Suspense>
            </Dashboard>

          }
        />
        <Route
          path="/"
          element={
            <Suspense>
              <LandingPage />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense>
              <Error404 />
            </Suspense>
          }
        />

        <Route
          path="/session-timeout"
          element={
            <Suspense>
              <SessionTimeoutPage />
            </Suspense>
          }
        />



      </Routes>


    </>
  );
}

export default App;
