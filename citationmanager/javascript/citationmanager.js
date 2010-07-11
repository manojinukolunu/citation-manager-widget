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
   sakai.config.URL.CITATION_PROXYY="/var/proxy/citationmanager/connotea_import.json";
	var doInit=function(){
		$("#comments").click(function(){
	$("#comments_show").toggle('slow');
});
		$("#comments_show").hide();
		$("#fetch_data").hide();
		$("#connotea_fetch_data").hide();
		$("#connotea_import").hide();
		$("#import_connotea").click(function(){
			$("#connotea_import").toggle('slow');
			$("#connotea_fetch_data").toggle('slow');
			
		});
		
		//load the citation's of a user
		$("#fetch_references").click(function(){
		sakai.api.Server.loadJSON("/_user" + sakai.data.me.profile.path + "/public/citationdata",alert("data loaded"));	
		});
		$("#citation_manager_link_2").click(function(){
			
			$("#add_reference").removeClass('refclass');
			
		});
		//addprivate data 
	$("#addprivate").click(function(){
	var data2 =  { "UR" :$("#uname").val(), 
                                      "T1"  : $("#pass").val(),
                                      "TY"  : $("#typeofref").val()
									  }
	sakai.api.Server.saveJSON("/_user" + sakai.data.me.profile.path + "/private/citationdata", data2, alert("data uploaded"));								  
	});
	 // End Employees
	 //Add User's citation's to public or private
	$("#addpublic").click(function(){
	
	var data1 =  { "UR" :$("#uname").val(), 
                                      "T1"  : $("#pass").val(),
                                      "TY"  : $("#typeofref").val()
									  }                                
                  
                
	sakai.api.Server.saveJSON("/_user" + sakai.data.me.profile.path + "/public/citationdata", data1, alert("data uploaded"));
	//sakai.api.Server.loadJSON("/_user" + sakai.data.me.profile.path + "/public/citationdata",alert("data loaded"));
	});
	
	//Authenticate a user against connotea database
	$("#addprivate").click(function(){
          $.ajax({
            cache: false,
			
            url: sakai.config.URL.CITATION_PROXY,
            success: function(data){
			
				
                parseXml(data);
				//alert("hello");
				
            },
            error: function(xhr, textStatus, thrownError) {
               alert("Sorry could'nt make the required request "+sakai.data);
            },
            data : {
    ":basic-user" : $("#uname").val(),
    ":basic-password" : $("#pass").val()
  }
        });
	
    });
	//Import bookmarks of a user after authenticating
	$("#importbookmarks").click(function(){
          $.ajax({
            cache: false,
			
            url: sakai.config.URL.CITATION_PROXYY,
            success: function(data){
			
				
                parseimportedXml(data);
				//alert("hello");
				
            },
            error: function(xhr, textStatus, thrownError) {
               alert("Sorry could'nt make the required request "+sakai.data.me.profile.path);
            },
            data : {
    "user" : $("#uname1").val()
  }
        });
	
    });
	$("#citation_manager_link_2").click()(function(){
			$("#citation_share").hide();
		
	});


function alert1(data1)
{
alert("data Successufully uploaded");
}
function alert2()
{
alert("data succssufully loaded");
}
//Parse XML from connotea response
function parseXml(xml)
{

  $(xml).find("Response").each(function()
  {
      $("#cite").append($(this).find("code").text() + "<br />").val()
	 
	  
	  //$("#cite6").html(sakai.data.me.profile.path);
  });


}
//parse the imported XML
function parseimportedXml(xml)
{

  $(xml).find("Post").each(function()
  {
      $("#cite").append($(this).find("title").text() + "<br />");
	  //$("#cite6").html(sakai.data.me.profile.path);
  });


}
$("#comments").click(function(){
	$("#comments_show").show('slow');
});

		 };
 doInit();
 };
//sakai.api.Widgets.widgetLoader.insertWidgets(tuid);
sakai.api.Widgets.widgetLoader.informOnLoad("citationmanager");

