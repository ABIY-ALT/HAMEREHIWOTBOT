import type { AttendanceRecord } from './types';

export const mockAttendanceHistory: AttendanceRecord[] = Array.from({ length: 20 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  date.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));

  return {
    id: `att_${i + 1}`,
    userName: 'John Doe',
    department: 'Engineering',
    timestamp: date,
    location: {
      latitude: 34.052235 + (Math.random() - 0.5) * 0.1, // around LA
      longitude: -118.243683 + (Math.random() - 0.5) * 0.1,
    },
  };
});


export const mockAdminAttendanceList: AttendanceRecord[] = [
  ...mockAttendanceHistory,
  ...Array.from({ length: 15 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 5));
    date.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
    const departments = ['Marketing', 'Sales', 'HR'];
    const users = ['Jane Smith', 'Peter Jones', 'Mary Johnson'];

    return {
      id: `att_admin_${i + 1}`,
      userName: users[i % users.length],
      department: departments[i % departments.length],
      timestamp: date,
      location: {
        latitude: 40.712776 + (Math.random() - 0.5) * 0.1, // around NYC
        longitude: -74.005974 + (Math.random() - 0.5) * 0.1,
      },
    };
  })
].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
