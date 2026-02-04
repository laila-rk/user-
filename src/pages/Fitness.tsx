import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell,
  Plus,
  Flame,
  Timer,
  Target,
  TrendingUp,
  ChevronRight,
  Check,
  RotateCcw,
  X,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// INITIAL DATA
const initialExercises = [
  { id: 1, name: "Bench Press", sets: 4, reps: 12, weight: "60kg", completed: true },
  { id: 2, name: "Shoulder Press", sets: 3, reps: 10, weight: "40kg", completed: true },
  { id: 3, name: "Lat Pulldown", sets: 4, reps: 12, weight: "50kg", completed: false },
  { id: 4, name: "Bicep Curls", sets: 3, reps: 15, weight: "15kg", completed: false },
  { id: 5, name: "Tricep Dips", sets: 3, reps: 12, weight: "BW", completed: false },
];

const exerciseLibrary = [
  { name: "Squats", sets: 3, reps: 10, weight: "80kg" },
  { name: "Deadlifts", sets: 3, reps: 8, weight: "100kg" },
  { name: "Pull Ups", sets: 3, reps: 12, weight: "BW" },
  { name: "Leg Press", sets: 4, reps: 12, weight: "120kg" },
  { name: "Lunges", sets: 3, reps: 12, weight: "20kg" },
  { name: "Plank", sets: 3, reps: 1, weight: "1 min" },
];

export default function Fitness() {
  const [exercises, setExercises] = useState(initialExercises);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState([
    { label: "Weight", value: "80.5", unit: "kg", change: -0.3 },
    { label: "Body Fat", value: "18.2", unit: "%", change: -0.5 },
    { label: "Muscle Mass", value: "34.8", unit: "kg", change: 0.2 },
    { label: "BMI", value: "24.1", unit: "", change: -0.1 },
  ]);

  // --- DERIVED STATE ---
  const completedExercises = exercises.filter((e) => e.completed).length;
  const progress = exercises.length > 0 ? (completedExercises / exercises.length) * 100 : 0;

  const filteredLibrary = useMemo(() => {
    return exerciseLibrary.filter(ex => 
      ex.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // --- HANDLERS ---
  const toggleExercise = (id: number) => {
    setExercises(prev => prev.map(ex => 
      ex.id === id ? { ...ex, completed: !ex.completed } : ex
    ));
  };

  const handleReset = () => {
    setExercises(prev => prev.map(ex => ({ ...ex, completed: false })));
  };

  const handleContinue = () => {
    const nextIncomplete = exercises.find(ex => !ex.completed);
    if (nextIncomplete) {
      alert(`Starting next exercise: ${nextIncomplete.name}`);
    } else {
      alert("Workout already completed!");
    }
  };

  const addExercise = (template: typeof exerciseLibrary[0]) => {
    const newEx = {
      ...template,
      id: Date.now(),
      completed: false
    };
    setExercises(prev => [...prev, newEx]);
    setIsLogOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold mb-1 text-foreground">Fitness Tracking</h1>
          <p className="text-muted-foreground">
            Log workouts, track progress, and crush your goals
          </p>
        </div>
        <Button 
          onClick={() => setIsLogOpen(true)}
          className="bg-primary hover:opacity-90 text-primary-foreground shadow-lg h-12 px-6"
        >
          <Plus className="w-5 h-5 mr-2" />
          Log Workout
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-xl p-5 shadow-sm"
          >
            <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">{stat.label}</p>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-2xl font-display font-bold">{stat.value}</span>
              <span className="text-muted-foreground font-medium text-sm">{stat.unit}</span>
            </div>
            <div className={`text-[10px] font-bold ${
              stat.change < 0 ? "text-emerald-500" : "text-blue-500"
            }`}>
              {stat.change > 0 ? "+" : ""}{stat.change} from last week
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Workout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-lg">Today's Workout</h3>
            </div>
            <Badge variant="outline" className="text-[10px] uppercase font-bold border-primary/20 text-primary">
              Upper Body Strength
            </Badge>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium">
                {completedExercises}/{exercises.length} exercises completed
              </span>
              <span className="text-xs font-bold">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          <div className="space-y-3 flex-1 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {exercises.map((exercise) => (
                <motion.div
                  key={exercise.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                    exercise.completed
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : "bg-muted/50 border-transparent hover:border-primary/20 shadow-sm"
                  }`}
                >
                  <button
                    onClick={() => toggleExercise(exercise.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      exercise.completed
                        ? "bg-emerald-500 text-white"
                        : "bg-transparent border-2 border-muted-foreground/30 hover:border-primary"
                    }`}
                  >
                    {exercise.completed && <Check className="w-4 h-4" />}
                  </button>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${exercise.completed ? "line-through text-muted-foreground" : ""}`}>
                      {exercise.name}
                    </p>
                    <p className="text-[11px] font-medium text-muted-foreground uppercase">
                      {exercise.sets} Sets × {exercise.reps} Reps @ {exercise.weight}
                    </p>
                  </div>
                  {!exercise.completed && (
                    <button 
                      onClick={() => toggleExercise(exercise.id)} 
                      className="text-xs font-bold text-foreground hover:text-primary transition-colors"
                    >
                      Start
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex gap-4 mt-8">
            <Button 
              onClick={handleContinue}
              className="flex-1 bg-primary text-primary-foreground font-bold h-11"
            >
              <Timer className="w-4 h-4 mr-2" />
              Continue Workout
            </Button>
            <Button variant="outline" onClick={handleReset} className="h-11 px-6 font-bold">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </motion.div>

        {/* Weekly Plan */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card border border-border rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-lg">Weekly Plan</h3>
          </div>

          <div className="space-y-2">
            {[
              { day: "Monday", workout: "Upper Body", completed: true },
              { day: "Tuesday", workout: "Cardio HIIT", completed: true },
              { day: "Wednesday", workout: "Lower Body", completed: true },
              { day: "Thursday", workout: "Rest Day", completed: false, isRest: true },
              { day: "Friday", workout: "Full Body", completed: false },
            ].map((day) => (
              <div
                key={day.day}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  day.completed ? "bg-emerald-500/5" : "bg-muted/30"
                }`}
              >
                <div>
                  <p className="font-bold text-sm">{day.day}</p>
                  <p className="text-[11px] text-muted-foreground">{day.workout}</p>
                </div>
                {day.completed && (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button 
            variant="ghost" 
            onClick={() => setIsLogOpen(true)}
            className="w-full mt-6 text-xs font-bold text-muted-foreground hover:text-primary"
          >
            Edit Weekly Plan
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </motion.div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isLogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsLogOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold font-display">Log Exercise</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsLogOpen(false)}><X className="w-4 h-4" /></Button>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text"
                  placeholder="Search exercise library..."
                  className="w-full bg-muted/50 border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                {filteredLibrary.map((item) => (
                  <div 
                    key={item.name} 
                    className="flex justify-between items-center p-3 bg-muted/30 hover:bg-muted/60 rounded-lg cursor-pointer transition-all group"
                    onClick={() => addExercise(item)}
                  >
                    <div>
                      <p className="text-sm font-bold">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground uppercase">{item.sets}x{item.reps} • {item.weight}</p>
                    </div>
                    <Plus className="w-4 h-4 text-primary" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}