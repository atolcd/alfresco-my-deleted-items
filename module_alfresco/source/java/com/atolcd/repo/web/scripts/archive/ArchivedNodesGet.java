/*
 * Copyright (C) 2013 Atol Conseils et Développements.
 * http://www.atolcd.com/
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
package com.atolcd.repo.web.scripts.archive;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.transaction.UserTransaction;

import org.alfresco.model.ContentModel;
import org.alfresco.repo.web.scripts.archive.AbstractArchivedNodeWebScript;
import org.alfresco.repo.web.scripts.archive.ArchivedNodeState;
import org.alfresco.repo.web.scripts.archive.ArchivedNodesFilter;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.repository.StoreRef;
import org.alfresco.service.cmr.search.ResultSet;
import org.alfresco.service.cmr.search.ResultSetRow;
import org.alfresco.service.cmr.search.SearchParameters;
import org.alfresco.service.cmr.search.SearchService;
import org.alfresco.util.ModelUtil;
import org.alfresco.util.ScriptPagingDetails;
import org.alfresco.web.bean.repository.Repository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptRequest;

/**
 * This class is the controller for the archivednodes.get web script.
 * 
 * @author Julien Berthoux
 */
public class ArchivedNodesGet extends AbstractArchivedNodeWebScript {

	private static Log logger = LogFactory.getLog(ArchivedNodesGet.class);

	private static final String MAX_ITEMS = "maxItems";
	private static final String SKIP_COUNT = "skipCount";
	private static final String USERNAME = "username";

	private final static String USER_ATTR = Repository.escapeQName(ContentModel.PROP_ARCHIVED_BY);
	private final static String SEARCH_USERPREFIX = "@" + USER_ATTR + ":%s AND ";
	private final static String SEARCH_ALL = "ASPECT:\"%s\"";

	List<ArchivedNodesFilter> nodeFilters = new ArrayList<ArchivedNodesFilter>();

	/**
	 * This method is used to inject {@link ArchivedNodeFilter node filters} on
	 * this GET call.
	 * 
	 * @param nodeFilters
	 */
	public void setArchivedNodeFilters(List<ArchivedNodesFilter> nodeFilters) {
		this.nodeFilters = nodeFilters;
	}

	@Override
	protected Map<String, Object> executeImpl(WebScriptRequest req, Status status, Cache cache) {
		Map<String, Object> model = new HashMap<String, Object>();

		// We want to get all nodes in the archive which were originally
		// contained in the
		// following StoreRef.
		StoreRef storeRef = parseRequestForStoreRef(req);
		List<ArchivedNodeState> deletedNodes = filterDeletedNodes(storeRef, req.getParameter(USERNAME));

		// Grab the paging parameters
		ScriptPagingDetails paging = new ScriptPagingDetails(getIntParameter(req, MAX_ITEMS, deletedNodes.size()), getIntParameter(req,
				SKIP_COUNT, 0));

		// Now do the paging
		model.put(DELETED_NODES, ModelUtil.page(deletedNodes, paging));
		model.put("paging", ModelUtil.buildPaging(paging));

		return model;
	}

	/**
	 * This method gets all deleted nodes for current user from the archive
	 * which were originally contained within the specified StoreRef.
	 */
	private List<ArchivedNodeState> filterDeletedNodes(StoreRef storeRef, String username) {
		List<ArchivedNodeState> deletedNodes = null;

		if (username != null && username.length() > 0) {

			UserTransaction tx = null;
			ResultSet results = null;

			try {

				tx = serviceRegistry.getTransactionService().getNonPropagatingUserTransaction(false);
				tx.begin();

				if (storeRef != null) {
					String query = String.format(SEARCH_USERPREFIX, username) + String.format(SEARCH_ALL, ContentModel.ASPECT_ARCHIVED);
					SearchParameters sp = new SearchParameters();
					sp.setLanguage(SearchService.LANGUAGE_LUCENE);
					sp.setQuery(query);
					sp.addStore(storeRef); // the Archived Node store

					results = serviceRegistry.getSearchService().query(sp);
					deletedNodes = new ArrayList<ArchivedNodeState>(results.length());
				}

				if (results != null && results.length() != 0) {
					NodeService nodeService = serviceRegistry.getNodeService();

					for (ResultSetRow row : results) {
						NodeRef nodeRef = row.getNodeRef();

						if (nodeService.exists(nodeRef)) {
							ArchivedNodeState state = ArchivedNodeState.create(nodeRef, serviceRegistry);
							deletedNodes.add(state);
						}
					}
				}

				tx.commit();
			} catch (Throwable err) {
				if (logger.isWarnEnabled())
					logger.warn("Error while browsing the archive store: " + err.getMessage());
				try {
					if (tx != null) {
						tx.rollback();
					}
				} catch (Exception tex) {
					if (logger.isWarnEnabled())
						logger.warn("Error while during the rollback: " + tex.getMessage());
				}
			} finally {
				if (results != null) {
					results.close();
				}
			}
		}

		return deletedNodes;
	}
}
