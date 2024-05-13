const axios = require('axios');
const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

module.exports = async function (context, req) {
  const credential = new DefaultAzureCredential();

  const vaultUrl = process.env['VAULT_URL'];
  const apiKeySecretName = process.env['API_KEY_SECRET_NAME'];
  const clientKey = new SecretClient(vaultUrl, credential);
  const apiKey = await clientKey.getSecret(apiKeySecretName);

  const endpointSecretName = process.env['ENDPOINT_SECRET_NAME'];
  const clientEndpoint = new SecretClient(vaultUrl, credential);
  const endpoint = await clientEndpoint.getSecret(endpointSecretName);

  const openaiKeySecretName = process.env['KEY_FOR_OPEN_A'];
  const clientOpenAIKey = new SecretClient(vaultUrl, credential);
  const openaiKey = await clientOpenAIKey.getSecret(openaiKeySecretName);

  const imageUrl = req.body && req.body.url;
  const action = req.body && req.body.action;
  if (imageUrl) {
    try {
      if (action === 'describe') {
        const response = await axios.post(`${endpoint.value}/computervision/imageanalysis:analyze?api-version=2024-02-01&features=caption&language=en&gender-neutral-caption=False`, 
          { url: imageUrl },
          {
            headers: {
              'Ocp-Apim-Subscription-Key': apiKey.value,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.captionResult && response.data.captionResult.text) {
          context.res = {
            body: response.data.captionResult.text
          };
        } else {
          context.res = {
            status: 500,
            body: "The API response doesn't include a caption."
          };
        }
      } else if (action === 'generate') {
        const response = await axios.post('https://api.openai.com/v1/images/generations', 
          { 
            model: "dall-e-3", 
            prompt: imageUrl, 
            n: 1, 
            size: "1024x1024" 
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openaiKey.value}`
            }
          }
        );

        if (response.data.data && response.data.data[0] && response.data.data[0].url) {
          context.res = {
            body: response.data.data[0].url
          };
        } else {
          context.res = {
            status: 500,
            body: "The API response doesn't include a generated image URL."
          };
        }
      }
    } catch (error) {
      console.error(error);
      context.res = {
        status: 500,
        body: "An error occurred. Check the function logs for details."
      };
    };
  }
};