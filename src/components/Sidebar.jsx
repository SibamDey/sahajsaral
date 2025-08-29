import "react-datepicker/dist/react-datepicker.css";
import { useQuery } from "@tanstack/react-query";
import { fetch } from "../functions/Fetchfunctions";
import { SidebarElement, SidebarExpand } from "./SidebarElems";
import { Icon } from "@iconify/react/dist/iconify.js";
import DashboardHome from "../views/forms/DashboardHome"
import Contractor from "../views/forms/ContractorMaster/Contractor";
import EmployeeMaster from "../views/forms/Employee/EmployeeMaster";
import LsgMaster from "../views/forms/LSGMaster/LsgMaster";
import jobWorker from "../views/forms/JobWorkerMaster/jobWorker";
import SchemeMaster from "../views/forms/Scheme/SchemeMaster";
import GlGroupMaster from "../views/forms/GlGroup/GlGroupMaster";
import BankMaster from "../views/forms/BankAndBranchMaster/BankMaster";
import BankBranchMaster from "../views/forms/BankAndBranchMaster/BankBranchMaster";
import NominalAccountCode from "../views/forms/AccountMaster/NominalAccountCode";
import RealAccountCode from "../views/forms/AccountMaster/RealAccountCode";
import VoucherEntry from "../views/forms/Transaction/VoucherEntry";
import PassForPayment from "../views/forms/Transaction/PassForPayment";
import DepartmentMaster from "../views/forms/Department/DepartmentMaster";
import ActivityQuery from "../views/forms/Project/ActivityQuery";
import { Link, useNavigate } from "react-router-dom";
import ActivityDetails from "../views/forms/Project/ActivityDetails";
import ObForNominal from "../views/forms/OpeningBalance/ObForNominal";
import ObForReal from "../views/forms/OpeningBalance/ObForReal";
import Budget from "../views/forms/Budget/Budget";
import ChequeMaster from "../views/forms/Cheque/ChequeMaster";
import ChequeStatusUpdate from "../views/forms/Utility/ChequeStatusUpdate";
import ModelAccountCode from "../views/forms/AccountMaster/ModelAccountCode";
import VoucherCrChallan from "../views/forms/Document/VoucherCrChallan";
import CashInTransitRegister from "../views/forms/Document/CashInTransitRegister";
import ObForLiquidCash from "../views/forms/OpeningBalance/ObForLiquidCash";
import ObCashInTransit from "../views/forms/OpeningBalance/ObCashInTransit";
import ObAdvance from "../views/forms/OpeningBalance/ObAdvance";
import CashAnalysis from "../views/forms/Reports/CashAnalysis";
import RealAccountCBT from "../views/forms/TransactionQuery/RealAccountCBT";
import ChequeReceiptIssueRegister from "../views/forms/Document/ChequeReceiptIssueRegister";
import Theme from "../views/forms/Theme/Theme";
import Sector from "../views/forms/Sector/Sector";
import SubsidaryCashBook from "../views/forms/Reports/SubsidaryCashBook";
import CashBook from "../views/forms/Reports/CashBook";
import GlGroupPri from "../views/forms/GlGroup/GlGroupPri";
import MappingWithGlPri from "../views/forms/AccountMaster/MappingWithGlPri";
import UncashedSelfChequeOb from "../views/forms/OpeningBalance/UncashedSelfChequeOb";
import UnadjustedAdvanceOb from "../views/forms/OpeningBalance/UnadjustedAdvanceOb";
import ContractorDeductionRegister from "../views/forms/Register/ContractorDeductionRegister";
import RequestForNominal from "../views/forms/AccountMaster/RequestForNominal";
import ReceiptPaymentGroup from "../views/forms/GlGroup/ReceiptPaymentGroup";
import HeadWiseTransit from "../views/forms/Document/HeadWiseBalance";
import InstrumentType from "../views/forms/TransactionQuery/InstrumentType";
import PartyTypeName from "../views/forms/TransactionQuery/PartyTypeName";
import HeadwiseJournal from "../views/forms/Document/HeadwiseJournal";
import GpForm26 from "../views/forms/Reports/GpForm26";
import ReconsilationHelp from "../views/forms/Utility/ReconsilationHelp";
import BeneficiaryMaster from "../views/forms/Beneficiary/BeneficiaryMaster";
import AcitivityWiseWorkOrder from "../views/forms/Project/ActivityWiseWorkOrder";
import SectorWiseAllocation from "../views/forms/Project/SectorWiseAllocation";
import Form3536 from "../views/forms/Project/Form3536";
import AdvanceRegister from "../views/forms/Register/AdvanceRegister";
import ContractorPaymentCertificate from "../views/forms/Document/ContractorPaymentCertificate";
import ActivityWiseExpenditure from "../views/forms/Reports/ActivityWiseExpenditure";
import AllotmentWiseExpenditure from "../views/forms/Reports/AllotmentWiseExpenditure";
import GeneralLedger from "../views/forms/Reports/GeneralLedger";
import ReceiptPayment27 from "../views/forms/Reports/ReceiptPaymentform27";
import PaymentCertificate from "../views/forms/Reports/PaymentCertificate";
import NominalAccountDescription from "../views/forms/TransactionQuery/NominalAccountDescription";
import SystemAdministration from "../views/forms/Utility/SystemAdministration";
import AuditTrail from "../views/forms/Utility/AuditTrail";
import ListOfUsers from "../views/forms/Utility/ListOfUsers";
import MonthlyAccountClosing from "../views/forms/Utility/MonthlyAccountClosing";
import ZpPsAccountRule from "../views/forms/Help/ZpPsAccountRule";
import GpAccountRule from "../views/forms/Help/GpAccountRules";
import ReconciliationStatetment from "../views/forms/Document/ReconciliationStatement";
import ChequeNotEncash from "../views/forms/OpeningBalance/ChequeNotEncash";
import PassForPaymentsDetails from "../views/forms/Document/PassForPaymentsDetails";
import RealNominalMapping from "../views/forms/AccountMaster/RealNominalMapping";
import CashBookZpPs from "../views/forms/Reports/CashbookZpPs";
import GpForm26ZpPs from "../views/forms/Reports/GpForm26ZpPs";
import TransactionNotCB from "../views/forms/OpeningBalance/TransactionNotCB";
import NominalAccountDelete from "../views/forms/AccountMaster/NominalAccountDelete";
import BankTrePassbook from "../views/forms/Document/BankTrePassbook";
import ObForNominalHQ from "../views/forms/OpeningBalance/ObForNominalHQ";
import SessionTimeoutPage from "../views/forms/Idle/SessionTimeoutPage";
import PropertyTax from "../views/forms/Register/PropertyTax";
import CheckBalanceRealNominal from "../views/forms/Reports/CheckBalanceRealNominal";
import ListOfDeletePfp from "../views/forms/Reports/ListOfDeletePfp";
import ListOfDeleteVoucher from "../views/forms/Reports/ListOfDeletedVoucher";
import SecureWork from "../views/forms/AdministrativeWork/SecureWork";
import AdministrativeSecureWork from "../views/forms/AdministrativeWork/AdministrativeSecureWork";
import UnverifyPassForPayment from "../views/forms/Utility/UnverifyPassForPayment";
import CashAnalysisDetails from "../views/forms/Reports/CashAnalysisDetails";
import BankTryReconciliation from "../views/forms/Reports/BankTryReconciliation";
import MonthClosingReport from "../views/forms/Reports/MonthCloseReport";
import OSRCollectionApp from "../views/forms/Register/OSRCollectionApp";




