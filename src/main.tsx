import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { InstantSearch } from 'react-instantsearch-hooks-web'
import { searchClient } from './firebase/firebase.config'

ReactDOM.render(
    <React.StrictMode>
        <AuthProvider>
            <InstantSearch searchClient={searchClient} indexName="instant_search">
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </InstantSearch>
        </AuthProvider>
    </React.StrictMode>,
    document.getElementById('root')
)
