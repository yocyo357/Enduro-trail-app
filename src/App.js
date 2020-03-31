import React from 'react';
import logo from './logo.svg';
import './App.css';
import LogIn from './components/login';
import SignUp from './components/signup';
import Home from './components/home';
import Suggestion from './components/suggestionbox';
import PostRaces from './components/postraces';
import Navigation from './components/navigation';
import Footer from './components/footer';
import { BrowserRouter as Router, Link, Prompt } from 'react-router-dom';
import Route from 'react-router-dom/Route';

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

        <Route path="/suggestionsbox" exact strict render={
          ()=> {
            return( <Suggestion /> )
            // <h1>Suggestion</h1>
          }
        }/>

        {/* <LogIn /> */}

        
      </div>

      <Footer />
    </Router>
  );
}

export default App;
