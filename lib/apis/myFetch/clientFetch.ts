import { getCookie, setCookie } from "@/lib/cookies/cookieAction";

import { PostAuthRefreshTokenResponse } from "../type";
import type { MyFetchOptions } from "./types";

export class ResponseError extends Error {
  response?: Response;

  constructor(message: string, response?: Response) {
    let newMessage;
    switch (response?.status) {
      case 401: {
        newMessage = "다시 로그인해주세요!";
        break;
      }
      case 403: {
        newMessage = "권한이 없습니다!";
        break;
      }
      case 404: {
        newMessage = "잘못된 요청입니다!";
        break;
      }
      case 500: {
        newMessage = "서버 오류입니다!";
        break;
      }
      default: {
        newMessage = message;
      }
    }
    super(newMessage);
    this.response = response;
  }
}

export async function clientFetch(
  input: string | URL | globalThis.Request,
  init?: MyFetchOptions,
) {
  let newInit = init;

  if (newInit?.withCredentials === true) {
    const accessToken = await getCookie("accessToken");
    const headers = new Headers(init?.headers);
    headers.set("Authorization", `Bearer ${accessToken}`);
    newInit = { ...init, headers };
  }

  const res = await fetch(input, newInit);

  if (res.status === 401) {
    const refreshTokenValue = await getCookie("refreshToken");
    if (refreshTokenValue) {
      const newAccessToken = await fetch(
        `${process.env.NEXT_PUBLIC_KKOM_KKOM_URL}/auth/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refreshToken: refreshTokenValue,
          }),
        },
      );
      if (newAccessToken.ok) {
        const newAccessTokenValue: PostAuthRefreshTokenResponse =
          await newAccessToken.json();
        await setCookie("accessToken", newAccessTokenValue.accessToken, {
          maxAge: 60 * 60,
        });
        const headers = new Headers(init?.headers);
        headers.set(
          "Authorization",
          `Bearer ${newAccessTokenValue.accessToken}`,
        );
        const newInitAfterFetch = { ...init, headers };
        const newRes = await fetch(input, newInitAfterFetch);
        return newRes;
      }
      throw new ResponseError("엑세스 토큰 호출 실패", newAccessToken);
    } else {
      throw new ResponseError("로그인을 다시 해주세요!", res);
    }
  } else if (!res.ok) {
    throw new ResponseError("에러가 발생했습니다.", res);
  }
  return res;
}
