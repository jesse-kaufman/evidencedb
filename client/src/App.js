import ContactList from "./components/ContactList";
import { useState, useEffect } from "react";
import Axios from "axios";

function App() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    Axios.post("http://localhost:8080/api/login/", {
      username: process.env.REACT_APP_API_USER,
      password: process.env.REACT_APP_API_PASS,
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(document.location.search);
    console.log("here");
    Axios.get("http://localhost:8080/api/contacts/?" + searchParams.toString())
      .then((response) => {
        setContacts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  if (contacts.length > 0) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Abusedb</h1>
        </header>
        <ContactList contacts={contacts} />
      </div>
    );
  }
}

export default App;
