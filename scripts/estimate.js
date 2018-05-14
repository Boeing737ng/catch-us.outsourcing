$("input[name=area]").change(function(){
    if($(this).is(':checked')) {
        $(".area").attr('disabled', 'disabled');
    } else {
        $(".area").removeAttr('disabled');
    }
});