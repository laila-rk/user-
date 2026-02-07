import {motion, AnimatePresence} from 'framer-motion'
import { Button } from '../ui/button'
import { X } from 'lucide-react'

const notifications = [
    { title: 'Diet', description: 'Log your meals', completed: false },
    { title: 'Workout', description: 'Complete your exercise', completed: false },
    { title: 'Water', description: 'Stay hydrated', completed: false },
    { title: 'Live', description: 'Check your stats', completed: false },
    { title: 'Progress', description: 'View your achievements', completed: false }
]

export function Notification({setNotificationWindow}){
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
            <div className="flex flex-col gap-6  mb-3 w-full">
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
              {/* All Notifications */}
              <div className="flex flex-col gap-3">
                {notifications.map((notification) => (
                  <div key={notification.title} className="flex flex-col ">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <h2 className="text-base">{notification.title}</h2>
                        <span className="w-2 h-2 relative right-8 bg-destructive rounded-full" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
}