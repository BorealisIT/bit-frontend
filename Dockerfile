FROM masterbranch/nodejs6

# Set in what directory commands will run
WORKDIR /home/app
 
# Put all our code inside that directory that lives in the container
ADD . /home/app
RUN     rm -rf node_modules
RUN     npm install 
RUN     npm install -g bower
RUN     npm install -g grunt-cli
RUN     bower install --allow-root
EXPOSE  5000
RUN grunt build
CMD ["npm", "start"]