import React, { useEffect, useState, useContext } from "react";
import { Context } from "../../store/appContext";
import ReactPaginate from "react-paginate";

import ExerciseCard from "./exerciseCard.jsx";

import "../../../styles/User-styles/exercises.css";

const Exercises = ({ exercises, setExercises, bodyPart }) => {
  const { store, actions } = useContext(Context);
  const [pageNumber, setPageNumber] = useState(0);
  const exercisesPerPage = 9;

  useEffect(() => {
    const fetchExercisesData = async () => {
      let exercisesData = [];

      const cacheKey = bodyPart === "all" ? "allExercises" : `bodyPartExercises_${bodyPart}`;
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        exercisesData = JSON.parse(cachedData);
      } else {
        if (bodyPart === "all") {
          exercisesData = await actions.fetchDataExercise(
            "https://exercisedb.p.rapidapi.com/exercises?limit=1300",
            store.exerciseOptions
          );
        } else {
          exercisesData = await actions.fetchDataExercise(
            `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}?limit=1300`,
            store.exerciseOptions
          );
        }

        localStorage.setItem(cacheKey, JSON.stringify(exercisesData));
      }

      setExercises(exercisesData);
    };

    fetchExercisesData();
  }, [bodyPart]);

  const indexOfLastExercise = pageNumber * exercisesPerPage + exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = exercises.slice(
    indexOfFirstExercise,
    indexOfLastExercise
  );

  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
    window.scrollTo({ top: 1000, behavior: 'smooth' });
  };

  return (
    <div id="exercises" className="exercises-container">
      <h3 className="exercises-title">Showing Results</h3>
      <div className="exercises-result-container">
        {currentExercises.length > 0 ? (
          currentExercises.map((exercise, index) => (
            <ExerciseCard key={index} exercise={exercise} className="exercise-card" />
          ))
        ) : (
          <p>No exercises to display.</p>
        )}
      </div>
      <ReactPaginate
        pageCount={Math.ceil(exercises.length / exercisesPerPage)}
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
        className="pagination"
      />
    </div>
  );
};

export default Exercises;
