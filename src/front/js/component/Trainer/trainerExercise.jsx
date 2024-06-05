import React, { useState, useEffect, useContext } from 'react';
import { Context } from "../../store/appContext";
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../User/loader.jsx';
import ExerciseTable from './exerciseTable.jsx';
import '../../../styles/Trainer-styles/trainerExercise.css';
import Swal from 'sweetalert2';

const TrainerExercise = () => {
  const { userId } = useParams();
  const { store, actions } = useContext(Context);
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [routine, setRoutine] = useState({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  });

  const [selectedExercise, setSelectedExercise] = useState('');
  const [selectedReps, setSelectedReps] = useState(1);

  useEffect(() => {
    const fetchExercisesData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("https://exercisedb.p.rapidapi.com/exercises?limit=1300", store.exerciseOptions);
        if (response.ok) {
          const exerciseData = await actions.fetchDataExercise(
            "https://exercisedb.p.rapidapi.com/exercises?limit=1300",
            store.exerciseOptions
          );
          setExercises(exerciseData);
          setFilteredExercises(exerciseData);

        }
        if (!response.ok) {
          throw new Error('Error fetching exercises');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExercisesData();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    const filtered = exercises.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.target.toLowerCase().includes(query) ||
        item.equipment.toLowerCase().includes(query) ||
        item.bodyPart.toLowerCase().includes(query)
    );
    setFilteredExercises(filtered);
  };

  const handleAddExercise = (day) => {
    if (!selectedExercise) {
      Swal.fire({
        title: "Error",
        text: "Please select an exercise",
        icon: "error",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    setRoutine(prevRoutine => {
      const newRoutine = { ...prevRoutine };
      newRoutine[day].push(`${selectedExercise} ${selectedReps}x`);
      return newRoutine;
    });
    setSelectedExercise('');
    setSelectedReps(1);
  };

  const handleRemoveExercise = (day, index) => {
    setRoutine(prevRoutine => {
      const newRoutine = { ...prevRoutine };
      newRoutine[day].splice(index, 1);
      return newRoutine;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trainerDataId = 1;
    const userDataId = userId;

    const data = {
      trainer_data_id: trainerDataId,
      routine: {
        Monday: routine.monday,
        Tuesday: routine.tuesday,
        Wednesday: routine.wednesday,
        Thursday: routine.thursday,
        Friday: routine.friday,
        Saturday: routine.saturday,
        Sunday: routine.sunday
      }
    };

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/trainer/${userDataId}/set_routine`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${store.token}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        Swal.fire({
          title: "Success",
          text: "Routine saved successfully",
          icon: "success",
          showConfirmButton: true,
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          title: "Error",
          text: "Error saving routine",
          icon: "error",
          showConfirmButton: false,
          timer: 1000,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error saving routine",
        icon: "error",
        showConfirmButton: false,
        timer: 1000,
      });
    }
  };

  return (
    <div className="trainer-exercise-container">
      <div className="exercise-table-container">
        <ExerciseTable routine={routine} handleRemoveExercise={handleRemoveExercise} />
      </div>
      <div className="routine-form-container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search exercises..."
            value={search}
            onChange={handleSearch}
            className="search-input-trainer"
          />
          {loading && <Loader />}
          {error && <p className="error-message">{error}</p>}

          <div className="days-container">
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
              <div key={day} className="day-section">
                <label>{day.charAt(0).toUpperCase() + day.slice(1)}</label>
                <select value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)}>
                  <option value="" className='select-exercise-option'>Select exercise</option>
                  {filteredExercises.map(ex => (
                    <option key={ex.id} value={ex.name}>{ex.name}</option>
                  ))}
                </select>
                <select value={selectedReps} onChange={(e) => setSelectedReps(parseInt(e.target.value))}>
                  {[...Array(1000)].map((_, i) => (
                    <option key={i + 1} value={i + 1} className='reps-select'>{i + 1}</option>
                  ))}
                </select>
                <button type="button" className='add-exercise-button' onClick={() => handleAddExercise(day)}>Add Exercise</button>
              </div>
            ))}
          </div>

          <button type="submit" className="save-button">Save Routine</button>
        </form>
      </div>
    </div>
  );
};

export default TrainerExercise;
