import React, { Component } from 'react';
import './App.css';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import PassengerDashboard from './components/passenger_dashboard/PassengerDashboard';
import DriverDashboard from './components/driver_dashboard/DriverDashboard';
import RegisterUser from './components/Register_user/RegisterUser';
import Home from './components/home/Home';
import Login from './components/login/login';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div className="App">
        {/* HACK reload stiles to diferent view forceRefresh={true}*/}
        <BrowserRouter forceRefresh={true}>
          <Switch>
            <Route path='/' component={Home} exact ></Route>
            <Route path='/home' component={Home} exact ></Route>
            <Route path='/clientDashboard' component={PassengerDashboard} exact ></Route>
            <Route path='/shopDashboard' component={DriverDashboard} exact ></Route>
            <Route path='/RegisterUser' component={RegisterUser} exact ></Route>
            <Route path='/login' component={Login} exact ></Route>
            <Route path="*" component={Home} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
