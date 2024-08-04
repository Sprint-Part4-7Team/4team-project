import { getUser } from "@/app/action";
import { LOGGED_IN_USER_CONTENT } from "@/constants/popover-content";
import Logo from "@/public/icons/logo.svg";
import UserIcon from "@/public/icons/user.svg";
import Link from "next/link";

import Popover from "../popover/popover";
import GroupDropdown from "./group-dropdown";
import PopoverTrigger from "./popover-trigger";
import SideMenu from "./side-menu";

export default async function LoggedInHeader() {
  const { nickname, memberships } = await getUser();
  return (
    <>
      <div className="flex items-center gap-4">
        {/* TODO - 클릭 시 사이드 메뉴 memberships 목록 + 자유게시판 */}
        <SideMenu />
        <Link href="/" className="flex items-center gap-1">
          <div className="size-4 xl:size-6">
            <Logo width={"100%"} height={"100%"} />
          </div>
          <h2 className="text-xl font-bold text-brand-primary">KKOM-KKOM</h2>
        </Link>
        {memberships.length !== 0 ? (
          <GroupDropdown memberships={memberships} />
        ) : (
          // TODO - 팀 생성하기 페이지로 이동
          <p className="text-base font-medium text-text-primary">팀 생성하기</p>
        )}
      </div>
      <Popover
        content={LOGGED_IN_USER_CONTENT}
        triggerComponent={<PopoverTrigger nickname={nickname} />}
      />
    </>
  );
}
