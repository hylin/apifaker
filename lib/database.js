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
 * @version 0.0.1
 * @date    2014-05-11
 */

/**
 * database class
 */
  var Datastore = require('nedb');
  var db = {
    //store api base info
    apiList: new Datastore({ filename: './data/api-list.db', autoload: true }),
    //store api's simulator data
    simulators: new Datastore({ filename: './data/api-simulators.db', autoload: true }),
    //store api update history
    apiHistory: new Datastore({ filename: './data/api-history.db', autoload: true })
  };

  module.exports = db;