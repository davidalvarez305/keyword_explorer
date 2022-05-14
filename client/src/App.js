import { useNavigate } from "react-router-dom";

function App() {
  function getToken() {
    fetch(process.env.REACT_APP_AUTH_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scope: `https://www.googleapis.com/auth/webmasters`,
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

  function testRequest() {
    console.log(process.env.REACT_APP_KEYWORDS_API);
    fetch(process.env.REACT_APP_KEYWORDS_API, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        const d = await res.json();
        console.log(d);
      })
      .catch(console.error);
  }

  return (
    <>
      <div>Hey!</div>
      <button
        style={{
          height: 50,
          borderRadius: 100,
          borderWidth: 5,
          borderColor: "red",
        }}
        onClick={getToken}
      >
        Click here
      </button>
      <button
        style={{
          height: 50,
          borderRadius: 100,
          borderWidth: 5,
          borderColor: "red",
        }}
        onClick={testRequest}
      >
        Test here
      </button>
    </>
  );
}

export default App;
