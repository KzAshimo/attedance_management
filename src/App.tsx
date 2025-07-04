import { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient";
import { AttendanceList } from "./AttendanceList";
import { Sidebar } from "./Sidebar";

export interface AttendanceLog {
  id?: string;
  date: string;
  start_time?: string;
  break_start?: string;
  break_end?: string;
  end_time?: string;
  content?: string;
  result?: string;
  memo?: string;
}

export default function App() {
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(
    today.getMonth() + 1
  );
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, [selectedYear, selectedMonth]);

  async function fetchLogs() {
    setLoading(true);
    try {
      const startDate = `${selectedYear}-${String(selectedMonth).padStart(
        2,
        "0"
      )}-01`;
      const endMonth = selectedMonth === 12 ? 1 : selectedMonth + 1;
      const endYear = selectedMonth === 12 ? selectedYear + 1 : selectedYear;
      const endDate = `${endYear}-${String(endMonth).padStart(2, "0")}-01`;

      const { data, error } = await supabase
        .from("attendance_logs")
        .select("*")
        .gte("date", startDate)
        .lt("date", endDate)
        .order("date", { ascending: true });

      if (error) throw error;
      setLogs(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // 今日の日付を "YYYY-MM-DD" 形式で取得
  const getTodayDate = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  // 【出勤ボタン】新規レコード作成。既にあれば何もしない
  async function handleStartWork() {
    const today = getTodayDate();
    try {
      const existingLog = logs.find((l) => l.date === today);
      if (existingLog) {
        console.log("既に出勤記録があります");
        return; // 既に出勤済みなので処理しない
      }

      const nowTime = new Date().toTimeString().slice(0, 5);

      const { error } = await supabase
        .from("attendance_logs")
        .insert([{ date: today, start_time: nowTime }]);
      if (error) throw error;

      await fetchLogs();
    } catch (e) {
      console.error(e);
    }
  }

  // 【退勤・休憩開始・休憩終了ボタン】既存の出勤レコードを更新（上書き）
  async function handleUpdateAttendance(field: keyof AttendanceLog) {
    const today = getTodayDate();
    try {
      const existingLog = logs.find((l) => l.date === today);
      if (!existingLog || !existingLog.id) {
        console.warn("出勤記録がありません。先に出勤ボタンを押してください。");
        return;
      }

      const nowTime = new Date().toTimeString().slice(0, 5);

      const { error } = await supabase
        .from("attendance_logs")
        .update({ [field]: nowTime })
        .eq("id", existingLog.id);

      if (error) throw error;

      await fetchLogs();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="flex">
      <Sidebar
        years={[2025, 2026]}
        months={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onSelectYear={setSelectedYear}
        onSelectMonth={setSelectedMonth}
        onStartWork={handleStartWork}
        onEndWork={() => handleUpdateAttendance("end_time")}
        onBreakStart={() => handleUpdateAttendance("break_start")}
        onBreakEnd={() => handleUpdateAttendance("break_end")}
      />

      <main className="p-4 flex-1">
        {loading ? (
          <div>読み込み中...</div>
        ) : (
          <AttendanceList
            year={selectedYear}
            month={selectedMonth}
            logs={logs}
            reload={fetchLogs}
          />
        )}
      </main>
    </div>
  );
}
