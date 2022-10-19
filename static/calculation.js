'use strict';
(function () {
  $(document).ready(function () {


    const _configWorksheetName='ConfigSelection';

    //here we store datasources of dashboard
    var datasourcesArray = [];
    //here is the config worksheet
    var configWorksheet;
    //here is the selected configuration
    var selectedConfig;
    var yearFrom;
    var monthFrom ;
    var yearTo;
    var monthTo;



    tableau.extensions.initializeAsync().then(function () {




            getdatasourcesArray();


            //
             $('#loading').addClass('hidden');
    });




var getSelectedConfig=function(){
    if (configWorksheet){
        configWorksheet.getSelectedMarksAsync().then(function (marks) {
                // Get the first DataTable for our selected marks (usually there is just one)
                const worksheetData = marks.data[0];
                // Map the data into a format for display, etc.
                const data = worksheetData.data.map(function (row, index) {
                            const rowData = row.map(function (cell) {
                              return cell.formattedValue;
                            });

                            return rowData;
                          });
                const coldata = worksheetData.columns.map(function (row, index) {


                            return row.fieldName;
                          });

                var selectedData = {};
                for (let i=0;i<coldata.length;i++){
                    selectedData[coldata[i]]=data[0][i];
                }


                selectedConfig= selectedData;
                $('#companyData').val(selectedData["Companycode"]);
                $('#configurationData').val(selectedData["Configuration Descr" ]);
                var dtfrom = selectedData["Start Date"];
                var dtTo = selectedData["End Date"];
                yearFrom = dtfrom.split("/")[2];
                monthFrom = dtfrom.split("/")[1];
                yearTo=dtTo.split("/")[2];
                monthTo = dtTo.split("/")[1];
                $("#dateFromData").val(yearFrom+"-"+monthFrom);
                $("#dateToData").val(yearTo+"-"+monthTo);
                //this is to be sure that selected dates comply with dates of configuration
                $("#dateFromData").on('change',checkDateFrom);
                $("#dateToData").on('change',checkDateTo);


        });
    }
};//end of var getSelectedConfig=function


var checkDateFrom=function(){
    alert('date from');
};//end var checkDateFrom=function
var checkDateTo=function(){
    alert('date to');
};//end var checkDateTo=function

var getdatasourcesArray = function(){
      // Since dataSource info is attached to the worksheet, we will perform
      // one async call per worksheet to get every dataSource used in this
      // dashboard.  This demonstrates the use of Promise.all to combine
      // promises together and wait for each of them to resolve.
      const dataSourceFetchPromises = [];

      // Maps dataSource id to dataSource so we can keep track of unique dataSources.
      const dashboardDataSources = {};

      // To get dataSource info, first get the dashboard.
      const dashboard = tableau.extensions.dashboardContent.dashboard;

      // Then loop through each worksheet and get its dataSources, save promise for later.
      dashboard.worksheets.forEach(function (worksheet) {
        dataSourceFetchPromises.push(worksheet.getDataSourcesAsync());

                if (worksheet.name===_configWorksheetName){
                        configWorksheet=worksheet;
                        /// Add an event listener for the selection changed event on this sheet.
                        // Assigning the event to a variable just to make the example fit on the page here.
                        const markSelection = tableau.TableauEventType.MarkSelectionChanged;

                        var unregisterEventHandlerFunction = worksheet.addEventListener(markSelection, function (selectionEvent) {
                                // When the selection changes, reload the data
                                getSelectedConfig();
                        });
                }



                  Promise.all(dataSourceFetchPromises).then(function (fetchResults) {
                    fetchResults.forEach(function (dataSourcesForWorksheet) {
                      dataSourcesForWorksheet.forEach(function (dataSource) {
                        if (!dashboardDataSources[dataSource.id]) { // We've already seen it, skip it.
                          dashboardDataSources[dataSource.id] = dataSource;
                          datasourcesArray.push(dataSource);
                        }
                      });
                    });
                     });


      });

};//end of var getdatasourcesArray



//end of file
 });
 })();