import React, { Component } from 'react';
import { connect } from 'react-redux';
import { saveToken } from '../../actions';
import './Home.css';

class Home extends Component {

  render() {

    return (
      <div className="container-fluid">
        <div className="row">
          <p>{this.props.loginToken}</p>
        </div>

      </div>
    );
  }
}

const mapStateToProps = store => ({
  loginToken: store.loginState.loginToken
});

const mapDispatchToProps = dispatch => {
  return {
    onSaveToken: value => {
      dispatch(saveToken(value));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
