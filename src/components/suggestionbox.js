import React, { Component } from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import '../styles/suggestionbox.css'

const suggestionbox =()=> {
    const suggestions = [
        {
            addressName: 'sample Address',
            coordinates: '7.07056 125.60861',
            imageURI: '',
            sender: 'Paul Dango '
        },
        {
            addressName: 'sample Address',
            coordinates: '7.07056 125.60861',
            imageURI: '',
            sender: 'Paul Dango '
        },
        {
            addressName: 'sample Address',
            coordinates: '7.07056 125.60861',
            imageURI: '',
            sender: 'Paul Dango '
        }
    ]

    const renderSuggestions = (suggestion, index) => {
        return(
            <tr key={index}>
                <td>{suggestion.addressName}</td>
                <td>{suggestion.coordinates}</td>
                <td>{suggestion.sender}</td>
                <td><button>View</button></td>
            </tr>
        )
    }
    
    return (
        <div className="suggestionBox-container container-fluid">
            <ReactBootstrap.Table className="table-suggestions" striped bordered hover variant="dark" >
                <thead>
                    <tr>
                    <th>Sugegsted Trail Address</th>
                    <th>Map Coordinates</th>
                    <th>Sender's Name</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {suggestions.map(renderSuggestions)}
                </tbody>
                </ReactBootstrap.Table>

                <div className="footer-suggestion"></div>
        </div>
    );
}

export default suggestionbox;