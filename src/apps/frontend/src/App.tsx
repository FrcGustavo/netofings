import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthRoutes } from './modules/auth/routes'
import { AgentRoutes } from './modules/agents/routes'
import { ProtectedRoute } from './modules/auth/components/ProtectedRoute'
import { useAuthStore } from './modules/auth/hooks'
import { useLocation } from 'react-router-dom'
import { IconButton, Typography, Box } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import './App.css'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  const { pathname } = useLocation();
  const { user, logout } = useAuthStore();
  
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <div className="app-shell">
      {!isAuthPage && (
        <header className="app-header">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, width: '100%', height: '100%' }}>
            <Typography variant="h6" component="h1">
              Netofings Dashboard
            </Typography>
            {user && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2">{user.email}</Typography>
                <IconButton color="inherit" onClick={logout} title="Logout">
                  <LogoutIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        </header>
      )}

      <main className={isAuthPage ? "auth-main" : "app-main"}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            {AgentRoutes}
          </Route>
          {AuthRoutes}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
