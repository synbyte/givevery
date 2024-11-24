import DonationFormWrapper from "@/components/donation/donation-form-wrapper";

export default function Page() {
  return (
    <div className="flex flex-col flex-1 items-center space-y-6 w-full">
      <div className="w-full border-b">
        <p className="pb-3 text-3xl font-bold">Your Donation Form</p>
      </div>

      <div className="flex flex-1 gap-2 p-3 w-full rounded-md border content">
        <DonationFormWrapper />
      </div>
    </div>
  );
}