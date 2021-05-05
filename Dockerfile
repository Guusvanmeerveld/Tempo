FROM ubuntu:18.04

# Install curl
RUN apt-get update && apt-get install -y curl

# Install Node and Yarn
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
    curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | tee /usr/share/keyrings/yarnkey.gpg >/dev/null && \
    echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | tee /etc/apt/sources.list.d/yarn.list

# Install Python and Node
RUN apt-get update && apt-get install -y --no-install-recommends \
    nodejs \
    yarn \
    python3.5 \
    python3-pip \
    && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set workdir
WORKDIR /app

# Copy files to workdir
COPY ["package.json", "yarn.lock*", "package-lock.json*", "tsconfig.json*", "npm-shrinkwrap.json*", "./"]
ADD src src

# Install dependecies
RUN yarn install

# Compile Typescript to Javascript
RUN yarn build

# Set node env to production
ENV NODE_ENV=production

CMD ["yarn", "start"]
