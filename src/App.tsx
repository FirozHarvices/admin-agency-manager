import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./app/queryClient";
import { AppLayout } from "./components/layout/AppLayout";
import { PublicRoute } from "./features/auth/components/PublicRoute";
import { ProtectedRoute } from "./features/auth/components/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { Toaster } from "react-hot-toast";
import UserMasterPage from "./pages/UserMasterPage";
import AgencyTable from "./features/UserMaster/components/AgencyTable";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Route: /login */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Nested Routes inside Protected Layout */}
            <Route index element={<div>Dashboard Page</div>} />
            <Route path="billing-plan" element={<div>Billing Plan</div>} />
            <Route path="user-master" element={<AgencyTable />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#363636",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
