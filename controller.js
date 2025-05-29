function Submit() {
  // 検索値を取得  
  var searchWord = document.getElementById('input').value;
  console.log("検索値：" + searchWord);

    if (searchWord.startsWith('http')) {
      // 検索値がhtmlの場合
      console.log("URLで検索します");
    } else {
      // 検索値が単語の場合
      console.log("単語で検索します");

      // 全角スペースは半角スペースに統一
      searchWord = searchWord.replace(/　/g, " ");

      // スペースで区切って配列にいれる
      var searchList = searchWord.split(" ");

      // [あ, い, う] → [あ+い+う]
      // URLに組み込むため、複数ワードの場合はワードを+で繋いでいく(URL用にエンコードする)
      var wordsUrl = "";
      for (let i = 0; i < searchList.length; i++) {
        if (i != searchList.length - 1) {
          wordsUrl += encodeURIComponent(searchList[i]);
          wordsUrl += "+";
        } else {
          wordsUrl += encodeURIComponent(searchList[i]);
        }
      }

      // 楽天用のサーチ用URLを組み立てて検索
      var searchUrl = "https://search.rakuten.co.jp/search/mall/" + wordsUrl + "/";
      console.log("作成URL：" + searchUrl);

      debugger;
      // 楽天を検索
      fetch(searchUrl)
      .then(response => response.text())
      .then(data => { console.log(data) })
      .catch(error => { console.log('通信に失敗しました:' + error) })

      // // Amazon用のサーチ用URLを組み立てて検索
      // fetch(searchWord)
      // .then(response => response.text())
      // .then(data => { console.log(data) })
      // .catch(error => { console.log('通信に失敗しました') })

    }
    
  }