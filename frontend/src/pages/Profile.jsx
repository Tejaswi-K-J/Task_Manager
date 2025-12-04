import { useEffect, useState } from "react";
import { getProfile, updateProfile, changePassword } from "../api/profile.api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  // Profile fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Messages
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Change password fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Load profile data
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getProfile();
        setName(res.data.user.name);
        setEmail(res.data.user.email);
      } catch (err) {
        console.log("Profile load error:", err);
        navigate("/login");
      }
    };

    loadUser();
  }, []);

  // --------------------------------------------------------
  // UPDATE PROFILE HANDLER
  // --------------------------------------------------------
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await updateProfile({ name, email });
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      console.log("Profile update error:", err);
      setMessage({ type: "error", text: "Update failed" });
    }

    setLoading(false);
  };

  // --------------------------------------------------------
  // CHANGE PASSWORD HANDLER
  // --------------------------------------------------------
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match!" });
      return;
    }

    try {
      const res = await changePassword({ oldPassword, newPassword });
      setMessage({ type: "success", text: res.data.message });

      // clear fields
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.log("Password change error:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to change password",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center px-5 py-10">
      <div className="bg-gray-800 p-8 rounded-xl w-full max-w-lg shadow-lg">

        {/* SCREEN TITLE */}
        <h1 className="text-3xl font-bold text-center mb-6">Your Profile</h1>

        {/* GLOBAL MESSAGE */}
        {message && (
          <p
            className={`text-center mb-4 ${
              message.type === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {message.text}
          </p>
        )}

        {/* -------------------------------------------------- */}
        {/* UPDATE PROFILE FORM */}
        {/* -------------------------------------------------- */}
        <h2 className="text-xl font-semibold mb-3">Update Profile</h2>

        <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">

          <input
            type="text"
            value={name}
            placeholder="Full Name"
            onChange={(e) => setName(e.target.value)}
            className="p-3 rounded bg-gray-700 text-white"
          />

          <input
            type="email"
            value={email}
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded bg-gray-700 text-white"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-lg font-semibold"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>

        {/* -------------------------------------------------- */}
        {/* CHANGE PASSWORD FORM */}
        {/* -------------------------------------------------- */}
        <h2 className="text-xl font-semibold mt-10 mb-3">Change Password</h2>

        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">

          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="p-3 rounded bg-gray-700 text-white"
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="p-3 rounded bg-gray-700 text-white"
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-3 rounded bg-gray-700 text-white"
          />

          <button
            type="submit"
            className="bg-yellow-600 hover:bg-yellow-700 py-2 rounded-lg text-lg font-semibold"
          >
            Change Password
          </button>
        </form>

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 w-full bg-gray-600 hover:bg-gray-700 py-2 rounded-lg"
        >
          Back to Dashboard
        </button>

      </div>
    </div>
  );
}
