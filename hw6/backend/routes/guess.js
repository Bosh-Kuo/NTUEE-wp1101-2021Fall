import express from 'express'
import { getNumber, genNumber } from '../core/getNumber'

const router = express.Router()

function roughScale(x, base) {
  const parsed = parseInt(x, base)
  if (isNaN(parsed)) {
    return 0
  } else {
    return parsed
  }
}

// POST/start API
router.post('/start', (_, res) => {  // 沒有要在post request中取資料，若要的話用req.body.<參數>
  let ans = genNumber()  // 用亂數產生一個猜數字的 number
  console.log("New Game! Ans is: " + ans)  //在server端印出
  res.json({ msg: 'The game has started.' }) // 回傳一object
})

// GET/guess API
router.get('/guess', (req, res) => {
  const number = getNumber()

  // req.query contains the query params of the request.
  // For example in sample.com?foo=bar, req.query would be {foo:"bar"}
  const guessed = roughScale(req.query.Number, 10) // req.query: 提取url中?後面的object 
  const prevGuessed = roughScale(req.query.PrevNumber, 10)
  const prevStatus = req.query.Status
  let computerGuessed
  if (prevStatus === 'Ans is Bigger') {
    const random = Math.random()*10
    computerGuessed = Math.floor(prevGuessed + random > 100 ? 100 : prevGuessed + random)
  } else if(prevStatus === 'Ans is Smaller'){
    const random = Math.random()*10
    computerGuessed = Math.floor(prevGuessed - random < 1 ? 1 : prevGuessed - random)
  } else {
    computerGuessed = Math.floor(Math.random()*10 < 1 ? 1 : Math.random()*10)
  }

  //在server端印出
  console.log("玩家猜" + guessed)  
  console.log("玩家上次猜" + prevGuessed)
  console.log("電腦猜" + computerGuessed+"\n")

  // check if NOT a num or not in range [1,100]
  if (!guessed || guessed < 1 || guessed > 100) {
    res.status(406).send({ msg: 'Not a legal number.', computer:`Computer guess ${computerGuessed}` })
  } else if (number === guessed) {
    res.status(200).send({ msg: 'Equal' });
  } else if (number > guessed) {
    res.status(200).send({ msg: 'Ans is Bigger', computer:`Computer guess ${computerGuessed}` });
  } else if (number < guessed) {
    res.status(200).send({ msg: 'Ans is Smaller', computer:`Computer guess ${computerGuessed}` });
  }
})

// POST/restart API
router.post('/restart', (_, res) => {
  let ans = genNumber(true)  // 用亂數產生一個猜數字的 number
  res.json({ msg: 'Let\'s play one more time!' })
  console.log("\nNew Game! Ans is: " + ans)
})
export default router
