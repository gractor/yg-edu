$(document).ready(function(){
  var E_R_L = $('form[role="E_R_L"]');

  var id = $('#id').val();
  var title = $('#title').val();
  var text = $('#text').val();
  var writer = $('#writer').val();

  $('#Submit').on('click', function(){
    $.ajax({
      url : '/board/write',
      type : 'post',
      data : {title:title, text:text, writer:writer},
      success : function(data){
        alert('게시물을 등록하였습니다.');
      }

    });
    E_R_L.attr('action','/board/write');
    E_R_L.attr('method','post');
    E_R_L.submit();
  });
});
