<#--
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
-->

<#assign el = args.htmlid?html />

<script type="text/javascript">//<![CDATA[
  function init() {
    var container = YAHOO.util.Selector.query(".header .app-items", document.body, true);
    if (container) {
      var tool = document.createElement('span');
      tool.setAttribute('id', '${el}-app_user_deleted_items');
      tool.setAttribute('class', 'yui-button yui-link-button');
      tool.innerHTML = '<span style="background-image: url(${url.context}/res/components/images/trashcan-16.png);" class="first-child">' +
                         '<a tabindex="0" href="${url.context}/page/user/${user.name?url}/user-deleted-items" templateuri="/user/${user.name?url}/user-deleted-items" title="${msg("user.trashcan")}" id="${el}-app_user_deleted_items-button">${msg("user.trashcan")}</a>' +
                       '</span>';

      container.appendChild(tool);
    }
  }

  YAHOO.util.Event.onDOMReady(init);
//]]></script>