FROM mcr.microsoft.com/devcontainers/javascript-node:22-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends \
    git curl ca-certificates \
    python3 python3-pip python3-venv \
    && rm -rf /var/lib/apt/lists/*

RUN npm i -g nx npx @angular/cli
