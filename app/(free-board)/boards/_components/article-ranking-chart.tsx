"use client";

import FireIcon from "@/public/icons/fire.svg";
import { convertDiffDateFromNow } from "@/utils/convert-date";
import Link from "next/link";

import { useArticlesQuery } from "../../_query/query";

export default function ArticleRankingChart() {
  const { data: articles } = useArticlesQuery({
    orderBy: "like",
    page: "1",
    keyword: "",
  });

  return (
    <ol className="mb-8 grid grid-flow-col grid-cols-1 grid-rows-10 gap-1.5 gap-x-10 rounded-xl border border-black border-opacity-10 bg-background-secondary p-5 text-text-primary dark:border dark:border-white dark:border-opacity-10 md:grid-cols-2 md:grid-rows-5">
      {articles.list.map((article, i) => (
        <li
          key={article.id}
          className={`flex items-center gap-1 ${i <= 2 ? "font-extrabold" : "font-base"}`}
        >
          <span className="flex flex-1 gap-1">
            <span className="hover:no-underline">{`${i + 1}. `}</span>
            <Link
              href={`/boards/${article.id}`}
              className="line-clamp-1 hover:underline"
            >
              {article.title}
            </Link>
            {i <= 2 && <FireIcon width={16} height={16} />}
          </span>
          <div className="flex-shrink-0 text-sm font-normal text-text-disabled">
            {convertDiffDateFromNow(new Date(article.updatedAt))}
          </div>
        </li>
      ))}
    </ol>
  );
}
