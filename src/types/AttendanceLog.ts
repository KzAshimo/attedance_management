export interface AttendanceLog {
  id: string;  // 出勤時作成されるid（UUIDなど）
  date: string;
  start_time?: string;
  break_start?: string;
  break_end?: string;
  end_time?: string;
  content?: string;
  result? :string;
  memo?: string;
}
