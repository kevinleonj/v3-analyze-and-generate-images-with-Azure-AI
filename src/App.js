import React, { useState } from 'react';
import './index.css'; // Make sure to import the CSS file

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
    <div className="app">
      <h1 style={{textAlign: "center", fontSize: "2em"}}>Kevin's Azure Project: Computer Vision and OpenAI</h1>
      <form onSubmit={handleDescribeSubmit}>
        <div style={{textAlign: "center"}}>
          <label>
            Image URL:
            <input type="url" value={url} onChange={e => setUrl(e.target.value)} required />
          </label>
          <button type="submit">Describe</button>
        </div>
        {description && <p>{description}</p>}
      </form>
      <form onSubmit={handleGenerateSubmit}>
        <div style={{textAlign: "center"}}>
          <label>
            Image Prompt:
            <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} required />
          </label>
          <button type="submit">Generate Image</button>
        </div>
        {imageUrl && <img src={imageUrl} alt="Generated" />}
      </form>
      <h2 style={{textAlign: "center"}}>Instrucciones</h2>
      <p style={{textAlign: "center"}}>
        ¡Hola! Este es mi primer proyecto de Azure, así que por favor ten paciencia con cualquier error o lentitud en el rendimiento. Aquí te explico cómo usar la aplicación:
        <br/>
        <br/>
        1. <strong>Image URL</strong>: Ingresa la URL de una imagen en este cuadro. Al hacer clic en “Describir”, la URL se envía a un servicio de Visión por Computadora de Azure, que devuelve una descripción de la imagen en aproximadamente 5 segundos.
        <br/>
        <br/>
        2. <strong>Image Prompt</strong>:  Ingresa una descripción detallada de una imagen que quieras crear, como “Mapache bebé dulce y divertido”. Cuanto más detallada sea tu instrucción, mejores serán los resultados. Después de hacer clic en “Generate Image”, tus instrucciones se envían a la API de OpenAI, que genera una imagen basada en tus indicaciones. Este proceso puede tardar hasta 45 segundos. Por favor, ten paciencia y evita hacer clic en “Generate Image” nuevamente hasta que se devuelva la imagen generada.
      </p>
      <h2 style={{textAlign: "center"}}>Instructions</h2>
      <p style={{textAlign: "center"}}>
        Welcome! This is my first Azure project, so please bear with any errors or slow performance. Here's how to use the app:
        <br/>
        <br/>
        1. <strong>Image URL</strong>: Enter an image URL in this box. Clicking "Describe" sends the URL to an Azure Computer Vision service, which returns an image description in about 5 seconds.
        <br/>
        <br/>
        2. <strong>Image Prompt</strong>: Enter a detailed description of an image you want to create, like "Sweet and funny baby raccoon". The more detailed your instruction, the better the results. After clicking "Generate Image", your instructions are sent to the OpenAI API, which generates an image based on your prompt. This process may take up to 45 seconds. Please be patient and avoid clicking "Generate Image" again until the generated image is returned.
      </p>
    </div>
  );
}

export default App;
