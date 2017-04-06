const http = require('http');
//require - http모듈(부품)이 필요하다
//리턴값이 있어서 변수에 담음
//const 상수 - 한번 할당되면 값을 바꿀 수 없음
//한번 로드해놓으면 바꿀 이유가 없기 때문에



const hostname = '127.0.0.1';
const port = 1337;

var server = http.createServer(function(req, res){
  res.writeHead(200, 'Content-Type', 'text/plain');
  res.end('Hello World\n');
});
server.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});
//목록 에이작스
$.ajax({
  url:'/board',
  type:'GET',
  data:{id:id, description:description, author:author},
  success:function(data){
    $('#board_view').empty();
    $(data).each(function(index,item){
      console.log(data);
      $('#board_view').append('<ul>');
      $('#board_view').append('<li>'+item.id+'</li>');
      $('#board_view').append('<li>'+item.name+'</li>');
      $('#board_view').append('<li>'+item.date+'</li>');
      $('#board_view').append('<li>'+item.text+'</li>');
      $('#board_view').append('<li>'+item.pass+'</li>');
      $('#board_view').append('</ul>');
    });
  }
})

});
});
//
