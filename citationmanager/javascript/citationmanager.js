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
	var count_private;//holds the private citations count 
	var count_public;//holds the public citaitons count
	var parseCitations=[];//parse the returned citaitons from loadJSON
	var $citationManagerMainTemplate = "citationmanager_main_citations_template";
	var pageCurrent=0;
	var pageSize=1;
	var citationsArray=["public","private"];
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
	 	//alert("asd12");
        $(".jq_pager1").pager({
            pagenumber: pageCurrent + 1,
            pagecount: Math.ceil(arraylength / pageSize),
            buttonClickCallback: doPaging
        });
		//alert("asd");
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
		//$("<div>asd</div>");
		//alert("asd");
		$("#public_citations_view").html($.TemplateRenderer("citationmanager_main_citations_template",pagingArray));
		//alert("asd");
		if (parseCitationsArray.length > pageSize) {
			//alert("hello");
		
            $("#citation_pager").show();
            renderPaging(parseCitationsArray.length);
        }
		
		//alert(parseCitationsArray[1].UR);
		//for (var i=0;i<parseCitationsArray.length;i++){
			//$("#public_citations_view").append("<div class=citation_view>UR "+parseCitationsArray[i].UR+"<br/>TY "+parseCitationsArray[i].TY+"<br/>TL "+parseCitationsArray[i].TL+"<br/>N1 "+ parseCitationsArray[i].N1+"<br/>AU "+parseCitationsArray[i].AU+"<br/>KW "+parseCitationsArray[i].KW+"<br/>ER</div>");
		//}
	}
	
	/**
	 * Show or hide the other properties of a citions
	 */
	var showHideCitationManagerBookmarkInfo = function() {

        // Re-initialization
        //$citationmanager_main_bookmark_info_link = $(".citationmanager_main_bookmark_info_link");

        // Kill previous live events to prevent adding dupes
       //$citationmanager_main_bookmark_info_link.die();

        $(".citationmanager_main_bookmark_info_link").live("click", function() {

            // Define unique info ID, based on link ID
            var elementID = '#' + $(this).attr("id") + '_info';
			

            // If visible: hide information and swap image
            if ($(this).hasClass("citationmanager_showArrowLeft"))
            {
                $(elementID).slideUp(150);
                $(this).removeClass("citationmanager_showArrowLeft");
				//alert("asd1");
				asd=0;
            }

            // Else: show information and swap image
            else
            {
                $(elementID).slideDown(150);
                $(this).addClass("citationmanager_showArrowLeft");
				asd=1;
            }
			$(".user-icon").live("click",function(){
				$(this).hide();
			});
				
			
        });
    };
	/**
	 * Add the users citations to either public or private paths
	 */
	function addCitations(){
		$("#addnotetextarea").hide();
		$("#add").toggle();
		$("addpublic").live("click",function(){
			sakai.api.Server.loadJSON("/_user" +sakai.data.me.profile.path+"/public/citationdata",function(success,data){
				
		 	if (success) 
			{
				citation_info = data;
				for (var key in citation_info) 
				{
					if (citation_info.hasOwnProperty(key)) 
					{
						count_public++;//findout the current number of citations.
						//alert(count2);
					}
				}
			}
			else if(!success)
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
				
					sakai.api.Server.saveJSON("/_user" + sakai.data.me.profile.path + "/public/citationdata", data2, afterSaveJSON(success));
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
		sakai.api.Server.saveJSON("/_user" + sakai.data.me.profile.path + "/public/citationdata", citation_info, alert("data uploaded"));
		 });
		});
	}
	/**Fetch The public and private citations of the user.
	 * This is the default view of the citaiton manager widget on loading
	 * 
	 */
	function fetchCitations(){
		sakai.api.Server.loadJSON("/_user"+sakai.data.me.profile.path+"/public/citationdata",function(success,data){
			if(success)
			{
				//alert("success");
				parseCitations={all:data};
				renderCitations();
			}
			alert("asd");
			showHideCitationManagerBookmarkInfo();
			$(".user-icon").live("click",function(){
				var delete_citaiton=$(this).attr("id");
				citationsArray.splice(delete_citaiton,1);
				//alert("hello");
				//alert(citationsArray[0].UR);
				sakai.api.Server.removeJSON("/_user/"+sakai.data.me.profile.path+"/public/citationdata",alert("data removed"));
				sakai.api.Server.saveJSON("/_user/"+sakai.data.me.profile.path+"/public/citationdata",citationsArray,alert("data loaded"));
			});
			
		
		});
		
		
		
	}
	function clickEvents(){
		$("#add").hide();
	}
	
	var doInit = function(){
		clickEvents();
		
		//alert("hello");
		fetchCitations();
		$("#add_citations").live("click",function(){
			$("#citations_view").toggle();
			addCitations();
		});
		
		
	};
	doInit();
	
}
sakai.api.Widgets.widgetLoader.informOnLoad("citationmanager");
