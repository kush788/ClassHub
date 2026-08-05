import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { mockApi } from "../api/mockApi";
import { EmailNotification } from "../types";
import { 
  Mail, 
  X, 
  Check, 
  CheckCheck, 
  Calendar, 
  Clock, 
  ExternalLink, 
  FileText, 
  BookOpen, 
  Inbox, 
  Sparkles,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface EmailInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationRead?: () => void;
}

export const EmailInboxModal: React.FC<EmailInboxModalProps> = ({
  isOpen,
  onClose,
  onNotificationRead
}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<EmailNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<EmailNotification | null>(null);

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await mockApi.notifications.getForUser(user.id);
      setNotifications(data);
      if (data.length > 0 && !selectedNotif) {
        setSelectedNotif(data[0]);
      }
    } catch (e) {
      console.error("Failed to fetch email notifications", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, user]);

  const handleMarkAsRead = async (notif: EmailNotification) => {
    try {
      await mockApi.notifications.markAsRead(notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
      );
      if (selectedNotif?.id === notif.id) {
        setSelectedNotif((prev) => (prev ? { ...prev, read: true } : null));
      }
      onNotificationRead?.();
    } catch (e) {
      console.error("Error marking email as read", e);
    }
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    try {
      await mockApi.notifications.markAllAsRead(user.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      if (selectedNotif) {
        setSelectedNotif({ ...selectedNotif, read: true });
      }
      onNotificationRead?.();
    } catch (e) {
      console.error("Error marking all read", e);
    }
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-zinc-950/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl relative z-10 overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Top Header */}
          <div className="p-5 sm:px-6 border-b border-white/10 bg-zinc-950/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-zinc-100 flex items-center gap-2 tracking-tight">
                  Simulated Email Notifications
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono px-2 py-0.5 rounded-full font-semibold">
                      {unreadCount} unread
                    </span>
                  )}
                </h3>
                <p className="text-xs text-zinc-400 font-normal">
                  Classroom updates, homework posts, and resource alerts delivered via email dispatch.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-blue-400" /> Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content Split View */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
            
            {/* Left Email List Column (5 cols) */}
            <div className="md:col-span-5 overflow-y-auto max-h-[60vh] md:max-h-[68vh] p-3 space-y-2 custom-scrollbar">
              {loading ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs text-zinc-400 font-medium">Loading inbox messages...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <Inbox className="w-10 h-10 text-zinc-600 mx-auto" />
                  <p className="text-xs font-semibold text-zinc-300">Your simulated inbox is empty</p>
                  <p className="text-[11px] text-zinc-500">When teachers publish assignments or syllabi, email alerts appear here.</p>
                </div>
              ) : (
                notifications.map((notif) => {
                  const isSelected = selectedNotif?.id === notif.id;
                  const isAssign = notif.type === "ASSIGNMENT";

                  return (
                    <div
                      key={notif.id}
                      onClick={() => {
                        setSelectedNotif(notif);
                        if (!notif.read) {
                          handleMarkAsRead(notif);
                        }
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? "bg-blue-500/10 border-blue-500/30 text-white shadow-lg"
                          : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] text-zinc-300"
                      }`}
                    >
                      {!notif.read && (
                        <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-zinc-950" />
                      )}

                      <div className="flex items-center gap-2 mb-1 pr-4">
                        <span className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase font-semibold flex items-center gap-1">
                          {isAssign ? <FileText className="w-3 h-3 text-indigo-400" /> : <BookOpen className="w-3 h-3 text-emerald-400" />}
                          {notif.type}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-normal truncate">
                          • {notif.workspaceName}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold line-clamp-1 leading-snug text-zinc-100">
                        {notif.subject}
                      </h4>

                      <p className="text-[11px] text-zinc-400 font-normal line-clamp-1 mt-1">
                        From: {notif.senderName}
                      </p>

                      <div className="text-[9px] text-zinc-500 font-mono mt-1.5 flex items-center justify-between">
                        <span>{new Date(notif.createdAt).toLocaleDateString()}</span>
                        <span>{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Email Preview Detail Pane (7 cols) */}
            <div className="md:col-span-7 p-6 overflow-y-auto max-h-[60vh] md:max-h-[68vh] flex flex-col justify-between custom-scrollbar bg-zinc-950/30">
              {selectedNotif ? (
                <div className="space-y-6">
                  {/* Email Header Info */}
                  <div className="space-y-3 pb-4 border-b border-white/10">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-zinc-400 font-normal">
                        Notification Detail
                      </span>
                      <span className="text-xs text-zinc-500 font-mono">
                        {new Date(selectedNotif.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <h2 className="text-lg font-semibold text-zinc-100 leading-snug tracking-tight">
                      {selectedNotif.subject}
                    </h2>

                    {/* Sender / Receiver Box */}
                    <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-3.5 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500 text-xs font-mono tracking-wider uppercase">FROM</span>
                        <span className="text-zinc-200 font-medium">{selectedNotif.senderName} &lt;{selectedNotif.senderEmail}&gt;</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-white/5 pt-2">
                        <span className="text-zinc-500 text-xs font-mono tracking-wider uppercase">TO</span>
                        <span className="text-zinc-300 font-mono">{selectedNotif.recipientEmail}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-white/5 pt-2">
                        <span className="text-zinc-500 text-xs font-mono tracking-wider uppercase">WORKSPACE</span>
                        <span className="text-indigo-400 font-medium">{selectedNotif.workspaceName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Email Message Body */}
                  <div className="space-y-2">
                    <span className="text-zinc-500 text-xs font-mono tracking-wider uppercase block">
                      MESSAGE CONTENT
                    </span>
                    <div className="p-4 bg-zinc-900/40 border border-white/5 rounded-xl text-xs text-zinc-300 leading-relaxed font-sans whitespace-pre-wrap">
                      {selectedNotif.body}
                    </div>
                  </div>

                  {/* Quick Action Footer */}
                  <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
                    <Link
                      to={`/workspace/${selectedNotif.workspaceId}`}
                      onClick={onClose}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs rounded-xl transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
                    >
                      Go to Classroom Workspace <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    {!selectedNotif.read && (
                      <button
                        onClick={() => handleMarkAsRead(selectedNotif)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-zinc-500 my-auto">
                  <Mail className="w-10 h-10 mx-auto mb-2 text-zinc-600" />
                  <p className="text-xs font-medium">Select an email notification to preview details</p>
                </div>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
