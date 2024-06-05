import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../../store/appContext";
import ReactPaginate from "react-paginate";
import Loader from '../User/loader.jsx';

import "../../../styles/Trainer-styles/trainerView.css";

const TrainerView = () => {
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { store } = useContext(Context);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 5;

  useEffect(() => {
    const fetchTrainerUsers = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/trainer/${store.user_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + store.token
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainerUsers();
  }, [store.user_id, store.token]);

  const handleDetailClick = (userId) => {
    navigate(`/trainer/${store.user_id}/user/${userId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchClick = () => {
    if (search) {
      const searchedUsers = users.filter(user => user.user_name.toLowerCase().includes(search.toLowerCase()));
      setFilteredUsers(searchedUsers);
    } else {
      setFilteredUsers(users);
    }
    setSearch("");
    setPageNumber(0);
  };

  const indexOfLastUser = pageNumber * usersPerPage + usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
    window.scrollTo({ top: 1000, behavior: 'smooth' });
  };
  const clearSearch = () => {
    setSearch("");
    setPageNumber(0);
    setFilteredUsers(users);
  };

  return (
    <section className="userCard">
      <h1 className='user-title'>Clients</h1>
      {loading && <Loader />}
      {error && <p>Error: {error}</p>}
      <h2 className="user-search-title">Search <span className='green-text'>Clients</span></h2>
      <div className="input-container">
        <input
          className="search-input"
          value={search}
          type="text"
          placeholder="Search User"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearchClick}>
          Search
        </button><button className="search-btn clear-btn" onClick={clearSearch}>
          Clear Search
        </button>
      </div>
      <div className="user-list">
        {!loading && currentUsers.length > 0 ? (
          currentUsers.map(user => (
            <div key={user.id} index={user.id} className="user-card">
              <h2 className='user-name'>{user.user_name}</h2>
              <p className='user-data'><span className='green-text'>Height:</span> {user.user_height} cm</p>
              <p className='user-data'><span className='green-text'>Weight:</span> {user.user_weight} kg</p>
              <p className='user-data'><span className='green-text'>Illness:</span> {user.user_illness}</p>
              <p className='user-data'><span className='green-text'>Objectives:</span> {user.user_objetives}</p>
              <button className='more-info-btn' onClick={() => handleDetailClick(user.user_id)}>Details</button>
            </div>
          ))
        ) : (

          <h2>No clients to display.</h2>

        )}
      </div>
      <ReactPaginate
        pageCount={Math.ceil(filteredUsers.length / usersPerPage)}
        nextLabel="next >"
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        onPageChange={handlePageChange}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
      />
    </section>
  );
};

export default TrainerView;
