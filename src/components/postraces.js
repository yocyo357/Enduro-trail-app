import React, { Component } from 'react'
import { render } from "react-dom";
import firebase, { storage } from 'firebase';
import { config } from '../Firebase/index';
import '../styles/postRaces.css';
import { Prompt } from 'react-router-dom';

if (!firebase.apps.length) {
    firebase.initializeApp(config())
}
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
            datePosted: new Date()
        };
    }

   handleOnclickSubmit = (event) => {
    //    console.log(this.state.datePosted + "Date ni karon");
       
        if(this.state.raceTitle == "" & this.state.selectedFile == null){
            alert("Missing");
        }else {
            var imageURI = this.state.selectedFile.name
            var datePosted = this.state.datePosted
            // push og data to firebase********************
            firebase.database().ref('post_races/').push({
                //mga paramerter ni sya dre
                raceTitle: this.state.raceTitle,  
                raceType: this.state.raceType,
                raceCategory: this.state.raceCategory,
                raceAddress: this.state.raceAddress,
                raceNoOfStages: this.state.raceNoOfStages,
                raceInfo: this.state.raceInfo,
                noOfRiders: this.state.noOfRiders,
                imageURI

            }).then((data)=>{
                //success callback
                console.log('data ' , data)
            }).catch((error)=>{
                //error callback
                console.log('error ' , error)
            })

            // upload picture********************
            const { selectedFile } = this.state
            const uploadTask = firebase.storage().ref(`images/${selectedFile.name}`).put(selectedFile)
            uploadTask.on('state_changed',
                (error) => {
                    console.log(error)
                },
    
                //getPicture
                () => {
                    firebase.storage().ref('images').child(selectedFile.name).getDownloadURL().then(url => {
                        console.log(url)
                    })
                })
    
        }
        // this.setState({raceTitle: null});
        

    }

    //Event handlers**********
    handleTitleChange=(event)=>{
        this.setState({
            raceTitle: event.target.value,
           
        })

        // console.log(this.state.raceTitle);
    }

    handleRaceTypeChange=(event)=>{
        this.setState({
            raceType: event.target.value
           
        })
    }

    handleRaceCatChange=(event)=>{
        this.setState({
            raceCategory: event.target.value
        })
    }

    handleRaceAddressChange=(event)=>{
        this.setState({
            raceAddress: event.target.value
        })
    }

    handleRaceStagesChange=(event)=>{
        this.setState({ 
            raceNoOfStages: event.target.value
        })
    }

    handleRaceInfoChange=(event)=>{
        this.setState({
            raceInfo: event.target.value
        })
    }

    handleRaceLimitChange=(event)=>{
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
        // this.writeUserData('asdas','asdasd','asdasd')
    }

    render() {
        return (
            <div className="postRaces_container container-fluid">
                <h2 className="header-text">Ready to Post?</h2>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className="form-group">
                                <label for="exampleFormControlInput1">Event Name:</label>
                                <input id="exampleFormControlSelect1" type="text" value={this.state.raceTitle}  onChange={this.handleTitleChange} className="form-control txt-input" placeholder="Add event's name here" />
                            </div>
                        </div>

                        <div className="col">
                            <div class="form-group">
                                <label for="exampleFormControlSelect1">Type of Race:</label>
                                <select class="form-control" id="exampleFormControlSelect1" value={this.state.raceType}  onChange={this.handleRaceTypeChange}   >
                                    <option>Group Race</option>
                                    <option>Dirt Race (Individual)</option>
                                    <option>Dirt Race (Groups)</option>
                                    <option>Drag Race</option>
                                    <option>Endurance Race</option>
                                </select>
                            </div>
                        </div>

                        {/* <div className="col">
                            <div className="form-group">
                                
                            </div>
                        </div> */}
                    </div>

                    <div className="row">
                        <div className="col">
                            <div className="form-group">
                            <label for="exampleFormControlInput1">Race Category:</label>
                             <input id="exampleFormControlSelect1" type="text" value={this.state.raceCategory}  onChange={this.handleRaceCatChange} className="form-control txt-input" placeholder="Add event's name here" />
                            </div>
                        </div>

                        <div className="col">
                            <div className="form-group">
                                <label>Add a Banner:</label><br />
                                <input type="file" className="fileUpload" onChange={this.fileSelectedHandler}/>
                                
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <label>Venue/Trail address:</label>
                            {/* <input type="text" value={this.state.raceAddress}  onChange={this.handleRaceAddressChange} className="form-control txt-input" placeholder="Add event's name here"/><br/> */}
                            <select  className="form-control" id="exampleFormControlSelect1" value={this.state.raceAddress}  onChange={this.handleRaceAddressChange}   >
                                <option> Carabao Trail</option>
                                <option> Devil's Trail</option>
                                <option> Happy Ka</option>
                                <option> AKStorga DH</option>
                                <option> Tingle Bell DH Track</option>
                            </select>
                        </div>

                        <div className="col">
                            <label>Add Description:</label>
                            <textarea className="form-control" id="exampleFormControlSelect1" value={this.state.raceInfo}  onChange={this.handleRaceInfoChange} rows="4"></textarea>
                        </div>
                    </div>
                    <br />

                    <div className="row">
                        <div className="col">
                            <label>Specify No. of stages:</label>
                            <input type="text" id="exampleFormControlSelect1" className="form-control txt-input" value={this.state.raceNoOfStages}  onChange={this.handleRaceStagesChange}/><br/>
                        </div>

                        <div className="col">
                            <label>Limit of riders:</label>
                            <input type="text" id="exampleFormControlSelect1" className="form-control txt-input" value={this.state.noOfRiders}  onChange={this.handleRaceLimitChange}/><br/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">

                        </div>

                        <div className="col">
                            <button type="button" class="btn btn-post" onClick={() => this.handleOnclickSubmit()}>Post Now</button>
                        </div>
                    </div>
                </div>
                <Prompt 
                    when={ this.state.raceTitle !== "" ||  this.state.raceCategory !== "" || this.state.raceInfo !== "" || this.state.raceNoOfStages !== "" || this.state.noOfRiders !== ""}
                    message={(location) => {
                        return location.pathname.startsWith('/suggestionsbox' && '/') ? 'Not done posting yet. Are you sure? ' : true
                    }}
                />
            </div>
        );
    }
}

export default postraces;