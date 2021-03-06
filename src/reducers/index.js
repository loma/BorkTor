import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

import { AppNavigator } from '../navigators/AppNavigator';
import {
  AsyncStorage,
  Platform,
} from 'react-native';

// Start with two routes: The Main screen, with the Login screen on top.
const firstAction = AppNavigator.router.getActionForPathAndParams('Main');
const initialNavState = AppNavigator.router.getStateForAction(
  firstAction,
);

function nav(state = initialNavState, action) {
  let nextState;
  switch (action.type) {
    case 'main':
      var routeName = state.routes[state.index].routeName
      if (routeName === 'Main') return state

      if (routeName === 'Promotions') {
        nextState = AppNavigator.router.getStateForAction(
          NavigationActions.back(),
          state
        );
        break;
      }

      if (state.routes.length > 0) {
        state.routes.splice(1,state.routes.length - 1)
        state.index = 0
      }

      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Main', params: {name: action.name}}),
        state
      );
      break;
    case 'search':
      var routeName = state.routes[state.index].routeName
      if (routeName === 'Search') return state

      if (state.routes.length > 0) {
        state.routes.splice(1,state.routes.length - 1)
        state.index = 0
      }

      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Search', params: {name: action.name}}),
        state
      );
      break;
    case 'likes':
      var routeName = state.routes[state.index].routeName
      if (routeName === 'Likes') return state

      if (state.routes.length > 0) {
        state.routes.splice(1,state.routes.length - 1)
        state.index = 0
      }

      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Likes', params: {name: action.name}}),
        state
      );
      break;
    case 'hot':
      var routeName = state.routes[state.index].routeName
      if (routeName === 'Hot') return state

      if (state.routes.length > 0) {
        state.routes.splice(1,state.routes.length - 1)
        state.index = 0
      }

      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Hot', params: {name: action.name}}),
        state
      );
      break;
    case 'promotions':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Promotions', params: {name: action.name}}),
        state
      );
      break;
    case 'Main':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.back(),
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

const serverHost = __DEV__ ? (Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000') : 'https://borktor.57bytes.com/'
const uniqueId = require('react-native-device-info').getUniqueID();
const initialNewsState = {
  userId: uniqueId,
  list: { },
  maxId: { },
  lastReadId: { },
  loaded: {status:false},
  visible: false,
  initialPage: 0,
  images: [],
  categories: [],
  pageId: 0,
  readVersion: 0,
  likes: {},
  configs: {}
};
function news(state = initialNewsState, action) {
  switch (action.type) {
    case 'init-configs':
      return Object.assign({}, state, {
        configs: Object.assign({}, {}, action.value)
      })
    case 'toggleLike':
      var oldLikes = state.likes
      if (oldLikes[action.value.id]) {
        delete oldLikes[action.value.id]
      } else {
        oldLikes[action.value.id] = action.value
      }
      AsyncStorage.setItem('@LIKES:key', JSON.stringify(oldLikes))
      if (state.configs.log_activity === 'true') {
        var log = {'uId':uniqueId,'page':'toggle_like','value':''+action.value.id}
        fetch(serverHost + '/activities.json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', },
          body: JSON.stringify(log)
        })
      }

      return Object.assign({}, state, {
        likes: Object.assign({}, {}, oldLikes)
      })
    case 'init-likes':
      return Object.assign({}, state, {
        likes: action.value
      })
    case 'promotions':
      return Object.assign({}, state, {
        pageId: action.value
      })
    case 'Main':
      var currentList = Object.assign({}, state.list)
      currentList[action.value.id] = action.value
      currentList[action.value.id]['images'] = []
      return Object.assign({}, state, {
        list: currentList,
        tempNews: { like: 0, dislike: 0 }
      })
    case 'setReadVersion':
      return Object.assign({}, state, {
        readVersion: action.value
      })
    case 'setImage':
      return Object.assign({}, state, {
        initialPage: action.initialPage,
        images: action.images
      })
    case 'setModalVisible':
      return Object.assign({}, state, {
        visible: action.value,
      })
    case 'initCategories':
      newState = JSON.parse(JSON.stringify(state))
      newState['categories'] = action.value
      return newState
      /*
      return Object.assign({}, state, {
        categories: action.value,
      })
      */
    case 'initLastReadCategories':
      return Object.assign({}, state, {
        lastReadId: Object.assign({}, state.lastReadId, action.value),
      })
    case 'init':
      var newList = {}
      var maxIdByCateogry = {}
      for (var index in action.value) {
        var each = action.value[index]
        newList[each.id] = each
        if (!maxIdByCateogry[each.category_id]) maxIdByCateogry[each.category_id] = 0
        maxIdByCateogry[each.category_id] = Math.max(maxIdByCateogry[each.category_id], each.id)
        if (each.images) newList[each.id]['images'] = each.images.split(',')
        else newList[each.id]['images'] = []
      }
      return Object.assign({}, state, {
        list: newList,
        maxId: maxIdByCateogry,
        loaded: {status:true}
      })
    default:
      return state;
  }
}



const AppReducer = combineReducers({
  nav,
  news,
});

export default AppReducer;
