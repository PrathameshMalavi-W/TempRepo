---
name: onecx-local-env-cli
description: Use this skill whenever you need to interact with the OneCX Local Environment — starting, stopping, importing data, registering new applications, or verifying that the environment is running. This skill is used exclusively by the Deployer subagent (Stage 4) to deploy a generated PoC to the developer's local OneCX instance.
---

# OneCX Local Environment CLI Skill

This skill teaches you how to manage the OneCX local development environment. The local environment is a Docker Compose-based setup that runs a complete OneCX platform stack on the developer's machine.

## Configuration: Finding the Local Environment Path

The path to the `onecx-local-env` repository on the user's machine is **not fixed** — it is configurable. 

**Step 1: Check for a config file** at the workspace root:
```
onecx-local-env.path
```

If this file exists, read its content. It should contain the absolute path to the `onecx-local-env` folder.

**Example `onecx-local-env.path` content:**
```
D:\onecx\onecx\onecx-all\onecx-local-env
```

**Step 2: If the config file does not exist**, ask the user:
> "To deploy the PoC, I need the path to your `onecx-local-env` folder (the directory containing `start-onecx.sh`). Please provide the full path."

Once the user provides it, offer to save it to `onecx-local-env.path` for future use.

**Step 3: Validate the path.** Ensure `start-onecx.sh` exists in that directory. If not, the path is wrong — ask again.

---

## Prerequisites Check (MANDATORY)

Before any deployment operation, verify all prerequisites:

```bash
# 1. Check Docker is installed and running
docker --version
docker info

# 2. Check Docker Compose v2
docker compose version

# 3. Check bash is available (for running .sh scripts on Windows, use Git Bash or WSL)
bash --version
```

**If Docker is not running:**
> Stop and tell the user: "Docker is not running. Please start Docker Desktop and try again."

**Important note for Windows users:** The `.sh` scripts must be run using:
- **Git Bash** (recommended): `"C:\Program Files\Git\bin\bash.exe" start-onecx.sh`
- **WSL**: `wsl ./start-onecx.sh`
- **PowerShell** does NOT work for these `.sh` scripts

---

## Available Scripts in the Local Environment

All scripts are in the `onecx-local-env` directory. You must `cd` to that directory before running them, as they use relative paths.

| Script | Purpose | Key options |
|--------|---------|-------------|
| `start-onecx.sh` | Start the full OneCX stack | `-p base` (default) or `-p all` |
| `stop-onecx.sh` | Stop all containers | — |
| `import-onecx.sh` | Import data (workspaces, products, MFEs) | `-d base` |
| `toggle-mfes.sh` | Enable/disable specific MFEs | `--enable <mfe-name>` |
| `check-images.sh` | List all container image versions | — |
| `update-images.sh` | Pull latest container images | — |

---

## Operation 1: Start the Local Environment

```bash
cd <onecx-local-env-path>
bash start-onecx.sh
```

Wait for the environment to be healthy. The script will print:
```
To use OneCX, navigate to http://onecx.localhost/onecx-shell/admin/
```

**Verify it is up:**
```bash
docker ps --filter "name=onecx" --format "table {{.Names}}\t{{.Status}}"
```

All core containers should show `Up ... (healthy)`.

---

## Operation 2: Register a New Application (MFE)

After the PoC is built, it needs to be registered in OneCX as a Microfrontend (MFE) and added to a Workspace. 

### Using the OneCX Local Env CLI (Recommended)

The `onecx-local-env-cli` is a Node.js tool for generating import configuration files. Check if it is available:

```bash
npx @onecx/onecx-local-env-cli --version 2>/dev/null || echo "MISSING"
```

If missing, inform the user:
> "The onecx-local-env-cli tool is needed to register the app. Install with: `npm install -g @onecx/onecx-local-env-cli`"

Once available, generate the app registration files:
```bash
npx @onecx/onecx-local-env-cli app setup \
  --name "<poc-name>" \
  --mfe-url "http://localhost:4200" \
  --workspace "admin" \
  --base-path "/<poc-name>/"
```

This generates import JSON files in a `onecx-import/` directory within the PoC folder.

### Manual Registration (Fallback)

If the CLI is not available, the MFE can be registered manually via the OneCX Admin UI:
1. Navigate to: `http://onecx.localhost/onecx-shell/admin/`
2. Go to **Product Store** → Add Product
3. Go to **Workspace Admin** → Add the MFE to a workspace

---

## Operation 3: Import Application Data

After generating import files (using the CLI or manually), import them:

```bash
cd <onecx-local-env-path>
bash import-onecx.sh -d base
```

Or for a specific import directory:
```bash
bash import-onecx.sh --dir "<poc-folder>/onecx-import/"
```

---

## Operation 4: Run the PoC App Locally (Dev Mode)

While the OneCX env is running, start the Angular app in development mode:

```bash
cd <poc-name>/
npm install
npm run start
```

The app will be available at `http://localhost:4200` and should be accessible through OneCX Shell at `http://onecx.localhost/onecx-shell/` (once registered).

---

## Verification

After deployment, verify the app is accessible:

1. Open: `http://onecx.localhost/onecx-shell/admin/`
2. The PoC should appear in the navigation
3. Clicking it should load the Angular app

**Check container logs if something is wrong:**
```bash
docker logs onecx-shell-bff --tail 50
docker logs onecx-workspace-svc --tail 50
```

---

## Stopping the Environment

```bash
cd <onecx-local-env-path>
bash stop-onecx.sh
```

---

## Troubleshooting

| Problem | Likely cause | Fix |
|---------|-------------|-----|
| `http://onecx.localhost` not resolving | Missing hosts entry | Add `127.0.0.1 onecx.localhost` to `/etc/hosts` or `C:\Windows\System32\drivers\etc\hosts` |
| Import fails with 401 | Auth not ready | Wait 30 seconds after start, run import again |
| App shows 404 in shell | MFE not registered | Re-run `import-onecx.sh` |
| Docker out of memory | Too many containers | Stop other Docker projects first |
| Port 80 conflict | Another service on port 80 | Stop the conflicting service or change OneCX port |
