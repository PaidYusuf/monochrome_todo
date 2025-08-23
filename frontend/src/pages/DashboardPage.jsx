import React, { useContext, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: ${({ theme }) => theme.darkMode ? '#111' : '#f5f5f5'};
  color: ${({ theme }) => theme.darkMode ? '#fff' : '#222'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 0;
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
  width: 100vw;
  background: ${({ theme }) => theme.darkMode ? '#181818' : '#f5f5f5'};
  color: ${({ theme }) => theme.darkMode ? '#fff' : '#222'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 2rem 0.5rem 2rem;
  border-bottom: 2px solid ${({ theme }) => theme.darkMode ? '#333' : '#ddd'};
`;

const NavButton = styled.button`
  background: ${({ active, theme }) => active ? (theme.darkMode ? '#222' : '#ddd') : 'transparent'};
  color: ${({ theme }) => theme.darkMode ? '#fff' : '#222'};
  border: none;
  font-size: 1.2rem;
  font-weight: 700;
  padding: 0.7rem 2.2rem;
  border-radius: 12px 12px 0 0;
  margin-right: 1rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: ${({ theme }) => theme.darkMode ? '#222' : '#eee'};
  }
`;

const LogoutButton = styled.button`
  background: ${({ theme }) => theme.darkMode ? '#222' : '#eee'};
  color: ${({ theme }) => theme.darkMode ? '#fff' : '#222'};
  border: none;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 0.7rem 2rem;
  border-radius: 10px;
  cursor: pointer;
  margin-left: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
`;

const FilterBar = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: flex-start;
  margin: 2rem 0 1rem 0;
`;

const FilterButton = styled.button`
  background: ${({ active, theme }) => active ? (theme.darkMode ? '#222' : '#ddd') : 'transparent'};
  color: ${({ theme }) => theme.darkMode ? '#fff' : '#222'};
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.6rem 1.8rem;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: ${({ theme }) => theme.darkMode ? '#222' : '#eee'};
  }
`;

const CalendarGrid = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 2rem auto;
  background: ${({ theme }) => theme.darkMode ? '#181818' : '#fff'};
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  padding: 2rem;
  display: grid;
  grid-template-columns: 120px repeat(5, 1fr);
  grid-template-rows: 60px repeat(4, 60px);
  gap: 0;
  border: 2px solid ${({ theme }) => theme.darkMode ? '#333' : '#ddd'};
`;

const CalendarCell = styled.div`
  border: 1.5px solid ${({ theme }) => theme.darkMode ? '#333' : '#ddd'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.08rem;
  color: ${({ theme }) => theme.darkMode ? '#fff' : '#222'};
  background: ${({ theme }) => theme.darkMode ? '#181818' : '#fff'};
`;

const TaskList = styled.ul`
  width: 100%;
  max-width: 900px;
  background: ${({ theme }) => theme.darkMode ? '#222' : '#f7f7f7'};
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  margin: 2rem auto;
  padding: 2rem;
  list-style: none;
`;

const TaskItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.darkMode ? '#333' : '#ddd'};
  color: ${({ theme }) => theme.darkMode ? '#fff' : '#222'};
  font-size: 1.15rem;
  &:last-child { border-bottom: none; }
`;

const Pagination = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 1.5rem 0;
`;

const PaginationButton = styled.button`
  background: ${({ active, theme }) => active ? (theme.darkMode ? '#222' : '#ddd') : 'transparent'};
  color: ${({ theme }) => theme.darkMode ? '#fff' : '#222'};
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: ${({ theme }) => theme.darkMode ? '#222' : '#eee'};
  }
`;

const days = [
  { label: 'Saturday', date: '2025-08-23' },
  { label: 'Sunday', date: '2025-08-24' },
  { label: 'Monday', date: '2025-08-25' },
  { label: 'Tuesday', date: '2025-08-26' },
  { label: 'Wednesday', date: '2025-08-27' },
];
const hours = ['00:00', '01:00', '02:00', '03:00'];

const DashboardPage = () => {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [view, setView] = useState('calendar'); // 'calendar' or 'task'
  const [filter, setFilter] = useState('week'); // 'week', 'month', 'year', 'custom'
  const [todos, setTodos] = useState([
    { text: 'Fitness', date: '2025-08-24', hour: '01:00' },
    { text: 'Work', date: '2025-08-26', hour: '00:00' },
    { text: 'Grocery', date: '2025-08-26', hour: '03:00' },
    { text: 'Swim', date: '2025-08-27', hour: '03:00' },
  ]);
  const [task, setTask] = useState('');
  const [date, setDate] = useState('2025-08-23');
  const [hour, setHour] = useState('00:00');
  const [page, setPage] = useState(1);

  // Add task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    setTodos([...todos, { text: task, date, hour }]);
    setTask('');
  };

  // Pagination logic for task view
  const tasksPerPage = 4;
  const filteredTodos = todos.filter(todo => {
    // For now, just show all tasks for all filters
    return true;
  });
  const totalPages = Math.ceil(filteredTodos.length / tasksPerPage);
  const paginatedTodos = filteredTodos.slice((page - 1) * tasksPerPage, page * tasksPerPage);

  return (
    <Wrapper theme={{ darkMode }}>
      <NavBar theme={{ darkMode }}>
        <div>
          <NavButton theme={{ darkMode }} active={view === 'calendar'} onClick={() => setView('calendar')}>Calendar View</NavButton>
          <NavButton theme={{ darkMode }} active={view === 'task'} onClick={() => setView('task')}>Task View</NavButton>
        </div>
        <LogoutButton theme={{ darkMode }} onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }}>Log Out</LogoutButton>
      </NavBar>
      {view === 'calendar' ? (
        <>
          <CalendarGrid theme={{ darkMode }}>
            <CalendarCell theme={{ darkMode }} style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Day/Hour</CalendarCell>
            {days.map(day => (
              <CalendarCell theme={{ darkMode }} key={day.date}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{day.label}</div>
                  <div style={{ fontSize: '0.95rem', color: darkMode ? '#bbb' : '#888' }}>{day.date}</div>
                </div>
              </CalendarCell>
            ))}
            {hours.map(hour => (
              <CalendarCell theme={{ darkMode }} key={hour} style={{ fontWeight: 'bold' }}>{hour}</CalendarCell>
              )).concat(
              days.flatMap(day => hours.map(hour => {
                const todo = todos.find(t => t.date === day.date && t.hour === hour);
                return <CalendarCell theme={{ darkMode }} key={day.date + hour}>{todo ? todo.text : ''}</CalendarCell>;
              }))
            )}
          </CalendarGrid>
          <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '1rem', maxWidth: 900, margin: '2rem auto 0 auto' }}>
            <input
              style={{ flex: 2, padding: '0.8rem', borderRadius: 10, border: 'none', background: darkMode ? '#181818' : '#fff', color: darkMode ? '#fff' : '#222', fontSize: '1rem' }}
              type="text"
              placeholder="Add a new task..."
              value={task}
              onChange={e => setTask(e.target.value)}
            />
            <select value={date} onChange={e => setDate(e.target.value)} style={{ flex: 1, padding: '0.8rem', borderRadius: 10, border: 'none', background: darkMode ? '#181818' : '#fff', color: darkMode ? '#fff' : '#222', fontSize: '1rem' }}>
              {days.map(day => <option key={day.date} value={day.date}>{day.label} {day.date}</option>)}
            </select>
            <select value={hour} onChange={e => setHour(e.target.value)} style={{ flex: 1, padding: '0.8rem', borderRadius: 10, border: 'none', background: darkMode ? '#181818' : '#fff', color: darkMode ? '#fff' : '#222', fontSize: '1rem' }}>
              {hours.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
            <button style={{ padding: '0.8rem 1.5rem', borderRadius: 10, border: 'none', background: darkMode ? '#222' : '#eee', color: darkMode ? '#fff' : '#222', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }} type="submit">Add</button>
          </form>
        </>
      ) : (
        <>
          <FilterBar>
            <FilterButton theme={{ darkMode }} active={filter === 'week'} onClick={() => setFilter('week')}>Week</FilterButton>
            <FilterButton theme={{ darkMode }} active={filter === 'month'} onClick={() => setFilter('month')}>Month</FilterButton>
            <FilterButton theme={{ darkMode }} active={filter === 'year'} onClick={() => setFilter('year')}>Year</FilterButton>
            <FilterButton theme={{ darkMode }} active={filter === 'custom'} onClick={() => setFilter('custom')}>Custom Time</FilterButton>
          </FilterBar>
          <TaskList theme={{ darkMode }}>
            {paginatedTodos.length === 0 ? (
              <TaskItem theme={{ darkMode }}>No tasks yet. Add your first task!</TaskItem>
            ) : (
              paginatedTodos.map((todo, idx) => (
                <TaskItem key={idx} theme={{ darkMode }}>
                  <span>{todo.text}</span>
                  <span style={{ fontSize: '0.95rem', color: darkMode ? '#bbb' : '#888' }}>{todo.date} {todo.hour}</span>
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
    </Wrapper>
  );
};

export default DashboardPage;
