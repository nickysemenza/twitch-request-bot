import { combineReducers } from 'redux';
import UserReducer from './reducer_user';
import SongRequestReducer from './reducer_song';
import { reducer as formReducer } from 'redux-form'

const rootReducer = combineReducers({
  user: UserReducer,
  song: SongRequestReducer,
  form: formReducer
});

export default rootReducer;
