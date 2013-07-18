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

<#import "/org/alfresco/repository/generic-paged-results.lib.ftl" as genericPaging />
<#escape x as jsonUtils.encodeJSONString(x)>
{
   "data":
   {
      "deletedNodes":
      [
         <#list deletedNodes as deletedNode>
         {
            "nodeRef": "${deletedNode.nodeRef}",
            "archivedBy": "${deletedNode.archivedBy!""}",
            "archivedDate": "${xmldate(deletedNode.archivedDate)}",
            "name": "${deletedNode.name!""}",
            "title": "${deletedNode.title!""}",
            "description": "${deletedNode.description!""}",
            "displayPath": "${deletedNode.displayPath!""}",
            "firstName": "${deletedNode.firstName!""}",
            "lastName": "${deletedNode.lastName!""}",
            "nodeType": "${deletedNode.nodeType!""}"
         }<#if deletedNode_has_next>,</#if>
         </#list>
      ]
   }

   <@genericPaging.pagingJSON />
}
</#escape>