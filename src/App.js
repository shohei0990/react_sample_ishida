// 必要なモジュールとコンポーネントをインポート
import React, { useEffect, useState } from "react";
import {
  ChakraProvider,
  VStack,
  Editable,
  EditableInput,
  EditablePreview,
  Button,
  Box,
} from "@chakra-ui/react";
import axios from "axios";

const App = () => {
  // FastAPIのエンドポイント
  const url = "http://127.0.0.1:8000/";
  //const url = "https://webapp-class1to4-4.azurewebsites.net/";

  // ステートの初期化
  const [buyproducts, setProducts] = useState([]); // 購入する商品のリスト
  const [product, setProduct] = useState({
    // 現在選択されている商品
    productcode: "",
    NAME: "",
    PRICE: "",
  });
  const [totalprice, setTotalprice] = useState(0); // 合計金額
  const [cart, setCart] = useState(["", ""]); // カート内の商品
  const groupedProducts = []; // グループ化された商品（名前でグループ化）
  let [code, setCode] = useState(0); // 商品コード

  // 商品コードを使って商品情報を取得
  const ClickGet = async () => {
    console.log("ClickGet started"); // 関数が呼び出されたことを確認
    try {
      // 商品コードを使ってFASTAPIから商品情報を取得
      const response = await axios.get(url + "search_product/" + code);
      console.log("Response received:", response.data); // 受け取ったデータを出力

      if (response.data === "null") {
        // 商品が存在しない場合
        setProduct({ id: "null", NAME: "商品がマスタ未登録です", PRICE: "" });
      } else {
        // 商品が存在する場合、その情報をセット
        setProduct({
          NAME: response.data.product_name,
          PRICE: response.data.product_price,
        });
      }
    } catch (error) {
      console.error("Error submitting data:", error); // エラー情報を出力
    }
    console.log("ClickGet finished"); // 関数が終了したことを確認
  };

  // 商品をカートに追加
  const clickAdd = () => {
    if (product.PRICE !== "") {
      // 商品の価格が存在する場合のみカートに追加
      const newproducts = [...buyproducts];
      newproducts.push(product);
      setProducts(newproducts);
    }
  };

  // カート内の商品を集計
  useEffect(() => {
    // buyproducts（購入予定の商品リスト）を一つずつ処理
    buyproducts.forEach((product) => {
      // すでにカートに存在する商品かどうかをチェック
      const existingProduct = groupedProducts.find(
        (groupedProduct) => groupedProduct.name === product.NAME
      );
      if (existingProduct) {
        // すでに存在する商品の場合、数量と合計価格を更新
        existingProduct.count++;
        existingProduct.totalPrice += product.PRICE;
      } else {
        // 新しい商品の場合、カートに追加
        groupedProducts.push({
          name: product.NAME,
          price: product.PRICE,
          count: 1,
          totalPrice: product.PRICE,
        });
      }
    });

    // カートの状態（UI）を更新
    setCart(
      groupedProducts.map((product) => (
        <li key={product.name}>
          {product.name} × {product.count} {product.price}円 計
          {product.totalPrice}円
        </li>
      ))
    );
  }, [buyproducts]);
  // setTotalprice(buyproducts.reduce((total, product) => total + product.PRICE, 0));

  // 商品を購入（ここではFastAPIにPOSTリクエストを送っています）
  const clickBuy = async () => {
    // 購入データの作成
    const buy_data = {
      EMP_CD: 12, // 従業員コード
      STORE_CD: 30, // 店舗コード
      POS_NO: 90, // POS機ID
      BUYPRODUCTS: buyproducts, // 購入する商品リスト
    };
    try {
      // FastAPIにPOSTリクエストを送信
      console.log(buy_data); // 送信するデータ
      const response = await axios.post(url + "buy_product/", buy_data);

      // 合計金額（税抜きと税込み）をステートに保存
      setTotalprice([response.data.total_amount, response.data.total_amount_with_tax]);

      // アラートで合計金額を表示
       // アラートで合計金額を表示
      alert(
        `合計金額は${response.data.total_amount}円(税抜)、${response.data.total_amount_with_tax}円（税込）です。`
      );

      // 購入後は商品リストと選択中の商品をクリア
      setProducts([]);
      setProduct("");
    } catch (error) {
      // エラーが発生した場合はコンソールに出力
      console.error("Error submitting data:", error);
    }
  };

  // UIのレンダリング
  return (
    <>
      <ChakraProvider>
        <VStack p={10} spacing="4">
          <Editable
            w="250px"
            borderWidth="1px"
            borderRadius="lg"
            defaultValue="コードを入力してください"
          >
            <EditablePreview />
            <EditableInput
              type="text"
              id="code"
              placeholder="コードを入力してください"
              onChange={(e) => {
                setCode(e.target.value);
              }}
            />
          </Editable>
          <Button colorScheme="blue" onClick={ClickGet}>
            商品コードの読み込み
          </Button>
          <div>
            <h3>{product["NAME"]}</h3>
            <h3>
              {product["PRICE"]}
              {product["PRICE"] === "" ? "" : "円"}
            </h3>
          </div>
        </VStack>
        <VStack p={2} spacing="10">
          <Button colorScheme="blue" onClick={clickAdd}>
            商品の追加
          </Button>
          <h3>購入商品一覧</h3>
          <Box
            w="400px"
            h="300px"
            color="black"
            borderWidth="1px"
            borderRadius="lg"
          >
            {cart}
          </Box>
          <Button colorScheme="blue" onClick={clickBuy}>
            購入する
          </Button>
        </VStack>
      </ChakraProvider>
    </>
  );
};

export default App;
