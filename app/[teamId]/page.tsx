"use client";

import { GetTeamIdGroupsIdResponse } from "@/lib/apis/type";
import { useEffect, useState } from "react";

import fetchData from "../../lib/apis/group";
import TaskLists from "./_components/task-lists";

export default function TeamPage({ params }: { params: { teamId: string } }) {
  const [taskLists, setTaskLists] = useState<
    GetTeamIdGroupsIdResponse["taskLists"]
  >([]);

  useEffect(() => {
    const getTeamInfo = async () => {
      const teamInfo = await fetchData({ teamId: params.teamId });
      if (teamInfo && teamInfo.taskLists) {
        setTaskLists(teamInfo.taskLists);
      }
    };
    getTeamInfo();
  }, [params.teamId]);

  return (
    <div className="flex flex-col justify-center gap-[20px] pt-[100px]">
      <TaskLists taskLists={taskLists} />
    </div>
  );
}
