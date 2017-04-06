$(document).ready(function(){
  var E_R_L = $('form[role="E_R_L"]');

  var id = $('#id').val();

  $('#List').on('click', function(){
    self.location = '/board';
  });

  $('#Remove').on('click', function(){
    $.ajax({
      url : '/board/'+id+'/delete',
      type : 'post',
      data : {id:id},
      success : function(){
        alert(id+' 게시물 삭제하였습니다.');
      }

    });
    E_R_L.attr('action','/board/' + id +'/delete');
    E_R_L.attr('method','post');
    E_R_L.submit();
  });
});
