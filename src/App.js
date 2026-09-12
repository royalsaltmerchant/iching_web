import Oracle from './scenes/Oracle'
import './style.css'

function App() {
  return (
    <div className="app-shell">
      <Oracle />
      <footer className="site-footer">
        <a href="https://julianranieri.com">Julian Ranieri</a>
        <a href="/hexagrams/">Hexagrams</a>
        <span>Online I Ching coin toss, I Ching roll, and hexagram oracle.</span>
      </footer>
    </div>
  );
}

export default App;
