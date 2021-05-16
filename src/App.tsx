import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';
import { TodosCatalog } from './Pages/TodosCatalog';

function App() {

  return (
    <BrowserRouter>
      <div className="container">
        <Switch>
          <Route component={TodosCatalog} path="/" exact />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
