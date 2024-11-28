import { hasCookie } from "@/lib/cookies/cookieAction";

import LoggedInHeader from "./logged-in-header";
import NoneLoginHeader from "./none-login-header";

export default async function Header() {
  const isLoggedIn = await hasCookie("refreshToken");

  return (
    <header className="fixed left-0 right-0 top-0 z-40 h-[60px] w-full bg-background-secondary px-4">
      <div className="flex h-full items-center justify-between xl:mx-auto xl:max-w-[1200px]">
        {isLoggedIn ? <LoggedInHeader /> : <NoneLoginHeader />}
      </div>
    </header>
  );
}
