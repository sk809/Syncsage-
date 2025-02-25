
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import SageBot from "./pages/SageBot";
import TodoList from "./pages/TodoList";
import Library from "./pages/Library";
import RelaxMode from "./pages/RelaxMode";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import { AppSidebar } from "./components/Sidebar/AppSidebar";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex w-full">
          <Routes>
            <Route path="/" element={null} />
            <Route path="/auth" element={null} />
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <AppSidebar />
                </ProtectedRoute>
              }
            />
          </Routes>

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sage-bot"
                element={
                  <ProtectedRoute>
                    <SageBot />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <TodoList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/library"
                element={
                  <ProtectedRoute>
                    <Library />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/collaboration"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/relax"
                element={
                  <ProtectedRoute>
                    <RelaxMode />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
