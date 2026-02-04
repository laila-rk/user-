import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Flame, Target, Trophy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const achievements = [
  { icon: Flame, label: "7-Day Streak", color: "text-orange-500" },
  { icon: Trophy, label: "Goal Crusher", color: "text-primary" },
  { icon: Target, label: "Perfect Week", color: "text-green-500" },
];

export function WorkoutProgress() {
  const [weeklyData, setWeeklyData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStats() {
      // Fetching from 'workouts' using your order_index for consistent Mon-Sun display
      const { data } = await (supabase
        .from('workouts')
        .select('*')
        .order('order_index', { ascending: true }) as any);

      if (data) setWeeklyData(data);
    }
    fetchStats();
  }, []);

  const completedDays = weeklyData.filter((d) => d.completed).length;
  
  // Safely calculate calories, defaulting to 0 if the field is null
  const totalCalories = weeklyData.reduce((acc, curr) => {
    const calories = Number(curr.calories_burned) || 0;
    return acc + calories;
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="bg-card rounded-xl border border-border p-6 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-6">
        <Dumbbell className="w-5 h-5 text-primary" />
        <h3 className="font-display font-semibold text-lg">Weekly Workout Progress</h3>
      </div>

      {/* Day Progress Circles */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {weeklyData.map((day, index) => (
          <motion.div
            key={day.id || index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="text-center"
          >
            <div
              className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-1 transition-all font-bold text-xs ${
                day.completed
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {day.completed ? <Check className="w-4 h-4" strokeWidth={3} /> : (day.day_name?.[0] || index + 1)}
            </div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              {day.day_name?.substring(0, 3) || `Day ${index + 1}`}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/20 mb-6">
        <div>
          <p className="text-2xl font-display font-bold text-primary">
            {completedDays}/{weeklyData.length || 7}
          </p>
          <p className="text-xs text-muted-foreground font-bold uppercase">Workouts Completed</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-display font-bold">
            {totalCalories > 0 ? totalCalories.toLocaleString() : "---"}
          </p>
          <p className="text-xs text-muted-foreground font-bold uppercase">Calories Burned</p>
        </div>
      </div>

      {/* Achievements Section */}
      <div>
        <p className="text-xs font-bold text-muted-foreground uppercase mb-3 tracking-wider">Recent Achievements</p>
        <div className="flex flex-wrap gap-2">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Badge variant="secondary" className="px-3 py-1.5 gap-1.5 bg-muted/50 border-none font-bold text-[10px]">
                <achievement.icon className={`w-3.5 h-3.5 ${achievement.color}`} />
                {achievement.label}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}