import { createClient } from '@/utils/supabase/server';
import DonationForm from '@/app/protected/donation-form/page';

export default async function NonprofitDonationPage({ params }: { params: { nonprofitId: string } }) {
  const supabase = createClient();
  const { data: nonprofit, error } = await supabase
    .from('nonprofits')
    .select('name')
    .eq('id', params.nonprofitId)
    .single();

  if (error) {
    return <div>Nonprofit not found</div>;
  }

  return (
    <div>
      <h1>{nonprofit.name} Donation Page</h1>
      <DonationForm nonprofitId={params.nonprofitId} />
    </div>
  );
}