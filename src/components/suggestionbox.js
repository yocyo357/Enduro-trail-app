import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import * as firebase from 'firebase';
import { config } from '../Firebase/index';
import '../styles/suggestionbox.css';
import { render } from '@testing-library/react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { GiMagnifyingGlass } from 'react-icons/gi'
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
            modalAddress: '',
            modalTrailImg: '',
            sender: '',

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
        ref.on('value', gotData, errData);
    

        function gotData(data) {
            // console.log(data.val())
            trailDatas.length = 0;
            var trails = data.val()
            
            if(trails != null){
                var keys = Object.keys(trails)
                for (var i = 0; i < keys.length; i++) {
                    var k = keys[i]

                    var newSender =  trails[k].firstname + " " + trails[k].lastname
                    var newAddress = trails[k].address
                    var newDistance = trails[k].distance * 1.6
                    var status = trails[k].status
                    var newDifficulty = trails[k].difficulty
                    var newUrl = trails[k].userimageuri
                    var newActivity = trails[k].activity
                    var newTrail = trails[k].trailTitle
                    
                    var data = { index: k, sender: newSender, trailTitle: newTrail, activity: newActivity, address: newAddress, distance: Math.round((newDistance + Number.EPSILON) * 100) / 100, difficulty: newDifficulty, status: status, suggestImage: newUrl }
                    trailDatas.push(data)
                }
                console.log(trailDatas)
            }
        }

        function errData(err) {
            console.log(err)
        }
    }

    handleApprove(index){
        // db.ref('Trails/'+index+'/status').set(
        //     'approved'
        // )
        // alert("gibasa japun")

    }

    handleTableBtnApprovedCLicked(s, index, trail) {
        this.setState({
            modalAddress: trail.address, 
            modalTrailImg: trail.suggestImage,
            sender: trail.sender,
            itemIndex: index
        })        
        // alert(this.state.modalTrailImg) trail.status, trail.index, trail.address, trail.suggestImage
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
                        <table className="table table-striped table-dark table-bordered">
                            <thead>
                                <tr style={{textAlign: 'center' }}>
                                    <th scope="col">Sender</th>
                                    <th scope="col">Trail Name</th>
                                    <th scope="col">Distance from Start to End</th>
                                    <th scope="col">Suggestion Status</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>

                            {trailDatas.map(trail => {
                                return (
                                    <tr key={trail.index}>
                                        <th scope="row" style={{ width: '20%', textAlign: 'center' }}>{trail.sender}</th>
                                        <th scope="row" style={{ width: '20%', textAlign: 'center' }}>{trail.trailTitle}</th>
                                        <th scope="row" style={{ width: '20%', textAlign: 'center' }}>{trail.distance}</th>
                                        <th scope="row" style={{ width: '20%', textAlign: 'center' }}>{trail.status}</th>
                                        
                                        <th style={{textAlign: 'center'}}><div className="col"><span onClick={()=>this.handleTableBtnApprovedCLicked(trail.status, trail.index, trail) }><GiMagnifyingGlass className="thumbs-up" p style={{size: '45px', color: '#6F952C'} } data-toggle="modal" data-target="#exampleModalLong"/></span></div>
                                            {/* <div className="row">
                                                <div className="col"><span onClick={()=>this.handleTableBtnApprovedCLicked(trail.status, trail.index, trail) }><FaThumbsUp className="thumbs-up" p style={{size: '45px', color: '#6F952C'} } data-toggle="modal" data-target="#exampleModalLong"/></span></div>
                                                <div className="col"><span ><FaThumbsDown className="thumbs-down"  style={{size: '45px', color: '#F95B44'}}/></span></div>
                                            
                                            </div> */}
                                        </th>
                                    </tr>
                                )
                            })}
                        </table>
                    </div>
                </div>

                {/* Modal Area */}
                <div className="modal fade" id="exampleModalLong" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Modal title</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className='row'>
                                <div className='col'>
                                    <h3>Trail Summary</h3>
                                    <div className='row'>
                                        <label style={{color: 'black'}}>Sender: </label> <strong>{this.state.sender} </strong>
                                    </div>

                                    <div className='row'>
                                        <label style={{color: 'black'}}>Address:</label> {this.state.modalAddress}
                                    </div>
                                    
                                </div>
                                <div className='col'>
                                    < img src={this.state.modalTrailImg} style={{width: '100%', height: '100%'}}/>
                                </div>
                            </div>
                       
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={this.handleApprove(this.state.itemIndex)}>Approve Trail</button>
                            <button type="button" className="btn btn-danger" data-dismiss="modal">Disapprove</button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default suggestionbox;

