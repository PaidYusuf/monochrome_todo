import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, startOfWeek, addWeeks, eachDayOfInterval, endOfWeek } from 'date-fns';
import styled, { keyframes } from 'styled-components';
import { ThemeContext } from '../context/ThemeContext';

// Simple floating animation
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
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
    ? 'linear-gradient(-45deg, #1a1a1a, #2d2d2d, #1a1a1a, #333)' 
    : 'linear-gradient(-45deg, #fff, #f0f0f0, #fff, #e8e8e8)'};
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
  color: ${({ darkMode }) => darkMode ? '#eee' : '#222'};
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  position: relative;
  overflow-x: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  background: ${({ darkMode }) => darkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'};
  backdrop-filter: blur(10px);
`;

const Logo = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin: 0;
  color: ${({ darkMode }) => darkMode ? '#fff' : '#222'};
`;

const NavButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const NavButton = styled.button`
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  background: ${({ darkMode, active }) => {
    if (active) return darkMode ? '#fff' : '#222';
    return darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  }};
  color: ${({ darkMode, active }) => {
    if (active) return darkMode ? '#222' : '#fff';
    return darkMode ? '#eee' : '#222';
  }};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ darkMode }) => darkMode ? '#eee' : '#222'};
    color: ${({ darkMode }) => darkMode ? '#222' : '#fff'};
    transform: translateY(-2px);
  }
`;

const LogoutButton = styled.button`
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  background: #ff4444;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #ff2222;
    transform: translateY(-2px);
  }
`;

const ThemeToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: ${({ darkMode }) => darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ darkMode }) => darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'};
  }
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const AddTaskForm = styled.form`
  background: ${({ darkMode }) => darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid ${({ darkMode }) => darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'};
  border-radius: 4px;
  background: ${({ darkMode }) => darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)'};
  color: ${({ darkMode }) => darkMode ? '#eee' : '#222'};
  font-size: 1rem;
  flex: ${({ flex }) => flex || 1};
  
  &:focus {
    outline: none;
    border-color: ${({ darkMode }) => darkMode ? '#fff' : '#222'};
  }
  
  &::placeholder {
    color: ${({ darkMode }) => darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'};
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid ${({ darkMode }) => darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'};
  border-radius: 4px;
  background: ${({ darkMode }) => darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)'};
  color: ${({ darkMode }) => darkMode ? '#eee' : '#222'};
  font-size: 1rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ darkMode }) => darkMode ? '#fff' : '#222'};
  }
`;

const Button = styled.button`
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  background: ${({ variant, darkMode }) => {
    if (variant === 'success') return '#4CAF50';
    if (variant === 'danger') return '#f44336';
    return darkMode ? '#eee' : '#222';
  }};
  color: ${({ variant, darkMode }) => {
    if (variant === 'success' || variant === 'danger') return '#fff';
    return darkMode ? '#222' : '#fff';
  }};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
  }
`;

const TasksSection = styled.div`
  background: ${({ darkMode }) => darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${({ darkMode }) => darkMode ? '#fff' : '#222'};
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid ${({ darkMode, active }) => {
    if (active) return darkMode ? '#fff' : '#222';
    return darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
  }};
  border-radius: 4px;
  background: ${({ darkMode, active }) => {
    if (active) return darkMode ? '#fff' : '#222';
    return 'transparent';
  }};
  color: ${({ darkMode, active }) => {
    if (active) return darkMode ? '#222' : '#fff';
    return darkMode ? '#eee' : '#222';
  }};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ darkMode }) => darkMode ? '#fff' : '#222'};
    color: ${({ darkMode }) => darkMode ? '#222' : '#fff'};
  }
`;

const TaskList = styled.div`
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const TaskItem = styled.div`
  background: ${({ darkMode }) => darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)'};
  padding: 1rem;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: ${float} 3s ease-in-out infinite;
  animation-delay: ${({ index }) => index * 0.1}s;
  
  &:hover {
    transform: translateY(-3px);
    background: ${({ darkMode }) => darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.9)'};
  }
`;

const TaskContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TaskText = styled.span`
  font-size: 1rem;
  text-decoration: ${({ finished }) => finished ? 'line-through' : 'none'};
  opacity: ${({ finished }) => finished ? 0.6 : 1};
  cursor: pointer;
`;

const TaskActions = styled.div`
  display: flex;
  gap: 0.5rem;
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
    if (active) return darkMode ? '#fff' : '#222';
    return darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
  }};
  border-radius: 4px;
  background: ${({ darkMode, active }) => {
    if (active) return darkMode ? '#fff' : '#222';
    return 'transparent';
  }};
  color: ${({ darkMode, active }) => {
    if (active) return darkMode ? '#222' : '#fff';
    return darkMode ? '#eee' : '#222';
  }};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ darkMode }) => darkMode ? '#fff' : '#222'};
    color: ${({ darkMode }) => darkMode ? '#222' : '#fff'};
  }
`;

const EditForm = styled.form`
  background: ${({ darkMode }) => darkMode ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.1)'};
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  border: 1px solid #4CAF50;
`;

const DashboardPage = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  
  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
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
      const response = await fetch("http://localhost:5000/api/tasks", {
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
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
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
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
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
      const response = await fetch(`http://localhost:5000/api/tasks/${editingTask}`, {
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
        setTodos(todos.map(t => 
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
            {darkMode ? '☀️' : '🌙'}
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
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Button darkMode={darkMode} onClick={() => setWeekOffset(weekOffset - 1)}>← Previous Week</Button>
                <span style={{ margin: '0 2rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  Week of {format(weekStart, 'dd MMM yyyy')}
                </span>
                <Button darkMode={darkMode} onClick={() => setWeekOffset(weekOffset + 1)}>Next Week →</Button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {weekDays.map(day => (
                  <div
                    key={day.toISOString()}
                    style={{
                      background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)',
                      padding: '1rem',
                      borderRadius: '6px',
                      minHeight: '150px'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{format(day, 'EEEE')}</div>
                    <div style={{ fontSize: '0.9rem', marginBottom: '1rem', opacity: 0.7 }}>{format(day, 'dd MMM')}</div>
                    
                    {todos.filter(todo => {
                      const todoDate = new Date(todo.date);
                      return todoDate.toDateString() === day.toDateString();
                    }).map(task => (
                      <div 
                        key={task._id} 
                        style={{ 
                          fontSize: '0.8rem', 
                          padding: '0.3rem', 
                          marginBottom: '0.3rem',
                          background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                          borderRadius: '3px',
                          textDecoration: task.finished ? 'line-through' : 'none',
                          opacity: task.finished ? 0.6 : 1
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Checkbox
                            type="checkbox"
                            checked={task.finished}
                            onChange={() => handleToggleTask(task._id, task.finished)}
                          />
                          <span onClick={() => handleEditTask(task)} style={{ cursor: 'pointer', flex: 1 }}>
                            {task.text}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
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
                        <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.3rem' }}>
                          {format(new Date(task.date), 'dd MMM yyyy')} • {task.startHour} - {task.endHour}
                        </div>
                      </div>
                    </TaskContent>
                    <TaskActions>
                      <Button onClick={() => handleEditTask(task)} darkMode={darkMode} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                        Edit
                      </Button>
                      <Button 
                        variant="danger" 
                        onClick={() => handleDeleteTask(task._id)} 
                        darkMode={darkMode}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
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
