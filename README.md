# ncis-bot-messenger

Ce bot messenger envoie une règle de gibbs (de la série NCIS) lorsque l'on envoie "gibbs" à la page Facebook reliée.

### Installation sur Heroku

#### Install Heroku

```$ sudo add-apt-repository "deb https://cli-assets.heroku.com/branches/stable/apt ./"```
```$ curl -L https://cli-assets.heroku.com/apt/release.key | sudo apt-key add -```
```$ sudo apt-get update```
```$ sudo apt-get install heroku```

#### Verify your installation

```$ heroku --version```
```heroku-cli/5.6.10-249d061 (linux-386) go1.7.4```

```$ node --version```
```v5.0.0```

```$ sudo npm install npm -g```

#### Clone this repo
```git clone https://github.com/scraly/ncis-bot-messenger.git```

#### Facebook Page
Le bot messenger doit être relié à une page Facebook donc :
1. Go to https://developers.facebook.com/apps pour créer votre application Facebook
2. Activer messenger
3. Webhooks
4. Relier l'app à la page et générer un token
5. Remplacer le token dans index.js

#### Commit and Push to heroku instance
```$ git add .```
```$ git commit -m "init"```
```$ heroku create```
```$ git push heroku master```

#### Relier le bot à la page

```$ curl -X POST "https://graph.facebook.com/v2.7/me/subscribed_apps?access_token=<PAGE_ACCESS_TOKEN>"


