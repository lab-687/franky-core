import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginButton, saveToken } from '../../actions';
import LoginBox from './components/LoginBox/LoginBox';
import './Login.css';

class Login extends Component {


  componentDidUpdate(PrevProps) {
    if(PrevProps.loginInfo !== this.props.loginInfo) {
      this.loginHandler()
    } else if(this.props.loginToken !== null && (PrevProps.loginToken !== this.props.loginToken)) {
      alert('Você está logado!!!');
    }

  }

  loginHandler() {
    if(this.props.loginInfo.status === 200) {
      if(this.props.loginInfo.response.auth) {
        this.props.onSaveToken(this.props.loginInfo.response.token);
      }
    } else if(this.props.loginInfo.status === 400) {
      alert(this.props.loginInfo.response.message);
      this.props.onSaveToken(null);
    } else if(this.props.loginInfo.status === 500) {
      alert(this.props.loginInfo.response.message);
      this.props.onSaveToken(null);
    }
  }

  render() {

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="login-side">
            <LoginBox starterInfo={this.props} />
          </div>

        </div>

      </div>
    );
  }
}

const mapStateToProps = store => ({
  loginInfo: store.loginState.loginInfo,
  loginToken: store.loginState.loginToken
});

const mapDispatchToProps = dispatch => {
  return {
    onLoginButton: value => {
        dispatch(loginButton(value));
    },
    onSaveToken: value => {
      dispatch(saveToken(value));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
