import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import axios from "../lib/axios";

const Project = () => {
  const { id } = useParams();

  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createTask = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "/tasks",
        {
          title,
          description,
          project: id,
          priority: "medium",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitle("");
      setDescription("");

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold mb-10">
        Project Tasks
      </h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-10">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-black border border-zinc-800 rounded-xl px-4 py-3 outline-none"
          />

          <textarea
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-black border border-zinc-800 rounded-xl px-4 py-3 outline-none h-28"
          />

          <button
            onClick={createTask}
            className="bg-white text-black py-3 rounded-xl font-semibold"
          >
            Create Task
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-semibold">
              {task.title}
            </h2>

            <p className="text-zinc-400 mt-3">
              {task.description}
            </p>

            <div className="flex items-center justify-between mt-5">
              <span className="text-sm text-zinc-500">
                {task.priority}
              </span>

              <span className="text-sm text-zinc-500">
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Project;