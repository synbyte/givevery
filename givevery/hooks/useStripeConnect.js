import { useState, useEffect } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";

export const useStripeConnect = (connectedAccountId) => {
  const [stripeConnectInstance, setStripeConnectInstance] = useState();

  useEffect(() => {
    if (connectedAccountId) {
      const fetchClientSecret = async () => {
        const response = await fetch("/api/account-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            account: connectedAccountId,
          }),
        });

        if (!response.ok) {
          // Handle errors on the client side here
          const { error } = await response.json();
          throw ("An error occurred: ", error);
        } else {
          const { client_secret: clientSecret } = await response.json();
          return clientSecret;
        }
      };

      setStripeConnectInstance(
        loadConnectAndInitialize({
          publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
          fetchClientSecret,
          fonts: [
            {
              url: "https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap",
              family: "Quicksand",
            },
          ],
          appearance: {
            theme: "night",
            variables: {
              colorPrimary: "#00DB25",
              badgeNeutralColorBackground: "#2DA9A9",
              badgeNeutralColorBorder: "#26E1F2",
              badgeSuccessColorBackground: "#133D00",
              fontFamily:"Quicksand",
            },
          },
        })
      );
    }
  }, [connectedAccountId]);

  return stripeConnectInstance;
};

export default useStripeConnect;