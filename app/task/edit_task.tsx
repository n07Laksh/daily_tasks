import { useLocalSearchParams } from "expo-router";
import TaskForm from "./task_form";

export default function EditTask() {
  const { task_id } = useLocalSearchParams();
  let id = task_id ? parseInt(Array.isArray(task_id) ? task_id[0] : task_id) : undefined;
  return (
    <>
      {/* passing pos to dynamically render <TaskForm  />
          ? ${pos} param has value that mean the user trying to edit the task, then <TaskForm /> as Edit form.
          : user trying to create a new task from scratch.
    */}
      <TaskForm id={id} />
    </>
  );
}
