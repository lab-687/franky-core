export const loginButton = (value) => {
  return async dispatch => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value)
    };
    await fetch('http://localhost:3000/api/users/login', requestOptions)
      .then(async response => {
        return {status: response.status, response: await response.json()}
      })
      .then(data => {
        dispatch(returnAction('SUBMIT_LOGIN',data));
      });
  }
};

export const saveToken = (value) => {
  return async dispatch => {
    dispatch(returnAction('SAVE_TOKEN',value));
  }
}

const returnAction = (type, value) => ({
      type: type,
      value: value
});
