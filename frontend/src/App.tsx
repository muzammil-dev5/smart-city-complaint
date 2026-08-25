import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import MainLayout from "./components/layout/MainLayout";
// import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./components/common/ProtectedRoute";
import RoleRoute from "./components/common/RoleRoute";
import Unauthorized from "./pages/Unauthorized";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import CreateComplaint from "./pages/citizen/CreateComplaint/CreateComplaint";
import OfficerDashboard from "./pages/officer/OfficerDashboard";
import WorkerDashboard from "./pages/worker/WorkerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MyComplaints from "./pages/citizen/MyComplaints";
import ComplaintDetails from "./pages/citizen/ComplaintDetails";
import EditComplaint from "./pages/citizen/EditComplaint/EditComplaint";
import AdminComplaints from "./pages/admin/AdminComplaints";
import OfficerComplaintDetails from "./pages/officer/OfficerComplaintDetails";
import WorkerComplaints from "./pages/worker/WorkerComplaints";
import WorkerComplaintDetails from "./pages/worker/WorkerComplaintDetails";
import AdminDepartments from "./pages/department/AdminDepartments";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>


          {/* Citizen */}
          <Route element={<RoleRoute allowedRoles={["citizen"]} />}>
            <Route element={<MainLayout />}>
              <Route
                path="/citizen/dashboard"
                element={<CitizenDashboard />}
              />
              <Route
                path="/citizen/complaints/create"
                element={<CreateComplaint />}
              />

              <Route
                path="/citizen/complaints"
                element={<MyComplaints />}
              />

              <Route
                path="/citizen/complaints/:id/edit"
                element={<EditComplaint />}
              />

              <Route
                path="/citizen/complaints/:id"
                element={<ComplaintDetails />}
              />
            </Route>
          </Route>

          {/* Officer */}
          <Route element={<RoleRoute allowedRoles={["officer"]} />}>
            <Route element={<MainLayout />}>

              <Route
                path="/officer/dashboard"
                element={<OfficerDashboard />}
              />

              <Route
                path="/officer/complaints/:id"
                element={<OfficerComplaintDetails />}
              />

            </Route>
          </Route>

          {/* Worker */}
          <Route element={<RoleRoute allowedRoles={["worker"]} />}>
            <Route element={<MainLayout />}>
              <Route
                path="/worker/dashboard"
                element={<WorkerDashboard />}
              />
              <Route
                path="/worker/complaints"
                element={<WorkerComplaints />}
              />
              <Route
                path="/worker/complaint/:id"
                element={<WorkerComplaintDetails />}
              />
            </Route>
          </Route>

          {/* Admin */}
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route element={<MainLayout />}>
              <Route
                path="/admin/dashboard"
                element={<AdminDashboard />}
              />
            </Route>
            <Route
              path="/admin/complaints"
              element={<AdminComplaints />}
            />
            <Route
              path="/admin/departments"
              element={<AdminDepartments />}
            />
          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;