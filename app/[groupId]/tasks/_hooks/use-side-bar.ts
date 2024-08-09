import React, { useState } from "react";

const useSideBar = () => {
  const [isSideBarOpen, setIsSiderOpen] = useState<boolean>(false);
  const [todoId, setSideBarData] = useState<number>(-1);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget.dataset.index) {
      const id = e.currentTarget.dataset.index;
      setSideBarData(parseInt(id));
    }

    setIsSiderOpen(true);
  };
  const handleCancel = () => {
    setIsSiderOpen(false);
  };
  return { todoId, isSideBarOpen, handleClick, handleCancel };
};

export default useSideBar;
