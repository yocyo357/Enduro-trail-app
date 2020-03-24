import React from 'react';
import logo from './logo.svg';
import './App.css';
import LogIn from './components/login';
import SignUp from './components/signup';
import PostRaces from './components/postraces';
import Navigation from './components/navigation';

function writeUserData(email, fname, lname) {

}

function App() {

 
  return (
    <div className="MainHTMLBody">
      <Navigation />
      <PostRaces />
    </div>
  );
}

export default App;
