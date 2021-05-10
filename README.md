# Simulation Factory Express

## Getting started

### Windows

Install NodeJS from the official website https://nodejs.org/en/download/
Note: 
Elastic beanstalk runs node version 12, so if you can figure out how to install that version, go ahead. If you can't figure that out, simply install the latest version and don't use any features that require a version greater than 12

### Linux
Figure it out for yourself, big shot

### After installing node
 - Clone the project
 - `cd /path/to/cloned/project`
 - `npm install`
 - You should be ready to begin developing

### Setting up a MongoDB Atlas account
 - Go to official website at https://www.mongodb.com/cloud/atlas
 - Sign in using credentials (where will you get these?)
 - Click invite to project
 - Enter your email and click send
 - Create your account
 - Sign in with your new account
 - Click "Database Access" on the left side
 - Click "Add new Database User" on the right side
 - Enter a username and password, and add the "Atlas Admin" role
 - Download mongodb compass https://www.mongodb.com/products/compass
 - Copy the following string (without the quotes) "mongodb+srv://username:password@cluster0.hgu8w.mongodb.net/test?authSource=admin&replicaSet=atlas-djy90i-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"
 - Paste into compass
 - Put your username and password into the appropriate places in the pasted string
 - Click connect

### Setting up an AWS IAM account
 - Go to https://aws.amazon.com/
 - Click "log in to console" at the top right
 - Log in as a root user (where will you get credentials?)
 - Search for IAM
 - Create an IAM user for yourself, following these instructions: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html

## Run
Execute `npm start` from the command line

## Test
Execute `npm test` from the command line
Note that error messages will correspond to automatically generated test files in the 'lib' directory

## Deploy
To deploy on AWS, first make sure you have used git to commit your most recent changes.
Then, execute `npm run zip`. This script generates a zipfile named `factory-express.zip` in the root folder of the project.
Login to aws, navigate to the Simulationfactory elastic beanstalk environment, and upload this zipfile.
On windows, you will need to install a zip program for this to work. I use [gow](https://github.com/bmatzelle/gow)
