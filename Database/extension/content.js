// When the button is clicked, execute the script to extract and filter text
document.getElementById("extract-text").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: () => {
            // Helper function to filter relevant text
            function filterRelevantText(text) {
              return text
                .split("\n") // Split text into lines
                .map((line) => line.trim()) // Trim each line
                .filter(
                  (line) =>
                    line.length > 0 && // Exclude empty lines
                    !line.startsWith("#") && // Exclude hashtags
                    !/^\d+$/.test(line) && // Exclude numbers
                    !line.startsWith("@") && // Exclude usernames
                    !line.includes("Follow") && // Exclude 'Follow' prompts
                    !line.toLowerCase().includes("log in") && // Exclude 'Log in'
                    !line.toLowerCase().includes("sign up") // Exclude 'Sign up'
                )
                .join("\n"); // Join filtered lines back into a single text
            }
  
            // Extract all text from the page
            const rawText = document.body.innerText || "";
            // Apply the filter to keep only relevant text
            const filteredText = filterRelevantText(rawText);
  
            return filteredText || "No relevant text found.";
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
  