import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { S3Client } from '@aws-sdk/client-s3';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// AWS S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Teste de servidor
app.get('/', (req, res) => {
  res.json({ status: 'Meu Eu 2.0 backend ONLINE ✅' });
});

// Teste AWS
app.get('/aws-test', async (req, res) => {
  try {
    await s3.config.credentials();
    res.json({ aws: 'OK ✅' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Teste Stripe
app.get('/stripe-test', async (req, res) => {
  try {
    const balance = await stripe.balance.retrieve();
    res.json({ stripe: 'OK ✅', balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Webhook Stripe (básico)
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  res.json({ received: true });
});

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
