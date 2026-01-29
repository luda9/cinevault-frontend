import { Routes, Route } from 'react-router-dom'
import './App.css'

import Index from './pages/Index'
import WatchlistPage from './pages/WatchlistPage'
import ComparePage from './pages/ComparePage'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Index />} />
      <Route path='/watchlist' element={<WatchlistPage />} />
      <Route path='/compare' element={<ComparePage />} />
    </Routes>
  )
}

export default App
