import React, { Component } from 'react'
import { render } from "react-dom";
import firebase, { storage } from 'firebase';
import { config } from '../Firebase/index';
import '../styles/postRaces.css';
// import Navbar from 'react-bootstrap/Navbar';
// import Nav from 'react-bootstrap/Nav';
// import Form from 'react-bootstrap/Form';
// import FormControl from 'react-bootstrap//FormControl';
// import Button from 'react-bootstrap/Button';

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
       console.log(this.state.datePosted + "Date ni karon");
       
        if(this.state.raceTitle == ""){
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
                imageURI,
                datePosted

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
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className="form-group">
                                <label for="exampleFormControlInput1">Event Name</label>
                                <input type="text" value={this.state.raceTitle}  onChange={this.handleTitleChange} className="form-control txt-input" placeholder="Add event's name here" />
                            </div>
                        </div>

                        <div className="col">
                            <div class="form-group">
                                <label for="exampleFormControlSelect1">Type of Race</label>
                                <select class="form-control" id="exampleFormControlSelect1" value={this.state.raceType}  onChange={this.handleRaceTypeChange}   >
                                    <option>Group Race</option>
                                    <option>Dirt Race (Individual)</option>
                                    <option>Dirt Race (Groups)</option>
                                    <option>Drag Race</option>
                                    <option>Endurance Race</option>
                                </select>
                            </div>
                        </div>

                        <div className="col">
                            <div className="form-group">
                                
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <div className="form-group">
                            <label for="exampleFormControlInput1">Race Category</label>
                             <input type="text" value={this.state.raceCategory}  onChange={this.handleRaceCatChange} className="form-control txt-input" placeholder="Add event's name here" />
                            </div>
                        </div>

                        <div className="col">
                            <div className="form-group">
                                <label>Add a Banner:</label>
                                <input type="file" onChange={this.fileSelectedHandler}/>
                                
                            </div>
                        </div>
                       
                        <div className="col">
                            <div className="form-group">
                                
                            </div>
                        </div>
                    </div>
                </div>

               

                

               

                <label>Venue:</label>
                <input type="text" value={this.state.raceAddress}  onChange={this.handleRaceAddressChange}/><br/>

                <label>Specify No. of stages:</label>
                <input type="text" value={this.state.raceNoOfStages}  onChange={this.handleRaceStagesChange}/><br/>

                <label>Add Description:</label>
                <input type="text" value={this.state.raceInfo}  onChange={this.handleRaceInfoChange}/><br/>

                <label>Limit of riders:</label>
                <input type="text" value={this.state.noOfRiders}  onChange={this.handleRaceLimitChange}/><br/>

               
                <button onClick={() => this.handleOnclickSubmit()} type="submit">Submit</button>
            </div>
        );
    }
}

export default postraces;