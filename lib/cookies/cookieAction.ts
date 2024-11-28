"use server";

import { cookies } from "next/headers";

async function cookieStore() {
  const store = await cookies();
  return store;
}

export async function getCookie(name: string) {
  const store = await cookieStore();
  return store.get(name)?.value;
}

export async function setCookie(
  name: string,
  value: string,
  options?: { maxAge: number },
) {
  const store = await cookieStore();
  store.set(name, value, { ...options, httpOnly: true });
}

export async function deleteCookie(name: string) {
  const store = await cookieStore();
  store.delete(name);
}

export async function hasCookie(name: string) {
  const store = await cookieStore();
  return store.has(name);
}