export const sideBarList = [

  {
    Component: DashboardHome,
    text: "Home",
    route: "/dashboard",
    permissions: [],
  },

  {
    Component: Contractor,
    text: "Contractor master",
    route: "/contractor-master",
    permissions: [1],
  },
  {
    Component: EmployeeMaster,
    text: "EmployeeMaster",
    route: "/employee-master",
    permissions: [1],
  },

  {
    Component: DepartmentMaster,
    text: "DepartmentMaster",
    route: "/department-master",
    permissions: [1],
  },
  {
    Component: ChequeMaster,
    text: "ChequeMaster",
    route: "/cheque-master",
    permissions: [1],
  },
  {
    Component: ChequeStatusUpdate,
    text: "ChequeStatusUpdate",
    route: "/cheque-status_update",
    permissions: [1],
  },
  {
    Component: LsgMaster,
    text: "PRI",
    route: "/pri-master",
    permissions: [1],
  },
  {
    Component: jobWorker,
    text: "JobMaster",
    route: "/job-worker-master",
    permissions: [1],
  },
  {
    Component: SchemeMaster,
    text: "schemeMaster",
    route: "/scheme-master",
    permissions: [1],
  },
  {
    Component: GlGroupMaster,
    text: "glGroupMaster",
    route: "/gl-group-master",
    permissions: [1],
  },
  {
    Component: BankBranchMaster,
    text: "BankBranchMaster",
    route: "/bank-branch-master",
    permissions: [1],
  },
  {
    Component: BankMaster,
    text: "BankMaster",
    route: "/bank-master",
    permissions: [1],
  },
  {
    Component: NominalAccountCode,
    text: "NominalAccountCode",
    route: "/nominal-account-master",
    permissions: [1],
  },
  {
    Component: NominalAccountDelete,
    text: "NominalAccountDelete",
    route: "/nominal-account-code-delete",
    permissions: [1],
  },
  {
    Component: RealAccountCode,
    text: "RealAccountCode",
    route: "/real-account-code",
    permissions: [1],
  },
  {
    Component: VoucherEntry,
    text: "VoucherEntry",
    route: "/voucher-entry",
    permissions: [1],
  },
  {
    Component: PassForPayment,
    text: "VoucherEntry",
    route: "/pass-for-payment",
    permissions: [1],
  },

  //projects

  {
    Component: ActivityQuery,
    text: "ActivityQuery",
    route: "/query-activity",
    permissions: [1],
  },

  {
    Component: ActivityDetails,
    text: "ActivityDetails",
    route: "/activity-details",
    permissions: [1],
  },

  {
    Component: ObForNominal,
    text: "ObForNominal",
    route: "/ob-for-nominal-account",
    permissions: [1],
  },

  {
    Component: ObForNominalHQ,
    text: "ObForNominalHQ",
    route: "/ob-for-nominal-account-hq",
    permissions: [1],
  },

  {
    Component: ObForReal,
    text: "ObForReal",
    route: "/ob-for-real-account",
    permissions: [1],
  },

  {
    Component: Budget,
    text: "Budget",
    route: "/budget",
    permissions: [1],
  },

  {
    Component: ModelAccountCode,
    text: "ModelAccountCode",
    route: "/model-account-code",
    permissions: [1],
  },

  {
    Component: VoucherCrChallan,
    text: "VoucherCrChallan",
    route: "/voucher_cr_challan",
    permissions: [1],
  },

  {
    Component: CashInTransitRegister,
    text: "CashInTransitRegister",
    route: "/cash_in_transit_register",
    permissions: [1],
  },
  {
    Component: ObForLiquidCash,
    text: "ObForLiquidCash",
    route: "/ob-liquid-cash",
    permissions: [1],
  },
  {
    Component: ObCashInTransit,
    text: "ObCashInTransit",
    route: "/ob-cash-in-transit",
    permissions: [1],
  },
  {
    Component: ObAdvance,
    text: "ObAdvance",
    route: "/ob-advance",
    permissions: [1],
  },
  {
    Component: CashAnalysis,
    text: "CashAnalysis",
    route: "/cash-analysis",
    permissions: [1],
  },
  {
    Component: RealAccountCBT,
    text: "RealAccountCBT",
    route: "/real-account-cash-bank-treasury",
    permissions: [1],
  },

  {
    Component: ChequeReceiptIssueRegister,
    text: "ChequeReceiptIssueRegister",
    route: "/cheque-receipt-issue-register",
    permissions: [1],
  },

  {
    Component: Theme,
    text: "Theme",
    route: "/theme",
    permissions: [1],
  },

  {
    Component: Sector,
    text: "Sector",
    route: "/sector",
    permissions: [1],
  },

  {
    Component: SubsidaryCashBook,
    text: "SubsidaryCashBook",
    route: "/subsidary_cash_book",
    permissions: [1],
  },

  {
    Component: CashBook,
    text: "CashBook",
    route: "/cash_book",
    permissions: [1],
  },

  {
    Component: CashBookZpPs,
    text: "CashBookZpPs",
    route: "/cash_book-zp-ps",
    permissions: [1],
  },

  {
    Component: GlGroupPri,
    text: "GlGroupPri",
    route: "/gl_group_pri",
    permissions: [1],
  },

  {
    Component: MappingWithGlPri,
    text: "MappingWithGlPri",
    route: "/mapping-with-gl-pri",
    permissions: [1],
  },

  {
    Component: UncashedSelfChequeOb,
    text: "UncashedSelfChequeOb",
    route: "/uncashed-self-cheque-ob",
    permissions: [1],
  },

  {
    Component: UnadjustedAdvanceOb,
    text: "UnadjustedAdvanceOb",
    route: "/unadjusted-advance-ob",
    permissions: [1],
  },
  {
    Component: ContractorDeductionRegister,
    text: "ContractorDeductionRegister",
    route: "/contractor-deduction-register",
    permissions: [1],
  },

  {
    Component: RequestForNominal,
    text: "RequestForNominal",
    route: "/request-for-nominal",
    permissions: [1],
  },

  {
    Component: ReceiptPaymentGroup,
    text: "ReceiptPaymentGroup",
    route: "/receipt-payment-group",
    permissions: [1],
  },

  {
    Component: HeadWiseTransit,
    text: "HeadWiseTransit",
    route: "/headwise-transit",
    permissions: [1],
  },

  {
    Component: InstrumentType,
    text: "InstrumentType",
    route: "/instrument-type-no",
    permissions: [1],
  },

  {
    Component: PartyTypeName,
    text: "PartyTypeName",
    route: "/party-type-name",
    permissions: [1],
  },

  {
    Component: HeadwiseJournal,
    text: "HeadwiseJournal",
    route: "/headwise-journal",
    permissions: [1],
  },

  {
    Component: GpForm26,
    text: "GpForm26",
    route: "/gp-form26",
    permissions: [1],
  },

  {
    Component: GpForm26ZpPs,
    text: "GpForm26ZpPs",
    route: "/gp-form26-zp-ps",
    permissions: [1],
  },



  {
    Component: ReconsilationHelp,
    text: "ReconcilationHelp",
    route: "/cheque-status-as-per-pass-book",
    permissions: [1],
  },

  {
    Component: BeneficiaryMaster,
    text: "BeneficiaryMaster",
    route: "/beneficiary",
    permissions: [1],
  },
  {
    Component: AcitivityWiseWorkOrder,
    text: "AcitivityWiseWorkOrder",
    route: "/activity-wise-work-order",
    permissions: [1],
  },
  {
    Component: SectorWiseAllocation,
    text: "SectorWiseAllocation",
    route: "/sector-wise-allocation",
    permissions: [1],
  },
  {
    Component: Form3536,
    text: "Form3536",
    route: "/form-35-36",
    permissions: [1],
  },
  {
    Component: AdvanceRegister,
    text: "AdvanceRegister",
    route: "/advance-register",
    permissions: [1],
  },

  {
    Component: BankTrePassbook,
    text: "BankTrePassbook",
    route: "/bank-try-passbook",
    permissions: [1],
  },

  {
    Component: ContractorPaymentCertificate,
    text: "ContractorPaymentCertificate",
    route: "/contractor-payment-certificate",
    permissions: [1],
  },
  {
    Component: ActivityWiseExpenditure,
    text: "ActivityWiseExpenditure",
    route: "/activity-wise-expenditure",
    permissions: [1],
  },
  {
    Component: AllotmentWiseExpenditure,
    text: "AllotmentWiseExpenditure",
    route: "/allotment-wise-expenditure",
    permissions: [1],
  },
  {
    Component: GeneralLedger,
    text: "GeneralLedger",
    route: "/general-ledger",
    permissions: [1],
  },
  {
    Component: ReceiptPayment27,
    text: "ReceiptPayment27",
    route: "/receipt-payment27",
    permissions: [1],
  },
  {
    Component: PaymentCertificate,
    text: "PaymentCertificate",
    route: "/payment-certificate",
    permissions: [1],
  },
  {
    Component: NominalAccountDescription,
    text: "NominalAccountDescription",
    route: "/nominal-account-description",
    permissions: [1],
  },
  {
    Component: SystemAdministration,
    text: "SystemAdministration",
    route: "/system-administration",
    permissions: [1],
  },
  {
    Component: AuditTrail,
    text: "AuditTrail",
    route: "/audit-trail",
    permissions: [1],
  },
  {
    Component: ListOfUsers,
    text: "ListOfUsers",
    route: "/list-of-users",
    permissions: [1],
  },
  {
    Component: MonthlyAccountClosing,
    text: "MonthlyAccountClosing",
    route: "/monthly-accounting-closing",
    permissions: [1],
  },
  {
    Component: ZpPsAccountRule,
    text: "ZpPsAccountRule",
    route: "/zp-ps-account-rule",
    permissions: [1],
  },

  {
    Component: GpAccountRule,
    text: "GpAccountRule",
    route: "/gp-account-rule",
    permissions: [1],
  },

  {
    Component: ReconciliationStatetment,
    text: "ReconciliationStatetment",
    route: "/reconciliation-statement",
    permissions: [1],
  },

  {
    Component: ChequeNotEncash,
    text: "ChequeNotEncash",
    route: "/cheque-not-encashed",
    permissions: [1],
  },

  {
    Component: PassForPaymentsDetails,
    text: "PassForPaymentsDetails",
    route: "/pass-for-payment-details",
    permissions: [1],
  },
  {
    Component: RealNominalMapping,
    text: "RealNominalMapping",
    route: "/nominal-mapping-with-bank-try",
    permissions: [1],
  },

  {
    Component: TransactionNotCB,
    text: "TransactionNotCB",
    route: "/transaction-not-in-cash-book",
    permissions: [1],
  },

  {
    Component: PropertyTax,
    text: "PropertyTax",
    route: "/property-tax",
    permissions: [1],
  },

  {
    Component: CheckBalanceRealNominal,
    text: "CheckBalanceRealNominal",
    route: "/check-balance-real-nominal",
    permissions: [1],
  },

  {
    Component: ListOfDeletePfp,
    text: "ListOfDeletePfp",
    route: "/list-of-deleted-pfp",
    permissions: [1],
  },

  {
    Component: ListOfDeleteVoucher,
    text: "ListOfDeleteVoucher",
    route: "/list-of-deleted-voucher",
    permissions: [1],
  },

  {
    Component: SecureWork,
    text: "SecureWork",
    route: "/secure-work",
    permissions: [1],
  },

  {
    Component: AdministrativeSecureWork,
    text: "AdministrativeSecureWork",
    route: "/administrative-secure-work",
    permissions: [1],
  },

  {
    Component: UnverifyPassForPayment,
    text: "UnverifyPassForPayment",
    route: "/unverify-pass-for-payment",
    permissions: [1],
  },

  {
    Component: CashAnalysisDetails,
    text: "CashAnalysisDetails",
    route: "/cash-analysis-details",
    permissions: [1],
  },

  {
    Component: BankTryReconciliation,
    text: "BankTryReconciliation",
    route: "/bank-try-reconciliation",
    permissions: [1],
  },

  {
    Component: MonthClosingReport,
    text: "MonthClosingReport",
    route: "/month-closing-report",
    permissions: [1],
  },
    {
    Component: OSRCollectionApp,
    text: "OSRCollectionApp",
    route: "/osr-collection-app",
    permissions: [1],
  },











];

