import ContactList from './components/ContactList'
import { useState, useEffect } from "react";
import Axios from "axios";

function App() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(document.location.search);

    console.log(searchParams.toString());

    Axios.get("http://localhost:8080/contacts/?" + searchParams.toString())
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