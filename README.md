# Simulation Factory Express

## Run
Execute `npm start` from the command line

## Test
Execute `npm test` from the command line
Note that error messages will correspond to automatically generated test files in the 'lib' directory

## Deploy
To deploy on AWS, first make sure you have used git to commit your most recent changes.
Then, execute `npm run zip`. This script generates a zipfile named `factory-express.zip` in the root folder of the project.
Login to aws, navigate to the Simulationfactory elastic beanstalk environment, and upload this zipfile.