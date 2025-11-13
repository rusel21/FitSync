import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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
import MyProfile from "./pages/user/MyProfile";
import Analytics from "./pages/admin/Analytics";

import SystemSettings from "./pages/admin/SystemSetting";
import AdminMemberManagement from "./pages/admin/AdminMemberManagement";
import StaffManagement from "./pages/admin/StaffManagement";
import StaffCommunications from "./pages/staff/StaffCommunications";
import StaffReports from "./pages/staff/StaffReports";
import EquipmentManagement from "./pages/staff/EquipmentMaintenance";
import StaffLogin from "./components/staff/StaffLogin";
import StaffRegister from "./components/StaffRegister";
import AdminLayout from "./pages/admin/AdminLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
// Note:
// Move the protected route components to separate files or outside AuthProvider

function App() {
  return (
    <ErrorBoundary>
    <AuthProvider>
      <Router>
        <Routes>  
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/staff/login" element={<StaffLogin />} />
          
          {/* User Routes */}
          <Route path="/userdashboard" element={<UserDashBoard/>} />
          <Route path="/user/membership" element={<Membership/>}/>
          <Route path="/user/payment" element={<Payment/>}/>
          <Route path="/user/register" element={<RegisterPage/>}/>
          <Route path="/user/dashboard" element={<UserDashBoard/>}/>
          <Route path="/user/myprofile" element={<MyProfile/>}/>
        
<Route path="/forgot-password" element={<ForgotPasswordPage />} />
<Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Staff Routes - protection handled within components or layouts */}
          <Route path="/staff/profile" element={<StaffProfile/>} />
          <Route path="/staff/checkinsystem" element={<CheckInSystem/>} />
          <Route path="/staff/paymenttracking" element={<PaymentTracking/>} />
          <Route path="/staff/membermanagement" element={<MemberManagement/>} />
          <Route path="/staff/communications" element={<StaffCommunications/>} />
          <Route path="/staff/reports" element={<StaffReports/>} />
          <Route path="/staff/equipmentmanagement" element={<EquipmentManagement/>} />
          
          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminLayout>
                <AdminDashboard/>
              </AdminLayout>
            }
          />
          <Route 
            path="/admin/membershipplanmanagement" 
            element={
              <AdminLayout>
                <MembershipPlanManagement/>
              </AdminLayout>
            }
          />
          <Route 
            path="/admin/attendancelogs" 
            element={
              <AdminLayout>
                <AttendanceLogs/>
              </AdminLayout>
            }
          />
          <Route 
            path="/admin/analytics" 
            element={
              <AdminLayout>
                <Analytics/>
              </AdminLayout>
            }
          />
         
          
          <Route 
            path="/admin/systemsettings" 
            element={
              <AdminLayout>
                <SystemSettings/>
              </AdminLayout>
            }
          />
          <Route 
            path="/admin/adminmembermanagement" 
            element={
              <AdminLayout>
                <AdminMemberManagement/>
              </AdminLayout>
            }
          />
          <Route 
            path="/admin/staffmanagement" 
            element={
              <AdminLayout>
                <StaffManagement/>
              </AdminLayout>
            }
          />
          <Route 
            path="/staff/register" 
            element={
              <AdminLayout>
                <StaffRegister/>
              </AdminLayout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;