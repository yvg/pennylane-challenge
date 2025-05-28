import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { InvoicesList } from './components/InvoicesList/InvoicesList'
import InvoiceShow from './components/InvoiceShow'
import './App.css'

// import GettingStarted from './GettingStarted'

function App() {
  return (
    <div className="px-3 py-3">
      {/* <GettingStarted /> */}
      <Router>
        <Routes>
          <Route path="/invoice/:id" Component={InvoiceShow} />
          <Route path="/" Component={InvoicesList} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
