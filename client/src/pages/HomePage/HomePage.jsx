import styles from './Home.module.css';
import RandomDuck from '../../components/RandomDuck/RandomDuck.jsx';
import { useEffect } from "react";
import axiosInstance from "../../services/api";

const Home = () => {
  // Set the page title
  useEffect(() => {
    document.title = "BeSafe - Validate Your Content";
  }, []);

  const handleValidation = async () => {
    const text = document.getElementById("content-input").value;
    const age = document.getElementById("age-input").value || null;
    const gender = document.getElementById("gender-input").value || null;

    console.log("sfasfs");

    try {
        // Use axiosInstance to make the API call
        const response = await axiosInstance.post('/validate', {
            text,
            age,
            gender,
        });

        console.log("Server response:", response.data.message); // For debugging
        // setResponse should be defined, commented for now..
        // setResponse(response.data.message); // Save the server's response
    } catch (error) {
        console.error("Error during validation:", error);
        // setResponse("Failed to validate content.");
    }
};

  return (
    <div className={styles.home}>
        <h1 className={styles.headline}>Duck It</h1>
        <p>
            Welcome to BeSafe! This tool helps validate content for accuracy and safety.
            If necessary, it will connect you with a specialist for further assistance.
        </p>
        <textarea
            id="content-input"
            placeholder="Enter your content here..."
            rows="5"
            cols="50"
            style={{
                width: "100%",
                padding: "10px",
                fontSize: "16px",
                marginTop: "10px",
            }}
        ></textarea>
        <input
            type="number"
            id="age-input"
            placeholder="Enter your age (optional)"
            style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px",
                fontSize: "16px",
            }}
        />
        <input
            type="text"
            id="gender-input"
            placeholder="Enter your gender (optional)"
            style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px",
                fontSize: "16px",
            }}
        />
        <button
            id="validate-button"
            style={{
                padding: "10px 20px",
                fontSize: "16px",
                marginTop: "10px",
                cursor: "pointer",
            }}
            onClick={handleValidation}
        >
            Validate Content
        </button>
        <RandomDuck />
    </div>
);
};

export default Home;