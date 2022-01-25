const StartMenu = (props) => {
    const startGame = props.startGame
    const setHasStarted = props.setHasStarted
    return (
        <div>
            <button onClick={
                // 因為要等startGame function處理完回傳msg再往下，因此必須用async await
                async () => {
                    const msg = await startGame()
                    // startGame function本身為Promise object，因此也可以寫成startGame().then((msg) => console.log(msg)) 
                    // then後面接callback function接收startGame的return作為傳入參數傳入callback function
                    console.log(msg)
                    setHasStarted(true)
                }
            } > start game </button>
        </div>
    )
}

export default StartMenu;