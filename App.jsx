// v1.1.0 - 132 oils
import { useState } from 'react'
import { FoldedBackground, BottomNav } from './components/layout/index.jsx'
import HomeScreen from './screens/HomeScreen'
import {
  EmotionWheelScreen,
  EmotionDetailScreen,
  OilLibraryScreen,
  OilDetailScreen,
  JournalScreen,
} from './screens/Screens'

export default function App() {
  const [screen, setScreen] = useState({ name: 'home' })

  function nav(name, params = {}) {
    setScreen({ name, ...params })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function renderScreen() {
    switch (screen.name) {
      case 'home':           return <HomeScreen nav={nav} />
      case 'emotions':       return <EmotionWheelScreen nav={nav} />
      case 'emotion-detail': return <EmotionDetailScreen id={screen.id} nav={nav} />
      case 'oils':           return <OilLibraryScreen nav={nav} />
      case 'oil-detail':     return <OilDetailScreen id={screen.id} nav={nav} />
      case 'journal':        return <JournalScreen />
      default:               return <HomeScreen nav={nav} />
    }
  }

  return (
    <div id="app-shell">
      <FoldedBackground />
      <main style={{ position: 'relative', zIndex: 1 }}>
        {renderScreen()}
      </main>
      <BottomNav current={screen.name} nav={nav} />
    </div>
  )
}
