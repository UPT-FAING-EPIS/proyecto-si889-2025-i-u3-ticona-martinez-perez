// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from './hooks/useAuth';
// import Loading from './components/common/Loading/Loading';

// // Pages
// import Login from './pages/auth/Login/Login';
// import Register from './pages/auth/Register/Register';
// import Dashboard from './pages/dashboard/Dashboard/Dashboard';
// import Profile from './pages/dashboard/Profile/Profile';
// import Settings from './pages/dashboard/Settings/Settings';
// import DiagramView from './pages/dashboard/DiagramView/DiagramView';
// import HistoryView from './pages/dashboard/HistoryView/HistoryView';
// import CollaborationView from './pages/dashboard/CollaborationView/CollaborationView';
// import NotFound from './pages/NotFound/NotFound';

// // Layouts
// import DashboardLayout from './components/layout/DashboardLayout/DashboardLayout';
// import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';

// const App = () => {
//   const { isLoading } = useAuth();

//   if (isLoading) {
//     return <Loading />;
//   }

//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/" element={<Navigate to="/login" replace />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
      
//       {/* Protected Dashboard Routes */}
//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout />
//           </ProtectedRoute>
//         }
//       >
//         <Route index element={<Dashboard />} />
//         <Route path="profile" element={<Profile />} />
//         <Route path="settings" element={<Settings />} />
//         <Route path="diagrams" element={<DiagramView />} />
//         <Route path="history" element={<HistoryView />} />
//         <Route path="collaboration" element={<CollaborationView />} />
//       </Route>

//       {/* Legacy redirect */}
//       <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
      
//       {/* 404 */}
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// };

// export default App;





"use client"

import { useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./hooks/useAuth"
import Loading from "./components/common/Loading"
import { initGA, trackPageView } from "./utils/analytics"

// Pages
import Login from "./pages/auth/Login/Login"
import Register from "./pages/auth/Register/Register"
import Dashboard from "./pages/dashboard/Dashboard/Dashboard"
import UMLGenerator from "./pages/UMLGenerator/UMLGenerator"
import Profile from "./pages/dashboard/Profile/Profile"
import Settings from "./pages/dashboard/Settings/Settings"
import DiagramView from "./pages/dashboard/DiagramView/DiagramView"
import HistoryView from "./pages/dashboard/HistoryView/HistoryView"
import CollaborationView from "./pages/dashboard/CollaborationView/CollaborationView"
import ProjectView from "./pages/dashboard/ProjectView/ProjectView"
import NotFound from "./pages/NotFound/NotFound"

// Layouts
import DashboardLayout from "./components/layout/DashboardLayout/DashboardLayout"
import ProtectedRoute from "./components/common/ProtectedRoute/ProtectedRoute"

const App = () => {
  const { isLoading } = useAuth()

  // Inicializar Google Analytics
  useEffect(() => {
    initGA();
    trackPageView('/', 'UML Generator - Home');
  }, [])

  if (isLoading) {
    return <Loading />
  }

  // Temporalmente mostrar el componente de prueba
  // Comenta esta línea cuando confirmes que Tailwind funciona

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<UMLGenerator />} />
      <Route path="/uml-generator" element={<UMLGenerator />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="diagrams" element={<DiagramView />} />
        <Route path="history" element={<HistoryView />} />
        <Route path="collaboration" element={<CollaborationView />} />
      </Route>

      {/* Protected Project Routes */}
      <Route
        path="/proyecto/:projectId"
        element={
          <ProtectedRoute>
            <ProjectView />
          </ProtectedRoute>
        }
      />

      {/* Legacy redirect */}
      <Route path="/admin" element={<Navigate to="/dashboard" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
