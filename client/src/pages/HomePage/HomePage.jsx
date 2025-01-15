import styles from './Home.module.css';
import RandomDuck from '../../components/RandomDuck/RandomDuck.jsx';
import { useEffect, useState } from "react";
import axiosInstance from "../../services/api";

const Home = () => {
  const [responseMessage, setResponseMessage] = useState(""); // State for server response
  const [errorMessage, setErrorMessage] = useState(""); // State for errors

  // Set the page title
  useEffect(() => {
    document.title = "BeSafe - Validate Your Content";
  }, []);

  const handleValidation = async () => {
    const text = document.getElementById("content-input").value;
    const age = document.getElementById("age-input").value || null;
    const gender = document.getElementById("gender-input").value || null;

    try {
      // Make API call to verify and classify content
      const response = await axiosInstance.post('/verify-classify', {
        content: text
        // age,
        // gender,
      });

      // Set the server response message
      setResponseMessage(response.data.message || "Validation successful!");
      setErrorMessage(""); // Clear any previous errors
    } catch (error) {
      console.log(error)
      console.error("Error during validation:", error);

      // Handle error messages
      setResponseMessage("");
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Failed to validate content. Please try again.");
      }
    }
  };

  return (
    <div className={styles.home}>
      <h1 className={styles.headline}>BeSafe: Validate Content, Stay Safe</h1>
      <p>
        Welcome to BeSafe! This tool helps validate content for accuracy and safety.
        If necessary, it will connect you with a specialist for further assistance.
      </p>
      
      <textarea
        id="content-input"
        placeholder="Validate your content here..."
        className={styles.textarea}
      ></textarea>

      <div className={styles.inputsRow}>
        <input
          type="number"
          id="age-input"
          placeholder="Enter your age (optional)"
          className={styles.input}
        />
        <input
          type="text"
          id="gender-input"
          placeholder="Enter your gender (optional)"
          className={styles.input}
        />
      </div>

      <button
        id="validate-button"
        className={styles.button}
        onClick={handleValidation}
      >
        Validate Content
      </button>

      {/* Display the response message */}
      {responseMessage && (
        <p className={styles.responseMessage}>
          {responseMessage}
        </p>
      )}

      {/* Display error messages */}
      {errorMessage && (
        <p className={styles.errorMessage}>
          {errorMessage}
        </p>
      )}

      <RandomDuck />
    </div>
  );
};

export default Home;