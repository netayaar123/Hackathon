document.getElementById("extract-text").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: () => {
          // Helper function to clean, filter, and split text into statements
          function filterAndLabelStatements(text) {
            const statements = text
              .split("\n") // Split text into lines
              .map((line) => line.trim()) // Remove leading/trailing spaces
              .filter((line) =>
                line.split(/\s+/).length > 1 && // Exclude single-word lines
                /^[A-Za-z]/.test(line) && // Exclude lines not starting with a letter
                !line.startsWith("#") && // Exclude hashtags
                !line.match(/^\d+$/) && // Exclude lines that are only numbers
                !line.match(/\b\d+\b/) && // Exclude lines containing standalone numbers
                !["follow", "more from", "log in", "explore", "communities", "about", "change palette", "close notes", "original poster", "sign me up", "more like this", "go premium"].some((excluded) =>
                  line.toLowerCase().includes(excluded)
                )
              )
              .join(" ") // Join all lines into a single block of text
              .split(/[.!?]+/) // Split into sentences based on punctuation
              .map((sentence) => sentence.trim()) // Trim each sentence
              .filter((sentence) => sentence.length > 0); // Remove empty sentences

            return statements.join("\n");
          }

          // Extract all visible text on the page
          const rawText = document.body.innerText || "";
          // Apply the filter and labeling functionality
          return filterAndLabelStatements(rawText);
        },
      },
      async (results) => {
        if (results && results[0] && results[0].result) {
          const extractedText = results[0].result;

          if (extractedText) {
            try {
              // Step 1: Call /find-harmful to get the most harmful sentence
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

              // Step 2: Call /verify-classify with the most harmful sentence
              const verifyResponse = await fetch("http://localhost:5012/api/verify-classify", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  content: mostHarmfulSentence,
                  // age: 25, // Example age
                  // gender: "male" // Example gender
                }),
              });

              if (!verifyResponse.ok) {
                throw new Error("Failed to verify content.");
              }

              const verifyData = await verifyResponse.json();

              // Update the popup with the most harmful sentence and the message content directly
              document.getElementById("content").innerHTML = `
                <strong>Harmful data:<br></strong> ${mostHarmfulSentence}<br/><br/>
                ${verifyData.message}
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
});
