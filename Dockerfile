FROM python:3.7.4

WORKDIR /usr/src/app/lastfm_history
COPY ./app ./

RUN pip install -r requirements.txt

RUN apt update -y &&\
    curl -sL https://deb.nodesource.com/setup_14.x | bash - &&\
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - &&\
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list &&\
    apt update -y &&\
    apt install -y nodejs yarn

RUN yarn install && yarn build

RUN chmod +x /usr/src/app/lastfm_history/setup.sh

ENTRYPOINT [ "/bin/bash" ]
CMD [ "/usr/src/app/lastfm_history/setup.sh"]