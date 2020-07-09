import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import * as firebase from "firebase";
import { config } from "../Firebase/index";
import "../styles/suggestionbox.css";
import { render } from "@testing-library/react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { GiMagnifyingGlass } from "react-icons/gi";
import { AiOutlineEnter, AiFillLike } from "react-icons/ai";
import UniqueID from "react-html-id";

if (!firebase.apps.length) {
  firebase.initializeApp(config());
}

var db = firebase.database();
var ref = db.ref("Trails/").orderByChild("status").equalTo("pending");

var trailDatas = [];

class suggestionbox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalAddress: "",
      modalUserImg: "",
      modalMapImg: "",
      modalTrailTitle: "",
      modalSender: "",
      modalDistance: "",
      likes: "",
      itemApproved: "",
      itemDisapproved: "",

      requiredItem: 0,
      trailValues: [],
      data: [
        {
          address: "",
          distance: "",
          difficulty: "",
        },
      ],
    };
  }

  componentDidMount() {
    ref.on("value", (snapshot) => {
      let Datas = { ...snapshot.val() };
      this.setState({ trailValues: Datas });
    });
  }

  handleApprove = (index) => {
    // Need pa ifix
    // alert("sdsd" + index.status)
    firebase
      .database()
      .ref("Trails/" + index + "/status")
      .set("approved");
    alert("Approved");
  };

  handleDisapprove = (index) => {
    // Need pa ifix
    // alert("sdsd" + index.status)
    firebase
      .database()
      .ref("Trails/" + index + "/status")
      .set("disapproved");
    alert("Disapproved");
  };

  handleTableBtnApprovedCLicked(
    url,
    title,
    address,
    sender,
    key,
    distance,
    likes,
    mapImage
  ) {
    this.setState({
      modalUserImg: url,
      modalMapImg: mapImage,
      modalTrailTitle: title,
      modalAddress: address,
      modalSender: sender,
      modalDistance: Math.round((distance + Number.EPSILON) * 100) / 100,
      itemApproved: key,
      itemDisapproved: key,
      likes: likes,
    });

    // alert(key)
  }

  render() {
    const requiredItem = this.state.requiredItem;
    const addressItem = this.state.address;
    let modalData = trailDatas[requiredItem];

    return (
      <div className="suggestionBox-container">
        <h2 className="header-text-suggestion">New Trails?</h2>
        <div className="centerDiv">
          <div className="col-lg-12"></div>
          <div>
            <table className="table table-striped table-dark table-bordered">
              <thead className="suggesion-thead">
                <tr style={{ textAlign: "center" }}>
                  <th scope="col">Sender</th>
                  <th scope="col">Trail Name</th>
                  <th scope="col">Distance</th>
                  <th scope="col">Suggestion Status</th>
                  <th scope="col">Popularity</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>

              {Object.keys(this.state.trailValues).map((igKey) => {
                return (
                  <tr key={igKey}>
                    <th
                      scope="row"
                      style={{
                        width: "20%",
                        textAlign: "center",
                        fontWeight: "200",
                      }}
                    >
                      {" "}
                      {this.state.trailValues[igKey].firstname +
                        " " +
                        this.state.trailValues[igKey].lastname}{" "}
                    </th>
                    <th
                      scope="row"
                      style={{
                        width: "20%",
                        textAlign: "center",
                        fontWeight: "200",
                      }}
                    >
                      {this.state.trailValues[igKey].trailTitle}
                    </th>
                    <th
                      scope="row"
                      style={{
                        width: "20%",
                        textAlign: "center",
                        fontWeight: "200",
                      }}
                    >
                      {Math.round(
                        (this.state.trailValues[igKey].distance +
                          Number.EPSILON) *
                          100
                      ) / 100}
                      Km
                    </th>
                    <th
                      scope="row"
                      style={{
                        width: "20%",
                        textAlign: "center",
                        fontWeight: "200",
                      }}
                    >
                      {this.state.trailValues[igKey].status}
                    </th>
                    <th
                      scope="row"
                      style={{
                        width: "20%",
                        textAlign: "center",
                        fontWeight: "200",
                      }}
                    >
                      <AiFillLike /> &nbsp;{" "}
                      {this.state.trailValues[igKey].likes}
                    </th>

                    <th style={{ textAlign: "center" }}>
                      <div className="col">
                        <span
                          onClick={() =>
                            this.handleTableBtnApprovedCLicked(
                              this.state.trailValues[igKey].userimageuri,
                              this.state.trailValues[igKey].trailTitle,
                              this.state.trailValues[igKey].trailAddress,
                              this.state.trailValues[igKey].firstname +
                                " " +
                                this.state.trailValues[igKey].lastname,
                              igKey,
                              this.state.trailValues[igKey].distance,
                              this.state.trailValues[igKey].likes,
                              this.state.trailValues[igKey].mapImage
                            )
                          }
                        >
                          <GiMagnifyingGlass
                            className="thumbs-up"
                            p
                            style={{ size: "45px", color: "#6F952C" }}
                            data-toggle="modal"
                            data-target="#exampleModalLong"
                          />
                        </span>
                      </div>
                    </th>
                  </tr>
                );
              })}
            </table>
          </div>
        </div>

        {/* Modal Area */}
        <div
          className="modal fade"
          id="exampleModalLong"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLongTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog suggestionModal" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  Summary
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col">
                    <h3>Trail Summary</h3>
                    <div
                      className="row"
                      style={{ paddingLeft: "5%", paddingRight: "5%" }}
                    >
                      <label style={{ color: "black" }}>Sender: </label>
                      &nbsp;{" "}
                      <span
                        style={{
                          fontStyle: "italic",
                          color: "black",
                          marginLeft: "2%",
                          fontFamily: "Poppins",
                        }}
                      >
                        <strong >{this.state.modalSender} </strong>
                      </span>
                    </div>

                    <div className="row"></div>
                    <hr></hr>
                    <div
                      className="row"
                      style={{
                        paddingLeft: "5%",
                        marginTop: "1%",
                        marginBottom: "2.5%",
                      }}
                    >
                      <label style={{ color: "black" }}>Trail Name: </label>{" "}
                      <br />
                      <span
                        style={{
                          fontStyle: "italic",
                          color: "black",
                          marginLeft: "2%",
                          fontFamily: "Poppins",
                        }}
                      >
                        {this.state.modalTrailTitle}
                      </span>
                    </div>
                   
                    <div
                      className="row"
                      style={{
                        paddingLeft: "5%",
                        paddingRight: "5%",
                        marginTop: "-3%",
                      }}
                    >
                      <label style={{ color: "black" }}>
                        Trail address: &nbsp; <br />{" "}
                        <span style={{ fontStyle: "italic", color: "black" }}>
                          {this.state.modalAddress}
                        </span>
                      </label>
                    </div>
                    
                    <div
                      className="row"
                      style={{
                        paddingLeft: "5%",
                        paddingRight: "5%",
                        marginTop: "2%",
                      }}
                    >
                      <label style={{ color: "black" }}>
                        Total Distance: &nbsp;{" "}
                      </label>
                      <span
                        style={{
                          fontStyle: "italic",
                          color: "black",
                          marginLeft: "2%",
                        }}
                      >
                        {this.state.modalDistance}km.
                      </span>
                    </div>

                    <div className="row mapLblContainer">
                      {/* <img src={this.state.modalUserImg} style={{width: '30%', height: '30%', borderRadius: "50%", float: "left"}} /> */}
                    </div>
                  </div>

                  <div className="col">
                    <img
                      src={this.state.modalMapImg}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => this.handleApprove(this.state.itemApproved)}
                >
                  Approve Trail
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  on
                  onClick={() =>
                    this.handleDisapprove(this.state.itemDisapproved)
                  }
                  data-dismiss="modal"
                >
                  Disapprove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default suggestionbox;
