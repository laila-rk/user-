import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  is_completed?: boolean;
}

export function Notification({
  setNotificationWindow,
  notifications,
}: {
  setNotificationWindow: (v: boolean) => void;
  notifications: NotificationItem[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => setNotificationWindow(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-card border border-border rounded-xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border w-full">
          <div className="flex flex-col gap-6 mb-3 w-full">
            <div className="flex justify-between w-full">
              <p className="text-2xl font-bold gradient-text">
                Notifications
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setNotificationWindow(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Notifications List */}
            <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No notifications for today
                </p>
              ) : (
                notifications.map((notification) => (
                  <div key={notification.id} className="flex flex-col">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <h2 className="text-base font-medium">
                          {notification.title}
                        </h2>

                        {!notification.is_completed && (
                          <span className="w-2 h-2 relative right-2 bg-destructive rounded-full" />
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {notification.description}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
