FROM mcr.microsoft.com/devcontainers/universal:2

# Install PowerShell
RUN wget -q https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb \
    && dpkg -i packages-microsoft-prod.deb \
    && apt-get update \
    && apt-get install -y powershell
# Install Azure CLI
RUN curl -sL https://aka.ms/InstallAzureCLIDeb | bash