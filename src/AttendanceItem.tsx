import React, { useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

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

interface Props {
  log: AttendanceLog;
  reload: () => void;
}

export const AttendanceItem: React.FC<Props> = ({ log, reload }) => {
  const [loading, setLoading] = useState(false);

  const formatTime = (time?: string) => {
    if (!time) return "";
    const [h, m] = time.split(":");
    return `${Number(h)}：${m}`;
  };

  async function updateLog(update: Partial<AttendanceLog>) {
    if (!log.id) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("attendance_logs")
        .update(update)
        .eq("id", log.id);

      if (error) throw error;
      reload();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleContent = async () => {
    if (!log.id) return;
    const result = prompt("業務内容を入力", log.content ?? "");
    if (result !== null) {
      await updateLog({ content: result });
    }
  };

  const handleResult = async () => {
    if (!log.id) return;
    const result = prompt("成果を入力", log.result ?? "");
    if (result !== null) {
      await updateLog({ result });
    }
  };

  const handleMemo = async () => {
    if (!log.id) return;
    const result = prompt("備考を入力", log.memo ?? "");
    if (result !== null) {
      await updateLog({ memo: result });
    }
  };

  return (
    <tr className={loading ? "opacity-50" : ""}>
      <td className="border p-2">{log.date.split("-")[2]}日</td>
      <td className="border p-2">
        {log.start_time ? formatTime(log.start_time) : ""}
      </td>
      <td className="border p-2">
        {log.break_start ? formatTime(log.break_start) : ""}
      </td>
      <td className="border p-2">
        {log.break_end ? formatTime(log.break_end) : ""}
      </td>
      <td className="border p-2">
        {log.end_time ? formatTime(log.end_time) : ""}
      </td>

      <td className="border p-2">
        <button
          onClick={handleContent}
          className="p-1 hover:bg-blue-100 rounded"
        >
          <PencilSquareIcon className="h-4 w-4 text-blue-500" />{" "}
        </button>
        <div className="text-xs text-gray-700">{log.content}</div>
      </td>

      <td className="border p-2">
        <button
          onClick={handleResult}
          className="p-1 hover:bg-blue-100 rounded"
        >
          <PencilSquareIcon className="h-4 w-4 text-blue-500" />{" "}
        </button>
        <div className="text-xs text-gray-700">{log.result}</div>
      </td>

      <td className="border p-2">
        <button onClick={handleMemo} className="p-1 hover:bg-blue-100 rounded">
          <PencilSquareIcon className="h-4 w-4 text-blue-500" />{" "}
        </button>
        <div className="text-xs text-gray-700">{log.memo}</div>
      </td>
    </tr>
  );
};
