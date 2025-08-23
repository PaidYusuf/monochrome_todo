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
  background: ${({ checked }) => checked ? '#222' : '#eee'};
  border-radius: 12px;
  position: relative;
  transition: background 0.3s;
  margin-right: 0.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
`;

const SliderThumb = styled.span`
  position: absolute;
  top: 2px;
  left: ${({ checked }) => checked ? '22px' : '2px'};
  width: 20px;
  height: 20px;
  background: ${({ checked }) => checked ? '#fff' : '#222'};
  border-radius: 50%;
  transition: left 0.3s, background 0.3s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.12);
`;
import React, { useContext, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, format, isSameDay, isWithinInterval } from 'date-fns';

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
  justify-content: center;
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
  background: ${({ theme }) => theme.darkMode ? 'linear-gradient(135deg, #181818 0%, #222 100%)' : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'};
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(40,40,40,0.12);
  padding: 2rem;
  display: grid;
  grid-template-columns: 120px repeat(7, 1fr);
  grid-template-rows: 60px repeat(24, 40px);
  gap: 0;
  border: 2px solid ${({ theme }) => theme.darkMode ? '#333' : '#bbb'};
`;

const CalendarCell = styled.div`
  border: 1.5px solid ${({ theme }) => theme.darkMode ? '#333' : '#bbb'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.08rem;
  color: ${({ theme }) => theme.darkMode ? '#eee' : '#222'};
  background: ${({ theme }) => theme.darkMode ? 'rgba(34,34,34,0.85)' : 'rgba(245,245,245,0.85)'};
  transition: background 0.3s, color 0.3s;
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

const AnimatedBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  background: ${({ theme }) => theme.darkMode
    ? 'linear-gradient(120deg, #111 0%, #333 40%, #444 60%, #333 80%, #111 100%)'
    : 'linear-gradient(120deg, #111 0%, #888 40%, #fff 60%, #888 80%, #111 100%)'};
  background-size: 200% 200%;
  animation: gradientMove 8s ease-in-out infinite;
  opacity: 0.6;
  filter: blur(4px);

  @keyframes gradientMove {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const DashboardPage = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
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
    setTodos([...todos, {
      text: task,
      date: format(selectedDate, 'yyyy-MM-dd'),
      startHour,
      endHour
    }]);
    setTask('');
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
  <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <NavBar theme={{ darkMode }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            style={{
              background: darkMode ? '#222' : '#eee',
              color: darkMode ? '#fff' : '#222',
              border: 'none',
              borderRadius: 10,
              padding: '0.7rem 1.5rem',
              fontWeight: 700,
              fontSize: '1.1rem',
              cursor: 'pointer',
              marginRight: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
            }}
            onClick={() => navigate('/')}
            title="Home"
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
            <span style={{ fontSize: '1rem', color: darkMode ? '#fff' : '#222', marginLeft: '0.5rem' }}>{darkMode ? 'Dark' : 'Light'} Mode</span>
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
                        <div key={i} style={{ background: darkMode ? '#333' : '#eee', color: darkMode ? '#fff' : '#222', borderRadius: 6, padding: '2px 6px', margin: '2px 0', fontSize: '0.95rem', fontWeight: 500 }}>{task.text}</div>
                      ))}
                    </CalendarCell>
                  );
                })
              )}
            </CalendarGrid>
          </div>
          <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '1rem', maxWidth: 900, margin: '2rem auto 0 auto' }}>
            <input
              style={{ flex: 2, padding: '0.8rem', borderRadius: 10, border: 'none', background: darkMode ? '#181818' : '#fff', color: darkMode ? '#fff' : '#222', fontSize: '1rem' }}
              type="text"
              placeholder="Add a new task..."
              value={task}
              onChange={e => setTask(e.target.value)}
            />
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={e => setSelectedDate(new Date(e.target.value))}
              style={{ flex: 1, padding: '0.8rem', borderRadius: 10, border: 'none', background: darkMode ? '#181818' : '#fff', color: darkMode ? '#fff' : '#222', fontSize: '1rem' }}
            />
            <select value={startHour} onChange={e => setStartHour(e.target.value)} style={{ flex: 1, padding: '0.8rem', borderRadius: 10, border: 'none', background: darkMode ? '#181818' : '#fff', color: darkMode ? '#fff' : '#222', fontSize: '1rem' }}>
              {hours.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
            <select value={endHour} onChange={e => setEndHour(e.target.value)} style={{ flex: 1, padding: '0.8rem', borderRadius: 10, border: 'none', background: darkMode ? '#181818' : '#fff', color: darkMode ? '#fff' : '#222', fontSize: '1rem' }}>
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
            {filter === 'custom' && (
              <>
                <input type="date" value={customStart.toISOString().slice(0,10)} onChange={e => setCustomStart(new Date(e.target.value))} style={{ marginLeft: '1rem', padding: '0.5rem', borderRadius: 8, border: 'none', background: darkMode ? '#181818' : '#fff', color: darkMode ? '#fff' : '#222' }} />
                <input type="date" value={customEnd.toISOString().slice(0,10)} onChange={e => setCustomEnd(new Date(e.target.value))} style={{ marginLeft: '0.5rem', padding: '0.5rem', borderRadius: 8, border: 'none', background: darkMode ? '#181818' : '#fff', color: darkMode ? '#fff' : '#222' }} />
              </>
            )}
          </FilterBar>
          <TaskList theme={{ darkMode }}>
            {paginatedTodos.length === 0 ? (
              <TaskItem theme={{ darkMode }}>No tasks yet. Add your first task!</TaskItem>
            ) : (
              paginatedTodos.map((todo, idx) => (
                <TaskItem key={idx} theme={{ darkMode }}>
                  <span>{todo.text}</span>
                  <span style={{ fontSize: '0.95rem', color: darkMode ? '#bbb' : '#888' }}>{todo.date} {todo.startHour} - {todo.endHour}</span>
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
      </div>
    </Wrapper>
  );
};

export default DashboardPage;
