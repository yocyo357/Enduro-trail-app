import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import * as firebase from 'firebase';
import { config } from '../Firebase/index';
import '../styles/suggestionbox.css';
import { render } from '@testing-library/react';

if (!firebase.apps.length) {
    firebase.initializeApp(config())
}

var db = firebase.database().ref('Trails/');
var trailDatas = [];

class suggestionbox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            requiredItem: 0,
            trailValues: [],
            data: [
                {
                    address: '',
                    distance: '',
                    difficulty: ''
                }
            ]
        };
    }

    componentDidMount() {
        db.on('value', this.gotData, this.errData);
    }

    gotData(data) {
        // console.log(data.val())
        trailDatas.length = 0;
        var trails = data.val()
        var keys = Object.keys(trails)

        for (var i = 0; i < keys.length; i++) {
            var k = keys[i]

            var newAddress = trails[k].address
            var newDistance = trails[k].distance
            var newDifficulty = trails[k].difficulty

            var data = { index: k, address: newAddress, distance: newDistance, difficulty: newDifficulty }
            trailDatas.push(data)
        }
        console.log(trailDatas)
    }

    errData(err) {
        console.log(err)
    }

    handleTableBtnCLicked(i){
        this.setState({
            requiredItem: i
        });

    }

    render() {

        const requiredItem = this.state.requiredItem;
        const addressItem = this.state.address;
        let modalData = trailDatas[requiredItem];

        return (
            <div className="suggestionBox-container">
                <h2 className="header-text-suggestion">New Trails?</h2>
                <div>
                    <div className="col-lg-12"></div>

                    <div>
                        <table class="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th scope="col" dataField='newAddress'>Address</th>
                                    <th scope="col">Trail Distance</th>
                                    <th scope="col">Difficulty</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>

                            {trailDatas.map(trail => {
                                return (
                                    <tr>
                                        <th scope="row">{trail.address}</th>
                                        <th scope="row">{trail.difficulty}</th>
                                        <th scope="row">{trail.distance}</th>
                                        <td><button className="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter" onClick={() => this.handleTableBtnCLicked(trail.index)}>click</button></td>
                                    </tr>
                                )
                            })}
                        </table>
                    </div>
                </div>

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
                                <label style={{color: 'black', marginRight: '15px', marginBottom: '15px'}}>Sent by:  </label><p className="modalData">{addressItem}</p>
                            </div>

                            <hr style={{width: '90%'}}/>

                            {/* <div className="row row-modal">
                                <label style={{color: 'black', marginRight: '88px'}}>Address:  </label><p className="modalData">{modalData.addressName}</p>
                            </div>  
                            
                            <div className="row row-modal">
                                <label style={{color: 'black', marginRight: '15px'}}>Map Coordinates:  </label><p className="modalData">{modalData.coordinates}</p>
                            </div>   */}
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

