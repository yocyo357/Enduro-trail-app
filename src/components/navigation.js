import React, { Component } from 'react'
import { render } from "react-dom";
import '../styles/navigation.css';
import { BrowserRouter as Router, Link, NavLink, Prompt } from 'react-router-dom';


class navigation extends Component { 
    render() {
        return (
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

                    <a className="navbar-brand" href="#">ENDURO</a>

                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/" exact activeStyle={{color: 'tomato', borderTop: '2px solid tomato', borderBottom: '2px solid tomato', padding: '2px 0'}}>Home</NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/postraces" exact activeStyle={{color: 'tomato', borderTop: '2px solid tomato', borderBottom: '2px solid tomato', padding: '2px 0'}}>Add New Post</NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/suggestionsbox" exact activeStyle={{color: 'tomato', borderTop: '2px solid tomato', borderBottom: '2px solid tomato', padding: '2px 0'}}>New Suggestions</NavLink>
                        </li>
                        <hr />
                    </ul>

                    
                </div>
            </nav>
        );
    }
}

export default navigation;