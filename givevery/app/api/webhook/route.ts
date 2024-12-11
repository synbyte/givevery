import { stripe } from '@/utils/utils'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'

export async function POST(req:Request) {
    const body = await req.text();
    const signature = headers().get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        console.log("Webhook try/catch started!")
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET as string
        )
        console.log(body)
    } catch (error) {
        return new NextResponse("Invalid Signature", {status: 400})
    }

    const dataObject = event.data.object
    
    return new NextResponse("GOTIT")
}
