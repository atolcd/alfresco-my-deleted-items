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

<#assign activePage = page.url.templateArgs.pageid?lower_case!"">

<script type="text/javascript">//<![CDATA[
  function init() {
    var toolbarElt = YAHOO.util.Selector.query('div .toolbar.userprofile', document.body, true);
    if (toolbarElt) {
      var separator = document.createElement('div');
      separator.setAttribute('class', 'separator');
      separator.innerHTML = '&nbsp;';

      var link = document.createElement('div');
      link.setAttribute('class', 'link');
      link.innerHTML = '<a href="user-deleted-items" <#if activePage=="user-deleted-items">class="activePage theme-color-4"</#if>>${msg("link.deleted-items")}</a>';

      toolbarElt.appendChild(separator);
      toolbarElt.appendChild(link);
    }
  }

  YAHOO.util.Event.onDOMReady(init);
//]]></script>