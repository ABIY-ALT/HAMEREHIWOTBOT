export type AttendanceRecord = {
  id: string;
  userName: string;
  department: string;
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
  };
};

export type User = {
  name: string;
  phone: string;
  department: string;
  location: string;
};
