import { createContext, useContext, useState, useCallback } from 'react';
import { attendanceService } from '../services/attendanceService';

const AttendanceContext = createContext(null);

export const AttendanceProvider = ({ children }) => {
  const [today, setToday] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchToday = useCallback(async () => {
    try {
      const response = await attendanceService.getToday();
      setToday(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch attendance');
    }
  }, []);

  const fetchLogs = useCallback(async (params) => {
    setLoading(true);
    try {
      const response = await attendanceService.getLogs(params);
      setLogs(response.data.logs);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  }, []);

  const checkIn = async (faceEmbedding, location, date) => {
    setLoading(true);
    setError(null);
    try {
      const response = await attendanceService.checkIn(faceEmbedding, location, date);
      await fetchToday();
      return response;
    } catch (err) {
      const message = err.response?.data?.message || 'Check-in failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const checkOut = async (faceEmbedding, location, date) => {
    setLoading(true);
    setError(null);
    try {
      const response = await attendanceService.checkOut(faceEmbedding, location, date);
      await fetchToday();
      return response;
    } catch (err) {
      const message = err.response?.data?.message || 'Check-out failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    today,
    logs,
    loading,
    error,
    fetchToday,
    fetchLogs,
    checkIn,
    checkOut,
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
