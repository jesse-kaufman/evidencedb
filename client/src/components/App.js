import { useState, useCallback } from "react";
import EvidenceList from "./EvidenceList";
import Search from "./Search";

export default function App() {
  const [selectedNumber, setSelectedNumber] = useState([]);

  // make wrapper function to give child
  const setSelectedNumberWrapper = useCallback(
    (val) => {
      setSelectedNumber(val);
    },
    [setSelectedNumber]
  );

  return (
    <>
      <Search
        selectedNumber={selectedNumber}
        selectedNumberSetter={setSelectedNumberWrapper}
      />
      <EvidenceList />
    </>
  );
}
