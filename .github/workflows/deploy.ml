name: CI/CD

# When the workflow will run, in this case
# on push or pull request to the master branch
on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

# Jobs are a sequence of steps
jobs:
  # This workflow has only one Job, build
  build:
    # The type of container the workflow will run on 
    runs-on: ubuntu-latest

    # The sequence of steps for this job
    steps:
    # Checks-out your repository so your job can access it
    - uses: actions/checkout@v2

    # First install dependencies for the front end and then 
    # for the cloud function. If you only have frontend remove the lines 
    # from after "npm run build" till the next step i.e. "Firebase Deploy"
    - name: Build
      run: |
        cd client
        npm i
        npm run build

    # Install firebase tools and deploy to firebase
    # using the token we created earlier
    - name: Firebase Deploy
      run: |
        sudo npm install -g firebase-tools
        firebase deploy --token ${{ secrets.FIREBASE_TOKEN }}
