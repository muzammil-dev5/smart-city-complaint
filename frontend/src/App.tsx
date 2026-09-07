import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";

import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";

import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import RoleRoute from "./components/common/RoleRoute";
import Unauthorized from "./pages/Unauthorized";

// Citizen
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import CreateComplaint from "./pages/citizen/CreateComplaint";
import MyComplaints from "./pages/citizen/MyComplaints";
import ComplaintDetails from "./pages/citizen/ComplaintDetails";
import EditComplaint from "./pages/citizen/EditComplaint";

// Officer
import OfficerDashboard from "./pages/officer/OfficerDashboard";
import OfficerComplaintDetails from "./pages/officer/OfficerComplaintDetails";

// Worker
import WorkerDashboard from "./pages/worker/WorkerDashboard";
import WorkerComplaints from "./pages/worker/WorkerComplaints";
import WorkerComplaintDetails from "./pages/worker/WorkerComplaintDetails";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminDepartments from "./pages/department/AdminDepartments";
import AdminFeedback from "./pages/admin/AdminFeedback";
import Reports from "./pages/admin/Reports";

// Profile
import Profile from "./pages/Profile/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        {/* Root URL → Login */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />


        {/* ================= PROTECTED ROUTES ================= */}

        <Route element={<ProtectedRoute />}>

          {/* ================= PROFILE ================= */}

          <Route element={<MainLayout />}>
            <Route
              path="/profile"
              element={<Profile />}
            />
          </Route>


          {/* ================= CITIZEN ================= */}

          <Route
            element={
              <RoleRoute allowedRoles={["citizen"]} />
            }
          >
            <Route element={<MainLayout />}>

              <Route
                path="/citizen/dashboard"
                element={<CitizenDashboard />}
              />

              <Route
                path="/citizen/complaints"
                element={<MyComplaints />}
              />

              <Route
                path="/citizen/complaints/create"
                element={<CreateComplaint />}
              />

              <Route
                path="/citizen/complaints/:id"
                element={<ComplaintDetails />}
              />

              <Route
                path="/citizen/complaints/:id/edit"
                element={<EditComplaint />}
              />

            </Route>
          </Route>


          {/* ================= OFFICER ================= */}

          <Route
            element={
              <RoleRoute allowedRoles={["officer"]} />
            }
          >
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


          {/* ================= WORKER ================= */}

          <Route
            element={
              <RoleRoute allowedRoles={["worker"]} />
            }
          >
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


          {/* ================= ADMIN ================= */}

          <Route
            element={
              <RoleRoute allowedRoles={["admin"]} />
            }
          >
            <Route element={<MainLayout />}>

              <Route
                path="/admin/dashboard"
                element={<AdminDashboard />}
              />

              <Route
                path="/admin/complaints"
                element={<AdminComplaints />}
              />

              <Route
                path="/admin/departments"
                element={<AdminDepartments />}
              />

              <Route
                path="/admin/feedback"
                element={<AdminFeedback />}
              />
              <Route
                path="/admin/reports"
                element={<Reports />} />

            </Route>
          </Route>

        </Route>


        {/* ================= FALLBACK ================= */}

        {/* Any unknown URL → Login */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
