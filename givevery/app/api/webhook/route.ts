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
            'whsec_c8c92143a769a2ae97eaa7a52664f971f67789a4a2830ec9e07c1944b4703bfb'
        )
        console.log(body)
    } catch (error) {
        return new NextResponse("Invalid Signature", {status: 400})
    }

    const session = event.data.object as Stripe.Checkout.Session
    return new NextResponse("GOTIT")
}
