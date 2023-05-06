import { useEffect, useState } from "react";
import "./App.css";
import TerminalRow from "./components/TerminalRow";
import React from "react";

function App() {
  const [id, setId] = useState(0);
  const [currentDirectoryName, setCurrentDirectoryName] = useState("~");
  const [currentDirectoryPath, setCurrentDirectoryPath] = useState("~");
  const [childDirectories, setChildDirectories] = useState({
    root: [
      "books",
      "projects",
      "personal-documents",
      "skills",
      "languages",
      "PDPU",
      "interests",
    ],
    languages: ["Javascript", "C++", "Java", "Dart"],
  });

  const [previousTerminalRows, setPreviousTerminalRows] = useState([]);
  const [terminalIndex, setTerminalIndex] = useState(0);
  // function initialize() {
  //   for (let i = 0; i < 100; i++) {
  //     previousTerminalRows[i] = [];
  //   }
  // }
  // initialize();

  const list = [];
  function display() {
    for (let i = 0; i < terminalIndex; i + 2) {
      list.push(
        <React.Fragment>
          previousTerminalRows[i] previousTerminalRows[i+1]
        </React.Fragment>
      );
    }
  }

  // useEffect(() => {
  //   if (terminalIndex > 0) {
  //     display();
  //   }
  // }, [terminalIndex]);

  console.log(terminalIndex, previousTerminalRows);
  // console.log(list);
  return (
    <div className="bg-black w-full h-screen">
      {terminalIndex > 0}
      <TerminalRow
        currentDirectoryName={currentDirectoryName}
        setCurrentDirectoryName={setCurrentDirectoryName}
        currentDirectoryPath={currentDirectoryPath}
        setCurrentDirectoryPath={setCurrentDirectoryPath}
        childDirectories={childDirectories}
        setChildDirectories={setChildDirectories}
        previousTerminalRows={previousTerminalRows}
        setPreviousTerminalRows={setPreviousTerminalRows}
        terminalIndex={terminalIndex}
        setTerminalIndex={setTerminalIndex}
        id={id}
        setId={setId}
      />
    </div>
  );
}

export default App;
