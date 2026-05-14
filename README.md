# CD Markets 網站設計預覽

香港持牌貴金屬交易商 CD Markets (CloudData System Limited) 的網站設計預覽倉庫。

## 線上預覽

https://kennethchua12.github.io/cd-markets-preview/

## 規格

- 客戶: CD Markets / CloudData System Limited
- 設計風格: Bloomberg-Saxo 經紀商終端風
- 響應式: 桌面 / 平板 / 手機 / 超小手機 (iPhone SE) 四斷點
- 部署: GitHub Pages (main branch / root)

## 操作記錄

所有變更走「GitHub 寫入鐵則 v3」流程，每次重大修改前會 push 備份檔保留可回滾點。

- 備份檔命名: `<原檔>.bak_<任務>_YYYYMMDD_HHMMSS.<副檔名>`
- commit message: `[類型] 主檔: 說明 · 備份 備份檔名`
- 類型: feat / fix / style / revert

## 規範由來

2026-05-13/14 期間發生 4 次 push 大檔失誤導致網站短暫不可用，
事後建立「5 道閘門」與「md5sum 雙向比對」強制動作確保不再重演。

---

*Repository maintained by Kennethchua12 · 2026*
