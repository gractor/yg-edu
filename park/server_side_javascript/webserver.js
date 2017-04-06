/*웹 서버를 여는 코드*/
const http = require('http');   //require함수 : 무언가를 요구 하다, 필수적이다 라는 뜻 밑에 있는 애플리케이션을 수행하기 위해 'http'라는것이 필요하다.리턴값은 담음
//const(변수이긴 한데 상수이다. 한번 할당되면 변경 되지 않는다.) = content의 약자 http라는 변수에 http라는 모듈을 담은 것

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
