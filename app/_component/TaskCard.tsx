import React, { useState } from "react";
import DeleteIcon from "./icons/DeleteIcon";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
}

const TaskCard = (props: Props) => {
  const { task, deleteTask } = props;
  const [mouseIsOver, setMouseIsOver] = useState(false);

  return (
    <div
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      className="bg-slate-900 p-1 rounded relative hover:ring-1 hover:ring-inset hover:ring-rose-500"
    >
      {task.content}
      {mouseIsOver && (
        <button
          onClick={() => deleteTask(task.id)}
          className="stroke-gray-500 hover:stroke-white absolute right-1 top-1"
        >
          <DeleteIcon />
        </button>
      )}
    </div>
  );
};

export default TaskCard;
