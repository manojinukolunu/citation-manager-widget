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
var count1;
sakai.config.URL.CITATION_PROXY = "/var/proxy/citationmanager/connotea.json";//connotea Authenticate proxy
sakai.config.URL.CITATION_PROXYY="/var/proxy/citationmanager/connotea_import.json";//connotea fetch_bookmarks proxy

   
   //hide Some html elements initally on loading
   
function hidediv()
    {
   	    $("#comments_show").hide();
		$("add_references").hide();
		$("#fetch_data").hide();
		$("#connotea_fetch_data").hide();
		$("#connotea_import").hide();
		$("#addnotetextarea").hide();
    }
	//show the connotea_import div where the user can enter username and password for authentication
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
				//alert(success);
				citation_info=data;
				alert($(citation_info).length);
				//eval(citation_info);
				for (var key in citation_info) 
				{
  				    if (citation_info.hasOwnProperty(key)) 
					{
    				    $("#cite").append( citation_info[key].TY+ "<br />"+citation_info[key].T1+"<br />"+citation_info[key].UR+"<br />"+citation_info[key].KW);
  					}
				}

				
			}
			else
			{
				alert("sorry request failed please try again");
			}
		});	
			}
			else if (ref_type=="public")
			{
					sakai.api.Server.loadJSON("/_user" + "/a/ad/admin" + "/public/citationdata",function(success,data)
		    {
			if (success) 
			{
				citation_info = data;
				var key1=0;
				count1=0;
				for (key in citation_info)
				{
					if (citation_info.hasOwnProperty(key))
					{
						count1++;
					}
				}
				renderReferences(citation_info,key1,count1);
			}
			else {
				alert("sorry request failed please try again later");
			}
		});	
			}
}
function addPrivate()
{
        $("#addprivate").click(function()
		{
			var count_private=0;
	     	//alert($("#uname").val());
		 	sakai.api.Server.loadJSON("/_user" +sakai.data.me.profile.path+"/private/citationdata",function(success,data){
		 	if (success) 
			{
				citation_info = data;
				for (var key in citation_info) 
				{
					if (citation_info.hasOwnProperty(key)) 
					{
						count_private++;//holds the number of arrayelements in private citations returned.
						//alert(count2);
					}
				}
			}
			else 
			{
				alert("Sorry request failed");
			}
			//data1 holds the citation data to be added.
			var data1 =  
			{
				"UR" :$("#uname").val(),
				"AU":$("#author").val(),
				"TL":$("#title").val(),
				"TY":$("#typeofref").val(),
				"N1":$("#addnotetextarea").val(),
				"KW":$("#tags").val()
		
			}
             //alert(count2);
			citation_info[count_private]=data1;//add at the end of the json array
			sakai.api.Server.saveJSON("/_user" + sakai.data.me.profile.path + "/private/citationdata", citation_info, alert("data uploaded"));
		 });
		 //sakai.api.Server.loadJSON("/_user" + sakai.data.me.profile.path + "/public/citationdata",alert("data loaded"));
	});
	}
   //Add citationns the public path in /_user
