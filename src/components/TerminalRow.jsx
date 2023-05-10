/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";

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

  useEffect(() => {
    document.getElementById(`row-result-${id}`).scrollIntoView(false);
  }, [terminalIndex]);

  function handleCommands() {
    let words = command.split(" ").filter(Boolean);
    // console.log("words", words);
    let main = words[0];
    words.shift(); // removing first element
    // console.log("words2", words);
    let result = "";
    let rest = words.join(" ");
    rest = rest.trim();
    // console.log("res", rest, main);

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
      case "touch": {
        if (words[0] !== undefined && words[0] !== "") {
          result = "";

          let newDirectories = childDirectories;
          const arr = currentDirectoryPath.split("/");
          arr.shift();

          // Need to add a check to find if the folder with the same name exist or not
          words.forEach((value) => {
            if (arr.length === 0) {
              newDirectories["root"].push({
                name: value,
                isDirectory: false,
              });
            } else {
              newDirectories[arr.slice(-1).toString()].push({
                name: value,
                isDirectory: false,
              });
            }
          });
          setChildDirectories(newDirectories);
          break;
        } else {
          result = "touch: missing operand";
        }
        break;
      }
      case "mv": {
        if (words.length > 1) {
          if (words.length == 2) {
            // move a file
            if (words[1].includes("/")) {
              let arr = words[1].split("/");
              arr.shift(); // removing " ";
              arr.shift(); // removing home;
              arr.shift(); // removing amit;

              arr.unshift("root"); // adding root to the front
              // checking if the destination directory is present or not
              const check = (idx) => {
                if (idx === arr.length - 1) {
                  return true;
                }
                if (
                  childDirectories[arr[idx].toString()].findIndex(
                    (obj) =>
                      JSON.stringify(obj) ==
                      JSON.stringify({
                        name: arr[idx + 1].toString(),
                        isDirectory: true,
                      })
                  ) !== -1
                ) {
                  return check(idx + 1);
                }
                return false;
              };

              // if destination directory is present
              if (check(0) === true) {
                let newDirectories = childDirectories;
                // added the new file in the directory
                newDirectories[arr.splice(-1)].push({
                  name: words[0],
                  isDirectory: false,
                });

                // remove the file from the prev directory
                let index = newDirectories[currentDirectoryName].findIndex(
                  (obj) =>
                    JSON.stringify(obj) ==
                    JSON.stringify({
                      name: words[0].toString(),
                      isDirectory: false,
                    })
                );

                newDirectories[currentDirectoryName].splice(index, 1);
                setChildDirectories(newDirectories);
              } else {
                result = `there no such destination directory present as ${words[1]}`;
              }
            } else {
              // rename a directory - check if the directory is present or not
              if (
                childDirectories[currentDirectoryName].some((ele) => {
                  return (
                    JSON.stringify(ele) ==
                    JSON.stringify({
                      name: words[0].toString(),
                      isDirectory: true,
                    })
                  );
                })
              ) {
                let newDirectories = childDirectories;

                let index = newDirectories[currentDirectoryName].findIndex(
                  (obj) =>
                    JSON.stringify(obj) ==
                    JSON.stringify({
                      name: words[0].toString(),
                      isDirectory: true,
                    })
                );

                newDirectories[currentDirectoryName][index].name = words[1];
                setChildDirectories(newDirectories);
              } else if (
                childDirectories[currentDirectoryName].some((ele) => {
                  return (
                    JSON.stringify(ele) ==
                    JSON.stringify({
                      name: words[0].toString(),
                      isDirectory: false, // checking if the file is present or not
                    })
                  );
                })
              ) {
                // rename a file
                let newDirectories = childDirectories;
                let index = newDirectories[currentDirectoryName].findIndex(
                  (obj) =>
                    JSON.stringify(obj) ==
                    JSON.stringify({
                      name: words[0].toString(),
                      isDirectory: false,
                    })
                );

                newDirectories[currentDirectoryName][index].name = words[1];
                setChildDirectories(newDirectories);
              } else {
                result = `no directory or file found name ${words[0]}`;
              }
            }
          } else {
            // moving multiple file to destination
            if (words[words.length - 1].includes("/")) {
              let arr = words[words.length - 1].split("/");
              arr.shift(); // removing " ";
              arr.shift(); // removing home;
              arr.shift(); // removing amit;

              arr.unshift("root"); // adding root to the front
              // checking if the destination directory is present or not
              const check = (idx) => {
                if (idx === arr.length - 1) {
                  return true;
                }
                if (
                  childDirectories[arr[idx].toString()].findIndex(
                    (obj) =>
                      JSON.stringify(obj) ==
                      JSON.stringify({
                        name: arr[idx + 1].toString(),
                        isDirectory: true,
                      })
                  ) !== -1
                ) {
                  return check(idx + 1);
                }
                return false;
              };

              if (check(0)) {
                let newDirectories = childDirectories;
                words.pop();

                // added the new file in the directory
                let directoryName = arr.splice(-1).toString();
                words.forEach((obj) => {
                  newDirectories[directoryName].push({
                    name: obj,
                    isDirectory: false,
                  });
                });

                // remove the file from the prev directory
                words.forEach((prevFile) => {
                  let index = newDirectories[currentDirectoryName].findIndex(
                    (obj) =>
                      JSON.stringify(obj) ==
                      JSON.stringify({
                        name: prevFile.toString(),
                        isDirectory: false,
                      })
                  );

                  newDirectories[currentDirectoryName].splice(index, 1);
                });
                setChildDirectories(newDirectories);
              } else {
                result = `there no such destination directory present as ${words[1]}`;
              }
            } else {
              result = "there is no such command present or yet implemented";
            }
          }
        } else {
          result = "mv: missing operand";
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
    // document.getElementById(`row-result-${id}`).innerHTML = result;

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
                  <span className="text-[#00e200] font-extrabold">
                    Amit@Thakur
                  </span>
                  <span className="text-white font-extrabold">:</span>
                  <span className="text-[#3b90ff] font-extralight">
                    {data[3]}
                  </span>
                  <span className="text-white">$</span>
                </div>
                <div className="flex p-0 w-full">
                  <input
                    type="text"
                    value={data[0]}
                    disabled={true}
                    className="bg-black w-[80vw] border-0 text-white outline-none caret-white text-left"
                  />
                </div>
              </div>
              <div className={"my-2 font-extralight text-[#3b90ff]"}>
                {data[1]}
              </div>
            </div>
          ))}
        </React.Fragment>
      )}

      {/* for writing the command */}
      <div className="flex w-full h-5 space-x-2">
        <div className="flex font-semibold items-center">
          <span className="text-[#00e200] font-extrabold">Amit@Thakur</span>
          <span className="text-white font-extrabold">:</span>
          <span className="text-[#3b90ff] font-extralight">
            {currentDirectoryPath}
          </span>
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
            className="bg-black w-[80vw] border-0 text-white outline-none caret-white text-left"
          />
        </div>
      </div>

      {/* to display the result after executing the command */}
      <div id={`row-result-${id}`} className={"my-2 font-extralight"}></div>
    </React.Fragment>
  );
};

export default TerminalRow;
