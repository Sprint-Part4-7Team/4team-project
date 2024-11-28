import Modal from "@/components/modal/modal";
import { deleteCookie } from "@/lib/cookies/cookieAction";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next-nprogress-bar";
import { useCallback } from "react";

interface ModalLogoutProps {
  close: () => void;
}

export default function ModalLogout({ close }: ModalLogoutProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = useCallback(async () => {
    router.push("/");
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");
    queryClient.invalidateQueries({ queryKey: ["getUser"] });
    router.refresh();
    close();
  }, [router, close]);

  return (
    <Modal close={close} closeOnFocusOut>
      <div className="px-9">
        <Modal.Title className="my-6">로그아웃 하시겠어요?</Modal.Title>
        <Modal.TwoButtonSection
          closeBtnStyle="outlined_secondary"
          confirmBtnStyle="danger"
          buttonDescription="로그아웃"
          close={close}
          onClick={logout}
        />
      </div>
    </Modal>
  );
}
