chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.scripting.executeScript(
    {
      target: { tabId: tabs[0].id },
      func: () => {
        function cleanText(text) {
          return text
            .replace(/\s+/g, " ")
            .replace(/\n/g, " ")
            .trim();
        }

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
                ].some((excluded) => line.toLowerCase().includes(excluded))
            )
            .join(" ")
            .split(/[.!?]+/)
            .map((sentence) => sentence.trim())
            .filter((sentence) => sentence.length > 0);

          return cleanText(statements.join(". "));
        }

        const rawText = document.body.innerText || "";
        return filterAndLabelStatements(rawText);
      },
    },
    async (results) => {
      if (results && results[0] && results[0].result) {
        const extractedText = results[0].result;

        if (extractedText) {
          try {
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

document.addEventListener("DOMContentLoaded", () => {
  const loadingDots = document.getElementById("loading-dots");
  let dotCount = 0;

  setInterval(() => {
    dotCount = (dotCount + 1) % 4;
    loadingDots.textContent = ".".repeat(dotCount);
  }, 500);
});