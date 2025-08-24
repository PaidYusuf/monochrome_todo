import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, startOfWeek, addWeeks, eachDayOfInterval, endOfWeek } from 'date-fns';
import styled, { keyframes } from 'styled-components';
import { ThemeContext } from '../context/ThemeContext';

// Simple floating animation
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
`;

// Background gradient animation
const gradientShift = keyframes`
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
`;

const Container = styled.div`
  min-height: 100vh;
  background: ${({ darkMode }) => darkMode 
    ? 'linear-gradient(-45deg, #0a071a, #1a1a2e, #0a071a, #2e1a2e)' 
    : 'linear-gradient(-45deg, #fff, #f0f0f0, #fff, #e8e8e8)'};
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
  color: ${({ darkMode }) => darkMode ? '#e0e0e0' : '#222'};
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  width: 100vw;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: ${({ darkMode }) => darkMode ? 'rgba(10, 7, 26, 0.5)' : 'rgba(255,255,255,0.1)'};
  backdrop-filter: blur(10px);
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid ${({ darkMode }) => darkMode ? 'rgba(0, 245, 212, 0.1)' : 'rgba(0,0,0,0.1)'};
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 1px;
  margin: 0;
  color: ${({ darkMode }) => darkMode ? '#00f5d4' : '#222'};
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const NavButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const NavButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  background: ${({ darkMode, active }) => {
    if (active) return darkMode ? '#00f5d4' : '#222';
    return darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)';
  }};
  color: ${({ darkMode, active }) => {
    if (active) return darkMode ? '#0a071a' : '#fff';
    return darkMode ? '#e0e0e0' : '#222';
  }};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ darkMode }) => darkMode ? '#00f5d4' : '#222'};
    color: ${({ darkMode }) => darkMode ? '#0a071a' : '#fff'};
    transform: translateY(-2px);
  }
  @media (max-width: 480px) {
    padding: 0.4rem 0.7rem;
    font-size: 0.8rem;
    min-width: 90px;
    margin-bottom: 0.5rem;
  }
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  background: #ff4d6d;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #ff2a58;
    transform: translateY(-2px);
  }
  @media (max-width: 480px) {
    padding: 0.4rem 0.7rem;
    font-size: 0.8rem;
    min-width: 90px;
    margin-bottom: 0.5rem;
  }
`;

const ThemeToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: ${({ darkMode }) => darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)'};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ darkMode }) => darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)'};
  }
`;

const MainContent = styled.div`
  width: 100%;
  padding: 2rem;
  box-sizing: border-box;
  @media (max-width: 1280px) {
    padding: 1.5rem;
  }
  @media (max-width: 768px) {
    padding: 1rem;
  }
  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

const AddTaskForm = styled.form`
  background: ${({ darkMode }) => darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)'};
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid ${({ darkMode }) => darkMode ? 'rgba(0, 245, 212, 0.1)' : 'rgba(0,0,0,0.1)'};
  box-shadow: ${({ darkMode }) => darkMode 
    ? '0 4px 20px rgba(0,0,0,0.3)' 
    : '0 4px 20px rgba(0,0,0,0.1)'};
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1.5rem;
    gap: 1rem;
  }
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border: 1px solid ${({ darkMode }) => darkMode ? 'rgba(0, 245, 212, 0.2)' : 'rgba(0,0,0,0.2)'};
  border-radius: 8px;
  background: ${({ darkMode }) => darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.95)'};
  color: ${({ darkMode }) => darkMode ? '#e0e0e0' : '#222'};
  font-size: 0.95rem;
  flex: ${({ flex }) => flex || 1};
  min-width: 0;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ darkMode }) => darkMode ? '#00f5d4' : '#007bff'};
    box-shadow: 0 0 0 2px ${({ darkMode }) => darkMode ? 'rgba(0, 245, 212, 0.1)' : 'rgba(0,123,255,0.1)'};
  }
  
  &::placeholder {
    color: ${({ darkMode }) => darkMode ? 'rgba(224, 224, 224, 0.5)' : 'rgba(0,0,0,0.5)'};
  }
  
  @media (max-width: 768px) {
    width: 100%;
    flex: none;
    font-size: 0.9rem;
    padding: 0.7rem 0.8rem;
  }
  @media (max-width: 480px) {
    width: 100%;
    font-size: 0.85rem;
    padding: 0.6rem 0.6rem;
    border-radius: 6px;
    margin-bottom: 0.5rem;
  }
