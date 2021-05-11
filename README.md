# My Movies

## Functionalities

My Movies is a website which is all about movies. It fetches data from external API and renders it in a very stylish and attractive UI. It has following functionalities
1. Website shows popular movies of different genres
2. Website also shows various details of a movie along with its poster and trailer/teaser
3. User can sign up/sign in to the website
4. User can mark any movie as favourite
5. User can rate and review any movie

## Tech Stack

Following technologies are used while making this project
1. Front End: HTML, EJS, CSS, JS, JQuery
2. Back End: NodeJS. Express, Passport
3. Database: MongoDB
4. Testing: Jest
5. Documentation: Overleaf (LaTeX)

## Dependencies

This project has following dependencies
1. Various Node packages managed by NPM
2. The Movie DB API as external API to fetch movie data
3. Cloudinary for cloud storage of Video assets
4. MongoDB Atlas to host database
5. Heroku for FREE hosting 

## Website Link

The website is hosted at https://my-movies-420.herokuapp.com/. However, due to basic Free package of hosting and large amount of data handled by website, the hosted site is slower than usual. For better experience, hosting package can be upgraded or user can set up environment and run it locally.

## Important Project files and Folder Structure

1. Documentation: Contains files related to documentation including Software Requirement Specifications, Software Design Documents and User Manual.
2. config: Contains files related to Authentications
3. models: Database Schema related files
4. routes: NodeJS files containing routes to various pages of the website
5. storage: Store the data which is rendered on website
6. tests: All testing files
7. views: All Front End files
8. server.js: NodeJS file for main server

## Setting Up Environment on local machine

Follow these steps to set up the project
1. You should have NodeJS installed in your local machine. If you don't have NodeJS then you can install NodeJS from https://nodejs.org/en/
2. You should have installed git and configured it. If you haven't then you can install git from https://git-scm.com/. After downloading, you can follow steps given at https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup to configure Git
3. You should have preferably installed an IDE to see/edit the code. We recommend to use VS Code ( Download link: https://code.visualstudio.com/ )
4. On the main page of this repository, click on the button "Code" and copy the link
5. Choose or make a new folder in your local machine where you want to clone this repository
6. Open terminal and go to the path where you want to clone this repo. If you are using VS Code then you can directly open terminal in VS Code.
7. Type "git init" (without quotes)
8. Type "git clone <paste the copied link here>" (without quotes and angular brackets)
9. The repository will be cloned into your local machine. Then you can type "cd My-Movies" (without quotes) to navigate to the cloned repository.
10. This project requires 2 files which are not uploaded on this repository namely node_modules and keys2.js without which the project can not run locally.
11. Type "npm install" (without quotes) in terminal and node_modules will be qutomatically downloaded 
12. For keys2.js, you can request the same by mailing to teammahismati@gmail.com and any one of the four contributors will(may) respond back. However, it will be solely contributor's choice to give keys2.js file. However, you can make your own keys2.js file which contains database details. You have to keep the file at the level of server.js in folder hierarchy.
13. Now, after doing all above steps, type "node server" (without quotes) in terminal. If everything is set up correctly then server will start and you can access the website at localhost:5000 in your browser.
14. If you change any file in the project then you should restart the server by pressing Ctrl + C to terminate the process and then you have to follow step-13 to restart the server with the changes you have done
15. If you don't want to restart server everytime when you make a change then you can type "nodemon server" (without quotes) in terminal instead of "node server". Everytime you make changes to EJS/CSS/JS files the server will restart automatically

## Contributions

Want to edit the site you just published? Let’s practice commits by introducing yourself in your `index.html` file. Don’t worry about getting it right the first time—you can always build on your introduction later.

Let’s start with this template:

```
<p>Hello World! I’m [username]. This is my website!</p>
```

To add your introduction, copy our template and click the edit pencil icon at the top right hand corner of the `index.html` file.

<img width="997" alt="edit-this-file" src="https://user-images.githubusercontent.com/18093541/63131820-0794d880-bf8d-11e9-8b3d-c096355e9389.png">


Delete this placeholder line:

```
<p>Welcome to your first GitHub Pages website!</p>
```

Then, paste the template to line 15 and fill in the blanks.

<img width="1032" alt="edit-githuboctocat-index" src="https://user-images.githubusercontent.com/18093541/63132339-c3a2d300-bf8e-11e9-8222-59c2702f6c42.png">


When you’re done, scroll down to the `Commit changes` section near the bottom of the edit page. Add a short message explaining your change, like "Add my introduction", then click `Commit changes`.


<img width="1030" alt="add-my-username" src="https://user-images.githubusercontent.com/18093541/63131801-efbd5480-bf8c-11e9-9806-89273f027d16.png">

Once you click `Commit changes`, your changes will automatically be published on your GitHub Pages website. Refresh the page to see your new changes live in action.

:tada: You just made your first commit! :tada:

## Extra Credit: Keep on building!

Change the placeholder Octocat gif on your GitHub Pages website by [creating your own personal Octocat emoji](https://myoctocat.com/build-your-octocat/) or [choose a different Octocat gif from our logo library here](https://octodex.github.com/). Add that image to line 12 of your `index.html` file, in place of the `<img src=` link.

Want to add even more code and fun styles to your GitHub Pages website? [Follow these instructions](https://github.com/github/personal-website) to build a fully-fledged static website.

![octocat](./images/create-octocat.png)

## Everything you need to know about GitHub

Getting started is the hardest part. If there’s anything you’d like to know as you get started with GitHub, try searching [GitHub Help](https://help.github.com). Our documentation has tutorials on everything from changing your repository settings to configuring GitHub from your command line.
