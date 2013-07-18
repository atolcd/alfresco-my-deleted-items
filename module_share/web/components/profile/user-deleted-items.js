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

// Atol namespace
if (typeof Atol == "undefined" || !Atol) { var Atol = {}; }

 /**
 * UserDeletedItems tool component.
 *
 * @namespace Atol
 * @class Atol.UserDeletedItems
 */
(function()
{
  /**
   * YUI Library aliases
   */
  var Dom = YAHOO.util.Dom,
       Event = YAHOO.util.Event,
       Element = YAHOO.util.Element;

  /**
   * Alfresco Slingshot aliases
   */
  var $html = Alfresco.util.encodeHTML;

  /**
   * UserDeletedItems constructor.
   *
   * @param {String} htmlId The HTML id of the parent element
   * @return {Atol.UserDeletedItems} The new UserDeletedItems instance
   * @constructor
  */
  Atol.UserDeletedItems = function(htmlId) {
    Atol.UserDeletedItems.superclass.constructor.call(this, "Atol.UserDeletedItems", htmlId, ["button", "container", "datasource", "datatable",  "paginator", "json", "history"]);

    /* Register this component */
    Alfresco.util.ComponentManager.register(this);

    /* Define panel handlers */
    var parent = this;

    return this;
  };

  YAHOO.extend(Atol.UserDeletedItems, Alfresco.component.Base, {
    /**
     * Fired by YUI when parent element is available for scripting.
     * Component initialisation, including instantiation of YUI widgets and event listener binding.
     *
     * @method onReady
     */
    onReady: function UserDeletedItems_onReady()
    {
       // Configure datatable
       var url = Alfresco.constants.PROXY_URI + "repository/archive/archive/SpacesStore?username=" + Alfresco.constants.USERNAME;
       this.widgets.emptyButton = Alfresco.util.createYUIButton(this, "empty-button", this.onEmptyClick);
       this.widgets.pagingDataTable = new Alfresco.util.DataTable(
       {
          dataTable:
          {
             container: this.id + "-datalist",
             columnDefinitions:
             [
                { key: "thumbnail", sortable: false, formatter: this.bind(this.renderCellIcon), width: 32 },
                { key: "description", sortable: false, formatter: this.bind(this.renderCellDescription) },
                { key: "actions", sortable: false, formatter: this.bind(this.renderCellActions), width: 200 }
             ]
          },
          dataSource:
          {
             url: url,
             config:
             {
                responseSchema:
                {
                   resultsList: "data.deletedNodes"
                }
             }
          },
          paginator:
          {
             config:
             {
                containers: [this.id + "-paginator"],
                rowsPerPage: 50
             }
          }
       });
    },

    /**
     * YUI WIDGET EVENT HANDLERS
     * Handlers for standard events fired from YUI widgets, e.g. "click"
     */

    /**
     * Empty trashcan button click event handler
     *
     * @method onEmptyClick
     * @param e {object} DomEvent
     * @param args {array} Event parameters (depends on event type)
     */
    onEmptyClick: function UserDeletedItems_onEmptyClick(e, args)
    {
       var me = this;

       // confirm this brutal operation with the user
       Alfresco.util.PopupManager.displayPrompt(
       {
          title: me.msg("button.empty"),
          text: me.msg("message.empty.confirm"),
          buttons: [
          {
             text: me.msg("button.ok"),
             handler: function()
             {
                this.destroy();

                // call api to remove all items from the trashcan
                // use the progress animation as this operation may take a while
                var progressPopup = Alfresco.util.PopupManager.displayMessage(
                {
                   displayTime: 0,
                   effect: null,
                   text: me.msg("message.empty.inprogress")
                });

                Alfresco.util.Ajax.request(
                {
                   url: Alfresco.constants.PROXY_URI + "api/archive/workspace/SpacesStore",
                   method: "DELETE",
                   successCallback:
                   {
                      fn: function success(data)
                      {
                          progressPopup.destroy();
                          me.refreshDataTable();
                      }
                   },
                   failureCallback:
                   {
                      fn: function failure(data)
                      {
                         progressPopup.destroy();

                         Alfresco.util.PopupManager.displayPrompt(
                         {
                            text: me.msg("message.recover.failure")
                         });
                      }
                   }
                });
             }
          },
          {
             text: me.msg("button.cancel"),
             handler: function()
             {
                this.destroy();
             },
             isDefault: true
          }]
       });
    },

    /**
     * DataTable Cell Renderers
     */

    /**
     * File/Folder icon custom datacell formatter
     *
     * @method UserDeletedItems_renderCellIcon
     */
    renderCellIcon: function UserDeletedItems_renderCellIcon(elCell, oRecord, oColumn, oData)
    {
       var name = oRecord.getData("name"),
           type = oRecord.getData("nodeType"),
           extn = name.substring(name.lastIndexOf("."));

       Dom.setStyle(elCell, "width", oColumn.width + "px");
       Dom.setStyle(elCell.parentNode, "width", oColumn.width + "px");

       elCell.innerHTML = '<span class="icon32"><img src="' + Alfresco.constants.URL_RESCONTEXT + 'components/images/filetypes/' + Alfresco.util.getFileIcon(name, type) + '" alt="' + $html(name) + '" /></span>';
    },

    /**
     * Description metadata custom datacell formatter
     *
     * @method UserDeletedItems_renderCellDescription
     */
    renderCellDescription: function UserDeletedItems_renderCellDescription(elCell, oRecord, oColumn, oData)
    {
       var fullName = oRecord.getData("firstName") + " " + oRecord.getData("lastName");
       var meta = $html(this.msg("message.metadata", Alfresco.util.formatDate(Alfresco.util.fromISO8601(oRecord.getData("archivedDate"))), fullName));
       var desc = '<div class="name">' + $html(oRecord.getData("name")) + '</div>' + '<div class="desc">' + meta + '</div>'
                + '<div class="desc">' + $html(oRecord.getData("displayPath")) + '</div>';
       elCell.innerHTML = desc;
    },

    /**
     * Actions custom datacell formatter
     *
     * @method UserDeletedItems_renderCellActions
     */
    renderCellActions: function UserDeletedItems_renderCellActions(elCell, oRecord, oColumn, oData)
    {
       var nodeRef = oRecord.getData("nodeRef"),
           nodeName = oRecord.getData("name");

       this._createActionButton(
          elCell, nodeRef.split("/")[3], "button.recover",
          function(event, obj)
          {
             // make ajax call to Recover the item
             Alfresco.util.Ajax.request(
             {
                url: Alfresco.constants.PROXY_URI + "api/archive/" + obj.nodeRef.replace(":/",""),
                method: "PUT",
                successCallback:
                {
                   fn: this._onRecoverSuccess,
                   obj: obj,
                   scope: this
                },
                failureMessage: this.msg("message.recover.failure", nodeName)
             });
          },
          {
             nodeRef: nodeRef,
             name: nodeName
          }
       );
       this._createActionButton(
          elCell, nodeRef.split("/")[3], "button.delete",
          function(event, obj)
          {
             // make ajax call to Delete the item
             Alfresco.util.Ajax.request(
             {
                url: Alfresco.constants.PROXY_URI + "api/archive/" + obj.nodeRef.replace(":/",""),
                method: "DELETE",
                successCallback:
                {
                   fn: this._onDeleteSuccess,
                   obj: obj,
                   scope: this
                },
                failureMessage: this.msg("message.delete.failure", nodeName)
             });
          },
          {
             nodeRef: nodeRef,
             name: nodeName
          }
       );
    },

    /**
     * Refresh the list after an action has occured
     *
     * @method refreshDataTable
     */
    refreshDataTable: function UserDeletedItems_refreshDataTable()
    {
       this.widgets.pagingDataTable.loadDataTable();
    },

    /**
     * Callback handler used when a deleted item was recovered
     *
     * @method _onRecoverSuccess
     * @param response {object}
     * @param obj {object}
     */
    _onRecoverSuccess: function UserDeletedItems__onRecoverSuccess(response, obj)
    {
       Alfresco.util.PopupManager.displayMessage(
       {
          text: this.msg("message.recover.success", obj.name)
       });

       this.refreshDataTable();
    },

    /**
     * Callback handler used when a deleted item was purged
     *
     * @method _onDeleteSuccess
     * @param response {object}
     * @param obj {object}
     */
    _onDeleteSuccess: function UserDeletedItems__onDeleteSuccess(response, obj)
    {
       Alfresco.util.PopupManager.displayMessage(
       {
          text: this.msg("message.delete.success", obj.name)
       });

       this.refreshDataTable();
    },

    /**
     * Create a generic YUI action button hooked into the appropriate parent element
     *
     * @method createActionButton
     * @param el {object} Parent element to add button
     * @param id {string} Button ID
     * @param labelid {string} Button label message ID
     * @param action {function} Action event function
     * @param obj {object} Action event parameter object
     * @private
     */
    _createActionButton: function UserDeletedItems__createActionButton(el, id, labelId, action, obj)
    {
       var me = this;
       var span = document.createElement("span");
       span.id = me.id + id;
       var btn = new YAHOO.widget.Button(
       {
           container: me.id + id
       });
       btn.set("label", me.msg(labelId));
       btn.set("onclick",
       {
          fn: action,
          obj: obj,
          scope: me
       });
       el.appendChild(span);
    }
  });
})();