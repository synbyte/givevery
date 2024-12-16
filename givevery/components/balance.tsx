import { stripe } from "@/utils/utils";

export default async function Balance({connectedAccountId}: {connectedAccountId: string}) {

    const balance = await stripe.balance.retrieve({
        stripeAccount: "acct_1QMhUgFJL4lxWA3R"
    
    });


    return <div>{balance.available[0].amount}</div>;
}
