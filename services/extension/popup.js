chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.scripting.executeScript(
    {
      target: { tabId: tabs[0].id },
      func: () => {
        // Function to clean and format text
        function cleanText(text) {
          return text
            .replace(/\s+/g, " ") // Replace multiple spaces/newlines with a single space
            .replace(/\n/g, " ") // Replace newlines with spaces
            .trim(); // Remove leading/trailing spaces
        }

        // Function to filter and label statements, removing irrelevant lines
        function filterAndLabelStatements(text) {
          const statements = text
            .split("\n")
            .map((line) => line.trim())
            .filter(
              (line) =>
                line.split(/\s+/).length > 1 &&
                /^[A-Za-z]/.test(line) &&
                !line.startsWith("#") &&
                !line.match(/^\d+$/) &&
                !line.match(/\b\d+\b/) &&
                ![
                  "follow",
                  "more from",
                  "log in",
                  "explore",
                  "communities",
                  "about",
                  "change palette",
                  "close notes",
                  "original poster",
                  "sign me up",
                  "more like this",
                  "go premium",
                ].some((excluded) => line.toLowerCase().includes(excluded)) // Filter out unwanted words
            )
            .join(" ") // Join the filtered lines
            .split(/[.!?]+/) // Split into sentences
            .map((sentence) => sentence.trim())
            .filter((sentence) => sentence.length > 0); // Remove empty sentences

          return cleanText(statements.join(". ")); // Return cleaned and joined sentences
        }

        const rawText = document.body.innerText || ""; // Extract the raw text from the page
        return filterAndLabelStatements(rawText); // Return the filtered and labeled statements
      },
    },
    async (results) => {
      if (results && results[0] && results[0].result) {
        const extractedText = results[0].result; // Get the extracted text from results

        if (extractedText) {
          try {
            // Send the extracted text to the backend to find the most harmful sentence
            const harmfulResponse = await fetch("http://localhost:5012/api/find-harmful", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ content: extractedText }),
            });

            if (!harmfulResponse.ok) {
              throw new Error("Failed to fetch most harmful sentence.");
            }

            const harmfulData = await harmfulResponse.json();
            const mostHarmfulSentence = harmfulData.mostHarmfulSentence;

            // Verify the harmful sentence with the backend
            const verifyResponse = await fetch("http://localhost:5012/api/verify-classify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ content: mostHarmfulSentence }),
            });

            if (!verifyResponse.ok) {
              throw new Error("Failed to verify content.");
            }

            const verifyData = await verifyResponse.json();

            // Display the harmful sentence and the response message
            document.getElementById("content").innerHTML = `
              <div class="response-box">
                <p class="harmful-sentence">⚠ Harmful Data Detected: "${mostHarmfulSentence}"</p>
                <p class="response-message">${verifyData.message}</p>
              </div>
            `;
          } catch (error) {
            console.error("Error:", error);
            document.getElementById("content").innerText = "An error occurred while processing the request.";
          }
        } else {
          document.getElementById("content").innerText = "No relevant content found.";
        }
      } else {
        document.getElementById("content").innerText = "Failed to extract relevant text.";
      }
    }
  );
});

// Loading animation for dots
document.addEventListener("DOMContentLoaded", () => {
  const loadingDots = document.getElementById("loading-dots");
  let dotCount = 0;

  setInterval(() => {
    dotCount = (dotCount + 1) % 4;
    loadingDots.textContent = ".".repeat(dotCount);
  }, 500);
});
