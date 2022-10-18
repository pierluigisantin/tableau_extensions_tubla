'use strict';
(function () {
  $(document).ready(function () {
    tableau.extensions.initializeAsync().then(function () {

            //let's fill in the GUI controls with required data
            $.ajax(
            {
                url :'../../../companies',
                method:'GET',
                success:function(res){
                      debugger;
                }
            });




            //
             $('#loading').addClass('hidden');
    });




 });
 })();