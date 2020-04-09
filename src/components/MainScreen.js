import React, { Component } from 'react';
import Home from './home';
import Suggestion from './suggestionbox';
import PostRaces from './postraces';
import Navigation from './navigation';
// import Footer from './components/footer';
import { BrowserRouter as Router, Link, Prompt } from 'react-router-dom';
import Route from 'react-router-dom/Route';

function mainScreen()  {
    return (
        <Router>
            <Navigation />

            <div className="MainHTMLBody">

                <Route path="/" exact strict render={
                    () => {
                        return (<Home />)

                        // <h1>Home</h1>
                    }
                } />

                <Route path="/suggestionsbox" exact strict render={
                    () => {
                        return (<Suggestion />)
                        // <h1>Suggestion</h1>
                    }
                } />

            </div>
            {/* <Footer /> */}
        </Router>
    )
}

export default mainScreen;