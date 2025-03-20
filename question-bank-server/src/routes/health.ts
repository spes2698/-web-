import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: {
            server: 'running',
            database: 'connected'
        }
    });
});

export default router; 