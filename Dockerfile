FROM python:3.7.4

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN apt update -y && \
    apt install -y git yarn && \
    git clone https://github.com/PhilippeMarcotte/lastfm_history.git

WORKDIR /usr/src/app/lastfm_history

RUN pip install -r requirements.txt

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - &&\
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - &&\
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list &&\
    apt update -y &&\
    apt install -y nodejs yarn

RUN yarn install && yarn build

ENTRYPOINT [ "sh" ]
CMD [ "setup.sh"]