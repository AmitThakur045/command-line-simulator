/* eslint-disable react/prop-types */
import React, { useState, useRef } from "react";

const TerminalRow = ({
  id,
  setId,
  currentDirectoryName,
  setCurrentDirectoryName,
  currentDirectoryPath,
  setCurrentDirectoryPath,
  childDirectories,
  setChildDirectories,
  previousTerminalRows,
  setPreviousTerminalRows,
  terminalIndex,
  setTerminalIndex,
}) => {
  const [command, setCommand] = useState("");
  const firstRef = useRef(null);
  const secondRef = useRef(null);

  function handleCommands() {
    let words = command.split(" ").filter(Boolean);
    console.log("words", words);
    let main = words[0];
    words.shift();
    console.log("words2", words);
    let result = "";
    let rest = words.join(" ");
    rest = rest.trim();
    console.log("res", rest, main);

    switch (main) {
      case "cd": {
        if (words.length === 0 || rest === "") {
          setCurrentDirectoryPath = "~";
          setCurrentDirectoryName = "root";
          break;
        } else if (words.length > 1) {
          result = "too many arguments, arguments must be <1.";
          break;
        } else if (childDirectories[currentDirectoryName].includes(rest)) {
          currentDirectoryPath += "/" + rest;
          currentDirectoryName = rest;
          break;
        } else if (rest === "." || rest === ".." || rest === "../") {
          result = "Type 'cd' to go back 😅";
          break;
        } else {
          result = `bash: cd: ${words}: No such file or directory`;
        }
        break;
      }
      case "ls": {
        let target = words[0];
        if (target === "" || target === undefined || target === null)
          target = currentDirectoryName;

        if (words.length >= 1) {
          result = "too many arguments, arguments must be <1.";
          break;
        }
        if (target in childDirectories) {
          result = childDirectories(target).join("");
        } else {
          result = `ls: cannot access '${words}': No such file or directory                    `;
        }
        break;
      }
    }
    console.log(result);
    document.getElementById(`row-result-${id}`).innerHTML = result;

    // previousTerminalRows[terminalIndex] = [firstRef.current, secondRef.current];
    let newPrevTerminal = previousTerminalRows;
    newPrevTerminal.push(firstRef.current);
    newPrevTerminal.push(secondRef.current);
    setPreviousTerminalRows(newPrevTerminal);
    setTerminalIndex((prev) => prev + 1);
    setCommand("");
    setId((prev) => prev + 1);
    // previousTerminalRows[terminalIndex].push(firstRef.current);
    // previousTerminalRows[terminalIndex].push(secondRef.current);
  }

  const check = (e) => {
    if (e.key === "Enter") {
      if (command.length !== 0) {
        handleCommands();
      } else return;
    } else if (e.key === "ArrowUp") {
      console.log(e.key);
    } else if (e.key === "ArrowDown") {
      console.log(e.key);
    }
  };

  return (
    <React.Fragment key={id}>
      {/* for writing the command */}
      <div className="flex w-full h-5 space-x-2" ref={firstRef}>
        <div className="flex font-semibold items-center">
          <span className="text-[#00e200]">Amit@Thakur</span>
          <span className="text-white">:</span>
          <span className="text-[#3464a3]">{currentDirectoryPath}</span>
          <span className="text-white">$</span>
        </div>
        <div className="flex p-0">
          <input
            type="text"
            spellCheck={false}
            autoFocus={true}
            autoComplete="off"
            onChange={(e) => {
              e.preventDefault();
              setCommand(e.target.value);
            }}
            onKeyDown={(e) => check(e)}
            value={command}
            id={`row-input-${id}`}
            className="bg-black border-0 text-white outline-none caret-white text-left"
          />
        </div>
      </div>

      {/* to display the result after executing the command */}
      <div
        ref={secondRef}
        id={`row-result-${id}`}
        className={"my-2 font-normal"}
      ></div>
    </React.Fragment>
  );
};

export default TerminalRow;
