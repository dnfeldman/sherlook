import React from 'react'
import ReactDOM from 'react-dom'

import 'fixed-data-table-2/dist/fixed-data-table.css'
import './app.css'

import App from 'containers/App/App'

import {hashHistory} from 'react-router'
import makeRoutes from './routes'

const routes = makeRoutes();

const mountNode = document.querySelector('#root');
ReactDOM.render(
  <App history={hashHistory}
        routes={routes} />,
mountNode);
