import './App.css';
import { useState } from 'react'
import { guess, startGame, restart } from './axios'
import GameMode from './components/GameMode';
import StartMenu from './components/StartMenu';
import WiningMode from './components/WiningMode';

function App() {
  const [hasStarted, setHasStarted] = useState(false)
  const [hasWon, setHasWon] = useState(false)
  const [number, setNumber] = useState('')
  const [prevNumber, setPrevNumber] = useState('')
  const [status, setStatus] = useState('')
  const [computerGuessed, setComputerGuessed] = useState('')

  // 將number(state)傳入guess function，等待guess function 回傳一字串，以此string更新目前status(state)，
  // 並判斷遊戲是否結束->若結束更新hasWon為true
  const handleGuess = async () => {
    const { msg, computer } = await guess(number, prevNumber, status);  //若沒有awiat的話msg會是一個Promise物件，awiat才會是string
    setPrevNumber(number)
    setNumber('')
    setStatus(msg)
    setComputerGuessed(computer)
    if (msg === 'Equal') {
      setHasWon(true);
    }
  }

  const game =
    <div>
      {hasWon 
      ? <WiningMode restart={restart} setHasWon={setHasWon} setStatus={setStatus} setPrevNumber={setPrevNumber} setNumber={setNumber}/> 
      : <GameMode number={number} handleGuess={handleGuess} setNumber={setNumber} status={status} computerGuessed={computerGuessed} />}
    </div>


  return (
    <div className="App">
      {hasStarted ? game : <StartMenu startGame={startGame} setHasStarted={setHasStarted}/>}
    </div>
  );
}

export default App;
