import { type JSX } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { AppLayout } from './components/layout/AppLayout'
import { LandingPage } from './components/layout/LandingPage'
import { MainPage } from './pages/MainPage'
import { ConversationPage } from './pages/ConversationPage'
import { SettingsPage } from './pages/SettingsPage'

const App = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<MainPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route
          path=":id_db/conversations/:id_conversation"
          element={<ConversationPage />}
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
