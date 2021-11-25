import ScoreCard from '../../models/ScoreCard';

const clearDB = async (req, res) => {
    try {
        await ScoreCard.deleteMany({});
        console.log("Database cleared");
        res.json({ message: "Database cleared" });
    } catch (err) {
        console.log(err);
    }
}

export default clearDB;