`;

const Select = styled.select`
  padding: 0.6rem 0.8rem;
  border: 1px solid ${({ darkMode }) => darkMode ? 'rgba(0, 245, 212, 0.2)' : 'rgba(0,0,0,0.2)'};
  border-radius: 4px;
  background: ${({ darkMode }) => darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)'};
  color: ${({ darkMode }) => darkMode ? '#e0e0e0' : '#222'};
  font-size: 0.9rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ darkMode }) => darkMode ? '#00f5d4' : '#222'};
  }
  
  @media (max-width: 768px) {
    width: 100%;
    font-size: 0.85rem;
    padding: 0.5rem 0.6rem;
    border-radius: 6px;
    margin-bottom: 0.5rem;
  }
  @media (max-width: 480px) {
    width: 100%;
    font-size: 0.8rem;
    padding: 0.4rem 0.5rem;
    border-radius: 5px;
    margin-bottom: 0.4rem;
  }
`;

const Button = styled.button`
  padding: 0.6rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  background: ${({ variant, darkMode }) => {
    if (variant === 'success') return '#00f5d4';
    if (variant === 'danger') return '#ff4d6d';
    return darkMode ? '#00f5d4' : '#222';
  }};
  color: ${({ variant, darkMode }) => {
    if (variant === 'success' || variant === 'danger') return '#0a071a';
    return darkMode ? '#0a071a' : '#fff';
  }};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
  }
  @media (max-width: 480px) {
    padding: 0.4rem 0.9rem;
    font-size: 0.8rem;
    min-width: 90px;
    margin-bottom: 0.5rem;
  }
`;

const TasksSection = styled.div`
  background: ${({ darkMode }) => darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)'};
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid ${({ darkMode }) => darkMode ? 'rgba(0, 245, 212, 0.1)' : 'rgba(0,0,0,0.1)'};
  box-shadow: ${({ darkMode }) => darkMode 
    ? '0 4px 20px rgba(0,0,0,0.3)' 
    : '0 4px 20px rgba(0,0,0,0.1)'};
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${({ darkMode }) => darkMode ? '#fff' : '#222'};
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const FilterButton = styled.button`
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid ${({ darkMode, active }) => {
    if (active) return darkMode ? '#00f5d4' : '#222';
    return darkMode ? 'rgba(0, 245, 212, 0.2)' : 'rgba(0,0,0,0.3)';
  }};
  border-radius: 4px;
  background: ${({ darkMode, active }) => {
    if (active) return darkMode ? '#00f5d4' : '#222';
    return 'transparent';
  }};
  color: ${({ darkMode, active }) => {
    if (active) return darkMode ? '#0a071a' : '#fff';
    return darkMode ? '#e0e0e0' : '#222';
  }};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ darkMode }) => darkMode ? '#00f5d4' : '#222'};
    color: ${({ darkMode }) => darkMode ? '#0a071a' : '#fff'};
  }
  @media (max-width: 480px) {
    padding: 0.3rem 0.6rem;
    font-size: 0.75rem;
    min-width: 80px;
    margin-bottom: 0.4rem;
  }
`;

