import React, { Component } from 'react';
import './App.css';
import LogIn from './components/login';
import SignUp from './components/signup';
import Home from './components/home';
import Suggestion from './components/suggestionbox';
import Main from './components/MainScreen';
import PostRaces from './components/postraces';
import Navigation from './components/navigation';
import Footer from './components/footer';
import { BrowserRouter as Router, Link, Prompt } from 'react-router-dom';
import Route from 'react-router-dom/Route';
import Fire from './config/fire';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
    }
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    Fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      } else {
        this.setState({ user: null });
      }
    })
  }

  render(){
    return(
      <div>
        {this.state.user ? (<Main />) : (<LogIn />)}
      </div>
    )
  }

}



export default App;
