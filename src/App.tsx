import { Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "./pages/auth/login-page";
import ProtectedRoute from "./components/protected-route";
import DashboardPage from "./pages/dashboard/dashboard-page";
import VotingPage from "./pages/voting/voting-page";
import PengajuanPage from "./pages/pengajuan/pengajuan-page";
import AdminDashboardPage from "./pages/admin/admin-dashboard-page";
import AdminPengajuanPage from "./pages/admin/admin-pengajuan-page";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
            element={<DashboardPage />}
          />
        <Route 
             path="/pengajuan"
            element={<PengajuanPage />}
          />
       <Route
  path="/voting"
  element={<VotingPage />}
/>
       <Route
  path="/admin"
  element={<AdminDashboardPage />}
/>

<Route
  path="/admin/pengajuan"
  element={<AdminPengajuanPage />}
/>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;