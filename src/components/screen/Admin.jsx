import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthProvider";
import {
  getAllUsersForAdmin,
  updateUserRole,
  getVideos,
  assignUsersToVideo,
} from "../../api/axios";

const normalizeId = (id) => String(id);

const Admin = () => {
  const { authUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(false);

  const [savingRoleFor, setSavingRoleFor] = useState(null);

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignVideoId, setAssignVideoId] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [savingAssignments, setSavingAssignments] = useState(false);

  const roles = useMemo(() => ["Viewer", "Editor", "Admin"], []);

  const selectedVideo = useMemo(
    () => videos.find((v) => normalizeId(v._id) === normalizeId(assignVideoId)),
    [videos, assignVideoId]
  );

  const selectedUserIdSet = useMemo(() => new Set(selectedUserIds.map(normalizeId)), [selectedUserIds]);

  const refreshUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await getAllUsersForAdmin();
      setUsers(res.data.users ?? []);
    } catch (err) {
      toast(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const refreshVideos = async () => {
    setLoadingVideos(true);
    try {
      // adjust limit if you want; backend default is 20 anyway
      const res = await getVideos({ limit: 100 });
      setVideos(res.data.videos ?? []);
    } catch (err) {
      toast(err.response?.data?.message || "Failed to load videos");
    } finally {
      setLoadingVideos(false);
    }
  };

  useEffect(() => {
    if (!authUser) return;
    if (authUser.role !== "Admin") return;
    refreshUsers();
    refreshVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser?.role]);

  const openAssignModal = (video) => {
    setAssignVideoId(video._id);
    setSelectedUserIds((video.assignedUsers ?? []).map(normalizeId));
    setAssignModalOpen(true);
  };

  const toggleUser = (userId) => {
    const id = normalizeId(userId);
    setSelectedUserIds((prev) => {
      const set = new Set(prev.map(normalizeId));
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return Array.from(set);
    });
  };

  const saveRole = async (userId, role) => {
    setSavingRoleFor(userId);
    try {
      await updateUserRole(userId, role);
      toast.success("Role updated");
      await refreshUsers();
    } catch (err) {
      toast(err.response?.data?.message || "Failed to update role");
    } finally {
      setSavingRoleFor(null);
    }
  };

  const saveAssignments = async () => {
    if (!assignVideoId) return;
    setSavingAssignments(true);
    try {
      // Backend: POST /api/video/:id/assign { userIds } (replaces assignedUsers)
      await assignUsersToVideo(assignVideoId, selectedUserIds);
      toast.success("Assignments saved");
      await refreshVideos();
      setAssignModalOpen(false);
      setAssignVideoId(null);
      setSelectedUserIds([]);
    } catch (err) {
      toast(err.response?.data?.message || "Failed to save assignments");
    } finally {
      setSavingAssignments(false);
    }
  };

  if (!authUser || authUser.role !== "Admin") {
    return (
      <div className="p-6 text-slate-200">
        Admin access required.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-white text-xl font-semibold">Users</h2>
          <p className="text-slate-400 text-sm">Update roles and manage video assignments.</p>
        </div>

        <div className="p-4">
          {loadingUsers ? (
            <div className="text-slate-300">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 text-slate-400 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-700/40">
                      <td className="px-4 py-3 text-slate-200">{u.fullname}</td>
                      <td className="px-4 py-3 text-slate-300">{u.email}</td>
                      <td className="px-4 py-3">
                        <select
                          value={u.role}
                          onChange={(e) => saveRole(u._id, e.target.value)}
                          disabled={savingRoleFor === u._id}
                          className="bg-slate-900 text-white border border-slate-700 rounded px-2 py-1"
                        >
                          {roles.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{String(u.isActive ?? true)}</td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-white text-xl font-semibold">Video Assignments</h2>
            <p className="text-slate-400 text-sm">Assign Viewer access to specific videos.</p>
          </div>
        </div>

        <div className="p-4">
          {loadingVideos ? (
            <div className="text-slate-300">Loading videos...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 text-slate-400 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-4 py-3">Video</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Assigned viewers</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {videos.map((v) => (
                    <tr key={v._id} className="hover:bg-slate-700/40">
                      <td className="px-4 py-3 text-slate-200">{v.originalName}</td>
                      <td className="px-4 py-3 text-slate-300">{v.status}</td>
                      <td className="px-4 py-3 text-slate-300">
                        {(v.assignedUsers ?? []).length}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => openAssignModal(v)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded"
                        >
                          Manage assignment
                        </button>
                      </td>
                    </tr>
                  ))}
                  {videos.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                        No videos found for this tenant.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {assignModalOpen && selectedVideo && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-800">
              <div>
                <h3 className="text-white text-lg font-semibold">
                  Assign viewers to: {selectedVideo.originalName}
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                  Only users included here can stream as `Viewer`.
                </p>
              </div>

              <button
                onClick={() => setAssignModalOpen(false)}
                className="text-slate-300 hover:text-white text-sm px-3 py-2 rounded border border-slate-700 hover:border-slate-500"
              >
                Close
              </button>
            </div>

            <div className="p-5">
              <div className="space-y-3">
                <div className="text-slate-200 font-medium">Select users</div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {users.map((u) => (
                    <label
                      key={u._id}
                      className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 cursor-pointer hover:bg-slate-700/40"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUserIdSet.has(normalizeId(u._id))}
                        onChange={() => toggleUser(u._id)}
                      />
                      <div className="min-w-0">
                        <div className="text-slate-200 text-sm truncate">{u.fullname}</div>
                        <div className="text-slate-400 text-xs truncate">{u.email}</div>
                        <div className="text-slate-400 text-xs truncate">role: {u.role}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-950 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setAssignModalOpen(false)}
                className="px-4 py-2 text-slate-300 hover:text-white text-sm font-medium border border-slate-700 rounded"
                disabled={savingAssignments}
              >
                Cancel
              </button>
              <button
                onClick={saveAssignments}
                disabled={savingAssignments}
                className="px-5 py-2 rounded-lg text-white text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900"
              >
                {savingAssignments ? "Saving..." : "Save assignments"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;