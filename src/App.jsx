import { useState } from "react";
import "./App.css";
import TerminalRow from "./components/TerminalRow";

function App() {
  const [id, setId] = useState(0);
  const [currentDirectoryName, setCurrentDirectoryName] = useState("root");
  const [currentDirectoryPath, setCurrentDirectoryPath] = useState("~");
  const [childDirectories, setChildDirectories] = useState({
    root: [
      { name: "books", isDirectory: true },
      { name: "projects", isDirectory: true },
      { name: "personal-documents", isDirectory: true },
      { name: "skills", isDirectory: true },
      { name: "languages", isDirectory: true },
      { name: "interests", isDirectory: true },
    ],
    books: [
      {
        name: "Eric-Jorgenson_The-Almanack-of-Naval-Ravikant.pdf",
        isDirectory: false,
      },
      {
        name: "Elon Musk: How the Billionaire CEO of SpaceX.pdf",
        isDirectory: false,
      },
      { name: "The $100 Startup_CHRIS_GUILLEBEAU.pdf", isDirectory: false },
      { name: "The_Magic_of_Thinking_Big.pdf", isDirectory: false },
    ],
    skills: [
      { name: "Front-end development", isDirectory: false },
      { name: "React.js", isDirectory: false },
      { name: "React-Query", isDirectory: false },
      { name: "Express.js", isDirectory: false },
      { name: "SQL", isDirectory: false },
      { name: "Firebase", isDirectory: false },
    ],
    projects: [
      { name: "portfolio", isDirectory: false },
      { name: "Parivesh", isDirectory: false },
      { name: "Shareme", isDirectory: false },
      { name: "code-buddy", isDirectory: false },
      { name: "Bessalani-lms", isDirectory: false },
    ],
    interests: [
      { name: "Software Engineering", isDirectory: false },
      { name: "FrontEnd Developement", isDirectory: false },
      { name: "Computer Vision", isDirectory: false },
    ],
    languages: [
      { name: "Javascript", isDirectory: false },
      { name: "Typescript", isDirectory: false },
      { name: "C/C++", isDirectory: false },
      { name: "Java", isDirectory: false },
    ],
  });

  const [previousTerminalRows, setPreviousTerminalRows] = useState([]);
  const [terminalIndex, setTerminalIndex] = useState(0);

  return (
    <div className="bg-black w-full h-full">
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
