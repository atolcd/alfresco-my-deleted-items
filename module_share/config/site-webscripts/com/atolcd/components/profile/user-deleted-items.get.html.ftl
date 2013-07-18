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

<#assign el = args.htmlid?html>
<script type="text/javascript">//<![CDATA[
  new Atol.UserDeletedItems("${el}").setMessages(${messages});
//]]></script>

<div id="${el}-body" class="deleted-items">
  <div class="header-bar">
    <div class="align-left"><span>${msg("label.deleted-items")}</div>

    <!-- Empty trashcan button -->
    <div class="align-right">
      <span class="yui-button yui-push-button" id="${el}-empty-button">
        <span class="first-child"><button>${msg("button.empty")}</button></span>
      </span>
    </div>
  </div>

  <div id="${el}-datalist"></div>
  <div>
    <div id="${el}-paginator" class="paginator">&nbsp;</div>
  </div>
</div>