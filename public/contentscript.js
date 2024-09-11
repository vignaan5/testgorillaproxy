document.addEventListener('click', async (event) => {
  if (event.ctrlKey && event.button === 0) { // Check for Ctrl + Left Mouse Button
    console.log('Ctrl + Left Click detected:', event);

    // Extract question and options
    const questionElement = document.querySelector('tgo-quill-view .ql-editor');
    const optionsElements = document.querySelectorAll('app-tgo-choice');

    if (questionElement && optionsElements.length > 0) {
      const questionText = questionElement.innerText.trim();
      const optionsText = Array.from(optionsElements).map(option => option.innerText.trim());

      console.log('Extracted Question:', questionText);
      console.log('Extracted Options:', optionsText);

      // Send the question and options to the Perplexity API
      const prompt = `${questionText}\nOptions:\n${optionsText.join('\n')}`;
      console.log('Sending prompt to API:', prompt);

      const response = await fetchResponse(prompt + promptRules);
      console.log('API response received:', response);

      // Find and animate the correct option
      optionsElements.forEach((optionElement) => {
        const optionText = optionElement.innerText.trim().toLowerCase();
        console.log('Checking option:', optionText);

        if (response.trim().toLowerCase() === optionText) {
          console.log('Animating cursor to option:', optionElement);
          animateCursorToElement(optionElement, event);
          setTimeout(() => optionElement.click(), 1000); // Delay click to allow animation
        }
      });
    } else {
      console.log('Question or options not found');
    }
  }
});

async function fetchResponse(prompt) {
  try {
    console.log('Sending prompt to API:', prompt);

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [{ role: 'user', content: prompt }],
        stream: false
      })
    });

    const data = await response.json();
    console.log('Received data from API:', data);
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching response:', error);
    return 'Error fetching response';
  }
}

function animateCursorToElement(element, event) {
  const rect = element.getBoundingClientRect();
  const cursor = document.createElement('div');
  cursor.style.position = 'fixed';
  cursor.style.width = '0';
  cursor.style.height = '0';
  cursor.style.border = '5px solid transparent';
  cursor.style.borderTopColor = 'black';
  cursor.style.borderRadius = '50%';
  cursor.style.zIndex = '1000';
  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;
  cursor.style.transition = 'left 1s ease, top 1s ease';
  document.body.appendChild(cursor);

  requestAnimationFrame(() => {
    cursor.style.left = `${rect.left + rect.width / 2}px`;
    cursor.style.top = `${rect.top + rect.height / 2}px`;
  });

  setTimeout(() => document.body.removeChild(cursor), 1000);
}

const promptRules = "\n 1) just print the correct option and nothing else. No extra info except correct option";