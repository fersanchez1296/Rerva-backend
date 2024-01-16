# Use an official Node.js runtime as a parent image
FROM node:18.18.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the local app files to the container's working directory
COPY . .

# Expose the port your app runs on
EXPOSE 4000

# Define the command to run your app
CMD ["node", "src/index.js"]

