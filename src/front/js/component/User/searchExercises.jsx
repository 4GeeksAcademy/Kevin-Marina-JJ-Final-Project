import React, { useEffect, useState, useContext } from "react";
import { Context } from "../../store/appContext";
import HorizontalScrollbar from "./horizontalScrollbar.jsx";
import "../../../styles/User-styles/searchExercises.css";

const SearchExercises = ({ setExercises, bodyPart, setBodyPart }) => {
  const { store, actions } = useContext(Context);
  const [search, setSearch] = useState("");
  const [bodyParts, setBodyParts] = useState([]);

  useEffect(() => {
    const fetchExercisesData = async () => {
      const cachedBodyParts = localStorage.getItem("bodyParts");

      if (cachedBodyParts) {
        setBodyParts(["all", ...JSON.parse(cachedBodyParts)]);
      } else {
        const bodyPartsData = await actions.fetchDataExercise(
          "https://exercisedb.p.rapidapi.com/exercises/bodyPartList",
          store.exerciseOptions
        );

        localStorage.setItem("bodyParts", JSON.stringify(bodyPartsData));
        setBodyParts(["all", ...bodyPartsData]);
      }
    };
    fetchExercisesData();
  }, []);

  const handleSearch = async () => {
    if (search) {
      const cacheKey = "allExercises";
      let exerciseData = localStorage.getItem(cacheKey);

      if (!exerciseData) {
        exerciseData = await actions.fetchDataExercise(
          "https://exercisedb.p.rapidapi.com/exercises?limit=1300",
          store.exerciseOptions
        );
        localStorage.setItem(cacheKey, JSON.stringify(exerciseData));
      } else {
        exerciseData = JSON.parse(exerciseData);
      }

      const searchedExercises = exerciseData.filter(
        (item) =>
          item.name.toLowerCase().includes(search) ||
          item.target.toLowerCase().includes(search) ||
          item.equipment.toLowerCase().includes(search) ||
          item.bodyPart.toLowerCase().includes(search)
      );
      window.scrollTo({ top: 1000, left: 100, behavior: 'smooth' });
      setSearch("");
      setExercises(searchedExercises);
    }
  };

  return (
    <section className="exercise-container">
      <h2 className="title-exercise"><span className="green-text">Search</span> exercises for more info</h2>
      <div className="input-container">
        <input
          className="search-input"
          value={search}
          type="text"
          placeholder="Search Exercise"
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
        />
        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>
      <div className="body-part-container">
        <HorizontalScrollbar
          data={bodyParts}
          bodyPart={bodyPart}
          setBodyPart={setBodyPart}
          bodyParts={bodyParts}
        />
      </div>
    </section>
  );
};

export default SearchExercises;
