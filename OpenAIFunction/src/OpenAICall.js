const { OpenAI } = require('openai');
const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');
const { AzureFunction, Context, HttpRequest } = require('@azure/functions');

const keyVaultName = process.env['KEY_VAULT_NAME'];
const KVUri = `https://${keyVaultName}.vault.azure.net`;
const openAIKeySecretName = process.env['AI_OPEN_SECRET_NAME'];

const credential = new DefaultAzureCredential();
const secretClient = new SecretClient(KVUri, credential);

module.exports = async function OpenAICall(context = new Context(), req = new HttpRequest()) {
    try {
        // Retrieve the secret from Azure Key Vault
        const openAIKey = await secretClient.getSecret(openAIKeySecretName);

        // Initialize the OpenAI client with the retrieved secret
        const openai = new OpenAI({ apiKey: openAIKey.value });

        const prompt = req.body && req.body.prompt;
        if (!prompt) {
            context.res = {
                status: 400,
                body: "Please pass a prompt in the request body"
            };
            return;
        }

        const imageResponse = await openai.images.generate({ model: "dall-e-3", prompt: prompt });
        const imageUrls = imageResponse.data.map(item => item.url);

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: imageUrls
        };
    } catch (error) {
        context.log.error(`Error occurred: ${error.message}`);
        context.res = {
            status: 500,
            body: "An error occurred while generating the image."
        };
    }
};
