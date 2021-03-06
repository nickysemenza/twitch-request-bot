import { combineReducers } from 'redux';
import UserReducer from './reducer_user';
import SongRequestReducer from './reducer_song';
import SystemReducer from './reducer_system';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
  user: UserReducer,
  song: SongRequestReducer,
  system: SystemReducer,
  form: formReducer
});

export default rootReducer;
