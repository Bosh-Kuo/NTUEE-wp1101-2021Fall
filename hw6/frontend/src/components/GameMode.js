const GameMode = (props) => {
    const number = props.number
    const handleGuess = props.handleGuess
    const setNumber = props.setNumber
    const status = props.status
    const computerGuessed = props.computerGuessed
    return (
        <>
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
            <p>{computerGuessed}</p>
        </>
    )
}

export default GameMode;