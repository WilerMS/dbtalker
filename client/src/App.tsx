import { type JSX } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

import { AppLayout } from './components/layout/AppLayout'
import { LandingPage } from './components/layout/LandingPage'
import { MainPage } from './pages/MainPage'
import { ConversationPage } from './pages/ConversationPage'
import { SettingsPage } from './pages/SettingsPage'

// 1. Creamos el enrutador de datos (Este es el que soporta View Transitions)
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
        index: true, // Esto equivale a tu <Route index />
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
    element: <Navigate to="/" replace />, // Catch-all 404
  },
])

const App = (): JSX.Element => {
  // 2. Usamos el RouterProvider en lugar de <Routes>
  return <RouterProvider router={router} />
}

export default App
