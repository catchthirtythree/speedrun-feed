# speedrun-feed

Create a feed of newly verified runs from speedrun.com. Allow a client to listen to the feed and use the data how it wishes (ie: send it to a discord webhook to create a feed for a specific game).

This project has two parts to it:

1. feed-server
2. feed-client

## feed-server

Feed-server is a simple server that polls speedrun.com's most recent runs and emits them through socket.io to subscribers listening on 'run' and 'game-run', with 'run' being a feed of all runs being verified and 'game-run' being a feed of a particular game's runs being verified.

## feed-client

Feed-client is a client subscribing to feed-server through socket.io listening to the information that they want. The client can either listen for all runs or emit a particular game's id and listen only for verified runs coming from that game.

# install

```javascript
npm install
npm run start-feed (in one console)
npm run start-client (in another console)
```

