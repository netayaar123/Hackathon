import { useEffect, useState } from "react";
import styles from "./Home.module.css";
import axiosInstance from "../../services/api";

const Home = () => {
  const [responseMessage, setResponseMessage] = useState("");
  const [hasResponse, setHasResponse] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userContent, setUserContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "The Reality Check: Validate Content"; // Set document title on mount
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll(`.${styles.parallax}`);
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          el.classList.add(styles.visible); // Add 'visible' class when element is in view
        }
      });
    };

    window.addEventListener("scroll", handleScroll); // Set scroll event listener
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup on unmount
  }, []);

  const handleValidation = async () => {
    setIsLoading(true); // Set loading state before validation
    const text = document.getElementById("content-input").value;
    const ageInput = document.getElementById("age-input");
    const genderInput = document.getElementById("gender-input");

    const age = ageInput?.value || null;
    const gender = genderInput?.value || null;

    try {
      const response = await axiosInstance.post("/verify-classify", {
        content: text,
        age: age,
        gender: gender,
      });
      setResponseMessage(response.data.message || "Validation successful!");
      setUserContent(text);
      setHasResponse(true); // Set response received flag
      setErrorMessage("");
    } catch (error) {
      console.error("Error during validation:", error);
      setResponseMessage("");
      setErrorMessage("Failed to validate content. Please try again.");
      setHasResponse(false); // Set response failure flag
    } finally {
      setIsLoading(false); // Reset loading state after request
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

      <h1 className={`${styles.headline} ${styles.parallax}`}>The Reality Check: Validate Content, Stay Safe</h1>
      <p className={`${styles.welcomeText} ${styles.parallax}`}>
        Welcome to The Reality Check! This tool helps validate content for accuracy and safety.
        If necessary, it will connect you with a specialist for further assistance.
      </p>

      <div className={`${styles.inputSection} ${styles.parallax}`}>
        <textarea
          id="content-input"
          placeholder="Validate your content here..."
          className={hasResponse ? styles.textareaSmall : styles.textarea} // Adjust textarea size based on response
          defaultValue={userContent}
        ></textarea>

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

        <button className={styles.button} onClick={handleValidation}>
          Validate Content
        </button>
      </div>

      {hasResponse && (
        <div className={`${styles.responseSection} ${styles.parallax}`}>
          <div
            className={styles.responseBox}
            dangerouslySetInnerHTML={{ __html: responseMessage }} // Display response message
          ></div>
        </div>
      )}

      {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>} {/* Display error message */}
    </div>
  );
};

export default Home;