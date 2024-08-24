"use client";

import React, { useMemo, useState } from "react";
import PlusIcon from "./icons/PlusIcon";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";

const initialColumns = [
  { id: "column-1", title: "To Do" },
  { id: "column-2", title: "In Progress" },
  { id: "column-3", title: "Done" },
];

const initialTasks = [
  { id: "task-1", columnId: "column-1", content: "Implement task 1" },
  { id: "task-2", columnId: "column-1", content: "Implement task 2" },
  { id: "task-3", columnId: "column-2", content: "Implement task 3" },
];

const Kanbanboard = () => {
  const [columns, setColumn] = useState<Column[]>(initialColumns);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [tasks, setTask] = useState<Task[]>(initialTasks);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  console.log(columns);

  return (
    <div className="p-5">
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
      <div
        className="m-auto flex w-full
    items-center overflow-x-auto
    overflow-y-hidden py-3"
      >
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
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
                  updateTask={updateTask}
                />
              ))}
            </SortableContext>
          </div>
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
            {activeTask && (
              <div className="rotate-6">
                <TaskCard
                  task={activeTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generatedId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumn([columnToAdd, ...columns]);
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

  function updateTask(id: Id, content: string) {
    const updatedTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });
    setTask(updatedTasks);
  }

  function deleteColumn(id: Id) {
    const filterColumns = columns.filter((column) => column.id !== id);
    setColumn(filterColumns);
    const newTasks = tasks.filter((task) => task.columnId !== id);
    setTask(newTasks);
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
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveColumn(null);
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveATask) {
      setTask((tasks) => {
        const activeTaskIndex = tasks.findIndex((task) => task.id === activeId);

        if (isOverAColumn) {
          // Drop task onto a column
          tasks[activeTaskIndex] = {
            ...tasks[activeTaskIndex],
            columnId: overId,
          };
        }

        return [...tasks];
      });
    } else {
      // Handle dropping columns
      setColumn((columns) => {
        const activeColumnIndex = columns.findIndex(
          (col) => col.id === activeId
        );
        const overColumnIndex = columns.findIndex((col) => col.id === overId);

        return arrayMove(columns, activeColumnIndex, overColumnIndex);
      });
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveATask) {
      setTask((tasks) => {
        const activeTaskIndex = tasks.findIndex((task) => task.id === activeId);
        const activeTask = tasks[activeTaskIndex];

        if (isOverATask) {
          const overTaskIndex = tasks.findIndex((task) => task.id === overId);
          const overTask = tasks[overTaskIndex];

          if (activeTask.columnId === overTask.columnId) {
            // Move within the same column
            return arrayMove(tasks, activeTaskIndex, overTaskIndex);
          } else {
            // Move to a different column
            tasks[activeTaskIndex] = {
              ...activeTask,
              columnId: overTask.columnId,
            };
            return arrayMove(tasks, activeTaskIndex, overTaskIndex);
          }
        } else if (isOverAColumn) {
          // Move task to an empty column
          tasks[activeTaskIndex] = {
            ...tasks[activeTaskIndex],
            columnId: overId,
          };
        }

        return [...tasks];
      });
    } else {
      // Handle dragging columns
      setColumn((columns) => {
        const activeColumnIndex = columns.findIndex(
          (col) => col.id === activeId
        );
        const overColumnIndex = columns.findIndex((col) => col.id === overId);

        return arrayMove(columns, activeColumnIndex, overColumnIndex);
      });
    }
  }
};

function generatedId() {
  return Math.floor(Math.random() * 10001);
}

export default Kanbanboard;
