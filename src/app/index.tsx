import React from 'react'
import { createRoot } from 'react-dom/client';
import App from './App'
import { ApiProvider } from '../api'

import { config } from './config'

import 'bootstrap/dist/css/bootstrap.min.css'

const token = config.apiToken

const domRoot = document.getElementById('root');
const root = createRoot(domRoot!);

root.render(
  <React.StrictMode>
    <ApiProvider
      url={config.apiUrl}
      token={config.apiToken}
    >
      <App />
    </ApiProvider>
  </React.StrictMode>
)
