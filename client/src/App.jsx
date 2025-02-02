import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/HomePage/HomePage';
import styles from './styles/App.module.css';

function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
        <footer className={styles.footer}>
          <p>&copy; The Reality Check! 2025 </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
