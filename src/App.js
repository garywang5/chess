import { useReducer } from 'react';
import './App.css';
import Board from './components/Board/Board';
import AppContext from './Context';
import { initGameState } from './constant';
import { reducer } from './reducer/reducer';
import Control from './components/Control/Control';
import MovesList from './components/Control/bits/MovesList';
import TakeBack from './components/Control/bits/TakeBack'

function App() {
  //reducer and initial state
  const [appState, dispatch] = useReducer(reducer, initGameState)
  const providerState = {
    appState,
    dispatch
  }
  return (
    //context used to pass information deeply without needing for props (pass the reducer)
    <AppContext.Provider value={providerState}>
    <div className="App">
      <Board/>
      <Control>
        <MovesList/>
        <TakeBack/>
      </Control>
    </div>
    </AppContext.Provider>
  );
}

export default App;
