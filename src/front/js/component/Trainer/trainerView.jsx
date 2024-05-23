import React, { useEffect, useState } from 'react'
import { Link, useParams } from "react-router-dom";


const trainerView = () => {
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrainerUsers = async () => {
      try {
        const response = await fetch(`/trainer/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchTrainerUsers();
  }, [id]);

console.log(users)
  return (
    <div className="userCard">
      
      <h1>Users</h1>

      <Link to={`/trainer`}>
        <button>Details</button>
      </Link>

    </div>
  );

}

export default trainerView
