# bracketeer

Bracketeer is a tool for keeping score at a ping pong (or any 1 v 1 game with points) league night. It is built with Sveltekit, and uses sqlite for persistence

## Demo
The app is up and running at [https://bracketeer.octopusovenmitt.com](https://bracketeer.octopusovenmitt.com)

## Features

- Real time score updates (using server sent events)
- QR code to invite other players
- Automatic ranking with tie-breaker explanations

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.


## Deploying

### Env vars
ORIGIN & PUBLIC_BASE_URL should both be set to the fully qualified url where the app will be accessed. 

DB_NAME should be the name of the sqlite database


### Proxy settings
If you're deploying behind a http server you may need to add special handling for the `/sse` route. This is the route used for real time updates via Server-Sent events. Example for nginx:
```
location /sse {
		proxy_pass http://127.0.0.1:[PORT];
		proxy_http_version 1.1;
		proxy_set_header Connection "";
	}
```