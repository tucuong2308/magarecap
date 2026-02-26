import "./App.css";
import MangaEditor from "./component/home";

function App() {
  useEffect(() => {
    fetch("http://localhost:5000/rows")
      .then((res) => res.json())
      .then((data) => setRows(data));
  }, []);

  return (
    <div className="app">
      <MangaEditor />
    </div>
  );
}

export default App;
