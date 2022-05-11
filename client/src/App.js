function App() {
  function getToken() {
    fetch("http://localhost:4010/api/keywords/")
      .then(async (res) => {
        const data = await res.json();
        console.log(data);
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
