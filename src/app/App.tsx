import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { InvoicesListScreen } from './screens/InvoicesList/InvoicesList.screen'
import { InvoiceShowScreen } from './screens/InvoiceShow/InvoiceShow.screen'
import './App.css'
// import GettingStarted from './GettingStarted'

function App() {
  return (
    <div className="px-3 py-3">
      {/* <GettingStarted /> */}
      <Router>
        <Routes>
          <Route path="/invoice/:id" Component={InvoiceShowScreen} />
          <Route path="/" Component={InvoicesListScreen} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