function addPublic()
	{
        $("#addpublic").click(function()
		{
			var count2=0;//holds the number of public citations returned
	     	//alert($("#uname").val());
		 	sakai.api.Server.loadJSON("/_user" +sakai.data.me.profile.path+"/public/citationdata",function(success,data){
		 	if (success) 
			{
				citation_info = data;
				for (var key in citation_info) 
				{
					if (citation_info.hasOwnProperty(key)) 
					{
						count2++;//
						//alert(count2);
					}
				}
			}
			else 
			{
				alert("asd");
			}
			var data1 =  
			{
			"UR" :$("#url").val(),
			"AU":$("#author").val(),
			"TL":$("#title").val(),
			"TY":$("#typeofref").val(),
			"N1":$("#addnotetextarea").val(),
			"KW":$("input.tag").val()
		
			}
            //alert(count2);
		citation_info[count2]=data1;//add to the end of the json array
		sakai.api.Server.saveJSON("/_user" + sakai.data.me.profile.path + "/public/citationdata.json", citation_info, alert("data uploaded"));
		 });
		  //sakai.api.Server.loadJSON("/_user" + sakai.data.me.profile.path + "/public/citationdata",alert("data loaded"));
	});
	}
	
	//Authenticate against Connotea database.Function is not complete.
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
                        ":basic-user" : $("#uname2").val(),
                        ":basic-password" : $("#pass2").val()
  }
        });
	
    });
}

	//Import data from connotea after authentication.This is not complete too.
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
            data : 
			{
    			"user" : $("#uname1").val()
  			}
        });
	
    });
	}
	
	
	
	
	
	
	function renderReferences(data,key_value,count1)
	{
		
		$("#cite").html("TY "+citation_info[key_value].TY+"<br/>TL "+citation_info[key_value].TL+"<br/>"+"N1 "+citation_info[key_value].N1+"<br/>AU"+citation_info[key_value].AU+"<br/><a href=javascript:; id='next'>Next</a>&#160;&#160;<a href=javascript:; id='comment'>Comment</a>&#160;<textarea size=100% id='comments'></textarea><button class='s3d-button s3d-button-primary' id='add_comment'><span class='s3d-button-inner'>Add Comment</span></button>");
		key_value++;
		if(key_value < count1)
		$("#next").click(function()
		{
			renderReferences(citation_info,key_value,count1);
			
		});
		
		$("#add_comment").click(function()
		{
			sakai.api.Server.loadJSON("/_user" +sakai.data.me.profile.path+"/public/citation_comments",function(success, data){
				if (success) {
					var count5=0;
					citation_info = data;
					//alert("asd");
					for (var key in citation_info) {
						if (citation_info.hasOwnProperty(key)) {
							count5++;//
						//alert(count2);
						}
					}alert(count5);
					alert(key_value);
				}
				
				else {
					alert("asd");
				}
				var comments_data =
				[
				{
					asd:
					{
						"user":"as",
						"comment":$("#comments").val()
					}
				}
				]
				

			citation_info[key_value]=comments_data;
			addComment(citation_info[key_value]);
			}
			)
			
            //alert(count2);
		//add to the end of the json array
			
			});
		
		
	}
	function addComment(data)
	{
		sakai.api.Server.saveJSON("/_user"+sakai.data.me.profile.path+"/public/citation_comments",data,alert("data loaded"));
	}
	
	//The main function 

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	var doInit=function(){
		$("#citation_manager_link_2").click(function()
		{
			$("#add_references").toggle('slow');
		});
		$("#username").html(sakai.data.me.profile.path);
		
		
		//Fetch citation's from another user by  username
		$("#fetch_citations_from").click(function()
		{
			var userStr=$("#fetch_citations_username").val();
			//alert(userStr);
			var username="/"+userStr.charAt(0)+"/"+userStr.substr(0,2)+"/"+userStr;
			alert(username);			
			sakai.api.Server.loadJSON("/_user"+username+"/public/citationdata",function(success,data)
			{
				//alert(success);
				if (success)
				{
					citation_info=data;
					//alert("asd");
				//alert($(citation_info).length);
				for (var key in citation_info) 
				{
  					if (citation_info.hasOwnProperty(key)) 
					{
  						var count1=0;
						count1++;
						$("#fetched_citations").append( "TY:"+citation_info[key].TY+ "<br />"+"TL:"+citation_info[key].TL+"<br />"+"N1:"+citation_info[key].N1+"<br />"+"AU:"+citation_info[key].AU+"<br />ER<br><br />");
  					}
  //alert(count1);
				}
				}
				else
				{
					alert("sorry "+ userStr+" has no public citations");
				}
			});
		});
		
		
		
		
		var count=0;
		//Add notes collapsible element
		$("#addnote").click(function(){
			$("#addnotetextarea").toggle();
		});
		
		
		$("#collapsetagdiv").click(function(){
		
			$("#tagsdiv").toggle('slow');
		});
		
		
		
		$("#tags").click(function(){
			$("#tag").append("Tag "+count+"<input type=\"text\" class='tag'><br /><br> ");
			count++;
			//alert($("#tag0").val());
		});
		
		//showcomments();
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
		$("#citation_manager_link_2").click(function()
		{
			$("#add_reference").removeClass('refclass');
			
		});
		//addprivate data 
		addPrivate();
	
	 // End Employees
	 //Add User's citation's to public 
		addPublic();
	
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


};


 doInit();

};
//sakai.api.Widgets.widgetLoader.insertWidgets(tuid);
sakai.api.Widgets.widgetLoader.informOnLoad("citationmanager");

