import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
export default async function Page({params}) {
    const supabase = createClient()
    const { data:nonprofit, error } = await supabase.from('nonprofits').select('*').eq('id', params.nonprofitId).single()
    if (error) {
        console.log(error)
    } else {
        console.log(nonprofit)
    }
    
    return <div className="flex flex-col space-y-5">
        <p className="text-5xl">Settings Page</p>
              {!nonprofit.connected_account_id ? (
                <>
                  <p>You need to connect your stripe account to the platform before you can accept donations!</p>
                  <Button>Connect account</Button>
                </>
              ) : (<span className="flex">
                <p className="px-1">Account succesfully connected: </p>
                <p className="uppercase text-xs"> {nonprofit.connected_account_id}</p>
                </span>
              )}
        </div>
}