import type { JSX } from 'react'

import { AppLayout } from './components/layout/AppLayout'
import { useChat } from './hooks/useChat'

const App = (): JSX.Element => {
  const chat = useChat()

  return <AppLayout {...chat} />
}

export default App
