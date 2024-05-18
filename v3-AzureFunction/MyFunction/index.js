const axios = require('axios');
const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

module.exports = async function computerVisionAPICall(context, req) {
    const credential = new DefaultAzureCredential();

    const vaultUrl = process.env['VAULT_URL']; // Replace with your environment variable
    const apiKeySecretName = process.env['API_KEY_SECRET_NAME']; // Replace with your environment variable
    const clientKey = new SecretClient(vaultUrl, credential);
    const apiKey = await clientKey.getSecret(apiKeySecretName);

    const endpointSecretName = process.env['ENDPOINT_SECRET_NAME']; // Replace with your environment variable
    const clientEndpoint = new SecretClient(vaultUrl, credential);
    const endpoint = await clientEndpoint.getSecret(endpointSecretName);

    console.log(`API Key: ${apiKey.value}`);
    console.log(`Endpoint: ${endpoint.value}`);
    console.log(`Request Body: ${JSON.stringify(req.body)}`);
    
    const imageUrl = req.body && req.body.url;
    if (imageUrl) {
        try {
            const response = await axios.post(`${endpoint.value}/computervision/imageanalysis:analyze?api-version=2024-02-01&features=caption&language=en&gender-neutral-caption=False`, 
                { url: imageUrl },
                {
                    headers: {
                        'Ocp-Apim-Subscription-Key': apiKey.value,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.error('API response:', response);
            console.error('API response:', response.data);
        
            if (response.data.captionResult && response.data.captionResult.text) {
                context.res = {
                    // status: 200, /* Defaults to 200 */
                    body: response.data.captionResult.text
                };
            } else {
                console.error('API response:', response.data);
                context.res = {
                    status: 500,
                    body: "The API response doesn't include a caption."
                };
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