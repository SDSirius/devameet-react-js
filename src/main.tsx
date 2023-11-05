import React from 'react'
import ReactDOM from 'react-dom/client'
import { Login } from './views/Login.tsx'

import './assets/styles/global.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Login />
  </React.StrictMode>,
)
