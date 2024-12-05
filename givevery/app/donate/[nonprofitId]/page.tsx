import React from 'react'
import DonationForm from '@/components/newform/donationForm'

type Props = {
  params: {
    nonprofitId: string
  }
}

export default function page({ params }: Props) {
  return (
    <div><DonationForm connectedAccountId={params.nonprofitId}/></div>
  )
}