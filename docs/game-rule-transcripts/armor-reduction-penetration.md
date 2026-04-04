# 轉寫：護甲減傷穿透（權威文字）

**來源**：使用者提供之遊戲內規則文字（4E-0）。  
**對應 manifest**：`data/raw/ss12/global-rules/screenshot-sources.json` → `topicId: armor_reduction_penetration`  
**目的**：後續 normalize 之 source of truth；本檔僅轉寫，不含公式或 runtime 接線。

---

## E. 護甲減傷穿透（完整轉寫）

1. 在計算擊中傷害時，若攻擊方擁有護甲減傷穿透，會從防守方的護甲減傷比例中扣除相應的值。

2. 護甲減傷穿透不改變實際的護甲值。

3. 護甲減傷穿透可以將護甲減傷比例降低到負值，並以對應數值額外增加防守方受到的傷害。

---

## blocked_needs_user_rule（不可腦補演算法）

- 加劇、收割、受傷轉移、受傷緩衝、格擋、避免傷害、重創、特殊融合類加成完整公式：見來源章節 I。
