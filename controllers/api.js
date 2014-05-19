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
 * Manage api base info
 */

/**
 * Home page, will show api list.Also,it handle search action.
 */
router.get('/', function (req, res) {
  var query = {},
    project = req.query.project || '',
    keyword = req.query.keyword || '';
  if(project){
    query.project = project;
  }
  if(keyword){
    query.name = {$regex: new RegExp(keyword,'ig')};
  }
  query.deleted = false;
  db.apiList.find(query).sort({updateTime: -1}).exec(function(err,docs){
    res.render('api-list', {list: docs || [], project: project, keyword: keyword});
  });
});

/**
 * Add api page
 */
router.route('/apis/add')
  .get(function (req, res) {
    //fill with empty ApiInfo object
    res.render('api', {apiInfo: models.apiInfoModel});
  })
  .post(function (req, res) {
    //all data is in data field
    var data = req.body.data;
    //validate data
    try{
      data = JSON.parse(data);
    }catch (e){
      console.log(e);
      res.json({retcode:-1,retmsg:req.t('tips.jsonFormatErr')});
      return;
    }
    data.createTime = new Date();
    data.updateTime = new Date();
    data.deleted = false;
    db.apiList.insert(data, function(err, doc){
      if(err){
        console.log(err);
        res.json({retcode:-1,retmsg:req.t('tips.saveFailed')});
        return;
      }
      res.json({retcode:0,retmsg:req.t('tips.saveSuccess')});
    });
  });

/**
 * Edit api page
 */
router.route('/apis/edit/:id')
  .get(function (req, res) {
    var id = req.params.id;
    db.apiList.findOne({_id: id,deleted: false}, function(err, doc){
      if(err){
        console.log(err);
        res.json({retcode:-1,retmsg:req.t('tips.dbError')});
        return;
      }
      if(!doc){
        res.render('message', {message: req.t('tips.noData')})
      }
      res.render('api', {apiInfo: doc});
    });
  })
  .post(function (req, res) {
    var data = req.body.data;
    try{
      data = JSON.parse(data);
    }catch (e){
      console.log(e);
      res.json({retcode:-1,retmsg:req.t('tips.jsonFormatErr')});
      return;
    }
    async.auto({
      getOld: function(callback){
        db.apiList.findOne({_id: data._id}, function(err, doc){
          if(err){
            callback(err,null);
            return;
          }
          callback(null, doc);
        });
      },
      backup: ["getOld", function(callback, results){
        var old = results.getOld;
        old.apiId = old._id;
        delete old._id;
        db.apiHistory.insert(old, callback);
      }],
      update: ["backup", function(callback, results){
        //We lost createTime?Yes,I don't care it now.:)
        data.updateTime = new Date();
        data.deleted = false;
        db.apiList.update({_id: data._id}, data, {}, callback);
      }]
    }, function(err, results){
      if(err){
        console.log(err);
        res.json({retcode:-1,retmsg:req.t('tips.saveFailed')});
        return;
      }
      res.json({retcode:0,retmsg:req.t('tips.updateSuccess')});
    });

  });

/**
 * View api page
 */
router.route('/apis/view/:id')
  .get(function (req, res) {
    var id = req.params.id;
    db.apiList.findOne({_id: id,deleted:false}, function(err, doc){
      if(err){
        console.log(err);
        res.json({retcode:-1,retmsg:req.t('tips.dbError')});
        return;
      }
      res.render('view', {apiInfo: doc});
    });
  });

/**
 * Delete api by id
 */
router.route('/apis/delete/:id')
  .get(function (req, res) {
    var id = req.params.id;
    //We do not physically delete api data,but mark it as deleted=true
    db.apiList.update({_id: id}, {$set: { "deleted": true}}, {}, function(err, doc){
      if(err){
        console.log(err);
        res.json({retcode:-1,retmsg:req.t('tips.dbError')});
        return;
      }
      res.json({retcode:0,retmsg:req.t('tips.deleteSuccess')});
    });
  });

module.exports = router;