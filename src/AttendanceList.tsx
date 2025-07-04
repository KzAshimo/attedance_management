import React from 'react';
import { AttendanceItem } from './AttendanceItem';

export interface AttendanceLog {
  id?: string;
  date: string;
  start_time?: string;
  break_start?: string;
  break_end?: string;
  end_time?: string;
  content?: string;
  result? :string;
  memo?: string;
}


interface Props {
  year: number;
  month: number;
  logs: AttendanceLog[];
  reload: () => void;
}

export const AttendanceList: React.FC<Props> = ({ year, month, logs, reload }) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <table className="w-full text-sm border">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2 w-16">日付</th>
          <th className="border p-2">出勤</th>
          <th className="border p-2">休憩開始</th>
          <th className="border p-2">休憩終了</th>
          <th className="border p-2">退勤</th>
          <th className="border p-2">実装内容</th>
          <th className="border p-2">成果</th>
          <th className="border p-2">備考</th>
        </tr>
      </thead>
      <tbody>
        {days.map(day => {
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const log = logs.find(l => l.date === dateStr) ?? { date: dateStr };
          return <AttendanceItem key={dateStr} log={log} reload={reload} />;
        })}
      </tbody>
    </table>
  );
};
