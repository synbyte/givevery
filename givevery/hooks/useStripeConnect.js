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
          appearance: {
            overlays: "modal",

            variables: {
              colorPrimary: "#00C220",
              colorBackground: "#FFFFFF",
              buttonPrimaryColorBackground: "#08D42A",
              buttonPrimaryColorBorder: "#4DFF6A",
              buttonPrimaryColorText: "#FFFFFF",
              borderRadius: "24px",
              colorBorder:"#000000",
              formBorderRadius: "24px",
              overlayBorderRadius: "24px",
              overlayZIndex: 5,
              spacingUnit: "8px",
              fontFamily: "Roboto",
            },
          },
        })
      );
    }
  }, [connectedAccountId]);

  return stripeConnectInstance;
};

export default useStripeConnect;