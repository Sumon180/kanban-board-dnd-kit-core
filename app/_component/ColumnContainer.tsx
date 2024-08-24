import React from "react";
import DeleteIcon from "./icons/DeleteIcon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
}

const ColumnContainer = (props: Props) => {
  const { column, deleteColumn } = props;

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className=" w-[350px] h-[500px] 
  max-h-[500px] bg-gray-900 opacity-50 rounded-md border border-rose-500"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-slate-800 w-[350px] h-[500px] 
  max-h-[500px] rounded-md flex flex-col"
    >
      {/* Column title */}
      <div
        {...attributes}
        {...listeners}
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
