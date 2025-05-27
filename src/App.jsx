import { useState } from 'react'
import './App.css'
import UploadPage from './pages/UploadPage'
import DisplayPage from './pages/DisplayPage'
import AdminPage from './pages/AdminPage'
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/display" element={<DisplayPage />} />
        <Route path="/" element={<UploadPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
