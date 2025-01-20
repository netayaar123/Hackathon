import styles from './Home.module.css';
import { useEffect, useState } from "react";
import axiosInstance from "../../services/api";

const Home = () => {
  const [responseMessage, setResponseMessage] = useState(""); // Server response
  const [hasResponse, setHasResponse] = useState(false); // Tracks if response exists
  const [errorMessage, setErrorMessage] = useState(""); // Tracks error state
  const [userContent, setUserContent] = useState(""); // Tracks user input content
  const [isLoading, setIsLoading] = useState(false); // Tracks loading state

  // Set the page title
  useEffect(() => {
    document.title = "The Reality Check: Validate Content";
  }, []);

  const handleValidation = async () => {
    setIsLoading(true); // Show loading animation
    const text = document.getElementById("content-input").value;
    const age = document.getElementById("age-input").value || null;
    const gender = document.getElementById("gender-input").value || null;

    try {
      const response = await axiosInstance.post('/verify-classify', {
        content: text,
        age: age,
        gender: gender,
      });
      setResponseMessage(response.data.message || "Validation successful!");
      setUserContent(text); // Save the user's input
      setHasResponse(true); // Mark that a response was received
      setErrorMessage(""); // Clear previous errors
    } catch (error) {
      console.error("Error during validation:", error);
      setResponseMessage("");
      setErrorMessage("Failed to validate content. Please try again.");
      setHasResponse(false); // Clear the response if validation fails
    } finally {
      setIsLoading(false); // Hide loading animation
    }
  };

  return (
    <div className={styles.home}>
      {/* Loading Animation */}
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}

      <h1 className={styles.headline}>The Reality Check: Validate Content, Stay Safe</h1>
      <p className={styles.welcomeText}>
        Welcome to BeSafe! This tool helps validate content for accuracy and safety.
        If necessary, it will connect you with a specialist for further assistance.
      </p>

      <div className={styles.inputSection}>
        <textarea
          id="content-input"
          placeholder="Validate your content here..."
          className={hasResponse ? styles.textareaSmall : styles.textarea}
          defaultValue={userContent} // Pre-fill the text box with the last input
        ></textarea>

        {/* Only show age and gender inputs if no response has been generated */}
        {!hasResponse && (
          <div className={styles.inputsRow}>
            <input
              type="number"
              id="age-input"
              placeholder="Enter your age (optional)"
              className={styles.input}
            />
            <select id="gender-input" className={styles.input} defaultValue="">
              <option value="" disabled>
                Select your gender (optional)
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        )}

        <button className={styles.button} onClick={handleValidation}>
          Validate Content
        </button>
      </div>

      {/* Display response below the input */}
      {hasResponse && (
        <div className={styles.responseSection}>
          <div
            className={styles.responseBox}
            dangerouslySetInnerHTML={{ __html: responseMessage }}
          ></div>
        </div>
      )}

      {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
    </div>
  );
};

export default Home;
