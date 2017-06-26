import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

import { AppNavigator } from '../navigators/AppNavigator';

// Start with two routes: The Main screen, with the Login screen on top.
const firstAction = AppNavigator.router.getActionForPathAndParams('Main');
const initialNavState = AppNavigator.router.getStateForAction(
  firstAction,
);

function nav(state = initialNavState, action) {
  let nextState;
  switch (action.type) {
    case 'promotions':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Promotions' }),
        state
      );
      break;
    case 'Main':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.back(),
        state
      );
      break;
    case 'createNews':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Create' }),
        state
      );
      break;
    case 'Login':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.back(),
        state
      );
      break;
    case 'Logout':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Login' }),
        state
      );
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
}

const initialAuthState = { isLoggedIn: false };

function auth(state = initialAuthState, action) {
  switch (action.type) {
    case 'Login':
      return { ...state, isLoggedIn: true };
    case 'Logout':
      return { ...state, isLoggedIn: false };
    default:
      return state;
  }
}

const uniqueId = require('react-native-device-info').getUniqueID();
const initialNewsState = {
  userId: uniqueId,
  myActions: {},
  list: { },
  tempNews: {
    like: 0,
    dislike: 0
  },
  loaded: {status:false}
};
var _id = 1;
function news(state = initialNewsState, action) {
  switch (action.type) {
    case 'initLikes':
      var newActions = {}
      for(var index in action.value)
        newActions[action.value[index].news_id] = action.value[index].status
      return Object.assign({}, state, {
        myActions: newActions,
      })
    case 'Main':
      var currentList = Object.assign({}, state.list)
      currentList[action.value.id] = action.value
      return Object.assign({}, state, {
        list: currentList,
        tempNews: { like: 0, dislike: 0 }
      })
    case 'like':
      var currentNews = Object.assign({}, state.list)
      var currentAction = Object.assign({}, state.myActions)
      var _like, _dislike = 0, _action;
      if (currentAction[action.value] === 1) {
        _action = 0
        _like = -1
      } else {
        if (currentAction[action.value] === -1) _dislike = -1
        _action = 1
        _like = 1
      }
      currentNews[action.value].dislike += _dislike;
      currentAction[action.value] = _action;
      currentNews[action.value].like += _like;

      var updateStatus = {
        dislike:_dislike,
        like:_like,
        status:_action,
        uid: uniqueId
      }
      fetch('http://10.0.2.2:3000/news/'+action.value+'.json', {
        method: 'PUT',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
        body: JSON.stringify(updateStatus)
      })
        .then((response) => response.json())
        .then((status) => {
        })
        .catch((error) => {
        });

      return Object.assign({}, state, {
        myActions: currentAction,
        list: currentNews
      })
    case 'dislike':
      var currentNews = Object.assign({}, state.list)
      var currentAction = Object.assign({}, state.myActions)
      var _like = 0, _dislike = 0, _action;
      if (currentAction[action.value] === -1) {
        _dislike = -1
        _action = 0
      } else {
        if (currentAction[action.value] === 1) _like = -1
        _dislike = 1
        _action = -1
      }
      currentNews[action.value].dislike += _dislike;
      currentAction[action.value] = _action;
      currentNews[action.value].like += _like;

      var updateStatus = {
        dislike:_dislike,
        like:_like,
        status:_action,
        uid: uniqueId
      }
      fetch('http://10.0.2.2:3000/news/'+action.value+'.json', {
        method: 'PUT',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
        body: JSON.stringify(updateStatus)
      })
        .then((response) => response.json())
        .then((status) => {
        })
        .catch((error) => {
        });

      return Object.assign({}, state, {
        myActions: currentAction,
        list: currentNews
      })
    case 'Login':
      return { ...state, isLoggedIn: true };
    case 'Logout':
      return { ...state, isLoggedIn: false };
    case 'setTempDate':
      var news = Object.assign({}, state.tempNews, {
        valid_till: action.value.toISOString().substring(0, 10)
      })
      return Object.assign({}, state, {
        tempNews: news
      })
    case 'init':
      var newList = {}
      for (var index in action.value)
        newList[action.value[index].id] = action.value[index]
      return Object.assign({}, state, {
        list: newList,
        loaded: {status:true}
      })
    default:
      return state;
  }
}



const AppReducer = combineReducers({
  nav,
  auth,
  news,
});

export default AppReducer;
