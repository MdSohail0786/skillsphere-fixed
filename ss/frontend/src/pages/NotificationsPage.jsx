import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  Trash2,
  MessageSquare,
  DollarSign,
  Star,
  Briefcase,
} from "lucide-react";
import { useNotificationStore } from "../store/notificationStore";
import DashboardLayout from "../components/common/DashboardLayout";
import { timeAgo } from "../utils/helpers";

const typeIcon = {
  new_proposal: Briefcase,
  proposal_accepted: CheckCheck,
  proposal_rejected: Briefcase,
  new_message: MessageSquare,
  payment_released: DollarSign,
  new_review: Star,
  milestone_submitted: CheckCheck,
  milestone_approved: CheckCheck,
};
const typeColor = {
  new_proposal:
    "text-blue-500 bg-blue-50 dark:bg-blue-900/40 dark:text-blue-300",
  proposal_accepted:
    "text-green-500 bg-green-50 dark:bg-green-900/40 dark:text-green-300",
  proposal_rejected:
    "text-red-500 bg-red-50 dark:bg-red-900/40 dark:text-red-300",
  new_message:
    "text-violet-500 bg-violet-50 dark:bg-violet-900/40 dark:text-violet-300",
  payment_released:
    "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/40 dark:text-emerald-300",
  new_review:
    "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/40 dark:text-yellow-300",
};

export default function NotificationsPage() {
  const { notifications, unreadCount, fetch, markRead, markAllRead, remove } =
    useNotificationStore();
  const navigate = useNavigate();
  useEffect(() => {
    fetch();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-slate-400">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="btn-outline text-sm flex items-center gap-2"
            >
              <CheckCheck className="h-4 w-4" /> Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-16 text-slate-400 dark:text-slate-500">
            <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">All caught up!</p>
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => {
              const Icon = typeIcon[n.type] || Bell;
              const color =
                typeColor[n.type] ||
                "text-slate-500 bg-slate-50 dark:bg-slate-700";
              const colorDark = (color) =>
                color.replace("bg-", "dark:bg-").replace("text-", "dark:text-");
              return (
                <div
                  key={n._id}
                  onClick={() => {
                    if (!n.isRead) markRead(n._id);
                    if (n.link) navigate(n.link);
                  }}
                  className={`card p-4 flex items-start gap-3 cursor-pointer hover:shadow-md transition-all ${!n.isRead ? "border-violet-200 dark:border-violet-800 bg-violet-50/30 dark:bg-violet-900/20" : ""}`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm font-medium ${!n.isRead ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"}`}
                      >
                        {n.title}
                      </p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {!n.isRead && (
                          <span className="w-2 h-2 bg-violet-600 rounded-full" />
                        )}
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {timeAgo(n.createdAt)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      {n.body}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remove?.(n._id);
                    }}
                    className="text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
