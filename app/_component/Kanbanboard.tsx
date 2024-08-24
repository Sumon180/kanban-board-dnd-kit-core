"use client";

import React, { useMemo, useState } from "react";
import PlusIcon from "./icons/PlusIcon";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";

const Kanbanboard = () => {
  const [columns, setColumn] = useState<Column[]>([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [tasks, setTask] = useState<Task[]>([]);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  console.log(columns);

  return (
    <div
      className="m-auto flex min-h-screen w-full
    items-center overflow-x-auto
    overflow-y-hidden px-[40px]"
    >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="m-auto flex gap-5">
          <div className="flex gap-5">
            <SortableContext items={columnsId}>
              {columns.map((column) => (
                <ColumnContainer
                  key={column.id}
                  column={column}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  tasks={tasks.filter((task) => task.columnId === column.id)}
                  deleteTask={deleteTask}
                />
              ))}
            </SortableContext>
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
        <DragOverlay>
          {activeColumn && (
            <ColumnContainer
              column={activeColumn}
              deleteColumn={deleteColumn}
              updateColumn={updateColumn}
              createTask={createTask}
              tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
              deleteTask={deleteTask}
            />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generatedId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumn([...columns, columnToAdd]);
  }

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generatedId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
    setTask([...tasks, newTask]);
  }

  function deleteTask(id: Id) {
    const filterTasks = tasks.filter((task) => task.id !== id);
    setTask(filterTasks);
  }

  function deleteColumn(id: Id) {
    const filterColumns = columns.filter((column) => column.id !== id);
    setColumn(filterColumns);
  }

  function updateColumn(id: Id, title: string) {
    const updatedColumns = columns.map((column) =>
      column.id === id ? { ...column, title } : column
    );
    setColumn(updatedColumns);
  }

  function onDragStart(event: DragStartEvent) {
    // console.log("DRAG START", event);
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    // console.log("DRAG END",event);
    const { active, over } = event;
    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    setColumn((colum) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumnId
      );
      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId
      );

      return arrayMove(colum, activeColumnIndex, overColumnIndex);
    });
  }
};

function generatedId() {
  return Math.floor(Math.random() * 10001);
}

export default Kanbanboard;
