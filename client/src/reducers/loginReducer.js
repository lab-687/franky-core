const initialState = {
  loginInfo: null,
  loginToken: null
};

export const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SUBMIT_LOGIN':
      return {...state, loginInfo: action.value};
    case 'SAVE_TOKEN':
      return {...state, loginToken: action.value};
    default:
      return state;
  }
};
