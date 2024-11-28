import { hasCookie } from "@/lib/cookies/cookieAction";
import Image from "next/image";

import LinkButton from "../button/link-button";
import LoggedInButton from "./logged-in-button";

export default async function LandingHeader() {
  const isLoggedIn = await hasCookie("refreshToken");

  return (
    <section className="relative h-[547px] w-full xl:mx-auto xl:max-w-[1920px]">
      <Image
        src="/images/landing-header-large.webp"
        fill
        priority
        alt="할 일 옮기는 캐릭터와 기차"
        className="object-cover"
      />
      <div className="relative flex flex-col items-center justify-center gap-1 pt-[55px] md:pt-[100px] xl:pt-[84px]">
        <h2 className="text-2xl font-semibold text-text-primary md:text-[40px]">
          함께 만들어가는 투두 리스트 🛠️
        </h2>
        <h1 className="z-10 bg-gradient-to-r from-brand-primary to-brand-tertiary bg-clip-text text-[32px] font-semibold text-brand-primary text-transparent md:text-[48px] xl:text-[64px]">
          kkom-kkom
        </h1>
        {isLoggedIn ? (
          <LoggedInButton />
        ) : (
          <LinkButton
            btnSize="large"
            btnStyle="gradient"
            href="/login"
            className="relative z-20 mt-[340px] w-[343px] xl:mt-[360px]"
          >
            지금 시작하기
          </LinkButton>
        )}
      </div>
    </section>
  );
}
