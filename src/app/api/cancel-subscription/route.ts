import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { db } from '@/utils/db';
import { UserSubscription } from '@/utils/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    // 1. Find the user's subscription in our database
    const subscriptions = await db
      .select()
      .from(UserSubscription)
      .where(eq(UserSubscription.email, email));

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ success: true, message: 'No active subscription found' });
    }

    const subscription = subscriptions[0];
    
    // If subscription has a paymentId, cancel it in Razorpay
    if (subscription.paymentId) {
      try {
        const instance = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID || '',
          key_secret: process.env.RAZORPAY_KEY_SECRET || '',
        });
        
        // Cancel subscription in Razorpay
        await instance.subscriptions.cancel(subscription.paymentId);
      } catch (razorpayError) {
        console.error('Error canceling Razorpay subscription:', razorpayError);
        // Continue with database update even if Razorpay fails
      }
    }

    // Update the subscription status in our database
    await db
      .update(UserSubscription)
      .set({ active: false })
      .where(eq(UserSubscription.email, email));

    return NextResponse.json({ success: true, message: 'Subscription canceled successfully' });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}