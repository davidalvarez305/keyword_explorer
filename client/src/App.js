import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  function getToken() {
    fetch("http://localhost:4010/api/keywords/")
      .then(async (res) => {
        const data = await res.json();
        if (data.data) {
          window.location.href = data.data;
        }
      })
      .catch(console.error);
  }

  return (
    <>
      <div>Hey!</div>
      <button onClick={getToken}>Click here</button>
    </>
  );
}

export default App;
