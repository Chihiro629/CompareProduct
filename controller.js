document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchForm').addEventListener('submit', e => {
    e.preventDefault();
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

      // - - - 楽天 - - - //
      const applicationId = '1076040825352058300'; // API
      const encodedKeyword = encodeURIComponent(searchWord);
      const searchUrl = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?applicationId=${applicationId}&keyword=${encodedKeyword}`;
      
      console.log("最終的な検索URL:", searchUrl);

      fetch(searchUrl)
      .then(response => {
        console.log("レスポンスオブジェクト:", response);
        if (!response.ok) {
          throw new Error('サーバーエラー');
        }
        return response.text();  // ← まずは生のレスポンスを見る
      })
      .then(text => {
        try {
          const data = JSON.parse(text);  // 手動でJSONに変換してみる
    
          // 表示処理
          const resultDiv = document.getElementById('resultRk');
          resultDiv.innerHTML = "";
          if (data.Items.length === 0) {
            resultDiv.innerHTML = "<p>該当する商品は見つかりませんでした。</p>";
            return;
          }
          data.Items.forEach(obj => {
            console.log("HTMLを発行します");
            const item = obj.Item;
            const itemElement = document.createElement("p");
            itemElement.innerHTML = `
              <strong>${item.itemName}</strong><br>
              価格: ¥${item.itemPrice}<br>
              <a href="${item.itemUrl}" target="_blank">商品リンク</a><br><br>
            `;
            resultDiv.appendChild(itemElement);
          });
    
        } catch (e) {
          console.error("JSONのパースに失敗しました", e);
        }
      })
      .catch(error => {
        console.error("通信に失敗しました", error);
      });
    }
  })
})
