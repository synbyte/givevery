import React from 'react'
import DonationForm from '@/components/newform/donationForm'

type Props = {
  params: {
    connectedAccountId: string
  }
}

export default function page({ params }: Props) {
  return (
    <div><DonationForm connectedAccountId={params.connectedAccountId}/></div>
  )
}