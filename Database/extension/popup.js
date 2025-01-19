// When the button is clicked, execute the script to extract and filter text
document.getElementById("extract-text").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: () => {
            // Helper function to clean and filter text
            function filterRelevantText(text) {
              return text
                .split("\n") // Split text into lines
                .map((line) => line.trim()) // Remove leading/trailing spaces
                .filter((line) =>
                  line.split(/\s+/).length > 1 && // Exclude single-word lines
                  line.match(/^[A-Za-z]/) && // Exclude lines starting with special characters or numbers
                  !line.startsWith("#") && // Exclude hashtags
                  !line.match(/^\d+$/) && // Exclude lines that are only numbers
                  !line.match(/\b\d+\b/) && // Exclude lines containing standalone numbers
                  !line.toLowerCase().includes("follow") && // Exclude "Follow"
                  !line.toLowerCase().includes("more from") && // Exclude "More from"
                  !line.toLowerCase().includes("log in") && // Exclude "Log in"
                  !line.toLowerCase().includes("explore") && // Exclude
                  !line.toLowerCase().includes("communities") && // Exclude
                  !line.toLowerCase().includes("about") && // Exclude
                  !line.toLowerCase().includes("change palette") && // Exclude
                  !line.toLowerCase().includes("Close notes") && // Exclude
                  !line.toLowerCase().includes("original poster") && // Exclude
                  !line.toLowerCase().includes("sign me up") && // Exclude
                  !line.toLowerCase().includes("more like this") && // Exclude
                  isNaN(Number(line)) // Exclude standalone numbers
                )
                .join("\n"); // Join filtered lines
            }
  
            // Extract all visible text on the page
            const rawText = document.body.innerText || "";
            // Apply the filter to clean and focus on relevant lines
            const filteredText = filterRelevantText(rawText);
  
            return filteredText || "No relevant content found.";
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
  