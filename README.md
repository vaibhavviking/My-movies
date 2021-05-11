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

COntributions will be encouraged. If you want to contribute then follow these steps:
1. Fork this repository and make a copy of your own or make a new branch on this repository
2. Follow the steps given in previous section to clone from forked repo/new branch and set up the project
3. Make changes to the project
4. Always remember to pull before you commit
5. Commit final changes to forked repository/new branch
6. Create a pull request and if contributors agree then your code will be merged with the main repository
7. You can refer https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors for more details regarding contributions

## Developers

This project is developed by
1. Komal Kumar (kkomalk)
2. Priyanshu Uttam (uttam509)
3. Purnadip Chakrabarti (ChakPC)
4. Vaibhav Chandra (vaibhavviking) (Owner of repo)

## Everything you need to know about GitHub

Getting started is the hardest part. If there’s anything you’d like to know as you get started with GitHub, try searching [GitHub Help](https://help.github.com). Our documentation has tutorials on everything from changing your repository settings to configuring GitHub from your command line.
