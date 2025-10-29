 export interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string;
  priority: string;
  interval: string;
  tasks: string[];
  pinned?: boolean;
  modified_at: string;
}
