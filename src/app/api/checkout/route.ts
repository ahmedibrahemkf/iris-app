import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';

// Replace with your actual Secret Key from OPay Dashboard
const OPAY_SECRET_KEY = process.env.OPAY_SECRET_KEY || 'YOUR_SECRET_KEY_HERE';
const OPAY_MERCHANT_ID = '281821122347035';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Create the order in the database with PENDING status
    const orderId = `ORD-${Date.now()}`;
    await prisma.order.create({
      data: {
        orderId: orderId,
        productName: data.productName,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        deliveryAddress: data.deliveryAddress,
        geoLocation: data.geoLocation,
        roseColor: data.roseColor,
        wrapColor: data.wrapColor,
        cardMessage: data.cardMessage,
        deliveryDate: data.deliveryDate,
        deliveryTime: data.deliveryTime,
        amount: data.amount,
        status: 'PENDING'
      }
    });

    // Determine base URL dynamically (Local vs Vercel Serverless)
    const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL 
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` 
      : process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : 'http://localhost:3000';

    // OPay API call to create a checkout URL
    const payload = {
      country: "EG",
      reference: orderId,
      amount: {
        total: data.amount * 100, // OPay usually accepts amount in minor units (cents/piastras)
        currency: "EGP"
      },
      returnUrl: `${baseUrl}/success`,
      cancelUrl: `${baseUrl}/`,
      expireAt: 30,
      userInfo: {
        userName: data.customerName,
        userMobile: data.customerPhone
      },
      product: {
        name: data.productName,
        description: `Rose Color: ${data.roseColor}, Wrap Color: ${data.wrapColor}`
      }
    };

    // Calculate HMAC SHA512 signature for OPay
    const hmac = crypto.createHmac('sha512', OPAY_SECRET_KEY);
    hmac.update(JSON.stringify(payload));
    const signature = hmac.digest('hex');

    const opayResponse = await fetch('https://api.opaycheckout.com/api/v1/international/cashier/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${signature}`,
        'MerchantId': OPAY_MERCHANT_ID
      },
      body: JSON.stringify(payload)
    });

    const opayData = await opayResponse.json();

    if (opayData.code === '00000') {
      // Returns the secure checkout URL from OPay to the frontend
      return NextResponse.json({ url: opayData.data.cashierUrl });
    } else {
      return NextResponse.json({ error: 'OPay refused request', details: opayData.message }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
