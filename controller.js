document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchForm').addEventListener('submit', async e => {
    e.preventDefault();

    const searchWord = document.getElementById('input').value.trim();
    const applicationId = '1076040825352058300'; // 楽天API
    const encodedKeyword = encodeURIComponent(searchWord.replace(/　/g, " "));

    // 初期化
    document.getElementById('resultAm').innerHTML = "";
    document.getElementById('resultRk').innerHTML = "";

    // 空欄で検索したときは文字列を返す
    if (searchWord === '') {
      resultRk.innerHTML = "<p>検索文字を入力してね</p>";
      resultAm.innerHTML = "<p>検索文字を入力してね</p>";
      return;
    }

    // --- ✅ Amazon RapidAPI 検索 ---

    // const amazonUrl = `https://amazon-product-search-api.p.rapidapi.com/?keyword=${encodedKeyword}&country=JP`;
    const amazonUrl = `https://axesso-axesso-amazon-data-service-v1.p.rapidapi.com/amz/amazon-search-by-keyword-asin?domainCode=co.jp&keyword=${encodedKeyword}&page=1&excludeSponsored=false&sortBy=relevanceblender&withCache=true`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'e5a257a5c8msh20d967d66858b76p144693jsn0bd80caad637',
        'x-rapidapi-host': 'axesso-axesso-amazon-data-service-v1.p.rapidapi.com'
      }
    };
    


    try {
      const res = await fetch(amazonUrl, options);
      console.log("Amazon APIステータスコード:", res.status);

      if (!res.ok) throw new Error(`Amazon APIエラー: ${res.status}`);
      const amazonData = await res.json();

      const resultAm = document.getElementById('resultAm');
      if (amazonData.foundProducts.length === 0) {
        resultAm.innerHTML = "<p>Amazonで該当商品が見つかりませんでした。</p>";
      } else {
        const products = amazonData.searchProductDetails;
        products.forEach(product => {
          const p = document.createElement("p");
          p.innerHTML = `
            <div class="result">
              <img src="${product.imgUrl || ""}" alt="商品画像" class="thumbnail"><br>
              <a href="${product.dpUrl || "#"}" target="_blank"><strong>${product.productDescription || "商品名なし"}</strong></a><br>
              価格: ¥${product.price || "価格なし"}<br><br>

            </div>
          `;
          resultAm.appendChild(p);
        });
      }
    } catch (err) {
      console.error("Amazon API失敗", err);
      document.getElementById('resultAm').innerHTML = "<p>Amazonの検索中にエラーが発生しました。</p>";
    }

    // --- ✅ 楽天API 検索 ---
    try {
      const rakutenUrl = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?applicationId=${applicationId}&keyword=${encodedKeyword}`;
      const res = await fetch(rakutenUrl);
      if (!res.ok) throw new Error("楽天APIエラー");

      const text = await res.text();
      const data = JSON.parse(text);
      const resultRk = document.getElementById('resultRk');
      resultRk.innerHTML = "";

      if (data.Items.length === 0) {
        resultRk.innerHTML = "<p>楽天で該当商品が見つかりませんでした。</p>";
        return;
      }

      data.Items.forEach(obj => {
        const item = obj.Item;
        const html = `
          <div class="result">
            <img src="${item.mediumImageUrls[0].imageUrl}" alt="商品画像" class="thumbnail"><br>
            <a href="${item.itemUrl}" target="_blank"><strong>${item.itemName}</strong></a><br>
            価格: ¥${item.itemPrice}<br><br>
          </div>
        `;
        resultRk.innerHTML += html;
      });
    } catch (e) {
      console.error("楽天API失敗", e);
      document.getElementById('resultRk').innerHTML = "<p>楽天の検索中にエラーが発生しました。</p>";
    }
  });
});
