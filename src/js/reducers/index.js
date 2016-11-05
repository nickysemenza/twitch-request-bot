import { combineReducers } from 'redux';
import UserReducer from './reducer_user';
import SongRequestReducer from './reducer_song';

const rootReducer = combineReducers({
  user: UserReducer,
  song: SongRequestReducer
});

export default rootReducer;
