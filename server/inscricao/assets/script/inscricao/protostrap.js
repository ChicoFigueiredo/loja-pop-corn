        
        
       $(function () {

           
           var content = $("#formentry"); 

           $('[data-role="select"]', content).siblings(".k-dropdown-wrap").remove()
           $('[data-role="select"]', content).removeAttr("disabled");
           $('[data-role="select"]', content).kendoDropDownList({ enable: true });

           $('[data-role="slider"]', content).each(function (index, element) {
               var t = $(this).clone();
               var parent = $(this).parent().parent().parent();


               parent.children().remove();
               t.css("display", "");
               parent.append(t);
               var slider = t.kendoSlider({
                   smallStep: 2,
                   largeStep: 1
               }).data("kendoSlider");

           });

           $('[data-role="date"]', content).each(function (index, element) {
               var dt = this;
               var datePicker = $(this).kendoDatePicker().data("kendoDatePicker");
               datePicker.enable();
               datePicker.value(null);
               datePicker.min(null);
               datePicker.max(null);

               if ($(this).attr("data-default") != undefined) datePicker.value(new Date($(this).attr("data-default")));
               if ($(this).attr("data-min") != undefined) datePicker.min(new Date($(this).attr("data-min")));
               if ($(this).attr("data-max") != undefined) datePicker.max(new Date($(this).attr("data-max")));

               if (($(this).attr("data-beforedate") != undefined) || ($(this).attr("data-afterdate") != undefined)) {
                   datePicker.bind("change", function () {
                       dateTimeChange($(dt).attr("id"), "kendoDatePicker");
                   });
               }

               // remove for parsley validation
               $(this).removeAttr("data-max");
               $(this).removeAttr("data-min");
           });

           $('[data-role="time"]', content).each(function (index, element) {
               var dt = this;

               var timePicker = $(this).kendoTimePicker().data("kendoTimePicker");
               timePicker.enable();
               timePicker.value(null);
               timePicker.min(null);
               timePicker.max(null);

               if ($(this).attr("data-default") != undefined) timePicker.value(new Date("1/1/1901 " + $(this).attr("data-default")));
               if ($(this).attr("data-min") != undefined) timePicker.min(new Date("1/1/1901 " + $(this).attr("data-min")));
               if ($(this).attr("data-max") != undefined) timePicker.max(new Date("1/1/1901 " + $(this).attr("data-max")));

               if (($(this).attr("data-beforedate") != undefined) || ($(this).attr("data-afterdate") != undefined)) {
                   timePicker.bind("change", function () {
                       dateTimeChange($(dt).attr("id"), "kendoTimePicker");
                   });
               }


               // remove for parsley validation
               $(this).removeAttr("data-min");
               $(this).removeAttr("data-max");
           });

           $('[data-role="datetime"]', content).each(function (index, element) {
               var dt = this;
               var dateTimePicker = $(this).kendoDateTimePicker().data("kendoDateTimePicker");
               dateTimePicker.enable();
               dateTimePicker.value(null);
               dateTimePicker.min(null);
               dateTimePicker.max(null);

               if ($(this).attr("data-default") != undefined) dateTimePicker.value(new Date($(this).attr("data-default")));
               if ($(this).attr("data-min") != undefined) dateTimePicker.min(new Date($(this).attr("data-min")));
               if ($(this).attr("data-max") != undefined) dateTimePicker.max(new Date($(this).attr("data-max")));


               if (($(this).attr("data-beforedate") != undefined) || ($(this).attr("data-afterdate") != undefined)) {
                   dateTimePicker.bind("change", function () {
                       dateTimeChange($(dt).attr("id"), "kendoDateTimePicker");
                   });
               }

               // remove for parsley validation
               $(this).removeAttr("data-min");
               $(this).removeAttr("data-max");

           });


           // Change date
           function dateTimeChange(dateTimeName, dateType) {

               var t = $('#' + dateTimeName);
               var dateTimePicker = t.data(dateType);
               var dateTimeValue = dateTimePicker.value();

               var beforeEndDate = $(t).attr("data-beforedate");

               if (beforeEndDate != undefined) {
                   var beforeDate = $(beforeEndDate, content).data(dateType);
                   if (beforeDate != undefined) {

                       beforeDate.min(null);
                       if (dateTimeValue) {
                           beforeDate.min(dateTimeValue);
                           var beforeDateValue = beforeDate.value();
                           if (beforeDateValue) {
                               //beforeDateValue = new Date(beforeDateValue);
                               //beforeDateValue.setDate(beforeDateValue.getDate());
                           }


                       }
                   }

               }

               var afterEndDate = $(t).attr("data-afterdate");
               if (afterEndDate != undefined) {
                   var afterDate = $(afterEndDate, content).data(dateType);
                   if (afterDate != undefined) {

                       afterDate.max(null);
                       if (dateTimeValue) {
                           afterDate.max(dateTimeValue);
                           var afterDateValue = afterDate.value();
                           if (afterDateValue) {
                               //afterDateValue = new Date(afterDateValue);
                               //afterDateValue.setDate(afterDateValue.getDate());
                           }


                       }
                   }
               }



           }
           // Change date end


           // numeric - step 1 - initialize numeric controls
           $('[data-role="numeric"]', content).siblings(".k-select").remove();
           $('[data-role="numeric"]', content).each(function (index, element) {
               var nm = this;
               var format = "n2";
               if ($(this).attr("data-format") != undefined) {


                   switch ($(this).attr("data-format")) {
                       case "decimal":
                           format = "n2";
                           break;
                       case "integer":
                           format = "n0";
                           break;
                       case "currency":
                           format = "c2";
                           break;
                       case "percentage":
                           format = "p0";
                           break;
                       default:
                           format = "n2";

                   }
               }

               var numeric = $(this).kendoNumericTextBox({
                   format: format,
                   enable: true
               }).data("kendoNumericTextBox");

               if ($(this).attr("data-default") != undefined) numeric.value($(this).attr("data-default"));
               if ($(this).attr("data-min") != undefined) numeric.min($(this).attr("data-min"));
               if ($(this).attr("data-max") != undefined) numeric.max($(this).attr("data-max"));

               if ($(this).attr("data-format") == "percentage") {
                   numeric.min(0);
                   numeric.max(1);
               }



           });

           // numeric - step 2 - implement min/max functionality
           $('[data-role="numeric"]', content).each(function (index, element) {
               var nm = this;

               var n = $(this).attr("data-lessthan");
               var nt = $(this, content).data("kendoNumericTextBox");
               if (n != undefined) {
                   var beforeNumber = $(n, content).data("kendoNumericTextBox");
                   beforeNumber.max(nt.min());
               }

               var n = $(this).attr("data-greaterthan");
               var nt = $(this, content).data("kendoNumericTextBox");
               if (n != undefined) {
                   var afterNumber = $(n, content).data("kendoNumericTextBox");
                   afterNumber.min(nt.max());
               }

               if (($(this).attr("data-lessthan") != undefined) || ($(this).attr("data-greaterthan") != undefined)) {
                   nt.bind("change", function () {
                       numericChange($(nm).attr("id"), "kendoNumericTextBox");
                   });
                   nt.bind("spin", function () {
                       numericChange($(nm).attr("id"), "kendoNumericTextBox");
                   });
               }

           });

           function numericChange(numericName, type) {
               var t = $("#" + numericName);
               var numericTextbox = t.data(type);
               var numericTextboxValue = numericTextbox.value();

               var n = $(t).attr("data-lessthan");
               if (n != undefined) {

                   var beforeNumber = $(n, content).data(type);
                   if (beforeNumber != null) {
                       beforeNumber.min(null)
                       if (numericTextboxValue) {
                           beforeNumber.min(numericTextboxValue);
                           var beforeNumberValue = beforeNumber.value();
                           if (beforeNumberValue) {
                               if (parseFloat(numericTextboxValue) > parseFloat(beforeNumberValue)) {
                                   beforeNumber.value(numericTextboxValue);
                               }
                           }

                       }
                   }
               }

               n = $(t).attr("data-greaterthan");
               if (n != undefined) {

                   var afterNumber = $(n, content).data(type);
                   if (afterNumber != null) {
                       afterNumber.max(null)
                       if (numericTextboxValue) {
                           afterNumber.max(numericTextboxValue);
                           var afterNumberValue = afterNumber.value();
                           if (afterNumberValue) {
                               if (parseFloat(numericTextboxValue) < parseFloat(afterNumberValue)) {
                                   afterNumberValue.value(numericTextboxValue);
                               }
                           }
                       }
                   }
               }
           }


           // Mask
           $('[data-role="mask"]', content).each(function (index, element) {
               $(this).inputmask($(this).attr('data-mask'));
           })



           // Parsley validation

           $.listen('parsley:field:validate', function () {
               validate();
           });

           $('#simulateSave').click(function () {
               $('#formentry').parsley().validate();
               validate();
           });

           $('#resetForm').click(function () {
               $('#formentry').parsley().reset();
               $('#valOk').addClass('hidden');
               $('#valErr').addClass('hidden');
           });


           var validate = function () {
               if (true === $('#formentry').parsley().isValid()) {
                   $('#valOk').removeClass('hidden');
                   $('#valErr').addClass('hidden');
               } else {
                   $('#valOk').addClass('hidden');
                   $('#valErr').removeClass('hidden');
               }
           };
           // Parsley validation - End


           

           $('[data-role="datatable"]', content).each(function (index, element) {
               $(element).bootstrapTable("destroy");

               var striped = $(element).attr("data-striped") == "true";
               var hover = $(element).attr("data-hover") == "true";
               var pagination = $(element).attr("data-pagination") == "true";
               var showrefresh = $(element).attr("data-show-refresh") == "true";
               var search = $(element).attr("data-search") == "true";
               var showcolumns = $(element).attr("data-show-columns") == "true";
               var height = $(element).attr("data-height");
               var url = $(element).attr("data-url");

               $(element).bootstrapTable({
                   hover: hover,
                   pagination: pagination,
                   striped: striped,
                   search: search,
                   showRefresh: showrefresh,
                   showColumns: showcolumns,
                   height: height,
                   url: url
               });
           });
       })

   