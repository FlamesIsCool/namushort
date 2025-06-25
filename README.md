# Namus URL Shortener

This is a very small URL shortener written in Node.js using only built-in modules. It stores short URLs in a local `urls.json` file. The project includes a sleek black-and-white page with a grid background, glass blur effects, a cursor-following dot and Buy Me A Coffee button.

## Running locally

```bash
node index.js
```

The application will start on port 3000 (or the `PORT` environment variable). Visit `http://localhost:3000` to use it.

## Deploying to Render.com

1. Create a new **Web Service** on Render and link this repository.
2. Set the **Start Command** to:

```
node index.js
```

3. Use the default `build` command (none is required since there are no dependencies).
4. Render will expose the service on its own URL. Any links shortened there will work using that domain (e.g. `https://your-service.onrender.com/abc123`).

Note that this implementation stores data in a local file. On Render, the filesystem is ephemeral, so the stored links may reset whenever the service is rebuilt or restarted. For a production system, you would use a database.
