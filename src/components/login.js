import React, { Component } from "react";
import '../styles/login.css'

class landingPage extends Component {
    render() {
        return(
            <div>
                <div class="wrapper fadeInDown">
                    <div id="formContent">
                        <div class="fadeIn first">
                            <img src="http://danielzawadzki.com/codepen/01/icon.svg" id="icon" alt="User Icon" />
                        </div>

                        <form>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Passcode</label>
                                <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Passcode here..." />
                            </div>
                            <button type="submit" class="btn btn-primary">Log In</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default landingPage;