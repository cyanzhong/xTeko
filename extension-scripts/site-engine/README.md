# siteEngine

A web server for serving websites locally, no network connect is needed.

# How It Works

By default, there are 10 websites included, you can take them as examples.

You have the following ways for deploying a new website:

- Compress the website as a zip file, upload it using web server
- Compress the website as a zip file, import it using Files app
- AirDrop the website folder to `sites` directory
- Create website folder directly in file explorer

# Index File

By default, the default index file is `index.html`, you can change it in settings.

siteEngine searches index file in the following order:

- Default file
- index.html
- index.htm
- Any *.html or *.htm in the root folder

An exception is raised if nothing is found.

# Custom Handlers

You can create custom handlers, it can intercept requests and provide custom response.

There's an example in `handlers.js`, take a look if you are interested.

Related docs: https://docs.xteko.com/#/en/network/server

# Disclaimer

Many examples are taken from https://js13kgames.com, some of them are MIT license, while some are missing a license. If you do not agree your program to be an example of siteEngine, please reach 0x00eeee@gmail.com out for your claim, I will remove them as soon as I can.