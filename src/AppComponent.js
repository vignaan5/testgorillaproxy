import React, { useState } from 'react';

function AppComponent() {
  const [response, setResponse] = useState('');

  const handleQuery = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/query', {  // Ensure this matches your server setup
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Who is the most popular film star of all time?' }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error:', error);
      setResponse('An error occurred while fetching the data.');
    }
  };

  return (
    <div>
      <button onClick={handleQuery}>Get Answer</button>
      <div>
        <strong>Response:</strong> {response}
      </div>
    </div>
  );
}

export default AppComponent;