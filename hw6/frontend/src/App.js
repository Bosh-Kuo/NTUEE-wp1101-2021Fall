import './App.css';
import { useState } from 'react'
import { guess, startGame, restart } from './axios'

function App() {
  const [hasStarted, setHasStarted] = useState(false)
  const [hasWon, setHasWon] = useState(false)
  const [number, setNumber] = useState('')
  const [status, setStatus] = useState('')

  const handleGuess = async () => {
    const status = await guess(number);
    setNumber(number);
    setStatus(status);
    if (status === 'Equal') {
      setHasWon(true);
    }
  }

  const startMenu =
    <div>
      <button onClick={
        async () => {
          await startGame().then((msg) => console.log(msg))
          setHasStarted(true)
        }
      } > start game </button>
    </div>

  const gameMode = <>
    <p>Guess a number between 1 to 100</p>
    <input
      value={number}
      onChange={
        (e) => setNumber(e.target.value)
      }>
    </input>
    <button  // Send number to backend
      onClick={
        () => {
          handleGuess()
        }
      }
      disabled={!number}
    >guess!</button>
    <p>{status}</p>
  </>

  const winningMode =
    <>
      <p>you won! the number was {number}.</p>
      <button 
      onClick = {
        async () => {
          await restart().then((msg) => console.log(msg))
          setHasWon(false)
          setStatus('')
          setNumber('')
        }
      }
      >restart</button>
    </>

  const game =
    <div>
      {hasWon ? winningMode : gameMode}
    </div>


  return (
    <div className="App">
      {hasStarted ? game : startMenu}
    </div>
  );
}

export default App;
