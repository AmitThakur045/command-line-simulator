/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from "react";

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
  const [arrowIndex, setArrowIndex] = useState(0);
  const firstRef = useRef(null);
  const secondRef = useRef(null);

  useEffect(() => {
    document.getElementById(`row-result-${id}`).scrollIntoView(false);
  }, [terminalIndex]);

  function handleCommands() {
    let words = command.split(" ").filter(Boolean);
    // console.log("words", words);
    let main = words[0];
    words.shift();
    // console.log("words2", words);
    let result = "";
    let rest = words.join(" ");
    rest = rest.trim();
    console.log("res", rest, main);

    switch (main) {
      case "cd": {
        if (words.length === 0 || rest === "") {
          setCurrentDirectoryPath("~");
          setCurrentDirectoryName("root");
          break;
        } else if (words.length > 1) {
          result = "too many arguments, arguments must be <1.";
          break;
        } else if (
          childDirectories[currentDirectoryName].some((ele) => {
            return (
              JSON.stringify(ele) ==
              JSON.stringify({ name: rest.toString(), isDirectory: true })
            );
          })
        ) {
          setCurrentDirectoryPath((prev) => prev + "/" + rest);
          setCurrentDirectoryName(rest);
          break;
        } else if (rest === "../" || rest === "/") {
          setCurrentDirectoryPath("~");
          setCurrentDirectoryName("root");
          break;
        } else if (rest === "..") {
          const arr = currentDirectoryPath.split("/");
          arr.pop();
          const newPath = arr.join("/");
          setCurrentDirectoryPath(newPath);
          if (arr.length === 1) {
            setCurrentDirectoryName("root");
          } else {
            setCurrentDirectoryName(arr.splice(-1));
          }
        } else if (rest === ".") {
          setCurrentDirectoryPath("~");
          setCurrentDirectoryName("root");
          break;
        } else {
          result = `bash: cd: ${words}: is not a directory`;
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
          result = childDirectories[target].reduce((accumulator, currValue) => {
            return accumulator + currValue.name + ",  ";
          }, "");

          if (result === "") {
            result = "empty directory";
          }
        } else {
          result = `ls: cannot access '${words}': No such file or directory`;
        }
        break;
      }
      case "pwd": {
        let str = currentDirectoryPath;
        result = str.replace("~", "/home/amit");
        break;
      }
      case "mkdir": {
        if (words[0] !== undefined && words[0] !== "") {
          result = "";
          if (rest in childDirectories) {
            result = "folder with the same name already existed.";
            break;
          }

          let newDirectories = childDirectories;
          newDirectories[rest] = [];

          const arr = currentDirectoryPath.split("/");
          arr.shift();

          if (arr.length === 0) {
            newDirectories["root"].push({
              name: rest,
              isDirectory: true,
            });
          } else {
            newDirectories[arr.slice(-1).toString()].push({
              name: rest,
              isDirectory: true,
            });
          }
          setChildDirectories(newDirectories);
          break;
        } else {
          result = "mkdir: missing operand";
        }
        break;
      }
      case "echo": {
        if (rest.length === 0) {
          result = "Please enter the sentence in inverted comma's";
        } else if (rest[0] !== '"' || rest[rest.length - 1] !== '"') {
          result = "Please enter the sentence in inverted comma's";
        } else {
          const str = rest.slice(1, -1);
          result = str;
        }
        break;
      }
      case "clear": {
        document.getElementById("#terminal-body").empty();
        break;
      }
      case "about-amit": {
        result = `Hi there! My name is Amit Kumar Thakur, and I am a Computer Science Engineering student currently pursuing my BTech degree from Maharaja Surajmal Institute Of Technology in New Delhi, India. With a CGPA of 9.595, I have a strong foundation in computer science and am always eager to learn and explore new technologies.
        
        I have developed proficiency in several programming languages, including C/C++, HTML/CSS, JavaScript, and TypeScript, and have hands-on experience working with frameworks such as ReactJS, Redux, RecoilJS, Tailwind CSS, NodeJS, ExpressJS, and React Query. I am also familiar with various databases such as Google Firebase, MongoDB, and SQL`;
        break;
      }
      case "help": {
        result =
          "Available Commands: [ cd, ls, pwd, echo, clear, mkdir, about-amit]";
        break;
      }
      default: {
        result =
          "Command '" +
          main +
          "' not found, or not yet implemented.Available Commands: [ cd, ls, pwd, echo, clear, mkdir, about-amit]";
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

    // adding the current command and result to list of all command;
    let res = previousTerminalRows;
    res.push(newPrevTerminal);
    setPreviousTerminalRows(res);

    setTerminalIndex((prev) => prev + 1);
    setArrowIndex(terminalIndex + 1);
    setCommand("");
    setId((prev) => prev + 1);
  }

  const check = (e) => {
    // console.log(previousTerminalRows.length, arrowIndex);
    if (e.key === "Enter") {
      if (command.length !== 0) {
        handleCommands();
      } else return;
    } else if (e.key === "ArrowUp") {
      if (arrowIndex == 0) {
        setCommand(previousTerminalRows[arrowIndex]);
        return;
      }
      let idx = arrowIndex;
      setArrowIndex((prev) => prev - 1);
      setCommand(previousTerminalRows[idx - 1][0]);
    } else if (e.key === "ArrowDown") {
      if (arrowIndex >= terminalIndex) {
        setCommand("");
        return;
      }
      let idx = arrowIndex;
      setArrowIndex((prev) => prev + 1);
      setCommand(previousTerminalRows[idx + 1][0]);
    }
  };
  // console.log("curr", currentDirectoryName, currentDirectoryPath);
  // console.log(previousTerminalRows);
  // console.log(childDirectories);
  // console.log("herllo", previousTerminalRows.length);
  return (
    <React.Fragment>
      {previousTerminalRows.length > 0 && (
        <React.Fragment>
          {previousTerminalRows.map((data, idx) => (
            <div key={idx} id="terminal-body">
              <div className="flex w-full h-5 space-x-2">
                <div className="flex font-semibold items-center">
                  <span className="text-[#00e200]">Amit@Thakur</span>
                  <span className="text-white">:</span>
                  <span className="text-[#3464a3]">{data[3]}</span>
                  <span className="text-white">$</span>
                </div>
                <div className="flex p-0 w-full">
                  <input
                    type="text"
                    value={data[0]}
                    disabled={true}
                    className="bg-black w-full border-0 text-white outline-none caret-white text-left"
                  />
                </div>
              </div>
              <div className={"my-2 font-normal text-[#3464a3]"}>{data[1]}</div>
            </div>
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
            className="bg-black w-full border-0 text-white outline-none caret-white text-left"
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
