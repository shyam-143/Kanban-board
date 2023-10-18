import React, { useState, useEffect } from 'react';
import './kanban.css';
import Dots from './dots.png.png';

function KanbanBoard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupBy, setGroupBy] = useState('status');
  const [sortBy, setSortBy] = useState('priority');
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const savedGroupBy = localStorage.getItem('kanbanGroupBy');
    const savedSortBy = localStorage.getItem('kanbanSortBy');

    if (savedGroupBy) {
      setGroupBy(savedGroupBy);
    }
    if (savedSortBy) {
      setSortBy(savedSortBy);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('kanbanGroupBy', groupBy);
    localStorage.setItem('kanbanSortBy', sortBy);
  }, [groupBy, sortBy]);

  useEffect(() => {
    fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then((response) => response.json())
      .then((data) => {
        setTickets(data.tickets);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const groupTickets = () => {
    if (groupBy === 'status') {
      return tickets.reduce((grouped, ticket) => {
        if (!grouped[ticket.status]) {
          grouped[ticket.status] = [];
        }
        grouped[ticket.status].push(ticket);
        return grouped;
      }, {});
    } else if (groupBy === 'user') {
      return tickets.reduce((grouped, ticket) => {
        if (!grouped[ticket.userId]) {
          grouped[ticket.userId] = [];
        }
        grouped[ticket.userId].push(ticket);
        return grouped;
      }, {});
    } else if (groupBy === 'priority') {
      return tickets.reduce((grouped, ticket) => {
        if (!grouped[ticket.priority]) {
          grouped[ticket.priority] = [];
        }
        grouped[ticket.priority].push(ticket);
        return grouped;
      }, {});
    }
  };

  const groupedTickets = groupTickets();

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div>
      <h1>Kanban Board</h1>
      <div className="kanban-controls">
        <button onClick={toggleOptions}>Display</button>

        {showOptions && (
          <div className="options-popup">
            <div className="row">
              <label className="label">Group By</label>
              <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
                <option value="status">Status</option>
                <option value="user">User</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            <div className="row">
              <label className="label">Ordering</label>
              <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="kanban-board">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="kanban-columns">
            {Object.keys(groupedTickets).map((group) => (
              <div key={group} className="kanban-column">
                <h2>{group}</h2>
                {groupedTickets[group]
                  .sort((a, b) => {
                    if (sortBy === 'priority') {
                      return a.priority - b.priority;
                    } else {
                      return a.title.localeCompare(b.title);
                    }
                  })
                  .map((ticket) => (
                    <div key={ticket.id} className="kanban-card">
                      <div className="top">
                        <div className="top-left">
                          <h4>{ticket.id}</h4>
                        </div>
                        <div className="top-right">
                          <img
                            src={`https://placekitten.com/50/50?image=${ticket.id}`}
                            alt={`User ${ticket.id}`}
                            className="user-image"
                          />
                        </div>
                      </div>
                      <div className="Middle">
                        <h3>{ticket.title}</h3>
                      </div>
                      <div className="bottom">
                        <div className="bottom-left">
                          <img className="image" src={Dots} alt="Dots" />
                        </div>
                        <div className="bottom-right">
                          <div className="tag-box">
                            <span className="bullet-point">&#8226;</span>
                            <p>{ticket.tag}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                    
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default KanbanBoard;
