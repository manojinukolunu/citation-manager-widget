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
sakai.citationmanager = function(tuid,showSettings)
{
	var citation_info;//json object that holds the citationdata
	var rootel = $("#" + tuid);
	var count1;
	sakai.config.URL.CITATION_PROXY = "/var/proxy/citationmanager/connotea.json";//connotea Authenticate proxy
	sakai.config.URL.CITATION_PROXYY="/var/proxy/citationmanager/connotea_import.json";//connotea fetch_bookmarks proxy

/**
* hide Some html elements initally on loading
*/   
	function hidediv()
    	{
   	    	$("#comments_show").hide();
			$("add_references").hide();
			$("#fetch_data").hide();
			$("#connotea_fetch_data").hide();
			$("#connotea_import").hide();
			$("#addnotetextarea").hide();
			$("#search_refs").hide();
			
    	}
	
	/**
	 * show the connotea_import div where the user can enter username and password for authentication
	 */

	function connotea_import()
    	{
   	    	$("#import_connotea").click(function()
			{
				$("#connotea_import").toggle('slow');
				$("#connotea_fetch_data").toggle('slow');
			});
    	}
   

/**
 * fetch the references of a user 
 * @param {Object} ref_type will be either public or private
 */
	function fetch_references(ref_type)
    {
   	    if (ref_type=="private")
	    {
			$("#cite").show();
		   	sakai.api.Server.loadJSON("/_user" + "/a/ad/admin" + "/private/citationdata",function(success,data)
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
			else if (ref_type=="public")
			{
				$("#cite").show();
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
						//$("#cite").append("UR " + citation_info[key].UR + "<br/>TY " + citation_info[key].TY + "<br/>" + "N1 " + citation_info[key].N1 + "<br/>TL " + citation_info[key].TL +"<br/>AU " + citation_info[key].AU + "<br/>ER"+"<br/><br/>");
					}
				}
				renderReferences(citation_info,key1,count1);
				//$("#cite").append("UR " + citation_info[key_value].UR + "<br/>TY " + citation_info[key_value].TY + "<br/>" + "N1 " + citation_info[key_value].N1 + "<br/>TL " + citation_info[key_value].TL +"<br/>AU " + citation_info[key_value].AU + "<br/>ER"+"<br/>");
			}
			else {
				alert("sorry request failed please try again later");
			}
		});	
			}
}
/**
 * Add to Private Path 
 */
	function addPrivate()
	{
		$("#addprivate").click(function()
		{
			var count_private=0;//holds the number of public citations returned
	     	//alert($("#uname").val());
		 	sakai.api.Server.loadJSON("/_user" +sakai.data.me.profile.path+"/private/citationdata",function(success,data){
				
		 	if (success) 
			{
				citation_info = data;
				for (var key in citation_info) 
				{
					if (citation_info.hasOwnProperty(key)) 
					{
						count_private++;//
						//alert(count2);
					}
				}
			}
			else 
			{
				var data_private =  
				[{
					"UR" :$("#url").val(),
					"AU":$("#author").val(),
					"TL":$("#title").val(),
					"TY":$("#typeofref").val(),
					"N1":$("#addnotetextarea").val(),
					"KW":$("input.tag").val()
		
				}]
				var r=confirm("Are you sure you want to add data for the firsttime");
				if (r) {
					sakai.api.Server.saveJSON("/_user" + sakai.data.me.profile.path + "/private/citationdata", data_private, alert("data uploaded"));
					//alert("asd");
				}
				else
				{
					alert("please try again");
				}
			}
			var data_private_final =  
			{
			"UR" :$("#url").val(),
			"AU":$("#author").val(),
			"TL":$("#title").val(),
			"TY":$("#typeofref").val(),
			"N1":$("#addnotetextarea").val(),
			"KW":$("input.tag").val()
		
			}
			
            //alert(count2);
		citation_info[count_private]=data_private_final;//add to the end of the json array
		sakai.api.Server.saveJSON("/_user" + sakai.data.me.profile.path + "/private/citationdata", citation_info, alert("data uploaded"));
		 });
		  //sakai.api.Server.loadJSON("/_user" + sakai.data.me.profile.path + "/public/citationdata",alert("data loaded"));
	});
      
	}
	
	
	
	
  /**
   * Add citationns the public path in /_user
   */ 
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
				var data2 =  
				[{
					"UR" :$("#url").val(),
					"AU":$("#author").val(),
					"TL":$("#title").val(),
					"TY":$("#typeofref").val(),
					"N1":$("#addnotetextarea").val(),
					"KW":$("input.tag").val()
		
				}]
				var r=confirm("Are you sure you want to add data for the firsttime");
				if (r) {
					sakai.api.Server.saveJSON("/_user" + sakai.data.me.profile.path + "/public/citationdata", data2, alert("data uploaded"));
					alert("asd");
				}
				else
				{
					alert("please try again");
				}
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
		sakai.api.Server.saveJSON("/_user" + sakai.data.me.profile.path + "/public/citationdata", citation_info, alert("data uploaded"));
		 });
		  //sakai.api.Server.loadJSON("/_user" + sakai.data.me.profile.path + "/public/citationdata",alert("data loaded"));
	});
	}
