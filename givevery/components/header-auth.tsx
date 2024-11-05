import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { Settings } from "lucide-react";
import { ThemeSwitcher } from "./theme-switcher";
import { stripe } from '@/utils/utils'


export default async function AuthButton() {

  const {
    data: { user },
  } = await createClient().auth.getUser();
  const nonprofitId = user?.id;
  
  let account;
  if (nonprofitId) {
    const { data } = await createClient()
      .from('nonprofits')
      .select("*")
      .eq('id', nonprofitId)
      .single();
    
    if (data?.connected_account_id) {
      const stripeAccount = await stripe.accounts.retrieve(data.connected_account_id);
      account = stripeAccount.requirements?.currently_due;
    }
  }
  console.log("Reqs Due: ", account)


  if (!hasEnvVars) {
    return (
      <>
        <div className="flex gap-6 items-center">
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
    <div className="flex items-center gap-2">
      <p className="text-xs">Logged in as {user.email}!</p>
      {account ?
        <Link href={`/protected/${nonprofitId}/settings`}><Button size={'sm'} className="ring-2 text-red-600 font-bold text-xl ring-red-500" variant={"secondary"}><Settings className="text-red-600" size={16} />!</Button></Link>
        :
        <Link href={`/protected/${nonprofitId}/settings`}><Button size={'sm'} variant={"secondary"}><Settings size={16} /></Button></Link>
      }
      <ThemeSwitcher />
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"} size={'sm'}>
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
