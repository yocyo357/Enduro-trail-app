import React, { Component } from 'react'
import { render } from "react-dom";
import '../styles/navigation.css';
import { BrowserRouter as Router, Link, NavLink, Prompt } from 'react-router-dom';
import * as firebase from 'firebase';
import { config } from '../Firebase/index';
import Fire from '../config/fire';
import { GiExitDoor } from 'react-icons/gi';

if (!firebase.apps.length) {
    firebase.initializeApp(config())
}

var db = firebase.database().ref('Trails/');
var count = [];

class navigation extends Component { 

    state = {
        count: ''
    }

    componentDidMount(){
        count.length = 0;
        db.child('status').equalTo('pending').on("value", function(snapshot) {
            console.log("There are "+snapshot.numChildren()+" messages");

            var data = snapshot.numChildren
            count.push(data);
        })
    }

    handleLogout() {
        Fire.auth().signOut();
    }

    render() {
        return (
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">

                    <a className="navbar-brand" href="#">Enduro MTB PH</a>

                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/" exact activeStyle={{color: 'tomato', borderTop: '2px solid tomato', borderBottom: '2px solid tomato', padding: '2px 0'}}>Home</NavLink>
                        </li>

                        {/* <li className="nav-item">
                            <NavLink className="nav-link" to="/postraces" exact activeStyle={{color: 'tomato', borderTop: '2px solid tomato', borderBottom: '2px solid tomato', padding: '2px 0'}}>Add New Post</NavLink>
                        </li> */}

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/suggestionsbox" exact activeStyle={{color: 'tomato', borderTop: '2px solid tomato', borderBottom: '2px solid tomato', padding: '2px 0'}}>New Suggestions<span class="badge badge-light">{count}</span></NavLink>
                        </li>
                        <hr />
                    </ul>
                </div>
                <i className='logout' onClick={this.handleLogout}><GiExitDoor  style={{color: 'tomato', fontSize: '29px', float: 'right'}} /></i>
            </nav>
        );
    }
}

export default navigation;