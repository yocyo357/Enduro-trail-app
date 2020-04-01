import React, { Component, useState } from 'react'
import { render } from "react-dom";
import firebase, { storage } from 'firebase';
import { config } from '../Firebase/index';
import '../styles/postRaces.css';
import { Prompt } from 'react-router-dom';
import { LinkedCalendar } from 'rb-datepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';

import Select from 'react-select';

if (!firebase.apps.length) {
    firebase.initializeApp(config())
}

var db = firebase.database();
var refss = db.ref('Trails/').orderByChild('status').equalTo('approved');

var url = '';
var trailDatas = [];

const options = [
    { value: 'Under-20', label: 'U20' },
    { value: 'Under-30', label: 'U30' },
    { value: 'Under-40', label: 'U40' },
    { value: 'Under-50', label: 'U50' },
    { value: 'Free For All', label: 'FFA' },
    { value: 'Feminino', label: 'Feminino' },
    { value: 'Executives', label: 'Executive' },
    { value: 'Semi-Pro', label: 'Semi-Pro' },
    { value: 'Pros', label: 'Pros' }
    
  ]

  

class postraces extends Component {
    

    constructor(props) {
        super(props);

        var tempDate = new Date();
        var date = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate() + ' ' + tempDate.getHours() + ':' + tempDate.getMinutes();
        const currDate = date;

        this.state = {
            raceTitle: '',
            raceType: '',
            raceCategory: [],
            raceDate: '',
            raceNoOfStages: '1',
            raceInfo: '',
            noOfRiders: '',
            selectedFile: null,
            datePosted: currDate,
            url: '',
            loading: false,
            disabled: true,
            trailValues: [],
            trailID: ''

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
                raceNoOfStages: this.state.raceNoOfStages,
                raceInfo: this.state.raceInfo,
                noOfRiders: this.state.noOfRiders,
                imageURL: url,
                datePosted: this.state.datePosted,
                trailID: this.state.trailID,
                eventDate: this.state.raceDate,
                raceCaregory: [...this.state.raceCategory]


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
            loading: true,
            
        })

        if (this.state.raceTitle == "" || this.state.selectedFile == null || this.state.trailID == "") {
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

        if (event.target.value == 'Series') {
            this.setState({
                disabled: false,
                // raceNoOfStages: '1'
            })
        } else {
            this.setState({
                disabled: true,
                raceNoOfStages: '1'
            })
        }
    }

    handleRaceStagesChange = (event) => {
       
        this.setState({
            raceNoOfStages: event.target.value
        })
    }

    handleRaceCatChange = (event) => {
        this.setState({
            raceCategory: [...event]
        },function(){
            alert(this.state.raceCategory.length)
        })

        //kung i push nimo sa database inani pag pasa => raceCaregory: [...this.state.raceCategory]
        // alert(event[0].value)
        // console.log(event)
        // alert(event.target.value)
        // alert(event)
    }

    handleRaceAddressChange = (event) => {
        this.setState({
            // raceAddress: event.target.value,
            trailID: event.target.value
        })
        // alert(this.state.trailID)
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


    handleDateChange = (event) => {
        this.setState({ raceDate: event.target.value })
    }


    componentDidMount() {
        refss.on('value', snapshot => {
            let Datas = { ...snapshot.val() }
            this.setState({ trailValues: Datas })
        })
    }

    render() {
        const { loading } = this.state;
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
                                <label >Race Category:</label><br></br>
                                <Select
                                    closeMenuOnSelect={false}
                                    isMulti
                                    options={options}
                                    style={{backgroundColor: '#2E353B'}}
                                    // value={this.state.raceCategory} 
                                    onChange={this.handleRaceCatChange}
                                    
                                />
                                
                                

                                {/* <select className="form-control" isMulti id="exampleFormControlSelect1" value={this.state.raceCategory} onChange={this.handleRaceCatChange}   >
                                    <option>Under 20</option>
                                    <option>Under 30</option>
                                    <option>Under 40</option>
                                    <option>Under 50</option>
                                    <option>Free For All (FFA)</option>
                                    <option>Executive</option>
                                    <option>Semi-Pro</option>
                                    <option>Pros</option>
                                </select> */}

                                

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
                            <select className="form-control" id="exampleFormControlSelect1" value={this.state.trailID} onChange={this.handleRaceAddressChange}   >
                                {Object.keys(this.state.trailValues).map(igKey => {
                                    return (
                                        <option value={igKey}> {this.state.trailValues[igKey].trailTitle}</option>
                                    )
                                })}
                            </select>
                            <br />
                        </div>

                        <div className="col">
                            <label>Date of Event:</label>
                            <input type="date" id="exampleFormControlSelect1" value={this.state.raceDate} onChange={this.handleDateChange} style={{ width: '100%' }} />
                        </div>
                        <div className="col">
                            <label>Number of Perticipants:</label>
                            <input type="number" min='5' id="exampleFormControlSelect1" className="form-control txt-input" value={this.state.noOfRiders} onChange={this.handleRaceLimitChange} /><br />
                        </div>

                    </div>
                    <br />

                    <div className="row" style={{marginTop: '-5%'}}>

                        <div className="col">
                            <label>Add Description:</label>
                            <textarea className="form-control" id="exampleFormControlSelect1" placeholder="ex: Price" value={this.state.raceInfo} onChange={this.handleRaceInfoChange} rows="5" ></textarea>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col"></div>

                        <div className="col">
                            <button type="reset" className="btn btn-post" onClick={() => this.handleOnclickSubmit()} disabled={loading} style={{marginTop: '3%'}}>
                                {loading && <i className='fa fa-refresh fa-spin'></i>}
                                Post Now
                                </button>
                        </div>
                    </div>
                </form>
                <Prompt
                    when={this.state.raceTitle !== "" ||  this.state.raceInfo !== "" || this.state.noOfRiders !== ""}
                    message={(location) => {
                        return location.pathname.startsWith('/suggestionsbox' && '/') ? 'Not done posting yet. Are you sure? ' : true
                    }}
                />
            </div>
        );
    }
}

export default postraces;