/**
 * Authenticate against Connotea database.Function is not complete.
 */	
	
	function authenticate_connotea()
	{
		  $("#authenticate").click(function(){
          	$.ajax({
            	cache: false,
			
           	 	url: sakai.config.URL.CITATION_PROXY,
            	success: function(data)
				{
					parseXml(data);
				//alert("hello");
				
            	},
            	error: function(xhr, textStatus, thrownError) {
               alert("Sorry could'nt make the required request "+sakai.data);
            	},
            	data : 
				{
                	":basic-user" : $("#uname2").val(),
                    ":basic-password" : $("#pass2").val()
  				}
        });
	
    });
	}

	/**Import data from connotea after authentication.This is not complete too.
	 * 
	 */
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
	
	
	
	
	/** Render the references of a user
	 * 
	 * @param {Object} data The data from loadJSON
	 * @param {Object} key_value Current reference being fetched
	 * @param {Object} count1 Total number of references the user has
	 */
	
	function renderReferences(data,key_value,count1)
	{
		//alert(count1);
		citation_info=data;
		//var key_value1=key_value;
		//alert(key_value);
		if (key_value == 0) {
			$("#cite").html("UR " + citation_info[key_value].UR + "<br/>TY " + citation_info[key_value].TY + "<br/>" + "N1 " + citation_info[key_value].N1 + "<br/>TL " + citation_info[key_value].TL +"<br/>AU " + citation_info[key_value].AU + "<br/>ER"+"<br/><div aligh='right'><select id='options'><option>ELEC</option></select></div>");
		}
		else 
		{
			//alert(key_value)
			$("#cite").html("UR " + citation_info[key_value].UR + "<br/>TY " + citation_info[key_value].TY + "<br/>" + "N1 " + citation_info[key_value].N1 + "<br/>TL " + citation_info[key_value].TL +"<br/>AU " + citation_info[key_value].AU + "<br/>ER"+"<br/><a href=javascript:; id='next'>Next</a>&#160;&#160;<a href=javascript:; id='previous'>Previous</a>&#160;&#160;<a href=javascript:; id='comment'>Comment</a>&#160;<textarea size=100% id='comments'></textarea><button class='s3d-button s3d-button-primary' id='add_comment'><span class='s3d-button-inner'>Add Comment</span></button>&#160;&#160;<a href=javascript:; id='delete'>Delete Citation</a>");
		}
		key_value++;
		if (key_value <= count1) {
			$("#delete").click(function()
			{
				sakai.api.Server.removeJSON("/_user/"+sakai.data.me.profile.path+"/public/citationdata["+key_value+"]" ,alert("success"));
			});
			$("#previous").click(function(){
				//alert("hello");
				//alert(key_value1);
				//var key_value1=key_value--;
				//alert(key_value);
				renderReferences(citation_info,key_value-2,count1);
				//alert(key_value1);
				
			});
			$("#next").click(function(){
				renderReferences(citation_info, key_value, count1);
				
			});
			
		}
		
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
	/**Save the comment to the Repository Need to discuss with Amyas as to how I should go about implementing this.
	 * 
	 * @param {Object} data The comment from the user
	 */
	function addComment(data)
	{
		sakai.api.Server.saveJSON("/_user"+sakai.data.me.profile.path+"/public/citation_comments",data,alert("data loaded"));
	}
	
	
	/**
	 * Init function is called when user clicks Add
	 */
	function init()
	{
		$("#fetch_data_from_anotheruser").hide();
		$("#citation_manager_link_5").click(function()
		{
			$("#cite").hide();
		}
		);
		$("#citation_manager_link_2").click(function()
		{
			$("#add_references").toggle('slow');
			$("#search_refs").hide();
		});
		$("#citation_manager_link_3").click(function()
		{
			showSettings = true;
            $("#add_references").hide();
            //$deliciousContainerSettings.show();
			$("#search_refs").show();
		});
		$("#citation_manager_link_4").click(function()
		{
			$("#fetch_data_from_anotheruser").toggle();
		});
	}
	
	/**
	 * Fetch citations from another user
	 */
	function fetch()
	{
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
	}
	
	
	
	
	
	
	
	
	
	
	
	/**
	 * The main function
	 */
	
	
	var doInit=function()
	{
		
		init();
		$("#username").html(sakai.data.me.profile.path);//used for testing purposes
		
		
		//Fetch citation's from another user by  username
		fetch();
		
		
		
		
		var count=0;
		//Add notes collapsible element
		$("#addnote").click(function(){
			$("#addnotetextarea").toggle();
		});
		
		//Add tags
		$("#collapsetagdiv").click(function(){
		
			$("#tagsdiv").toggle('slow');
		});
		
		
		//Add tags
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

/**
 * Callback after saveJSON
 */
function alert1()
{
    alert("data Successufully uploaded");
}
/**
 * Callback after loadJSON
 */
function alert2()
{
    alert("data succssufully loaded");
}

/**Parse XML from connotea response During Authentication
 * 
 * @param {Object} xml The response is contained in this
 *///
function parseXml(xml)
{

     $(xml).find("Response").each(function()
     {
          $("#cite").append($(this).find("code").text() + "<br />").val()
	 
	  
	      //$("#cite6").html(sakai.data.me.profile.path);
     });


}
/**Parse the imported XML after authentication from connotea
 * 
 * @param {Object} xml The response is contained in this 
 */
//
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

