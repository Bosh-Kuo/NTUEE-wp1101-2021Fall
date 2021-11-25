import { Router } from 'express';
import updateCard from './api/postAPI';
import clearDB from './api/deleteAPI';
import query from './api/getAPI';

const router = Router();
router.get('/query-cards', query);
router.post('/create-card', updateCard);
router.delete('/clear-db', clearDB);

export default router;

