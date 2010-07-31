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
	var count_private=0;//holds the private citations count 
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
	var citation_private;
	var citation_public;

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
                	":basic-user" : $("#uname").val(),
                    ":basic-password" : $("#pass").val()
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
	 * Add the users citations to either public or private paths
	 */
	function addCitations(){
		$("#addnotetextarea").hide();
		$("#add").toggle();
		$("#addnote").die();
		$("#addnote").live("click",function(){
			$("#addnotetextarea").toggle('slow');
		})
		$("#addpublic").live("click",function(){
			if ($("url").val() =="" || $("#author").val() =="" || $("#publication_year").val() =="" || $("#title").val() =="" ){
				$("#add_error").html("Please enter * marked values");
				
			}
			else{
				$("#add_error").remove();
			var count_public=0;//holds the public citaitons count
			//validate();
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
					"sling:resourceType":"sakai:citation",
					"KW":$("#tag").val()
		
				}]
				
				sakai.api.Server.saveJSON("/_user" + sakai.data.me.profile.path + "/public/citationdata", data2, function(){
					$("#citations_add").after("<label class=citations_view >Data Added</label>");
				});
			}
			var data1 =  
				{
					"UR" :$("#url").val(),
					"AU":$("#author").val(),
					"TL":$("#title").val(),
					"TY":$("#typeofref").val(),
					"N1":$("#addnotetextarea").val(),
					"sling:resourceType":"sakai:citation",
					"KW":$("#tag").val()
				}
			citation_info[count_public]=data1;//add to the end of the json array
			sakai.api.Server.saveJSON("/_user" + sakai.data.me.profile.path + "/public/citationdata", citation_info, function(){
				$("#citations_after").html("<label class=citations_view >Data Added</label>").fadeOut(4000);
			});
		 		});
			}
			
		
		});
			$("#addprivate").live("click",function(){
				if ($("url").val() =="" || $("#author").val() =="" || $("#publication_year").val() =="" || $("#title").val() =="" ){
				$("#add_error").html("Please enter * marked values");
				
			}
			else{
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
					"KW":$("#tag").val()
		
				}]
				
					sakai.api.Server.saveJSON("/_user" + sakai.data.me.profile.path + "/private/citationdata", data2, function(){
						$("#citations_after").html("<label class=citations_view >Data Added</label>").fadeOut(4000);
					});
					}
			var data1 =  
			{
			"UR" :$("#url").val(),
			"AU":$("#author").val(),
			"TL":$("#title").val(),
			"TY":$("#typeofref").val(),
			"N1":$("#addnotetextarea").val(),
			"KW":$("#tag").val()
		
			}
		citation_info[count_private]=data1;//add to the end of the json array
		sakai.api.Server.saveJSON("/_user" + sakai.data.me.profile.path + "/private/citationdata", citation_info, function(){
						$("#citations_after").html("<label class=citations_view >Data Added</label>").fadeOut(4000);
					});
		 });
			}
			
			
		});
	}
	/**
	 * Add comments to a citaiton.
	 */
	function addAndShowComments(){
		$(".citationmanager_main_bookmark_info_link_comment").die();
		$(".comments_button1").die();
		$("#showcomment").die();
		$("#hidecomment").die();
		$(".citationmanager_main_bookmark_info_link_comment").live("click",function(){
			var currentTextArea=$(this).attr("id").split("_",2);
			//alert(currentTextArea[1]);
			var element_textarea="#comment_"+currentTextArea[1];
			//alert(element_textarea);
			$(element_textarea).toggle('slow');
			$(".comments_button1").live("click",function(){
				//sakai.api.Server.removeJSON("/_user"+sakai.data.me.profile.path+"/public/commentsForCitations",alert("dataremoved"));
				var comments=$(this).prev().val();
				//console.log(comments);
				var parentId=$(this).parent().attr("id");
				var citation_number=$(this).attr("id").split("_",1);
				//alert(citation_number);
				var username_comment=sakai.data.me.user.userid;
				//alert(username_comment);
				sakai.api.Server.loadJSON("/_user"+sakai.data.me.profile.path+"/public/commentsForCitations",function(success,data){
					if(success){
						var comment_count=0;
						citation_info = data;
						for (var comment in citation_info){
							if(citation_info.hasOwnProperty(comment)){
								comment_count++;
							}
						}
						//alert(comment_count);
					}
					else{
						//console.log(comments);
						var comment_data = [{
							"user": username_comment,
							"comment": comments,
							"Comment_for": citation_number
						}]
				sakai.api.Server.saveJSON("/_user"+sakai.data.me.profile.path+"/public/commentsForCitations",comment_data,function(success){
					if (success){
						$(element_textarea).after("<label class=input_class_comment >Comment Added</label>");
						$(element_textarea).hide();
						$(element_textarea).parent().find(".input_class_comment").fadeOut(2000);
					
					}
					else{
						$(element_textarea).after("<label class=input_class_comment >Please Try Again</label>");
						$(element_textarea).parent().find(".input_class_comment").fadeOut('slow');
							}
					
						}
						);
				
					}
				//console.log(comments);
				var comment_data = {
					"user": username_comment,
					"comment": comments,
					"Comment_for": citation_number
				}
				
				citation_info[comment_count]=comment_data;
				
				sakai.api.Server.saveJSON("/_user"+sakai.data.me.profile.path+"/public/commentsForCitations",citation_info,function(success){
					if (success){
						$(element_textarea).after("<label class=input_class_comment >Comment Added</label>");
						$(element_textarea).hide();
						$(element_textarea).parent().find(".input_class_comment").fadeOut('slow');
						
					}
					else{
						$(element_textarea).after("<label class=input_class_comment >Please Try Again</label>");
						$(element_textarea).parent().find(".input_class_comment").fadeOut('slow');
					}
					
				}
				);
				});
				//var comment_Citation=citationsArray.slice(citation,1);
				
				
			});
		});
		
		
		$("#showcomment").die();
		var count=0;
		$("#showcomment").live("click",function(){
			//$(this).hide();//hide the showcomments link
			//sakai.api.Server.removeJSON("/_user"+sakai.data.me.profile.path+"/public/commentsForCitations",alert("ad"));
			//alert(this);
			var commentFor=$(this).parent().attr("id").split("_",3);//array used for getting the citation number
			var commentForCitation=commentFor[2];//holds the citation number for which comments have to be shown
			//console.log(commentForCitation);
			sakai.api.Server.loadJSON("/_user"+sakai.data.me.profile.path+"/public/commentsForCitations",function(success,data){
				if(success){
					alert("hello");
					parseComments={all:data};
					var parseCommentsArray=[];
					for (var b in parseComments.all){
						if(parseComments.all.hasOwnProperty(b)){
							parseCommentsArray.push(parseComments.all[b]);
						}
					}
					//$("#citation_comments_"+commentForCitation).addClass('comments_citaions');
					
					commentsArray=parseCommentsArray;//commentsArray has all the comments
					//alert(commentsArray.length);
					var elementID="hide_"+commentForCitation;
					var editID="edit_"+commentForCitation;
					
					$("#citation_comments_"+commentForCitation).html(" ");//to prevent mulitple appends after hiding comments
					alert(commentsArray.length);
						for (var i=0;i<commentsArray.length;i++){
						if(commentsArray[i].Comment_for==commentForCitation){
							
							
							$("#citation_comments_"+commentForCitation).append("<div class=comments_citaions id=comment_"+i+"><a href=javascript:; ><img src=\"/devwidgets/citationmanager/images/comments.jpg\" style=\"float:right;\" id="+editID+" /></a>Comment By: "+commentsArray[i].user+"<br/><label id =label_"+i+ " >Comment: "+commentsArray[i].comment+"</label></div><br/>");
							
							
						}
						
					}
					$("#citation_comments_"+commentForCitation).append("<a href=javascript:; id="+elementID+">Hide Comments</a>");
					$("#citation_comments_"+commentForCitation).show();
					
					
					$("#"+elementID).click(function(){
						$(this).parent().hide();
						//$("#showcomment").show();
					});
					var count=1;
					$("#"+editID).click(function(){
						var labelID="label_"+$(this).attr("id").split("_",2)[1];
						var currentComment=$("#"+labelID).text().split(":",2)[1];						
						$(this).parent().parent().find("#"+labelID).remove();
						
						if(count==1){
							$(this).after("<textarea id="+labelID +"_textarea class=textarea_edit style=\" background-color: #fffff;-moz-border-radius:5px;-webkit-border-radius: 5px;border: 1px solid #000;padding: 4px;\">"+ currentComment +"</textarea><br/> <br/><button id=comment_"+labelID +"_button class=comments >Add</button>");
							count++;
						}
						
						$("#comment_"+labelID +"_button").click(function(){
							var currentCommentNumber=labelID.split("_",2)[1];
							//alert(currentCommentNumber);
							var editedComment=$(this).parent().find("#"+labelID +"_textarea").val();
							var commentEditedForCitation=elementID.split("_",2)[1];
							//alert(commentEditedForCitation);
							var comment_data = [{
									"user": sakai.data.me.user.userid,
									"comment": editedComment,
									"Comment_for": commentEditedForCitation
									}]
							commentsArray.splice(currentCommentNumber,1,comment_data);
							sakai.api.Server.removeJSON("/_user"+sakai.data.me.profile.path+"/public/commentsForCitations",function(){
								sakai.api.Server.saveJSON("/_user"+sakai.data.me.profile.path+"/public/commentsForCitations",comment_data,alert("data saved"));

							});
						});
						 


					});
					
					
					
					
		
				}
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
			//alert("hello");
				sakai.api.Server.loadJSON("/_user"+ref_type+"/public/citationdata",function(success,data){
			if(success)
			{
				$("#errors").html("");
				parseCitations={all:data};
				$("#citation_pager").hide();
				renderCitations();
			}
			else {
				$("#errors").html("Sorry"+ref_type+"has no public Citations").fadeOut(3000);
			}
			
			});
		}
		
	}
	/**
	 * Deletes a user's citaiton  This is working for only public citaions should make it work for pivate
	 */
	function deleteCitation(){
		$(".user-icon").die();
		$(".user-icon").live("click",function(){
				var delete_citaiton=$(this).attr("id");
				citationsArray.splice(delete_citaiton ,1);
				var citationsArrayAfterDelete=citationsArray;
				if (citation_private==1){
					sakai.api.Server.removeJSON("/_user"+sakai.data.me.profile.path+"/private/citationdata",function(){
					sakai.api.Server.saveJSON("/_user"+sakai.data.me.profile.path+"/private/citationdata",citationsArrayAfterDelete,alert("data saved"));
					citation_private=0;
				});
				}
				else if (citation_public==1){
					sakai.api.Server.removeJSON("/_user"+sakai.data.me.profile.path+"/public/citationdata",function(){
					sakai.api.Server.saveJSON("/_user"+sakai.data.me.profile.path+"/public/citationdata",citationsArrayAfterDelete,alert("data saved"));
					citation_public=0;
				});
				}
				
				
			});
	}
	/**
	 * Gets the user's citaitons based on reference type either public or private
	 */
	
	function getCitations(refType){
		
		pageCurrent=0;
		if (refType=="public"){
			fetchCitations("public");
			showHideCitationManagerBookmarkInfo();
			deleteCitation();
			addAndShowComments();
		}
		else if(refType=="private"){
			fetchCitations("private");
			showHideCitationManagerBookmarkInfo();
			deleteCitation();
			addAndShowComments();
		}
		else if(refType.charAt(0)=="/"){
			fetchCitations(refType);
			showHideCitationManagerBookmarkInfo();
			deleteCitation();
			addAndShowComments();
		}
	}
	
	/**
	 * binds all the events
	 */
	function clickEvents(){
		$("#add").hide();
		$("#public").die();
		$("#private").die();
		$("#import").die();
		$("#importfromconnotea").die();
		$("#search").die();
		$("#public_citations_view").hide('slow');
		$("#search").live("click",function(){
			$("#search_div").toggle('slow');
		});
		$("#public").live("click",function(){
			citation_public=0;
			$("#public_citations_view").show('slow');
			refType = "public";
			//alert("hello")
			getCitations(refType);
			citation_public=1;
			
		});
		$("#private").live("click",function(){
			citation_private=0;
			$("#public_citations_view").show('slow');
			refType = "private";
			getCitations(refType);
			citation_private=1;
		});
		$("#add_citations").live("click",function(){
			$("#citations_view").toggle();
			addCitations();
		});
		
		$("#fetchfrom").live("click",function(){
			$("#fetchfromuser").toggle('slow');
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
		$("#export").click(function(){
			window.open("http://localhost:8080/citations.ris");
		});
		$("#import").live("click",function(){
			//alert("asd");
			$("#importForm").toggle('slow');
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
