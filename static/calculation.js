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
                    res.data.forEach(function(r){
                        $('#companyData').append(new Option(r.company_name,r.company_name));

                    });
                }
            });




            //
             $('#loading').addClass('hidden');
    });




 });
 })();