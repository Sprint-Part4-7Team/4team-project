import { getCookie } from "@/lib/cookies/cookieAction";
import {
  ResetPasswordInputValue,
  SendEmailInputValue,
  UpdateUserInputValue,
} from "@/type/user";

import instance from "../myFetch/instance";
import {
  DeleteUserResponse,
  GetUserGroups,
  GetUserHistoryResponse,
  GetUserResponse,
  PatchUserPasswordResponse,
  PatchUserResetPasswordResponse,
  PatchUserResponse,
  PostUserSendResetPasswordEmailResponse,
} from "../type";

export async function getUser(): Promise<GetUserResponse> {
  const response = await instance<GetUserResponse>("/user", {
    withCredentials: true,
  });
  return response;
}

// NOTE - 유저가 포함한 그룹 조회
export async function gerUserGroups(): Promise<GetUserGroups> {
  const accessToken = await getCookie("accessToken");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KKOM_KKOM_URL}/user/groups`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "에러 발생");
  }
  const result: GetUserGroups = await response.json();
  return result;
}

export async function getUserHistory() {
  const response = await instance<GetUserHistoryResponse>("/user/history", {
    withCredentials: true,
  });
  return response;
}

// NOTE - 비밀번호 재설정 전 이메일 확인
export async function sendEmail(
  data: SendEmailInputValue,
): Promise<PostUserSendResetPasswordEmailResponse | string> {
  const payload = {
    ...data,
    // TODO - 빌드 환경에서만 됨 배포 후 바꾸기
    redirectUrl: `${process.env.NEXT_PUBLIC_REDIRECT_URL}`,
  };

  const response = await instance<PostUserSendResetPasswordEmailResponse>(
    "/user/send-reset-password-email",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  return response;
}

// NOTE - 비밀번호 재설정(로그인 전)
export async function resetPassword(data: {
  password: string;
  passwordConfirmation: string;
  token: string;
}): Promise<PatchUserResetPasswordResponse | string> {
  const response = await instance<PatchUserResetPasswordResponse>(
    "/user/reset-password",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  return response;
}

// NOTE - 비밀번호 재설정(계정 설정)
export async function modalResetPassword(
  data: ResetPasswordInputValue,
): Promise<PatchUserPasswordResponse | string> {
  const response = await instance<PatchUserPasswordResponse>("/user/password", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    withCredentials: true,
  });
  return response;
}

// NOTE - 계정 탈퇴
export async function deleteAccount(): Promise<DeleteUserResponse> {
  const response = await instance<DeleteUserResponse>("/user", {
    method: "DELETE",
    withCredentials: true,
  });
  return response;
}

// NOTE - 계정 수정 (닉네임, 이미지)
export async function updateAccount(
  data: UpdateUserInputValue,
): Promise<PatchUserResponse> {
  const response = await instance<PatchUserResponse>("/user", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    withCredentials: true,
  });
  return response;
}
