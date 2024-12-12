'use client'
import { useEffect, useState } from "react"

type Props = {
    connectedAccountId: string | undefined
}

export default  function TotalOneTimeDonations({ connectedAccountId }: Props) {
    const [donations, setDonations] = useState()
    const [numOfDonations, setNumOfDonations] = useState<number>()
    const [totalDonations, setTotalDonations] = useState<number>()
    const [averageDonation, setAverageDonation] = useState<number>() 
    const [subscriptions, setSubscriptions] = useState()

    useEffect(() => {
        
        const fetchDonations = async (account:string) => {
          console.log("Fetching donations for: ", connectedAccountId)
          const response = await fetch('/api/list-payment-intents', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              connectedAccountId: account,
            })
          })
          const data = await response.json();
          console.log(data)
          setDonations(data)
          setNumOfDonations(data.length)
    
          if (Array.isArray(data)) {
            const total = data.reduce((sum: number, donation: {amount: number}) => sum + donation.amount, 0);
            setTotalDonations(total);
            setAverageDonation(Number((total / data.length || 0).toFixed(2)));
          } else {
            console.error('Data is not an array:', data);
            setTotalDonations(0);
            setAverageDonation(0);
          }
    
    
        }
        if (connectedAccountId !== undefined) {
          fetchDonations(connectedAccountId);
        }
    
    }, [connectedAccountId])
    useEffect(() => {
        const fetchSubscriptions = async (account: string) => {
            const response = await fetch('/api/list-subscriptions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    connectedAccountId: account,
                })
            })
            const data = await response.json();
            setSubscriptions(data)
            console.log("subs",data)
        }
        if (connectedAccountId !== undefined) {
            fetchSubscriptions(connectedAccountId);
        }
    }, [connectedAccountId])
  return (
      <div className="flex gap-10">
          <div className="flex flex-col">
            <p className="text-sm font-bold text-lime-600">One-time</p>
              <p className="text-3xl font-bold">${totalDonations}</p>
              <p className="text-xs font-bold text-gray-400">{numOfDonations} donations</p>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-bold text-lime-600">Average Donation</p>
            <p className="text-3xl font-bold">${averageDonation}</p>
          </div>
          <div className="flex flex-col">
              <p className="text-sm font-bold text-lime-600">Subscriptions</p>
              <p className="text-3xl font-bold">{subscriptions?.length}</p>
          </div>
      </div>
  )
}