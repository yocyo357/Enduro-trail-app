import React from 'react';
import logo from './logo.svg';
import './App.css';
import LogIn from './components/login';
import SignUp from './components/signup';
import Home from './components/home';
import Suggestion from './components/suggestionbox';
import PostRaces from './components/postraces';
import Navigation from './components/navigation';

import { BrowserRouter as Router, Link, Prompt } from 'react-router-dom';
import Route from 'react-router-dom/Route';



// function writeUserData(email, fname, lname) {

// }

function App() {

 
  return (
    <Router>
      <Navigation />

      <div className="MainHTMLBody">

        <Route path="/" exact strict render={
          ()=> {
            return( <Home /> )
            
            // <h1>Home</h1>
          }
        }/>

        <Route path="/postraces" exact strict render={
          ()=> {

            return ( <PostRaces /> )
            
            // <h1>POST</h1>
          }
        }/>

        <Route path="/suggestionsbox" exact strict render={
          ()=> {
            return( <Suggestion /> )
            // <h1>Suggestion</h1>
          }
        }/>

        
      </div>
    </Router>
  );
}

export default App;
