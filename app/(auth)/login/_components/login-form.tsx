"use client";

import Button from "@/components/button/button";
import { BasicInput } from "@/components/input-field/basic-input";
import PasswordInput from "@/components/input-field/password-input";
import { useCustomOverlay } from "@/hooks/use-custom-overlay";
import { login } from "@/lib/apis/auth";
import { PostAuthSigninResponse } from "@/lib/apis/type";
import { setCookie } from "@/lib/cookies/cookieAction";
import { loginSchema } from "@/schemas/auth";
import { LoginInputValue } from "@/type/user";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next-nprogress-bar";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import useAuthError from "../../_hooks/use-auth-error";
import ModalSendEmail from "../../reset-password/_components/modal-send-email";

export default function LoginForm() {
  const modalSendEmailOverlay = useCustomOverlay(({ close }) => (
    <ModalSendEmail close={close} />
  ));
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<LoginInputValue>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  const handleError = useAuthError<LoginInputValue>(setError);

  const mutation = useMutation({
    mutationFn: async (data: LoginInputValue) => {
      const response = (await login(data)) as PostAuthSigninResponse;
      return response;
    },
    onSuccess: async (response: PostAuthSigninResponse) => {
      await setCookie("accessToken", response.accessToken, { maxAge: 60 * 60 });
      await setCookie("refreshToken", response.refreshToken, {
        maxAge: 60 * 60 * 24 * 7,
      });
      // NOTE - 로그인 후 랜딩으로 리다이렉트를 위해 push 헤더 업데이트를 위해 refresh
      router.push("/");
      router.refresh();
      setIsLoading(true);
    },
    onError: handleError,
  });

  const onSubmit: SubmitHandler<LoginInputValue> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-6">
        <BasicInput<LoginInputValue>
          register={register}
          id="email"
          placeholder="이메일을 입력해 주세요"
          type="email"
          label="이메일"
          error={errors.email?.message}
        />
        <PasswordInput<LoginInputValue>
          register={register}
          id="password"
          placeholder="비밀번호를 입력해 주세요"
          label="비밀번호"
          error={errors.password?.message}
        />
      </div>
      <button
        type="button"
        className="ml-auto mt-3 flex text-sm font-medium text-brand-primary underline"
        onClick={modalSendEmailOverlay.open}
      >
        비밀번호를 잊으셨나요?
      </button>
      <Button
        btnSize="large"
        btnStyle="solid"
        className="mt-10 w-full"
        disabled={!isValid || isLoading}
      >
        {mutation.isPending ? "로그인 중" : "로그인"}
      </Button>
    </form>
  );
}
