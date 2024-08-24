import React from "react";
import DeleteIcon from "./icons/DeleteIcon";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
}

const ColumnContainer = (props: Props) => {
  const { column, deleteColumn } = props;

  return (
    <div
      className="bg-slate-800 w-[350px] h-[500px] 
  max-h-[500px] rounded-md flex flex-col"
    >
      {/* Column title */}
      <div
        className="bg-slate-900 h-[60px] cursor-grab rounded-md rounded-b-none 
      p-3 font-bold border-slate-800 border-4
      flex items-center justify-between"
      >
        <div className="flex gap-2">
          <div
            className="flex justify-center items-center
        bg-slate-800 px-2 py-1 text-sm rounded-full"
          >
            0
          </div>
          {column.title}
        </div>
        <button
          onClick={() => {
            deleteColumn(column.id);
          }}
          className="stroke-gray-500 hover:stroke-white"
        >
          <DeleteIcon />
        </button>
      </div>

      {/* Column task container */}
      <div className="flex flex-grow">Content</div>

      {/* Add task footer */}
      <div>Footer</div>
    </div>
  );
};

export default ColumnContainer;
