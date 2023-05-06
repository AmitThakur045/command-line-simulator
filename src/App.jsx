import { useState } from "react";
import "./App.css";
import TerminalRow from "./components/TerminalRow";
import React from "react";

function App() {
  const [id, setId] = useState(0);
  const [currentDirectoryName, setCurrentDirectoryName] = useState("root");
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
    PDPU: ["Sem-6"],
    books: [
      "Eric-Jorgenson_The-Almanack-of-Naval-Ravikant.pdf",
      "Elon Musk: How the Billionaire CEO of SpaceX.pdf",
      "The $100 Startup_CHRIS_GUILLEBEAU.pdf",
      "The_Magic_of_Thinking_Big.pdf",
    ],
    skills: [
      "Front-end development",
      "React.js",
      "jQuery",
      "Flutter",
      "Express.js",
      "SQL",
      "Firebase",
    ],
    projects: [
      "portfolio",
      "Parivesh",
      "Shareme",
      "code-buddy",
      "Bessalani-lms",
    ],
    interests: ["Software Engineering", "FrontEnd Developement", "Computer Vision"],
    languages: ["Javascript", "C++", "Java", "Dart"],
  });

  const [previousTerminalRows, setPreviousTerminalRows] = useState([]);
  const [terminalIndex, setTerminalIndex] = useState(0);

  return (
    <div className="bg-black w-full h-screen">
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
