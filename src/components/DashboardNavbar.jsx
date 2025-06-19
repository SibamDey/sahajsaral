import { Karmashree_logo } from "./Logo";
import { Calc_permission } from "../functions/Permissions";
// import emblem from "./assets/logo/biswa.png";
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, DropdownItem } from "./Dropdown";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { devApi } from "../WebApi/WebApi";
import { fetch } from "../functions/Fetchfunctions";
import classNames from "classnames";
import { useNetworkState } from "@uidotdev/usehooks";
import sidebar from "../Img/sidebar.png"
import userImg from "../Img/user.png"
import Modal from 'react-modal';
import { motion } from "framer-motion";


export const DashboardNavbar = () => {
  const { online } = useNetworkState();
  const [permission, setPermission] = useState();
  const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
  const userData = JSON.parse(jsonString);
  const [signOutFlag, setSignOutFlag] = useState(false);




  return (
    <>
      {signOutFlag && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
            <h2 className="text-lg font-semibold mb-4">Are you sure you want to sign out?</h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  sessionStorage.removeItem("SAHAJ_SARAL_USER");
                  setTimeout(() => window.close(), 1000);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Yes, Sign Out
              </button>
              <button
                onClick={() => setSignOutFlag(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-screen fixed top-0 left-0 z-10 bg-cyan-950 shadow-lg">
        <div className="w-full p-1 px-1 flex justify-between">
          <Link to={"/dashboard"} className="flex items-center space-x-2 w-fit">
            <div className="flex items-center space-x-4">
              <div className="px-4">
                <img
                  src={sidebar}
                  alt="Advance PRI Account"
                  className="h-9 w-auto px-12 object-contain"
                />
              </div>

              <span className="text-xl text-white font-semibold flex items-right" style={{ marginLeft: "400px" }}>
                {userData?.USER_LEVEL === "GP" ? userData?.GP_NAME : userData?.USER_LEVEL === "BLOCK" ? userData?.BLK_NAME : userData?.USER_LEVEL === "DIST" ? userData?.DIST_NAME : "HQ"} &nbsp;
                {userData?.USER_LEVEL === "GP" ? "GRAM PANCHAYAT" : userData?.USER_LEVEL === "BLOCK" ? "PANCHAYAT SAMITI" : userData?.USER_LEVEL === "DIST" ? "ZILLA PARISHAD" : "Head Quarter"}

              </span>
            </div>
          </Link>
          <Dropdown
            Button={
              <div className="flex justify-center items-left">
                <img
                  src={userImg}
                  alt="User Icon"
                  className="w-8 h-8 rounded-full object-cover"
                />
                {/* Reduced text-xl to text-lg */}
                <div className="text-xs text-white"> {/* Reduced text-sm to text-xs */}
                  <span>Hello,&nbsp;{userData?.USER_NAME}</span>
                  <br />{userData?.USER_DESG} [LGD:{userData?.CORE_LGD}]
                </div>
              </div>
            }

          >
            <div
              className="flex items-center px-4 py-2 space-x-2 hover:bg-red-50 cursor-pointer"
              onClick={() => setSignOutFlag(true)}
            >
              <Icon className="text-2xl text-red-400" icon="material-symbols:logout" />
              <span className="text-sm text-gray-800">Sign out</span>
            </div>

          </Dropdown>
        </div>



        <div
          className={classNames(
            online ? "h-0" : "h-8",
            " bg-red-600 flex justify-center items-center text-white font-semibold transition-all duration-300"
          )}
        >
          {!online && "Your are offline"}
        </div>
      </div>
    </>
  );
};

const UserDetails = ({ role, category }) => {
  const cat = {
    HQ: "State",
    HD: "Department",
    DIST: "District",
    SUB: "Subdivision",
    BLOCK: "Block",
    GP: "Gram Panchayat",
  };
  const type = ["Admin", "Operator", "PIA"];

  return (
    <>
    </>
    // <span className="text-zinc-700 text-base font-semibold">{` ( ${
    //   cat[category]
    // }/${type[role - 1]} ) `}</span>
  );
};
