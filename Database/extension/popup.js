// When the button is clicked, execute the script to extract and filter text
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
                  !["follow", "more from", "log in", "explore", "communities", "about", "change palette", "close notes", "original poster", "sign me up", "more like this","go premium"].some((excluded) =>
                    line.toLowerCase().includes(excluded)
                  )
                )
                .join(" ") // Join all lines into a single block of text
                .split(/[.!?]+/) // Split into sentences based on punctuation
                .map((sentence) => sentence.trim()) // Trim each sentence
                .filter((sentence) => sentence.length > 0); // Remove empty sentences
  
              // Label each statement
              return statements
                .map((statement, index) => `${index + 1}=${statement}`)
                .join("\n");
            }
  
            // Extract all visible text on the page
            const rawText = document.body.innerText || "";
            // Apply the filter and labeling functionality
            const labeledStatements = filterAndLabelStatements(rawText);
  
            console.log("Raw text:", rawText); // Debugging log
            console.log("Labeled statements:", labeledStatements); // Debugging log
  
            return labeledStatements || "No relevant content found.";
          },
        },
        (results) => {
          if (results && results[0] && results[0].result) {
            document.getElementById("content").innerText = results[0].result;
          } else {
            document.getElementById("content").innerText = "Failed to extract relevant text.";
          }
        }
      );
    });
  });
  