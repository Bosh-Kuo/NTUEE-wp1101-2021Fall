import express from 'express'
import { getNumber, genNumber } from '../core/getNumber'

const router = express.Router()

function roughScale(x, base) {
  const parsed = parseInt(x, base)
  if (isNaN(parsed)) {
    return 0
  }else{
    return parsed  
  }
}

router.post('/start', (_, res) => {
  let ans = genNumber()  // 用亂數產生一個猜數字的 number
  console.log("New Game! Ans is: " + ans)
  res.json({ msg: 'The game has started.' })
})

router.get('/guess', (req, res) => {
  const number = getNumber()
  const guessed = roughScale(req.query.Number, 10)
  console.log("玩家猜"+guessed)

  // check if NOT a num or not in range [1,100]
  if (!guessed || guessed < 1 || guessed > 100) {
    res.status(406).send({ msg: 'Not a legal number.' })
  } else if (number === guessed) {
    res.status(200).send({msg: 'Equal'});
  } else if (number > guessed) {
    res.status(200).send({msg: 'Bigger'});
  } else if (number < guessed) {
    res.status(200).send({msg: 'Smaller'});
  }
})

router.post('/restart', (_, res) => {
  let ans = genNumber(true)  // 用亂數產生一個猜數字的 number
  res.json({ msg: 'Let\'s play one more time!' })
  console.log("\nNew Game! Ans is: " + ans)
})
export default router
