import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const stored = localStorage.getItem("user");
      const token = stored ? JSON.parse(stored).token : null;

      if (!token) return navigate("/login");

      const res = await fetch("http://localhost:5000/profile/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!data.user) return navigate("/login");

      setUser(data.user);
    } catch (error) {
      console.log("Error fetching user:", error);
      navigate("/login");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Dashboard
        </h1>

        <p className="text-gray-300 mb-6">
          Welcome back,
          <span className="text-blue-400 font-semibold">
            {" "}
            {user?.name}
          </span>
          !
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/tasks")}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
            View Tasks
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
          >
            View Profile
          </button>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
