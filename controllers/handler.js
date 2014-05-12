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
var router = require('express').Router(),
  config = require('../config'),
  async = require('async'),
  request = require('request'),
  util = require('util'),
  utils = require('../lib/utils'),
  db = require('../lib/database');

/**
 * After all,here is simulator's handler
 *
 * TODO:
 * 1.ugly implement,need refactoring.:(
 */
router.route('*')
  .all(function (req, res, next) {
    var protocol = req.protocol,
      host = protocol+ '://' +req.host,
      path = req.path,
      uri = req.protocol+'://'+req.host+req.originalUrl,
      query = req.query,
      body = req.body,//handle post data
      params = {};
    utils.extends(params, query);
    utils.extends(params, body);
    delete params[config.jsonpName];//delete callback function param

    async.auto({
      //first,we look up api by host and path.
      getByHostAndPath: function(callback){
        db.apiList.find({host: host,path: path}, function(err, docs){
          if(err){
            callback(err);
            return;
          }
          callback(null, docs);
        });
      },
      //then,we match query/body data
      getByParams: ['getByHostAndPath', function(callback, results){
        var docs = results.getByHostAndPath,
          matched = null;
        if(!docs || docs.length == 0){
          callback(null, null);
          return;
        }
        docs.forEach(function(v){
          if(!v){
            return;
          }

          var addons = utils.paramsToJson(v.urlAddon),
            counter = 0;
          for(var name in addons){
            for(var p in params){
              //only match it when name and value are equals
              if(params.hasOwnProperty(p) && p == name && query[p] == addons[name]){
                counter++;
              }
            }
          }
          //matched or failed
          if(counter == Object.keys(addons).length){
            matched = v;
            return;
          }
        });
        callback(null, matched);
      }],
      getSimulators: ['getByParams', function(callback, results){
        var doc = results.getByParams;
        if(!doc || !doc.isSimulate){
          console.log('Stop Simulate. Url: '+uri+'.form-data: '+ util.inspect(req.body));
          callback(null,null);
          return;
        }
        //if matched one ,let's get its simulators.
        db.simulators.find({apiId: doc._id}, function(err, docs){
          if(err){
            callback(err);
            return;
          }
          callback(null, docs);
        });
      }],
      matchSimulator: ['getSimulators', function(callback, results){
        var simulators = results.getSimulators,
          matched = null;
        if(!simulators || simulators.length == 0){
          callback(null, null);
          return;
        }
        //check each simulator
        simulators.forEach(function(v){
          var simParams = v.simParams,
            flag = false,
            counter = 0;
          for(var name in params){
            if(isMatchParam(simParams, name, params[name])){
              counter++;
            }
          }
          //if number of matched query params is equals simulator's setting number,we hit.
          if(counter == simParams.length){
            matched = v;
            return;
          }
        });
        callback(null, matched);
      }]
    }, function(err,results){
      if(err){
        console.log(err);
        res.render('message',{msg: req.t('tips.errorOccurred')+": "+err.toString()});
        return;
      }
      var matchedApi = results.getByParams;
      if(!results.matchSimulator){
        //simulator match failed,in next step,we'll play as a proxy server role.
        //if we matched a api and api's isProxy is false, we don't proxy query to actual server
        if(config.proxy && (!matchedApi || matchedApi.isProxy)) {
          var r = null;
          if (req.method === 'POST') {
            r = request.post({uri: uri, form: req.body});
          } else {
            r = request(uri);
          }
          console.log('In Proxy.Url: '+ uri +'; form-data: '+util.inspect(req.body));
          req.pipe(r).pipe(res);
        }else{
          console.log('Stop Proxy.Url: '+ uri +'; form-data: '+util.inspect(req.body));
          res.jsonp(null);
        }
      }else {
        processReturnHolder(results.matchSimulator.simResults, query);
        console.log('Simulator Matched. Url: '+ uri +'; form-data: '+util.inspect(req.body));
        res.jsonp(results.matchSimulator.simResults);
      }
    });

  });

/**
 * replace $return$ in simResults to the value of the same query param
 * @param results
 * @param query
 */
function processReturnHolder(results, query){
  for(var p in results){
    if(results.hasOwnProperty(p)){
      if(Object.prototype.toString.call(results[p]) === '[object Object]'){
        processReturnHolder(results[p], query);
      }
      if(Object.prototype.toString.call(results[p]) === '[object Array]'){
        results[p].forEach(function(v){
          if(Object.prototype.toString.call(v) === '[object Object]'){
            processReturnHolder(v, query);
          }
        });
      }
      if(results[p] === config.returnPlaceholder){
        results[p] = query[p] || null;
      }
    }
  }
}

/**
 * check if params has matched name and value
 * @param params
 * @param name
 * @param value
 * @returns {boolean}
 */
function isMatchParam(params, name, value){
  var flag = false;
  params.forEach(function(v){
    if(v.name == name && v.value == value){
      flag = true;
      return;
    }
  });
  return flag;
}

module.exports = router;