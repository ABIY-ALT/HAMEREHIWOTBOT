import type { AttendanceRecord, User } from './types';

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


const moreUsers: User[] = [
  { name: 'Jane Smith', phone: '(212) 555-1234', department: 'Marketing', location: 'New York Office' },
  { name: 'Peter Jones', phone: '(310) 555-5678', department: 'Sales', location: 'Los Angeles Office' },
  { name: 'Mary Johnson', phone: '(312) 555-9012', department: 'HR', location: 'Chicago Office' },
  { name: 'David Williams', phone: '(415) 555-3456', department: 'Engineering', location: 'San Francisco Office' },
  { name: 'Sarah Brown', phone: '(212) 555-7890', department: 'Marketing', location: 'New York Office' },
  { name: 'Michael Davis', phone: '(310) 555-2345', department: 'Sales', location: 'Los Angeles Office' },
];

export const mockAdminUserList: User[] = [
    { name: 'John Doe', phone: '(123) 456-7890', department: 'Engineering', location: 'New York Office' },
    ...moreUsers,
].sort((a,b) => a.name.localeCompare(b.name));


export const mockAdminAttendanceList: AttendanceRecord[] = [
  ...mockAttendanceHistory,
  ...moreUsers.flatMap((user, index) => (
    Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
      return {
        id: `att_admin_${user.name}_${i}`,
        userName: user.name,
        department: user.department,
        timestamp: date,
        location: {
          latitude: 40.712776 + (Math.random() - 0.5) * 0.1, // around NYC
          longitude: -74.005974 + (Math.random() - 0.5) * 0.1,
        },
      }
    })
  ))
].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
