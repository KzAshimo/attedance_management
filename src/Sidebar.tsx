import React from "react";

interface Props {
  years: number[];
  months: number[];
  selectedYear: number;
  selectedMonth: number;
  onSelectYear: (year: number) => void;
  onSelectMonth: (month: number) => void;
  onStartWork: () => void;
  onEndWork: () => void;
  onBreakStart: () => void;
  onBreakEnd: () => void;
}

export const Sidebar: React.FC<Props> = ({
  years,
  months,
  selectedYear,
  selectedMonth,
  onSelectYear,
  onSelectMonth,
  onStartWork,
  onEndWork,
  onBreakStart,
  onBreakEnd,
}) => {
  return (
    <aside className="fixed top-0 left-0 w-48 h-screen bg-gray-800 text-white p-4 flex flex-col overflow-hidden">
      <div>
        <h2 className="text-lg font-bold mb-2">年選択</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => onSelectYear(year)}
              className={`px-2 py-1 rounded ${
                year === selectedYear ? "bg-blue-500" : "bg-gray-600"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
        <h2 className="text-lg font-bold mb-2">月選択</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {months.map((month) => (
            <button
              key={month}
              onClick={() => onSelectMonth(month)}
              className={`px-2 py-1 rounded ${
                month === selectedMonth ? "bg-blue-500" : "bg-gray-600"
              }`}
            >
              {month}月
            </button>
          ))}
        </div>
      </div>

      {/* 出退勤ボタン群 */}
      <div className="flex flex-col gap-2 mt-auto">
        <button
          onClick={onStartWork}
          className="bg-green-500 hover:bg-green-600 px-2 py-1 rounded"
        >
          出勤
        </button>
        <button
          onClick={onBreakStart}
          className="bg-yellow-500 hover:bg-yellow-600 px-2 py-1 rounded"
        >
          休憩開始
        </button>
        <button
          onClick={onBreakEnd}
          className="bg-yellow-500 hover:bg-yellow-600 px-2 py-1 rounded"
        >
          休憩終了
        </button>
        <button
          onClick={onEndWork}
          className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
        >
          退勤
        </button>
      </div>
    </aside>
  );
};
