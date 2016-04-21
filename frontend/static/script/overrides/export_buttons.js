/*
 *  Copyright (C) 2016 GeoSolutions S.A.S.
 *  http://www.geo-solutions.it
 *
 *  GPLv3 + Classpath exception
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// override mxp.widgets.JSONEntityRESTManager to add Export buttons in the bottom bars
Ext.override(mxp.widgets.JSONEntityRESTManager, {
    
    exportText: 'Export ...',
    exportJSONText: 'Export to JSON',
    exportCSVText: 'Export to CSV',
    exportEXCELText: 'Export to EXCEL',
    defaultMaxResults: 100000,
    
    /**
     * Save the given url, using the given Authorization header, with fileName name
     */
    downloadFile: function(url, auth, fileName){
        var xhr = new XMLHttpRequest();
        // open() accepts username and password parameters but it never seemed to work.
        xhr.open('GET', url, true);
        // Manually set the authorization header, seems to work.
        xhr.setRequestHeader("Authorization", auth);
        xhr.responseType = 'blob';
        xhr.onload = function (e) {
        if(xhr.status == 200){
            saveAs(xhr.response, fileName);
        }else{
            // Notify the user something went wrong
            Ext.Msg.show({
                   msg: 'Status: '+ xhr.status,
                   buttons: Ext.Msg.OK,
                   icon: Ext.MessageBox.ERROR
                });
            }
        }
        xhr.send();  
    },

    /**
     * Override the default bbar adding the export buttons
     */
    getEditorBBar: function(entity, defaultPageSize, store, plugins) {
        
        // Results can be limited in the configuration file
        var maxResults = entity.maxResults || this.defaultMaxResults; 
        
        return [
            new Ext.PagingToolbar({
                        pageSize: entity.pageSize || defaultPageSize,
                        store: store,
                        displayInfo: true,
                        displayMsg: 'Displaying data {0} - {1} of {2}',
                        emptyMsg: "No data to display",
                        plugins: plugins
                    }),
            '->',
            {
                text: this.exportText,
                xtype: 'button',
                ///disabled: true,
                iconCls: "archive_ic",
                ref: "../exportMenuButton",
                menu:{
                    xtype: "menu",
                    showSeparator: true, 
                    items: [
                    {
                        iconCls: "archive_ic",
                        text: this.exportCSVText,
                        handler: function() {                    

                            var exportUrl = this.me.baseUrl + entity.basePath + "/export?format=csv&maxResults="+maxResults;
                            this.me.downloadFile(exportUrl, this.me.auth, entity.name.replace(/\s/g, "_").toLowerCase() +".csv");
                        },
                        scope: {
                            me: this,
                            entity: entity
                        }
                    },
                    {
                        iconCls: "archive_ic",
                        text: this.exportEXCELText,
                        handler: function() {                    

                            var exportUrl = this.me.baseUrl + entity.basePath + "/export?format=excel&maxResults="+maxResults;
                            this.me.downloadFile(exportUrl, this.me.auth, entity.name.replace(/\s/g, "_").toLowerCase() +".xls");
                            
                        },
                        scope: {
                            me: this,
                            entity: entity
                        }
                    },
                    {
                        iconCls: "archive_ic",
                        text: this.exportJSONText,
                        handler: function() {  
                            
                            var exportUrl = this.me.baseUrl + entity.basePath + "?maxResults="+maxResults;
                            this.me.downloadFile(exportUrl, this.me.auth, entity.name.replace(/\s/g, "_").toLowerCase() +".json");
                            
                        },
                        scope: {
                            me: this,
                            entity: entity
                        }
                    }
                    ]
                }
            }
        ]
   }
});