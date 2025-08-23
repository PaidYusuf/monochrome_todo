// Custom theme slider
const ThemeSlider = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 1rem;
`;

const SliderInput = styled.input`
  display: none;
`;

const SliderTrack = styled.span`
  width: 44px;
  height: 24px;
  background: ${({ checked }) => checked ? '#404040' : '#c0c0c0'};
  border-radius: 12px;
  position: relative;
  transition: background 0.3s;
  margin-right: 0.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
`;

const SliderThumb = styled.span`
  position: absolute;
  top: 2px;
  left: ${({ checked }) => checked ? '22px' : '2px'};
  width: 20px;
  height: 20px;
  background: ${({ checked }) => checked ? '#e5e5e5' : '#1a1a1a'};
  border-radius: 50%;
  transition: left 0.3s, background 0.3s;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
`;
import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, format, isSameDay, isWithinInterval } from 'date-fns';

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: ${({ theme }) => theme.darkMode 
    ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' 
    : 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)'};
  color: ${({ theme }) => theme.darkMode ? '#e5e5e5' : '#2c2c2c'};
  display: flex;
  flex-direction: column;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const Title = styled.h1`
  margin-top: 3rem;
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: 2px;
`;

const Subtitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 400;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.darkMode ? '#bbb' : '#444'};
`;

const Button = styled.button`
  margin-top: 2rem;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  border-radius: 10px;
  border: none;
  background: ${({ theme }) => theme.darkMode ? '#222' : '#eee'};
  color: ${({ theme }) => theme.darkMode ? '#fff' : '#222'};
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
`;

const NavBar = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.darkMode 
    ? 'rgba(26, 26, 26, 0.95)' 
    : 'rgba(255, 255, 255, 0.95)'};
  backdrop-filter: blur(20px);
  color: ${({ theme }) => theme.darkMode ? '#e5e5e5' : '#2c2c2c'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  box-sizing: border-box;
  box-shadow: ${({ theme }) => theme.darkMode 
    ? '0 8px 32px rgba(0,0,0,0.4)' 
    : '0 8px 32px rgba(0,0,0,0.1)'};
  border-bottom: 1px solid ${({ theme }) => theme.darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
`;

const NavButton = styled.button`
  background: ${({ active, theme }) => {
    if (active) {
      return theme.darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)';
    }
    return 'transparent';
  }};
  color: ${({ theme }) => theme.darkMode ? '#e5e5e5' : '#2c2c2c'};
  border: ${({ active, theme }) => active 
    ? `1px solid ${theme.darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}` 
    : 'none'};
  font-size: 1rem;
  font-weight: 600;
  padding: 0.8rem 1.8rem;
  border-radius: 12px;
  margin-right: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  &:hover {
    background: ${({ theme }) => theme.darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
    transform: translateY(-1px);
  }
`;

const LogoutButton = styled.button`
  background: ${({ theme }) => theme.darkMode ? 'rgba(220,53,69,0.2)' : 'rgba(220,53,69,0.1)'};
  color: ${({ theme }) => theme.darkMode ? '#ff6b7a' : '#dc3545'};
  border: 1px solid ${({ theme }) => theme.darkMode ? 'rgba(255,107,122,0.3)' : 'rgba(220,53,69,0.2)'};
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.8rem 1.8rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  &:hover {
    background: ${({ theme }) => theme.darkMode ? 'rgba(220,53,69,0.3)' : 'rgba(220,53,69,0.15)'};
    transform: translateY(-1px);
  }
  box-shadow: 0 2px 8px rgba(0,0,0,${({ theme }) => theme.darkMode ? '0.4' : '0.15'});
  transition: background 0.2s, transform 0.1s;
  &:hover {
    background: ${({ theme }) => theme.darkMode ? '#404040' : '#d0d0d0'};
    transform: translateY(-1px);
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin: 2rem 0 1rem 0;
`;

const FilterButton = styled.button`
  background: ${({ active, theme }) => {
    if (active) {
      return theme.darkMode 
        ? 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)' 
        : 'linear-gradient(135deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.04) 100%)';
    }
    return 'transparent';
  }};
  color: ${({ active, theme }) => {
    if (active) return theme.darkMode ? '#ffffff' : '#000000';
    return theme.darkMode ? '#b0b0b0' : '#666666';
  }};
  border: 1px solid ${({ active, theme }) => {
    if (active) {
      return theme.darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)';
    }
    return theme.darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  }};
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  &:hover {
    background: ${({ theme }) => theme.darkMode 
      ? 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)' 
      : 'linear-gradient(135deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.03) 100%)'};
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'};
  }
