$(document).ready(function(){
  var form_obj = $('form[role="update"]')
  var idx = $('#idx').val();
  $('#Delete').on('click', function(){
    alert('삭제하였습니다.');

    form_obj.attr('action','/board/delete');
    form_obj.attr('method','post');
    form_obj.submit();
  });

  $('#List').on('click', function(){
    form_obj.attr('action','/board');
    form_obj.attr('method','get');
    form_obj.submit();
  });
});
