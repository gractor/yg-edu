var pagination = Object.create({}, {
  page : { //현재 페이지
    get: function(){
      return this._page;
    },
    set : function(page){
      if( page <= 0)
      this._page = 1;
      else this._page = page;
    }
  },

  recordsPerPage : { //
    get : function(){
      return this._recordsPerPage;
    },
    set : function(recordsPerPage){
      if (recordsPerPage <= 0 || recordsPerPage > 100){
        this._recordsPerPage = 10;
      } else {
        this._recordsPerPage = recordsPerPage;
      }
      this._recordsPerPage = recordsPerPage;
    }
  },

  startPage : { // 시작페이지
    get : function(){
      return this._startPage;
    }
  },

  endPage : { // 끝 페이지
    get : function(){
      return this._endPage;
    }
  },

  display_page_num : { //화면 하단에 보여줄 page 링크 수
    get : function(){
      this._display_page_num = 10;
      return this._display_page_num;
    }
  },

  startRecord : {
    get : function(){
      return (page-1)*recordsPerPage;
    }
  },

  isPrev : {
    get : function(){
      return this._isPrev;
    }
  },

  isNext : {
    get : function(){
      return this._isNext;
    }
  },

  calculate : {
    endPage : parseInt(Math.ceil(page/parseFloat(display_page_num))*display_page_num),
    startPage : endPage - display_page_num + 1
  }

});

pagination.page = 10;

console.log(pagination.page);
console.log(pagination.display_page_num);
