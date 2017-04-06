$(document).ready(function(){

$('#btn_remove').on('click',function(){
  var ck = new Array();
  $('.ck:checked').each(function(index,item){
      ck.push($(item).val());
  });
  $.ajax({
      url:'/remove',
      type:'GET',
      data:{ck:ck},
      success:function(data){
          alert(data+'삭제');
          $('#btn_list').trigger('click');
      }
  });
});


$('#btn_add').on('click',function(){
  var id = $('#id').val();
  var pw = $('#pw').val();
  var name = $('#name').val();
  var age = $('#age').val();
  var gender = $('#gender').val();

  $.ajax({
      url:'/add',
      type:'POST',
      data:{id:id,pw:pw,name:name,age:age,gender:gender},
      success:function(data){
          alert(data+'님 추가');
          $('#btn_list').trigger('click');
      }
  });
});

$('#btn_modify').on('click',function(){
  var id = $('#id').val();
  var pw = $('#pw').val();
  var name = $('#name').val();
  var age = $('#age').val();
  var gender = $('#gender').val();

  $.ajax({
      url:'/modifyById',
      type:'POST',
      data:{id:id,pw:pw,name:name,age:age,gender:gender},
      success:function(data){
          alert(data+'님 수정');
          $('#btn_list').trigger('click');
      }
  });
});

$('#btn_list').on('click',function(){
  $.ajax({
      url:'/list',
      type:'GET',
      success:function(data){
          $('#list').empty();
          $(data).each(function(index,item){
              $('#list').append('<tr>');
              $('#list').append('<td><input type="checkbox" class="ck" value="'+item.id+'"></td>');
              $('#list').append('<td>'+item.id+'</td>');
              $('#list').append('<td>'+item.pw+'</td>');
              $('#list').append('<td>'+item.name+'</td>');
              $('#list').append('<td>'+item.age+'</td>');
              $('#list').append('<td>'+item.gender+'</td>');
              $('#list').append('</tr>');
          });
      }
  });
});
});
