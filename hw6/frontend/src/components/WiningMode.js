const WiningMode = (props) => {
    const restart = props.restart
    const setHasWon = props.setHasWon
    const setStatus = props.setStatus
    const setPrevNumber = props.setPrevNumber
    const setNumber = props.setNumber
    return (
        <>
            <p>you won!</p>
            <button
                onClick={
                    async () => {
                        const msg = await restart()
                        console.log(msg)
                        setHasWon(false)
                        setStatus('')
                        setPrevNumber('')
                        setNumber('')
                    }
                }
            >restart</button>
        </>
    )
}

export default WiningMode