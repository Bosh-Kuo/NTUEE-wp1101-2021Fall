import express from 'express';  
import connectDB from './mongo';
import cors from 'cors';
import apiRoutes from './routes/index';

const app = express();
app.use(cors());
app.use(express.json());   // 傳送 JSON 格式的res。跟app.use(bodyParser.json())相同
app.use('/api', apiRoutes);  

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
connectDB();