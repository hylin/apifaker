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
  models = require('../lib/models'),
  async = require('async'),
  db = require('../lib/database');

/**
 * Simulator list page
 */
router.route('/simulators/:apiId')
  .get(function (req, res) {
    var apiId = req.params.apiId;
    async.auto({
      getSimulators: function(callback){
        db.simulators.find({apiId: apiId}, function(err, docs){
          if(err){
            callback(err);
            return;
          }
          callback(null, docs);
        });
      },
      getApiInfo: function(callback){
        db.apiList.findOne({_id: apiId}, function(err, doc){
          if(err){
            callback(err);
            return;
          }
          callback(null, doc);
        });
      }
    }, function(err,results){
      if(err){
        console.log(err);
        res.render('message',{msg: req.t('tips.errorOccurred')+": "+err.toString()});
        return;
      }
      res.render('simulators', {apiInfo: results.getApiInfo, simulators: results.getSimulators});
    });

  });

/**
 * add simulator page
 */
router.route('/simulator/add/:apiId')
  .get(function (req, res) {
    var apiId = req.params.apiId;
    async.auto({
      getApiInfo: function(callback, results){
        db.apiList.findOne({_id: apiId}, function(err, doc){
          if(err){
            callback(err);
            return;
          }
          callback(null, doc);
        });
      }
    }, function(err,results){
      if(err){
        console.log(err);
        res.render('message',{msg: req.t('tips.errorOccurred')+": "+err.toString()});
        return;
      }
      res.render('simulator', {
        apiInfo: results.getApiInfo,
        simulator: models.simulatorModel,//add form page don't have actual simulator
        apiId: apiId,
        simulatorId: ''
      });
    });
  })
  .post(function(req, res){
    //all data is in data field,like api
    var data = req.body.data;
    try{
      data = JSON.parse(data);
    }catch (e){
      console.log(e);
      res.json({retcode:-1,retmsg:req.t('tips.jsonFormatErr')});
      return;
    }
    data.createTime = new Date();
    data.updateTime = new Date();
    db.simulators.insert(data, function(err, doc){
      if(err){
        console.log(err);
        res.json({retcode:-1,retmsg:req.t('tips.saveFailed')});
        return;
      }
      res.json({retcode:0,retmsg:req.t('tips.saveSuccess')});
    });
  });

/**
 * edit simulator page
 */
router.route('/simulator/edit/:id')
  .get(function (req, res) {
    var id = req.params.id;
    async.auto({
      getSimulator: function(callback, results){
        db.simulators.findOne({_id: id}, function(err, doc){
          if(err){
            callback(err);
            return;
          }
          callback(null, doc);
        });
      },
      getApiInfo: ['getSimulator', function(callback, results){
        if(!results.getSimulator){
          res.render('message',{msg: req.t('tips.noData')});
          return;
        }
        db.apiList.findOne({_id: results.getSimulator.apiId}, function(err, doc){
          if(err){
            callback(err);
            return;
          }
          callback(null, doc);
        });
      }]
    }, function(err,results){
      if(err){
        console.log(err);
        res.render('message',{msg: req.t('tips.errorOccurred')+": "+err.toString()});
        return;
      }
      res.render('simulator', {
        apiInfo: results.getApiInfo,
        simulator: results.getSimulator,
        apiId: results.getApiInfo._id,
        simulatorId: id
      });
    });
  })
  .post(function(req, res){
    var data = req.body.data;
    try{
      data = JSON.parse(data);
    }catch (e){
      console.log(e);
      res.json({retcode:-1,retmsg:req.t('tips.jsonFormatErr')});
      return;
    }
    data.updateTime = new Date();
    db.simulators.update({_id: data._id}, data, {}, function(err, doc){
      if(err){
        console.log(err);
        res.json({retcode:-1,retmsg:req.t('tips.saveFailed')});
        return;
      }
      res.json({retcode:0,retmsg:req.t('tips.saveSuccess')});
    });
  });

/**
 * delete simulator by id
 */
router.route('/simulator/delete/:id')
  .get(function (req, res) {
    var id = req.params.id;
    db.simulators.remove({_id: id}, {}, function(err, doc){
      if(err){
        console.log(err);
        res.json({retcode:-1,retmsg:req.t('tips.dbError')});
        return;
      }
      res.json({retcode:0,retmsg:req.t('tips.deleteSuccess')});
    });
  });

/**
 * copy simulator by id
 */
router.route('/simulator/copy/:id')
  .get(function (req, res) {
    var id = req.params.id;
    db.simulators.findOne({_id: id}, function(err, doc){
      if(err){
        console.log(err);
        res.json({retcode:-1,retmsg:req.t('tips.dbError')});
        return;
      }
      doc.mark = doc.mark+' '+req.t('copy');
      doc.updateTime = new Date();
      doc._id = null;
      delete doc._id;
      db.simulators.insert(doc, function(err, doc){
        if(err){
          console.log(err);
          res.json({retcode:-1,retmsg:req.t('tips.saveFailed')});
          return;
        }
        res.json({retcode:0,retmsg:req.t('tips.saveSuccess')});
      });
    });
  });

module.exports = router;