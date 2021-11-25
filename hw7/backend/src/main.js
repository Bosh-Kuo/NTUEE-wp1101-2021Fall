import express from 'express';  
import connectDB from './mongo';
import cors from 'cors';
import apiRoutes from './routes/index';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
connectDB();