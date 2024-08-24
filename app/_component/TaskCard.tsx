import React, { useState } from "react";
import DeleteIcon from "./icons/DeleteIcon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

const TaskCard = (props: Props) => {
  const { task, deleteTask, updateTask } = props;
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editTask, setEditTask] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editTask,
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
        className="h-[100px] min-h-[100px] 
  bg-gray-900 opacity-50 rounded-md border border-rose-500"
      />
    );
  }

  const toggleEditTask = () => {
    setEditTask(!editTask);
    setMouseIsOver(false);
  };

  if (editTask) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-slate-900 p-1 rounded h-[100px] min-h-[100px]
      hover:ring-1 hover:ring-inset hover:ring-rose-500
      cursor-move"
      >
        <textarea
          className="h-[90%] w-full resize-none border-none rounded 
        bg-transparent text-white outline-none"
          value={task.content}
          autoFocus
          placeholder="Task content here"
          onBlur={toggleEditTask}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) toggleEditTask();
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditTask}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      className="bg-slate-900 p-1 rounded relative h-[100px] min-h-[100px]
      hover:ring-1 hover:ring-inset hover:ring-rose-500
      cursor-move task"
    >
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>
      {mouseIsOver && (
        <button
          onClick={() => deleteTask(task.id)}
          className="bg-slate-900 stroke-gray-500 hover:stroke-white absolute right-1 top-1"
        >
          <DeleteIcon />
        </button>
      )}
    </div>
  );
};

export default TaskCard;
