import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { InvoicesList } from './screens/InvoicesList/InvoicesList'
import { InvoiceShow } from './screens/InvoiceShow/InvoiceShow'
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
