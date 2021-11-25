import ScoreCard from '../../models/ScoreCard';

const updateCard = async (req, res) => {
    const name = req.body.name;
    const subject = req.body.subject;
    const score = req.body.score;

    const exist = await ScoreCard.findOne({ name: name, subject: subject });
    if (!exist) {
        const newScoreCard = new ScoreCard({ name: name, subject: subject, score: score });
        await newScoreCard.save();
        console.log("adding:", newScoreCard);
        res.send({ message: `Adding (${name}, ${subject}, ${score})`, card: newScoreCard });
    } else {
        exist.score = score;
        await exist.save();
        console.log("updating:", exist);
        res.send({ message: `Updating(${name}, ${subject}, ${score})`, card: exist });
    }
}

export default updateCard;