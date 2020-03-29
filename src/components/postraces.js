import React, { Component } from 'react'
import { render } from "react-dom";
import firebase, { storage } from 'firebase';
import { config } from '../Firebase/index';
import '../styles/postRaces.css';
import { Prompt } from 'react-router-dom';

if (!firebase.apps.length) {
    firebase.initializeApp(config())
}

var db = firebase.database();
var refss = db.ref('Trails/').orderByChild('status').equalTo('approved');

var url = '';
var trailDatas = [];

class postraces extends Component {
    constructor(props) {
        super(props);

        this.state = {
            raceTitle: '',
            raceType: '',
            raceCategory: '',
            raceAddress: '',
            raceNoOfStages: '',
            raceInfo: '',
            noOfRiders: '',
            selectedFile: null,
            url: '',
            datePosted: new Date(),
            loading: false
        };
    }

    async uploadImage(selectedFile) {
        var ref = firebase.storage().ref().child('image/' + (Date.now() + Math.floor(Math.random() * 1000)))
        ref.put(selectedFile).then(async (snapshot) => {
            url = await ref.getDownloadURL();
            firebase.database().ref('post_races/').push({
                //mga paramerter ni sya dre
                raceTitle: this.state.raceTitle,
                raceType: this.state.raceType,
                raceCategory: this.state.raceCategory,
                raceAddress: this.state.raceAddress,
                raceNoOfStages: this.state.raceNoOfStages,
                raceInfo: this.state.raceInfo,
                noOfRiders: this.state.noOfRiders,
                imageURL: url

            }).then((data) => {
                //success callback
                console.log('data ', data)
                alert("You Added New Scream.")
            }).catch((error) => {
                //error callback
                console.log('error ', error)
            })
        })
    }

    handleOnclickSubmit = (event) => {

        this.setState({
            loading: true
        })

        if (this.state.raceTitle == "" & this.state.selectedFile == null) {
            alert("Missing");
        } else {
            var imageURI = this.state.selectedFile.name
            var datePosted = this.state.datePosted
            // push og data to firebase********************

            const { selectedFile } = this.state
            this.uploadImage(selectedFile)
        }
    }

    //Event handlers**********
    handleTitleChange = (event) => {
        this.setState({
            raceTitle: event.target.value,

        })
    }

    handleRaceTypeChange = (event) => {
        this.setState({
            raceType: event.target.value

        })
    }

    handleRaceCatChange = (event) => {
        this.setState({
            raceCategory: event.target.value
        })
    }

    handleRaceAddressChange = (event) => {
        this.setState({
            raceAddress: event.target.value
        })
    }

    handleRaceStagesChange = (event) => {
        this.setState({
            raceNoOfStages: event.target.value
        })
    }

    handleRaceInfoChange = (event) => {
        this.setState({
            raceInfo: event.target.value
        })
    }

    handleRaceLimitChange = (event) => {
        this.setState({
            noOfRiders: event.target.value
        })
    }

    fileSelectedHandler = event => {
        this.setState({
            selectedFile: event.target.files[0]
        })

    }


    componentDidMount() {
        refss.on('value', gotData, errData);
    

        function gotData(data) {
            // console.log(data.val())
            trailDatas.length = 0;
            var trails = data.val()
            
            
            if(trails != null){
                var keys = Object.keys(trails)
            
                for (var i = 0; i < keys.length; i++) {
                    var k = keys[i]

                    var status = trails[k].status
                    var newTrail = trails[k].trailTitle
                    
                    var data = { status: status, trailName: newTrail }
                    trailDatas.push(data)
                }
                // console.log(trailDatas)
            }
        }

        function errData(err) {
            console.log(err)
        }
    }

    render() {
        const {loading} =this.state;
        return (
            <div className="postRaces_container container-fluid">
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label >Event Name:</label>
                            <input id="exampleFormControlSelect1" type="text" value={this.state.raceTitle} onChange={this.handleTitleChange} className="form-control txt-input" placeholder="Add event's name here" />
                        </div>
                    </div>

                    <div className="col">
                        <div className="form-group">
                            <label>Type of Race:</label>
                            <select className="form-control" id="exampleFormControlSelect1" value={this.state.raceType} onChange={this.handleRaceTypeChange}   >
                                <option>Group Race</option>
                                <option>Dirt Race (Individual)</option>
                                <option>Dirt Race (Groups)</option>
                                <option>Drag Race</option>
                                <option>Endurance Race</option>
                            </select>
                        </div>
                    </div>
                </div>

                <form>
                    <div className="row">
                        <div className="col">
                            <div className="form-group">
                                <label >Race Category:</label>
                                <input id="exampleFormControlSelect1" type="text" value={this.state.raceCategory} onChange={this.handleRaceCatChange} className="form-control txt-input" placeholder="Add event's name here" />
                            </div>
                        </div>

                        <div className="col">
                            <div className="form-group">
                                <label>Add a Banner:</label><br />
                                <input type="file" className="fileUpload" onChange={this.fileSelectedHandler} />

                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <label>Venue/Trail address:</label>
                            {/* <input type="text" value={this.state.raceAddress}  onChange={this.handleRaceAddressChange} className="form-control txt-input" placeholder="Add event's name here"/><br/> */}
                            
                            <select className="form-control" id="exampleFormControlSelect1" value={this.state.raceAddress} onChange={this.handleRaceAddressChange}   >
                                {trailDatas.map(trail => {
                                    return (
                                    <option> {trail.trailName}</option>
                                    )
                                })}
                            </select>
                        </div>

                        <div className="col">
                            <label>Add Description:</label>
                            <textarea className="form-control" id="exampleFormControlSelect1" value={this.state.raceInfo} onChange={this.handleRaceInfoChange} rows="4"></textarea>
                        </div>
                    </div>
                    <br />

                    <div className="row">
                        <div className="col">
                            <label>Specify No. of stages:</label>
                            <input type="text" id="exampleFormControlSelect1" className="form-control txt-input" value={this.state.raceNoOfStages} onChange={this.handleRaceStagesChange} /><br />
                        </div>

                        <div className="col">
                            <label>Limit of riders:</label>
                            <input type="text" id="exampleFormControlSelect1" className="form-control txt-input" value={this.state.noOfRiders} onChange={this.handleRaceLimitChange} /><br />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col"></div>

                        <div className="col">
                            <button type="reset" className="btn btn-post" onClick={() => this.handleOnclickSubmit()} disabled={loading}>
                                { loading && <i className='fa fa-refresh fa-spin'></i> }
                                Post Now
                                </button>
                        </div>
                    </div>
                </form>
                {/* </div>   */}

                <Prompt
                    when={this.state.raceTitle !== "" || this.state.raceCategory !== "" || this.state.raceInfo !== "" || this.state.raceNoOfStages !== "" || this.state.noOfRiders !== ""}
                    message={(location) => {
                        return location.pathname.startsWith('/suggestionsbox' && '/') ? 'Not done posting yet. Are you sure? ' : true
                    }}
                />
            </div>
        );
    }
}

export default postraces;