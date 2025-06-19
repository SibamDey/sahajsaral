import {
  NavLink,
  useNavigate,
  useResolvedPath,
  useLocation,
} from "react-router-dom";
import { useMemo } from "react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import classNames from "classnames";

export const SidebarElement = ({ to, children, customCss, isWrapped }) => {
  const navigate = useNavigate();
  const isActive = useResolvedPath(to).pathname === useLocation().pathname;
  return (
    <div
      onClick={() => navigate(to)}
      className={classNames(
        customCss || "py-1 pl-4 ",
        isActive
          ? "hover:bg-orange-500 bg-orange-400 text-blue-950"
          : "hover:bg-orange-800/40 " +
          (isWrapped ? "text-white/60" : "text-white"),
        " transition-all duration-100 cursor-pointer"
      )}
    >
      <NavLink end to={to}>
        {children}
      </NavLink>
    </div>
  );
};

export const SidebarExpand = ({ text, children, icon }) => {
  const [isopen, setIsopen] = useState(false);

  return (
    <div className={"flex flex-col transition-all text-white"}>
      <button
        className="flex py-1.5 pl-4 pr-8 space-x-2  justify-between items-center hover:bg-blue-800/40 transition-all duration-100"
        onClick={() => setIsopen((prev) => !prev)}
      >
        <span className="flex items-center space-x-2">
          <Icon icon={icon} className="text-xl" />
          <span className="text-s">{text}</span>
        </span>
        {isopen ? (
          <Icon icon={"ep:arrow-up-bold"} />
        ) : (
          <Icon icon={"ep:arrow-down-bold"} />
        )}
      </button>
      <div className="pl-10">{isopen && children}</div>
    </div>
  );
};
