import { type JSX } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

import { AppLayout } from './components/layout/AppLayout'
import { LandingPage } from './components/layout/LandingPage'
import { MainPage } from './pages/MainPage'
import { ConversationPage } from './pages/ConversationPage'
import { SettingsPage } from './pages/SettingsPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: ':id_db/conversations/:id_conversation',
        element: <ConversationPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

const App = (): JSX.Element => {
  return <RouterProvider router={router} />
}

export default App
