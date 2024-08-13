import { ResetPasswordInputValue } from "@/app/(auth)/reset-password/_components/reset-password-form";
import Button from "@/components/button/button";
import PasswordInput from "@/components/input-field/password-input";
import Modal from "@/components/modal/modal";
import { resetPasswordSchema } from "@/schemas/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";

interface ModalResetPasswordProps {
  close: () => void;
}
export default function ModalResetPassword({ close }: ModalResetPasswordProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPasswordInputValue>({
    resolver: yupResolver(resetPasswordSchema),
    mode: "onChange",
  });

  return (
    <Modal close={close} closeOnFocusOut className="p-[36px]">
      <Modal.Title>비밀번호 변경하기</Modal.Title>
      <form>
        <div className="mb-6 mt-4 flex flex-col gap-4">
          <PasswordInput<ResetPasswordInputValue>
            id="password"
            placeholder="새 비밀번호를 입력해 주세요"
            label="새 비밀번호"
            error={errors.password?.message}
            register={register}
            isModal={true}
          />
          <PasswordInput<ResetPasswordInputValue>
            id="passwordConfirmation"
            placeholder="새 비밀번호를 다시 한 번 입력해 주세요"
            label="새 비밀번호 확인"
            error={errors.passwordConfirmation?.message}
            register={register}
            isModal={true}
          />
        </div>
        <Modal.TwoButtonSection
          closeBtnStyle="outlined"
          confirmBtnStyle="solid"
          buttonDescription="변경하기"
          close={close}
          disabled={!isValid}
        />
      </form>
    </Modal>
  );
}
