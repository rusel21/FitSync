import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
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
import RoleManagement from "./pages/admin/RoleManagement";
import SystemSettings from "./pages/admin/SystemSetting";
import AdminMemberManagement from "./pages/admin/AdminMemberManagement";
import StaffManagement from "./pages/admin/StaffManagement";
import StaffCommunications from "./pages/staff/StaffCommunications";
import StaffReports from "./pages/staff/StaffReports";
import EquipmentManagement from "./pages/staff/EquipmentMaintenance";
import StaffLogin from "./components/staff/StaffLogin";
import StaffRegister from "./components/StaffRegister";
import AdminLayout from "./pages/admin/AdminLayout";

// Protected Route Component for Staff
const StaffProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, staff } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated || !staff) {
    return <StaffLogin />;
  }
  
  return children;
};

// Protected Route Component for Admin
const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, staff } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated || !staff || staff.role !== 'Admin') {
    return <StaffLogin />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>  
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/staff/login" element={<StaffLogin />} />
                  {/* Admin Protected Routes */}
          <Route 
            path="/staff/register" 
            element={
              <AdminProtectedRoute>
                <StaffRegister/>
              </AdminProtectedRoute>
            }
          />
          
          {/* User Routes */}
          <Route path="/userdashboard" element={<UserDashBoard/>} />
          <Route path="/user/membership" element={<Membership/>}/>
          <Route path="/user/payment" element={<Payment/>}/>
          <Route path="/user/register" element={<RegisterPage/>}/>
          <Route path="/user/dashboard" element={<UserDashBoard/>}/>
          <Route path="/user/myprofile" element={<MyProfile/>}/>
          
          {/* Staff Protected Routes (Both Staff and Admin) */}
          <Route 
            path="/staff/profile" 
            element={
              <StaffProtectedRoute>
                <StaffProfile/>
              </StaffProtectedRoute>
            }
          />
          <Route 
            path="/staff/checkinsystem" 
            element={
              <StaffProtectedRoute>
                <CheckInSystem/>
              </StaffProtectedRoute>
            }
          />
          <Route 
            path="/staff/paymenttracking" 
            element={
              <StaffProtectedRoute>
                <PaymentTracking/>
              </StaffProtectedRoute>
            }
          />
          <Route 
            path="/staff/membermanagement" 
            element={
              <StaffProtectedRoute>
                <MemberManagement/>
              </StaffProtectedRoute>
            }
          />
          <Route 
            path="/staff/communications" 
            element={
              <StaffProtectedRoute>
                <StaffCommunications/>
              </StaffProtectedRoute>
            }
          />
          <Route 
            path="/staff/reports" 
            element={
              <StaffProtectedRoute>
                <StaffReports/>
              </StaffProtectedRoute>
            }
          />
          <Route 
            path="/staff/equipmentmanagement" 
            element={
              <StaffProtectedRoute>
                <EquipmentManagement/>
              </StaffProtectedRoute>
            }
          />
          
          {/* Admin Protected Routes (Admin only) */}
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminDashboard/>
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route 
            path="/admin/membershipplanmanagement" 
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <MembershipPlanManagement/>
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route 
            path="/admin/attendancelogs" 
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AttendanceLogs/>
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route 
            path="/admin/analytics" 
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <Analytics/>
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route 
            path="/admin/rolemanagement" 
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <RoleManagement/>
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route 
            path="/admin/systemsettings" 
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <SystemSettings/>
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route 
            path="/admin/adminmembermanagement" 
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminMemberManagement/>
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route 
            path="/admin/staffmanagement" 
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <StaffManagement/>
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;