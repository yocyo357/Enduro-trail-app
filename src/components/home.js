import React, { Component } from 'react'
import * as firebase from 'firebase';
import { FaPlus, FaEdit } from 'react-icons/fa';
import { AiOutlineEnter, AiFillLike } from 'react-icons/ai';
import { config } from '../Firebase/index';
import PostBox from './postraces';
import '../styles/home.css';
import { OutTable, ExcelRenderer } from 'react-excel-renderer';

if (!firebase.apps.length) {
    firebase.initializeApp(config())
}

var db = firebase.database();
var ref = db.ref('post_races/');
var refss = db.ref('Trails/').orderByChild('status').equalTo('approved');

var rankId = ""
class home extends Component {

    
    constructor(props) {
        super(props)

        this.handleEditChange = this.handleEditChange.bind(this);

        this.state = {
            myimage: '',
            trailname: '',
            modalTrailAdd: '',
            url: '',
            trailValues: [],

            rankingEventTitle: '',
            rankingEventDatePosted: '',
            rankingMaxSeries: '1',
            rankingCategories: 'Please Select',
            rankingCategoriesIndex: '',
            rankingValues: [],
            rankingID: '',

            trailID: [],
            trailAdd: '',
            approvedTrails: [],
            raceValue: [],
            eventID: [],
            cols: [],
            rows: [],
            categories: [],

            // edit post states****
            idToBeEdited: '',
            editRaceTitle: '',
            editRaceDate: '',
            editRaceDescription: '',
            editImageUrl: '',
            editDatePosted: '',
            editNoOfRiders: '',
            editRaceCategory: '',
            editRaceType: '',
            editTrailID: '',
            editRaceCat: '',
            editTrail: ''

        }
    }

    componentDidMount() {


        ref.on('value', snapshot => {
            let Datas = { ...snapshot.val() }
            this.setState({ trailValues: Datas })
        })

        refss.on('value', snapshot => {
            let Datum = { ...snapshot.val() }
            this.setState({ approvedTrails: Datum })
        })
    }

    // Includes Rangkin event
    handleSpecificEvent(eventTitle, eventID) {
        var refsss = db.ref('post_races/').orderByChild(eventID);
        refsss.on('value', snapshot => {
            let Datum = { ...snapshot.val() }
            this.setState({ rankingValues: Datum })
        })


        this.setState({
            rankingEventTitle: eventTitle,
            rankingID: eventID,


        })

    }
    getResults() {
        var results = []
        this.state.rows.map(row => {
            this.state.cols.map(col => {

            })
        })
        console.log(this.state.rows)
        // console.log(this.state.cols)

    }

    trailClicked(image, trailName, address) {
        this.setState({ myimage: image, trailName: trailName, modalTrailAdd: address })
    }

