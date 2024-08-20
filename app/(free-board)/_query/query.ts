"use client";

import { getArticlesArticleId } from "@/lib/apis/article";
import { getArticlesArticleIdComments } from "@/lib/apis/article-comment";
import { getUser } from "@/lib/apis/user";
import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

export default function useArticlesCommentsQuery(articleId: number) {
  return useSuspenseInfiniteQuery({
    queryKey: ["comments", { articleId }],
    queryFn: ({ pageParam }) =>
      getArticlesArticleIdComments({ cursor: pageParam, articleId }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}

export function useUserQuery() {
  return useSuspenseQuery({
    queryKey: ["getUser"],
    queryFn: getUser,
  });
}

export function useArticleQuery(articleId: number) {
  return useSuspenseQuery({
    queryKey: ["article", { articleId }],
    queryFn: () => getArticlesArticleId({ articleId }),
  });
}
