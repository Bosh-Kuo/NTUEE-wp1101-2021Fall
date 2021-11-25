import mongoose from "mongoose";

const Schema = mongoose.Schema;
const scoreCardSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const ScoreCard = mongoose.model("ScoreCards", scoreCardSchema);
export default ScoreCard;
