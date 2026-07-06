import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoadingScreen } from './components/ui/LoadingScreen';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const HabitLoggerPage = lazy(() => import('./pages/HabitLoggerPage'));
const SuggestionsPage = lazy(() => import('./pages/SuggestionsPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const BadgesPage = lazy(() => import('./pages/BadgesPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingScreen />}>
        <motion.div className="min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/logger" element={<ProtectedRoute><HabitLoggerPage /></ProtectedRoute>} />
            <Route path="/suggestions" element={<ProtectedRoute><SuggestionsPage /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
            <Route path="/badges" element={<ProtectedRoute><BadgesPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </motion.div>
      </Suspense>
    </AnimatePresence>
  );
}
