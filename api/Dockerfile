########################################################
# Use NodeJS v8.11 Docker Image 
FROM node:8.11.3-alpine

########################################################
# Create a folder for the app source code
RUN mkdir -p /usr/src/app

########################################################
# Set the app source code folder as current directory
WORKDIR /usr/src/app

########################################################
# Start copying the source code
COPY . /usr/src/app
      
########################################################
# Complexity due to using Alpine (lightweight) Image:
#   > Package Bcrypt ("bcrypt": "^3.0.0") needs python
#     to be compiled, so we install it.
#   > Other build tools such as 'make' for other
#     packages.
RUN apk add --update python
RUN apk add --update build-base

########################################################
# Download and install dependencies
RUN npm install

########################################################
# Install Typescript
RUN npm install -g typescript

########################################################
# Compile the source code
RUN tsc

########################################################
# Define which port/s to expose
EXPOSE 3000 4000

########################################################
# Run the application on container start
CMD node dist/main.js
