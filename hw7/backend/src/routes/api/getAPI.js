import ScoreCard from '../../models/ScoreCard';

const query = async (req, res) => {
    const queryType = req.query.type;
    const queryString = req.query.queryString;
    let filteredCards;
    if (queryType === "name") {
        filteredCards = await ScoreCard.find({ name: queryString }).catch(err => {
            console.log(err);
        });
    } else if (queryType === "subject") {
        filteredCards = await ScoreCard.find({ subject: queryString }).catch(err => {
            console.log(err);
        });
    }

    let messages = [];
    if (filteredCards.length > 0) {
        filteredCards.forEach(card => messages.push(`Found card with ${queryType}: (${card.name}, ${card.subject}, ${card.score})`));
        res.send({ messages: messages });

    } else {
        res.send({ message: `${queryType} (${queryString}) not found!` });
    }
}

export default query;