import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import {
  ProtectedRoute,
  ProtectedRouteLogin,
} from "./components/ProtectedRoutes";
import Login from "./components/Login/LoginComponent";
import { MainView } from "./pages/MainView";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import FamDashboard from "./components/Dashboard/FamDashboard";
import EmpDashboard from "./components/Dashboard/EmpDashboard";

// Contexts
import { HeaderProvider } from "./context/HeaderContext";

function App() {
  const theme = createTheme({
    palette: {
      primary: { main: "#002169" },
      secondary: { main: "#e2e2e2" },
      accent: { main: "#b1b5c1" },
    },
    typography: {
      fontFamily: ["Montserrat", "sans-serif"].join(","),
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <AuthContextProvider>
          <HeaderProvider>
            <Routes>
              {/* Ruta de Login protegida */}
              <Route
                path="/login"
                element={
                  <ProtectedRouteLogin>
                    <Login />
                  </ProtectedRouteLogin>
                }
              />

              {/* Ruta principal protegida */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <MainView />
                  </ProtectedRoute>
                }
              >
                {/* TODO: Bug enrutamiento */}
                {/* Redirige a la vista correspondiente según el rol */}
                <Route path="emp-dashboard" element={<EmpDashboard />} />
                <Route path="fam-dashboard" element={<FamDashboard />} />
              </Route>

              {/* Cualquier otra ruta desconocida redirige a "/" */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </HeaderProvider>
        </AuthContextProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
