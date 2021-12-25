## Usage

To use this project make sure you have [Docker](https://www.docker.com/get-started) installed then run the following command on your terminal:

```bash
docker-compose up
```

And go to [http://localhost:8080]()

## Tutorial

All code from this tutorial as a complete package is available in [this repository](https://github.com/alexeagleson/docker-node-postgres-template).  If you find this tutorial helpful, please share it with your friends and colleagues!

For more tutorials like this, follow me <a href="https://twitter.com/eagleson_alex?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-show-count="false">@eagleson_alex</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> on Twitter

A video version is also available:

{% youtube https://youtu.be/Te41e4urFO0 %}

For more tutorials like this, follow me <a href="https://twitter.com/eagleson_alex?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-show-count="false">@eagleson_alex</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> on Twitter

A video version of this tutorial is also available:

{% youtube Te41e4urFO0 %}

## Table of Contents

1. [Introduction](#introduction)
1. [What is Docker?](#what-is-docker)
1. [Prerequisites](#prerequisites)
1. [Installing Docker](#installing-docker)
1. [Creating a Container](#creating-a-container)
1. [Creating a Node App](#creating-a-node-app)
1. [Deprecating the Node App](#deprecating-the-node-app)
1. [Creating a Dockerfile](#creating-a-dockerfile)
1. [Docker Layers and Cache](#docker-layers-and-cache)
1. [Adding a Docker Volume](#add-a-docker-volume)
1. [What is Docker-Compose?](#what-is-docker-compose)
1. [Adding a Database](#add-a-database)
1. [Connecting the App to the Database](#connecting-the-app-to-the-database)
1. [Adding a Frontend](#add-a-frontend)
1. [Creating a Docker Compose YML File](#creating-a-docker-compose-yml-file)
1. [Adding a pgAdmin Panel (Bonus)](#add-a-pgadmin-panel-bonus)
1. [Useful Docker Commands](#useful-docker-commands)
1. [Wrapping Up](#wrapping-up)

## Introduction

In this tutorial you will learn what Docker is and what purpose it serves by building a fullstack Node.js app complete with frontend and PostgreSQL database.  

We will use Docker Compose to connect and network each container together so that they are easy to share among project contributors, and deploy to whatever hosting service you've chosen.

### What is Docker?

[Docker](https://docs.docker.com/get-started/overview/) is a tool that allows you package the environment for running your application along with the application itself.  You can accomplish this as simply as including a single file called `Dockerfile` with your project.

It uses a concept it calls _containers_ which are lighter weight (require less resources) than full on virtual machines to create the environment for your application.  These containers are designed to be extremely _portable_ which means that you can quickly deploy them anywhere, and also scale up your app quickly by simply deploying more copies of your container.  

All you need to do is define the requirements for your environment in the `Dockerfile` (for example Ubuntu 18, Node.js, etc) and every time your container is started on any machine, it will recreate exactly that environment. So you already know in advance that you will not have any issue with missing dependencies or incorrect versions.

That said, it can be challenging to really demonstrate the need for Docker to those new to the development world who haven't yet experienced a lot of the problems that it solves.  

This tutorial aims to simulate a a couple of realistic scenarios you might encounter in a work environment, and show how Docker helps to solve those issues.

### The Scenario

There are two common development issues we will be replicating with this example:

- Your company's project relies on an older version of a tool (in our case [Node.js](https://nodejs.org/en/)) than the development team has installed on their machine

- We want to make it easy to test the application with a copy of the database on the developers' local machine, without requiring them to install the database software (in our case PostgreSQL)

If you follow this tutorial you will have a working application running on your machine and querying a Postgres DB without the need to have either Node.js or Postgres installed.  The only tool you will need is Docker.  

## Prerequisites

The only prerequisite software required to have installed for this tutorial is an IDE (code editor, I use VS Code) and Docker.  

How you install Docker will depend on the operating system you are running.  I am running it on [WSL2](https://docs.microsoft.com/en-us/windows/wsl/install-manual#step-2---check-requirements-for-running-wsl-2) on Windows 11 which is a fantastic experience.  It works just as well on Mac and Linux, you simply need to [follow the installation instructions for your OS](https://www.docker.com/get-started).

I recommend Docker Desktop which will give you a nice GUI for working with Docker, however it is not required.  For this tutorial will will be managing Docker entirely through the command line (though I may use Docker Desktop for screenshots to show what is happening).

I also suggest having [Node.js](https://nodejs.org/en/) installed as well.  Technically you _can_ get away without it, but in the first couple of steps we're going to run the app locally before we get Docker involved.  It will also help demonstrate how Docker fixes our versioning issue.  

## Installing Docker

Once you have Docker installed let's make sure that it works.  When you type:

```bash
docker --version
```

You should get a version number (as opposed to "not found").  My version right now shows 20.10.11, but any version close to that number should work fine.  

Most containers are hosted on a service called [Docker Hub](https://hub.docker.com/), including the ones we will be using.  

Let's begin by testing the simplest container called `hello-world`.  

## Creating a Container

Run the following command to download the `hello-world` image:

```bash
docker pull hello-world
```

That will pull the _image_ from Docker hub.  Important to get the terminology correct, we haven't created a _container_ yet.  A Docker image is a _set of instructions for how to create a container_.  If you are familiar with web development, think of the image like HTML (blueprints) and the container like the DOM (the structure).  

You can add additional instructions to the default image instructions in your `Dockerfile` which we will get to soon.

Presuming you got a success message like `Status: Image is up to date for hello-world:latest`, you are ready to create a container.  

```bash
docker run hello-world
```

If successful, you will see this output in your terminal:

```
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

Congratulations!  You have run your first Docker container!  Although you can manage it very easily if you are using Docker Desktop, let's look at a couple of the most common commands to manage it on the command line:

```bash
docker image ls

# OR

docker container ls
```

Will show you a list of all the images or containers you have on your system at the moment.  Because `hello-world` stops as soon as it's finished printing the test message, it does not keep running forever like a container running a web app would.  You won't see it in your list of containers, but you will see it in your list of images.

Both the ID of the image/container and the name are important to be able to lookup because they allow you to refer to those images/containers to start/stop them.  

When you stop running a container it doesn't get deleted.  That is a good thing!  It means it's super fast to just start it up again the next time you need it without downloading and installing it again.  

While working with Docker you'll find that sometimes these images and containers begin to pile up when you change things or build new versions.  To quickly remove all old/unused ones you can run:

```bash
docker image prune

# OR

docker container prune
```

If these don't seem too helpful now, don't worry, but keep them in mind because you will likely want to refer back to them later.

## Creating a Node App

Before we get any further into Docker, let's build a small web app we can use to help demonstrate some of the more advanced features of Docker.  We're going to build a simple web server in Node.js and Express:

I've created a new empty directory called `docker-template` and initialized an NPM repo inside of it.  

```bash
mkdir docker-template
cd docker-template
npm init
npm install express
```

`server.js`
```js
const express = require("express");
const app = express();
const port = 8080;

app.get("/", async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(200);
  res.send("<h1>Hello world</h1>");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
```

Now run your app with:

```bash
node server.js
```

And go to [http://localhost:8080]() to see:

![Node Hello World](https://res.cloudinary.com/dqse2txyi/image/upload/v1640125011/blogs/docker-node/docker-hello-world_gdeltv.png)

One extra thing we would like to enable for this project is file watching and automatic reloading of the server whenever the file is changed.

The easiest way to do that is a tool called [nodemon](https://www.npmjs.com/package/nodemon).

```bash
npm install nodemon --save-dev
```

Then add a `start` script to your `package.json` file:

`package.json`
```json
{
  "name": "server",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "start": "nodemon server.js"
  },
  "author": "me",
  "license": "ISC",
  "dependencies": {
    "express": "^4.17.2",
  },
  "devDependencies": {
    "nodemon": "^2.0.15"
  }
}
```

Run your app with:

```bash
npm run start
```

Try editing your `server.js` file when your app is running (change "hello world" to "hello world!!!!" or something) and verify that your Node app reloads and you see the change in your browser when you hit the refresh button (the file watching won't trigger a browser refresh automatically).

Once that is working continue to the next step!

## Deprecating the Node App

This next part is kinda fun.  Let's intentionally turn this server into a legacy project.  

We'll be assuming you are running a recent version of Node (15 or later).  You can check by running:

```bash
node --version
```

My output is `v16.11.1`.  If yours is older than 15 you can either use [NVM](https://github.com/nvm-sh/nvm#installing-and-updating) or just read along.  Installing a specific Node version of your machine is not required for this part.  In fact it's exactly the problem we're going to solve with Docker in the next section.

In Node 15 there is a _breaking change_ in the way that [unhandled rejected promises](https://blog.logrocket.com/node-js-15-whats-new-and-how-the-developer-experience-has-improved/) are handled.  Before version 15 a Javascript promise that was rejected without a catch would give a warning and keep running, but after v15 of Node an unhandled promise will **crash the program**.

So it's possible for use to add some code that will make our server work on versions of Node older than 15, but _not work_ on new versions of Node.

Let's do that now:

`server.js`
```js
// @ts-check

const express = require("express");
const app = express();
const port = 8080;

app.get("/", async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(200);
  res.send("<h1>Hello world</h1>");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("good");
  }, 300);
  reject("bad");
});

myPromise.then(() => {
  console.log("this will never run");
});
```

The code above creates a new promise that always rejects.  It will run (with a warning) on Node.js v14, but will _crash_ on v15 and above.  Try running it yourself on v15 and above and you get `code: 'ERR_UNHANDLED_REJECTION'`.

Now obviously we could just... add a catch block (or remove the code entirely), but we are trying to replicate a scenario where you are working with an older codebase and you may not necessarily have those options available to you.  

Let's say for one reason or another this app _must_ be run on Node v14 or earlier to work.  Every developer on the team must be prepared to operate in that environment... but our company also has a new app that runs on Node v17!  So we need that environment available too.  

And while we're at it, some other tool on version X! I only have version Y on my machine!  Who knows what version the other members of my team are running.  Or the guy I send the app to for testing.  

What do I do!?

Enter Docker.

## Creating a Dockerfile

With Docker we can use code to generate the environment that our app runs in.  We'll begin by searching Docker hub for a Node.js image.  The official Node image is just called [node](https://hub.docker.com/_/node).

You'll notice when you look at supported tags there are a lot of versions.  Just like having a certain version on your machine, there's Docker images for pretty much every version you could want.  Of course Node itself needs to be installed on some kind of operating system so that's usually the other part of the tag.

The default Node image runs on [Debian](https://wiki.debian.org/DebianReleases), however one of the most popular versions runs on something called [Alpine Linux](https://alpinelinux.org/).

The main reason Alpine is popular is because of its small size, it's a distro of Linux designed to strip out all but the most necessary parts.  This means it will be faster and more cost effective to run and distribute our app on this image (assuming it meets our needs).

For our simple app, it does.

Remember we _specifically_ want an older version of Node (older than v15 so our app runs without crashing) so I am going to choose the image tagged `node:14-alpine3.12`.  That's Node v14 and Alpine v3.12.

We can pull the image in advance with `docker pull node:14-alpine3.12` just like we did with `hello-world`, but it's not necessary.  By adding it to our `Dockerfile` Docker will automatically pull it from Docker Hub if it doesn't find it on our machine.

Let's create a file called `Dockerfile` (no extension) in the root of our project next to `server.js`:

`Dockerfile`
```Dockerfile
# select your base image to start with
FROM node:14-alpine3.12

# Create app directory
# this is the location where you will be inside the container
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# copying packages first helps take advantage of docker layers
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# Make this port accessible from outside the container
# Necessary for your browser to send HTTP requests to your Node app
EXPOSE 8080

# Command to run when the container is ready
# Separate arguments as separate values in the array
CMD [ "npm", "run", "start"]
```

I've added a lot of comments to help explain each piece of the Dockerfile.  You can learn more about [Dockerfiles here](https://docs.docker.com/engine/reference/builder/), I would highly encourage you to skim through that page to get familiar with the commands that are available. 

Before we continue I would like to touch briefly on Docker's layers & cache because they are very important topics!

## Docker Layers and Cache

One common question for a simple Dockerfile like this is: 

> "Why are you using the COPY command twice?  Isn't the first COPY unnecessary since the second one copies the whole directory?"

The answer is actually "no" and the reason is because of one of Docker's best features called _layers_.  

Every time you use one of FROM, COPY, RUN, CMD it creates another image which is based off the previous layer.  That image can be cached and only needs to be created again if something changes.  

So by creating a specific COPY line on `package-*.json` we are creating a layer that is based off the content of that file before we run `npm install`.  That means that unless we _change_ `package.json`, the next time we build Docker will use the cache layer where `npm install` has already been run and we don't have to install all dependencies every time we run `docker build`.  That will save us an enormous amount of time.  

The next COPY looks at every file in our project directory, so that layer will be rebuilt on any file change (basically any time we update anything OTHER than `package.json` in our app).  But that's exactly what we want.  

This is just one example of efficiencies you can take advantage of when working with Docker, but I would encourage you to read the whole [list of best practices for Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/).

## Building the App Container

Now that your Dockerfile is created we have just one last thing we need to do before we build.

Similar to `.gitignore` that you're probably familiar with (used to prevent committing auto-generated files and private secrets to public repositories), Docker has a similar concept to keep you from unnecessarily copying files that your container doesn't need.

Let's create a `.dockerignore` file now:

`.dockerignore`
```
node_modules
npm-debug.log
```

Both of those will be generated inside the container, so we don't want to copy our local versions of them over.

At this point we are ready to build.  Run the following command:

```bash
docker build . -t my-node-app
```

That will build the _image_ describe by the Dockerfile in the current directory `.` and give it a name called `my-node-app`.  When it's done you can see the image and all its details with:

```bash
docker image ls
```

With the image created, we are now ready to build a _container_ off our image which will run our app:

```bash
docker run -p 3000:8080 --name my-node-app-container my-node-app
```

This command tells Docker to use our image to build a running container.  The `--name` flag lets us name the container (to make it easier to identify and stop/start later, otherwise the name will be randomly generated).

I used the name `my-node-app-container` to differentiate it from the last argument which is the name of the _image_ we are building from (`my-node-app`).  

We use the `-p` flag to bind ports from our host machine (our computer) environment to the container environment.  

If you recall we wrote `EXPOSE 8080` in our Dockerfile which is the port our app runs on.  The above command maps port 3000 on our machine to port 8080 in the container.

_(Note you can map the same port like 8080:8080 if you like, we just mixed it up in this example to show that it's possible)_

Double check that your container started successfully with:

```bash
docker container ls
```

My output looks like:

```
CONTAINER ID   IMAGE         COMMAND                  CREATED         STATUS         PORTS                    NAMES
b6523b2602e1   my-node-app   "docker-entrypoint.s…"   6 minutes ago   Up 6 minutes   0.0.0.0:3000->8080/tcp   my-node-app-container
```

_(Sorry if the words wrap and it make it difficult to line things up)_

We can see that the container is up for X minutes.  That means that our app is running on port 8080, we can access that port on our machine using port 3000 so open up your browser to [http://localhost:3000/]() to see:

![Docker Node Hello World](https://res.cloudinary.com/dqse2txyi/image/upload/v1640138143/blogs/docker-node/docker-hello-world-2_mq9fop.png)

Great!  You've created your first custom Docker image and container with your own app running in it!

So now that you have your environment setup, naturally one of the next things you might want to do is update your app.  If you make a change to `server.js` and save the file, are you going to see those changes when you reload the page?

No you won't.  The app is running based on a copy of `server.js` inside the container which has no direct relation to the one in your project directory.  Is there a way that we can "connect" them somehow?

Of course there is, we need to introduce Docker volumes.

## Adding a Docker Volume

Docker uses the concept of [volumes](https://docs.docker.com/storage/volumes/) to allow you to _persist_ data between running containers.  

You can imagine you might want to have your app save some data, but with the way Docker works your containers are designed to be destroyed and recreated casually.  

There are two primary ways to use volumes.  You can create one in advance and give it a _name_.  This will save all the volume data by default in the `/var/lib/docker/volumes` directory (in a Linux environment, it would be somewhere different but equivalent on Windows).  

To create a named volume (you don't need to run this command for this tutorial, it's simply an example):

```bash
docker volume create my-named-volume
```

Then you would map any directory in your container to that directory on your machine.  You can do so by adding the `--volume` flag to your `docker run` command like so: `--volume  my-named-volume:/usr/src/app my-node-app`.

That example would map the working directory in your container to the Docker volume on your machine.  This does not help us however because we want to synchronize a _specific_ directory (our project directory) with the one in the container so we can edit files in our project and have them update in the container.  

We can do this as well.

First we need to stop the existing container (which doesn't have a volume), remove it, and then run it again **with** the volume:

```bash
docker container stop my-node-app-container

docker container rm my-node-app-container

docker run -p 3000:8080 --name my-node-app-container --volume  ${PWD}:/usr/src/app my-node-app
```

In most terminals PWD means "print working directory" so it will map the current directory to the `/usr/src/app` directory inside your container.  This will accomplish our goal of syncing the files between our project on our computer and the one in our container.  

Since we have already set up file watching and reloading with `nodemon` earlier in the tutorial, you should now be able to edit `server.js` in your project directory while the container is running (just edit the hello world text), then refresh your browser to see the changes.

And that's it!  You now have a Dockerized Node app where you can make changes on your machine and see the updates happen live inside your container.  

At this point we have mostly completed our introduction to Docker itself.  We have completed our implementation of our first "scenario" where we use coded instructions to recreate the environment that our app requires in order to operate.

We now need to address our second common scenario: in order to function our application relies on other services, like a database for example.  We could technically add the instruction to install the database in our Dockerfile, but that would not realistically mimic the environment our app would be deployed in.  

It's not guaranteed that our Node app and our database would be hosted on the same server.  In fact it's probably not even likely.  Not only that, we don't want to have to boot up our web server to make edits to our database, and vice-versa.  Is there a way that we can still use Docker, but create a separation between multiple services that rely on each other?

Yes we can.

## What is Docker-Compose?

Best described in [their own words](https://docs.docker.com/compose/):

> Compose is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure your application’s services. Then, with a single command, you create and start all the services from your configuration.

The process is to define the instructions for each of your services with Dockerfiles, and then use Docker Compose to run all those containers together and facilitate network communications between them.

In this tutorial we are going to connect our Node app to a PostgreSQL database.  Before we can connect them of course we need to establish the database container.

## Adding a Database

Similar to Node, Docker Hub has a super simple easy to use image for [PostgreSQL](https://www.postgresql.org/).  Of course theres also images for MySQL, Mongo, Redis, etc, etc.  There's no reason you couldn't substitute your favourite out if you want (though if you're still new to Docker I'd suggest you stick with the tutorial for now).

We search Docker Hub for the official [postgres](https://hub.docker.com/_/postgres) image.  We don't need anything beyond the bare minimum so once again we'll choose the version running on Alpine.  Image `postgres:14.1-alpine`.

Unlike our Node image, we don't need to copy any files or run any installation scripts, so we don't actually need a Dockerfile for our PostgreSQL installation.  There are some configurations that we do need (like password and ports for example) but we can manage those with our upcoming `docker-compose.yml` file.

So aside from deciding which image you are going to use, there is really nothing else we need to do before we create our config file.  

## Connecting the App to the Database

Before we create the Docker Compose configure file to link the database container, we need to update our app to actually use it.  

Our goal here is going to be to create a database with some very simple data (like a list of employees), see it with some sample data, and then query that data with our Node app.  

We'll also create a simple frontend to display that data.

First we need to install the PostgreSQL NPM package:

```bash
npm install pg
```

Next we are going to create a `.sql` file that will automatically seed out database with some sample data to read from.  In the root of the project create the following file:

`database-seed.sql`
```sql
CREATE TABLE employees
(
    id SERIAL,
    name text,
    title text,
    CONSTRAINT employees_pkey PRIMARY KEY (id)
);

INSERT INTO employees(name, title) VALUES
 ('Meadow Crystalfreak ', 'Head of Operations'),
 ('Buddy-Ray Perceptor', 'DevRel'),
 ('Prince Flitterbell', 'Marketing Guru');
```

_(Note I got those ridiculous names from the [random name generator](https://www.behindthename.com/random/) on the "whimsical" setting)_

Next we update our Node server to query these values.  In addition to doing that, we are going to use `express.static` to serve up an entire directory rather than just sending HTML as sa string.  This will allow us to serve an HTML file along with some CSS and Javascript as well, to create a full-fledged frontend.  

Comments are added to explain all the new pieces:

`server.js`
```js
// Import the postgres client
const { Client } = require("pg");
const express = require("express");
const app = express();
const port = 8080;

// Connect to our postgres database
// These values like `root` and `postgres` will be
// defined in our `docker-compose-yml` file
const client = new Client({
  password: "root",
  user: "root",
  host: "postgres",
});


// Serves a folder called `public` that we will create
app.use(express.static("public"));

// When a GET request is made to /employees
// Our app will return an array with a list of all
// employees including name and title
// this data is defined in our `database-seed.sql` file
app.get("/employees", async (req, res) => {
  const results = await client
    .query("SELECT * FROM employees")
    .then((payload) => {
      return payload.rows;
    })
    .catch(() => {
      throw new Error("Query failed");
    });
  res.setHeader("Content-Type", "application/json");
  res.status(200);
  res.send(JSON.stringify(results));
});

// Our app must connect to the database before it starts, so
// we wrap this in an IIFE (Google it) so that we can wait
// asynchronously for the database connection to establish before listening
(async () => {
  await client.connect();

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
})();

const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("foo");
  }, 300);
  reject("oops");
});

myPromise.then(() => {
  console.log("hello");
});
```

In the above code update you can see that we are serving up a directory called `public` that we have not created yet.  That directory will contain an `index.html` file to act as the nice looking frontend for our app.

## Adding a Frontend

We'll begin by creating the `public` directory that is being served from our Node app:

```bash
mkdir public
```

Then add the following files:

`public/index.html`
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Docker Template</title>
    <script src="script.js"></script>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <template>
      <div class="card">
        <img src="https://res.cloudinary.com/dqse2txyi/image/upload/v1639943067/blogs/docker-node/profile-picture_eav2ff.png" alt="Avatar" width="240px" />
        <div class="container">
          <h4>Placeholder</h4>
          <p>Placeholder</p>
        </div>
      </div>
    </template>
  </body>
</html>
```

Our `index.html` file takes advantage of [HTML templates](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) for the employee cards.

`public/styles.css`
```css
body {
  padding: 12px;
  display: flex;
  flex-direction: row;
  column-gap: 24px;
}

.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 5px;
  transition: 0.3s;
}

.card:hover {
  transform: scale(1.03);
}

.container {
  padding: 0 12px;
}

img {
  border-radius: 5px 5px 0 0;
}
```

Above in `styles.css` is some simple CSS to give a clean look to the employee card templates, and flex them out in a row across the page.

`public/script.js`
```js
fetch("/employees")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((employee) => {
      // Select the <template> we created in index.html
      const cardTemplate = document.querySelector('template');

      // Clone a copy of the template we can insert in the DOM as a real visible node
      const card = cardTemplate.content.cloneNode(true);

      // Update the content of the cloned template with the employee data we queried from the backend
      card.querySelector('h4').innerText = employee.name;
      card.querySelector('p').innerText = employee.title;

      // Append the card as a child with the employee data to the <body> element on our page
      document.body.appendChild(card);
    });
  });
```

When our app is loaded it will load `script.js` which will use the browser [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/fetch) to query the `/employees` route on our Node server and get the employee information from out PostgreSQL database.

Once it is returned it will iterate through each employee and clone the HTML template that we defined in `index.html` to make a custom employee card with that employee's `name` and `title`.  

Phew!  Now that we have our app established and ready to read from the database, we are finally ready to connect our Node container and our PostgreSQL container together with Docker Compose.

## Creating a Docker Compose YML File

For a brief intro to compose see [here](https://docs.docker.com/compose/),  and for more details than you can ever handle about the compose file spec see [here](https://github.com/compose-spec/compose-spec/blob/master/spec.md).

We're going to be creating a simple `docker-compose.yml` file to link our Node app with our PostgreSQL database.  Let's jump right in and create the file in our project root directory.  I'll use lots of comments to explain everything:

`docker-compose.yml`
```yml
version: '3.8'
services:
  # These are the configurations for our Node app
  # When Docker Compose starts this container it will automatically
  # use the Dockerfile in the directory to configure it
  app:
    build: .
    depends_on:
      # Our app does not work without our database
      # so this ensures our database is loaded first
      - postgres
    ports:
      - "8080:8080"
    volumes:
      # Maps our current project directory `.` to
      # our working directory in the container
      - ./:/usr/src/app/
      # node_modules workaround for volumes
      # https://stackoverflow.com/a/32785014
      - /usr/src/app/node_modules

  # This is the configuration for our PostgreSQL database container
  # Note the `postgres` name is important, in out Node app when we refer
  # to  `host: "postgres"` that value is mapped on the network to the 
  # address of this container.
  postgres:
    image: postgres:14.1-alpine
    restart: always
    environment:
      # You can set the value of environment variables
      # in your docker-compose.yml file
      # Our Node app will use these to connect
      # to the database
      - POSTGRES_USER=root
      - POSTGRES_PASSWORD=root
      - POSTGRES_DB=root
    ports:
      # Standard port for PostgreSQL databases
      - "5432:5432"
    volumes:
      # When the PostgreSQL container is started it will run any scripts
      # provided in the `docker-entrypoint-initdb.d` directory, this connects
      # our seed file to that directory so that it gets run
      - ./database-seed.sql:/docker-entrypoint-initdb.d/database-seed.sql
```

So with that `docker-compose.yml` file in place we are finally ready to run our new and highly improved application "suite" that includes a backend, frontend and database.

From the root directory of the project, all your have to do is type:

```bash
docker-compose up --build
```

_(Note the `--build` flag is used to force Docker to rebuild the images when you run `docker-compose up` to make sure you capture any new changes.  If you simply want to restart existing containers that haven't changed you can omit it)_

Once active you can finally test it out.  In our `docker-compose.yml` config we are mapping post 8080 directly to 8080 so go to [http://localhost:8080]() to see:

![Docker Postgres Fullstack Example](https://res.cloudinary.com/dqse2txyi/image/upload/v1640151166/blogs/docker-node/database-employees_lzojcm.png)

With a cute little hover transition and everything!  Congratulations!

If you are using the Docker Desktop GUI application you'll have a lot of options to stop all the containers at once, or view each one individually.  If you are using the command line you can stop both containers with this simple command (run from the project root directory for context):

```bash
docker-compose down
```

And there you have it, a fullstack Node.js application with its own SQL database bundled along with it.  You can now deploy this literally anywhere that has Docker installed and you know that it will work because you have defined all the parameters of the exact environment it needs to function.

## Adding a pgAdmin Panel (Bonus)

Here's a quick little bonus for those of you who are using PostgreSQL.  Adding the pgAdmin panel container to this app setup is a breeze.  Simply update your `docker-compose.yml` config to include the following:

`docker-compose.yml`
```yml
version: '3.8'
services:
    app:
        build: .
        depends_on:
            # Our app does not work without our database
            # so this ensures our database is loaded first
            - postgres
        ports:
            - "8080:8080"
        volumes:
            # Maps our current project directory `.` to
            # our working directory in the container
            - ./:/usr/src/app/

    # This is the configuration for our PostgreSQL database container
    # Note the `postgres` name is important, in out Node app when we refer
    # to  `host: "postgres"` that value is mapped on the network to the 
    # address of this container.
    postgres:
        image: postgres:14.1-alpine
        restart: always
        environment:
            # You can set the value of environment variables
            # in your docker-compose.yml file
            # Our Node app will use these to connect
            # to the database
            - POSTGRES_USER=root
            - POSTGRES_PASSWORD=root
            - POSTGRES_DB=root
        ports:
            # Standard port for PostgreSQL databases
            - "5432:5432"
        volumes:
            # When the PostgresSQL container is started it will run any scripts
            # provided in the `docker-entrypoint-initdb.d` directory, this connects
            # our seed file to that directory so that it gets run
            - ./database-seed.sql:/docker-entrypoint-initdb.d/database-seed.sql

    pgadmin-compose:
        image: dpage/pgadmin4
        environment:
            PGADMIN_DEFAULT_EMAIL: "placeholder@example.com"
            PGADMIN_DEFAULT_PASSWORD: "fakepassword123!"
        ports:
            - "16543:80"
        depends_on:
            - postgres
```

Notice the pgAdmin panel configuration added at the bottom.

When you run `docker-compose up --build` now and go to:

[http://localhost:16543/]()

You'll be greeted with the pgAdmin panel.  Enter the `PGADMIN_DEFAULT_EMAIL` and `PGADMIN_DEFAULT_PASSWORD` credentials from the `docker-compose.yml` file to access it.

Once inside click `Add New Server`.

For `General -> Name` pick a name.  Can be whatever you want.

On the `Connection` tab values must match the `docker-compose.yml` file:

* Host: `postgres`
* Username: `root`
* Password: `root`

Now you can navigate from the left bar:

`Servers -> whatever-you-want -> Databases -> root -> Schemas -> public -> Tables -> employees`

Right click `employees` an Query Tool:

```sql
SELECT * FROM employees;
```

To see your data.

![pgAdmin Employee Data](https://res.cloudinary.com/dqse2txyi/image/upload/v1640152679/blogs/docker-node/pg-admin_ozybu2.png)

## Useful Docker Commands

List all containers, images, volumes or networks, for example `docker image ls`.

```bash
docker {container}/{image}/{volume}/{network} ls
```

Remove a container, image, volume or network where ID is the id of the container/image/volume or network.

```bash
docker {container}/{image}/{volume}/{network} rm ID
```

Start a container in the background (as a daemon):

```bash
docker run -d IMAGE_ID
```

View logs of a container:

```bash
docker container logs CONTAINER_ID
```

View information about a container:

```bash
docker container inspect CONTAINER_ID
```

Open a shell inside an active container so you can run terminal commands inside of it.  

```bash
docker exec -it CONTAINER_ID /bin/sh
```

Stop a container:

```bash
docker container stop CONTAINER_ID
```

Remove all dangling/unused Docker data (cached layers, volumes no longer used, etc):

```bash
docker system prune
```

You can also use the above command with a specific type, like `docker container prune`.  

## Wrapping Up

I hope you learned a lot about why Docker is a fantastic tool in your toolbelt and how you can use it to reduce the amount of friction related to setting up development environments.  The days of fighting with WAMP and MAMP and XAMPP are thankfully long behind us (no slight against those apps, I know they're fantastic tools when configured properly).

Remember that Docker can be used both to create a baseline standard development environment on the machines of many different developers.  But it's not just a development tool, Docker can be used in production as well to simplify the process fo scaling your app up with increased traffic by simply deploying more containers.  

And there's plenty more to learn well beyond what's covered here, the [Docker docs](https://docs.docker.com/) are the best place to start.  All the best in your Docker journey.  

Please check some of my other learning tutorials.  Feel free to leave a comment or question and share with others if you find any of them helpful:

- [Introduction to Docker for Javascript Developers](https://dev.to/alexeagleson/docker-for-javascript-developers-41me)

- [Learnings from React Conf 2021](https://dev.to/alexeagleson/learnings-from-react-conf-2021-17lg)

- [How to Create a Dark Mode Component in React](https://dev.to/alexeagleson/how-to-create-a-dark-mode-component-in-react-3ibg)

- [How to Analyze and Improve your 'Create React App' Production Build ](https://dev.to/alexeagleson/how-to-analyze-and-improve-your-create-react-app-production-build-4f34)

- [How to Create and Publish a React Component Library](https://dev.to/alexeagleson/how-to-create-and-publish-a-react-component-library-2oe)

- [How to use IndexedDB to Store Local Data for your Web App ](https://dev.to/alexeagleson/how-to-use-indexeddb-to-store-data-for-your-web-application-in-the-browser-1o90)

- [Running a Local Web Server](https://dev.to/alexeagleson/understanding-the-modern-web-stack-running-a-local-web-server-4d8g)

- [ESLint](https://dev.to/alexeagleson/understanding-the-modern-web-stack-linters-eslint-59pm)

- [Prettier](https://dev.to/alexeagleson/understanding-the-modern-web-stack-prettier-214j)

- [Babel](https://dev.to/alexeagleson/building-a-modern-web-stack-babel-3hfp)

- [React & JSX](https://dev.to/alexeagleson/understanding-the-modern-web-stack-react-with-and-without-jsx-31c7)

- [Webpack: The Basics](https://dev.to/alexeagleson/understanding-the-modern-web-stack-webpack-part-1-2mn1)

- [Webpack: Loaders, Optimizations & Bundle Analysis](https://dev.to/alexeagleson/understanding-the-modern-web-stack-webpack-part-2-49bj)