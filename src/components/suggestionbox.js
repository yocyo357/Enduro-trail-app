import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import * as firebase from 'firebase';
import { config } from '../Firebase/index';
import '../styles/suggestionbox.css';
import { render } from '@testing-library/react';

if (!firebase.apps.length) {
    firebase.initializeApp(config())
}

var database = firebase.database();
var ref = database.ref('post_races/');

class suggestionbox extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
          text:'',
          trails: []
        };
    
       this.userRef = database.ref('post_races/');
      }
    
      componentDidMount() {
        this.userRef.on('value', this.gotData, this.errData); 
      }
    
    
      gotData = (data) => {
        let newTrails = []
        const userdata = data.val();
        const keys = Object.keys(userdata);
        for (let i = 0; i < keys.length; i++) {
          const k = keys[i];
          newTrails.push({
            address: userdata[k].raceAddress, 
            coordinates: userdata[k].raceCategory, 
            sender: userdata[k].raceTitle,
            action: `return (<button></button>)`
          });
        }
        this.setState({trails: newTrails});
      }
    
      errData = (err) => {
       console.log(err);
     }
    
    //   handleClick = (rowKey) => {
    //     alert(this.refs.table.getPageByRowKey(rowKey));
    //   }

    // showClickeRow(index){
    //     this.setState({
    //         requiredItem: index
    //     });
    // }

    render() {

        // const requiredItem = this.state.requiredItem;
        
        // let modalData = this.state.suggestions[requiredItem];

        return (
            <div className="suggestionBox-container">
                <h2 className="header-text-suggestion">New Trails?</h2>
                <div>
                    <div className="col-lg-12">
                </div>
                    <BootstrapTable  
                        className="table-hover table-suggestions"
                        ref='table'
                        data={ this.state.trails }
                        pagination={ true }
                        search={ true }>
                    <TableHeaderColumn dataField='address' isKey={true} dataSort={true}>Address</TableHeaderColumn>
                        <TableHeaderColumn dataField='coordinates' dataSort={true}>Map Coordinates</TableHeaderColumn>
                        <TableHeaderColumn dataField='sender'>Sender</TableHeaderColumn>
                        <TableHeaderColumn  dataField='action'>Actions</TableHeaderColumn>
                    </BootstrapTable>
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
                            {/* <div className="row row-modal">
                                <label style={{color: 'black', marginRight: '15px', marginBottom: '15px'}}>Sent by:  </label><p className="modalData">{modalData.sender}</p>
                            </div>

                            <hr style={{width: '90%'}}/>

                            <div className="row row-modal">
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

