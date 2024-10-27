import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { Settings } from "lucide-react";
import { ThemeSwitcher } from "./theme-switcher";
import {stripe} from '@/utils/utils'


export default async function AuthButton() {
  
  const {
    data: { user },
  } = await createClient().auth.getUser();
  const nonprofitId = user.id
  
  const {data} = await createClient().from('nonprofits').select("*").eq('id',nonprofitId).single()
  
  const account = (await stripe.accounts.retrieve(data.connected_account_id)).requirements?.currently_due;
  console.log(account)
  

  if (!hasEnvVars) {
    return (
      <>
        <div className="flex gap-4 items-center">
          <div>
            <Badge
              variant={"default"}
              className="font-normal pointer-events-none"
            >
              Please update .env.local file with anon key and url
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              size="sm"
              variant={"outline"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant={"default"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }
  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      {account? 
      <Button className="border border-red-500" variant={"secondary"}><Link className="flex font-bold text-red-500 text-xl justify-center items-center" href={`/protected/${nonprofitId}/settings`}><Settings size={16}/>!</Link></Button>
      :
      <Button variant={"secondary"}><Link href={`/protected/${nonprofitId}/settings`}><Settings size={16} /></Link></Button>
      }
      <ThemeSwitcher />
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
