import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PremiumCalendarProps {
  onDateSelect?: (date: string) => void;
  selectedDate?: string;
  onClose?: () => void;
}

const PremiumCalendar: React.FC<PremiumCalendarProps> = ({ onDateSelect, selectedDate }) => {
  const [viewDate, setViewDate] = useState(new Date(selectedDate || Date.now()));
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Generate days for the grid
  const days = [];
  // Previous month padding
  const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, month: currentMonth - 1, year: currentYear, current: false });
  }
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, month: currentMonth, year: currentYear, current: true });
  }
  // Next month padding
  const totalCells = 42; // 6 rows of 7 days
  const remainingCells = totalCells - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    days.push({ day: i, month: currentMonth + 1, year: currentYear, current: false });
  }

  const handlePrevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1));

  const handleDateClick = (d: { day: number, month: number, year: number }) => {
    const dateStr = `${d.year}-${String(d.month + 1).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
    onDateSelect?.(dateStr);
  };

  const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() + i);

  return (
    <div className="w-[280px] bg-white rounded-2xl p-4 shadow-[0_25px_70px_rgba(0,0,0,0.3)] text-slate-800 border border-slate-100 relative ring-1 ring-black/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
          <ChevronLeft size={16} className="text-slate-400" />
        </button>
        
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <button 
              onClick={() => { setShowMonthPicker(!showMonthPicker); setShowYearPicker(false); }}
              className="text-sm font-bold text-slate-900 hover:text-blue-500 transition-colors flex items-center gap-0.5"
            >
              {months[currentMonth]} <ChevronDown size={12} />
            </button>
            <AnimatePresence>
              {showMonthPicker && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 bg-white border border-slate-100 shadow-xl rounded-2xl z-50 p-2 grid grid-cols-3 gap-1 w-64"
                >
                  {months.map((m, i) => (
                    <button 
                      key={m} 
                      onClick={() => { setViewDate(new Date(currentYear, i, 1)); setShowMonthPicker(false); }}
                      className={`py-2 px-1 text-xs font-bold rounded-lg transition-colors ${currentMonth === i ? 'bg-blue-500 text-white' : 'hover:bg-slate-50 text-slate-600'}`}
                    >
                      {m.slice(0, 3)}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button 
               onClick={() => { setShowYearPicker(!showYearPicker); setShowMonthPicker(false); }}
               className="text-sm font-bold text-slate-400 hover:text-blue-500 transition-colors flex items-center gap-0.5"
            >
              {currentYear} <ChevronDown size={12} />
            </button>
            <AnimatePresence>
              {showYearPicker && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute top-full left-0 mt-2 bg-white border border-slate-100 shadow-2xl rounded-xl z-[100] p-2 grid grid-cols-3 gap-1.5 w-40 max-h-48 overflow-y-auto custom-scrollbar"
                >
                  {years.map((y) => (
                    <button 
                      key={y} 
                      onClick={() => { setViewDate(new Date(y, currentMonth, 1)); setShowYearPicker(false); }}
                      className={`py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                        currentYear === y 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'hover:bg-slate-50 text-slate-500 hover:text-blue-500'
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <button onClick={handleNextMonth} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
          <ChevronRight size={16} className="text-slate-400" />
        </button>
      </div>

      {/* Grid */}
      <div className="border border-slate-100 rounded-xl overflow-hidden bg-white">
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
          {daysOfWeek.map((day) => (
            <div key={day} className="py-2 text-center text-[8px] font-black text-slate-400 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((d, i) => {
            const dateStr = `${d.year}-${String(d.month + 1).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
            const isSelected = selectedDate === dateStr;
            const isToday = new Date().toDateString() === new Date(d.year, d.month, d.day).toDateString();

            return (
              <div 
                key={i} 
                className={`h-9 border-r border-b border-slate-100 last:border-r-0 flex items-center justify-center relative cursor-pointer group transition-colors hover:bg-slate-50/50`}
                onClick={() => handleDateClick(d)}
              >
                <span className={`text-[10px] font-bold transition-all ${
                  isSelected ? 'bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-md scale-105 z-10' :
                  !d.current ? 'text-slate-200' : 
                  isToday ? 'text-blue-500' : 'text-slate-600 group-hover:text-slate-900'
                }`}>
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button 
           onClick={() => {
             const today = new Date();
             setViewDate(today);
             onDateSelect?.(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
           }}
           className="text-[9px] font-black text-blue-500 hover:text-blue-600 transition-colors tracking-widest uppercase"
        >
          Select Today
        </button>
        <p className="text-[8px] font-bold text-slate-300 tracking-wider">
          NODE.JS SYNCED
        </p>
      </div>
    </div>
  );
};

export default PremiumCalendar;
