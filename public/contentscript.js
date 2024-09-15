document.addEventListener('click', async (event) => {
  if (event.ctrlKey && event.button === 0) { // Check for Ctrl + Left Mouse Button
    console.log('Ctrl + Left Click detected:', event);

    // Extract question and options
    const questionElement = document.querySelector('tgo-quill-view .ql-editor');
    const optionsElements = document.querySelectorAll('app-tgo-choice');

    if (questionElement && optionsElements.length > 0) {
      const questionText = questionElement.innerText.trim();
      const questionImages = Array.from(questionElement.querySelectorAll('img')).map(img => img.src);
      const optionsText = Array.from(optionsElements).map(option => option.innerText.trim());

      console.log('Extracted Question:', questionText);
      console.log('Question Images:', questionImages);
      console.log('Extracted Options:', optionsText);

      // Prepare prompt with or without images
      let prompt = `${questionText}\nOptions:\n${optionsText.join('\n')}`;
      if (questionImages.length > 0) {
        // Upload images and include URLs in the prompt
        const uploadedImages = await Promise.all(questionImages.map(uploadImage));
        prompt = `${questionText}\nImages: ${uploadedImages.join(', ')}\nOptions:\n${optionsText.join('\n')}`;
      }
      console.log('Sending prompt to API:', prompt);

      const response = await fetchResponse(prompt + promptRules);
      console.log('API response received:', response);

      // Click the correct options based on the response
      const responseOptions = response.trim().toLowerCase().split('\n');
      optionsElements.forEach((optionElement) => {
        const optionText = optionElement.innerText.trim().toLowerCase();
        console.log('Checking option:', optionText);

        if (responseOptions.includes(optionText)) {
          console.log('Clicking option:', optionElement);
          optionElement.click();
        }
      });
    } else {
      console.log('Question or options not found');
    }
  }
});

async function uploadImage(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append('file', blob, 'image.jpg');

    const uploadResponse = await fetch('https://your-upload-endpoint.com/upload', {
      method: 'POST',
      body: formData
    });

    const data = await uploadResponse.json();
    return data.url; // Assuming the response contains the URL of the uploaded image
  } catch (error) {
    console.error('Error uploading image:', error);
    return '';
  }
}

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

const promptRules = "\njust print the correct option and nothing else. No extra info except correct option";