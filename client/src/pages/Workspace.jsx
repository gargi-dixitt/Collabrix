import { useParams } from "react-router-dom";

const Workspace = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold">
        Workspace
      </h1>

      <p className="text-zinc-400 mt-2">
        Workspace ID: {id}
      </p>
    </div>
  );
};

export default Workspace;