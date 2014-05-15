/*!
 * ApiFaker is a simulator that help developers to improve efficiency in development,
 * especially for front-end engineers.
 * Lets define api and run it yourself.
 *
 * @license
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 * Copyright (c) 2014 ApiFaker, http://apifaker.com/
 *
 * @author  hylin, <admin@hylin.org>
 * @version 0.0.2
 * @date    2014-05-12
 */

/**
 * Module dependencies.
 */
var path = require('path'),
  express = require('express'),
  util = require('util'),
  utils = require('./lib/utils'),
  config = require('./config'),
  ejs = require('ejs'),
  i18n = require("i18next"),
  favicon = require('serve-favicon'),
  bodyParser = require('body-parser');

process.on('uncaughtException', function(err){
  if(err){
    console.log("Error Occurred: " + util.inspect(err));
  }
});

utils.extendEjs(ejs);

var app = express();

app.engine('.html', ejs.__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

i18n.init();

app.locals.config = require('./config');
app.locals.utils = utils;

app.use(i18n.handle);
app.use(favicon(__dirname + '/public/assets/images/favicon.ico'));
app.use(utils.sundry);
app.use(utils.rightsControl);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser());

app.use(config.managerPath, require('./controllers/api'));
app.use(config.managerPath, require('./controllers/simulator'));
app.use(require('./controllers/handler'));

app.listen(config.port, function(){
  console.log('Server started at '+config.port + ' ...');
});
