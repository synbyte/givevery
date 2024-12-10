"use client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddressElement } from "@stripe/react-stripe-js";

const customerSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
});

export default function CustomerForm({
  connectedAccountId,
  onBack,
  onNext,
  setClientSecret,
  amount,
}: {
        connectedAccountId: string;
        amount: string;
  onBack: () => void;
  onNext: () => void;
  setClientSecret: (clientSecret: string) => void;
}) {
  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const onSubmit = async (data: any) => {
    console.log("Creating customer!");
    const response = await fetch(`/api/create-customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        connectedAccountId,
      }),
    });
    const rdata = await response.json();
    const customerId = rdata.customerId;
      console.log("Customer ID: ", customerId);
      const subscriptionResponse = await fetch(`/api/create-subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          connectedAccountId,
            customerId,
          amount
        }),
      });
      const subscriptionData = await subscriptionResponse.json();
      setClientSecret(subscriptionData.latest_invoice.payment_intent.client_secret);
      onNext();

  };

  return (
    <>
      <CardHeader>
        <CardTitle>Tell us about yourself</CardTitle>
        <CardDescription>
          We need to gather some information so we can customize your donation
          you can manage in later on.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <Form {...form}>
          <form
            className="space-y-5"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="uppercase tracking-wide text-xs">
                      * First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="First Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="uppercase tracking-wide text-xs">
                      *Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Last Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase tracking-wide text-xs">
                    * Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormItem>
                        <FormLabel className="uppercase tracking-wide text-xs">* Billing Address</FormLabel>
                        <AddressElement options={{
                            mode: 'billing',
                            allowedCountries: ['US'],
                            fields: {
                                phone: 'always',
                            },
                            validation: {
                                phone: {
                                    required: 'always',
                                },
                            },
                        }} />
                    </FormItem> */}
            <div className="flex justify-evenly gap-5 mt-4">
              <Button
                className="flex-1"
                type="button"
                onClick={onBack}
              >
                Back
              </Button>
              <Button
                className="flex-1 bg-green-500 hover:bg-green-600 focus:ring-green-500"
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
              >
                Next
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </>
  );
}