    handleRankCategoryChange=(event)=>{
       
        var options = event.target.options;
        var value = [];
        for (var i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        this.setState({
            rankingCategories: event.target.value,
            rankingCategoriesIndex: value
        })
    }

    handleSaveResult(){
        var datas = [];
        alert(this.state.rankingCategoriesIndex)

        if (this.state.rankingCategories != "Please Select" && this.state.cols != '') {
            // alert(this.state.rankingCategoriesIndex)

            for (let i = 0; i < this.state.rows.length; i++) {
                if(i > 0){
                    var obj = { name: this.state.rows[i][0], id: this.state.rows[i][1], totalScore: this.state.rows[i][this.state.cols.length - 1] };
                    for (let x = 2; x < this.state.cols.length - 1; x++){
                        obj[this.state.rows[0][x]] = this.state.rows[i][x]
                    }
                    datas.push(obj)
                }
                
            }
            var id = this.state.rankingID
            var indexx = this.state.rankingCategoriesIndex

            var refer = firebase.database().ref('post_races/'+id+'/raceCategory/'+indexx+'/Results');
            console.log(datas)
            refer.set(datas);
        }else (
            alert('Please select a category or add a file')
        )
       
    }

    fileHandler = (event) => {
        let fileObj = event.target.files[0];
        //just pass the fileObj as parameter
        ExcelRenderer(fileObj, (err, resp) => {
            if (err) {
                console.log(err);
            }
            else {
                this.setState({
                    cols: resp.cols,
                    rows: resp.rows
                }, function () {
                    this.getResults()
                })

            }
        });
    }

    handleEditPost(raceTitle, eventDate, raceInfo, noOfRiders, eventID, datePosted, imageURL, trailID, raceType, raceCategory) {
        this.setState({
            editRaceTitle: raceTitle,
            editRaceDate: eventDate,
            editRaceDescription: raceInfo,
            editNoOfRiders: noOfRiders,
            idToBeEdited: eventID,
            editDatePosted: datePosted,
            editImageUrl: imageURL,
            editTrailID: trailID,
            editRaceType: raceType,
            editRaceCategory: raceCategory
        })
    }

    handleEditChange(e){
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSaveEdit(id, title, limit, info, date, datePosted, url, trail, raceType, category) {
        //Updating several post details in Home page
        var updateRef = firebase.database().ref('post_races/');
        updateRef.child(id).update({
            'raceTitle': title,
            'eventDate': date,
            'noOfRiders': limit,
            'raceInfo': info,
        })
        
    }

    render() {
        return (
            <div style={{ paddingTop: '4%', paddingBottom: '4%' }}>
                <div className='row' style={{ width: '100%', paddingLeft: '2%', paddingRight: '2%' }}>
                    <div className='col col-sm-9' >
                        <h2 style={{ fontFamily: 'Poppins' }}>Event List</h2>
                        <div style={{ alignItems: 'center' }}>
                            {Object.keys(this.state.trailValues).map(igKey => {
                                return (
                                    <div className="card" style={{ width: '100%', marginTop: '1.5%', marginBottom: '1.5%' }}>
                                        <div className="card-body" style={{ backgroundColor: '#343A40', borderRadius: '5px' }}>
                                            <h5 className="card-title" style={{ color: 'white' }}>{this.state.trailValues[igKey].raceTitle}<span data-toggle="modal" data-target="#edit" onClick={() => this.handleEditPost(this.state.trailValues[igKey].raceTitle, this.state.trailValues[igKey].eventDate, this.state.trailValues[igKey].raceInfo, this.state.trailValues[igKey].noOfRiders, igKey,this.state.trailValues[igKey].datePosted, this.state.trailValues[igKey].imageURL, this.state.trailValues[igKey].trailID, this.state.trailValues[igKey].raceType, this.state.trailValues[igKey].raceCategory )} style={{ float: 'right', color: '#618930', cursor: 'pointer' }}><FaEdit /></span></h5>
                                            <p style={{ color: '#6F747C', fontFamily: 'Poppins', fontSize: '14px', marginTop: '-2%' }}>Posted on {this.state.trailValues[igKey].datePosted}</p>
                                            <p style={{ color: 'white', fontFamily: 'Poppins', fontSize: '14px', marginTop: '1%' }}>When: <span style={{ color: '#6F747C', fontFamily: 'Poppins' }}>{this.state.trailValues[igKey].eventDate}</span></p>
                                            <p className="card-text" style={{ color: 'white', textAlign: 'justify'}}>{this.state.trailValues[igKey].raceInfo}</p>
                                            <img src={this.state.trailValues[igKey].imageURL} className="card-img-top" alt="..." style={{ width: '100%', marginBottom: '1.5%' }} />
                                            <a href="#" className="btn btn-primary" data-toggle="modal" data-target="#exampleModalScrollable2" style={{ backgroundColor: '#618930', borderColor: '#618930', float: 'right' }} onClick={() => this.handleSpecificEvent(this.state.trailValues[igKey].raceTitle, igKey)}>Add Event Results</a>
                                        </div>
                                    </div>
                                )
                            }).reverse()}

                            <a href="#" className="float float-tooltip" data-toggle="modal" data-target="#exampleModalScrollable1" style={{ zIndex: '2' }}>
                                <FaPlus className="fa fa-plus my-float " style={{ width: '40px' }} />
                            </a>
                        </div>
                    </div>

                    <div className='col col-sm-3' style={{ zIndex: '1', width: '60%', }}>
                        <h3 style={{ fontFamily: 'Poppins', fontWeight: '300', marginTop: '25%' }}>Appoved Trails</h3>
                        <div>
                            {Object.keys(this.state.approvedTrails).map(igKey => {
                                return (
                                    <ul className="list-group list-group-flush">
                                        <li className='list-group-item list-group-item-action' onClick={() => this.trailClicked(this.state.approvedTrails[igKey].mapImage, this.state.approvedTrails[igKey].trailTitle, this.state.approvedTrails[igKey].trailAddress)} data-toggle="modal" data-target="#exampleModalScrollable4" style={{ cursor: 'pointer' }}><a  >{this.state.approvedTrails[igKey].trailTitle}&nbsp;<span class="badge badge-primary badge-pill" style={{ backgroundColor: '#618930', float: 'right' }}><AiFillLike />&nbsp;{this.state.approvedTrails[igKey].likes}</span></a></li>
                                    </ul>
                                )
                            })}

                        </div>

                    </div>
                </div>
                
                {/* New Scream Modal Area */}
                <div className="modal fade homeModalContainer" id="exampleModalScrollable1" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-scrollable" role="document">
                        <div className="modal-content modal-content-home">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalScrollableTitle">New Scream?</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body home-modal-body">
                                <PostBox />
                            </div>
                        </div>
                    </div>
                </div>

                {/* New Ranking Modal Area */}
                <div className="modal fade homeModalContainer" style={{ width: '65%', marginLeft: '18%' }} id="exampleModalScrollable2" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-scrollable" role="document">
                        <div className="modal-content modal-content-home">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalScrollableTitle">{this.state.rankingEventTitle}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div className="modal-body home-modal-body">
                                <form>
                                    <select className="form-control" id="exampleFormControlSelect1" value={this.state.rankingCategories} onChange={this.handleRankCategoryChange}   >
                                        <option>Please Select</option>
                                        {this.state.rankingID != "" && this.state.rankingValues[this.state.rankingID].raceCategory.map((d, index) => {
                                            
                                            return (
                                                
                                                <option value={index}>{this.state.rankingValues[this.state.rankingID].raceCategory[index].label}</option>
                                                // <option onSelect={()=>this.handleIndex(index)}>{index}</option>
                                            )
                                        })}
                                    </select>
                                    {/* <OutTable className='outTable' data={this.state.rows} columns={this.state.cols} tableClassName="ExcelTable2007" tableHeaderRowClass="heading" /> */}
                                    <input type="file" onChange={this.fileHandler.bind(this)} style={{padding:"10px", color: '#ffffff'}} /><br></br>
                                    <button type='reset' className='btn' onClick={()=>this.handleSaveResult()} style={{float: 'right', backgroundColor: '#618930', color: '#ffffff', font: 'Poppins'}}>Save</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trail Image Modal Area */}
                <div className="modal fade homeModalContainer" style={{ width: '70%', marginLeft: '15%' }} id="exampleModalScrollable4" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-scrollable" role="document">
                        <div className="modal-content modal-content-home">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalScrollableTitle">{this.state.trailName}</h5>

                                <h6 style={{ color: 'grey', fontSize: '12px', marginTop: '6%', marginLeft: '-22%' }}>{this.state.modalTrailAdd}</h6>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body home-modal-body">
                                <img src={this.state.myimage} style={{ width: '100%', height: '400px' }} />
                            </div>
                        </div>
                    </div>
                </div>
            
                 {/* Edit Post Modal Area */}
                 <div className="modal fade homeModalContainer" style={{ width: '70%', marginLeft: '15%' }} id="edit" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-scrollable" role="document">
                        <div className="modal-content modal-content-home">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalScrollableTitle">Edit Post</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body home-modal-body">
                                <div className='row'>
                                    <div className='col'>
                                        <label for="exampleInputEmail1">Event Name</label>
                                        <input type="text" name='editRaceTitle' style={{backgroundColor: '#343A40', color: '#ffffff', borderColor: '#343A40'}} value={this.state.editRaceTitle} onChange={this.handleEditChange} class="form-control" id="exampleInputEmail1" />
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col'>
                                        <label>Limit of Riders</label>
                                        <input className='form-control' style={{backgroundColor: '#343A40', color: '#ffffff', borderColor: '#343A40'}} type='number' name='editNoOfRiders' value={this.state.editNoOfRiders} onChange={this.handleEditChange} min='5' />
                                    </div>

                                    <div className='col'>
                                        <label for="exampleInputEmail1">Event Date</label>
                                        <input className='form-control' type="date" id="exampleFormControlSelect1" value={this.state.editRaceDate} name='editRaceDate' onChange={this.handleEditChange} style={{ width: '100%' }} />
                                    </div>
                                </div>
                                   
                                <div className='row'>
                                    <div style={{marginTop: '2%'}} className='col'>
                                        <label>Race Description</label><br></br>
                                        <textarea style={{width: '100%', marginTop: '0.2%', color: '#ffffff', backgroundColor: '#343A40', borderColor: '#343A40'}} name='editRaceDescription' value={this.state.editRaceDescription} onChange={this.handleEditChange} rows='5' />

                                        <button className='btn' style={{width: '30%', marginTop: '2%', float: 'right', backgroundColor: '#618930', color: '#ffffff', fontFamily: 'Poppins'}} onClick={() => this.handleSaveEdit(this.state.idToBeEdited, this.state.editRaceTitle, this.state.editNoOfRiders, this.state.editRaceDescription, this.state.editRaceDate, this.state.editDatePosted, this.state.editImageUrl, this.state.editTrailID, this.state.editRaceType, this.state.editRaceCategory)}>Save Edit</button>
                                    </div>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
            
            </div>
        );
    }
}

export default home;