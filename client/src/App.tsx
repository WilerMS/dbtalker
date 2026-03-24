import { type JSX } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { AppLayout } from './components/layout/AppLayout'
import { LandingPage } from './components/layout/LandingPage'
import { MainPage } from './pages/MainPage'
import { SettingsPage } from './pages/SettingsPage'
import { DatabaseRoute } from './routes/DatabaseRoute'

const App = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing" element={<Navigate to="/" replace />} />
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<MainPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path=":id_db" element={<DatabaseRoute />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
