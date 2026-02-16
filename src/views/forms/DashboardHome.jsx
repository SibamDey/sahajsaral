import { lazy, useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import {
  getDashboardData,
  getDailyVoucherEntry,
  getAvailableFund,
  getMonthwisePayment,
} from "../../Service/DashboardService";

// ✅ Your dropdown APIs (DistLgd, BlockLgd) and (DistLgd, BlockLgd, GPLgd)
import {
  getDistrictList,
  getBlockList,
  getGpList,
} from "../../Service/Project/ActivityDetailsService";

const Charts = lazy(() => import("../../components/Charts"));

const SESSION_KEY = "SAHAJ_SARAL_USER";
// ✅ Flag so modal opens only once (for ROLE === "9")
const LEVEL_SELECTED_KEY = "SAHAJ_SARAL_LEVEL_SELECTED";

const DashboardHome = () => {
  const navigate = useNavigate();

  const jsonString = sessionStorage.getItem(SESSION_KEY);
  const userData = jsonString ? JSON.parse(jsonString) : null;

  // ================= Dashboard API states =================
  const [dashboardPopData, setDashboardPopData] = useState({});
  const [dailyVoucherEntry, setDailyVoucherEntry] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [availableFund, setAvailableFund] = useState({});
  const [monthWisePaymentData, setMonthWisePaymentData] = useState([]);

  // ================= Display animation values =================
  const [displayValues, setDisplayValues] = useState({
    totalVoucher: 0,
    totalpaymentVoucher: 0,
    unverifiedVoucher: 0,
    unverifiedPFP: 0,
  });

  // ================= Modal + Dropdown states =================
  const [showLevelModal, setShowLevelModal] = useState(false);

  const [district, setDistrict] = useState("");
  const [block, setBlock] = useState("");
  const [gp, setGp] = useState("");

  const [districtList, setDistrictList] = useState([]);
  const [blockList, setBlockList] = useState([]);
  const [gpList, setGpList] = useState([]);

  // ✅ Show modal only for ROLE === "9" AND only once (until submitted)
  useEffect(() => {
    if (!userData) return;

    const role = String(userData?.ROLE ?? "");
    const alreadySelected = sessionStorage.getItem(LEVEL_SELECTED_KEY) === "1";

    if (role === "9" && !alreadySelected) {
      setShowLevelModal(true);

      // Prefill from session (if any)
      const dist =
        userData?.DIST_LGD && String(userData.DIST_LGD) !== "0"
          ? String(userData.DIST_LGD)
          : "";
      const blk =
        userData?.BLOCK_LGD && String(userData.BLOCK_LGD) !== "0"
          ? String(userData.BLOCK_LGD)
          : "";
      const gpl =
        userData?.GP_LGD && String(userData.GP_LGD) !== "0"
          ? String(userData.GP_LGD)
          : "";

      setDistrict(dist);
      setBlock(blk);
      setGp(gpl);
    } else {
      setShowLevelModal(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Load District list (once modal is open)
  useEffect(() => {
    if (!showLevelModal) return;

    getDistrictList().then((res) => {
      setDistrictList(res?.data || []);
    });
  }, [showLevelModal]);

  // ✅ If District prefilled -> load blocks
  useEffect(() => {
    if (!showLevelModal) return;

    if (!district) {
      setBlockList([]);
      setGpList([]);
      return;
    }

    // your API: getBlockList(DistLgd, BlockLgd)
    getBlockList(district, 0).then((res) => {
      setBlockList(res?.data || []);
    });
  }, [district, showLevelModal]);

  // ✅ If Block prefilled -> load gps
  useEffect(() => {
    if (!showLevelModal) return;

    if (!district || !block) {
      setGpList([]);
      return;
    }

    // your API: getGpList(DistLgd, BlockLgd, GPLgd)
    getGpList(district, block, 0).then((res) => {
      setGpList(res?.data || []);
    });
  }, [district, block, showLevelModal]);

  // ===== Dropdown options =====
  const DistrictListDropDown = useMemo(() => {
    if (!districtList?.length) return <option>Loading...</option>;
    return districtList.map((d) => (
      <option key={d.DIST_LGD} value={d.DIST_LGD}>
        {d.DIST_NAME}
      </option>
    ));
  }, [districtList]);

  const BlockListDropDown = useMemo(() => {
    if (!blockList?.length) return <option>Loading...</option>;
    return blockList.map((b) => (
      <option key={b.BlockLgd} value={b.BlockLgd}>
        {b.BlockName}
      </option>
    ));
  }, [blockList]);

  const GpListDropDown = useMemo(() => {
    if (!gpList?.length) return <option>Loading...</option>;
    return gpList.map((g) => (
      <option key={g.GPLgd} value={g.GPLgd}>
        {g.GPName}
      </option>
    ));
  }, [gpList]);

  // ===== Handlers =====
  const onDistrict = (e) => {
    const dist = e.target.value;

    setDistrict(dist);
    setBlock("");
    setGp("");
    setBlockList([]);
    setGpList([]);

    if (!dist) return;

    getBlockList(dist, 0).then((res) => {
      setBlockList(res?.data || []);
    });
  };

  const onBlock = (e) => {
    const blk = e.target.value;

    setBlock(blk);
    setGp("");
    setGpList([]);

    if (!blk) return;

    getGpList(district, blk, 0).then((res) => {
      setGpList(res?.data || []);
    });
  };

  const onGp = (e) => {
    setGp(e.target.value);
  };

  // ✅ Submit modal: Update Session Storage + save flag + reload
  const onSubmitLevelSelection = () => {
    if (!district) {
      toast.error("Please select District");
      return;
    }

    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return;

    const u = JSON.parse(raw);
    const updated = { ...u };

    updated.DIST_LGD = String(district);

    if (!block) {
      updated.USER_LEVEL = "DIST";
      updated.BLOCK_LGD = "0";
      updated.GP_LGD = "0";
      updated.CORE_LGD = String(district);
    } else if (!gp) {
      updated.USER_LEVEL = "BLOCK";
      updated.BLOCK_LGD = String(block);
      updated.GP_LGD = "0";
      updated.CORE_LGD = String(block);
    } else {
      updated.USER_LEVEL = "GP";
      updated.BLOCK_LGD = String(block);
      updated.GP_LGD = String(gp);
      updated.CORE_LGD = String(gp);
    }

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));

    // ✅ This makes modal NOT open again after submit
    sessionStorage.setItem(LEVEL_SELECTED_KEY, "1");

    toast.success("Selection saved");
    setShowLevelModal(false);

    window.location.reload();
  };

  // ================= Animated counter effect =================
  useEffect(() => {
    const duration = 1000;
    const steps = 20;
    const intervalTime = duration / steps;

    const interval = setInterval(() => {
      setDisplayValues({
        totalVoucher: Math.floor(Math.random() * 1000),
        totalpaymentVoucher: Math.floor(Math.random() * 1000),
        unverifiedVoucher: Math.floor(Math.random() * 1000),
        unverifiedPFP: Math.floor(Math.random() * 1000),
      });
    }, intervalTime);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setDisplayValues({
        totalVoucher: dashboardPopData?.totalVoucher ?? 0,
        totalpaymentVoucher: dashboardPopData?.totalpaymentVoucher ?? 0,
        unverifiedVoucher: dashboardPopData?.unverifiedVoucher ?? 0,
        unverifiedPFP: dashboardPopData?.unverifiedPFP ?? 0,
      });
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [dashboardPopData]);

  const onVoucher = () => navigate("/voucher-entry");
  const onPayment = () => navigate("/pass-for-payment");

  // ================= Fetch dashboard data =================
  useEffect(() => {
    if (!userData?.CORE_LGD) return;

    getDashboardData(userData?.CORE_LGD).then((response) => {
      if (response.status === 200) setDashboardPopData(response?.data);
    });

    getAvailableFund(userData?.CORE_LGD).then((response) => {
      if (response.status === 200) setAvailableFund(response?.data);
    });

    getDailyVoucherEntry(userData?.CORE_LGD).then((response) => {
      if (response.status === 200) {
        setDailyVoucherEntry(response?.data);

        const formattedChartData = response.data.map((d) => ({
          voucherDate: d.voucherDate,
          totalVoucher: Number(d.totalVoucher),
        }));
        setChartData(formattedChartData);
      }
    });

    getMonthwisePayment(userData?.CORE_LGD).then((response) => {
      if (response.status === 200) {
        const monthlyPaymentData = response.data.map((item) => ({
          ...item,
          totalPayment: parseFloat(item.totalPayment),
        }));
        setMonthWisePaymentData(monthlyPaymentData);
      }
    });
  }, [userData?.CORE_LGD]);

  return (
    <div className="flex-grow">
      <ToastContainer />

      {/* ================= MODAL (ROLE === "9") ================= */}
      {showLevelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Select Working Level
              </h2>
              <p className="text-sm text-gray-600">
                Please choose District / Block / Gram Panchayat to continue.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                  value={district}
                  onChange={onDistrict}
                >
                  <option value="">Select District</option>
                  {DistrictListDropDown}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Block (optional)
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-cyan-500 disabled:bg-gray-100"
                  value={block}
                  onChange={onBlock}
                  disabled={!district}
                >
                  <option value="">Select Block</option>
                  {BlockListDropDown}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Gram Panchayat (optional)
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-cyan-500 disabled:bg-gray-100"
                  value={gp}
                  onChange={onGp}
                  disabled={!block}
                >
                  <option value="">Select GP</option>
                  {GpListDropDown}
                </select>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                className="rounded-lg bg-cyan-600 px-5 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
                onClick={onSubmitLevelSelection}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DASHBOARD ================= */}
      <div className="flex flex-col space-y-4 rounded-lg p-2">
        {/* Mini Cards */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-yellow-400 rounded-lg h-20 p-4 flex flex-col justify-center items-center shadow hover:shadow-xl transition-all duration-500 cursor-pointer hover:-translate-y-1 hover:-translate-x-1">
            <h3 className="text-md text-center font-semibold mb-2">
              Total Available Fund
            </h3>
            <p className="text-xl font-bold">{availableFund?.availableFund}</p>
          </div>

          <div className="bg-cyan-500 h-20 rounded-lg p-2 flex flex-col justify-center items-center shadow hover:shadow-xl transition-all duration-500 cursor-pointer hover:-translate-y-1 hover:-translate-x-1">
            <h3 className="text-base font-semibold mb-1">Total Voucher</h3>
            <p className="text-lg font-bold">{displayValues?.totalVoucher}</p>
          </div>

          <div
            className="bg-orange-400 rounded-lg h-20 p-4 flex flex-col justify-center items-center shadow hover:shadow-xl transition-all duration-500 cursor-pointer hover:-translate-y-1 hover:-translate-x-1"
            onClick={onPayment}
          >
            <h3 className="text-lg font-semibold mb-2">Total Payment</h3>
            <p className="text-xl font-bold">
              {displayValues?.totalpaymentVoucher}
            </p>
          </div>

          <div
            className="bg-red-500 rounded-lg p-4 h-20 flex flex-col justify-center items-center shadow hover:shadow-xl transition-all duration-500 cursor-pointer hover:-translate-y-1 hover:-translate-x-1"
            onClick={onVoucher}
          >
            <h3 className="text-lg font-semibold mb-2">
              Voucher to be Verified
            </h3>
            <p className="text-xl font-bold">{displayValues?.unverifiedVoucher}</p>
          </div>

          <div
            className="bg-cyan-600 rounded-lg p-4 h-20 flex flex-col justify-center items-center shadow hover:shadow-xl transition-all duration-500 cursor-pointer hover:-translate-y-1 hover:-translate-x-1"
            onClick={onPayment}
          >
            <h3 className="text-md text-center font-semibold mb-2">
              PFP to be Verified
            </h3>
            <p className="text-xl font-bold">{displayValues?.unverifiedPFP}</p>
          </div>
        </div>

        {/* Graph Section */}
        <div className="flex flex-row gap-4 mt-4">
          {/* Voucher Count by Date */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md flex-[2]">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                className="text-sm"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="voucherDate"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  className="text-xs"
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalVoucher" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Date wise Voucher entered
            </h2>
          </div>

          {/* Monthly Payment Overview */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md flex-[1]">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthWisePaymentData} className="text-xs">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthName" className="text-xs" />
                <YAxis tickFormatter={(value) => `${value / 1000000}K`} />
                <Tooltip
                  formatter={(value) => `₹${Number(value).toLocaleString()}`}
                />
                <Bar
                  dataKey="totalPayment"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Month wise Payment
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
