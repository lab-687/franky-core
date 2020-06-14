import React, { Component } from 'react';
import './LoginBox.css';

class LoginBox extends Component {

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }

    this.inputChange = this.inputChange.bind(this);
  }

  inputChange(event) {
    if(event.target.type === 'text') {
      this.setState({username: event.target.value});
    } else {
      this.setState({password: event.target.value});
    }
  }

  async submitLogin() {

    const credentials = {
      username: this.state.username,
      password: this.state.password
    }


    this.props.starterInfo.onLoginButton(credentials);
  }

  render() {

    return (
          <div className="box">
            <p className="text" >Franky - Admin Panel</p>
            <hr className="line" />
            <form action="#">
              <div className="form-group">
                  <input type="text" className="form-control" value={this.state.username} onChange={this.inputChange} placeholder="username" id="username" />
              </div>
              <div className="form-group">
                  <input type="password" className="form-control" value={this.state.password} onChange={this.inputChange} placeholder="**********" id="pwd" />
              </div>
              <button type="login" onClick={() => this.submitLogin()} className="btn btn-primary">Entrar</button>
              </form>
              <hr className="line" />
          </div>
    );
  }
}

export default LoginBox
