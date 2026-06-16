# Rare Bird — rarebirdlearn.com

Static Svelte + Vite site, served by nginx in Docker, fronted by Caddy (TLS + reverse proxy) on the VM.

## Production deployment

- **Host:** DigitalOcean droplet / `judge0` VM, repo cloned at `/rarebird` (this repo).
- **Reverse proxy:** a separate `caddy:alpine` container owns ports **80 + 443** and terminates TLS.
  Its Caddyfile proxies the domain to the app container **by name** over a shared Docker network:
  ```
  rarebirdlearn.com, www.rarebirdlearn.com {
      reverse_proxy rarebird:80
  }
  ```
- **App container:** built from this repo's `Dockerfile` (multi-stage: `npm run build` → nginx serving `dist/`).

### Automated deploys from GitHub Actions

Pushing to `main` now runs `.github/workflows/deploy.yml`. The workflow:

1. verifies the site builds with `npm ci && npm run build`,
2. SSHes into the VM,
3. updates the repo at `/rarebird` (or `DEPLOY_PATH`, if set),
4. rebuilds/restarts the `rarebird` Docker container on the `web` network, and
5. checks both Docker health and `https://rarebirdlearn.com`.

Required one-time GitHub setup: in **GitHub → repo → Settings → Secrets and variables → Actions**, add these **Secrets**:

| Secret | Value |
|---|---|
| `SSH_HOST` | VM hostname or IP |
| `SSH_USER` | VM user that can `cd /rarebird`, pull the repo, and run Docker |
| `SSH_PRIVATE_KEY` | Private key for that VM user/deploy key. Install the matching public key in `SSH_USER`'s `~/.ssh/authorized_keys` on the VM. |
| `SSH_KNOWN_HOSTS` | Output of `ssh-keyscan -H <SSH_HOST>` for the same host value used in `SSH_HOST`. |

Optional **Secret**:

| Secret | Default | Purpose |
|---|---|---|
| `SSH_PORT` | `22` | SSH port for the DigitalOcean droplet, if not using the default |

One-time SSH key setup example:

```bash
# On your machine; do not commit these files
ssh-keygen -t ed25519 -C "github-actions-rarebird" -f ./rarebird_actions -N ""
ssh-copy-id -i ./rarebird_actions.pub <SSH_USER>@<SSH_HOST>

# Put this in GitHub secret SSH_PRIVATE_KEY
cat ./rarebird_actions

# Put this in GitHub secret SSH_KNOWN_HOSTS
ssh-keyscan -H <SSH_HOST>
```

Optional **Variables**:

| Variable | Default | Purpose |
|---|---|---|
| `DEPLOY_PATH` | `/rarebird` | Absolute path to the checked-out repo on the VM |
| `SITE_URL` | `https://rarebirdlearn.com` | URL checked after deploy |

VM prerequisites:

- repo already cloned at `/rarebird` on the VM and able to `git fetch origin main`,
- `SSH_USER` can authenticate with the deploy key and run Docker without an interactive password,
- `docker` installed and usable by `SSH_USER`,
- Docker network `web` exists and is shared with Caddy,
- Caddy is already proxying `rarebirdlearn.com` to `rarebird:80`,
- swap is configured on 1GB VMs (see gotchas below).

The workflow updates the VM checkout with `git reset --hard origin/main`, so don't make uncommitted production edits directly on the VM.

To deploy manually from GitHub, use **Actions → Deploy production → Run workflow**.

### Manual deploy / update

Usually you should just push to `main`. If GitHub Actions is unavailable, run the same remote deploy sequence on the VM after pushing changes:

```bash
cd /rarebird
git fetch origin main
git reset --hard origin/main
docker build -t rarebird .
docker rm -f rarebird
docker run -d --name rarebird --network web --restart unless-stopped rarebird
docker ps                          # rarebird → Up (healthy), NOT Restarting
curl -I https://rarebirdlearn.com  # expect HTTP/2 200
```

### Critical gotchas (these took the site down once — don't repeat)

1. **Do NOT publish a port on the app container.** No `-p 80:80`. Caddy owns 80/443; the app is
   reached internally as `rarebird:80`. Adding `-p 80:80` fails with
   `Bind for 0.0.0.0:80 failed: port is already allocated`.
2. **App container MUST join the `web` Docker network** (`--network web`) so Caddy can resolve the
   `rarebird` hostname. Off the network → Caddy returns **502** (`bad address 'rarebird'`).
3. **`nginx.conf` must be valid.** It's baked into the image and only parsed at container start, so a
   bad config builds fine then crash-loops (`Restarting (1)`, Caddy 502). Verify after build:
   ```bash
   docker run --rm --entrypoint cat rarebird /etc/nginx/conf.d/default.conf | tail -3   # ends with one }
   docker logs --tail 10 rarebird                                                        # no [emerg]
   ```
4. **The VM has 1GB RAM — swap is required.** Without swap, `vite build` OOM-stalls (`free -m` showed
   ~27MB free). A 2GB swapfile is configured persistently in `/etc/fstab`. If rebuilding on a fresh box:
   ```bash
   fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
   echo '/swapfile none swap sw 0 0' >> /etc/fstab
   ```

### Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `port is already allocated` | `-p 80:80` collides with Caddy | drop `-p`, use `--network web` |
| Caddy returns 502 | app down or off `web` net | `docker ps` (Up?), `docker inspect rarebird` (on web?) |
| `Restarting (1)` loop | bad `nginx.conf` | `docker logs rarebird` → fix config → rebuild |
| `vite build` hangs | OOM, no swap | add swap (see above) |
| stale config after edit | Docker layer cache | `docker build --no-cache -t rarebird .` |

---

# Svelte + Vite

This template should help get you started developing with Svelte in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

## Need an official Svelte framework?

Check out [SvelteKit](https://github.com/sveltejs/kit#readme), which is also powered by Vite. Deploy anywhere with its serverless-first approach and adapt to various platforms, with out of the box support for TypeScript, SCSS, and Less, and easily-added support for mdsvex, GraphQL, PostCSS, Tailwind CSS, and more.

## Technical considerations

**Why use this over SvelteKit?**

- It brings its own routing solution which might not be preferable for some users.
- It is first and foremost a framework that just happens to use Vite under the hood, not a Vite app.

This template contains as little as possible to get started with Vite + Svelte, while taking into account the developer experience with regards to HMR and intellisense. It demonstrates capabilities on par with the other `create-vite` templates and is a good starting point for beginners dipping their toes into a Vite + Svelte project.

Should you later need the extended capabilities and extensibility provided by SvelteKit, the template has been structured similarly to SvelteKit so that it is easy to migrate.

**Why include `.vscode/extensions.json`?**

Other templates indirectly recommend extensions via the README, but this file allows VS Code to prompt the user to install the recommended extension upon opening the project.

**Why enable `checkJs` in the JS template?**

It is likely that most cases of changing variable types in runtime are likely to be accidental, rather than deliberate. This provides advanced typechecking out of the box. Should you like to take advantage of the dynamically-typed nature of JavaScript, it is trivial to change the configuration.

**Why is HMR not preserving my local component state?**

HMR state preservation comes with a number of gotchas! It has been disabled by default in both `svelte-hmr` and `@sveltejs/vite-plugin-svelte` due to its often surprising behavior. You can read the details [here](https://github.com/sveltejs/svelte-hmr/tree/master/packages/svelte-hmr#preservation-of-local-state).

If you have state that's important to retain within a component, consider creating an external store which would not be replaced by HMR.

```js
// store.js
// An extremely simple external store
import { writable } from 'svelte/store'
export default writable(0)
```
