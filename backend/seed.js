const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const User = require('./src/models/user.model');
const Inventory = require('./src/models/inventory.model');
const Shipment = require('./src/models/shipment.model');
const Transaction = require('./src/models/transaction.model');
const Notification = require('./src/models/notification.model');
const { SHIPMENT_STATUS, TRANSACTION_TYPES } = require('./src/utils/constants');

const FIREBASE_API_KEY = process.env.VITE_FIREBASE_API_KEY || 'AIzaSyAhkfH4B3S-DAlebmE-nWGPR21pWNz6nAo';

const email = 'demo@sia.com';
const password = 'SiaDemo2026!';
const displayName = 'Demo User';

async function getOrCreateFirebaseUser() {
  try {
    // Try to create user
    const res = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`, {
      email,
      password,
      returnSecureToken: true
    });
    console.log('Firebase user created successfully.');
    
    // Update display name
    await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_API_KEY}`, {
      idToken: res.data.idToken,
      displayName,
      returnSecureToken: true
    });

    return res.data.localId;
  } catch (error) {
    if (error.response && error.response.data.error.message === 'EMAIL_EXISTS') {
      console.log('Firebase user already exists. Signing in to get UID...');
      // Sign in to get UID
      const loginRes = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`, {
        email,
        password,
        returnSecureToken: true
      });
      return loginRes.data.localId;
    } else {
      console.error('Firebase Error:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
}

async function seedData() {
  try {
    console.log('Starting seed process...');
    
    // 1. Get/Create Firebase User
    const uid = await getOrCreateFirebaseUser();
    console.log(`Firebase UID: ${uid}`);

    // 2. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    // 3. Clear existing data for this user
    await User.deleteMany({ email });
    await Inventory.deleteMany({ userId: uid });
    await Shipment.deleteMany({ userId: uid });
    await Transaction.deleteMany({ userId: uid });
    await Notification.deleteMany({ userId: uid });
    console.log('Cleared existing data for demo user.');

    // 4. Create User in MongoDB
    const user = await User.create({
      name: displayName,
      email: email,
      role: 'manager'
    });
    console.log('MongoDB User created.');

    // 5. Create Inventory (8-12 products, mixed stock levels)
    const inventoryData = [
      { sku: 'SKU-ELEC-001', productName: 'Quantum Processor Q9', quantity: 450, reorderLevel: 100, warehouse: 'San Jose, CA', unitCost: 120 },
      { sku: 'SKU-ELEC-002', productName: 'Neural Engine Chip X1', quantity: 15, reorderLevel: 50, warehouse: 'Austin, TX', unitCost: 85 }, // Low stock
      { sku: 'SKU-ELEC-003', productName: 'Haptic Feedback Module', quantity: 5, reorderLevel: 20, warehouse: 'Shenzhen, CN', unitCost: 12 }, // Critical
      { sku: 'SKU-ELEC-004', productName: 'LiDAR Sensor Array', quantity: 120, reorderLevel: 30, warehouse: 'San Jose, CA', unitCost: 340 },
      { sku: 'SKU-AUTO-101', productName: 'EV Battery Cell', quantity: 0, reorderLevel: 1000, warehouse: 'Reno, NV', unitCost: 45 }, // Out of stock
      { sku: 'SKU-AUTO-102', productName: 'Regenerative Braking Unit', quantity: 80, reorderLevel: 100, warehouse: 'Detroit, MI', unitCost: 210 }, // Low
      { sku: 'SKU-MED-201', productName: 'Surgical Robot Arm', quantity: 4, reorderLevel: 10, warehouse: 'Boston, MA', unitCost: 12000 }, // Low
      { sku: 'SKU-MED-202', productName: 'Diagnostic Imaging Lens', quantity: 55, reorderLevel: 20, warehouse: 'Munich, DE', unitCost: 800 },
      { sku: 'SKU-AERO-301', productName: 'Titanium Turbine Blade', quantity: 300, reorderLevel: 50, warehouse: 'Seattle, WA', unitCost: 1500 },
      { sku: 'SKU-AERO-302', productName: 'Avionics Display Panel', quantity: 12, reorderLevel: 15, warehouse: 'Toulouse, FR', unitCost: 2500 } // Low
    ].map(item => ({ ...item, userId: uid }));
    
    const inventoryDocs = await Inventory.insertMany(inventoryData);
    console.log(`Inserted ${inventoryDocs.length} inventory items.`);

    // 6. Create Shipments (5-10 shipments, mixed statuses)
    const shipmentData = [
      {
        trackingId: 'TRK-983421-US',
        origin: 'Shenzhen, CN',
        destination: 'San Jose, CA',
        status: SHIPMENT_STATUS.IN_TRANSIT,
        eta: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // In 3 days
        delayProbability: 12,
        checkpoints: [
          { location: 'Shenzhen Port', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), status: 'CREATED' },
          { location: 'Pacific Ocean', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: 'IN_TRANSIT' }
        ]
      },
      {
        trackingId: 'TRK-552109-EU',
        origin: 'Munich, DE',
        destination: 'Boston, MA',
        status: SHIPMENT_STATUS.DELAYED,
        eta: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        delayProbability: 85,
        checkpoints: [
          { location: 'Munich Airport', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: 'DELAYED' }
        ]
      },
      {
        trackingId: 'TRK-112098-US',
        origin: 'Detroit, MI',
        destination: 'Austin, TX',
        status: SHIPMENT_STATUS.DELIVERED,
        eta: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        delayProbability: 0,
        checkpoints: [
          { location: 'Detroit Hub', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), status: 'CREATED' },
          { location: 'Austin Distribution', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: 'DELIVERED' }
        ]
      },
      {
        trackingId: 'TRK-774391-AS',
        origin: 'Seoul, KR',
        destination: 'Reno, NV',
        status: SHIPMENT_STATUS.CREATED,
        eta: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        delayProbability: 25,
        checkpoints: [
          { location: 'Seoul Logistics Center', timestamp: new Date(), status: 'CREATED' }
        ]
      },
      {
        trackingId: 'TRK-339021-US',
        origin: 'Seattle, WA',
        destination: 'Toulouse, FR',
        status: SHIPMENT_STATUS.IN_TRANSIT,
        eta: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        delayProbability: 5,
        checkpoints: [
          { location: 'JFK Airport', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: 'IN_TRANSIT' }
        ]
      }
    ].map(item => ({ ...item, userId: uid }));

    const shipmentDocs = await Shipment.insertMany(shipmentData);
    console.log(`Inserted ${shipmentDocs.length} shipments.`);

    // 7. Create Transactions (Supply Records)
    const transactionData = [
      {
        userId: uid,
        inventory: inventoryDocs[0]._id, // Quantum Processor
        type: TRANSACTION_TYPES.SUPPLY,
        quantity: 500,
        note: 'Initial bulk supply',
        metadata: { supplier: 'GlobalTech Solutions' }
      },
      {
        userId: uid,
        inventory: inventoryDocs[1]._id, // Neural Engine Chip (low)
        type: TRANSACTION_TYPES.SALE,
        quantity: 200,
        note: 'Fulfillment to major client',
        metadata: { client: 'TechCorp Inc' }
      },
      {
        userId: uid,
        inventory: inventoryDocs[4]._id, // EV Battery (out of stock)
        type: TRANSACTION_TYPES.SALE,
        quantity: 1000,
        note: 'Mass order depleted stock',
        metadata: { client: 'AutoMakers LLC' }
      },
      {
        userId: uid,
        inventory: inventoryDocs[5]._id, // Regenerative Braking
        type: TRANSACTION_TYPES.SUPPLY,
        quantity: 80,
        shipment: shipmentDocs[2]._id, // Delivered shipment
        note: 'Received via TRK-112098-US',
        metadata: { inspector: 'Jane Doe' }
      }
    ];

    await Transaction.insertMany(transactionData);
    console.log(`Inserted ${transactionData.length} transactions.`);

    // 8. Create Notifications
    const notificationData = [
      {
        userId: uid,
        type: 'warning',
        title: 'Critical Stock Alert',
        message: 'Haptic Feedback Module (SKU-ELEC-003) is critically low (5 units remaining).',
        read: false
      },
      {
        userId: uid,
        type: 'error',
        title: 'Stockout Event',
        message: 'EV Battery Cell (SKU-AUTO-101) stock has been depleted. Immediate restock required.',
        read: false
      },
      {
        userId: uid,
        type: 'warning',
        title: 'Shipment Delay Warning',
        message: 'Shipment TRK-552109-EU from Munich is facing high probability of delay due to weather.',
        read: false
      },
      {
        userId: uid,
        type: 'success',
        title: 'Shipment Delivered',
        message: 'Shipment TRK-112098-US has successfully arrived at Austin Distribution.',
        read: true
      },
      {
        userId: uid,
        type: 'info',
        title: 'AI Insight: Demand Spike Expected',
        message: 'Predictive models indicate a 40% spike in demand for LiDAR Sensor Arrays in Q3.',
        read: false
      }
    ];

    await Notification.insertMany(notificationData);
    console.log(`Inserted ${notificationData.length} notifications.`);

    console.log('\n--- Seed Complete ---');
    console.log('Demo Credentials:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

  } catch (error) {
    console.error('Seed Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

seedData();