`;

const CalendarGrid = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 2rem auto;
  background: ${({ theme }) => theme.darkMode 
    ? 'rgba(26, 26, 26, 0.8)' 
    : 'rgba(255, 255, 255, 0.9)'};
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: ${({ theme }) => theme.darkMode 
    ? '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)' 
    : '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)'};
  padding: 2rem;
  display: grid;
  grid-template-columns: 120px repeat(7, 1fr);
  grid-template-rows: 60px repeat(24, 40px);
  gap: 1px;
  border: none;
`;

const CalendarCell = styled.div`
  border: 1px solid ${({ theme }) => theme.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.darkMode ? '#e5e5e5' : '#2c2c2c'};
  background: ${({ theme }) => theme.darkMode 
    ? 'rgba(255,255,255,0.02)' 
    : 'rgba(0,0,0,0.01)'};
  transition: all 0.3s ease;
  border-radius: 6px;
  &:hover {
    background: ${({ theme }) => theme.darkMode 
      ? 'rgba(255,255,255,0.06)' 
      : 'rgba(0,0,0,0.04)'};
    border-color: ${({ theme }) => theme.darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'};
  }
`;

const TaskList = styled.ul`
  width: 90%;
  max-width: 1000px;
  background: ${({ theme }) => theme.darkMode 
    ? 'rgba(26, 26, 26, 0.8)' 
    : 'rgba(255, 255, 255, 0.9)'};
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: ${({ theme }) => theme.darkMode 
    ? '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)' 
    : '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)'};
  margin: 2rem auto;
  padding: 2rem;
  list-style: none;
  border: none;
`;

const TaskItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 1.5rem;
  margin-bottom: 0.8rem;
  border-radius: 16px;
  background: ${({ theme }) => theme.darkMode 
    ? 'rgba(255,255,255,0.03)' 
    : 'rgba(0,0,0,0.02)'};
  border: 1px solid ${({ theme }) => theme.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
  color: ${({ theme }) => theme.darkMode ? '#e5e5e5' : '#2c2c2c'};
  font-size: 1rem;
  transition: all 0.3s ease;
  &:last-child { margin-bottom: 0; }
  &:hover {
    background: ${({ theme }) => theme.darkMode 
      ? 'rgba(255,255,255,0.08)' 
      : 'rgba(0,0,0,0.05)'};
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'};
    box-shadow: ${({ theme }) => theme.darkMode 
      ? '0 8px 25px rgba(0,0,0,0.3)' 
      : '0 8px 25px rgba(0,0,0,0.08)'};
  }
`;

const Pagination = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 1.5rem 0;
`;

const PaginationButton = styled.button`
  background: ${({ active, theme }) => {
    if (active) {
      return theme.darkMode 
        ? 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)' 
        : 'linear-gradient(135deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.04) 100%)';
    }
    return 'transparent';
  }};
  color: ${({ active, theme }) => {
    if (active) return theme.darkMode ? '#ffffff' : '#000000';
    return theme.darkMode ? '#b0b0b0' : '#666666';
  }};
  border: 1px solid ${({ active, theme }) => {
    if (active) {
      return theme.darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)';
    }
    return theme.darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  }};
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  &:hover {
    background: ${({ theme }) => theme.darkMode 
      ? 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)' 
      : 'linear-gradient(135deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.03) 100%)'};
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'};
  }
`;

const AnimatedBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  background: ${({ theme }) => theme.darkMode
    ? 'radial-gradient(circle at 20% 50%, rgba(45, 45, 45, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(60, 60, 60, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(30, 30, 30, 0.3) 0%, transparent 50%)'
    : 'radial-gradient(circle at 20% 50%, rgba(200, 200, 200, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(150, 150, 150, 0.4) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(180, 180, 180, 0.4) 0%, transparent 50%)'};
  animation: floatBubbles 20s ease-in-out infinite;
  opacity: 0.6;

  @keyframes floatBubbles {
    0%, 100% { 
      transform: translate(0px, 0px) scale(1); 
    }
    33% { 
      transform: translate(30px, -30px) scale(1.1); 
    }
    66% { 
      transform: translate(-20px, 20px) scale(0.9); 
    }
  }
`;

const DashboardPage = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
  const [view, setView] = useState('calendar');
  const [filter, setFilter] = useState('week');
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startHour, setStartHour] = useState('00:00');
  const [endHour, setEndHour] = useState('01:00');
  const [weekOffset, setWeekOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [customStart, setCustomStart] = useState(new Date());
  const [customEnd, setCustomEnd] = useState(new Date());
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDate, setEditDate] = useState(new Date());
  const [editStartHour, setEditStartHour] = useState('00:00');
  const [editEndHour, setEditEndHour] = useState('01:00');

  // Fetch tasks from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://localhost:5000/api/tasks", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTodos(data);
        }
      })
      .catch(err => {
        // Optionally handle error
      });
  }, []);

  // Generate week days dynamically
  const weekStart = addDays(startOfWeek(new Date(), { weekStartsOn: 6 }), weekOffset * 7); // Saturday start
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  // Set initial hour window to start from current hour
  const getInitialHourWindowStart = () => {
    const now = new Date();
    return now.getHours();
  };
  const [hourWindowStart, setHourWindowStart] = useState(getInitialHourWindowStart());
  const visibleHours = hours.slice(hourWindowStart, hourWindowStart + 5);

  // Add task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    
    const newTask = {
      text: task,
      date: format(selectedDate, 'yyyy-MM-dd'),
      startHour,
      endHour
    };
    
    fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTask)
    })
      .then(res => res.json())
      .then(data => {
        setTodos([...todos, data]);
        setTask('');
      })
      .catch(err => {
        console.error('Error adding task:', err);
      });
  };

  // Edit task
  const handleEditTask = (taskToEdit) => {
    setEditingTask(taskToEdit);
    setEditText(taskToEdit.text);
    setEditDate(new Date(taskToEdit.date));
    setEditStartHour(taskToEdit.startHour);
    setEditEndHour(taskToEdit.endHour);
  };

  // Update task
  const handleUpdateTask = (e) => {
    e.preventDefault();
    if (!editText.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    
    const updatedTask = {
      text: editText,
      date: format(editDate, 'yyyy-MM-dd'),
      startHour: editStartHour,
      endHour: editEndHour
    };
    
    fetch(`http://localhost:5000/api/tasks/${editingTask._id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedTask)
    })
      .then(res => res.json())
      .then(data => {
        setTodos(todos.map(todo => 
          todo._id === editingTask._id ? data : todo
        ));
        setEditingTask(null);
        setEditText('');
        setEditDate(new Date());
        setEditStartHour('00:00');
        setEditEndHour('01:00');
      })
      .catch(err => {
        console.error('Error updating task:', err);
      });
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditText('');
    setEditDate(new Date());
    setEditStartHour('00:00');
    setEditEndHour('01:00');
  };

  // Toggle finished status
  const handleToggleFinished = (taskToToggle) => {
    console.log('Toggling task:', taskToToggle.text, 'Current finished:', taskToToggle.finished);
    const token = localStorage.getItem("token");
    if (!token) return;
    
    fetch(`http://localhost:5000/api/tasks/${taskToToggle._id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ finished: !taskToToggle.finished })
    })
      .then(res => res.json())
      .then(data => {
        console.log('Updated task:', data);
        setTodos(todos.map(todo => 
          todo._id === taskToToggle._id ? data : todo
        ));
      })
      .catch(err => {
        console.error('Error toggling task status:', err);
      });
  };

  // Date range for filtering
  let rangeStart, rangeEnd;
  if (filter === 'week') {
    rangeStart = startOfWeek(new Date(), { weekStartsOn: 6 });
    rangeEnd = endOfWeek(new Date(), { weekStartsOn: 6 });
  } else if (filter === 'month') {
    rangeStart = startOfMonth(new Date());
    rangeEnd = endOfMonth(new Date());
  } else if (filter === 'year') {
    rangeStart = startOfYear(new Date());
    rangeEnd = endOfYear(new Date());
  } else if (filter === 'custom') {
    rangeStart = customStart;
    rangeEnd = customEnd;
  }

  // Pagination logic for task view
  const tasksPerPage = 7;
  const filteredTodos = todos.filter(todo => {
    const todoDate = new Date(todo.date);
    return isWithinInterval(todoDate, { start: rangeStart, end: rangeEnd });
  });
  const totalPages = Math.ceil(filteredTodos.length / tasksPerPage);
  const paginatedTodos = filteredTodos.slice((page - 1) * tasksPerPage, page * tasksPerPage);

  // Scroll hour window
  const scrollUp = () => {
    setHourWindowStart(prev => Math.max(0, prev - 1));
  };
  const scrollDown = () => {
    setHourWindowStart(prev => Math.min(hours.length - 5, prev + 1));
  };

  return (
    <Wrapper theme={{ darkMode }}>
      <AnimatedBackground theme={{ darkMode }} />
      <MainContent theme={{ darkMode }}>
        <NavBar theme={{ darkMode }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            style={{
              background: darkMode ? '#333333' : '#e0e0e0',
              color: darkMode ? '#e5e5e5' : '#1a1a1a',
              border: 'none',
              borderRadius: 10,
              padding: '0.7rem 1.5rem',
              fontWeight: 700,
              fontSize: '1.1rem',
              cursor: 'pointer',
              marginRight: '1.5rem',
              boxShadow: `0 2px 8px rgba(0,0,0,${darkMode ? '0.4' : '0.15'})`,
              transition: 'all 0.2s'
            }}
            onClick={() => navigate('/')}
            title="Home"
            onMouseEnter={(e) => {
              e.target.style.background = darkMode ? '#404040' : '#d0d0d0';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = darkMode ? '#333333' : '#e0e0e0';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Home
          </button>
          <NavButton theme={{ darkMode }} active={view === 'calendar'} onClick={() => setView('calendar')}>Calendar View</NavButton>
          <NavButton theme={{ darkMode }} active={view === 'task'} onClick={() => setView('task')}>Task View</NavButton>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ThemeSlider>
            <SliderInput
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <SliderTrack checked={darkMode}>
              <SliderThumb checked={darkMode} />
            </SliderTrack>
            <span style={{ fontSize: '1rem', color: darkMode ? '#e5e5e5' : '#1a1a1a', marginLeft: '0.5rem' }}>{darkMode ? 'Dark' : 'Light'} Mode</span>
          </ThemeSlider>
          <LogoutButton theme={{ darkMode }} style={{ marginLeft: 0 }} onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }}>Log Out</LogoutButton>
        </div>
  </NavBar>
  {view === 'calendar' ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 900, margin: '2rem auto 0 auto' }}>
            <button style={{ background: darkMode ? '#222' : '#eee', color: darkMode ? '#fff' : '#222', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => setWeekOffset(weekOffset - 1)}>Previous Week</button>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: darkMode ? '#eee' : '#222' }}>Week of {format(weekStart, 'dd MMM yyyy')}</div>
            <button style={{ background: darkMode ? '#222' : '#eee', color: darkMode ? '#fff' : '#222', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => setWeekOffset(weekOffset + 1)}>Next Week</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
            <button style={{ background: darkMode ? '#222' : '#eee', color: darkMode ? '#fff' : '#222', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer' }} onClick={scrollUp} disabled={hourWindowStart === 0}>↑</button>
            <span style={{ color: darkMode ? '#eee' : '#222', fontWeight: 600 }}>Hours {visibleHours[0]} - {visibleHours[visibleHours.length - 1]}</span>
            <button style={{ background: darkMode ? '#222' : '#eee', color: darkMode ? '#fff' : '#222', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer' }} onClick={scrollDown} disabled={hourWindowStart === hours.length - 5}>↓</button>
          </div>
          <div
            style={{ width: '100%', maxWidth: 900, margin: '0 auto' }}
            onWheel={e => {
              if (e.deltaY > 0) scrollDown();
              else if (e.deltaY < 0) scrollUp();
            }}
          >
            <CalendarGrid theme={{ darkMode }} style={{ gridTemplateColumns: '120px repeat(7, 1fr)', gridTemplateRows: `60px repeat(5, 48px)` }}>
              <CalendarCell theme={{ darkMode }} style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Day/Hour</CalendarCell>
              {days.map(day => (
                <CalendarCell theme={{ darkMode }} key={day.toISOString()}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{format(day, 'EEEE')}</div>
                    <div style={{ fontSize: '0.95rem', color: darkMode ? '#bbb' : '#888' }}>{format(day, 'dd MMM yyyy')}</div>
                  </div>
                </CalendarCell>
              ))}
              {visibleHours.map((hour, hourIdx) => (
                <CalendarCell theme={{ darkMode }} key={hour} style={{ fontWeight: 'bold', gridColumn: 1, gridRow: hourIdx + 2 }}>{hour}</CalendarCell>
              ))}
              {days.map((day, dayIdx) =>
                visibleHours.map((hour, hourIdx) => {
                  const todo = todos.find(t => t.date === format(day, 'yyyy-MM-dd') && t.startHour === hour);
                  return (
                    <CalendarCell
                      theme={{ darkMode }}
                      key={format(day, 'yyyy-MM-dd') + hour}
                      style={{ gridColumn: dayIdx + 2, gridRow: hourIdx + 2 }}
                    >
                      {todo ? todo.text : ''}
                    </CalendarCell>
                  );
                })
              )}
              {days.map((day, dayIdx) =>
                visibleHours.map((hour, hourIdx) => {
                  // Find if any task covers this cell
                  const cellTasks = todos.filter(t => {
                    if (t.date !== format(day, 'yyyy-MM-dd')) {
                      // If endHour < startHour, check if this is the next day and hour is <= endHour - 1
                      const prevDay = days[dayIdx - 1];
                      if (prevDay && t.date === format(prevDay, 'yyyy-MM-dd')) {
                        const startIdx = hours.indexOf(t.startHour);
                        const endIdx = hours.indexOf(t.endHour);
                        const cellIdx = hours.indexOf(hour);
                        return endIdx < startIdx && cellIdx < endIdx;
                      }
                      return false;
                    }
                    const startIdx = hours.indexOf(t.startHour);
                    const endIdx = hours.indexOf(t.endHour);
                    const cellIdx = hours.indexOf(hour);
                    if (endIdx < startIdx) {
                      // Task spans to next day
                      return cellIdx >= startIdx;
                    }
                    return cellIdx >= startIdx && cellIdx < endIdx;
                  });
                  return (
                    <CalendarCell
                      theme={{ darkMode }}
                      key={format(day, 'yyyy-MM-dd') + hour}
                      style={{ gridColumn: dayIdx + 2, gridRow: hourIdx + 2 }}
                    >
                      {cellTasks.map((task, i) => (
                        <div 
                          key={i} 
                          style={{ 
                            background: task.finished 
                              ? (darkMode ? '#2e7d32' : '#c8e6c9') 
                              : (darkMode ? '#333' : '#eee'), 
                            color: task.finished 
                              ? (darkMode ? '#e8f5e8' : '#1b5e20') 
                              : (darkMode ? '#fff' : '#222'), 
                            borderRadius: 6, 
                            padding: '2px 6px', 
                            margin: '2px 0', 
                            fontSize: '0.95rem', 
                            fontWeight: 500,
                            cursor: 'pointer',
                            textDecoration: task.finished ? 'line-through' : 'none',
                            opacity: task.finished ? 0.8 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Click to edit"
                        >
                          <input
                            type="checkbox"
                            checked={task.finished || false}
                            onChange={(e) => {
                              console.log('Checkbox clicked for task:', task.text);
                              e.stopPropagation();
                              e.preventDefault();
                              handleToggleFinished(task);
                            }}
                            onClick={(e) => {
                              console.log('Checkbox onClick for task:', task.text);
                              e.stopPropagation();
                            }}
                            style={{ 
                              cursor: 'pointer',
                              accentColor: darkMode ? '#4CAF50' : '#2e7d32',
                              width: '14px',
                              height: '14px'
                            }}
                          />
                          <span onClick={() => handleEditTask(task)} style={{ cursor: 'pointer', flex: 1 }}>
                            {task.text}
                          </span>
                        </div>
                      ))}
                    </CalendarCell>
                  );
                })
              )}
            </CalendarGrid>
          </div>
          <FormContainer onSubmit={handleAddTask} theme={{ darkMode }}>
            <StyledInput
              flex={2}
              type="text"
              placeholder="Add a new task..."
              value={task}
              onChange={e => setTask(e.target.value)}
              theme={{ darkMode }}
            />
            <StyledInput
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={e => setSelectedDate(new Date(e.target.value))}
              theme={{ darkMode }}
            />
            <StyledSelect value={startHour} onChange={e => setStartHour(e.target.value)} theme={{ darkMode }}>
              {hours.map(h => <option key={h} value={h}>{h}</option>)}
            </StyledSelect>
            <StyledSelect value={endHour} onChange={e => setEndHour(e.target.value)} theme={{ darkMode }}>
              {hours.map(h => <option key={h} value={h}>{h}</option>)}
            </StyledSelect>
            <StyledButton type="submit" theme={{ darkMode }}>Add</StyledButton>
          </FormContainer>
          {editingTask && (
            <EditFormContainer onSubmit={handleUpdateTask} theme={{ darkMode }}>
              <StyledInput
                flex={2}
                type="text"
                placeholder="Edit task..."
                value={editText}
                onChange={e => setEditText(e.target.value)}
                theme={{ darkMode }}
              />
              <StyledInput
                type="date"
                value={format(editDate, 'yyyy-MM-dd')}
                onChange={e => setEditDate(new Date(e.target.value))}
                theme={{ darkMode }}
              />
              <StyledSelect value={editStartHour} onChange={e => setEditStartHour(e.target.value)} theme={{ darkMode }}>
                {hours.map(h => <option key={h} value={h}>{h}</option>)}
              </StyledSelect>
              <StyledSelect value={editEndHour} onChange={e => setEditEndHour(e.target.value)} theme={{ darkMode }}>
                {hours.map(h => <option key={h} value={h}>{h}</option>)}
              </StyledSelect>
              <StyledButton variant="success" type="submit" theme={{ darkMode }}>Update</StyledButton>
              <StyledButton variant="danger" type="button" onClick={handleCancelEdit} theme={{ darkMode }}>Cancel</StyledButton>
            </EditFormContainer>
          )}
        </>
  ) : (
        <>
          <FilterBar>
            <FilterButton theme={{ darkMode }} active={filter === 'week'} onClick={() => setFilter('week')}>Week</FilterButton>
            <FilterButton theme={{ darkMode }} active={filter === 'month'} onClick={() => setFilter('month')}>Month</FilterButton>
            <FilterButton theme={{ darkMode }} active={filter === 'year'} onClick={() => setFilter('year')}>Year</FilterButton>
            <FilterButton theme={{ darkMode }} active={filter === 'custom'} onClick={() => setFilter('custom')}>Custom Time</FilterButton>
            {filter === 'custom' && (
              <>
                <StyledInput type="date" value={customStart.toISOString().slice(0,10)} onChange={e => setCustomStart(new Date(e.target.value))} theme={{ darkMode }} style={{ marginLeft: '1rem', flex: 'none', width: '150px' }} />
                <StyledInput type="date" value={customEnd.toISOString().slice(0,10)} onChange={e => setCustomEnd(new Date(e.target.value))} theme={{ darkMode }} style={{ marginLeft: '0.5rem', flex: 'none', width: '150px' }} />
              </>
            )}
          </FilterBar>
          <TaskList theme={{ darkMode }}>
            {paginatedTodos.length === 0 ? (
              <TaskItem theme={{ darkMode }}>No tasks yet. Add your first task!</TaskItem>
            ) : (
              paginatedTodos.map((todo, idx) => (
                <TaskItem 
                  key={idx} 
                  theme={{ darkMode }}
                  style={{ 
                    cursor: 'pointer',
                    opacity: todo.finished ? 0.7 : 1,
                    textDecoration: todo.finished ? 'line-through' : 'none',
                    background: todo.finished 
                      ? (darkMode ? 'rgba(76, 175, 80, 0.1)' : 'rgba(200, 230, 201, 0.3)') 
                      : 'transparent'
                  }}
                  title="Click to edit"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <input
                      type="checkbox"
                      checked={todo.finished || false}
                      onChange={(e) => {
                        console.log('Task list checkbox clicked for:', todo.text);
                        e.stopPropagation();
                        e.preventDefault();
                        handleToggleFinished(todo);
                      }}
                      onClick={(e) => {
                        console.log('Task list checkbox onClick for:', todo.text);
                        e.stopPropagation();
                      }}
                      style={{ 
                        cursor: 'pointer', 
                        transform: 'scale(1.2)',
                        accentColor: darkMode ? '#4CAF50' : '#2e7d32'
                      }}
                    />
                    <span onClick={() => handleEditTask(todo)} style={{ cursor: 'pointer', flex: 1 }}>
                      {todo.text}
                    </span>
                  </div>
                  <span 
                    onClick={() => handleEditTask(todo)}
                    style={{ 
                      fontSize: '0.95rem', 
                      color: darkMode ? '#bbb' : '#888',
                      cursor: 'pointer'
                    }}
                  >
                    {todo.date} {todo.startHour} - {todo.endHour}
                  </span>
                </TaskItem>
              ))
            )}
          </TaskList>
          <Pagination>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationButton key={i} theme={{ darkMode }} active={page === i + 1} onClick={() => setPage(i + 1)}>{i + 1}</PaginationButton>
            ))}
          </Pagination>
        </>
        )}
      </MainContent>
    </Wrapper>
  );
};

export default DashboardPage;

const MainContent = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
`;

const FormContainer = styled.form`
  display: flex;
  gap: 1rem;
  width: 90%;
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background: ${({ theme }) => theme.darkMode 
    ? 'rgba(26, 26, 26, 0.8)' 
    : 'rgba(255, 255, 255, 0.9)'};
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: ${({ theme }) => theme.darkMode 
    ? '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)' 
    : '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)'};
  border: none;
`;

const EditFormContainer = styled.form`
  display: flex;
  gap: 1rem;
  width: 90%;
  max-width: 1000px;
  margin: 1rem auto;
  padding: 2rem;
  background: ${({ theme }) => theme.darkMode 
    ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)' 
    : 'linear-gradient(135deg, rgba(76, 175, 80, 0.08) 0%, rgba(76, 175, 80, 0.03) 100%)'};
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: ${({ theme }) => theme.darkMode 
    ? '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(76, 175, 80, 0.2)' 
    : '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(76, 175, 80, 0.15)'};
  border: none;
`;

const StyledInput = styled.input`
  flex: ${props => props.flex || 1};
  padding: 1rem 1.2rem;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'};
  background: ${({ theme }) => theme.darkMode 
    ? 'rgba(255,255,255,0.05)' 
    : 'rgba(255,255,255,0.8)'};
  color: ${({ theme }) => theme.darkMode ? '#e5e5e5' : '#2c2c2c'};
  font-size: 0.95rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'};
    background: ${({ theme }) => theme.darkMode 
      ? 'rgba(255,255,255,0.08)' 
      : 'rgba(255,255,255,0.95)'};
  }
  &::placeholder {
    color: ${({ theme }) => theme.darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'};
  }
`;

const StyledSelect = styled.select`
  flex: 1;
  padding: 1rem 1.2rem;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'};
  background: ${({ theme }) => theme.darkMode 
    ? 'rgba(255,255,255,0.05)' 
    : 'rgba(255,255,255,0.8)'};
  color: ${({ theme }) => theme.darkMode ? '#e5e5e5' : '#2c2c2c'};
  font-size: 0.95rem;
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s ease;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'};
  }
`;

const StyledButton = styled.button`
  padding: 1rem 2rem;
  border-radius: 16px;
  border: none;
  background: ${({ variant, theme }) => {
    if (variant === 'success') {
      return theme.darkMode 
        ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' 
        : 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
    }
    if (variant === 'danger') {
      return theme.darkMode 
        ? 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)' 
        : 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
    }
    return theme.darkMode 
      ? 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)' 
      : 'linear-gradient(135deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.04) 100%)';
  }};
  color: ${({ variant, theme }) => {
    if (variant === 'success' || variant === 'danger') return '#ffffff';
    return theme.darkMode ? '#e5e5e5' : '#2c2c2c';
  }};
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.darkMode 
      ? '0 8px 25px rgba(0,0,0,0.3)' 
      : '0 8px 25px rgba(0,0,0,0.15)'};
  }
`;
