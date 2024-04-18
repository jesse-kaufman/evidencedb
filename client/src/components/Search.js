import { useState, useEffect } from "react";
import Axios from "axios";

import { format_phone } from "../utils/utils";
import "../styles/css/Search.css";

function Search(props) {
  console.log("Search");

  return (
    <div id="search">
      <form
        action="?"
        onSubmit={(e) => {
          e.preventDefault();
          console.log(e.target.elements.query.value);
          console.log(e.target.elements.victim.value);
          console.log(e.target.elements.number.value);
          console.log(e.target.elements.date.value);
        }}
        onChange={(e) => {
          console.log(e.target);
        }}>
        <SearchText />
        <SearchVictim />
        <SearchNumber
          selectedNumber={props.selectedNumber}
          selectedNumberSetter={props.selectedNumberSetter}
        />
        <SearchDate />
      </form>
    </div>
  );
}

function SearchText() {
  return (
    <div className="field">
      <strong>Search: </strong>
      <input type="text" name="query" id="query" />
    </div>
  );
}

function SearchVictim() {
  return (
    <div className="field">
      <strong>Jesse/Shannon: </strong>
      <select name="victim" id="victim">
        <option value="">Both</option>
        <option value="shannon">Shannon</option>
        <option value="jesse">Jesse</option>
      </select>
    </div>
  );
}

function SearchNumber(selectedNumber, selectedNumberSetter) {
  const [numbers, setNumbers] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:8080/api/evidence/get_numbers")
      .then((response) => {
        setNumbers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    selectedNumberSetter(selectedNumber);
  }, [selectedNumberSetter, selectedNumber]);

  return (
    <div className="field">
      <strong>Brian's #: </strong>
      <select
        name="number"
        id="number"
        onChange={(event) => {
          console.log(event.target.value);
        }}>
        <option value="">All numbers</option>
        {numbers.map((number) => {
          const formatted_number = format_phone(number);

          return (
            <option key={number} value={number}>
              {formatted_number}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function SearchDate() {
  const [dates, setDates] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:8080/api/evidence/get_dates")
      .then((response) => {
        setDates(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="field">
      <strong>Date: </strong>
      <select name="date" id="date">
        <option value="">All dates</option>
        {dates.map((date) => {
          return (
            <option key={date} value="{date}">
              {date}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default Search;
