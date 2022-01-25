import ScoreCard from '../../models/ScoreCard';

const updateCard = async (req, res) => {
    // req.body contains anything in the request body. Typically this is used on PUT and POST requests.
    // For example a POST to sample.com with the body of {"foo":"bar"} and a header of type application/json, 
    // req.body would contain {foo: "bar"}
    // 因為前端傳輸資料不是用params，而是直接傳一個object，所以要用req.body取得前端傳送的資料
    const name = req.body.name;
    const subject = req.body.subject;
    const score = req.body.score;

    const exist = await ScoreCard.findOne({ name: name, subject: subject });
    let filteredCards;
    if (!exist) {
        const newScoreCard = new ScoreCard({ name: name, subject: subject, score: score });
        await newScoreCard.save();
        filteredCards = await ScoreCard.find({ name: name }).catch(err => {
            console.log(err);
        });
        console.log("adding:", newScoreCard);
        res.send({ message: `Adding (${name}, ${subject}, ${score})`, cards: filteredCards });
    } else {
        exist.score = score;
        await exist.save();
        filteredCards = await ScoreCard.find({ name: name }).catch(err => {
            console.log(err);
        });
        console.log("updating:", exist);
        res.send({ message: `Updating(${name}, ${subject}, ${score})`, cards: filteredCards });
    }    


}

export default updateCard;