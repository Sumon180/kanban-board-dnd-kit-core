"use client";

import React, { useState } from "react";
import PlusIcon from "./icons/PlusIcon";
import ColumnContainer from "./ColumnContainer";

const Kanbanboard = () => {
  const [columns, setColumn] = useState<Column[]>([]);
  console.log(columns);

  return (
    <div
      className="m-auto flex min-h-screen w-full
    items-center overflow-x-auto
    overflow-y-hidden px-[40px]"
    >
      <div className="m-auto flex gap-5">
        <div className="flex gap-5">
          {columns.map((column) => (
            <ColumnContainer
              key={column.id}
              column={column}
              deleteColumn={deleteColumn}
            />
          ))}
        </div>
        <button
          onClick={() => {
            createNewColumn();
          }}
          className="flex gap-2 h-[60px] w-[350px] min-w-[350px] cursor-pointer
        rounded-lg bg-slate-900 border-2 border-slate-600
        p-4 ring-rose-500 hover:ring-2"
        >
          <PlusIcon />
          Add Column
        </button>
      </div>
    </div>
  );

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generatedId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumn([...columns, columnToAdd]);
  }

  function deleteColumn(id: Id) {
    const updatedColumns = columns.filter((column) => column.id !== id);
    setColumn(updatedColumns);
  }
};

function generatedId() {
  return Math.floor(Math.random() * 10001);
}

export default Kanbanboard;
