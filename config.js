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
var config = {
  //server's run port
  port: 80,
  //once you have gaven a project key,then you should never change it,however value is editable.
  projects: {
    "p1": "Project1",
    "p2": "Project2",
    "p3": "Project3"
  },
  staticUrl: "http://apifaker.com/",
  siteUrl: "http://apifaker.com/",
  //use to auto return query's value
  returnPlaceholder: "$return$",
  //if we don't match any query,should we play as proxy server?
  //set true to enable,false to disable.
  //notice: you shouldn't enable this feature
  // when the domain of this query is actually host on this server
  proxy: true,

  enableEdit: true,

  //api info model
  apiInfoModel: {"project":"","developer":"","name":"","purpose":"","desc":"","host":"","path":"","urlAddon":"","type":["json","jsonp"],"httpType":["get","post"],"params":[{"name":"","desc":""}],"results":[{"name":"","type":"String","desc":""}],"demo":{"retcode":0,"retmsg":"success","data":[]},"isSimulate":true,"isProxy": true},

  // simulator model
  simulatorModel: {"apiId":"","mark":"","simParams":"","simResults":""}
};

module.exports = config;