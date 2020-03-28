import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import * as firebase from 'firebase';
import { config } from '../Firebase/index';
import '../styles/suggestionbox.css';
import { render } from '@testing-library/react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import UniqueID from 'react-html-id';

if (!firebase.apps.length) {
    firebase.initializeApp(config())
}

var db = firebase.database();
var ref = db.ref('Trails/').orderByChild('status').equalTo('pending');


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
        ref.on('value', gotData, this.errData);
    

        function gotData(data) {
            // console.log(data.val())
            trailDatas.length = 0;
            var trails = data.val()
            
            
            if(trails != null){
                var keys = Object.keys(trails)
            
                for (var i = 0; i < keys.length; i++) {
                    var k = keys[i]

                    var newAddress = trails[k].address
                    var newDistance = trails[k].distance
                    var status = trails[k].status
                    var newDifficulty = trails[k].difficulty
                    var newUrl = trails[k].userimageurl
                    

                    var data = { index: k, address: newAddress, distance: newDistance, difficulty: newDifficulty, status: status, suggestImage: newUrl }
                    trailDatas.push(data)
                }
                // console.log(trailDatas)
            }
        }
    }

    errData(err) {
        console.log(err)
    }

    handleTableBtnApprovedCLicked(s, index) {
        db.ref('Trails/'+index+'/status').set(
            'approved'
        )

        alert(index)
        
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
                                    <th scope="col">Click the link to see pic</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>

                            {trailDatas.map(trail => {
                                return (
                                    <tr key={trail.index}>
                                        <th scope="row">{trail.address}</th>
                                        <th scope="row">{trail.difficulty}</th>
                                        <th scope="row">{trail.distance}</th>
                                        <th>
                                            <div className="row">
                                                <div className="col"><span onClick={()=>this.handleTableBtnApprovedCLicked(trail.status, trail.index) }><FaThumbsUp className="thumbs-up" p style={{size: '45px', color: '#6F952C'} }/></span></div>
                                                <div className="col"><span ><FaThumbsDown className="thumbs-down"  style={{size: '45px', color: '#F95B44'}}/></span></div>
                                            </div>
                                        </th>
                                    </tr>
                                )
                            })}
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default suggestionbox;

