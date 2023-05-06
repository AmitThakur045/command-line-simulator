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
    // console.log("words", words);
    let main = words[0];
    words.shift();
    // console.log("words2", words);
    let result = "";
    let rest = words.join(" ");
    rest = rest.trim();
    // console.log(
    //   "res",
    //   rest,
    //   main,
    //   childDirectories[currentDirectoryName].includes(rest)
    // );

    switch (main) {
      case "cd": {
        if (words.length === 0 || rest === "") {
          setCurrentDirectoryPath("~");
          setCurrentDirectoryName("root");
          break;
        } else if (words.length > 1) {
          result = "too many arguments, arguments must be <1.";
          break;
        } else if (childDirectories[currentDirectoryName].includes(rest)) {
          // console.log(childDirectories[currentDirectoryName].includes(rest));
          setCurrentDirectoryPath((prev) => prev + "/" + rest);
          setCurrentDirectoryName(rest);
          break;
        } else if (rest === "." || rest === ".." || rest === "../") {
          setCurrentDirectoryPath("~");
          setCurrentDirectoryName("root");
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
        // console.log("target", target in childDirectories);

        if (words.length >= 1) {
          result = "too many arguments, arguments must be <1.";
          break;
        }
        if (target in childDirectories) {
          result = childDirectories[target].join(", ");
        } else {
          result = `ls: cannot access '${words}': No such file or directory`;
        }
        break;
      }
    }
    // console.log(result);
    document.getElementById(`row-result-${id}`).innerHTML = result;

    let newPrevTerminal = [];
    // command, result, name, path
    newPrevTerminal.push(command.toString());
    newPrevTerminal.push(result.toString());
    newPrevTerminal.push(currentDirectoryName.toString());
    newPrevTerminal.push(currentDirectoryPath.toString());

    let res = previousTerminalRows;
    res.push(newPrevTerminal);
    setPreviousTerminalRows(res);

    setTerminalIndex((prev) => prev + 1);
    setCommand("");
    setId((prev) => prev + 1);
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
  // console.log("curr", currentDirectoryName, currentDirectoryPath);
  // console.log(previousTerminalRows);
  return (
    <React.Fragment key={id}>
      {terminalIndex > 0 && (
        <React.Fragment>
          {previousTerminalRows.map((data, idx) => (
            <React.Fragment key={idx}>
              <div className="flex w-full h-5 space-x-2">
                <div className="flex font-semibold items-center">
                  <span className="text-[#00e200]">Amit@Thakur</span>
                  <span className="text-white">:</span>
                  <span className="text-[#3464a3]">{data[3]}</span>
                  <span className="text-white">$</span>
                </div>
                <div className="flex p-0">
                  <input
                    type="text"
                    value={data[0]}
                    disabled={true}
                    className="bg-black border-0 text-white outline-none caret-white text-left"
                  />
                </div>
              </div>
              <div className={"my-2 font-normal text-[#3464a3]"}>{data[1]}</div>
            </React.Fragment>
          ))}
        </React.Fragment>
      )}

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
