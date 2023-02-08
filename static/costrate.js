(function () {
  $(document).ready(function () {
    const _worksheetname = 'CostRatesForMod';
    const _secundaryworksheetname='CalcBomExps';
    const _userWorksheetName='current_user';
    const _calcStatusWorksheetName='current_calc_status';
    const _calcidParamName ='pCalcId';
    var _calc_status;
    var _worksheet;
    var _calc_id;
    var _username;
    var _selectedRow;
    var _datasource;
    var _secundarydatasource;

     tableau.extensions.initializeAsync().then(function () {
            //do some init
            var now=new Date();
            var day=("0"+now.getDate()).slice(-2);
            var month=("0"+(now.getMonth()+1)).slice(-2);
            var today = now.getFullYear()+"-"+(month)+"-"+(day);
            $('#dateForPriceList').val(today);

            const dashboard = tableau.extensions.dashboardContent.dashboard;
            dashboard.worksheets.forEach(function (worksheet) {
                if (worksheet.name===_worksheetname){
                    worksheet.findParameterAsync(_calcidParamName).then(function(p){
                       if (p)
                          _calc_id=p.currentValue.nativeValue;
                    });
                }
            });


            //attach listener select on tableau

            dashboard.worksheets.forEach(function (worksheet) {
                if (worksheet.name===_worksheetname){
                    _worksheet=worksheet;

                    _worksheet.getDataSourcesAsync().then(function(datasources){
                        datasources.forEach(function(ds){
                            _datasource=ds;
                            _datasource.refreshAsync();
                        });
                    });








                    const markSelection = tableau.TableauEventType.MarkSelectionChanged;

                     var unregisterEventHandlerFunction = _worksheet.addEventListener(markSelection, function (selectionEvent) {
                                // When the selection changes, load the data
                                getSelection();
                        });
                }

                     if (worksheet.name===_secundaryworksheetname){


                        worksheet.getDataSourcesAsync().then(function(datasources){
                            datasources.forEach(function(ds){
                                _secundarydatasource=ds;
                                _secundarydatasource.refreshAsync();
                            });
                        });
                        }



                      if (worksheet.name===_userWorksheetName){
                        worksheet.getSummaryDataAsync().then(function(sumdata){
                        _username=sumdata.data[0][0].value;
                        });
                        }
                        if (worksheet.name===_calcStatusWorksheetName){
                        worksheet.getSummaryDataAsync().then(function(sumdata){
                        _calc_status=sumdata.data[0][0].value;
                        if (_calc_status===100){
                            //button can be enabled
                            $('#runButton').prop('disabled',false);
                        }
                        else{
                            $('#divMsg').html('status of calculation of cost rates makes it not modifyable');
                        }
                        });
                        }


            });



                $("#submitButton").on('click',submitClick);
                $("#runButton").on('click',runClick);
                $('#loading').addClass('hidden');
     });


     var runClick=function(){
        var runData={
                calc_id: _calc_id,
                user_name: _username,
                calc_name: $('#calcNameData').val(),
                calc_code:$('#calcCodeData').val(),
                date_for_price_list:$('#dateForPriceList').val()
            };

            $.ajax({
            url:"../calculation_bom_explosion",
            method:"POST",
            contentType:'application/json',
            data : JSON.stringify(runData),
            error: function(){alert("error in posting data");},
            success: function(){
                _secundarydatasource.refreshAsync();
                alert("pricing process successfully started");

            }
        });
     };

    var submitClick = function(){
        var submitdata={
            calc_id: _calc_id,
            user_name: _username,
            cost_center: _selectedRow["Cost Center"],
            cost_type: _selectedRow["Cost Type"],
            new_value: $('#txtNewValue').val(),
            delta: $('#txtDelta').val()
        };

         $.ajax({
            url:"../costrate",
            method:"POST",
            contentType:'application/json',
            data : JSON.stringify(submitdata),
            error: function(){alert("error in posting data");},
            success: function(){
                _datasource.refreshAsync();
            }
        });
    };

     var getSelection = function()  {
         _worksheet.getSelectedMarksAsync().then(function (marks) {
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

                //now we can fill the table
                _selectedRow=selectedData;
                _calc_id=selectedData["Calc Id"];
                $('#txtNewValue').val(selectedData["SUM(New Value)"]);
                $('#txtDelta').val(selectedData["SUM(Delta)"]);
                $('#txtCostRate').text(selectedData["SUM(Cost Rate)"]);
                $('#txtCostCenter').text(selectedData["Cost Center"]);
                $('#txtCostType').text(selectedData["Cost Type"]);

                if (_calc_status===100){
                            //button can be enabled
                            $('#submitButton').prop('disabled',false);
                        }


         });
     };


});



})();