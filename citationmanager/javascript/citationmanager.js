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
 	var citation_info;//json object that holds the citationdata
	
 var rootel = $("#" + tuid);
 var asd1="#button1";
   sakai.config.URL.CITATION_PROXY = "/var/proxy/citationmanager/connotea.json";
   sakai.config.URL.CITATION_PROXYY="/var/proxy/citationmanager/connotea_import.json";
   
   
		//Show comments for citations
   function showcomments()
   {
   		$("#comments").click(function(){
		sakai.api.Server.loadJSON("/_user"
		+ sakai.data.me.profile.path + "/public/citationdata",function(success,data)
		{
			if (success)
			{
				
				citation_info=data;
				eval(citation_info);
				//alert(citation_info.UR);
				$("#comments_show").html("<br>COMMENTS :" +citation_info.COMMENT);
				//alert(citation_info);
				
				//alert("data loaded");
				
				
				
			}
			else
			{
				alert("sorry no data");
			}
		});
	$("#comments_show").toggle('slow');
});
   }
   
   //hide the comments div initially
   
   function hidediv()
   {
   	$("#comments_show").hide();
		$("#fetch_data").hide();
		$("#connotea_fetch_data").hide();
		$("#connotea_import").hide();
   }
   function connotea_import()
   {
   	$("#import_connotea").click(function(){
			$("#connotea_import").toggle('slow');
			$("#connotea_fetch_data").toggle('slow');
			
		});
   }
   
   //fetch the references of a user 
   //ref_type will be either public or private
   function fetch_references(ref_type)
   {
   		
			if (ref_type=="private")
			{
					sakai.api.Server.loadJSON("/_user" + sakai.data.me.profile.path + "/private/citationdata",function(success,data)
		{
			if (success)
			{
				
				citation_info=data;
				eval(citation_info);
				//alert(citation_info.UR);
				$("#cite").html("UR :" +citation_info.UR+"<br> T1 :" +citation_info.T1+"<br>TY :"+citation_info.TY);
				//alert(citation_info);
				
				//alert("data loaded");
				
				
				
			}
			else
			{
				alert("sorry no data");
			}
		});	
			}
			else if (ref_type=="public")
			{
					sakai.api.Server.loadJSON("/_user" + sakai.data.me.profile.path + "/public/citationdata",function(success,data)
		{
			if (success)
			{
				
				citation_info=data;
				eval(citation_info);
				//alert(citation_info.UR);
				$("#cite").html("UR :" +citation_info.UR+"<br> T1 :" +citation_info.T1+"<br>TY :"+citation_info.TY);
				//alert(citation_info);
				
				//alert("data loaded");
				
				
				
			}
			else
			{
				alert("sorry no data");
			}
		});	
			}
	
		  }
   function add_private()
   {
   	$("#addprivate").click(function(){
	var data2 =  { "UR" :$("#uname").val(), 
                                      "T1"  : $("#pass").val(),
                                      "TY"  : $("#typeofref").val()
									  }
	sakai.api.Server.saveJSON("/_user" + sakai.data.me.profile.path + "/private/citationdata", data2, alert("data uploaded"));								  
	});
   }
   
   function add_public()
	{
		$("#addpublic").click(function(){
	//alert($("#uname").val());
	
	var data1 =  { "UR" :$("#uname").val(), 
                                      "T1"  : $("#pass").val(),
                                      "TY"  : $("#typeofref").val(),
									  "COMMENT":$("#comment").val()
									  }                                
                  
                
	sakai.api.Server.saveJSON("/_user" + sakai.data.me.profile.path + "/public/citationdata", data1, alert(sakai.data.me.profile.path));
	//sakai.api.Server.loadJSON("/_user" + sakai.data.me.profile.path + "/public/citationdata",alert("data loaded"));
	});
	}
	function authenticate_connotea()
	{
		$("#authenticate").click(function(){
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
	}
	function import_connotea()
	{
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
	}
	var doInit=function(){
		
		
		showcomments();
		hidediv();
		
		
		//show the import connotea div on clicking
		connotea_import();
		
		//load the public citation's of a user
		$("#fetch_public_references").click(function(){
			fetch_references("public");
		});
		
		//load private citation's of a user
		$("#fetch_private_references").click(function(){
			fetch_references("private");
		});
		
		
		
		

		$("#citation_manager_link_2").click(function(){
			
			$("#add_reference").removeClass('refclass');
			
		});
		//addprivate data 
		add_private();
	
	 // End Employees
	 //Add User's citation's to public 
	add_public();
	
	//Authenticate a user against connotea database
	
	authenticate_connotea();
	
	//Import bookmarks of a user after authenticating
	import_connotea();
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

