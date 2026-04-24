import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PremiumCalendarProps {
  onDateSelect?: (date: string) => void;
  selectedDate?: string;
  minDate?: string;
}

const PremiumCalendar: React.FC<PremiumCalendarProps> = ({ onDateSelect, selectedDate, minDate }) => {
  const [viewDate, setViewDate] = React.useState(() => {
    if (selectedDate && !isNaN(new Date(selectedDate).getTime())) {
      return new Date(selectedDate);
    }
    return new Date();
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const effectiveMinDate = minDate ? new Date(minDate) : today;
  effectiveMinDate.setHours(0, 0, 0, 0);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const handlePrevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1));

  const handleDateClick = (dayInfo: any) => {
    const dateStr = `${dayInfo.year}-${String(dayInfo.month + 1).padStart(2, '0')}-${String(dayInfo.day).padStart(2, '0')}`;
    onDateSelect?.(dateStr);
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const days = [];
  const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, month: currentMonth - 1, year: currentYear, current: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, month: currentMonth, year: currentYear, current: true });
  }
  const remainingCells = 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    days.push({ day: i, month: currentMonth + 1, year: currentYear, current: false });
  }



  return (
    <div className="w-[300px] bg-white rounded-2xl p-5 shadow-2xl border border-slate-100 text-slate-800 ring-1 ring-slate-900/5">
      <div className="flex items-center justify-between mb-5 px-1">
        <button onClick={handlePrevMonth} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
          <ChevronLeft size={16} />
        </button>
        <div className="font-bold text-[15px] text-slate-900 flex items-center gap-1.5">
          {months[currentMonth]}
          <span className="text-slate-400">{currentYear}</span>
        </div>
        <button onClick={handleNextMonth} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1 gap-y-1">
        {daysOfWeek.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-slate-400 mb-3 tracking-wide">{d}</div>
        ))}
        {days.map((d, i) => {
          const dateStr = `${d.year}-${String(d.month + 1).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
          const isSelected = selectedDate === dateStr;
          const checkDate = new Date(d.year, d.month, d.day);
          const isBeforeMin = checkDate < effectiveMinDate;
          const disabled = !d.current || isBeforeMin;

          return (
            <button
              key={i}
              onClick={() => !disabled && handleDateClick(d)}
              disabled={disabled}
              className={`h-9 w-9 mx-auto rounded-lg text-sm font-semibold flex items-center justify-center transition-all ${
                isSelected 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : disabled 
                    ? 'text-slate-200 cursor-not-allowed' 
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {d.day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PremiumCalendar;