const TaskList = styled.div`
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const TaskItem = styled.div`
  background: ${({ darkMode }) => darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)'};
  padding: 0.8rem;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: ${float} 6s ease-in-out infinite;
  animation-delay: ${({ index }) => index * 0.1}s;
  
  &:hover {
    transform: translateY(-3px);
    background: ${({ darkMode }) => darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)'};
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const TaskContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TaskText = styled.span`
  font-size: 0.9rem;
  text-decoration: ${({ finished }) => finished ? 'line-through' : 'none'};
  opacity: ${({ finished }) => finished ? 0.6 : 1};
  cursor: pointer;
`;

const TaskActions = styled.div`
  display: flex;
  gap: 0.3rem;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ darkMode, active }) => {
    if (active) return darkMode ? '#00f5d4' : '#222';
    return darkMode ? 'rgba(0, 245, 212, 0.2)' : 'rgba(0,0,0,0.3)';
  }};
  border-radius: 4px;
  background: ${({ darkMode, active }) => {
    if (active) return darkMode ? '#00f5d4' : '#222';
    return 'transparent';
  }};
  color: ${({ darkMode, active }) => {
    if (active) return darkMode ? '#0a071a' : '#fff';
    return darkMode ? '#e0e0e0' : '#222';
  }};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ darkMode }) => darkMode ? '#00f5d4' : '#222'};
    color: ${({ darkMode }) => darkMode ? '#0a071a' : '#fff'};
  }
  @media (max-width: 480px) {
    padding: 0.3rem 0.7rem;
    font-size: 0.75rem;
    min-width: 70px;
    margin-bottom: 0.3rem;
  }
`;

const EditForm = styled.form`
  background: ${({ darkMode }) => darkMode ? 'rgba(0, 245, 212, 0.1)' : 'rgba(76, 175, 80, 0.1)'};
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  border: 1px solid #00f5d4;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(5, 1fr);
  }
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }
  
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  
  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`;

const CalendarDay = styled.div`
  background: ${({ $darkMode }) => $darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.95)'};
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 10px;
  min-height: 140px;
  border: 1px solid ${({ $darkMode }) => $darkMode ? 'rgba(0, 245, 212, 0.1)' : 'rgba(0,0,0,0.1)'};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: ${({ $darkMode }) => $darkMode 
    ? '0 2px 8px rgba(0,0,0,0.3)' 
    : '0 2px 8px rgba(0,0,0,0.1)'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ $darkMode }) => $darkMode 
      ? '0 4px 15px rgba(0,0,0,0.4)' 
      : '0 4px 15px rgba(0,0,0,0.15)'};
  }
  
  @media (max-width: 768px) {
    min-height: 120px;
    padding: 0.75rem;
  }
`;

const DashboardPage = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  
  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/monochrome_todo/login");
    }
  }, [navigate]);

  // State management
  const [view, setView] = useState('calendar');
  const [filter, setFilter] = useState('week');
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startHour, setStartHour] = useState('09:00');
  const [endHour, setEndHour] = useState('10:00');
  const [weekOffset, setWeekOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDate, setEditDate] = useState(new Date());
  const [editStartHour, setEditStartHour] = useState('09:00');
  const [editEndHour, setEditEndHour] = useState('10:00');

  // Time options
  const hours = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0') + ':00';
    hours.push(hour);
    if (i < 23) {
      hours.push(i.toString().padStart(2, '0') + ':30');
    }
  }

  // Fetch tasks from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    fetch("https://monochrome-todo.onrender.com/api/tasks", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTodos(data.map(task => ({
            ...task,
            date: new Date(task.date),
            finished: task.finished || false
          })));
        }
      })
      .catch(err => console.error("Error fetching tasks:", err));
  }, []);

  // Add new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("https://monochrome-todo.onrender.com/api/tasks", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: task,
          date: selectedDate.toISOString(),
          startHour,
          endHour,
          finished: false
        })
      });

      if (response.ok) {
        const newTask = await response.json();
        setTodos([...todos, { ...newTask, date: new Date(newTask.date) }]);
        setTask('');
      }
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // Toggle task completion
  const handleToggleTask = async (taskId, currentFinished) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`https://monochrome-todo.onrender.com/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ finished: !currentFinished })
      });

      if (response.ok) {
        setTodos(todos.map(t => 
          t._id === taskId ? { ...t, finished: !currentFinished } : t
        ));
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`https://monochrome-todo.onrender.com/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        setTodos(todos.filter(t => t._id !== taskId));
      }
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // Edit task functions
  const handleEditTask = (task) => {
    setEditingTask(task._id);
    setEditText(task.text);
    setEditDate(new Date(task.date));
    setEditStartHour(task.startHour);
    setEditEndHour(task.endHour);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`https://monochrome-todo.onrender.com/api/tasks/${editingTask}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: editText,
          date: editDate.toISOString(),
          startHour: editStartHour,
          endHour: editEndHour
        })
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTodos(todos.map (t => 
          t._id === editingTask ? { ...updatedTask, date: new Date(updatedTask.date) } : t
        ));
        setEditingTask(null);
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditText('');
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Get current week for calendar view
  const weekStart = addWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), weekOffset);
  const weekDays = eachDayOfInterval({ start: weekStart, end: endOfWeek(weekStart, { weekStartsOn: 1 }) });

  // Filter tasks based on current view
  const getFilteredTasks = () => {
    const now = new Date();
    switch(filter) {
      case 'week':
        return todos.filter(todo => {
          const todoDate = new Date(todo.date);
          return todoDate >= weekStart && todoDate <= endOfWeek(weekStart, { weekStartsOn: 1 });
        });
      case 'today':
        return todos.filter(todo => {
          const todoDate = new Date(todo.date);
          return todoDate.toDateString() === now.toDateString();
        });
      case 'finished':
        return todos.filter(todo => todo.finished);
      case 'unfinished':
        return todos.filter(todo => !todo.finished);
      default:
        return todos;
    }
  };

  const filteredTasks = getFilteredTasks();
  const tasksPerPage = 10;
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const paginatedTasks = filteredTasks.slice((page - 1) * tasksPerPage, page * tasksPerPage);

  return (
    <Container darkMode={darkMode}>
      <Header darkMode={darkMode}>
        <Logo darkMode={darkMode}>Monochrome Todo</Logo>
        
        <NavButtons>
          <NavButton 
            darkMode={darkMode} 
            onClick={() => navigate('/')} // Home route
          >
            Home
          </NavButton>
          <NavButton 
            darkMode={darkMode} 
            active={view === 'calendar'} 
            onClick={() => setView('calendar')}
          >
            Calendar
          </NavButton>
          <NavButton 
            darkMode={darkMode} 
            active={view === 'list'} 
            onClick={() => setView('list')}
          >
            Task List
          </NavButton>
          
          <ThemeToggle darkMode={darkMode} onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="5" fill="#FFD600" />
                <g stroke="#FFD600" strokeWidth="2">
                  <line x1="11" y1="2" x2="11" y2="6" />
                  <line x1="11" y1="16" x2="11" y2="20" />
                  <line x1="2" y1="11" x2="6" y2="11" />
                  <line x1="16" y1="11" x2="20" y2="11" />
                  <line x1="4.22" y1="4.22" x2="7" y2="7" />
                  <line x1="15" y1="15" x2="17.78" y2="17.78" />
                  <line x1="4.22" y1="17.78" x2="7" y2="15" />
                  <line x1="15" y1="7" x2="17.78" y2="4.22" />
                </g>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 11.5A6 6 0 0 1 11.5 5c-.28 0-.56.02-.83.06a.5.5 0 0 0-.32.81A5 5 0 1 0 16.13 13.65a.5.5 0 0 0 .81-.32c.04-.27.06-.55.06-.83Z" fill="#FFD600" />
              </svg>
            )}
          </ThemeToggle>
          
          <LogoutButton onClick={handleLogout}>
            Logout
          </LogoutButton>
        </NavButtons>
      </Header>

      <MainContent>
        {/* Add Task Form */}
        <AddTaskForm onSubmit={handleAddTask} darkMode={darkMode}>
          <Input
            type="text"
            placeholder="Add a new task..."
            value={task}
            onChange={e => setTask(e.target.value)}
            flex={2}
            darkMode={darkMode}
          />
          <Input
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={e => setSelectedDate(new Date(e.target.value))}
            darkMode={darkMode}
          />
          <Select value={startHour} onChange={e => setStartHour(e.target.value)} darkMode={darkMode}>
            {hours.map(h => <option key={h} value={h}>{h}</option>)}
          </Select>
          <Select value={endHour} onChange={e => setEndHour(e.target.value)} darkMode={darkMode}>
            {hours.map(h => <option key={h} value={h}>{h}</option>)}
          </Select>
          <Button type="submit" darkMode={darkMode}>Add Task</Button>
        </AddTaskForm>

        {/* Edit Task Form */}
        {editingTask && (
          <EditForm onSubmit={handleUpdateTask} darkMode={darkMode}>
            <Input
              type="text"
              placeholder="Edit task..."
              value={editText}
              onChange={e => setEditText(e.target.value)}
              flex={2}
              darkMode={darkMode}
            />
            <Input
              type="date"
              value={format(editDate, 'yyyy-MM-dd')}
              onChange={e => setEditDate(new Date(e.target.value))}
              darkMode={darkMode}
            />
            <Select value={editStartHour} onChange={e => setEditStartHour(e.target.value)} darkMode={darkMode}>
              {hours.map(h => <option key={h} value={h}>{h}</option>)}
            </Select>
            <Select value={editEndHour} onChange={e => setEditEndHour(e.target.value)} darkMode={darkMode}>
              {hours.map(h => <option key={h} value={h}>{h}</option>)}
            </Select>
            <Button type="submit" variant="success" darkMode={darkMode}>Update</Button>
            <Button type="button" variant="danger" onClick={handleCancelEdit} darkMode={darkMode}>Cancel</Button>
          </EditForm>
        )}

        {/* Tasks Section */}
        <TasksSection darkMode={darkMode}>
          <SectionTitle darkMode={darkMode}>
            {view === 'calendar' ? 'Calendar View' : 'Task List'}
          </SectionTitle>

          <FilterButtons>
            <FilterButton 
              darkMode={darkMode} 
              active={filter === 'week'} 
              onClick={() => setFilter('week')}
            >
              This Week
            </FilterButton>
            <FilterButton 
              darkMode={darkMode} 
              active={filter === 'today'} 
              onClick={() => setFilter('today')}
            >
              Today
            </FilterButton>
            <FilterButton 
              darkMode={darkMode} 
              active={filter === 'finished'} 
              onClick={() => setFilter('finished')}
            >
              Finished
            </FilterButton>
            <FilterButton 
              darkMode={darkMode} 
              active={filter === 'unfinished'} 
              onClick={() => setFilter('unfinished')}
            >
              Unfinished
            </FilterButton>
          </FilterButtons>

          {view === 'calendar' ? (
            <div>
              <div style={{ 
                textAlign: 'center', 
                marginBottom: '1rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <Button 
                  darkMode={darkMode} 
                  onClick={() => setWeekOffset(weekOffset - 1)}
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                >
                  ← Prev
                </Button>
                <span style={{ 
                  margin: '0 1rem', 
                  fontSize: '1rem', 
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
                  Week of {format(weekStart, 'dd MMM yyyy')}
                </span>
                <Button 
                  darkMode={darkMode} 
                  onClick={() => setWeekOffset(weekOffset + 1)}
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                >
                  Next →
                </Button>
              </div>
              
              <CalendarGrid>
                {weekDays.map(day => (
                  <CalendarDay
                    key={day.toISOString()}
                    $darkMode={darkMode}
                  >
                    <div style={{ 
                      fontWeight: 'bold', 
                      marginBottom: '0.5rem', 
                      fontSize: '0.9rem',
                      color: darkMode ? '#fff' : '#333'
                    }}>
                      {format(day, 'EEE')}
                    </div>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      marginBottom: '0.75rem', 
                      opacity: 0.8,
                      color: darkMode ? '#ccc' : '#666'
                    }}>
                      {format(day, 'dd MMM')}
                    </div>
                    
                    {todos.filter(todo => {
                      const todoDate = new Date(todo.date);
                      return todoDate.toDateString() === day.toDateString();
                    }).map(task => (
                      <div 
                        key={task._id} 
                        style={{ 
                          fontSize: '0.75rem', 
                          padding: '0.3rem 0.5rem', 
                          marginBottom: '0.3rem',
                          background: darkMode ? 'rgba(0, 245, 212, 0.08)' : 'rgba(0,0,0,0.08)',
                          borderRadius: '4px',
                          textDecoration: task.finished ? 'line-through' : 'none',
                          opacity: task.finished ? 0.6 : 1,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Checkbox
                            type="checkbox"
                            checked={task.finished}
                            onChange={() => handleToggleTask(task._id, task.finished)}
                            style={{ width: '12px', height: '12px' }}
                          />
                          <span 
                            onClick={() => handleEditTask(task)} 
                            style={{ cursor: 'pointer', flex: 1, lineHeight: '1.3' }}
                          >
                            {task.text.length > 22 ? `${task.text.substring(0, 22)}...` : task.text}
                          </span>
                        </div>
                      </div>
                    ))}
                  </CalendarDay>
                ))}
              </CalendarGrid>
            </div>
          ) : (
            <div>
              <TaskList>
                {paginatedTasks.map((task, index) => (
                  <TaskItem key={task._id} index={index} darkMode={darkMode}>
                    <TaskContent>
                      <Checkbox
                        type="checkbox"
                        checked={task.finished}
                        onChange={() => handleToggleTask(task._id, task.finished)}
                      />
                      <div>
                        <TaskText 
                          finished={task.finished}
                          onClick={() => handleEditTask(task)}
                        >
                          {task.text}
                        </TaskText>
                        <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '0.2rem' }}>
                          {format(new Date(task.date), 'dd MMM yyyy')} • {task.startHour} - {task.endHour}
                        </div>
                      </div>
                    </TaskContent>
                    <TaskActions>
                      <Button 
                        onClick={() => handleEditTask(task)} 
                        darkMode={darkMode} 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="danger" 
                        onClick={() => handleDeleteTask(task._id)} 
                        darkMode={darkMode}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                      >
                        Delete
                      </Button>
                    </TaskActions>
                  </TaskItem>
                ))}
              </TaskList>

              {totalPages > 1 && (
                <Pagination>
                  {[...Array(totalPages)].map((_, i) => (
                    <PageButton
                      key={i}
                      darkMode={darkMode}
                      active={page === i + 1}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </PageButton>
                  ))}
                </Pagination>
              )}
            </div>
          )}
        </TasksSection>
      </MainContent>
    </Container>
  );
};

export default DashboardPage;
