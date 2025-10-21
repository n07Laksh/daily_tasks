import { useLocalSearchParams } from 'expo-router';
import TaskForm from "./task_form";

export default function EditTask() {
  const { pos } = useLocalSearchParams();
  console.log(typeof pos)
  return (
    <>
      <TaskForm index={pos}/>
    </>
  );
}
