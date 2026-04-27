# OneCX Forge
This repository contains the **OneCX Forge** agent, a specialized orchestrator designed to automate the creation of OneCX-based Proof of Concepts (PoCs) based on various types of requirements.

OneCX Forge supports three main workflows, based on the type of requirements provided by the user:

**RFP-based** 

The user provides a set of RFP files in the `rfp/` folder, including a mandatory `SCOPE.md` file that defines the scope of the PoC to be created. The agent will then derive in-scope requirements from the RFP files and create a PoC based on those requirements.

**Legacy app-based**

The user provides the files of an existing non-OneCX application in the `app/` folder. The agent will reverse-engineer requirements from the provided application files and create a PoC based on those requirements.

**CUSTOM**

The user provides custom requirements via the prompt or a `GOAL.md` file. The agent will create a PoC based on those requirements.

## Prerequisites
The agent setup relies on the following prerequisites:

- Active GitHub Copilot license

- Local installation of VS Code and the [GitHub Copilot extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat), with agent support enabled.
    - Familiarity with how to interact with agents in VS Code.
- An up-to-date installation of Node.js and NPM (e.g. the latest LTS version). 
    - Can be installed and managed using a version manager like [`nvm`](https://github.com/nvm-sh/nvm).

## Getting Started
To get started with using OneCX Forge, complete the following steps:

1. Create an empty directory in which you want to run the agent. This will be the workspace for OneCX Forge and the PoC will be generated in a subfolder of this directory.
2. Copy the contents of this repository using `tiged`. This will ensure that only the relevant files for the agent to run are copied, without including the entire Git history of the repository.
    ```bash
    npx tiged https://gitlab.com/1000kit/apps/onecx/onecx-poc-generation-agents . 
    ```
3. Open the directory in VS Code.
4. Open a new chat window (`Ctrl+Shift+P` or `Cmd+Shift+P` → "Chat: New Chat Editor").
5. Use one of the following slash commands to start OneCX Forge in the required mode:
    - For RFP-based PoC creation: `/create-rfp-poc`
    - For legacy app-based PoC creation: `/migrate-legacy-app`
    - For custom requirements-based PoC creation: `/create-custom-poc`