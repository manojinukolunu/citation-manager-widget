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
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
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

@SlingServlet(methods = { "GET" }, paths = { "/citations" }, extensions = "ris")
public class ExportRIS extends SlingSafeMethodsServlet {
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
}

