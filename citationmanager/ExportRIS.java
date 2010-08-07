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

package org.sakaiproject.nakamura.exportRIS;

import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.jackrabbit.api.security.principal.PrincipalIterator;
import org.apache.jackrabbit.api.security.principal.PrincipalManager;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.Group;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.api.wrappers.ValueMapDecorator;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.jcr.base.util.AccessControlUtil;
import org.sakaiproject.nakamura.api.doc.BindingType;
import org.sakaiproject.nakamura.api.doc.ServiceBinding;
import org.sakaiproject.nakamura.api.doc.ServiceDocumentation;
import org.sakaiproject.nakamura.api.doc.ServiceMethod;
import org.sakaiproject.nakamura.api.doc.ServiceResponse;
import org.sakaiproject.nakamura.api.personal.PersonalUtils;
import org.sakaiproject.nakamura.api.user.UserConstants;
import org.sakaiproject.nakamura.util.ExtendedJSONWriter;
import org.sakaiproject.nakamura.util.PathUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.PrintWriter;
import java.security.Principal;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.TimeZone;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.Value;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;
import javax.jcr.query.Query;
import javax.jcr.query.QueryManager;
import javax.jcr.query.QueryResult;
import java.io.*;
import java.util.*;


@SlingServlet(methods = { "GET","POST" }, paths = { "/citations" }, extensions = "ris")
public class ExportRIS extends SlingAllMethodsServlet {
  /**
   *
   */
  private static final long serialVersionUID = -2002186252317448037L;

  @Override
  protected void doGet(SlingHttpServletRequest req, SlingHttpServletResponse resp)
      throws ServletException, IOException {
    /*
     * Since Sling will give you the node that the user is requesting, you can work with
     * it directly.
     */
    try {
      resp.setContentType("application/octet-stream");
      resp.setCharacterEncoding("UTF-8");
     
      Session session = req.getResourceResolver().adaptTo(Session.class);
      UserManager um = AccessControlUtil.getUserManager(session);
      Authorizable au = um.getAuthorizable(session.getUserID());
      String citationDataPath = PersonalUtils.getPublicPath(au) + "/citationdata";

      // PrintWriter w = response.getWriter();
      Node citationData = (Node) session.getItem(citationDataPath);
      // Node citation = session.getNode(absPath);//absPath will be like
      // /_user/a/admin/public/citataiondata not required same as above
        //resp.getWriter().write(citationData.getPath()+"\n");
      //int i;
     
      for (NodeIterator entries = citationData.getNodes(); entries.hasNext();) {
        Node entry = entries.nextNode();
        resp.getWriter().write(entry.getName()+"\n");
        resp.getWriter().write("UR "+entry.getProperty("UR").getString());
        resp.getWriter().write("\n");
        resp.getWriter().write("TL "+entry.getProperty("TL").getString());
        resp.getWriter().write("\n");
        resp.getWriter().write("TY "+entry.getProperty("TY").getString());
        resp.getWriter().write("\n");
        resp.getWriter().write("ER \n");
        //resp.getWriter().write(entry.getPath()+"\n");
        resp.getWriter().flush();
      }

    } catch (Exception e) {
      resp.getWriter().write("asd");
    }

  }
 
  //This will get the citations from the imported citations file and add to the public path of the logged in user
  protected void doPost(SlingHttpServletRequest req, SlingHttpServletResponse resp)
      throws ServletException, IOException {
	 // String nameOfFinalNode = null;
        try{
            int countIndex=0;
             Session session = req.getResourceResolver().adaptTo(Session.class);
              UserManager um = AccessControlUtil.getUserManager(session);
              Authorizable au = um.getAuthorizable(session.getUserID());
              String citationDataPath = PersonalUtils.getPublicPath(au) + "/citationdata";

              // PrintWriter w = response.getWriter();
              Node citationData = (Node) session.getItem(citationDataPath);//get the public path node
              for(NodeIterator iter=citationData.getNodes();iter.hasNext();){
            	  iter.next();
            	  countIndex++;
              }
             
             
                  //countIndex++;//number of nodes
              
              //String asd4=citationDataPath+"asd1";
              //countIndex=1;
              //convert to string for node naming
             // resp.getWriter().write(s);
            InputStream in = req.getRequestParameter("myfile").getInputStream();
            Scanner scanner=new Scanner(in);
            while (scanner.hasNextLine()){
            	
            		String nextLine=scanner.nextLine();

            		
                ArrayList<String> lineal= processLine(nextLine,resp,req);
                countIndex++;
                if(countIndex!= 1){
                	
                	String s = "" + countIndex;
                	Node addedNode1=citationData.addNode(s);
                	addedNode1.setProperty("asd","asd1");
                    
                }
                else{
                	
                	String s1= ""+countIndex;
                	
                	Node addedNode=citationData.addNode(s1);
                	addedNode.setProperty("asd","asd1");
                   
                }
                if(session.hasPendingChanges()){
                	session.save();
                }
                
                
				resp.getWriter().write((lineal.get(0))+"  "+lineal.get(1)+"<br/>");
            	
            	
           }
            resp.setContentType("text/html");
           //String  searchString=req.getParameter("searchString");
            //resp.getWriter().write("ER \n");
            resp.getWriter().write("<br/>Out of loop");
            }
            catch(RepositoryException re){
            	throw new ServletException(re.getMessage(), re);
            }
           

}

    public ArrayList<String> processLine(String line,SlingHttpServletResponse resp,SlingHttpServletRequest req){

           
           try{
        Scanner scanner=new Scanner(line);//process each line
        String name = null;
        String value = null;
        if(scanner.hasNext()){
            scanner.useDelimiter(" - ");//extract the contents of the file before and after  - 
            name=scanner.next();//name has the UR ,TL etc
            if(name.equals("ER ")){
            	resp.getWriter().write("end Reached<br/>");
            }
            
            
            else
            {
            	value=scanner.next();
            	
            }
            //values of UR ,TL etc
        }
        ArrayList<String> al=new ArrayList<String>();
        al.add(name);
        al.add(value);
        return al;
       
       
           }
    catch(Exception e)
    {
    	
    }
		return null;
    }

}