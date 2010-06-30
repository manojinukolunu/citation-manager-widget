/*
 * Licensed to the Sakai Foundation (SF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The SF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
*/

/*global $, Config, sdata */

var sakai = sakai || {};

/**
 * Initialize the citationmanager widget
 * @param {String} tuid Unique id of the widget
 * @param {Boolean} showSettings Show the settings of the widget or not
 */
 sakai.citationmanager = function(tuid,showSettings){
 var rootel = $("#" + tuid);
 var asd1="#button1";
   sakai.config.URL.CITATION_PROXY = "/var/proxy/citationmanager/connotea.json";
	var doInit=function(){
	$("#button1").click(function(){
	
	$.ajax({
            cache: false,
            url: sakai.config.URL.CITATION_PROXY,
            success: function(data){
				
                parseXml(data);
				//alert("hello");
            },
            error: function(xhr, textStatus, thrownError) {
               alert("asd2");
            },
            data : {
    ":basic-user" : $("#uname").val(),
    ":basic-password" : $("#pass").val()
  }
        });
	
    

});
function parseXml(xml)
{
  //find every Tutorial and print the author
  $(xml).find("Response").each(function()
  {
      $("#cite5").append($(this).find("message").text() + "<br />");
  });

  // Output:
  // The Reddest
  // The Hairiest
  // The Tallest
  // The Fattest
}
		 
	
	 
	 

 };
 doInit();
 };
sakai.api.Widgets.widgetLoader.informOnLoad("citationmanager");

