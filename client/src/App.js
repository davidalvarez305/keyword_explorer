import { useNavigate } from "react-router-dom";

function App() {
  function getToken() {
    fetch("http://localhost:4010/api/auth/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scope: `https://www.googleapis.com/auth/adwords`,
      }),
    })
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
