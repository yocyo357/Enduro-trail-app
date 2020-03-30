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
            loading: false,
            disabled: true,
            trailValues: []
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
                imageURL: url,
                

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

        if(event.target.value == 'Series'){
            this.setState({
                disabled: false
            })
        }else {
            this.setState({
                disabled: true
            })
           
        }
        
        console.log(this.state.disabled)
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
        refss.on('value', snapshot =>{
            let Datas = {...snapshot.val()}
            this.setState({trailValues: Datas})
        })
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
                            <label>Race Type:</label>
                            <select className="form-control" id="exampleFormControlSelect1" value={this.state.raceType} onChange={this.handleRaceTypeChange}   >
                                <option>Regular</option>
                                <option>Series</option>
                            </select>
                        </div>
                    </div>
                    <div className="col">
                        <label>Specify No. of series:</label>
                        <input type="text" id="exampleFormControlSelect1" disabled={this.state.disabled} className="form-control txt-input" value={this.state.raceNoOfStages} onChange={this.handleRaceStagesChange} /><br />
                        
                    </div>
                </div>

                <form>
                    <div className="row">
                        <div className="col">
                            <div className="form-group">
                                <label >Race Category:</label>

                                <select className="form-control" id="exampleFormControlSelect1" value={this.state.raceCategory} onChange={this.handleRaceCatChange}   >
                                <option>Under 20</option>
                                <option>Under 30</option>
                                <option>Under 40</option>
                                <option>Under 50</option>
                                <option>Free For All (FFA)</option>
                                <option>Executive</option>
                                <option>Semi-Pro</option>
                                <option>Pros</option>
                            </select>
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
                            <select className="form-control" id="exampleFormControlSelect1" value={this.state.raceAddress} onChange={this.handleRaceAddressChange}   >
                                {Object.keys(this.state.trailValues).map(igKey => {
                                    return (
                                    <option> {this.state.trailValues[igKey].trailTitle}</option>
                                    )
                                })}
                            </select>
                            <br />
                            {/* <label>Specify No. of stages:</label>
                            <input type="text" id="exampleFormControlSelect1" className="form-control txt-input" value={this.state.raceNoOfStages} onChange={this.handleRaceStagesChange} /><br /> */}
                        </div>

                        <div className="col">
                            <label>Add Description:</label>
                            <textarea className="form-control" id="exampleFormControlSelect1"  value={this.state.raceInfo} onChange={this.handleRaceInfoChange} rows="5"></textarea>
                        </div>
                    </div>
                    <br />

                    <div className="row">

                        <div className="col">
                        </div>
                        <div className="col"></div>
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