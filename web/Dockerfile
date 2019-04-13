########################################################
# Multi-stage Docker Build
# STAGE #1 - Build the website with Angular CLI

    ########################################################
    # Use NodeJS v8.11 Docker Image 
    FROM node:8.11.3-alpine as builder

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
    # Download and install dependencies
    RUN npm install

    ########################################################
    # Compile the source code
    RUN ./node_modules/@angular/cli/bin/ng build --prod --environment=prod --build-optimizer


########################################################
# Multi-stage Docker Build
# STAGE #2 - Setup NGINX and run the website

    ########################################################
    # Use NGINX v1.13.3 Docker Image 
    FROM nginx:1.13.3-alpine

    ########################################################
    # Copy the nginx configuration
    COPY nginx/default.conf /etc/nginx/conf.d/

    ########################################################
    # Remove the default NGINX welcome page
    RUN rm -rf /usr/share/nginx/html/*

    ########################################################
    # Copy the website we compiled from Stage #1 to NGINX
    COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

    ########################################################
    # Let NGINX run the website on container start
    CMD ["nginx", "-g", "daemon off;"]