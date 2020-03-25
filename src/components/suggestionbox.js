import React, { Component } from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import '../styles/suggestionbox.css';
import { GiMagnifyingGlass } from 'react-icons/gi';
import firebase, { storage } from 'firebase';
import { config } from '../Firebase/index';

if (!firebase.apps.length) {
    firebase.initializeApp(config())
}

class suggestionbox extends Component {
    
    constructor(props) {
        super(props);

       

        this.state = {
            requiredItem: 0,
            filterTable: '',
            suggestions: [
                {
                    addressName: '',
                    coordinates: '',
                    imageURI: '',
                    sender: ''
                },
               
            ]
        }
    }

    componentDidMount() {
        var database = firebase.database();
        var ref = database.ref('post_races');
       
        ref.on("child_added", function(snapshot) {
            var newSuggestion = snapshot.val();
            console.log("Author: " + newSuggestion.raceTitle);

            

          }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
          });
    }

    

    showClickeRow(index){
        this.setState({
            requiredItem: index
        });
    }

    render() {

        
       
        const requiredItem = this.state.requiredItem;
        const suggestions = this.state.suggestions.map((suggest, index) =>{
            return(
                <tr key={index}>
                    <td>{suggest.addressName}</td>
                    <td>{suggest.coordinates}</td>
                    <td>{suggest.sender}</td>
                    <td><button className="btn btn-view" data-toggle="modal" data-target="#exampleModalCenter" onClick={()=> this.showClickeRow(index)}><GiMagnifyingGlass /></button></td>
                </tr>
            )
        }) 

        
        let modalData = this.state.suggestions[requiredItem];

        return (
            <div className="suggestionBox-container">
                <h2 className="header-text-suggestion">New Trails?</h2>
                <ReactBootstrap.Table className="table-suggestions" striped bordered hover variant="dark" >
                    {/* <input type="text" onChange={this.handleSearch}/> */}
                    <thead>
                        <tr>
                        <th style={{textDecoration: 'underline'}}>Sugegsted Trail Address</th>
                        <th style={{textDecoration: 'underline'}}>Map Coordinates</th>
                        <th style={{textDecoration: 'underline'}}>Sender's Name</th>
                        <th style={{textDecoration: 'underline'}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suggestions}
                    </tbody>
                    </ReactBootstrap.Table>

                    {/* <MDBDataTable
                        striped
                        bordered
                        hover
                        data={this.state.suggestions}
                    /> */}

                {/* ********************* Modal Area********************** */}

                <div className="modal fade" id="exampleModalCenter" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Modal title</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body modal-body-suggestion" >
                            <div className="row row-modal">
                                <label style={{color: 'black', marginRight: '15px', marginBottom: '15px'}}>Sent by:  </label><p className="modalData">{modalData.sender}</p>
                            </div>

                            <hr style={{width: '90%'}}/>

                            <div className="row row-modal">
                                <label style={{color: 'black', marginRight: '88px'}}>Address:  </label><p className="modalData">{modalData.addressName}</p>
                            </div>  
                            
                            <div className="row row-modal">
                                <label style={{color: 'black', marginRight: '15px'}}>Map Coordinates:  </label><p className="modalData">{modalData.coordinates}</p>
                            </div>  
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-view">Save changes</button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default suggestionbox;

