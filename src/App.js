import React, { useState } from 'react';

function App() {
  const [imageUrl, setImageUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [description, setDescription] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');

  const handleDescribe = async (event) => {
    event.preventDefault();
    const response = await fetch('https://v3-v4-analyze-and-generate-images-function.azurewebsites.net/api/MyFunction?code=magAszZLBg6CfBUt3EOaBcfg__YLU94sKLvKDIPmXFfkAzFuA9lsUw%3D%3D', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: imageUrl, action: 'describe' }),
    });
    const data = await response.text();
    setDescription(data);
  };

  const handleGenerate = async (event) => {
    event.preventDefault();
    const response = await fetch('https://v3-v4-analyze-and-generate-images-function.azurewebsites.net/api/MyFunction?code=magAszZLBg6CfBUt3EOaBcfg__YLU94sKLvKDIPmXFfkAzFuA9lsUw%3D%3D', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: prompt, action: 'generate' }),
    });
    const data = await response.text();
    setGeneratedImageUrl(data);
  };

  return (
    <div>
      <form>
        <label>
          Image URL:
          <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} required />
        </label>
        <button type="button" onClick={handleDescribe}>Describe</button>
        <label>
          Prompt:
          <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} required />
        </label>
        <button type="button" onClick={handleGenerate}>Generate</button>
      </form>
      {description && <p>{description}</p>}
      {generatedImageUrl && <img src={generatedImageUrl} alt="Generated" />}
    </div>
  );
}

export default App;
