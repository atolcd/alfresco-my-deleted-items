"My deleted items" for Alfresco
================================

**My deleted items** is an extension which display deleted items of the current user, like a personal trashcan. This option is available in user profile.

Works with:
 - Alfresco Community 4.x
 - Alfresco Enterprise 4.x


Building the module
-------------------
Check out the project if you have not already done so

        git clone https://github.com/atolcd/alfresco-my-deleted-items.git

Ant build scripts are provided to build AMP files containing the custom files.
Before building, ensure you have edited the 'build.properties' files to set the path to your Alfresco SDK.

To build AMP files, run the following command from the base project directory:

        ant dist-amp


Installing the module
---------------------
This extension is a standard Alfresco Module, so experienced users can skip these steps and proceed as usual.

1. Stop Alfresco
2. Use the Alfresco [Module Management Tool](http://wiki.alfresco.com/wiki/Module_Management_Tool) to install the modules in your Alfresco and Share WAR files:

        java -jar alfresco-mmt.jar install auditshare-module-alfresco-X.X.X.amp $TOMCAT_HOME/webapps/alfresco.war -force
        java -jar alfresco-mmt.jar install auditshare-module-share-X.X.X.amp $TOMCAT_HOME/webapps/share.war -force

3. Delete the '$TOMCAT_HOME/webapps/alfresco/' and '$TOMCAT_HOME/webapps/share/' folders.
**Caution:** please ensure you do not have unsaved custom files in the webapp folders before deleting.
4. Start Alfresco


Using the module
---------------------

#### Configuration
This module uses latest Share 4.x extension mechanisms.
You can deploy/undeploy AuditShare menus directly from : `http://server:port/share/page/modules/deploy`

![Module deployment](/documentation/module-deployment.png "Module deployment")


![User profile toolbar](/documentation/deleted-items.png "My deleted items")



LICENSE
---------------------

This extension is licensed under `GNU Library or "Lesser" General Public License (LGPL)`.  
Created by: [Julien BERTHOUX] (https://github.com/jberthoux) and [Bertrand FOREST] (https://github.com/bforest)


Our company
---------------------

[Atol Conseils et Développements] (http://www.atolcd.com) is Alfresco [Gold Partner] (http://www.alfresco.com/partners/atol)  
Follow us on twitter [ @atolcd] (https://twitter.com/atolcd)  
