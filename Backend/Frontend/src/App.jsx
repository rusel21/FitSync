import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./pages/user/RegisterPage";
import UserDashBoard from "./pages/user/UserDashBoard";
import Membership from "./pages/user/Membership";
import Payment from "./pages/user/Payment";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MemberManagement from "./pages/staff/MemberManagement";
import CheckInSystem from "./pages/staff/CheckInSystem";
import PaymentTracking from "./pages/staff/PaymentTracking";
import StaffProfile from "./pages/staff/StaffProfile";
import MembershipPlanManagement from "./pages/admin/MembershipPlanManagement";
import AttendanceLogs from "./pages/admin/AttendanceLogs";
import PaymentManagement from "./pages/admin/PaymentManagement";
import Analytics from "./pages/admin/Analytics";
import RoleManagement from "./pages/admin/RoleManagement";
import SystemSettings from "./pages/admin/SystemSetting";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/userdashboard" element={<UserDashBoard/>} />
        <Route path="/user/membership" element={<Membership/>}/>
        <Route path="/user/payment" element={<Payment/>}/>
        <Route path="/user/register" element={<RegisterPage/>}/>
        <Route path="/user/dashboard" element={<UserDashBoard/>}/>
        <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
        <Route path="/staff/profile" element={<StaffProfile/>}/>
        <Route path="/staff/checkinsystem" element={<CheckInSystem/>}/>
        <Route path ="/staff/paymenttracking" element = {<PaymentTracking/>}/>
        <Route path="/staff/membermanagement" element = {<MemberManagement/>}/>
        <Route path="/admin/membershipplanmanagement" element = {<MembershipPlanManagement/>}/>
        <Route path="/admin/membermanagement" element = {<MemberManagement/>}/>  
        <Route path="/admin/attendancelogs" element = {<AttendanceLogs/>}/>
        <Route path="/admin/paymentmanagement" element = {<PaymentManagement/>}/>
        <Route path="/admin/analytics" element = {<Analytics/>}/>
        <Route path="/admin/rolemanagement" element = {<RoleManagement/>}/>
        <Route path="/admin/systemsettings" element = {<SystemSettings/>}/>
      </Routes>
     
    </Router>
  );
}

export default App;
