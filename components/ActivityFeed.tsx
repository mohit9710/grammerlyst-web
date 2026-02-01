"use client";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api/backend";

interface ActivityLog {
  id: number;
  activity_type: string;
  description: string;
  points_earned: number;
  created_at: string;
}

export default function RecentActivity() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/user/activity-logs`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setLogs(Array.isArray(data) ? data : []);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, []);

  // Dynamic Icon Selector based on description keywords
  const getIconConfig = (description: string, type: string) => {
    const desc = description.toLowerCase();
    
    // Game identification logic
    if (desc.includes("speed typer") || desc.includes("keyboard")) 
      return { icon: 'fa-keyboard', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (desc.includes("verb") || desc.includes("workshop")) 
      return { icon: 'fa-font', color: 'text-purple-600', bg: 'bg-purple-100' };
    if (desc.includes("grammar") || desc.includes("rule")) 
      return { icon: 'fa-book', color: 'text-indigo-600', bg: 'bg-indigo-100' };
    if (desc.includes("bonus")) 
      return { icon: 'fa-gift', color: 'text-amber-600', bg: 'bg-amber-100' };
    if (desc.includes("streak") || desc.includes("fire")) 
      return { icon: 'fa-fire', color: 'text-rose-600', bg: 'bg-rose-100' };
    
    // Fallback based on type
    if (type === 'GAME_WIN') return { icon: 'fa-gamepad', color: 'text-emerald-600', bg: 'bg-emerald-100' };
    return { icon: 'fa-history', color: 'text-slate-600', bg: 'bg-slate-100' };
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col h-[500px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Activity Feed</h3>
        <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-1 rounded-lg uppercase animate-pulse">
          Live
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-slate-50 rounded-3xl" />)}
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <i className="fa-solid fa-ghost text-4xl mb-3 block"></i>
            <p className="text-sm">No activity found yet.</p>
          </div>
        ) : (
          logs.map((log) => {
            const config = getIconConfig(log.description, log.activity_type);
            
            return (
              <div key={log.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-[1.5rem] transition-all group border border-transparent hover:border-slate-100">
                {/* ICON BOX - Clean Fix for Square Box */}
                <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-lg ${config.bg}`}>
                  <i className={`fa-solid ${config.icon} ${config.color}`}></i>
                </div>

                {/* TEXT CONTENT - Truncate fixed for points alignment */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm truncate group-hover:text-blue-600 transition-colors">
                    {log.description}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    {new Date(log.created_at).toLocaleDateString()} • {new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>

                {/* POINTS - Shrink-0 prevents squishing */}
                <div className="shrink-0 ml-2">
                  <span className={`text-sm font-black ${log.points_earned > 0 ? 'text-emerald-500' : 'text-slate-300'}`}>
                    {log.points_earned > 0 ? `+${log.points_earned}` : '0'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      <button className="mt-6 w-full py-4 bg-slate-50 text-slate-500 text-xs font-bold rounded-2xl hover:bg-slate-900 hover:text-white transition-all duration-300">
        View Full History
      </button>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
}