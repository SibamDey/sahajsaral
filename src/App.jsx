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

const Dashboard = lazy(() => import("./views/Dashboard"));
const Edit = lazy(() => import("./components/Edit"));
const Error404 = lazy(() => import("./views/Error404"));

// 👇 NEW: Public QR view page (adjust path if needed)
const PublicPaymentCertificate = lazy(
  () =>
    import(
      "./views/forms/Document/PublicPaymentCertificate"
    )
);

function App() {
  const [currentVersion, setCurrentVersion] = useState(null);
  const [latestVersion, setLatestVersion] = useState(null);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);

  // Initial fetch when app loads
  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await fetch(
          `${window.location.origin}/SahajSaral/version.txt?_=${new Date().getTime()}`
        );
        const version = (await response.text()).trim();
        setCurrentVersion(version);
        setLatestVersion(version);
        localStorage.setItem("appVersion", version);
      } catch (err) {
        console.error("Error fetching version:", err);
      }
    };

    fetchVersion();
  }, []);

  // Periodically check for version changes
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `/SahajSaral/version.txt?_=${new Date().getTime()}`
        );
        const newVersion = (await response.text()).trim();
        const savedVersion = localStorage.getItem("appVersion");

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
    localStorage.setItem("appVersion", latestVersion);
    window.location.href = `${window.location.origin}/SahajSaral/?_=${new Date().getTime()}`;
  };

  return (
    <>
      {/* Modal: Only "Click to Refresh" is allowed */}
      {showUpdatePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
            <h2 className="text-lg font-semibold text-cyan-700 mb-2">
              🔁 New Update Available
            </h2>
            <p className="text-gray-700 text-sm mb-4">
              Please refresh to get the latest version.
            </p>
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
        {/* All normal app pages wrapped in Dashboard */}
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
              <Suspense>{/* <ViewProfile /> */}</Suspense>
            </Dashboard>
          }
        />
        <Route
          path={"/profile-edit"}
          element={
            <Dashboard>
              <Suspense>{/* <Profile /> */}</Suspense>
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

        {/* Landing page */}
        <Route
          path="/"
          element={
            <Suspense>
              <LandingPage />
            </Suspense>
          }
        />

        {/* ✅ PUBLIC QR VIEW ROUTE – NO DASHBOARD, NO NAVBAR */}
        <Route
          path="/payment-certificate/view"
          element={
            <Suspense
              fallback={
                // Minimal loader, no big logo
                <div className="flex items-center justify-center min-h-screen text-sm text-gray-600">
                  Loading certificate...
                </div>
              }
            >
              <PublicPaymentCertificate />
            </Suspense>
          }
        />

        {/* Session timeout */}
        <Route
          path="/session-timeout"
          element={
            <Suspense>
              <SessionTimeoutPage />
            </Suspense>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <Suspense>
              <Error404 />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
}

export default App;
