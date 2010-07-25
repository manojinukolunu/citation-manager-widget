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
var sakai=sakai || {};

/**
 * Initialize the citaiton manager  widget
 * @param {Object} tuid
 * @param {Object} showSettings
 */
sakai.citationmanager=function(tuid,showSettings){
		///////////////////////////
		//Configuration Variables//
		//////////////////////////
	var citation_info;//Object That holds all the citatons of a user
	var count_private0;//holds the private citations count 
	var count_public=0;//holds the public citaitons count
	var parseCitations=[];//parse the returned citaitons from loadJSON
	var $citationManagerMainTemplate = "citationmanager_main_citations_template";
	var pageCurrent=0;
	var pageSize=5;
	var citationsArray=[];
	var count=1;
	var citaitons=[];//array that contains a users citaions this is basically a copy of paging array intended for deleting and adding comments
	sakai.config.URL.CONNOTEA_AUTHENTICATE_PROXY = "/var/proxy/citationmanager/connotea.json";//connotea Authenticate proxy
	sakai.config.URL.CONNOTEA_FETCH_PROXY="/var/proxy/citationmanager/connotea_import.json";//connotea fetch_bookmarks proxy
	//var asd=0;
	
	

	/**
	 * Parse the imported data from Connotea database to determine if the user's credentials are valid
	 * @param {Object} xml
	 */
	function parseXml(xml){

     $(xml).find("Response").each(function()
     {
          //$("#cite").append($(this).find("code").text() + "<br />").val()
	 
     });


	}
	
	/**
	 * Authenticates A user against the connotea database
	 */
	function authenticate_connotea(){
		  $("#connotea_authenticate").live("click",function(){
          	$.ajax({
            	cache: false,
			
           	 	url: sakai.config.URL.CONNOTEA_AUTHENTICATE_PROXY,
            	success: function(data)
				{
					parseResponse(data);
				
				
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
	/**
	 * Initializes the changed page
	 * @param {Object} clickedPage
	 */
	var doPaging = function(clickedPage) {

        // Adjust pageCurrent (pageCurrent is zero-based)
        pageCurrent = clickedPage - 1;

        renderCitations();
    };
	/**
	 * Paging function
	 * @param {Object} arraylength the number of objects in tha array
	 */
	 var renderPaging = function(arraylength) {
        $(".jq_pager1").pager({
            pagenumber: pageCurrent + 1,
            pagecount: Math.ceil(arraylength / pageSize),
            buttonClickCallback: doPaging
        });
    };
	/**
	 * Render the citations of a  user
	 */
	function renderCitations(){
		var parseCitationsArray=[];
		for (var b in parseCitations.all){
			if(parseCitations.all.hasOwnProperty(b)){
				parseCitationsArray.push(parseCitations.all[b]);
				}
			}
		citationsArray=parseCitationsArray;
		var pagingArray = {
            all: parseCitationsArray.slice(pageCurrent * pageSize, (pageCurrent * pageSize)+ pageSize )
        };
		$("#public_citations_view").html($.TemplateRenderer("citationmanager_main_citations_template",pagingArray));
		if (parseCitationsArray.length > pageSize) {
		    $("#citation_pager").show();
            renderPaging(parseCitationsArray.length);
        }
	}
	
	/**
	 * Show or hide the other properties of a citions
	 */
	var showHideCitationManagerBookmarkInfo = function() {
		$(".citationmanager_main_bookmark_info_link").die();

        $(".citationmanager_main_bookmark_info_link").live("click", function() {

            // Define unique info ID, based on link ID
            var elementID = '#' + $(this).attr("id") + '_info';
			

            // If visible: hide information and swap image
            if ($(this).hasClass("citationmanager_showArrowLeft"))
            {
                $(elementID).slideUp(150);
                $(this).removeClass("citationmanager_showArrowLeft");
            }
            // Else: show information and swap image
            else
            {
                $(elementID).slideDown(150);
                $(this).addClass("citationmanager_showArrowLeft");
            }
        });
    };


	/**
	 * Validate The user inputs for adding citations
	 */
	function validate(){
		if (($("#url").val()=="" || $("#author").val()=="" || $("#publication_year").val()=="" || $("#title").val()=="")&& count==1  ){
			count++;
			$("#addprivate").after("<label class=error > * values Required</label>");
		}
		
		
	}	
	
	/**
	 * Add the users citations to either public or private paths
	 */
	function addCitations(){
		$("#addnotetextarea").hide();
		$("#add").toggle();
		$("#addpublic").live("click",function(){
			validate();
			//sakai.api.Server.removeJSON("/_user" +sakai.data.me.profile.path+"/public/citationdata",alert('asdasd'));
			sakai.api.Server.loadJSON("/_user" +sakai.data.me.profile.path+"/public/citationdata",function(success,data){
				
		 	if (success) 
			{
				citation_info = data;
				for (var key in citation_info) 
				{
					if (citation_info.hasOwnProperty(key)) 
					{
						count_public++;//findout the current number of citations.
						
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
				
					sakai.api.Server.saveJSON("/_user" + sakai.data.me.profile.path + "/public/citationdata", data2, alert("data saved"));}
			var data1 =  
			{
			"UR" :$("#url").val(),
			"AU":$("#author").val(),
			"TL":$("#title").val(),
			"TY":$("#typeofref").val(),
			"N1":$("#addnotetextarea").val(),
			"KW":$("input.tag").val()
		
			}
		citation_info[count_public]=data1;//add to the end of the json array
		//sakai.api.Server.saveJSON("/_user" + sakai.data.me.profile.path + "/public/citationdata", citation_info, alert("data uploaded"));
		 });
		});
			$("#addprivate").live("click",function(){
				validate();
			sakai.api.Server.loadJSON("/_user" +sakai.data.me.profile.path+"/private/citationdata",function(success,data){
				
		 	if (success) 
			{
				citation_info = data;
				for (var key in citation_info) 
				{
					if (citation_info.hasOwnProperty(key)) 
					{
						count_private++;//findout the current number of citations.
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
				
					sakai.api.Server.saveJSON("/_user" + sakai.data.me.profile.path + "/private/citationdata", data2, alert("data saved"));
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
		citation_info[count_private]=data1;//add to the end of the json array
		sakai.api.Server.saveJSON("/_user" + sakai.data.me.profile.path + "/private/citationdata", citation_info, alert("data uploaded"));
		 });
		});
	}
	/**
	 * Add comments to a citaiton.
	 */
	function addComments(){
		$(".citationmanager_main_bookmark_info_link_comment").die();
		$(".comments_button1").die();
		$(".citationmanager_main_bookmark_info_link_comment").live("click",function(){
			var currentTextArea=$(this).attr("id").split("_",2);
			//alert(currentTextArea[1]);
			var element_textarea="#comment_"+currentTextArea[1];
			//alert(element_textarea);
			$(element_textarea).toggle('slow');
			$(".comments_button1").live("click",function(){
				var comment=$(this).prev().val();
				var parentId=$(this).parent().attr("id");
				var citation_number=$(this).attr("id").split("_",1);
				alert(citation_number);
				var username_comment=sakai.data.me.user.userid;
				//alert(username_comment);
				var comment_Citation=citationsArray.slice(citation,1);
				
				
			});
		});
	}
	/**Fetch The public and private citations of the user.
	 * This is the default view of the citaiton manager widget on loading
	 * 
	 */
	function fetchCitations(ref_type){
		if (ref_type=="public"){
			sakai.api.Server.loadJSON("/_user"+sakai.data.me.profile.path+"/public/citationdata",function(success,data){
			if(success)
			{
				parseCitations={all:data};
				$("#citation_pager").hide();
				renderCitations();
			}
			});
		}
		else if (ref_type=="private"){
			sakai.api.Server.loadJSON("/_user"+sakai.data.me.profile.path+"/private/citationdata",function(success,data){
			if(success)
			{
				parseCitations={all:data};
				$("#citation_pager").hide();
				renderCitations();
			}
			});
		}
		else if(ref_type.charAt(0)=="/"){
			alert("hello");
				sakai.api.Server.loadJSON("/_user"+ref_type+"/public/citationdata",function(success,data){
			if(success)
			{
				$("#errors").html("");
				parseCitations={all:data};
				$("#citation_pager").hide();
				renderCitations();
			}
			else {
				$("#errors").html("Sorry"+ref_type+"has no public Citations");
			}
			
			});
		}
		
	}
	/**
	 * Deletes a user's citaiton 
	 */
	function deleteCitation(){
		$(".user-icon").live("click",function(){
			alert("hello user");
				var delete_citaiton=$(this).attr("id");
				alert(delete_citaiton);
				//alert(citationsArray.length);
				alert(citationsArray[0].UR);
				citationsArray.splice(delete_citaiton,1);
				//alert(citationsArray.length);
				alert(citationsArray[0].UR);
				//alert(citationsArray[0].UR);
				sakai.api.Server.removeJSON("/_user/"+sakai.data.me.profile.path+"/public/citationdata",alert("data removed"));
				sakai.api.Server.saveJSON("/_user/"+sakai.data.me.profile.path+"/public/citationdata",citationsArray,alert("data saved"));
			});
	}
	/**
	 * 
	 */
	
	function getCitations(refType){
		
		pageCurrent=0;
		if (refType=="public"){fetchCitations("public");
			showHideCitationManagerBookmarkInfo();
			deleteCitation();
			addComments();
		}
		else if(refType=="private"){
			fetchCitations("private");
			showHideCitationManagerBookmarkInfo();
			deleteCitation();
			addComments();
		}
		else if(refType.charAt(0)=="/"){
			fetchCitations(refType);
			showHideCitationManagerBookmarkInfo();
			deleteCitation();
			addComments();
		}
	}
	
	
	function clickEvents(){
		$("#add").hide();
		$("#public").die();
		$("#private").die();
		$("#importfromconnotea").die();
		$("#public").live("click",function(){
			refType = "public";
			//alert("hello")
			getCitations(refType);
			
		});
		$("#private").live("click",function(){
			refType = "private";
			getCitations(refType);
		});
		$("#add_citations").live("click",function(){
			$("#citations_view").toggle();
			addCitations();
		});
		$("#fetchfrom").live("click",function(){
			$("#fetchfromuser").fadeIn('slow');
			$("#fetch").live("click",function(){
				//alert("asd");
				var userStr=$("#fetch_citations_username").val();
				var username="/"+userStr.charAt(0)+"/"+userStr.substr(0,2)+"/"+userStr;
				//alert("asd1");
				//alert(username);
				refType=username;
				if (userStr=="")
				{
					$("#errors").html("Please Specify a username");
				}
				else{
					getCitations(refType);
				}
				
			});
			
		});
		$("#importfromconnotea").live("click",function(){
			$("#connotea_import").toggle();
		});
	}
	/**
	 * 
	 */
	var doInit = function(){
		clickEvents();
		//alert("hello");
		
	};
	doInit();
	
}
sakai.api.Widgets.widgetLoader.informOnLoad("citationmanager");
