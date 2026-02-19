require('dotenv').config();

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const fs = require('fs');
const path = require('path');

const app = express();

// CORS setup
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());

// Initialize Razorpay with your credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Data storage setup
const DATA_DIR = path.join(__dirname, 'data');
const DONATIONS_FILE = path.join(DATA_DIR, 'donations.json');

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DONATIONS_FILE)) fs.writeFileSync(DONATIONS_FILE, JSON.stringify([]));
}

ensureDataFiles();

console.log('🔑 Razorpay configured with Key ID:', process.env.RAZORPAY_KEY_ID ? process.env.RAZORPAY_KEY_ID.substring(0, 12) + '...' : 'NOT SET');

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    timestamp: new Date().toISOString(),
    razorpay: process.env.RAZORPAY_KEY_ID ? 'configured' : 'not configured'
  });
});

// REAL Razorpay order creation
app.post('/api/create-order', async (req, res) => {
  console.log('📋 Create order request received:', req.body);
  
  try {
    const { amount, currency = 'INR', donorName, donorEmail } = req.body;

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      console.log('❌ Invalid amount:', amount);
      return res.status(400).json({ 
        success: false,
        error: 'Invalid or missing amount' 
      });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('❌ Razorpay credentials not configured');
      return res.status(500).json({
        success: false,
        error: 'Payment system not configured'
      });
    }

    const amountPaise = Math.round(Number(amount) * 100);
    
    // Create REAL Razorpay order
    const orderOptions = {
      amount: amountPaise,
      currency: currency,
      receipt: `rcpt_${Date.now()}`,
      notes: {
        donorName: donorName || 'Anonymous',
        donorEmail: donorEmail || '',
        platform: 'AgniAid',
        purpose: 'disaster_relief'
      }
    };

    console.log('📋 Creating Razorpay order with options:', orderOptions);

    const order = await razorpay.orders.create(orderOptions);
    
    console.log('✅ REAL Razorpay order created:', order.id);
    
    // Add success flag for our frontend
    const response = {
      ...order,
      success: true
    };

    res.json(response);

  } catch (err) {
    console.error('❌ Create order error:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Failed to create order' 
    });
  }
});

// REAL payment verification
app.post('/api/verify-payment', (req, res) => {
  console.log('🔍 Payment verification request:', req.body);
  
  try {
    const { 
      orderId, 
      paymentId, 
      signature, 
      amount, 
      donationType 
    } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required verification parameters'
      });
    }

    // Create signature for verification
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    console.log('🔍 Signature verification:');
    console.log('Expected:', expectedSignature);
    console.log('Received:', signature);

    const isValidPayment = expectedSignature === signature;

    if (isValidPayment) {
      // Save successful donation
      const donation = {
        id: `don_${Date.now()}`,
        orderId: orderId,
        paymentId: paymentId,
        amount: amount,
        donationType: donationType,
        status: 'success',
        timestamp: new Date().toISOString(),
        verified: true
      };

      // Save to file
      const donations = JSON.parse(fs.readFileSync(DONATIONS_FILE, 'utf8') || '[]');
      donations.push(donation);
      fs.writeFileSync(DONATIONS_FILE, JSON.stringify(donations, null, 2));

      console.log('✅ Payment verified and donation saved:', donation.id);

      res.json({ 
        success: true,
        status: 'ok',
        message: 'Payment verified successfully',
        donation 
      });
    } else {
      console.log('❌ Payment verification failed - invalid signature');
      res.status(400).json({
        success: false,
        error: 'Payment verification failed'
      });
    }

  } catch (err) {
    console.error('❌ Verification error:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Verification failed' 
    });
  }
});

// Get donations (bonus endpoint)
app.get('/api/donations', (req, res) => {
  try {
    const donations = JSON.parse(fs.readFileSync(DONATIONS_FILE, 'utf8') || '[]');
    res.json({ 
      success: true, 
      donations,
      total: donations.length,
      totalAmount: donations.reduce((sum, d) => sum + Number(d.amount), 0)
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch donations' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💳 Payment API: http://localhost:${PORT}/api/create-order`);
  console.log('🔑 Using REAL Razorpay credentials for live payments');
});
