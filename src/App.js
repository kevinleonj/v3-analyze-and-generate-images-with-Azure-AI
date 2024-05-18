import React, { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleDescribeSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch('https://v3-v4-analyze-and-generate-images-function.azurewebsites.net/api/MyFunction?code=magAszZLBg6CfBUt3EOaBcfg__YLU94sKLvKDIPmXFfkAzFuA9lsUw%3D%3D', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    const data = await response.text();
    setDescription(data);
  };

  const handleGenerateSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch('https://v1-openai-calll.azurewebsites.net/api/src?code=-G-w7LVHD3m81jiA09cFf7H66RfhzwP3FFIR1VJ9Dq-3AzFuuebRFw%3D%3D', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      setImageUrl(data[0]);
    }
  };

  return (
    <div>
      <form onSubmit={handleDescribeSubmit}>
        <label>
          Image URL:
          <input type="url" value={url} onChange={e => setUrl(e.target.value)} required />
        </label>
        <button type="submit">Describe</button>
      </form>
      {description && <p>{description}</p>}
      <form onSubmit={handleGenerateSubmit}>
        <label>
          Image Prompt:
          <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} required />
        </label>
        <button type="submit">Generate Image</button>
      </form>
      {imageUrl && <img src={imageUrl} alt="Generated" />}
    </div>
  );
}

export default App;
