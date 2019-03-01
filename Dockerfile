FROM node:carbon

# Add a nodejs/nodejs user
RUN groupadd -r nodejs && useradd -m -r -g nodejs nodejs
USER nodejs

# Create node directory
WORKDIR /home/nodejs

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

CMD [ "npm", "start" ]
