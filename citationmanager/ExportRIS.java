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



import java.io.*;
import java.io.OutputStream;
import java.io.IOException;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
import java.security.Principal;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.TimeZone;
import java.net.MalformedURLException;
import java.rmi.NotBoundException;
import java.rmi.RemoteException;

import javax.jcr.LoginException;
import javax.jcr.Repository;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.SimpleCredentials;
import javax.jcr.observation.Event;
import javax.jcr.observation.EventIterator;
import javax.jcr.observation.EventListener;
import javax.jcr.observation.ObservationManager;

import javax.jcr.Node;

import javax.jcr.Value;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;


public class ExportRIS  {
  /**
   *
   */
 public static void main(String[] args) throws MalformedURLException,
			ClassCastException, RemoteException, NotBoundException,
			LoginException, RepositoryException, InterruptedException {

		ClientRepositoryFactory factory = new ClientRepositoryFactory();
		Repository repository = factory.getRepository("//localhost:8080/");
		Session session = repository.login(new SimpleCredentials("admin",
				"admin".toCharArray()));

		if (repository.getDescriptor(Repository.OPTION_OBSERVATION_SUPPORTED)
				.equals("true")) {
			ObservationManager observationManager = session.getWorkspace()
					.getObservationManager();
			String[] types = { "nt:file" };
			observationManager.addEventListener(new EventListener() {
				public void onEvent(EventIterator eventIterator) {
					while (eventIterator.hasNext()) {
						Event event = eventIterator.nextEvent();
						if (event.getType() == Event.NODE_ADDED) {
							try {
								System.out.println("new upload: "
										+ event.getPath());
							} catch (RepositoryException e) {
								e.printStackTrace();
							}
						}
					}
				}
			}, Event.NODE_ADDED, "/content/firststeps/uploads", true, null, types, false);
		}

		while (true) {
			System.out.println("I am still here");
			Thread.sleep(5000);
		}
	}

}