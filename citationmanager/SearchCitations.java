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

@SlingServlet(methods = { "GET" }, paths = { "/citationsSearch" })
public class SearchCitations extends SlingAllMethodsServlet{
	private static final long serialVersionUID = -2002186252317448037L;
	@Override
	  protected void doGet(SlingHttpServletRequest req, SlingHttpServletResponse resp)
	      throws ServletException, IOException {
		String searchString=req.getParameter("search");
		int numberOfNodes=0;
		try{
			 resp.setContentType("application/json");
		      resp.setCharacterEncoding("UTF-8");
			Session session = req.getResourceResolver().adaptTo(Session.class);
			
			String queryString ="//*[@sling:resourceType=\"sakai:citation\" and jcr:contains(., \""+searchString+"\")]";
			 QueryManager queryManager = session.getWorkspace().getQueryManager();
		        @SuppressWarnings("deprecation")
				Query query = queryManager.createQuery(queryString, Query.XPATH);

		        QueryResult result = query.execute();//execute the query
		        //NodeIterator iter=result.getNodes();//get the nodes in the result and iterate over them.
		        PrintWriter w = resp.getWriter();
				ExtendedJSONWriter writer=new ExtendedJSONWriter(w);
		        writer.object();
		        for(NodeIterator iter=result.getNodes();iter.hasNext();){
		        	Node entry=iter.nextNode();
		        	numberOfNodes++;
		        	
		        	ExtendedJSONWriter.writeNodeContentsToWriter(writer, entry);
		        	
		        }
		        
		        writer.endObject();
		        //resp.getWriter().write("asd");
		}
		catch(Exception e){
			resp.getWriter().write("asdads");
		}
	}
	

}
