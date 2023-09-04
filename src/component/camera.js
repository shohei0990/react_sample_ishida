// src/Scanner.jsx
import React from "react";
import ScanditBarcodeScanner from "scandit-sdk-react";
import { ScanSettings } from "scandit-sdk";

export const Scanner = (props) => {
   // 3. ライセンスキーの発行にて取得したキーを設定する
   const licenseKey ="<ライセンスキー>"; 

   return (
      <ScanditBarcodeScanner
         licenseKey={licenseKey}
         scanSettings={
            new ScanSettings({
               enabledSymbologies: ["code128", "ean13"],
               // 同じバーコードを複数回読み取らないようにする
               codeDuplicateFilter: -1,
            })
         }
         engineLocation="https://cdn.jsdelivr.net/npm/scandit-sdk@5.x/build"
         // スキャン結果がscanResultとして渡される
         onScan={(scanResult) => props.handleScan(scanResult)} 
      />
   );
};

export default Scanner