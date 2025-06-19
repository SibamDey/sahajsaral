import { lazy, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "@tanstack/react-query";
import { fetch } from "../../functions/Fetchfunctions";
import CountUp from "react-countup";
import { getDashboardData, getDailyVoucherEntry, getAvailableFund, getMonthwisePayment } from "../../Service/DashboardService";
const Charts = lazy(() => import("../../components/Charts"));
// import Charts from "../../components/Charts";

const DashboardHome = () => {
  const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
  const userData = JSON.parse(jsonString);
  const [dashboardPopData, setDashboardPopData] = useState([]);
  const [dailyVoucherEntry, setDailyVoucherEntry] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [availableFund, setAvailableFund] = useState([]);
  const [monthWisePaymentData, setMonthWisePaymentData] = useState([]);
  const navigate = useNavigate();
  // Convert totalVoucher to numbers


  const [displayValues, setDisplayValues] = useState({
    totalVoucher: 0,
    totalpaymentVoucher: 0,
    unverifiedVoucher: 0,
    unverifiedPFP: 0,
  });

  useEffect(() => {
    const duration = 1000; // duration in ms
    const steps = 20; // how many updates in duration
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

  const onVoucher = () => {
    navigate("/voucher-entry");
  }

  const onPayment = () => {
    navigate("/pass-for-payment")
  }

  useEffect(() => {
    getDashboardData(userData?.CORE_LGD).then((response) => {
      if (response.status === 200) {
        setDashboardPopData(response?.data);
      }
    });

    getAvailableFund(userData?.CORE_LGD).then((response) => {
      if (response.status === 200) {
        setAvailableFund(response?.data);
      }
    });

    getDailyVoucherEntry(userData?.CORE_LGD).then((response) => {
      if (response.status === 200) {
        setDailyVoucherEntry(response?.data);

        // Generate chart data here after fetch
        const formattedChartData = response.data.map(d => ({
          voucherDate: d.voucherDate,
          totalVoucher: Number(d.totalVoucher),
        }));
        setChartData(formattedChartData);
      }
    });

    getMonthwisePayment(userData?.CORE_LGD).then((response) => {
      if (response.status === 200) {
        // Generate chart data here after fetch
        const monthlyPaymentData = response.data.map(item => ({
          ...item,
          totalPayment: parseFloat(item.totalPayment)
        }));
        setMonthWisePaymentData(monthlyPaymentData);
      }
    });

  }, [userData?.CORE_LGD]);


  console.log(dailyVoucherEntry, "dailyVoucherEntry")


  return (
    <div className="flex-grow">
      <div className="">
        <div className="flex flex-col space-y-4 rounded-lg p-2">
          {/* Mini Cards */}
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-yellow-400 rounded-lg h-20 p-4 flex flex-col justify-center items-center shadow hover:shadow-xl transition-all duration-500 cursor-pointer hover:-translate-y-1 hover:-translate-x-1">
              <h3 className="text-md text-center font-semibold mb-2">Total Available Fund</h3>
              <p className="text-xl font-bold">{availableFund?.availableFund}</p>
            </div>

            <div className="bg-cyan-500 h-20 rounded-lg p-2 flex flex-col justify-center items-center shadow hover:shadow-xl transition-all duration-500 cursor-pointer hover:-translate-y-1 hover:-translate-x-1">
              <h3 className="text-base font-semibold mb-1">Total Voucher</h3>
              <p className="text-lg font-bold">{displayValues?.totalVoucher}</p>
            </div>

            <div className="bg-orange-400 rounded-lg h-20 p-4 flex flex-col justify-center items-center shadow hover:shadow-xl transition-all duration-500 cursor-pointer hover:-translate-y-1 hover:-translate-x-1" onClick={onPayment}>
              <h3 className="text-lg font-semibold mb-2">Total Payment</h3>
              <p className="text-xl font-bold">{displayValues?.totalpaymentVoucher}</p>
            </div>

            <div className="bg-red-500 rounded-lg p-4 h-20 flex flex-col justify-center items-center shadow hover:shadow-xl transition-all duration-500 cursor-pointer hover:-translate-y-1 hover:-translate-x-1" onClick={onVoucher}>
              <h3 className="text-lg font-semibold mb-2">Voucher to be Verified</h3>
              <p className="text-xl font-bold">{displayValues?.unverifiedVoucher}</p>
            </div>

            <div className="bg-cyan-600 rounded-lg p-4 h-20 flex flex-col justify-center items-center shadow hover:shadow-xl transition-all duration-500 cursor-pointer hover:-translate-y-1 hover:-translate-x-1" onClick={onPayment}>
              <h3 className="text-md text-center font-semibold mb-2">PFP to be Verified</h3>
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
                  // tickFormatter={(date) => {
                  //   const d = new Date(date);
                  //   if (isNaN(d.getTime())) return "Invalid Date";
                  //   const day = "01";
                  //   const month = String(d.getMonth() + 1).padStart(2, "0");
                  //   const year = String(d.getFullYear()).slice(2);
                  //   return `${day}.${month}.${year}`;
                  // }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalVoucher" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Date wise Voucher entered</h2>


            </div>

            {/* Monthly Payment Overview */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md flex-[1]">

              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={monthWisePaymentData} className="text-xs">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="monthName" className="text-xs" />
                  <YAxis tickFormatter={(value) => `${value / 1000000}K`} />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  {/* <Legend /> */}
                  <Bar
                    dataKey="totalPayment"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Month wise Payment</h2>
            </div>
          </div>


          <div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
