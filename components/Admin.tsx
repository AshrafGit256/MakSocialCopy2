
import React from 'react';
import { ANALYTICS } from '../constants';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { Users, FileText, MessageCircle, AlertTriangle, ShieldCheck, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const Admin: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-12">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
             <ShieldCheck className="text-red-500" size={32} />
             System Administrator Panel
          </h1>
          <p className="text-slate-500 mt-1">Real-time platform analytics and moderation control center.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              className="bg-[#1a1f2e] border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:outline-none w-64"
              placeholder="Search users or logs..."
            />
          </div>
          <button className="bg-white/10 hover:bg-white/20 px-6 py-2.5 rounded-2xl font-bold transition-all border border-white/10">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Students', value: '12,452', trend: '+12%', icon: <Users />, color: 'text-blue-500', up: true },
          { label: 'Opportunities Posted', value: '842', trend: '+5.4%', icon: <FileText />, color: 'text-green-500', up: true },
          { label: 'Messages Sent', value: '154k', trend: '-2.1%', icon: <MessageCircle />, color: 'text-yellow-500', up: false },
          { label: 'Pending Reports', value: '14', trend: '-15%', icon: <AlertTriangle />, color: 'text-red-500', up: false },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-3xl relative overflow-hidden group">
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 bg-current ${stat.color} group-hover:scale-150 transition-transform duration-700`}></div>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-black px-2 py-1 rounded-full ${stat.up ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {stat.up ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                {stat.trend}
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-3xl font-black text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-[2rem]">
          <h3 className="text-xl font-bold text-white mb-8">Daily Activity Trends</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANALYTICS}>
                <defs>
                  <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="posts" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPosts)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8 rounded-[2rem]">
          <h3 className="text-xl font-bold text-white mb-8">Messaging Volume</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ANALYTICS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="messages" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Monitoring */}
        <div className="lg:col-span-2 glass-card rounded-[2rem] overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Recent Message Logs</h3>
            <button className="text-blue-400 text-sm font-bold">Monitor All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-slate-500 text-xs font-black uppercase tracking-widest">
                  <th className="px-8 py-4">User</th>
                  <th className="px-8 py-4">Action</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { user: 'Sarah A.', action: 'Posted Opportunity', status: 'Safe', time: '2 mins ago' },
                  { user: 'Kato John', action: 'Direct Message', status: 'Safe', time: '5 mins ago' },
                  { user: 'Namely B.', action: 'Flagged Content', status: 'Risk', time: '12 mins ago' },
                  { user: 'Walusimbi A.', action: 'Created Group', status: 'Safe', time: '1 hour ago' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors group cursor-default">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex-shrink-0">
                           <img src={`https://i.pravatar.cc/150?u=${row.user}`} className="w-full h-full rounded-xl object-cover" />
                        </div>
                        <span className="font-bold text-white group-hover:text-blue-400 transition-colors">{row.user}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-400 font-medium">{row.action}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        row.status === 'Safe' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-500 text-right">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content Breakdown Pie */}
        <div className="glass-card p-8 rounded-[2rem] flex flex-col items-center">
          <h3 className="text-xl font-bold text-white mb-8 self-start">Content Type Distribution</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Discussion', value: 45 },
                    { name: 'Opportunity', value: 25 },
                    { name: 'Market', value: 20 },
                    { name: 'Other', value: 10 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COLORS.map((color, index) => <Cell key={index} fill={color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 w-full">
            {['Discussion', 'Opportunity', 'Market', 'Other'].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                <span className="text-xs text-slate-400 font-bold">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
