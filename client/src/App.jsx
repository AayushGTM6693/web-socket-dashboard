import { useEffect, useState } from "react";
import io from "socket.io-client";
import Input from "./component/Input";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

function App() {
  const [score, setScore] = useState({});
  const [scores, setAllScores] = useState([]);
  const [edit, setEdit] = useState(false);

  const socket = io("http://localhost:3000");

  function handleInput(event) {
    const { name, value } = event.target;
    let currentObj = { [name]: value };
    setScore((prev) => ({ ...prev, ...currentObj }));
  }

  function sendScore() {
    socket.emit("scores", { ...score, id: uuidv4() });
    socket.on("playerScores", (data) => {
      setAllScores(data);
      setScore({
        name: "",
        score: "",
      });
    });
    setEdit(false);
  }

  const getEditData = (data) => {
    setEdit(true);
    console.log(data);
    setScore({
      name: data.name,
      score: data.score,
      id: data.id, // Include the existing id
    });
  };
  const handleDeleteData = (data) => {
    socket.emit("deleteScore", data.id);
    console.log(data.id);
  };
  const handleEdit = () => {
    socket.emit("editScore", score); // Use the existing id
    console.log(score);
  };
  useEffect(() => {
    socket.on("playerScores", (data) => {
      setAllScores(data);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("playerScores");
    };
  }, [socket]);

  return (
    <>
      <h1>Multiplayer socket board</h1>
      <Input
        name="name"
        placeholder={"enter your name"}
        handleInput={handleInput}
        value={score?.name}
      />
      <Input
        name="score"
        placeholder={"enter your score"}
        handleInput={handleInput}
        value={score?.score}
      />
      <button className="btn" onClick={edit ? handleEdit : sendScore}>
        {edit ? "Edit Score" : "Submit Score"}
      </button>
      <table>
        {scores.length > 0 ? (
          <tbody>
            <tr>
              <th>Name</th>
              <th>Score</th>
              <th>Id</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
            {scores.map((score, index) => (
              <tr key={index}>
                <td>{score?.name}</td>
                <td>{score?.score}</td>
                <td>{score?.id}</td>
                <td>
                  <button onClick={() => getEditData(score)}>Edit</button>
                </td>
                <td>
                  <button onClick={() => handleDeleteData(score)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          ""
        )}
      </table>
    </>
  );
}

export default App;
