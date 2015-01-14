Packer
=========

### Develope tools introduction

#### frontend
* Google's [AngularJS][1] used as framework.
* use [Grunt][2] as task runner for code building, developement and testing.
* use [Yeoman][3] as scaffolding tool.
* use [Bower][4] to manage js libraries and framework(dependences).
* twitter's framework [Bootstrap][9] is used.
* [SASS][10] instead of CSS.

#### backend
* [node.js][5] + [express][6] as a RESTful server.
* [nodemon][7] is used to avoid restart every code changing.
* [Mongodb][8] as our NoSQL database.


### How to recover from git clone
* First of all
  ```
  $ sudo npm install -g grunt-cli
  $ #sudo npm install -g express-generator
  $ sudo npm install -g bower
  $ sudo npm install -g nodemon
  $ sudo apt-get install ruby ruby-dev 
  $ sudo gem install compass
  $ sudo gem install sass
  ```
* `$ cd packer/client/`
  `$ bower install`
  `$ grunt --force`
* if anything goes wrong. Add `~/bin` into PATH by absolute path
* `$ cd packer/server/`
* `$ npm install`
* `$ npm start` this should work. Now you get a website service at port 3000.

[1]: https://angularjs.org/ AngularJS
[2]: http://gruntjs.com/ Grunt
[3]: http://yeoman.io/ Yeoman
[4]: http://bower.io/ Bower
[5]: http://nodejs.org/ Node.js
[6]: http://expressjs.com/ Express
[7]: http://nodemon.io/ nodemon
[8]: http://www.mongodb.org/ Mongodb
[9]: http://getbootstrap.com/ Bootstrap
[10]: http://sass-lang.com/ SASS
