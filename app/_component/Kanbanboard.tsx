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

const Kanbanboard = () => {
  const [columns, setColumn] = useState<Column[]>([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [tasks, setTask] = useState<Task[]>([]);

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

    const activeTaskId = active.id;
    const overId = over.id;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverAColumn = over.data.current?.type === "Column";

    if (!isActiveATask || !over) return;

    if (isOverAColumn) {
      setTask((tasks) => {
        const activeTaskIndex = tasks.findIndex(
          (task) => task.id === activeTaskId
        );

        tasks[activeTaskIndex] = {
          ...tasks[activeTaskIndex],
          columnId: overId,
        };

        return [...tasks];
      });
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeTaskId = active.id;
    const overId = over.id;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
    const isOverAColumn = over.data.current?.type === "Column";

    if (!isActiveATask) return;

    setTask((tasks) => {
      const activeTaskIndex = tasks.findIndex(
        (task) => task.id === activeTaskId
      );
      let newTasks = [...tasks];

      if (isOverATask) {
        const overTaskIndex = tasks.findIndex((task) => task.id === overId);

        // Check if it's the same column
        if (tasks[activeTaskIndex].columnId === tasks[overTaskIndex].columnId) {
          newTasks = arrayMove(newTasks, activeTaskIndex, overTaskIndex);
        } else {
          newTasks[activeTaskIndex] = {
            ...newTasks[activeTaskIndex],
            columnId: tasks[overTaskIndex].columnId,
          };
          newTasks = arrayMove(newTasks, activeTaskIndex, overTaskIndex);
        }
      } else if (isOverAColumn) {
        // When dragging over an empty column
        newTasks[activeTaskIndex] = {
          ...newTasks[activeTaskIndex],
          columnId: overId,
        };
      }

      return newTasks;
    });
  }
};

function generatedId() {
  return Math.floor(Math.random() * 10001);
}

export default Kanbanboard;