export const Sidebar = () => {
  const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
  const userData = JSON.parse(jsonString);

  // const { data: userDetails, isSuccess } = useQuery({
  //   queryKey: ["userDetails"],
  //   queryFn: async () => {
  //     const data = await fetch.get("/api/user/viewuser/" + userIndex);
  //     return data.data.result;
  //   },
  // });

  // const userRoleIndex = Calc_permission(
  //   userDetails?.category,
  //   userDetails?.role_type,
  //   Boolean(parseInt(userDetails?.dno_status))
  // )?.uniqueId;
  // console.log(userRoleIndex, "permission");

  return (

    <div className="flex flex-col" >
      <SidebarElement to="/dashboard" customCss={"flex justify-start pl-4 "}>
        <div className="text-sm items-start py-2 capitalize">
          <span className="flex items-center space-x-1">
            <Icon icon={"material-symbols:home"} className="text-2xl" />
            <span>Home</span>
          </span>
        </div>
      </SidebarElement>


      <SidebarExpand text="Master" icon="hugeicons:microsoft-admin">
        {userData?.USER_INDEX === 1 ?
          <SidebarElement
            to="/scheme-master"
            customCss={"flex justify-start pl-4 "}
          >
            <div className="text-sm  items-start py-1 capitalize">
              <span className="flex items-center space-x-4">
                <span>Scheme</span>
              </span>
            </div>
          </SidebarElement> : ""}



        <SidebarElement
          to="/pri-master"
          customCss={"flex justify-start pl-4 "}
        >
          <div className="text-sm  items-start py-1 capitalize">
            <span className="flex items-center space-x-4">
              {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
              <span>PRI</span>
            </span>
          </div>
        </SidebarElement>
        {userData?.USER_LEVEL === "HQ" ?

          <SidebarElement
            to="/department-master"
            customCss={"flex justify-start pl-4 "}
          >
            <div className="text-sm  items-start py-1 capitalize">
              <span className="flex items-center space-x-4">
                {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                <span>Department</span>
              </span>
            </div>
          </SidebarElement> : ""}



        <SidebarExpand text="Party" icon="fluent-mdl2:radio-bullet">

          <SidebarElement
            to="/employee-master"
            customCss={"flex justify-start pl-4 "}
          >
            <div className="text-sm  items-start py-1 capitalize">
              <span className="flex items-center space-x-4">
                {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                <span>Employee</span>
              </span>
            </div>
          </SidebarElement>

          <SidebarElement
            to="/contractor-master"
            customCss={"flex justify-start pl-4 "}
          >
            <div className="text-sm  items-start py-1 capitalize">
              <span className="flex items-center space-x-4">
                {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                <span>Contractor</span>
              </span>
            </div>
          </SidebarElement>

          <SidebarElement
            to="/job-worker-master"
            customCss={"flex justify-start pl-4 "}
          >
            <div className="text-sm  items-start py-1 capitalize">
              <span className="flex items-center space-x-4">
                <span>Job Worker</span>
              </span>
            </div>
          </SidebarElement>

          <SidebarElement
            to="/beneficiary"
            customCss={"flex justify-start pl-4 "}
          >
            <div className="text-sm items-start py-2 capitalize">
              <span classNyame="flex items-center space-x-4">
                <span>Beneficiary</span>
              </span>
            </div>
          </SidebarElement>
        </SidebarExpand>

        <SidebarExpand text="Report Group" icon="fluent-mdl2:radio-bullet">
          {userData?.USER_INDEX === 1 ?
            <SidebarElement
              to="/gl-group-master"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-2 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>General Ledger -  State</span>
                </span>
              </div>
            </SidebarElement> : ""}
          <SidebarElement
            to="/gl_group_pri"
            customCss={"flex justify-start pl-4 "}
          >
            <div className="text-sm items-start py-2 capitalize">
              <span className="flex items-center space-x-4">
                {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                <span>General Ledger – PRI</span>
              </span>
            </div>
          </SidebarElement>

          <SidebarElement
            to="/receipt-payment-group"
            customCss={"flex justify-start pl-4 "}
          >
            <div className="text-sm items-start py-2 capitalize">
              <span className="flex items-center space-x-4">
                {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                <span>Receipt-Payment Group</span>
              </span>
            </div>
          </SidebarElement>

          <SidebarElement
            to="/theme"
            customCss={"flex justify-start pl-4 "}
          >
            <div className="text-sm items-start py-2 capitalize">
              <span className="flex items-center space-x-4">
                <span>Theme</span>
              </span>
            </div>
          </SidebarElement>

          <SidebarElement
            to="/sector"
            customCss={"flex justify-start pl-4 "}
          >
            <div className="text-sm items-start py-2 capitalize">
              <span className="flex items-center space-x-4">
                <span>Sector</span>
              </span>
            </div>
          </SidebarElement>

        </SidebarExpand>

        <SidebarExpand text="Financial Institution" icon="fluent-mdl2:radio-bullet">

          <SidebarElement
            to="/bank-master"
            customCss={"flex justify-start pl-4 "}
          >
            <div className="text-sm items-start py-2 capitalize">
              <span className="flex items-center space-x-4">
                {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                <span>Bank/Treasury</span>
              </span>
            </div>
          </SidebarElement>
          <SidebarElement
            to="/bank-branch-master"
            customCss={"flex justify-start pl-4 "}
          >
            <div className="text-sm items-start py-2 capitalize">
              <span className="flex items-center space-x-4">
                {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                <span>Bank/Treasury Branch</span>
              </span>
            </div>
          </SidebarElement>
        </SidebarExpand>

        <SidebarExpand text="Account Code" icon="fluent-mdl2:radio-bullet">
          <SidebarElement
            to="/model-account-code"
            customCss={"flex justify-start pl-4 "}
          >
            <div className="text-sm items-start py-1 capitalize">
              <span className="flex items-center space-x-4">
                {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                <span>National Account Code (NAC)</span>
              </span>
            </div>
          </SidebarElement>
          <SidebarElement
            to="/nominal-account-master"
            customCss={"flex justify-start pl-4 "}
          >
            <div className="text-sm items-start py-2 capitalize">
              <span className="flex items-center space-x-4">
                {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                <span>Nominal Account Code</span>
              </span>
            </div>
          </SidebarElement>

          <SidebarElement
            to="/nominal-account-code-delete"
            customCss={"flex justify-start pl-4 "}
          >
            <div className="text-sm items-start py-2 capitalize">
              <span className="flex items-center space-x-4">
                {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                <span>Nominal A/C Deletion</span>
              </span>
            </div>
          </SidebarElement>
          <SidebarElement
            to="/real-account-code"
            customCss={"flex justify-start pl-4 "}
          >
            <div className="text-sm items-start py-2 capitalize">
              <span className="flex items-center space-x-4">
                {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                <span>Real Account Code</span>
              </span>
            </div>
          </SidebarElement>

          <SidebarElement
            to="/mapping-with-gl-pri"
            customCss={"flex justify-start pl-4 "}
          >
            <div className="text-sm items-start py-2 ">
              <span className="flex items-center space-x-4">
                {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                <span>Mapping with GL - PRI</span>
              </span>
            </div>
          </SidebarElement>


          <SidebarElement
            to="/nominal-mapping-with-bank-try"
            customCss={"flex justify-start pl-4 "}
          >
            <div className="text-sm items-start py-2 ">
              <span className="flex items-center space-x-4">
                {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                <span>Mapping Nominal - Real</span>
              </span>
            </div>
          </SidebarElement>

          <SidebarElement
            to="/request-for-nominal"
            customCss={"flex justify-start pl-4 "}
          >
            <div className="text-sm items-start py-2 ">
              <span className="flex items-center space-x-4">
                {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                <span>Request for new Nominal A/C</span>
              </span>
            </div>
          </SidebarElement>

        </SidebarExpand>

        <SidebarExpand text="Opening Balance" icon="fluent-mdl2:radio-bullet">

          {userData?.USER_INDEX === 1 ?
            <SidebarElement
              to="/ob-for-nominal-account-hq"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-2 capitalize">
                <span className="flex items-center space-x-4 text-sm">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>OB for Nominal Account (HQ)</span>
                </span>
              </div>
            </SidebarElement>
            : ""
          }
          <SidebarElement
            to="/ob-for-nominal-account"
            customCss={"flex justify-start pl-4 "}
          >
            <div className="text-sm items-start py-2 capitalize">
              <span className="flex items-center space-x-4 text-sm">
                {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                <span>OB for Nominal Account</span>
              </span>
            </div>
          </SidebarElement>
          <SidebarElement
            to="/ob-for-real-account"
            customCss={"flex justify-start pl-4 "}
          >
            <div className="text-sm items-start py-2 capitalize">
              <span className="flex items-center space-x-4 text-sm">
                {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                <span>OB for Real (Cash/Bank/Try)</span>
              </span>
            </div>
          </SidebarElement>
          <SidebarElement
            to="/ob-liquid-cash"
            customCss={"flex justify-start pl-4 "}
          >
            <div className="text-sm items-start py-2 capitalize">
              <span className="flex items-center space-x-4 text-sm">
                {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                <span>Headwise OB – Liquid Cash</span>
              </span>
            </div>
          </SidebarElement>

          {userData?.USER_LEVEL === "GP" ?
            <>
              <SidebarElement
                // to="/ob-cash-in-transit"
                customCss={"flex justify-start pl-4 "}
              >
                <div className="text-sm items-start py-2 capitalize">
                  <span className="flex items-center space-x-4 text-sm">
                    {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                    <span>Headwise OB – Cash-in-Transit</span>
                  </span>
                </div>
              </SidebarElement>

              <SidebarElement
                to="/ob-advance"
                customCss={"flex justify-start pl-4 "}
              >
                <div className="text-sm items-start py-2 capitalize">
                  <span className="flex items-center space-x-4 text-sm">
                    {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                    <span>Headwise OB – Advance</span>
                  </span>
                </div>
              </SidebarElement>

              <SidebarElement
                to="/unadjusted-advance-ob"
                customCss={"flex justify-start pl-4 "}
              >
                <div className="text-sm items-start py-2 capitalize">
                  <span className="flex items-center space-x-4 text-sm">
                    {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                    <span>Unadjusted Advance – OB</span>
                  </span>
                </div>
              </SidebarElement>

              <SidebarElement
                // to="/uncashed-self-cheque-ob"
                customCss={"flex justify-start pl-4 "}
              >
                <div className="text-sm items-start py-2 capitalize">
                  <span className="flex items-center space-x-4 text-sm">
                    {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                    <span>Uncashed Self cheque
                      (Cash-in-Transit) – OB</span>
                  </span>
                </div>
              </SidebarElement>
            </>
            :
            <>
              <SidebarElement
                to="/ob-cash-in-transit"
                customCss={"flex justify-start pl-4 "}
              >
                <div className="text-sm items-start py-2 capitalize">
                  <span className="flex items-center space-x-4 text-sm">
                    {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                    <span>Headwise OB – Cash-in-Transit</span>
                  </span>
                </div>
              </SidebarElement>

              <SidebarElement
                to="/ob-advance"
                customCss={"flex justify-start pl-4 "}
              >
                <div className="text-sm items-start py-2 capitalize">
                  <span className="flex items-center space-x-4 text-sm">
                    {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                    <span>Headwise OB – Advance</span>
                  </span>
                </div>
              </SidebarElement>

              <SidebarElement
                to="/unadjusted-advance-ob"
                customCss={"flex justify-start pl-4 "}
              >
                <div className="text-sm items-start py-2 capitalize">
                  <span className="flex items-center space-x-4 text-sm">
                    {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                    <span>Unadjusted Advance – OB</span>
                  </span>
                </div>
              </SidebarElement>

              <SidebarElement
                to="/uncashed-self-cheque-ob"
                customCss={"flex justify-start pl-4 "}
              >
                <div className="text-sm items-start py-2 capitalize">
                  <span className="flex items-center space-x-4 text-sm">
                    {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                    <span>Uncashed Self cheque
                      (Cash-in-Transit) – OB</span>
                  </span>
                </div>
              </SidebarElement>
            </>}

          <SidebarElement
            to="/cheque-not-encashed"
            customCss={"flex justify-start pl-4 "}
          >
            <div className="text-sm items-start py-2 capitalize">
              <span className="flex items-center space-x-4 text-sm">
                {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                <span>Transaction Not Reflected in passbook</span>
              </span>
            </div>
          </SidebarElement>

          <SidebarElement
            to="/transaction-not-in-cash-book"
            customCss={"flex justify-start pl-4 "}
          >
            <div className="text-sm items-start py-2 capitalize">
              <span className="flex items-center space-x-4 text-sm">
                {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                <span>Transaction Not Reflected in Cash Book</span>
              </span>
            </div>
          </SidebarElement>

        </SidebarExpand>
        <SidebarElement
          to="/cheque-master"
          customCss={"flex justify-start pl-4 "}
        >
          <div className="text-sm items-start py-1 capitalize">
            <span className="flex items-center space-x-4">
              {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
              <span>Cheque Book</span>
            </span>
          </div>
        </SidebarElement>
      </SidebarExpand>

      {[20546, 7175, 5281, 7161, 7162, 7177, 7164, 22061, 22062, 22063].includes(Number(userData?.USER_INDEX)) && (
        <SidebarExpand text="Administrative Work" icon="material-symbols:help-center-outline-rounded">
          <SidebarElement
            to="/secure-work"
            customCss="flex justify-start pl-4"
          >
            <div className="text-sm items-start py-1 capitalize">
              <span className="flex items-center space-x-4">
                <span>Secure Work</span>
              </span>
            </div>
          </SidebarElement>
        </SidebarExpand>
      )}

      {userData?.USER_LEVEL === "HQ" ? "" :
        <>
          <SidebarExpand text="Transaction" icon="tabler:transaction-rupee">
            <SidebarElement
              to="/pass-for-payment"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>Pass For Payment</span>
                </span>
              </div>
            </SidebarElement>
            <SidebarElement
              to="/voucher-entry"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>Voucher Entry</span>
                </span>
              </div>
            </SidebarElement>
            <SidebarElement
              to="/budget"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>Annual Budget</span>
                </span>
              </div>
            </SidebarElement>

          </SidebarExpand>

          <SidebarExpand text="Project" icon="eos-icons:project-outlined">
            <SidebarElement
              to="/activity-details"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>Activity Details</span>
                </span>
              </div>
            </SidebarElement>
            <SidebarElement
              to="/query-activity"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>Activity Query</span>
                </span>
              </div>
            </SidebarElement>
            <SidebarElement
              to="/activity-wise-work-order"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>Activity Wise Work Order</span>
                </span>
              </div>
            </SidebarElement>
            <SidebarElement
              to="/sector-wise-allocation"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>Sector Wise Allocation</span>
                </span>
              </div>
            </SidebarElement>
            <SidebarElement
              to="/form-35-36"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>Form 35 & 36</span>
                </span>
              </div>
            </SidebarElement>
          </SidebarExpand>

          <SidebarExpand text="Register" icon="ep:document">

            <SidebarElement
              to="/property-tax"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>Property Tax</span>
                </span>
              </div>
            </SidebarElement>

            <SidebarElement
              to="/cheque-receipt-issue-register"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>Cheque Receipt & Issue Register</span>
                </span>
              </div>
            </SidebarElement>
            <SidebarElement
              to="/advance-register"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>Advance Register</span>
                </span>
              </div>
            </SidebarElement>
            <SidebarElement
              to="/cash_in_transit_register"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>Cash-in-Transit Register</span>
                </span>
              </div>
            </SidebarElement>
            <SidebarElement
              to="/contractor-deduction-register"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>Contractor Deduction Register</span>
                </span>
              </div>
            </SidebarElement>

            <SidebarElement
              to="/osr-collection-app"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>OSR Collection - Mobile App</span>
                </span>
              </div>
            </SidebarElement>

          </SidebarExpand>

          <SidebarExpand text="Documents" icon="ep:document">

            <SidebarElement
              to="/pass-for-payment-details"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm  items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>Payment Authorization</span>
                </span>
              </div>
            </SidebarElement>

            <SidebarElement
              to="/voucher_cr_challan"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm  items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>Voucher/CR/Challan</span>
                </span>
              </div>
            </SidebarElement>

            <SidebarElement
              to="/headwise-journal"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm  items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>Headwise Journal</span>
                </span>
              </div>
            </SidebarElement>


            <SidebarElement
              to="/headwise-transit"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm  items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>Headwise Balance</span>
                </span>
              </div>
            </SidebarElement>


            <SidebarElement
              to="/contractor-payment-certificate"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm  items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>Contractor Payment Certificate</span>
                </span>
              </div>
            </SidebarElement>

            <SidebarElement
                to="/bank-try-reconciliation"
                customCss={"flex justify-start pl-4 "}
              >
                <div className="text-sm items-start py-1 capitalize">
                  <span className="flex items-center space-x-4">
                    {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                    <span>Bank/Try Reconciliation</span>
                  </span>
                </div>
              </SidebarElement>

            <SidebarElement
              to="/bank-try-passbook"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm  items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>Bank/Treasury Pass Book</span>
                </span>
              </div>
            </SidebarElement>
            <SidebarElement
              to="/list-of-deleted-pfp"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>List of Deleted PFP</span>
                </span>
              </div>
            </SidebarElement>

            <SidebarElement
              to="/list-of-deleted-voucher"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>List of Deleted Voucher</span>
                </span>
              </div>
            </SidebarElement>






          </SidebarExpand>

          <SidebarExpand text="Reports" icon="lsicon:report-outline">

            <SidebarExpand text="Non-Schematic" icon="fluent-mdl2:radio-bullet">
              {/* {userData?.USER_LEVEL === "GP" ?  */}
              <SidebarElement
                to="/cash_book"
                customCss={"flex justify-start pl-4 "}
              >
                <div className="text-sm items-start py-1 capitalize">
                  <span className="flex items-center space-x-4">
                    {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                    <span>Cash Book</span>
                  </span>
                </div>
              </SidebarElement>


              


              {/* : */}


              {/* <SidebarElement
                to="/cash_book-zp-ps"
                customCss={"flex justify-start pl-4 "}
              >
                <div className="text-sm items-start py-1 capitalize">
                  <span className="flex items-center space-x-4">
            
                    <span>Cash Book ZP PS</span>
                  </span>
                </div>
              </SidebarElement> */}
              {/* } */}

              <SidebarElement
                to="/subsidary_cash_book"
                customCss={"flex justify-start pl-4 "}
              >
                <div className="text-sm items-start py-1 capitalize">
                  <span className="flex items-center space-x-4">
                    {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                    <span>Subsidary Cash Book</span>
                  </span>
                </div>
              </SidebarElement>

              <SidebarElement
                to="/general-ledger"
                customCss={"flex justify-start pl-4 "}
              >
                <div className="text-sm items-start py-1 capitalize">
                  <span className="flex items-center space-x-4">
                    {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                    <span>General Ledger</span>
                  </span>
                </div>
              </SidebarElement>
              <SidebarElement
                to="/cash-analysis"
                customCss={"flex justify-start pl-4 "}
              >
                <div className="text-sm items-start py-1 capitalize">
                  <span className="flex items-center space-x-4">
                    {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                    <span>Cash Analysis</span>
                  </span>
                </div>
              </SidebarElement>

              <SidebarElement
                to="/cash-analysis-details"
                customCss={"flex justify-start pl-4 "}
              >
                <div className="text-sm items-start py-1 capitalize">
                  <span className="flex items-center space-x-4">
                    {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                    <span>Cash Analysis (Details)</span>
                  </span>
                </div>
              </SidebarElement>
              <SidebarElement
                to="/gp-form26"
                customCss={"flex justify-start pl-4 "}
              >
                <div className="text-sm items-start py-1 capitalize">
                  <span className="flex items-center space-x-4">
                    {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                    <span>GP (Form-26)</span>
                  </span>
                </div>
              </SidebarElement>
              {/* <SidebarElement
                to="/gp-form26-zp-ps"
                customCss={"flex justify-start pl-4 "}
              >
                <div className="text-sm items-start py-1 capitalize">
                  <span className="flex items-center space-x-4">
                    <span>GP (Form-26) ZP PS</span>
                  </span>
                </div>
              </SidebarElement> */}
              <SidebarElement
                to="/receipt-payment27"
                customCss={"flex justify-start pl-4 "}
              >
                <div className="text-sm items-start py-1 capitalize">
                  <span className="flex items-center space-x-4">
                    {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                    <span>Receipt-Payment (Form-27)</span>
                  </span>
                </div>
              </SidebarElement>




            </SidebarExpand>


            <SidebarExpand text="Schematic" icon="fluent-mdl2:radio-bullet">

              <SidebarElement
                to="/activity-wise-expenditure"
                customCss={"flex justify-start pl-4 "}
              >
                <div className="text-sm items-start py-1 capitalize">
                  <span className="flex items-center space-x-4">
                    {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                    <span>Activity-wise Expenditure</span>
                  </span>
                </div>
              </SidebarElement>

              <SidebarElement
                to="/allotment-wise-expenditure"
                customCss={"flex justify-start pl-4 "}
              >
                <div className="text-sm items-start py-1 capitalize">
                  <span className="flex items-center space-x-4">
                    {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                    <span>Allotment-wise Expenditure</span>
                  </span>
                </div>
              </SidebarElement>
            </SidebarExpand>

            <SidebarExpand text="Report Viewer" icon="fluent-mdl2:radio-bullet">
              <SidebarElement
                to="/check-balance-real-nominal"
                customCss={"flex justify-start pl-4 "}
              >
                <div className="text-sm items-start py-1 capitalize">
                  <span className="flex items-center space-x-4">
                    {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                    <span>Check Balance Real/Nominal</span>
                  </span>
                </div>
              </SidebarElement>

              <SidebarElement
                to="/month-closing-report"
                customCss={"flex justify-start pl-4 "}
              >
                <div className="text-sm items-start py-1 capitalize">
                  <span className="flex items-center space-x-4">
                    {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                    <span>Month Closing Report</span>
                  </span>
                </div>
              </SidebarElement>
            </SidebarExpand>
          </SidebarExpand>


          <SidebarExpand text="Transaction Query" icon="fluent-mdl2:query-list">

            <SidebarElement
              to="/real-account-cash-bank-treasury"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>Real Account – Cash/Bank/Treasury</span>
                </span>
              </div>
            </SidebarElement>

            <SidebarElement
              to="/nominal-account-description"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>Nominal Account</span>
                </span>
              </div>
            </SidebarElement>

            <SidebarElement
              to="/instrument-type-no"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>Instrument Type & No.</span>
                </span>
              </div>
            </SidebarElement>

            <SidebarElement
              to="/party-type-name"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>Party Type & Name</span>
                </span>
              </div>
            </SidebarElement>




          </SidebarExpand>


          <SidebarExpand text="Utility" icon="grommet-icons:services">
            {/* <Icon icon="grommet-icons:services" width="1rem" height="1rem"  style={{color: black}} /> */}
            <SidebarElement
              to="/monthly-accounting-closing"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>Monthly Account Closing</span>
                </span>
              </div>
            </SidebarElement>

            <SidebarElement
              to="/cheque-status_update"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>Cheque Status Update</span>
                </span>
              </div>
            </SidebarElement>

            <SidebarElement
              to="/list-of-users"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>List of Users</span>
                </span>
              </div>
            </SidebarElement>

            <SidebarElement
              to="/audit-trail"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>Audit Trail</span>
                </span>
              </div>
            </SidebarElement>

            <SidebarElement
              to="/system-administration"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>System Administration</span>
                </span>
              </div>
            </SidebarElement>

            <SidebarElement
              to="/cheque-status-as-per-pass-book"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>Cheque Status as per Pass Book</span>
                </span>
              </div>
            </SidebarElement>
            {userData?.ROLE === "1" ?
              <SidebarElement
                to="/unverify-pass-for-payment"
                customCss={"flex justify-start pl-4 "}
              >
                <div className="text-sm items-start py-1 capitalize">
                  <span className="flex items-center space-x-4">
                    {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                    <span>Unverify Pass for payment</span>
                  </span>
                </div>
              </SidebarElement> : ""}
          </SidebarExpand>

          <SidebarExpand text="Help" icon="material-symbols:help-center-outline-rounded">
            <SidebarElement
              to="/zp-ps-account-rule"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>ZP & PS Accounts Rule</span>
                </span>
              </div>
            </SidebarElement>

            <SidebarElement
              to="/gp-account-rule"
              customCss={"flex justify-start pl-4 "}
            >
              <div className="text-sm items-start py-1 capitalize">
                <span className="flex items-center space-x-4">
                  {/* <Icon icon={"streamline:manual-book"} className="text-xl" /> */}
                  <span>GP Accounts Rule</span>
                </span>
              </div>
            </SidebarElement>
          </SidebarExpand>

          {[20546, 7175, 5281, 7161, 7162, 7177, 7164, 22061, 22062, 22063].includes(Number(userData?.USER_INDEX)) && (
            <SidebarExpand text="Administrative Work" icon="material-symbols:help-center-outline-rounded">
              <SidebarElement
                to="/secure-work"
                customCss="flex justify-start pl-4"
              >
                <div className="text-sm items-start py-1 capitalize">
                  <span className="flex items-center space-x-4">
                    <span>Secure Work</span>
                  </span>
                </div>
              </SidebarElement>
            </SidebarExpand>
          )}



        </>}
    </div>
  );
};
