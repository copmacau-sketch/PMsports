<?php
function rules($langx="zh-cn",$type="general",$artjson){
    $js = "";
    $js .= '
        var artjson = {
            "ART_ru_title": "'.$artjson["ART_ru_title"].'",
            "ART_ru_select": "'.$artjson["ART_ru_select"].'",
        
            "ART_ru_general": "'.$artjson["ART_ru_general"].'",
            "ART_ru_outright": "'.$artjson["ART_ru_outright"].'",
            "ART_ru_multiples": "'.$artjson["ART_ru_multiples"].'",
            "ART_ru_soccer": "'.$artjson["ART_ru_soccer"].'",
            "ART_ru_basketball": "'.$artjson["ART_ru_basketball"].'",
            "ART_ru_tennis": "'.$artjson["ART_ru_tennis"].'",
            "ART_ru_volleyball": "'.$artjson["ART_ru_volleyball"].'",
            "ART_ru_badminton": "'.$artjson["ART_ru_badminton"].'",
            "ART_ru_table_tennis": "'.$artjson["ART_ru_table_tennis"].'",
            "ART_ru_baseball": "'.$artjson["ART_ru_baseball"].'",
            "ART_ru_snooker": "'.$artjson["ART_ru_snooker"].'",
            "ART_ru_usa_football": "'.$artjson["ART_ru_usa_football"].'",
            "ART_ru_archery": "'.$artjson["ART_ru_archery"].'",
            "ART_ru_athletic": "'.$artjson["ART_ru_athletic"].'",
            "ART_ru_aussie": "'.$artjson["ART_ru_aussie"].'",
            "ART_ru_beach_soccer": "'.$artjson["ART_ru_beach_soccer"].'",
            "ART_ru_beach_volleyball": "'.$artjson["ART_ru_beach_volleyball"].'",
            "ART_ru_boxing": "'.$artjson["ART_ru_boxing"].'",
            "ART_ru_cricket": "'.$artjson["ART_ru_cricket"].'",
            "ART_ru_cycling": "'.$artjson["ART_ru_cycling"].'",
            "ART_ru_darts": "'.$artjson["ART_ru_darts"].'",
            "ART_ru_e_sports": "'.$artjson["ART_ru_e_sports"].'",
            "ART_ru_field_hockey": "'.$artjson["ART_ru_field_hockey"].'",
            "ART_ru_financial_bets": "'.$artjson["ART_ru_financial_bets"].'",
            "ART_ru_futsal": "'.$artjson["ART_ru_futsal"].'",
            "ART_ru_golf": "'.$artjson["ART_ru_golf"].'",
            "ART_ru_gymnastics": "'.$artjson["ART_ru_gymnastics"].'",
            "ART_ru_handball": "'.$artjson["ART_ru_handball"].'",
            "ART_ru_ice_hockey": "'.$artjson["ART_ru_ice_hockey"].'",
            "ART_ru_judo": "'.$artjson["ART_ru_judo"].'",
            "ART_ru_lacrosse": "'.$artjson["ART_ru_lacrosse"].'",
            "ART_ru_medal_betting": "'.$artjson["ART_ru_medal_betting"].'",
            "ART_ru_motor_sports": "'.$artjson["ART_ru_motor_sports"].'",
            "ART_ru_olympics": "'.$artjson["ART_ru_olympics"].'",
            "ART_ru_rowing": "'.$artjson["ART_ru_rowing"].'",
            "ART_ru_rugby_league": "'.$artjson["ART_ru_rugby_league"].'",
            "ART_ru_softball": "'.$artjson["ART_ru_softball"].'",
            "ART_ru_tamp": "'.$artjson["ART_ru_tamp"].'",
            "ART_ru_water_polo": "'.$artjson["ART_ru_water_polo"].'",
            "ART_ru_weightlifting": "'.$artjson["ART_ru_weightlifting"].'",
            "ART_ru_wintersports": "'.$artjson["ART_ru_wintersports"].'",
    ';
    switch ($type){
        case "outright":
            switch ($langx){
                case "zh-tw":
                    $js.= '
                    "ART_ru_h1_outright": "冠軍投注",
                    "ART_ru_lastdate": "最後更新日期:",
                    "ART_ru_date": "04/03/2020",
                
                    "ART_ru_outright_a": "冠軍市場是提供預測一場賽事，聯賽，錦標賽或賽車最終是否可以獲得冠軍。冠軍市場包括以下類型（不僅限於此）：",
                    "ART_ru_outright_a_1": "一個比賽的最終結果，例如：世界杯冠軍或F1車手冠軍。",
                    "ART_ru_outright_a_2": "小組賽回合的最終結果，例如：世界杯小組賽冠軍。",
                    "ART_ru_outright_a_3": "一場賽事的最終結果，例如：一個球隊從半決賽到決賽，不管比分，是否有加時賽或點球。",
                    "ART_ru_outright_a_4": "賽車的最終結果，例如：F1賽事的個人冠軍。",
                    "ART_ru_outright_a_5": "一場比賽的最高得分者。",
                    "ART_ru_outright_a_6": "獲得最有價值球員等。",
                
                    "ART_ru_rule": "一般規則",
                    "ART_ru_outright_b_1": "聯賽的派彩將以官方來源或相關體育權威機構判定的結果為準。",
                    "ART_ru_outright_b_2": "無論挑選的人或球隊是否有參與，所有冠軍投注都視為有效。",
                    "ART_ru_outright_b_3": "並列名次規則適用於冠軍投注市場。",
                    "ART_ru_outright_b_4": "無論在什麼情況下，如果名稱使用「任何其他球員」或「任何其他球隊」 將被視為代替無名稱的參賽者。",
                    "ART_ru_outright_b_5": "如果體育項目有特殊規則，則將取代一般冠軍規則。",
                    "ART_ru_outright_b_6": "任何特定月份相關的冠軍投注：市場將會在上一個月最後一天的23:59(英國時間)暫停。延遲或取消賽事將不影響賽果。如果是由於人為錯誤或技術故障而沒有關閉市場，公司有權利取消利用此錯誤下注的所有注單。",
                    "ART_ru_outright_b_7": "足球冠軍投注僅適用於常規賽季（除非另作說明）。整個賽季賽程結束後球隊最終的排名來決定冠軍。季後賽或隨後查詢(潛在扣分)各自聯賽將不計算在最終賽果。",
                    ';
                    break;
                case "en-us":
                    $js.= '
                    "ART_ru_h1_outright": "OUTRIGHT",
                    "ART_ru_lastdate": "Last Update:",
                    "ART_ru_date": "04/03/2020",
                
                    "ART_ru_outright_a": "An Outright market provides betting on the winner of an event, competition, tournament or race. This includes, but is not limited to the following:",
                    "ART_ru_outright_a_1": "The final outcome of a competition, i.e. World Cup winner or F1 Driver\'s Champion.",
                    "ART_ru_outright_a_2": "The final outcome of a preliminary round, i.e. Group winner in World Cup.",
                    "ART_ru_outright_a_3": "The final outcome of a match, i.e. the team that qualifies from a semi-final match to the final, regardless of score, extra-time, penalty kicks.",
                    "ART_ru_outright_a_4": "The final outcome of a race, e.g. individual winner of a F1 race.",
                    "ART_ru_outright_a_5": "The top scorer in a competition.",
                    "ART_ru_outright_a_6": "MVP award winners etc.",
                
                    "ART_ru_rule": "GENERAL RULES",
                    "ART_ru_outright_b_1": "All Outright bets are settled on the results stated by the official governing body of each league or competition.",
                    "ART_ru_outright_b_2": "All outright bets are considered valid regardless of whether the selection participates or not.",
                    "ART_ru_outright_b_3": "Dead Heat rules apply to outright betting markets.",
                    "ART_ru_outright_b_4": "Wherever the term \"Any Other Player\" or \"Any Other Team\", etc. is used, this will refer to all competitors who are unnamed in the market.",
                    "ART_ru_outright_b_5": "Sports that have rules for individual outright markets shall supersede these general outright rules where applicable.",
                    "ART_ru_outright_b_6": "For Outright bets relating to the end of any specific month: The market will be suspended at 23:59 UKT on the last day of the previous month. Postponed or cancelled events will have no bearing on the result. Should the market not be closed due to human or machine error after certain result is apparent, then the company has the right to void all bets that take advantage of such mistakes.",
                    "ART_ru_outright_b_7": "Outright betting (for Football) is for the regular season only unless otherwise stated. The finishing position of teams at the end of the scheduled fixture of matches will determine placing. Play-offs or subsequent enquiries (and potential point deductions) by the respective leagues will not be counted towards the final result.",

                    ';
                    break;
                default:
                    $js .= '
                        "ART_ru_h1_outright": "冠军投注",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "04/03/2020",
                    
                        "ART_ru_outright_a": "冠军市场是提供预测一场赛事，联赛，锦标赛或赛车最终是否可以获得冠军。冠军市场包括以下类型（不仅限于此）：",
                        "ART_ru_outright_a_1": "一个比赛的最终结果，例如：世界杯冠军或F1车手冠军。",
                        "ART_ru_outright_a_2": "小组赛回合的最终结果，例如：世界杯小组赛冠军。",
                        "ART_ru_outright_a_3": "一场赛事的最终结果，例如：一个球队从半决赛到决赛，不管比分，是否有加时赛或点球。",
                        "ART_ru_outright_a_4": "赛车的最终结果，例如：F1赛事的个人冠军。",
                        "ART_ru_outright_a_5": "一场比赛的最高得分者。",
                        "ART_ru_outright_a_6": "获得最有价值球员等。",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_outright_b_1": "联赛的派彩将以官方来源或相关体育权威机构判定的结果为准。",
                        "ART_ru_outright_b_2": "无论挑选的人或球队是否有参与，所有冠军投注都视为有效。",
                        "ART_ru_outright_b_3": "并列名次规则适用于冠军投注市场。",
                        "ART_ru_outright_b_4": "无论在什么情况下，如果名称使用“任何其他球员”或“任何其他球队” 将被视为代替无名称的参赛者。",
                        "ART_ru_outright_b_5": "如果体育项目有特殊规则，则将取代一般冠军规则。",
                        "ART_ru_outright_b_6": "任何特定月份相关的冠军投注：市场将会在上一个月最后一天的23:59(英国时间)暂停。延迟或取消赛事将不影响赛果。如果是由于人为错误或技术故障而没有关闭市场，公司有权利取消利用此错误下注的所有注单。",
                        "ART_ru_outright_b_7": "足球冠军投注仅适用于常规赛季（除非另作说明）。整个赛季赛程结束后球队最终的排名来决定冠军。季后赛或随后查询(潜在扣分)各自联赛将不计算在最终赛果。",
                    ';
                    break;
            }

            break;
            case "multiples":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_multiples": "連串過關/復式過關/組合過關",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "04/03/2020",
                    
                        "ART_ru_multiples_a": "示意",
                        "ART_ru_multiples_a_1": "連串過關是指選擇二個或更多的賽事在一個單一的注單中。每一個選擇連串投注的賽事必須獲勝此連串的注單才視為獲勝。如果第一個注單是獲勝的，投注獲勝的注單會添加到第二個投注選項，直到連串過關中的所有投注獲勝或到有一場失敗為結束。",
                        "ART_ru_multiples_a_2": "例如：",
                        "ART_ru_multiples_a_3": "投注一個100元的3串1連串過關在以下的三場賽事:",
                        "ART_ru_multiples_a_3_1": "曼聯 @ 1.80",
                        "ART_ru_multiples_a_3_2": "切爾西 @ 1.50",
                        "ART_ru_multiples_a_3_3": "阿森納 @ 1.66",
                        "ART_ru_multiples_a_4": "如果所有的三場賽事都獲勝，連串過關的盈利為448.20元（包括本金）。詳細的計算方式您可以查看以下的信息:",
                        "ART_ru_multiples_a_4_1": "注單 1:曼聯 1.80 x \u0024100 = 返還 \u0024180",
                        "ART_ru_multiples_a_4_2": "注單 2:切爾西 1.50 x \u0024180 = 返還 \u0024270",
                        "ART_ru_multiples_a_4_3": "注單 3:阿森納 1.66 x \u0024270 = 返還 \u0024448.20",
                    
                        "ART_ru_multiples_b": "連串過關要點:",
                        "ART_ru_multiples_b_1": "本公司一個注單中最多的連串過關為10串。",
                        "ART_ru_multiples_b_2": "所有投注賽事都需要根據體育博彩規則為準。",
                        "ART_ru_multiples_b_3": "不是所有的賽事都可以投注連串過關。如果您在投注列表中看到不可以組合二個不相關的賽事（可以查看以下的信息關於有關聯的連串），那麼就是其中一場並沒有開出連串過關投注。",
                    
                        "ART_ru_multiples_c": "連串過關中選項:",
                        "ART_ru_multiples_c_1": "連串過關投注，選擇組合有關聯的同一賽事或投注市場的結果會影響其他另一個投注市場，此注單是不接受的。",
                        "ART_ru_multiples_c_2": "例如:",
                        "ART_ru_multiples_c_3": "以下的2串1是不接受的，由於是同一場賽事:",
                        "ART_ru_multiples_c_3_1": "曼聯獲勝獨贏盤口@1.80",
                        "ART_ru_multiples_c_3_2": "曼聯2-0獲勝，正確比分盤口@7.0",
                        "ART_ru_multiples_c_4": "如果曼聯2-0獲勝，組合盤口為12.6。其實盤口應該為7.0，因為曼聯2-0獲勝，那麼獨贏盤口自然而然為獲勝。",
                        "ART_ru_multiples_c_5": "連串過關投注，選擇組合有關聯的同一球隊或球員，即使他們是不同的時間，同樣是不接受例如一個結果會影響另一個結果。",
                        "ART_ru_multiples_c_6": "例如:",
                        "ART_ru_multiples_c_6_1": "曼聯進入冠軍杯決賽@6.0",
                        "ART_ru_multiples_c_6_2": "曼聯贏得冠軍杯冠軍@10",
                        "ART_ru_multiples_c_6_3": "組合盤口@60.0",
                        "ART_ru_multiples_c_7": "這個連串過關被視為第二個賽果會影響到第一個賽果。如果曼聯獲得冠軍杯聯賽冠軍，那麼曼聯自然而然就進入冠軍杯決賽。因此，盤口僅僅為10.0。",
                        "ART_ru_multiples_c_8": "本公司有權利取消有關聯的連串過關投注。",
                    
                        "ART_ru_multiples_d": "連串過關:",
                        "ART_ru_multiples_d_1": "在連串過關中有任何的投注賽事無效或者打和（如以下的範例），此連串過關注單仍然有效，並且按照任何所勝出的其餘投注結算，範例如下：",
                        "ART_ru_multiples_d_1_1": "投注項1：切爾西（-0.5）-切爾西贏。",
                        "ART_ru_multiples_d_1_2": "投注項2:投注2：曼聯（-1）-曼聯贏1-0。",
                        "ART_ru_multiples_d_1_3": "投注項3:投注3: 阿森納（-0.5）-阿森納贏。 ",
                        "ART_ru_multiples_d_2": "正如曼聯是以（-1）的亞洲盤口1-0獲勝，但在連串過關中的此賽事視為和。因此，當切爾西獲勝連串阿森納獲勝過關，此連串過關將被視為切爾西以及阿森納的2串，而非最初的3串。同時，打和的過關投注項目將會被自動以1計算。",
                        "ART_ru_multiples_d_3": "過關的計算範例如下",
                    
                        "ART_ru_multiples_d_4": "範例1: 其中一個投注項為和:",
                        "ART_ru_multiples_d4_td1_1": "投注項",
                        "ART_ru_multiples_d4_td1_2": "讓球",
                        "ART_ru_multiples_d4_td1_3": "賠率",
                        "ART_ru_multiples_d4_td1_4": "賽果",
                        "ART_ru_multiples_d4_td1_5": "結果",
                        "ART_ru_multiples_d4_td2_1": "切爾西",
                        "ART_ru_multiples_d4_td2_2": "(-0.5/1)",
                        "ART_ru_multiples_d4_td2_3": "1.85",
                        "ART_ru_multiples_d4_td2_4": "贏 2-0",
                        "ART_ru_multiples_d4_td2_5": "全贏",
                        "ART_ru_multiples_d4_td3_1": "曼聯",
                        "ART_ru_multiples_d4_td3_2": "(-1)",
                        "ART_ru_multiples_d4_td3_3": "1.95",
                        "ART_ru_multiples_d4_td3_4": "贏 1-0",
                        "ART_ru_multiples_d4_td3_5": "和",
                        "ART_ru_multiples_d4_td4_1": "阿森納",
                        "ART_ru_multiples_d4_td4_2": "(-1/1.5)",
                        "ART_ru_multiples_d4_td4_3": "2.05",
                        "ART_ru_multiples_d4_td4_4": "贏 3-0",
                        "ART_ru_multiples_d4_td4_5": "全贏",
                    
                        "ART_ru_multiples_d_5": "投注金額：\u0024100 3串一",
                        "ART_ru_multiples_d_6": "計算方式如下",
                    
                        "ART_ru_multiples_d_7": "\u0024100 x 1.85 x 1 x 2.05 = \u0024379.25， 扣除本金\u0024100 = 盈利",
                        "ART_ru_multiples_d_7-1": "\u0024279.25",
                        "ART_ru_multiples_d_7_1": "切爾西(-0.5/1):",
                        "ART_ru_multiples_d_7_1-1": "贏",
                        "ART_ru_multiples_d_7_1-2": " - \u0024100 x 1.85 = 返還\u0024185。此金額將會移至下個選項。",
                        "ART_ru_multiples_d_7_2": "曼聯(-1):",
                        "ART_ru_multiples_d_7_2-1": "和",
                        "ART_ru_multiples_d_7_2-2": " - \u0024185 x 1 = \u0024185. 此金額將會移至到下一選項。",
                        "ART_ru_multiples_d_7_3": "阿森納 (-1/1.5):",
                        "ART_ru_multiples_d_7_3-1": "贏",
                        "ART_ru_multiples_d_7_3-2": " - \u0024185 x 2.05 = 返還 \u0024379.25",
                        "ART_ru_multiples_d_7_4": "盈利：\u0024379.25 – \u0024100 =",
                        "ART_ru_multiples_d_7_4-1": "\u0024279.25.",
                    
                        "ART_ru_multiples_d_8": "範例2： 其中一個投注項為贏半平半",
                        "ART_ru_multiples_d8_td1_1": "投注項",
                        "ART_ru_multiples_d8_td1_2": "讓球",
                        "ART_ru_multiples_d8_td1_3": "賠率",
                        "ART_ru_multiples_d8_td1_4": "賽果",
                        "ART_ru_multiples_d8_td1_5": "結果",
                        "ART_ru_multiples_d8_td2_1": "切爾西",
                        "ART_ru_multiples_d8_td2_2": "(-0.5/1)",
                        "ART_ru_multiples_d8_td2_3": "1.85",
                        "ART_ru_multiples_d8_td2_4": "贏 1-0",
                        "ART_ru_multiples_d8_td2_5": "贏半 / 平半",
                        "ART_ru_multiples_d8_td3_1": "曼聯",
                        "ART_ru_multiples_d8_td3_2": "(-1)",
                        "ART_ru_multiples_d8_td3_3": "1.95",
                        "ART_ru_multiples_d8_td3_4": "贏 2-0",
                        "ART_ru_multiples_d8_td3_5": "全贏",
                        "ART_ru_multiples_d8_td4_1": "阿森納",
                        "ART_ru_multiples_d8_td4_2": "(-1/1.5)",
                        "ART_ru_multiples_d8_td4_3": "2.05",
                        "ART_ru_multiples_d8_td4_4": "贏 3-0",
                        "ART_ru_multiples_d8_td4_5": "全贏",
                    
                        "ART_ru_multiples_d_9": "連串投注：\u0024100 3串一",
                        "ART_ru_multiples_d_10": "計算方式如下：",
                    
                        "ART_ru_multiples_d_11": "\u0024100 x [1 + 0.5 x 0.85] x 1.95 x 2.05 = \u0024569.64， 扣除本金\u0024100 = 贏",
                        "ART_ru_multiples_d_11-1": "\u0024469.64",
                        "ART_ru_multiples_d_11_1": "切爾西 (-0.5/1):",
                        "ART_ru_multiples_d_11_1-1": "贏半/平半",
                        "ART_ru_multiples_d_11_1-2": " – 此注單被分為兩項，只有一半的投注盈利，",
                        "ART_ru_multiples_d_11_1-3": "盈利的部分\u002450 x 1.85 = \u002492.50",
                        "ART_ru_multiples_d_11_1-4": "打和部分\u002450 x 1 = \u002450",
                        "ART_ru_multiples_d_11_1-5": "返還是\u002492.50 + \u002450 = \u0024142.50。此金額將移至下個投注項",
                        "ART_ru_multiples_d_11_2": "曼聯 (-1): ",
                        "ART_ru_multiples_d_11_2-1": "盈利",
                        "ART_ru_multiples_d_11_2-2": " - \u0024142.50 x 1.95 = \u0024277.87，此金額將移至下個投注項",
                        "ART_ru_multiples_d_11_3": "阿森納 (-1/1.5):",
                        "ART_ru_multiples_d_11_3-1": "盈利",
                        "ART_ru_multiples_d_11_3-2": " - \u0024277.87 x 2.05 =\u0024569.64",
                        "ART_ru_multiples_d_11_4": "總盈利: \u0024569.64 – \u0024100 = ",
                        "ART_ru_multiples_d_11_4-1": "\u0024469.64.",
                    
                        "ART_ru_multiples_d_12": "範例3：其中一個投注項為輸半/平半",
                        "ART_ru_multiples_d12_td1_1": "投注項",
                        "ART_ru_multiples_d12_td1_2": "讓球",
                        "ART_ru_multiples_d12_td1_3": "賠率",
                        "ART_ru_multiples_d12_td1_4": "賽果",
                        "ART_ru_multiples_d12_td1_5": "結果",
                        "ART_ru_multiples_d12_td2_1": "切爾西",
                        "ART_ru_multiples_d12_td2_2": "(-0.5/1)",
                        "ART_ru_multiples_d12_td2_3": "1.85",
                        "ART_ru_multiples_d12_td2_4": "贏 2-0",
                        "ART_ru_multiples_d12_td2_5": "全贏",
                        "ART_ru_multiples_d12_td3_1": "曼聯",
                        "ART_ru_multiples_d12_td3_2": "(-1)",
                        "ART_ru_multiples_d12_td3_3": "1.95",
                        "ART_ru_multiples_d12_td3_4": "贏 2-0",
                        "ART_ru_multiples_d12_td3_5": "全贏",
                        "ART_ru_multiples_d12_td4_1": "阿森納",
                        "ART_ru_multiples_d12_td4_2": "(-1/1.5)",
                        "ART_ru_multiples_d12_td4_3": "2.05",
                        "ART_ru_multiples_d12_td4_4": "贏 1-0",
                        "ART_ru_multiples_d12_td4_5": "輸半 /平半",
                    
                        "ART_ru_multiples_d_13": "連串投注：\u0024100 3串一",
                        "ART_ru_multiples_d_14": "計算方式如下：",
                    
                        "ART_ru_multiples_d_15": "\u0024100 x 1.85 x 1.95 x 0.5 = \u0024180.38, 扣除本金\u0024100 =盈利\u002480.38",
                        "ART_ru_multiples_d_15_1": "切爾西(-0.5/1): ",
                        "ART_ru_multiples_d_15_1-1": "贏",
                        "ART_ru_multiples_d_15_1-2": " - \u0024100 x 1.85 = \u0024185 = 返回\u0024185. 此金額將移至下個投注項",
                        "ART_ru_multiples_d_15_2": "曼聯(-1): ",
                        "ART_ru_multiples_d_15_2-1": "贏",
                        "ART_ru_multiples_d_15_2-2": " - \u0024185 x 1.95 = \u0024360.75. 此金額將移至下個投注項",
                        "ART_ru_multiples_d_15_3": "阿森納 (-1/1.5): ",
                        "ART_ru_multiples_d_15_3-1": "輸半/平半",
                        "ART_ru_multiples_d_15_3-2": " - 投注額度將一分為二，其中一半為輸。",
                        "ART_ru_multiples_d_15_3-3": "\u0024360.75 x 0.5 = \u0024180.38.",
                        "ART_ru_multiples_d_15_3-4": "輸半: \u0024180.38",
                        "ART_ru_multiples_d_15_3-5": "平半: \u0024180.38 x 1 = \u0024180.38",
                        "ART_ru_multiples_d_15_4": "返回: \u0024180.38",
                        "ART_ru_multiples_d_15_5": "總盈利: \u0024180.38 – \u0024100 = ",
                        "ART_ru_multiples_d_15_5-1": "\u002480.38.",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_multiples": "PARLAYS / MULTIPLES / COMBO BETS",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "24/10/2018",
                    
                        "ART_ru_multiples_a": "GENERAL",
                        "ART_ru_multiples_a_1": "A parlay bet is defined as individual bets which link two or more selections in a single bet. Each selection chosen in the parlay must win for the parlay ticket to be successful. If the first selection is a winning bet, the winnings and the stake are carried over on to the second selection. This continues until all selections are winning bets or one selection is a losing bet.",
                        "ART_ru_multiples_a_2": "Example:",
                        "ART_ru_multiples_a_3": "A parlay treble of \u0024100 is placed on the following three selections:",
                        "ART_ru_multiples_a_3_1": "Manchester United @ 1.80",
                        "ART_ru_multiples_a_3_2": "Chelsea @ 1.50",
                        "ART_ru_multiples_a_3_3": "Arsenal @ 1.66",
                        "ART_ru_multiples_a_4": "If all three selections win, the return on the parlay is \u0024448.20. This is broken down as follows:",
                        "ART_ru_multiples_a_4_1": "Bet 1: Manchester United 1.80 x \u0024100 = Return of \u0024180.",
                        "ART_ru_multiples_a_4_2": "Bet 2: Chelsea 1.50 x \u0024180 = Return of \u0024270.",
                        "ART_ru_multiples_a_4_3": "Bet 3: Arsenal 1.66 x \u0024270 = Return of \u0024448.20.",
                    
                        "ART_ru_multiples_b": "Parlay Points:",
                        "ART_ru_multiples_b_1": "The company allows a maximum of ten selections to be combined in a parlay bet.",
                        "ART_ru_multiples_b_2": "All selections are subject to the relevant sports rules.",
                        "ART_ru_multiples_b_3": "Not all markets will be available for parlay betting. If you see in the bet slip that you cannot combine two unrelated selections (see below for details on related parlays), then one of the selections is not available for parlay betting.",
                    
                        "ART_ru_multiples_c": "RELATED SELECTION IN A PARLAYS:",
                        "ART_ru_multiples_c_1": "Parlay bets, which combine selections that are related in the same event or where the outcome of one market could affect the outcome of another market, are not accepted.",
                        "ART_ru_multiples_c_2": "Example:",
                        "ART_ru_multiples_c_3": "The following double is not accepted as it is seen as a related parlay:",
                        "ART_ru_multiples_c_3_1": "Manchester United to win in the 1 X 2 market @ odds of 1.80",
                        "ART_ru_multiples_c_3_2": "Manchester United to win 2-0 in the correct score market @ odds of 7.0",
                        "ART_ru_multiples_c_4": "If Manchester United win 2-0, the combined odds would be 12.6. However, the odds should only be 7.0 because if Manchester United win 2-0, they will automatically have won in the 1 X 2 market.",
                        "ART_ru_multiples_c_5": "Parlay bets that combine selections relating to the same team or player, even though they are settled at different times, are also not accepted as the outcome of one could affect the outcome of the other:",
                        "ART_ru_multiples_c_6": "Example:",
                        "ART_ru_multiples_c_6_1": "Manchester Untied to reach the Champions League Final @6.0",
                        "ART_ru_multiples_c_6_2": "Manchester United to win the Champions League @ 10.0",
                        "ART_ru_multiples_c_6_3": "Combined odds of 60.0",
                        "ART_ru_multiples_c_7": "This parlay is considered related as the result of the second selection impacts the first selection. If Manchester Untied win the Champions League, they will automatically have reached the final. Therefore, the odds can only be 10.0.",
                        "ART_ru_multiples_c_8": "The Company reserves the right to void part or all of parlay bet if it is seen to be a related parlay.",
                    
                        "ART_ru_multiples_d": "PARLAY PUSH:",
                        "ART_ru_multiples_d_1": "In the event that any part of the parlay bet is voided or is a push (as in the example below), the parlay bet will still stand and any winning selections will be carried forward to the remaining selections, as in the case of the following Treble:",
                        "ART_ru_multiples_d_1_1": "Bet 1: Chelsea (-0.5) – Chelsea win.",
                        "ART_ru_multiples_d_1_2": "Bet 2: Manchester United (-1) – Manchester United win 1-0.",
                        "ART_ru_multiples_d_1_3": "Bet 3: Arsenal (-0.5) – Arsenal win.",
                        "ART_ru_multiples_d_2": "As Manchester United only win 1-0 with a (-1) Asian Handicap, that part of the parlay bet is a push. Therefore, the \"Chelsea win\" bet is carried forward to the \"Arsenal win\" bet and the parlay bet becomes a winning Double on Chelsea and Arsenal instead of the initial parlay bet of a Treble. The push part of the bet is calculated by multiplying the carried over stake by 1.",
                        "ART_ru_multiples_d_3": "Examples of how the push is calculated:",
                    
                        "ART_ru_multiples_d_4": "Example 1: A selection is settled as a push:",
                        "ART_ru_multiples_d4_td1_1": "Selection",
                        "ART_ru_multiples_d4_td1_2": "HDP",
                        "ART_ru_multiples_d4_td1_3": "Odds",
                        "ART_ru_multiples_d4_td1_4": "Result",
                        "ART_ru_multiples_d4_td1_5": "Outcome",
                        "ART_ru_multiples_d4_td2_1": "Chelsea",
                        "ART_ru_multiples_d4_td2_2": "(-0.5/1)",
                        "ART_ru_multiples_d4_td2_3": "1.85",
                        "ART_ru_multiples_d4_td2_4": "Win 2-0",
                        "ART_ru_multiples_d4_td2_5": "Winning Selection",
                        "ART_ru_multiples_d4_td3_1": "Manchester United",
                        "ART_ru_multiples_d4_td3_2": "(-1)",
                        "ART_ru_multiples_d4_td3_3": "1.95",
                        "ART_ru_multiples_d4_td3_4": "Win 1-0",
                        "ART_ru_multiples_d4_td3_5": "Push",
                        "ART_ru_multiples_d4_td4_1": "Arsenal",
                        "ART_ru_multiples_d4_td4_2": "(-1/1.5)",
                        "ART_ru_multiples_d4_td4_3": "2.05",
                        "ART_ru_multiples_d4_td4_4": "Win 3-0",
                        "ART_ru_multiples_d4_td4_5": "Winning Selection",
                    
                        "ART_ru_multiples_d_5": "Parlay Wager: \u0024100 Treble",
                        "ART_ru_multiples_d_6": "The calculation is as follows:",
                    
                        "ART_ru_multiples_d_7": "\u0024100 x 1.85 x 1 x 2.05 = \u0024379.25, less stake of \u0024100 = Winnings of",
                        "ART_ru_multiples_d_7-1": "\u0024279.25",
                        "ART_ru_multiples_d_7_1": "Chelsea (-0.5/1): ",
                        "ART_ru_multiples_d_7_1-1": "Win",
                        "ART_ru_multiples_d_7_1-2": " - \u0024100 x 1.85 = Return of \u0024185. This is carried on to the next selection.",
                        "ART_ru_multiples_d_7_2": "Manchester United (-1): ",
                        "ART_ru_multiples_d_7_2-1": "Push",
                        "ART_ru_multiples_d_7_2-2": " - \u0024185 x 1 = \u0024185. This is carried on to the next selection.",
                        "ART_ru_multiples_d_7_3": "Arsenal (-1/1.5): ",
                        "ART_ru_multiples_d_7_3-1": "Win",
                        "ART_ru_multiples_d_7_3-2": " - \u0024185 x 2.05 = Return of \u0024379.25",
                        "ART_ru_multiples_d_7_4": "Winnings: \u0024379.25 – \u0024100 = ",
                        "ART_ru_multiples_d_7_4-1": "\u0024279.25.",
                    
                        "ART_ru_multiples_d_8": "Example 2 : A selection is settled as a half win and half push:",
                        "ART_ru_multiples_d8_td1_1": "Selection",
                        "ART_ru_multiples_d8_td1_2": "HDP",
                        "ART_ru_multiples_d8_td1_3": "Odds",
                        "ART_ru_multiples_d8_td1_4": "Result",
                        "ART_ru_multiples_d8_td1_5": "Outcome",
                        "ART_ru_multiples_d8_td2_1": "Chelsea",
                        "ART_ru_multiples_d8_td2_2": "(-0.5/1)",
                        "ART_ru_multiples_d8_td2_3": "1.85",
                        "ART_ru_multiples_d8_td2_4": "Win 1-0",
                        "ART_ru_multiples_d8_td2_5": "Half Win / Half Push",
                        "ART_ru_multiples_d8_td3_1": "Manchester United",
                        "ART_ru_multiples_d8_td3_2": "(-1)",
                        "ART_ru_multiples_d8_td3_3": "1.95",
                        "ART_ru_multiples_d8_td3_4": "Win 2-0",
                        "ART_ru_multiples_d8_td3_5": "Winning Selection",
                        "ART_ru_multiples_d8_td4_1": "Arsenal",
                        "ART_ru_multiples_d8_td4_2": "(-1/1.5)",
                        "ART_ru_multiples_d8_td4_3": "2.05",
                        "ART_ru_multiples_d8_td4_4": "Win 3-0",
                        "ART_ru_multiples_d8_td4_5": "Winning Selection",
                    
                        "ART_ru_multiples_d_9": "Parlay Wager: \u0024100 Treble",
                        "ART_ru_multiples_d_10": "The calculation is as follows:",
                    
                        "ART_ru_multiples_d_11": "\u0024100 x [1 + 0.5 x 0.85] x 1.95 x 2.05 = \u0024569.64, less stake of \u0024100 = Winnings of ",
                        "ART_ru_multiples_d_11-1": "\u0024469.64",
                    
                        "ART_ru_multiples_d_11_1": "Chelsea (-0.5/1): ",
                        "ART_ru_multiples_d_11_1-1": "Half Win / Half Push",
                        "ART_ru_multiples_d_11_1-2": " – The stake is divided in two as only half the bet is a winning bet…",
                        "ART_ru_multiples_d_11_1-3": "Win part is \u002450 x 1.85 = \u002492.50",
                        "ART_ru_multiples_d_11_1-4": "Push part is \u002450 x 1 = \u002450",
                        "ART_ru_multiples_d_11_1-5": "Return is \u002492.50 + \u002450 = \u0024142.50. This is carried on to the next selection.",
                    
                        "ART_ru_multiples_d_11_2": "Manchester United (-1): ",
                        "ART_ru_multiples_d_11_2-1": "Win",
                        "ART_ru_multiples_d_11_2-2": " - \u0024142.50 x 1.95 = \u0024277.87. This is carried on to the next selection.",
                    
                        "ART_ru_multiples_d_11_3": "Arsenal (-1/1.5): ",
                        "ART_ru_multiples_d_11_3-1": "Win",
                        "ART_ru_multiples_d_11_3-2": " - \u0024277.87 x 2.05 = Return of \u0024569.64",
                    
                        "ART_ru_multiples_d_11_4": "Winnings: \u0024569.64 – \u0024100 = ",
                        "ART_ru_multiples_d_11_4-1": "\u0024469.64.",
                    
                        "ART_ru_multiples_d_12": "Example 3 : A selection is settled as a half lose and half push:",
                        "ART_ru_multiples_d12_td1_1": "Selection",
                        "ART_ru_multiples_d12_td1_2": "HDP",
                        "ART_ru_multiples_d12_td1_3": "Odds",
                        "ART_ru_multiples_d12_td1_4": "Result",
                        "ART_ru_multiples_d12_td1_5": "Outcome",
                        "ART_ru_multiples_d12_td2_1": "Chelsea",
                        "ART_ru_multiples_d12_td2_2": "(-0.5/1)",
                        "ART_ru_multiples_d12_td2_3": "1.85",
                        "ART_ru_multiples_d12_td2_4": "Win 2-0",
                        "ART_ru_multiples_d12_td2_5": "Winning Selection",
                        "ART_ru_multiples_d12_td3_1": "Manchester United",
                        "ART_ru_multiples_d12_td3_2": "(-1)",
                        "ART_ru_multiples_d12_td3_3": "1.95",
                        "ART_ru_multiples_d12_td3_4": "Win 2-0",
                        "ART_ru_multiples_d12_td3_5": "Winning Selection",
                        "ART_ru_multiples_d12_td4_1": "Arsenal",
                        "ART_ru_multiples_d12_td4_2": "(-1/1.5)",
                        "ART_ru_multiples_d12_td4_3": "2.05",
                        "ART_ru_multiples_d12_td4_4": "Win 1-0",
                        "ART_ru_multiples_d12_td4_5": "Half Lose / Half Push",
                    
                        "ART_ru_multiples_d_13": "Parlay Wager: \u0024100 Treble",
                        "ART_ru_multiples_d_14": "The calculation is as follows:",
                    
                        "ART_ru_multiples_d_15": "\u0024100 x 1.85 x 1.95 x 0.5 = \u0024180.38, less stake of \u0024100 = Winnings of \u002480.38",
                        "ART_ru_multiples_d_15_1": "Chelsea (-0.5/1): ",
                        "ART_ru_multiples_d_15_1-1": "Win",
                        "ART_ru_multiples_d_15_1-2": " - \u0024100 x 1.85 = \u0024185 = Return of \u0024185. This is carried on to the next selection.",
                        "ART_ru_multiples_d_15_2": "Manchester United (-1): ",
                        "ART_ru_multiples_d_15_2-1": "Win",
                        "ART_ru_multiples_d_15_2-2": " - \u0024185 x 1.95 = \u0024360.75. This is carried on to the next selection.",
                        "ART_ru_multiples_d_15_3": "Arsenal (-1/1.5): ",
                        "ART_ru_multiples_d_15_3-1": "Half Lose / Half Push",
                        "ART_ru_multiples_d_15_3-2": " - The stake is divided in two as half the bet is a losing bet…",
                        "ART_ru_multiples_d_15_3-3": "\u0024360.75 x 0.5 = \u0024180.38.",
                        "ART_ru_multiples_d_15_3-4": "Half Lose: \u0024180.38",
                        "ART_ru_multiples_d_15_3-5": "Half Push: \u0024180.38 x 1 = \u0024180.38",
                        "ART_ru_multiples_d_15_4": "Return is \u0024180.38",
                        "ART_ru_multiples_d_15_5": "Winnings: \u0024180.38 – \u0024100 = ",
                        "ART_ru_multiples_d_15_5-1": "\u002480.38.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_multiples": "连串过关/复式过关/组合过关",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "04/03/2020",
                    
                        "ART_ru_multiples_a": "示意",
                        "ART_ru_multiples_a_1": "连串过关是指选择二个或更多的赛事在一个单一的注单中。每一个选择连串投注的赛事必须获胜此连串的注单才视为获胜。如果第一个注单是获胜的，投注获胜的注单会添加到第二个投注选项，直到连串过关中的所有投注获胜或到有一场失败为结束。",
                        "ART_ru_multiples_a_2": "例如：",
                        "ART_ru_multiples_a_3": "投注一个100元的3串1连串过关在以下的三场赛事:",
                        "ART_ru_multiples_a_3_1": "曼联 @ 1.80",
                        "ART_ru_multiples_a_3_2": "切尔西 @ 1.50",
                        "ART_ru_multiples_a_3_3": "阿森纳 @ 1.66",
                        "ART_ru_multiples_a_4": "如果所有的三场赛事都获胜，连串过关的盈利为448.20元（包括本金）。详细的计算方式您可以查看以下的信息:",
                        "ART_ru_multiples_a_4_1": "注单 1:曼联 1.80 x \u0024100 = 返还 \u0024180",
                        "ART_ru_multiples_a_4_2": "注单 2:切尔西 1.50 x \u0024180 = 返还 \u0024270",
                        "ART_ru_multiples_a_4_3": "注单 3:阿森纳 1.66 x \u0024270 = 返还 \u0024448.20",
                    
                        "ART_ru_multiples_b": "连串过关要点:",
                        "ART_ru_multiples_b_1": "本公司一个注单中最多的连串过关为10串。",
                        "ART_ru_multiples_b_2": "所有投注赛事都需要根据体育博彩规则为准。",
                        "ART_ru_multiples_b_3": "不是所有的赛事都可以投注连串过关。如果您在投注列表中看到不可以组合二个不相关的赛事（可以查看以下的信息关于有关联的连串），那么就是其中一场并没有开出连串过关投注。",
                    
                        "ART_ru_multiples_c": "连串过关中选项:",
                        "ART_ru_multiples_c_1": "连串过关投注，选择组合有关联的同一赛事或投注市场的结果会影响其他另一个投注市场，此注单是不接受的。",
                        "ART_ru_multiples_c_2": "例如:",
                        "ART_ru_multiples_c_3": "以下的2串1是不接受的，由于是同一场赛事:",
                        "ART_ru_multiples_c_3_1": "曼联获胜独赢盘口@1.80",
                        "ART_ru_multiples_c_3_2": "曼联2-0获胜，正确比分盘口@7.0",
                        "ART_ru_multiples_c_4": "如果曼联2-0获胜，组合盘口为12.6。其实盘口应该为7.0，因为曼联2-0获胜，那么独赢盘口自然而然为获胜。",
                        "ART_ru_multiples_c_5": "连串过关投注，选择组合有关联的同一球队或球员，即使他们是不同的时间，同样是不接受例如一个结果会影响另一个结果。",
                        "ART_ru_multiples_c_6": "例如:",
                        "ART_ru_multiples_c_6_1": "曼联进入冠军杯决赛@6.0",
                        "ART_ru_multiples_c_6_2": "曼联赢得冠军杯冠军@10",
                        "ART_ru_multiples_c_6_3": "组合盘口@60.0",
                        "ART_ru_multiples_c_7": "这个连串过关被视为第二个赛果会影响到第一个赛果。如果曼联获得冠军杯联赛冠军，那么曼联自然而然就进入冠军杯决赛。因此，盘口仅仅为10.0。",
                        "ART_ru_multiples_c_8": "本公司有权利取消有关联的连串过关投注。",
                    
                        "ART_ru_multiples_d": "连串过关:",
                        "ART_ru_multiples_d_1": "在连串过关中有任何的投注赛事无效或者打和（如以下的范例），此连串过关注单仍然有效，并且按照任何所胜出的其余投注结算，范例如下：",
                        "ART_ru_multiples_d_1_1": "投注项1：切尔西（-0.5）-切尔西赢。",
                        "ART_ru_multiples_d_1_2": "投注项2:投注2：曼联（-1）-曼联赢1-0。",
                        "ART_ru_multiples_d_1_3": "投注项3:投注3: 阿森纳（-0.5）-阿森纳赢。 ",
                        "ART_ru_multiples_d_2": "正如曼联是以（-1）的亚洲盘口1-0获胜，但在连串过关中的此赛事视为和。因此，当切尔西获胜连串阿森纳获胜过关，此连串过关将被视为切尔西以及阿森纳的2串，而非最初的3串。同时，打和的过关投注项目将会被自动以1计算。",
                        "ART_ru_multiples_d_3": "过关的计算范例如下",
                    
                        "ART_ru_multiples_d_4": "范例1: 其中一个投注项为和:",
                        "ART_ru_multiples_d4_td1_1": "投注项",
                        "ART_ru_multiples_d4_td1_2": "让球",
                        "ART_ru_multiples_d4_td1_3": "赔率",
                        "ART_ru_multiples_d4_td1_4": "赛果",
                        "ART_ru_multiples_d4_td1_5": "结果",
                        "ART_ru_multiples_d4_td2_1": "切尔西",
                        "ART_ru_multiples_d4_td2_2": "(-0.5/1)",
                        "ART_ru_multiples_d4_td2_3": "1.85",
                        "ART_ru_multiples_d4_td2_4": "赢 2-0",
                        "ART_ru_multiples_d4_td2_5": "全赢",
                        "ART_ru_multiples_d4_td3_1": "曼联",
                        "ART_ru_multiples_d4_td3_2": "(-1)",
                        "ART_ru_multiples_d4_td3_3": "1.95",
                        "ART_ru_multiples_d4_td3_4": "赢 1-0",
                        "ART_ru_multiples_d4_td3_5": "和",
                        "ART_ru_multiples_d4_td4_1": "阿森纳",
                        "ART_ru_multiples_d4_td4_2": "(-1/1.5)",
                        "ART_ru_multiples_d4_td4_3": "2.05",
                        "ART_ru_multiples_d4_td4_4": "赢 3-0",
                        "ART_ru_multiples_d4_td4_5": "全赢",
                    
                        "ART_ru_multiples_d_5": "投注金额：\u0024100 3串一",
                        "ART_ru_multiples_d_6": "计算方式如下",
                    
                        "ART_ru_multiples_d_7": "\u0024100 x 1.85 x 1 x 2.05 = \u0024379.25， 扣除本金\u0024100 = 盈利",
                        "ART_ru_multiples_d_7-1": "\u0024279.25",
                        "ART_ru_multiples_d_7_1": "切尔西(-0.5/1):",
                        "ART_ru_multiples_d_7_1-1": "赢",
                        "ART_ru_multiples_d_7_1-2": " - \u0024100 x 1.85 = 返还\u0024185。此金额将会移至下个选项。",
                        "ART_ru_multiples_d_7_2": "曼联(-1):",
                        "ART_ru_multiples_d_7_2-1": "和",
                        "ART_ru_multiples_d_7_2-2": " - \u0024185 x 1 = \u0024185. 此金额将会移至到下一选项。",
                        "ART_ru_multiples_d_7_3": "阿森纳 (-1/1.5):",
                        "ART_ru_multiples_d_7_3-1": "赢",
                        "ART_ru_multiples_d_7_3-2": " - \u0024185 x 2.05 = 返还 \u0024379.25",
                        "ART_ru_multiples_d_7_4": "盈利：\u0024379.25 – \u0024100 =",
                        "ART_ru_multiples_d_7_4-1": "\u0024279.25.",
                    
                        "ART_ru_multiples_d_8": "范例2： 其中一个投注项为赢半平半",
                        "ART_ru_multiples_d8_td1_1": "投注项",
                        "ART_ru_multiples_d8_td1_2": "让球",
                        "ART_ru_multiples_d8_td1_3": "赔率",
                        "ART_ru_multiples_d8_td1_4": "赛果",
                        "ART_ru_multiples_d8_td1_5": "结果",
                        "ART_ru_multiples_d8_td2_1": "切尔西",
                        "ART_ru_multiples_d8_td2_2": "(-0.5/1)",
                        "ART_ru_multiples_d8_td2_3": "1.85",
                        "ART_ru_multiples_d8_td2_4": "赢 1-0",
                        "ART_ru_multiples_d8_td2_5": "赢半 / 平半",
                        "ART_ru_multiples_d8_td3_1": "曼联",
                        "ART_ru_multiples_d8_td3_2": "(-1)",
                        "ART_ru_multiples_d8_td3_3": "1.95",
                        "ART_ru_multiples_d8_td3_4": "赢 2-0",
                        "ART_ru_multiples_d8_td3_5": "全赢",
                        "ART_ru_multiples_d8_td4_1": "阿森纳",
                        "ART_ru_multiples_d8_td4_2": "(-1/1.5)",
                        "ART_ru_multiples_d8_td4_3": "2.05",
                        "ART_ru_multiples_d8_td4_4": "赢 3-0",
                        "ART_ru_multiples_d8_td4_5": "全赢",
                    
                        "ART_ru_multiples_d_9": "连串投注：\u0024100 3串一",
                        "ART_ru_multiples_d_10": "计算方式如下：",
                    
                        "ART_ru_multiples_d_11": "\u0024100 x [1 + 0.5 x 0.85] x 1.95 x 2.05 = \u0024569.64， 扣除本金\u0024100 = 赢",
                        "ART_ru_multiples_d_11-1": "\u0024469.64",
                        "ART_ru_multiples_d_11_1": "切尔西 (-0.5/1):",
                        "ART_ru_multiples_d_11_1-1": "赢半/平半",
                        "ART_ru_multiples_d_11_1-2": " – 此注单被分为两项，只有一半的投注盈利，",
                        "ART_ru_multiples_d_11_1-3": "盈利的部分\u002450 x 1.85 = \u002492.50",
                        "ART_ru_multiples_d_11_1-4": "打和部分\u002450 x 1 = \u002450",
                        "ART_ru_multiples_d_11_1-5": "返还是\u002492.50 + \u002450 = \u0024142.50。此金额将移至下个投注项",
                        "ART_ru_multiples_d_11_2": "曼联 (-1): ",
                        "ART_ru_multiples_d_11_2-1": "盈利",
                        "ART_ru_multiples_d_11_2-2": " - \u0024142.50 x 1.95 = \u0024277.87，此金额将移至下个投注项",
                        "ART_ru_multiples_d_11_3": "阿森纳 (-1/1.5):",
                        "ART_ru_multiples_d_11_3-1": "盈利",
                        "ART_ru_multiples_d_11_3-2": " - \u0024277.87 x 2.05 =\u0024569.64",
                        "ART_ru_multiples_d_11_4": "总盈利: \u0024569.64 – \u0024100 = ",
                        "ART_ru_multiples_d_11_4-1": "\u0024469.64.",
                    
                        "ART_ru_multiples_d_12": "范例3：其中一个投注项为输半/平半",
                        "ART_ru_multiples_d12_td1_1": "投注项",
                        "ART_ru_multiples_d12_td1_2": "让球",
                        "ART_ru_multiples_d12_td1_3": "赔率",
                        "ART_ru_multiples_d12_td1_4": "赛果",
                        "ART_ru_multiples_d12_td1_5": "结果",
                        "ART_ru_multiples_d12_td2_1": "切尔西",
                        "ART_ru_multiples_d12_td2_2": "(-0.5/1)",
                        "ART_ru_multiples_d12_td2_3": "1.85",
                        "ART_ru_multiples_d12_td2_4": "赢 2-0",
                        "ART_ru_multiples_d12_td2_5": "全赢",
                        "ART_ru_multiples_d12_td3_1": "曼联",
                        "ART_ru_multiples_d12_td3_2": "(-1)",
                        "ART_ru_multiples_d12_td3_3": "1.95",
                        "ART_ru_multiples_d12_td3_4": "赢 2-0",
                        "ART_ru_multiples_d12_td3_5": "全赢",
                        "ART_ru_multiples_d12_td4_1": "阿森纳",
                        "ART_ru_multiples_d12_td4_2": "(-1/1.5)",
                        "ART_ru_multiples_d12_td4_3": "2.05",
                        "ART_ru_multiples_d12_td4_4": "赢 1-0",
                        "ART_ru_multiples_d12_td4_5": "输半 /平半",
                    
                        "ART_ru_multiples_d_13": "连串投注：\u0024100 3串一",
                        "ART_ru_multiples_d_14": "计算方式如下：",
                    
                        "ART_ru_multiples_d_15": "\u0024100 x 1.85 x 1.95 x 0.5 = \u0024180.38, 扣除本金\u0024100 =盈利\u002480.38",
                        "ART_ru_multiples_d_15_1": "切尔西(-0.5/1): ",
                        "ART_ru_multiples_d_15_1-1": "赢",
                        "ART_ru_multiples_d_15_1-2": " - \u0024100 x 1.85 = \u0024185 = 返回\u0024185. 此金额将移至下个投注项",
                        "ART_ru_multiples_d_15_2": "曼联(-1): ",
                        "ART_ru_multiples_d_15_2-1": "赢",
                        "ART_ru_multiples_d_15_2-2": " - \u0024185 x 1.95 = \u0024360.75. 此金额将移至下个投注项",
                        "ART_ru_multiples_d_15_3": "阿森纳 (-1/1.5): ",
                        "ART_ru_multiples_d_15_3-1": "输半/平半",
                        "ART_ru_multiples_d_15_3-2": " - 投注额度将一分为二，其中一半为输。",
                        "ART_ru_multiples_d_15_3-3": "\u0024360.75 x 0.5 = \u0024180.38.",
                        "ART_ru_multiples_d_15_3-4": "输半: \u0024180.38",
                        "ART_ru_multiples_d_15_3-5": "平半: \u0024180.38 x 1 = \u0024180.38",
                        "ART_ru_multiples_d_15_4": "返回: \u0024180.38",
                        "ART_ru_multiples_d_15_5": "总盈利: \u0024180.38 – \u0024100 = ",
                        "ART_ru_multiples_d_15_5-1": "\u002480.38.",
                        ';
                        break;
                }
                break;
            case "soccer":
                switch ($langx){
                    case "zh-tw":
                        $js.= '"ART_ru_h1_ft": "足球",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "11/11/2020",
                    
                        "ART_ru_ft_A": "一般規則",
                        "ART_ru_ft_A_a_1": "除非另有注明，所有足球投注的結算皆以球賽所規定的完場時間90分鐘為準。",
                        "ART_ru_ft_A_a_2": "完場時間90分鐘包括球員傷停補時。加時賽、淘汰賽、點球，以及賽事後如果裁判或相關管理機構更改任何賽果則不計算在內。",
                        "ART_ru_ft_A_a_3": "除非在個別玩法規則另有注明，所有滾球投注的結算將以90分鐘的賽果為準。 ",
                        "ART_ru_ft_A_a_4": "對於某些以全場完場時間為80分鐘（2 x40分鐘）的特定賽事或者友誼賽，所有投注的結算皆以完場時間為準。",
                        "ART_ru_ft_A_a_5": "若少年賽、友誼賽的完場時間為70分鐘（2 x 35分鐘）或更少，本公司將在開賽前做出公佈，否則該場賽事的注單一律作廢。",
                        "ART_ru_ft_A_a_6": "如果賽事中斷或延遲，並且沒有在36小時內重新開始，所有該場賽事的投注即被視為無效且取消，除非在個別投注類型規則里另有指定注明。 ",
                        "ART_ru_ft_A_a_7": "如果賽事確認取消，所有該場賽事的投注即被視為無效且取消，除非在個別投注類型規則里另有指定注明。如果賽事是在上半場中斷，所有上半場的注單將被取消。如果賽事是在下半場中斷所有上半場的投注保持有效，但所有下半場的注單將被取消，除非在個別玩法規則另有注明。",
                        "ART_ru_ft_A_a_8": "除非在個別玩法規則另有注明，烏龍球將予以計算在內。",
                        "ART_ru_ft_A_a_9": "如果比賽或賽事取消，中斷或延遲並且沒有在官方指定開球時間的36小時內重新開始，所有該場賽事的投注即被視為無效且取消，除非在個別體育規則里另有指定注明。 某些無條件終止的盤口將會相應地結算。單獨的體育規則中對此類盤口的結算程序做了說明。公司取消該賽事所有注單的結果被視為最終決定，無需參考官方賽事裁判或相關部門的決定。連串投注將會繼續按照注單剩餘賽事的賽果結算，該取消賽事的賠率將會按照1計算。",
                        "ART_ru_ft_A_a_10": "對於國際賽事，只要變更的場地仍在同一個國家內，所有注單將保持有效。",
                        "ART_ru_ft_A_a_11": "對於國際賽事，只要變更的場地仍在聯賽原定舉辦的國家內，所有注單將保持有效。",
                        "ART_ru_ft_A_a_12": "本公司保留權利取消任何因更換場地而可能對賽事結果有影響的注單。",
                        "ART_ru_ft_A_a_13": "若賽事的確切開賽時間不明（比如，由於電視直播時間安排的問題），要是在原本開賽時間的72小時之內，本平台保留調整該開賽時間的權利。",
                    
                    
                        "ART_ru_ft_B": "主要市場",
                        "ART_ru_ft_B_a": "讓球盤",
                        "ART_ru_ft_B_b": "一般規則",
                        "ART_ru_ft_B_b_1": "預測哪一支球隊在盤口指定的讓球數在全場/半場/賽事某個時節贏得比賽。",
                        "ART_ru_ft_B_b_2": "\"讓球盤\"則定義為在比賽正式開始前，一方球隊已得到另一方讓的虛擬分數，以領先的情況下開始比賽。",
                        "ART_ru_ft_B_b_3": "所有注單將按盤口開出的讓球數在玩法的時節結束後結算。",
                        "ART_ru_ft_B_b_4": "讓球隊（優勢球隊）將給出讓球，讓球數將顯示在賠率的左側，讓球隊在盤面上也會以粗型字體顯示",
                        "ART_ru_ft_B_b_5": "讓球盤的玩法分為以下幾種：",
                        "ART_ru_ft_B_b_5_1": "整數讓球也或稱為讓&lsquo;一球&rsquo;（如：-1，-2，-3，等）",
                        "ART_ru_ft_B_b_5_2": "非整數讓球也或稱為&lsquo;半球&rsquo;（如：-0.5，-1.5，-2.5，等）",
                        "ART_ru_ft_B_b_5_3": "混合以上讓&lsquo;半球/一球&rsquo;的方式（如：-0/0.5，-0.5/1，-1/1.5，等）",
                    
                        "ART_ru_ft_B_c": "讓球",
                        "ART_ru_ft_B_c_1": "根據盤口讓球信息預測最終獲得勝利的球隊。",
                        "ART_ru_ft_B_c_2": "投注的結算皆以球賽所規定的完場時間90分鐘為準。",
                        "ART_ru_ft_B_c_3": "如果賽事在90分鐘結束前取消或中斷，所有注單將會被視為無效。",
                    
                        "ART_ru_ft_B_d": "讓球 - 上半場",
                        "ART_ru_ft_B_d_1": "所有上半場的投注將以上半場45分鐘其中包含傷停補時後的賽果結算。",
                        "ART_ru_ft_B_d_2": "如果賽事在上半場時節因任何理由取消或中斷，所有上半場注單將被取消。",
                        "ART_ru_ft_B_d_3": "如果賽事在下半場或加時賽因任何理由取消或中斷，所有上半場注單保持有效。",
                    
                        "ART_ru_ft_B_e": "滾球讓球",
                        "ART_ru_ft_B_e_1": "所有注單將按照盤口開出讓球信息，在相應投注類型結束後結算。",
                        "ART_ru_ft_B_e_2": "結算是以投注時到比賽/時節結束後的賽果做裁決。即是以賽事完場比分減去投注當時的比分。上半場的滾球讓球投注將以上半場結束後的賽果結算。",
                    
                        "ART_ru_ft_B_f": "加時賽 - 讓球",
                        "ART_ru_ft_B_f_1": "所有注單將按照盤口開出讓球信息，在30分鐘加時賽結束後計算，包含補時。",
                        "ART_ru_ft_B_f_2": "如果賽事在加時賽結束前取消或中斷，所有注單將會被視為無效。",
                    
                        "ART_ru_ft_B_g": "加時賽 - 讓球-上半場",
                        "ART_ru_ft_B_g_1": "所有注單將按照盤口開出讓球信息，在15分鐘加時賽結束後計算，包含補時。",
                        "ART_ru_ft_B_g_2": "加時賽中如果賽事在上半場取消或中斷，所有上半場注單將會被視為無效。",
                        "ART_ru_ft_B_g_3": "加時賽中如果賽事在下半場或補時階段取消或中斷，所有上半場注單將會被視為有效。",
                    
                        "ART_ru_ft_B_h": "15 分鐘盤口（讓球）",
                        "ART_ru_ft_B_h_1": "根據盤口讓球信息預測最終獲得15分鐘內比賽勝利的球隊。",
                        "ART_ru_ft_B_h_2": "在每個15分鐘開始，所有球隊在開始此時段比賽都是0-0，之前的得分點是沒有影響的。",
                        "ART_ru_ft_B_h_3": "所有的投注將以開始下個時節前的賽果結算。",
                        "ART_ru_ft_B_h_4": "如果賽事中斷，所有當前15分鐘時段的投注以及將要進行的下一個15分鐘時段投注將視為無效，任何15分鐘時段投注，如果該時段完整結束，注單將被視為有效。",
                        "ART_ru_ft_B_td_h4_1_1": "15分鐘-時段1",
                        "ART_ru_ft_B_td_h4_1_2": "上半場開始-14分59秒",
                        "ART_ru_ft_B_td_h4_2_1": "15分鐘-時段2",
                        "ART_ru_ft_B_td_h4_2_2": "15分鐘-29分59秒",
                        "ART_ru_ft_B_td_h4_3_1": "15分鐘-時段3",
                        "ART_ru_ft_B_td_h4_3_2": "30分鐘-半場",
                        "ART_ru_ft_B_td_h4_4_1": "15分鐘-時段4",
                        "ART_ru_ft_B_td_h4_4_2": "下半場開始-59分59秒",
                        "ART_ru_ft_B_td_h4_5_1": "15分鐘-時段5",
                        "ART_ru_ft_B_td_h4_5_2": "60分鐘-74分59秒",
                        "ART_ru_ft_B_td_h4_6_1": "15分鐘-時段6",
                        "ART_ru_ft_B_td_h4_6_2": "75分鐘-全場",
                    
                        "ART_ru_ft_B_i": "大小盤",
                        "ART_ru_ft_B_j": "一般規則",
                        "ART_ru_ft_B_j_1": "預測賽事總入球數將大於或小於在盤口指定的大/小盤球數。",
                        "ART_ru_ft_B_j_2": "如果賽事的總入球數多於盤口的大/小盤球數，則為大盤。如果少於盤口的大/小盤球數，則為小盤。",
                        "ART_ru_ft_B_j_3": "所有注單將按盤口開出的大/小盤球數在玩法的時節結束後結算。",
                        "ART_ru_ft_B_j_4": "大/小盤的玩法分為以下幾種：",
                        "ART_ru_ft_B_j_4_1": "大/小於\'一球\'（如：2，3，4，等）",
                        "ART_ru_ft_B_j_4_2": "大/小於\'半球\'（如：1.5，2.5，3.5，等）",
                        "ART_ru_ft_B_j_4_3": "混合以上\'半球/一球\'的方式（如：1.5/2，2.5/3，3.5/4，等）",
                    
                        "ART_ru_ft_B_j_5": "如果賽事中斷前已有明確結果並且之後沒有任何顯著會影響賽事結果的情況，大/小盤注單才會被結算。若遇到任何其他情況，注單將一律被取消。請參考以上範例：",
                        "ART_ru_ft_B_j_5_1": "範例1：會員投注大於2.5球：",
                        "ART_ru_ft_B_j_5_1_1": "賽事在比分2-1時中斷。",
                        "ART_ru_ft_B_j_5_1_2": "儘管賽事中斷，但因結果已經明確並且若之後有任何潛在進球將對盤口結算裁決沒有影響，所有此會員注單結算為贏。",
                        "ART_ru_ft_B_j_5_2": "範例2：會員投注小於2.5球：",
                        "ART_ru_ft_B_j_5_2_1": "賽事在比分2-1時中斷。",
                        "ART_ru_ft_B_j_5_2_2": "儘管賽事中斷，但因結果已經明確並且若之後有任何潛在進球將對盤口結算裁決沒有影響，所有此會員注單結算為輸。",
                        "ART_ru_ft_B_j_5_3": "範例3：會員投注大於3.5球：",
                        "ART_ru_ft_B_j_5_3_1": "賽事在比分2-1時中斷。",
                        "ART_ru_ft_B_j_5_3_2": "由於賽事在未有明確的結果能裁決會員的注單前中斷，此會員的注單將被取消。",
                    
                        "ART_ru_ft_B_k": "進球: 大 / 小",
                        "ART_ru_ft_B_k_1": "所有上半場的投注將以上半場45分鐘的賽果結算。",
                        "ART_ru_ft_B_k_2": "如果賽事在上半場時節因任何理由取消或中斷，所有上半場注單將被取消。除非在賽事取消或中斷前，結果已經明確。",
                    
                        "ART_ru_ft_B_l": "進球: 大 / 小 - 上半場",
                        "ART_ru_ft_B_l_1": "所有上半場的投注將以上半場45分鐘的賽果結算。",
                        "ART_ru_ft_B_l_2": "如果賽事在上半場時節因任何理由取消或中斷，所有上半場注單將被取消。除非在賽事取消或中斷前，結果已經明確。",
                        "ART_ru_ft_B_l_3": "如果賽事在下半場或加時時段因任何理由取消或中斷，所有上半場注單保持有效。",
                    
                        "ART_ru_ft_B_m": "滾球大小盤",
                        "ART_ru_ft_B_m_1": "結算是以比賽/時節結束後的總入球數做裁決。投注當時，賽事的比分將視為0-0來計算。",
                    
                        "ART_ru_ft_B_n": "加時賽 - 進球: 大 / 小",
                        "ART_ru_ft_B_n_1": "兩支球隊開始加時賽的比分為0-0，之前賽果屬於常規時間內入球不會計算在內。",
                        "ART_ru_ft_B_n_2": "所有的投注將以30分鐘加時賽後結果結算，包括補時。",
                        "ART_ru_ft_B_n_3": "在加時賽結束前如果比賽停止，取消或中斷，所有投注將被視為無效，除非在賽事取消或中斷前，結果已經明確。",
                    
                        "ART_ru_ft_B_o": "加時賽 - 進球: 大 / 小 - 上半場",
                        "ART_ru_ft_B_o_1": "所有投注將會按照15分鐘賽事結束後賽果為準，包含補時。",
                        "ART_ru_ft_B_o_2": "如果比賽在上半場停止，取消或者中斷，所有上半場注單將被視為無效。 ",
                        "ART_ru_ft_B_o_3": "如果比賽在下半場或補時期間停止，取消或者中斷，所有上半場注單將被視為有效。",
                    
                        "ART_ru_ft_B_p": "球隊進球數 - 大 / 小",
                        "ART_ru_ft_B_p_1": "預測在特定的比賽有關期間內，其中一支球隊的總入球數將大於或小於在盤口指定的大/小盤球數。",
                        "ART_ru_ft_B_p_2": "如果賽事的總入球數多於盤口的大/小盤球數，則為大盤。如果少於盤口的大/小盤球數，則為小盤。",
                        "ART_ru_ft_B_p_3": "如果賽事中斷前已有明確結果並且之後沒有任何顯著會影響賽事結果的情況，注單才會被結算。若遇到任何其他情況，注單將一律被取消。",
                    
                        "ART_ru_ft_B_q": "15 分鐘盤口 (大 / 小)",
                        "ART_ru_ft_B_q_1": "預測賽事總入球數將大於或小於在盤口指定的大/小盤球數。",
                        "ART_ru_ft_B_q_2": "如果總進球數多於盤口的大/小盤牌數，則為大盤。如果少於盤口的大/小盤牌數，則為小盤。",
                        "ART_ru_ft_B_q_3": "在每個15分鐘時開始，所有球隊在開始此時節比賽都是0-0，之前的得分是沒有影響的。",
                        "ART_ru_ft_B_q_4": "如果比賽被中斷，所有將要進行的15分鐘時段投注將被視為無效。任何15分鐘時段投注，如果該時段中賽事進行完整，此注單將被視為有效。在15分鐘時段中，如果賽事已有明確結果並且之後對賽事沒有任何影響，總進球數大/小盤注單才會被結算。任何其他的情況，投注將被視為無效。",
                        "ART_ru_ft_B_td_q4_1_1": "15分鐘-時段1",
                        "ART_ru_ft_B_td_q4_1_2": "上半場開始-14分59秒",
                        "ART_ru_ft_B_td_q4_2_1": "15分鐘-時段2",
                        "ART_ru_ft_B_td_q4_2_2": "15分鐘-29分59秒",
                        "ART_ru_ft_B_td_q4_3_1": "15分鐘-時段3",
                        "ART_ru_ft_B_td_q4_3_2": "30分鐘-半場結束",
                        "ART_ru_ft_B_td_q4_4_1": "15分鐘-時段4",
                        "ART_ru_ft_B_td_q4_4_2": "下半場開始-59分59秒",
                        "ART_ru_ft_B_td_q4_5_1": "15分鐘-時段5",
                        "ART_ru_ft_B_td_q4_5_2": "60分鐘-74分59秒",
                        "ART_ru_ft_B_td_q4_6_1": "15分鐘-時段6",
                        "ART_ru_ft_B_td_q4_6_2": "75分鐘-全場結束",
                    
                        "ART_ru_ft_B_r": "加時賽 - 5 分鐘進球數 (大 / 小)",
                        "ART_ru_ft_B_r_1": "預測賽事總入球數將大於或小於在盤口指定的大/小盤球數。",
                        "ART_ru_ft_B_r_2": "如果總進球數多於盤口的大/小盤牌數，則為大盤。如果少於盤口的大/小盤牌數，則為小盤。",
                        "ART_ru_ft_B_r_3": "在每個5分鐘時開始，所有球隊在開始此時節比賽都是0-0，之前的得分是沒有影響的。",
                        "ART_ru_ft_B_r_4": "如果比賽被中斷，所有將要進行的5分鐘時段投注將被視為無效。任何5分鐘時段投注，如果該時段中賽事進行完整，此注單將被視為有效。在5分鐘時段中，如果賽事已有明確結果並且之後對賽事沒有任何影響，總進球數大/小盤注單才會被結算。任何其他的情況，投注將被視為無效。",
                        "ART_ru_ft_B_td_r4_1_1": "5分鐘-時段1",
                        "ART_ru_ft_B_td_r4_1_2": "上半場開始-04分59秒",
                        "ART_ru_ft_B_td_r4_2_1": "5分鐘-時段2",
                        "ART_ru_ft_B_td_r4_2_2": "05分鐘-09分59秒",
                        "ART_ru_ft_B_td_r4_3_1": "5分鐘-時段3",
                        "ART_ru_ft_B_td_r4_3_2": "10分鐘-半場結束",
                        "ART_ru_ft_B_td_r4_4_1": "5分鐘-時段4",
                        "ART_ru_ft_B_td_r4_4_2": "下半場開始-19分59秒",
                        "ART_ru_ft_B_td_r4_5_1": "5分鐘-時段5",
                        "ART_ru_ft_B_td_r4_5_2": "20分鐘-24分59秒",
                        "ART_ru_ft_B_td_r4_6_1": "5分鐘-時段6",
                        "ART_ru_ft_B_td_r4_6_2": "25分鐘-全場結束",
                    
                        "ART_ru_ft_B_s": "1 X  2（獨贏盤）",
                    
                        "ART_ru_ft_B_t": "一般規則",
                        "ART_ru_ft_B_t_1": "預測哪一支球隊將在比賽勝出。盤口提供兩支球隊和平局為投注選項。",
                        "ART_ru_ft_B_t_2": "投注將以0-0的比分作為計算基礎（讓球並不計算在內）。",
                    
                        "ART_ru_ft_B_u": "獨贏",
                        "ART_ru_ft_B_u_1": "預測哪一支球隊將在90分鐘比賽勝出或賽事和局。",
                    
                        "ART_ru_ft_B_v": "獨贏 - 上半場",
                        "ART_ru_ft_B_v_1": "所有上半場的投注將以上半場45分鐘賽果結算。",
                    
                        "ART_ru_ft_B_w": "滾球獨贏",
                        "ART_ru_ft_B_w_1": "預測滾球時，哪一支球隊勝出。",
                        "ART_ru_ft_B_w_2": "投注的結算將以90分鐘完場賽果為準。",
                        "ART_ru_ft_B_w_3": "以下為滾球獨贏盤範例。",
                        "ART_ru_ft_B_td_w3_1_1": " ",
                        "ART_ru_ft_B_td_w3_1_2": "目前得分",
                        "ART_ru_ft_B_td_w3_1_3": "賠率",
                        "ART_ru_ft_B_td_w3_2_1": "阿森納（主）",
                        "ART_ru_ft_B_td_w3_2_2": "1",
                        "ART_ru_ft_B_td_w3_2_3": "1.61",
                        "ART_ru_ft_B_td_w3_3_1": "曼聯",
                        "ART_ru_ft_B_td_w3_3_2": "0",
                        "ART_ru_ft_B_td_w3_3_3": "6.0",
                        "ART_ru_ft_B_td_w3_4_1": "和局",
                        "ART_ru_ft_B_td_w3_4_2": " ",
                        "ART_ru_ft_B_td_w3_4_3": "3.8",
                        "ART_ru_ft_B_w_3_1": "範例1：在賽事比分為阿森納1-0曼聯時，會員投注滾球獨贏盤 – 阿森納贏：",
                        "ART_ru_ft_B_w_3_1_1": "完場賽果為阿森納2-1曼聯。",
                        "ART_ru_ft_B_w_3_1_2": "因阿森納在完場時勝出，所有投注阿森納的注單結算為贏。",
                        "ART_ru_ft_B_w_3_1_3": "所有在比分1-0時投注曼聯或平局的注單將結算為輸。",
                        "ART_ru_ft_B_w_3_2": "範例2：在賽事比分為阿森納1-0曼聯時，會員投注滾球獨贏盤 –曼聯贏：",
                        "ART_ru_ft_B_w_3_2_1": "完場賽果為阿森納1-1曼聯。",
                        "ART_ru_ft_B_w_3_2_2": "因完場賽果為平局，所有投注曼聯以及阿森納的注單將結算為輸。",
                        "ART_ru_ft_B_w_3_2_3": "所有投注平局的注單將結算為贏。",
                        "ART_ru_ft_B_w_4": "加時賽則視為一場新的賽事並且會開出加時賽盤口。投注將按加時賽時節的結果做結算。",
                    
                        "ART_ru_ft_B_x": "加時賽 - 獨贏",
                        "ART_ru_ft_B_x_1": "預測哪一支球隊將會在30分鐘內勝出，或賽事平局，包含補時。",
                        "ART_ru_ft_B_x_2": "如果比賽在加時賽結束前暫停，取消或中止，所有投注將被視為無效。",
                    
                        "ART_ru_ft_B_y": "加時賽 - 獨贏 - 上半場",
                        "ART_ru_ft_B_y_1": "預測哪一支球隊將會在15分鐘內勝出，或賽事平局，包含補時。",
                        "ART_ru_ft_B_y_2": "如果賽事在加時賽上半場取消或中斷，所有上半場注單將會被取消。",
                        "ART_ru_ft_B_y_3": "如果賽事在加時賽下半場取消或中斷，所有上半場注單將被會視為有效。",
                    
                        "ART_ru_ft_B_z": "15 分鐘盤口 (獨贏)",
                        "ART_ru_ft_B_z_1": "預測在規定時段內哪一支球隊將會獲勝，賽事盤口將會提供兩支球隊，以及和局。",
                        "ART_ru_ft_B_z_2": "所有兩支球隊在每時段開始時比分將按照0-0計算，之前比分不計算在內。",
                        "ART_ru_ft_B_z_3": "如果賽事中斷，所有當前15分鐘時段的投注以及將要進行的下一個15分鐘時段投注將視為無效，任何15分鐘時段投注，如果該時段完整結束，注單將被視為有效。",
                        "ART_ru_ft_B_td_z3_1_1": "15分鐘-時段1",
                        "ART_ru_ft_B_td_z3_1_2": "上半場開始-14分59秒",
                        "ART_ru_ft_B_td_z3_2_1": "15分鐘-時段2",
                        "ART_ru_ft_B_td_z3_2_2": "15分鐘-29分59秒",
                        "ART_ru_ft_B_td_z3_3_1": "15分鐘-時段3",
                        "ART_ru_ft_B_td_z3_3_2": "30分鐘-半場",
                        "ART_ru_ft_B_td_z3_4_1": "15分鐘-時段4",
                        "ART_ru_ft_B_td_z3_4_2": "下半場開始-59分59秒",
                        "ART_ru_ft_B_td_z3_5_1": "15分鐘-時段5",
                        "ART_ru_ft_B_td_z3_5_2": "60分鐘-74分59秒",
                        "ART_ru_ft_B_td_z3_6_1": "15分鐘-時段6",
                        "ART_ru_ft_B_td_z3_6_2": "75分鐘-全場結束",
                    
                        "ART_ru_ft_B_aa": "進球數 - 單 / 雙",
                        "ART_ru_ft_B_aa_1": "進球數: 單 / 雙",
                        "ART_ru_ft_B_aa_1_1": "預測90分鐘內，賽事總入球對單或雙。",
                        "ART_ru_ft_B_aa_1_2": "若最終比分為：0-0，將會按照‘雙’來計算。",
                        "ART_ru_ft_B_aa_2": "進球數: 單 / 雙 - 上半場",
                        "ART_ru_ft_B_aa_2_1": "預測45分鐘賽事的總入球數是單數或雙數。",
                        "ART_ru_ft_B_aa_2_2": "若最終比分為：0-0，將會按照‘雙’來計算。",
                        "ART_ru_ft_B_aa_3": "加時賽 - 進球數: 單 / 雙",
                        "ART_ru_ft_B_aa_3_1": "預測加時30分鐘賽事的總入球數是單數或雙數，包含補時。",
                        "ART_ru_ft_B_aa_3_2": "若最終比分為：0-0，將會按照‘雙’來計算。",
                        "ART_ru_ft_B_aa_4": "加時賽 - 進球數: 單 / 雙 -上半場",
                        "ART_ru_ft_B_aa_4_1": "預測加時賽15分鐘內的總進球數是單數或雙數，包括補時。",
                        "ART_ru_ft_B_aa_4_2": "若最終比分為：0-0，將會按照‘雙’來計算。",
                    
                        "ART_ru_ft_B_aa_5": "15 分鐘盤口 (單 / 雙)",
                        "ART_ru_ft_B_aa_5_1": "預測在規定時間內進球數是單或雙。",
                        "ART_ru_ft_B_aa_5_2": "所有兩支球隊在每時段開始時比分將按照0-0計算，之前比分不計算在內。",
                        "ART_ru_ft_B_aa_5_3": "如果賽事中斷，所有當前15分鐘時段的投注以及將要進行的下一個15分鐘時段投注將視為無效，任何15分鐘時段投注，如果該時段完整結束，注單將被視為有效。",
                        "ART_ru_ft_B_td_aa5_1_1": "15分鐘-時段1",
                        "ART_ru_ft_B_td_aa5_1_2": "上半場開始-14分59秒",
                        "ART_ru_ft_B_td_aa5_2_1": "15分鐘-時段2",
                        "ART_ru_ft_B_td_aa5_2_2": "15分鐘-29分59秒",
                        "ART_ru_ft_B_td_aa5_3_1": "15分鐘-時段3",
                        "ART_ru_ft_B_td_aa5_3_2": "30分鐘-半場",
                        "ART_ru_ft_B_td_aa5_4_1": "15分鐘-時段4",
                        "ART_ru_ft_B_td_aa5_4_2": "下半場開始-59分59秒",
                        "ART_ru_ft_B_td_aa5_5_1": "15分鐘-時段5",
                        "ART_ru_ft_B_td_aa5_5_2": "60分鐘-74分59秒",
                    
                        "ART_ru_ft_B_ab": "波膽",
                        "ART_ru_ft_B_ab_1": "預測一場特定賽事中相關時間段的準確比分。",
                        "ART_ru_ft_B_ab_2": "\"任何其他比分\"是指任何的比分，而不是一個市場選項列表類型。",
                    
                        "ART_ru_ft_B_ab_3": "波膽",
                        "ART_ru_ft_B_ab_3_1": "預測一場特定賽事的全場準確比分。",
                        "ART_ru_ft_B_ab_3_2": "全場波膽投注的結算根據90分鐘完場比分做出裁決。",
                        "ART_ru_ft_B_ab_3_3": "如果注單在賽事中斷前已得到明確的勝負，並且任何進一步的賽果均不會對注單結果產生影響的情況下，注單會被視為有效。",
                    
                        "ART_ru_ft_B_ab_4": "波膽 - 上半場",
                        "ART_ru_ft_B_ab_4_1": "預測一場特定賽事半場的準確比分。",
                        "ART_ru_ft_B_ab_4_2": "半場波膽投注是指投注上半場的比賽，投注的結算根據半場‘45分鐘’結束後的比分做出裁決。",
                        "ART_ru_ft_B_ab_4_3": "如果注單在賽事中斷前已得到明確的勝負，並且任何進一步的賽果均不會對注單結果產生影響的情況下，注單會被視為有效。",
                        "ART_ru_ft_B_ab_4_4": "如果賽事在下半場取消，所有半場波膽的投注被視為有效。",
                    
                        "ART_ru_ft_B_ac": "半場/全場",
                        "ART_ru_ft_B_ac_1": "預測賽事的半/全場結果。",
                    
                        "ART_ru_ft_B_ad": "淨勝球數",
                        "ART_ru_ft_B_ad_1": "預測完場比賽結束後的淨勝球數。",
                        "ART_ru_ft_B_ad_2": "投注的結算根據90分鐘完場賽事比分的差別做裁決。",
                        "ART_ru_ft_B_ad_3": "比賽結束為平局將根據比分戰平結算。",
                    
                        "ART_ru_ft_B_ae": "加時賽 - 淨勝球數",
                        "ART_ru_ft_B_ae_1": "預測加時賽結束後的淨勝球數。",
                        "ART_ru_ft_B_ae_2": "所有的投注將以30分鐘加時賽後結果結算，包括補時。",
                        "ART_ru_ft_B_ae_3": "比賽結束為平局將根據比分戰平結算。",
                    
                        "ART_ru_ft_B_af": "雙重機會",
                        "ART_ru_ft_B_af_1": "在三種可能出現的賽果中選擇兩種進行投注; 主場贏或打平（1和X）, 客場贏或打平（2和X）或主場或客場贏（1和2）。",
                        "ART_ru_ft_B_af_2": "共有三種選擇: 1 X, X 2, 1 2：",
                        "ART_ru_ft_B_af_2_1": "\"1\" 代表: 主場贏。",
                        "ART_ru_ft_B_af_2_2": "\"X\" 代表: 平手。",
                        "ART_ru_ft_B_af_2_3": "\"2\" 代表: 客場贏。",
                        "ART_ru_ft_B_af_3": "如果比賽在中立場進行﹐列在盤面的上方球隊則被視為主隊。",
                    
                        "ART_ru_ft_B_ag": "三項讓球投注",
                        "ART_ru_ft_B_ag_1": "根據盤口開出信息預測最終獲勝球隊，包括和局以及第三個可能出現的結果。",
                        "ART_ru_ft_B_ag_2": "結算將會根據選擇的球隊包括和局，並最終在比賽中獲得有利的結果。",
                        "ART_ru_ft_B_ag_3": "和局將會顯示的主場讓球盤， 用於區分作用",
                        "ART_ru_ft_B_ag_4": "選項可列為：",
                        "ART_ru_ft_B_ag_4_1": "主場[-1]=主場讓一球半",
                        "ART_ru_ft_B_ag_4_2": "和局[-1]=主場淨勝一球",
                        "ART_ru_ft_B_ag_4_3": "客場[+1]=客場受讓半球",
                        "ART_ru_ft_B_ag_4_4": "主場[+2]=主場受讓一球半",
                        "ART_ru_ft_B_ag_4_5": "和局[+2]=客場淨勝二球",
                        "ART_ru_ft_B_ag_4_6": "客場[-2]=客場讓二球半",
                    
                        "ART_ru_ft_B_ah": "落後反超獲勝",
                        "ART_ru_ft_B_ah_1": "預測哪一支球隊在比賽的任何時間里都為輸，然而卻在最後‘90分鐘’反超為贏。",
                        "ART_ru_ft_B_ah_2": "選擇的球隊必須在比賽的任何時間里都為輸，但是在接下來的最後‘90分鐘’卻獲勝為贏。",
                        "ART_ru_ft_B_ah_3": "如果比賽被中斷，所有的投注均視為無效。",
                    
                        "ART_ru_ft_B_ai": "平局退單",
                        "ART_ru_ft_B_ai_1": "預測哪一支球隊將在比賽勝出。但若比賽結果為平局，所有投注將被取消。",
                    
                    
                        "ART_ru_ft_C": "進球集錦",
                        "ART_ru_ft_C_a": "總進球數",
                        "ART_ru_ft_C_a_1": "總進球數",
                        "ART_ru_ft_C_a_1_1": "預測全場兩隊的總入球數。",
                        "ART_ru_ft_C_a_1_2": "如果注單在賽事中斷前已得到明確的勝負，並且任何進一步的賽果均不會對注單結果產生影響的情況下，注單會被視為有效。",
                        "ART_ru_ft_C_a_2": "總進球數 - 上半場",
                        "ART_ru_ft_C_a_1_1": "預測半場兩隊的總入球數。",
                        "ART_ru_ft_C_a_1_2": "如果注單在賽事中斷前已得到明確的勝負，並且任何進一步的賽果均不會對注單結果產生影響的情況下，注單會被視為有效。",
                    
                        "ART_ru_ft_C_b": "單一球隊總入球數",
                        "ART_ru_ft_C_b_1": "預測其中一支球隊的總入球數。",
                        "ART_ru_ft_C_b_2": "如果賽事中斷前，注單已得到明確結果並且之後沒有任何顯著會影響賽事結果的情況注單會有被結算  。若遇到任何其他情況，注單將一律被取消。",
                    
                        "ART_ru_ft_C_c": "最先/最後進球",
                        "ART_ru_ft_C_c_1": "在法定比賽90分鐘內，預測最先或最後進球的球隊。",
                        "ART_ru_ft_C_c_2": "烏龍球將予以計算為得分那方入球。比如: A隊VS B隊，B 隊踢進一個烏龍球造成比分1-0，此球計為A隊先進球。",
                        "ART_ru_ft_C_c_3": "如果賽事在有進球後中斷，所有最先進球球隊注單保持有效。",
                        "ART_ru_ft_C_c_4": "如果賽事中斷，所有最後進球球隊注單將被取消。",
                    
                        "ART_ru_ft_C_d": "X 進球 (下一個進球)",
                        "ART_ru_ft_C_d_1": "預測在比賽進行時，哪一支球隊會進下一球。",
                        "ART_ru_ft_C_d_2": "加時賽則視為一場新的賽事並且會開出加時賽盤口。",
                        "ART_ru_ft_C_d_3": "烏龍球將予以計算為得分那方入球。例：A隊VS B隊，如A 隊踢進一個烏龍球，此球計為B隊的分數。",
                        "ART_ru_ft_C_d_4": "如果賽事在沒有進球前中斷或延後，所有注單將被取消。",
                    
                        "ART_ru_ft_C_e": "雙方球隊進球",
                        "ART_ru_ft_C_e_1": "預測雙方球隊在90分鐘完場時間內是否進球。",
                        "ART_ru_ft_C_e_2": "如果賽事在雙方球隊都有進球後中斷，所有注單保持有效。",
                        "ART_ru_ft_C_e_3": "如果賽事在沒有進球前中斷或延後，所有注單將被取消。",
                        "ART_ru_ft_C_e_4": "烏龍球將予以計算為得分那方入球。",
                    
                        "ART_ru_ft_C_f": "雙方球隊進球- 上半場",
                        "ART_ru_ft_C_f_1": "預測雙方球隊在第一個45分鐘時間內是否進球。",
                        "ART_ru_ft_C_f_2": "如果賽事在上半場雙方球隊都有進球後中斷，所有注單保持有效。",
                        "ART_ru_ft_C_f_3": "如果賽事在上半場雙方球隊沒有進球前中斷或延遲，所有注單將被取消。",
                        "ART_ru_ft_C_f_4": "烏龍球將予以計算為得分那方入球。",
                    
                        "ART_ru_ft_C_g": "雙方球隊進球- 下半場",
                        "ART_ru_ft_C_g_1": "預測雙方球隊在第二個45分鐘時間內是否進球。",
                        "ART_ru_ft_C_g_2": "如果賽事在下半場雙方球隊都有進球後中斷，所有注單保持有效。",
                        "ART_ru_ft_C_g_3": "如果賽事在下半場雙方球隊沒有進球前中斷或延遲，所有注單將被取消。",
                        "ART_ru_ft_C_g_4": "烏龍球將予以計算為得分那方入球。",
                    
                        "ART_ru_ft_C_h": "零失球",
                        "ART_ru_ft_C_h_1": "預測某個球隊在90分鐘的比賽中，沒有任何進球。",
                        "ART_ru_ft_C_h_2": "選擇投注球隊不需要贏得比賽，例如：賽果 0-0，注單為贏。",
                    
                        "ART_ru_ft_C_i": "零失球獲勝",
                        "ART_ru_ft_C_i_1": "預測您投注的球隊在90分鐘完場時間內沒有失球及沒讓敵方攻入任何一球。",
                        "ART_ru_ft_C_i_2": "\'無失球\'是指球隊在賽事中沒讓敵方攻入任何一球，爭取完美防守。",
                    
                        "ART_ru_ft_C_j": "先進2球/3球的一方",
                        "ART_ru_ft_C_j_1": "預測在90分鐘完場時間內哪個球隊先進2/3球。",
                        "ART_ru_ft_C_j_2": "如果賽事在一方球隊已經進2/3球後中斷，所有注單將保持有效。",
                        "ART_ru_ft_C_j_3": "如果所選球隊沒有進球，則將被視為本注單為輸。",
                    
                        "ART_ru_ft_C_k": "最多進球的半場",
                        "ART_ru_ft_C_k_1": "在賽事90分鐘結束後，猜測哪個‘45分鐘’半場入球最多。",
                        "ART_ru_ft_C_k_2": "盤口提供兩種投注選擇，如上下半場入球數一樣，注單將被視為無效。",
                        "ART_ru_ft_C_k_3": "選項可列為：",
                        "ART_ru_ft_C_k_3_1": "上半場",
                        "ART_ru_ft_C_k_3_2": "下半場",
                    
                        "ART_ru_ft_C_l": "最多進球的半場 - 獨贏",
                        "ART_ru_ft_C_l_1": "預測在90分鐘完場時間內哪個半場將會進最多球。",
                        "ART_ru_ft_C_l_2": "盤口提供三種投注選擇，如上下半場入球數一樣，投注‘和’將會為贏。",
                        "ART_ru_ft_C_l_3": "選項可列為：",
                        "ART_ru_ft_C_l_3_1": "上半場",
                        "ART_ru_ft_C_l_3_2": "下半場",
                        "ART_ru_ft_C_l_3_3": "平局",
                    
                        "ART_ru_ft_C_m": "雙半場進球",
                        "ART_ru_ft_C_m_1": "預測主隊/客隊在90分鐘完場時間內是否在上下半場都至少進一球。",
                        "ART_ru_ft_C_m_2": "如果投注球隊只有在一個半場有入球，或未入球，注單為輸。",
                        "ART_ru_ft_C_m_3": "烏龍球將只會被計算在得分球隊一方。",
                        "ART_ru_ft_C_m_4": "如果賽事在所投注的球隊已在兩個半場都進球後中斷，所有投注此球隊的注單將結算為贏。",
                        "ART_ru_ft_C_m_5": "如果賽事在下半場中斷，並且所投注的球隊並未在上半場進球，所有投注此球隊的注單將結算為輸。",
                        "ART_ru_ft_C_m_6": "如果上半場進球球隊已經確認，而賽事在下半場中斷，那麼所有投注該球隊注單將被視為有效。",
                    
                        "ART_ru_ft_C_n": "首個進球方式",
                        "ART_ru_ft_C_n_1": "預測首個進球的方式。",
                        "ART_ru_ft_C_n_2": "如果賽事在首個進球後中斷，所有首個進球方式的注單將保持有效。",
                        "ART_ru_ft_C_n_3": "選項可列為：",
                        "ART_ru_ft_C_n_3_1": "任意球：球必須是直接踢進的方式。間接性的任意球如果最後是罰球者本人踢進則計算在內。",
                        "ART_ru_ft_C_n_3_2": "點球：球必須是由罰球者本人直接踢進的方式。若遇到補射的情況，即使是罰球者本人踢進也將不計算在內。",
                        "ART_ru_ft_C_n_3_3": "烏龍球：球必須授予為烏龍球。",
                        "ART_ru_ft_C_n_3_4": "頭球：進球者必須明確的用頭進球。",
                        "ART_ru_ft_C_n_3_5": "射門：所有其他的進球方式。除了以上所列出的方式，所有其他進球的方式都包含在此方式。",
                        "ART_ru_ft_C_n_3_6": "沒有進球：賽事沒有進球。",
                    
                        "ART_ru_ft_C_o": "首個進球時間-3項",
                        "ART_ru_ft_C_o_1": "預測在90分鐘完場時間內首個進球時間，盤口提供無進球投注選項。",
                        "ART_ru_ft_C_o_2": "選項可列為：",
                        "ART_ru_ft_C_td_o2_1_1": "選項 1",
                        "ART_ru_ft_C_td_o2_1_2": "小於等於26分鐘",
                        "ART_ru_ft_C_td_o2_2_1": "選項 2",
                        "ART_ru_ft_C_td_o2_2_2": "大於或等於27分鐘",
                        "ART_ru_ft_C_td_o2_3_1": "選項 3",
                        "ART_ru_ft_C_td_o2_3_2": "沒有進球",
                        "ART_ru_ft_C_o_3": "出於結算的用意，賽事的第一分鐘是從1秒計算到59秒。第二分鐘則是從1分鐘計算到1分59秒，以此類推。",
                        "ART_ru_ft_C_o_4": "範例：如果投注首個進球時間的選項是‘賽事的第26分鐘或之前’，而確實進球的時間為26分鐘49秒，進球的範圍屬於’第27分鐘後’，因此投注將結算為輸。",
                        "ART_ru_ft_C_o_5": "如果賽事在首個進球後中斷，所有首個進球時間的注單將保持有效。",
                        "ART_ru_ft_C_o_6": "如果賽事在沒有進球前中斷，所有首個進球時間的注單將被取消。",
                        "ART_ru_ft_C_o_7": "烏龍球將予以計算在內。裁判判定無效的進球是將不予以計算在內。",
                    
                        "ART_ru_ft_C_p": "首個進球時間",
                        "ART_ru_ft_C_p_1": "預測在90分鐘完場時間內首個進球時間。",
                        "ART_ru_ft_C_p_2": "選項可列為：",
                        "ART_ru_ft_c_td_p2_1_1": "15分鐘-時段1",
                        "ART_ru_ft_c_td_p2_1_2": "上半場開始-14分59秒",
                        "ART_ru_ft_c_td_p2_2_1": "15分鐘-時段2",
                        "ART_ru_ft_c_td_p2_2_2": "15分鐘-29分59秒",
                        "ART_ru_ft_c_td_p2_3_1": "15分鐘-時段3",
                        "ART_ru_ft_c_td_p2_3_2": "30分鐘-半場",
                        "ART_ru_ft_c_td_p2_4_1": "15分鐘-時段4",
                        "ART_ru_ft_c_td_p2_4_2": "下半場開始-59分59秒",
                        "ART_ru_ft_c_td_p2_5_1": "15分鐘-時段5",
                        "ART_ru_ft_c_td_p2_5_2": "60分鐘-74分59秒",
                        "ART_ru_ft_c_td_p2_6_1": "15分鐘-時段6",
                        "ART_ru_ft_c_td_p2_6_2": "75分鐘-全場結束",
                        "ART_ru_ft_C_p_3": "出於結算的用意，賽事的第一分鐘是從1秒計算到59秒。第二分鐘則是從1分鐘計算到1分59秒，以此類推。",
                        "ART_ru_ft_C_p_4": "如果賽事在首個進球後中斷，所有首個進球時間的注單將保持有效。",
                        "ART_ru_ft_C_p_5": "如果賽事在沒有進球前中斷，所有首個進球時間的注單將被取消。",
                        "ART_ru_ft_C_p_6": "烏龍球將予以計算在內。裁判判定無效的進球是將不予以計算在內。",
                    
                        "ART_ru_ft_C_q": "烏龍球",
                        "ART_ru_ft_C_q_1": "預測一場比賽中是否會有烏龍球。",
                        "ART_ru_ft_C_q_2": "根據雙方球隊上場球員是否踢進烏龍球，來進行結算。",
                        "ART_ru_ft_C_q_3": "如果比賽在有烏龍球之前中斷，所有該盤口的投注將被視為無效",
                    
                    
                        "ART_ru_ft_D": "球員",
                        "ART_ru_ft_D_a": "一般規則（第一/最後/任何時間進球得分）",
                        "ART_ru_ft_D_a_1": "“其他”選項是指在官方“90分鐘”比賽內沒有標注的進球數（不包括烏龍球）",
                        "ART_ru_ft_D_a_2": "\'沒有進球\'的選項是指兩隊在官方“90分鐘”內（即全場0-0）打入0球。",
                    
                        "ART_ru_ft_D_b": "最先進球球員",
                        "ART_ru_ft_D_b_1": "按盤口提供的球員出場名單中，預測在90分鐘完場時間內最先入球的球員。",
                        "ART_ru_ft_D_b_2": "烏龍球不計於最先進的球。如果出現烏龍球，下一個或之前的進球才被視為有效。",
                        "ART_ru_ft_D_b_3": "如果賽事唯一的進球是烏龍球，盤口上\"其他\"的選項將結算為贏。",
                        "ART_ru_ft_D_b_4": "如果投注的最先進球球員沒有參與該場賽事或在第一個進球後才進場，注單將被取消。",
                        "ART_ru_ft_D_b_5": "如果投注的最先進球球員在沒有射入第一個球就被罰下場或被其他球員替代，注單將結算為輸。",
                        "ART_ru_ft_D_b_6": "如果賽事在射入第一個球後中斷，所有投注最先進球球員的注單將保持有效。",
                        "ART_ru_ft_D_b_7": "如果賽事在沒有進球前中斷，所有投注最先進球球員的注單將被取消。",
                    
                        "ART_ru_ft_D_c": "最後進球球員",
                        "ART_ru_ft_D_c_1": "按盤口提供的球員出場名單中，預測在90分鐘完場時間內最後入球的球員。",
                        "ART_ru_ft_D_c_2": "烏龍球將不會被視為最後進球。如果出現烏龍球，下一個或之前的進球才被視為有效。",
                        "ART_ru_ft_D_c_3": "如果賽事唯一的進球是烏龍球，盤口上\"其他\"的選項將結算為贏",
                        "ART_ru_ft_D_c_4": "如果投注的最後進球球員在沒有射入最後一個進球就被罰下場或被其他球員替代，注單將結算為輸",
                        "ART_ru_ft_D_c_5": "任何參賽並且上場的球員都可能是最後進球球員。",
                        "ART_ru_ft_D_c_6": "如果賽事在沒有進球前中斷，所有投注最後進球球員的注單將被取消。",
                    
                        "ART_ru_ft_D_d": "任何時間進球球員",
                        "ART_ru_ft_D_d_1": "按盤口提供的球員出場名單中，預測在90分鐘完場時間內哪位球員會進球。",
                        "ART_ru_ft_D_d_2": "如果投注的球員沒有參與該場賽事，注單將被取消。",
                        "ART_ru_ft_D_d_3": "只要球員在比賽的90分鐘完場時間內有上場參與比賽，注單則視為有效。",
                        "ART_ru_ft_D_d_4": "如果賽事在已有球員進球後中斷，所有投注進球球員的注單將保持有效。",
                        "ART_ru_ft_D_d_5": "如果比賽被取消，所有投注在提名的球員的進球均視作無效。然而，如果提名的球員在比賽取消前被紅卡罰下，那麼所有與該球員相關的投注注單將視作輸來結算。",
                        "ART_ru_ft_D_d_6": "烏龍球，加時賽進球和點球都不計於此玩法。",
                    
                        "ART_ru_ft_D_e": "球員特殊投注(進球數)",
                        "ART_ru_ft_D_f": "一般規則",
                        "ART_ru_ft_D_f_1": "上半場投注在45分鐘進行。",
                        "ART_ru_ft_D_f_2": "全場投注在90分鐘結算。",
                        "ART_ru_ft_D_f_3": "雙方球員都必須是比賽先發的11名球員當中注單才視為有效。",
                        "ART_ru_ft_D_f_4": "提供的盤口僅限於球員將參與的指定比賽以及比賽日期。",
                        "ART_ru_ft_D_f_5": "烏龍球將不計算在內。",
                    
                        "ART_ru_ft_D_g": "讓球",
                        "ART_ru_ft_D_g_1": "根據盤口開出信息預測哪一個球員入球最多。",
                        "ART_ru_ft_D_g_2": "如果賽事中斷或推遲，所有注單將會被取消，除非賽事已有明確結果並且之後入球對賽事沒有任何影響。除非賽事已有明確結果並且之後入球對賽事沒有任何影響。",
                    
                        "ART_ru_ft_D_h": "大 / 小",
                        "ART_ru_ft_D_h_1": "預測賽事中不同球員總進球數將大於或小於在盤口指定的大/小盤數。",
                        "ART_ru_ft_D_h_2": "如果賽事中斷或推遲，所有注單將會被取消，除非賽事已有明確結果並且之後入球對賽事沒有任何影響。",
                    
                        "ART_ru_ft_D_i": "獨贏",
                        "ART_ru_ft_D_i_1": "預測哪一個球員將在比賽中入球最多，盤口同樣提供選擇\"平局/和\"。",
                        "ART_ru_ft_D_i_2": "如果賽事中斷或推遲，所有注單將會被取消，除非賽事已有明確結果並且之後入球對賽事沒有任何影響。",
                    
                        "ART_ru_ft_D_j": "單 / 雙",
                        "ART_ru_ft_D_j_1": "預測賽事中球員的總進球數是單數或雙數。",
                        "ART_ru_ft_D_j_2": "如果賽事中斷或推遲，所有注單將會被取消，除非賽事已有明確結果並且之後入球對賽事沒有任何影響。",
                        "ART_ru_ft_D_j_3": "若比賽沒有球員進球，賽果為0，投注’雙’注單為贏。",
                    
                    
                        "ART_ru_ft_E": "特別",
                        "ART_ru_ft_E_a": "開球球隊",
                        "ART_ru_ft_E_a_1": "預測在比賽先開球的球隊。",
                        "ART_ru_ft_E_a_2": "如果賽事在開踢後中斷，所有投注先開球球隊的注單將保持有效。",
                    
                        "ART_ru_ft_E_b": "勝出方法",
                        "ART_ru_ft_E_b_1": "預測哪一支球隊能在球賽中指定的時段內贏得比賽。",
                        "ART_ru_ft_E_b_2": "根據指定的球隊能否在指定的時段內贏得比賽，來進行結算。時段可分為：“90分鐘”，加時賽或點球大戰。",
                    
                        "ART_ru_ft_E_c": "晉級方法",
                        "ART_ru_ft_E_c_1": "預測哪一支球隊能在球賽中指定的時段內贏得比賽，從而晉級到聯賽的下一階段。",
                        "ART_ru_ft_E_c_2": "根據指定的球隊能否在指定的時段內贏得比賽，來進行結算。時段可以選擇：“90分鐘”，加時賽或點球大戰。",
                        "ART_ru_ft_E_c_3": "一場比賽的兩個回合的總比分（包括客場進球規則）將計入“90分鐘”結束的結算。",
                    
                        "ART_ru_ft_E_d": "贏得所有半場",
                        "ART_ru_ft_E_d_1": "預測選擇的球隊在90分鐘完場時間內（不包括加時賽及點球賽）是否在上半場和下半場的進球數多於對手。",
                        "ART_ru_ft_E_d_2": "如果賽事中斷，所有注單將被取消。",
                        "ART_ru_ft_E_d_3": "如果任何一個半場或上/下半場的結果是平局或沒有進球，所有注單將結算為輸。",
                    
                        "ART_ru_ft_E_e": "贏得任一半場",
                        "ART_ru_ft_E_e_1": "預測選擇的球隊在90分鐘完場時間內（不包括加時賽及點球賽）是否在上/下半場的其中一個半場進球數多於對手。",
                        "ART_ru_ft_E_e_2": "如果賽事在下半場中斷，但在上半場其中一方球隊已經獲勝，注單將保持有效。如果兩支球隊在上半場平局，注單將被取消。",
                        "ART_ru_ft_E_e_3": "如果賽事出現平局或上下半場均無進球，所有注單將視為輸。如雙方球隊各贏半場，則投注兩個球隊注單為贏。",
                    
                        "ART_ru_ft_E_f": "射正次數",
                        "ART_ru_ft_E_f_1": "預測在90分鐘完場時間內兩個球隊標射正次數。",
                        "ART_ru_ft_E_f_2": "注單的結算將根據官方賽果或賽事權威機構判定的結果為準。",
                    
                        "ART_ru_ft_E_g": "上半場 – 第一個行動",
                        "ART_ru_ft_E_g_1": "預測在45分鐘完場時間內完成一系列的第一個行動。",
                        "ART_ru_ft_E_g_2": "選項有分為：任意球，球門球，界外球，越位，進球，罰牌和等等。",
                        "ART_ru_ft_E_g_3": "如果賽事在上半場中斷，所有注單將被視爲無效，除了第一個行動注單已有結果。如果賽事在下半場中斷，所有上半場投注將會被視爲有效。",
                        "ART_ru_ft_E_g_4": "全部的單子會依據賽事的官方數據結算。",
                    
                        "ART_ru_ft_E_h": "下半場 – 第一個行動",
                        "ART_ru_ft_E_h_1": "預測在第二段的45分鐘完場時間內完成一系列的第一個行動。",
                        "ART_ru_ft_E_h_2": "選項有分為：任意球，球門球，界外球，越位，進球，罰牌和等等。",
                        "ART_ru_ft_E_h_3": "如果賽事在下半場中斷，所有注單將被視爲無效，除了第一個行動注單已有結果。",
                        "ART_ru_ft_E_h_4": "全部的單子會依據賽事的官方數據結算。",
                    
                        "ART_ru_ft_E_i": "半場傷停補時時間預測",
                        "ART_ru_ft_E_i_1": "預測半場結束傷停補時具體時間。",
                        "ART_ru_ft_E_i_2": "所有注單結算將會按照半場結束後第四裁判舉牌補時的時間為準。",
                        "ART_ru_ft_E_i_3": "預測傷停補時時間，只計算在官方正常90分鐘賽事內的補時，加時賽將不包含在內。",
                    
                        "ART_ru_ft_E_j": "上半場傷停補時大/小",
                        "ART_ru_ft_E_j_1": "預測上半場官方時間45分鐘後的傷停補時時間。",
                        "ART_ru_ft_E_j_2": "如果補時總時間，多於盤口的大/小盤時間，則為大盤。如果少於盤口的大/小盤時間，則為小盤。",
                        "ART_ru_ft_E_j_3": "所有注單結算將會按照第四裁判舉牌補時時間為準，在賽事正常45分鐘結束後確定的補時時間。",
                        "ART_ru_ft_E_j_4": "如果賽事在官方時間45分鐘之內中斷，所有投注上半場傷停補時注單將會取消。",
                        "ART_ru_ft_E_j_5": "如果賽事是在上半場比賽確認結束後中斷，所有投注上半場傷停補時將會被視為有效的。",
                    
                        "ART_ru_ft_E_k": "下半場傷停補時大/小",
                        "ART_ru_ft_E_k_1": "預測下半場的傷停補時時間。",
                        "ART_ru_ft_E_k_2": "如果補時總時間，多於盤口的大/小盤時間，則為大盤。如果少於盤口的大/小盤時間，則為小盤。",
                        "ART_ru_ft_E_k_3": "所有注單結算將會按照第四裁判舉牌補時時間為準，在賽事正常90分鐘結束後確定的補時時間。",
                        "ART_ru_ft_E_k_4": "如果賽事在官方時間90分鐘之內中斷，所有投注下半場傷停補時注單將會取消。",
                    
                        "ART_ru_ft_E_l": "雙半場總傷停補時 — 大/小",
                        "ART_ru_ft_E_l_1": "預測上半場和下半場的傷停補時時間。",
                        "ART_ru_ft_E_l_2": "一旦賽事在官方時間90分鐘完成，總傷停補時將會以上半場和下半場傷停補時之和為結果。",
                        "ART_ru_ft_E_l_3": "如果傷停補時時間多於盤口的大/小盤時間，則為大盤；如果少於盤口的大/小盤時間，則為小盤。",
                        "ART_ru_ft_E_l_4": "如果賽事在官方時間90分鐘之內中斷，所有投注雙半場總傷停補時的注單將會取消。",
                    
                    
                        "ART_ru_ft_F": "角球",
                        "ART_ru_ft_F_a": "角球：一般規則",
                        "ART_ru_ft_F_a_1": "被裁定但並未實際執行的角球將不予以計算在內。",
                        "ART_ru_ft_F_a_2": "注單的結算將根據官方賽果或賽事權威機構判定的結果為準。",
                        "ART_ru_ft_F_a_3": "如果角球需重新進行(例如，在禁區內犯規)，重新進行的角球仍計為同一個角球。",
                    
                        "ART_ru_ft_F_b": "角球：讓球",
                        "ART_ru_ft_F_b_1": "預測在90分鐘完場時間內哪一支球隊在盤口指定的讓球數獲得最多角球。",
                        "ART_ru_ft_F_b_2": "所有注單將按盤口開出的讓球數在玩法的時節結束後結算。",
                    
                        "ART_ru_ft_F_c": "角球: 讓球 - 上半場",
                        "ART_ru_ft_F_c_1": "預測在45分鐘完場時間內哪一支球隊在盤口指定的讓球數獲得最多角球。",
                        "ART_ru_ft_F_c_2": "所有注單將按盤口開出的讓球數在玩法的時節結束後結算。",
                    
                        "ART_ru_ft_F_d": "角球: 大/小",
                        "ART_ru_ft_F_d_1": "預測在90分鐘後完成時間內（包括傷停補時）總獲得的角球將大於或小於在盤口指定的大/小盤球數。",
                        "ART_ru_ft_F_d_2": "如果賽事獲得的總角球數多於盤口的大/小盤球數，則為大盤。如果少於盤口的大/小盤球數，則為小盤。",
                        "ART_ru_ft_F_d_3": "如果賽事中斷前已有明確結果並且之後沒有任何顯著會影響投注結果的情況，角球的大/小盤注單才會被結算。若遇到任何其他情況，注單將一律被取消。",
                    
                        "ART_ru_ft_F_e": "角球: 大 / 小 - 上半場",
                        "ART_ru_ft_F_e_1": "預測在45分鐘後完成時間內總獲得的角球將大於或小於在盤口指定的大/小盤球數。",
                        "ART_ru_ft_F_e_2": "如果賽事獲得的總角球數多於盤口的大/小盤球數，則為大盤。如果少於盤口的大/小盤球數，則為小盤。",
                        "ART_ru_ft_F_e_3": "如果賽事在上半場中斷，所有注單將被視為無效，除非賽事已有明確結果並且之後角球對賽事沒有任何影響。",
                        "ART_ru_ft_F_e_4": "如果賽事在下半場中斷，所有投注上半場角球大/小盤將會被視為有效。",
                    
                        "ART_ru_ft_F_f": "角球：獨贏",
                        "ART_ru_ft_F_f_1": "預測哪一支球隊將在90分鐘比賽內獲得更多角球數，盤口提供兩支球隊和平局為投注選項。",
                        "ART_ru_ft_F_f_2": "如果賽事中斷前已有明確結果並且之後角球對賽事沒有任何影響，總角球數獨贏盤注單將會被結算。若遇到任何其他情況，注單將一律被取消。",
                    
                        "ART_ru_ft_F_g": "角球: 獨贏 - 上半場",
                        "ART_ru_ft_F_g_1": "預測哪一支球隊將在45分鐘比賽內獲得更多角球數，盤口提供兩支球隊和平局為投注選項。",
                        "ART_ru_ft_F_g_2": "如果賽事在上半場中斷，所有注單將被視為無效，除非賽事已有明確結果並且之後角球對賽事沒有任何影響。",
                        "ART_ru_ft_F_g_3": "如果賽事在下半場中斷，所有投注上半場角球獨贏盤將會被視為有效。",
                    
                        "ART_ru_ft_F_h": "角球: 單 / 雙",
                        "ART_ru_ft_F_h_1": "預測90分鐘內賽事的總角球數是單數或雙數。",
                        "ART_ru_ft_F_h_2": "若比賽沒有角球，結果為0，投注’雙’注單將會盈利。",
                        "ART_ru_ft_F_h_3": "如果賽事在上半場中斷，所有注單將被視為無效，除非賽事已有明確結果並且之後角球對賽事沒有任何影響。",
                    
                        "ART_ru_ft_F_i": "角球: 單 / 雙 - 上半場",
                        "ART_ru_ft_F_i_1": "預測45分鐘內賽事的總角球數是單數或雙數。",
                        "ART_ru_ft_F_i_2": "如果賽事在上半場中斷，所有注單將被視為無效，除非賽事已有明確結果並且之後角球對賽事沒有任何影響。",
                        "ART_ru_ft_F_i_3": "如果賽事在下半場中斷，所有投注上半場角球單/雙盤將會被視為有效。",
                    
                        "ART_ru_ft_F_j": "最先/最後角球",
                        "ART_ru_ft_F_j_1": "預測在90分鐘完場時間內，第一或最後獲得角球的球隊。",
                        "ART_ru_ft_F_j_2": "如果賽事在獲得第一個角球後中斷，所有第一個角球的注單將保持有效。",
                        "ART_ru_ft_F_j_3": "如果賽事中斷，所有最後一個角球的注單將被取消。",
                        "ART_ru_ft_F_j_4": "如果賽事並沒有獲得角球，所有第一和最後一個角球的注單將被取消。",
                    
                        "ART_ru_ft_F_k": "最多角球的半場",
                        "ART_ru_ft_F_k_1": "預測在90分鐘完場時間內哪個半場將會獲得最多角球。",
                        "ART_ru_ft_F_k_2": "如果賽事中斷前已有明確結果並且之後沒有任何顯著會影響賽事結果的情況，注單才會被結算。若遇到任何其他情況，注單將一律被取消。",
                    
                        "ART_ru_ft_F_l": "角球 - X角球",
                        "ART_ru_ft_F_l_1": "預測哪支球隊將踢進指定的角球。",
                        "ART_ru_ft_F_l_2": "指定角球將提前提供一個或多個選擇，例如，第四個角球或第四和第五個角球（各自為獨立盤口）。",
                        "ART_ru_ft_F_l_3": "重踢的角球將只計算為一次。",
                        "ART_ru_ft_F_l_4": "如果在踢出指定的角球之前比賽中斷，該角球的投注將被視為無效。所有比賽中斷之前記錄的角球將視為有效。",
                    
                        "ART_ru_ft_F_m": "首個角球時間",
                        "ART_ru_ft_F_m_1": "預測獲得首個角球的時間。",
                        "ART_ru_ft_F_m_2": "選項可列為：",
                        "ART_ru_ft_F_m_2_1": "賽事的第8分鐘或之前。",
                        "ART_ru_ft_F_m_2_2": "第9分鐘後。",
                        "ART_ru_ft_F_m_3": "出於結算的用意，賽事的第一分鐘是從1秒計算到59秒。第二分鐘則是從1分鐘計算到1分59秒，以此類推。",
                        "ART_ru_ft_F_m_4": "範例：如果投注首個角球時間的選項是’賽事的第8分鐘或之前’，而確實踢角球的時間為8分鐘49秒，踢角球時間的範圍屬於’第9分鐘後’，因此投注將結算為輸。",
                        "ART_ru_ft_F_m_5": "如果賽事在獲得第一個角球後中斷，所有首個角球時間的注單將保持有效。",
                        "ART_ru_ft_F_m_6": "如果賽事在沒有獲得角球前中斷，所有首個角球時間的注單將被取消。",
                        "ART_ru_ft_F_m_7": "如果在90分鐘完場時間內並未獲得角球，所有首個角球時間的注單將被取消。",
                        "ART_ru_ft_F_m_8": "如果首個角球需重新進行，那首個角球時間將以重新進行的角球時間為準。",
                    
                        "ART_ru_ft_F_n": "15分鐘角球數",
                        "ART_ru_ft_F_n_1": "依照以上主要市場陳列的15分鐘規則，預測哪隊將在讓球，獨贏，大小或單雙盤口取得勝利。",
                    
                        "ART_ru_ft_F_o": "角球 - 雙重機會",
                        "ART_ru_ft_F_o_1": "在三種可能出現的賽果中選擇兩種進行投注; 主場贏或打平（1和X）, 客場贏或打平（2和X）或主場或客場贏（1和2）。",
                        "ART_ru_ft_F_o_2": "共有三種選擇: 1 X, X 2, 1 2：",
                        "ART_ru_ft_F_o_2_1": "\"1\" 代表: 主場贏。",
                        "ART_ru_ft_F_o_2_2": "\"X\" 代表: 平手。",
                        "ART_ru_ft_F_o_2_3": "\"2\" 代表: 客場贏。",
                    
                    
                        "ART_ru_ft_G": "牌/卡",
                        "ART_ru_ft_G_a": "罰牌：一般規則",
                        "ART_ru_ft_G_a_1": "針對非球員（例如：教練，沒有比賽中替補出場的替補球員，管理人員等等）出示的任何罰牌將不計算在內。",
                        "ART_ru_ft_G_a_2": "黃卡將佔1分，紅卡佔2分。如果球員獲發兩張黃卡，此球員所獲發的總罰牌數將計算為黃卡佔1分以及紅卡佔2分，總分三分。（單場賽事每個球員最高可計3分）",
                        "ART_ru_ft_G_a_3": "注單的結算將根據官方賽果或賽事權威機構判定的結果為準。",
                    
                        "ART_ru_ft_G_b": "罰牌數: 讓球",
                        "ART_ru_ft_G_b_1": "預測在90分鐘完場時間內哪一支球隊根據盤口讓牌信息獲發最多罰牌。",
                        "ART_ru_ft_G_b_2": "所有注單將按盤口開出讓牌信息，在相應投注類型結束後結算。",
                    
                        "ART_ru_ft_G_c": "罰牌數: 讓球 - 上半場",
                        "ART_ru_ft_G_c_1": "預測在45分鐘完場時間內哪一支球隊在盤口指定的讓球數獲發最多罰牌。",
                        "ART_ru_ft_G_c_2": "所有注單將按盤口開出的讓球數在玩法的時節結束後結算。",
                    
                        "ART_ru_ft_G_d": "罰牌數: 大 / 小",
                        "ART_ru_ft_G_d_1": "預測在90分鐘比賽結束後總出示的罰牌數將大於或小於在盤口指定的大/小盤牌數。",
                        "ART_ru_ft_G_d_2": "如果出示的總罰牌數多於盤口的大/小盤牌數，則為大盤。如果少於盤口的大/小盤牌數，則為小盤。",
                        "ART_ru_ft_G_d_3": "如果賽事中斷前已有明確結果並且之後沒有任何顯著會影響投注結果的情況，總罰牌的大/小盤注單才會被結算。若遇到任何其他情況，注單將一律被取消。",
                    
                        "ART_ru_ft_G_e": "罰牌數: 大 / 小 - 上半場",
                        "ART_ru_ft_G_e_1": "預測在半場\"45分鐘\"比賽結束後總出示的罰牌將大於或小於在盤口指定的大/小盤牌數。",
                        "ART_ru_ft_G_e_2": "如果出示的總罰牌數多於盤口的大/小盤牌數，則為大盤。如果少於盤口的大/小盤牌數，則為小盤。",
                        "ART_ru_ft_G_e_3": "如果賽事在上半場中斷，所有注單將會被取消，除非賽事已有明確結果並且之後罰牌對賽事沒有任何影響。",
                        "ART_ru_ft_G_e_4": "如果賽事在下半場中斷，那麼所有投注上半場注單均視為有效。",
                    
                        "ART_ru_ft_G_f": "罰牌數: 獨贏",
                        "ART_ru_ft_G_f_1": "預測哪一支球隊將在90分鐘比賽內獲得最多罰牌，盤口提供兩支球隊和平局為投注選項。",
                        "ART_ru_ft_G_f_2": "如果賽事中斷，所有注單將會被取消，除非賽事已有明確結果並且之後罰牌對賽事沒有任何影響。",
                    
                        "ART_ru_ft_G_g": "罰牌數: 獨贏 - 上半場",
                        "ART_ru_ft_G_g_1": "預測哪一支球隊將在45分鐘比賽內獲得最多罰牌，盤口提供兩支球隊和平局為投注選項。",
                        "ART_ru_ft_G_g_2": "如果賽事在上半場中斷，所有注單將會被取消，除非賽事已有明確結果並且之後罰牌對賽事沒有任何影響。",
                        "ART_ru_ft_G_g_3": "如果賽事在下半場中斷，那麼所有投注上半場注單均視為有效。",
                    
                        "ART_ru_ft_G_h": "罰牌數: 單 / 雙",
                        "ART_ru_ft_G_h_1": "預測90分鐘內賽事的總罰牌數是單數或雙數。",
                        "ART_ru_ft_G_h_2": "如果賽事中斷，所有注單將會被取消，除非賽事已有明確結果並且之後罰牌對賽事沒有任何影響。",
                        "ART_ru_ft_G_h_3": "如無紅、黃牌出現，即’0’，此局可視為平局。",
                    
                        "ART_ru_ft_G_i": "罰牌數: 單 / 雙 - 上半場",
                        "ART_ru_ft_G_i_1": "預測45分鐘內賽事的總罰牌數是單數或雙數。",
                        "ART_ru_ft_G_i_2": "如果賽事在上半場中斷，所有注單將會被取消，除非賽事已有明確結果並且之後罰牌對賽事沒有任何影響。",
                        "ART_ru_ft_G_i_3": "如果賽事在下半場中斷，那麼所有投注上半場注單均視為有效。",
                        "ART_ru_ft_G_i_4": "如無紅、黃牌出現，即’0’，此局可視為平局。",
                    
                        "ART_ru_ft_G_j": "第一張/最後一張罰牌",
                        "ART_ru_ft_G_j_1": "預測在90分鐘完場時間內主隊或客隊裡的球員是否會收到首個或最後一個罰牌（黃卡或紅卡）。",
                        "ART_ru_ft_G_j_2": "如果兩位或以上球員因一個事件獲發罰牌，首先被裁判員出示黃卡或紅卡的球員，將被視為\"優勝者\"為注單進行結算。",
                        "ART_ru_ft_G_j_3": "針對非球員（例如：教練，沒有比賽中替補出場的替補球員，管理人員等等）出示的任何罰牌將不計算在內。",
                        "ART_ru_ft_G_j_4": "如果賽事在出示首個罰牌後中斷，所有首個罰牌的注單將保持有效。",
                        "ART_ru_ft_G_j_5": "如果賽事在出示首個罰牌後中斷，所有最後一個罰牌的注單將被取消。",
                        "ART_ru_ft_G_j_6": "如果賽事在沒有出示任何罰牌前中斷，所有首個和最後一個罰牌的注單將被取消。",
                        "ART_ru_ft_G_j_7": "如果在90分鐘完場時間內並未出示任何罰牌，所有首個和最後一個罰牌的注單將被取消。",
                    
                        "ART_ru_ft_G_k": "罰牌 – X罰牌",
                        "ART_ru_ft_G_k_1": "預測哪支球隊將被判罰指定的罰牌。",
                        "ART_ru_ft_G_k_2": "指定罰牌將提前提供一張或多張選擇，例如，第四張罰牌或第四和第五張罰牌（各自獨立的盤口）",
                        "ART_ru_ft_G_k_3": "如果在指定的罰牌被記錄之前比賽中斷，該張罰牌的投注將被視為無效。所有比賽中斷之前記錄的罰牌將視為有效。",
                    
                        "ART_ru_ft_G_l": "罰牌最多的球隊",
                        "ART_ru_ft_G_l_1": "預測哪一支球隊將由獲收的罰牌累積最多分數。",
                        "ART_ru_ft_G_l_2": "注單將按照90分鐘完場賽事時間內所獲收的黃卡和紅卡累積最高分數的球隊做結算。",
                        "ART_ru_ft_G_l_3": "選項可列為：",
                        "ART_ru_ft_G_l_3_1": "球隊A",
                        "ART_ru_ft_G_l_3_2": "球隊B",
                        "ART_ru_ft_G_l_3_3": "平局",
                    
                        "ART_ru_ft_G_m": "第一張罰牌時間",
                        "ART_ru_ft_G_m_1": "預測出示首個罰牌的時間。",
                        "ART_ru_ft_G_m_2": "選項可列為：",
                        "ART_ru_ft_G_m_2_1": "賽事的第8分鐘或之前。",
                        "ART_ru_ft_G_m_2_2": "第9分鐘後。",
                        "ART_ru_ft_G_m_3": "出於結算的用意，賽事的第一分鐘是從1秒計算到59秒。第二分鐘則是從1分鐘計算到1分59秒，以此類推。",
                        "ART_ru_ft_G_m_4": "範例：如果投注第一張罰牌時間的選項是’賽事的第8分鐘或之前’，而確實出示罰牌的時間為8分鐘49秒，罰牌出示時間的範圍屬於’第9分鐘後’，因此投注將結算為輸。",
                        "ART_ru_ft_G_m_5": "針對非球員（例如：教練，沒有比賽中替補出場的替補球員，管理人員等等）出示的任何罰牌將不計算在內。",
                        "ART_ru_ft_G_m_6": "如果賽事在出示首個罰牌後中斷，所有第一張罰牌時間的注單將保持有效。",
                        "ART_ru_ft_G_m_7": "如果賽事在沒有出示任何罰牌前中斷，所有第一張罰牌時間的注單將被取消。",
                        "ART_ru_ft_G_m_8": "如果在90分鐘完場時間內並未出示任何罰牌，所有第一張罰牌時間的注單將被取消。",
                    
                        "ART_ru_ft_G_n": "紅卡（球員）",
                        "ART_ru_ft_G_n_1": "預測在90分鐘完場時間內是否會出示紅卡。",
                        "ART_ru_ft_G_n_2": "針對非球員（例如：教練，沒有比賽中替補出場的替補球員，管理人員等等）出示的任何罰牌將不計算在內。",
                        "ART_ru_ft_G_n_3": "如果賽事在出示一個紅卡後中斷, 所有是否出示紅卡的注單將保持有效。",
                        "ART_ru_ft_G_n_4": "如果賽事在沒有紅卡出示前中斷， 所有是否出示紅卡的注單將被取消。",
                    
                        "ART_ru_ft_G_o": "15 分鐘罰牌數",
                        "ART_ru_ft_G_o_1": "依照以上主要市場陳列的15分鐘規則，預測哪隊將在讓球，獨贏，大小或單雙盤口取得勝利。",
                    
                        "ART_ru_ft_G_p": "罰牌 - 雙重機會",
                        "ART_ru_ft_G_p_1": "在三種可能出現的賽果中選擇兩種進行投注; 主場贏或打平（1和X）, 客場贏或打平（2和X）或主場或客場贏（1和2）。",
                        "ART_ru_ft_G_p_2": "共有三種選擇: 1 X, X 2, 1 2：",
                        "ART_ru_ft_G_p_2_1": "\"1\" 代表: 主場贏。",
                        "ART_ru_ft_G_p_2_2": "\"X\" 代表: 平手。",
                        "ART_ru_ft_G_p_2_3": "\"2\" 代表: 客場贏。",
                    
                    
                        "ART_ru_ft_H": "任意球",
                        "ART_ru_ft_H_a": "最先/最後任意球",
                        "ART_ru_ft_H_a_1": "預測在90分鐘完場時間內哪個球隊會發出第一或最後一個任意球。",
                        "ART_ru_ft_H_a_2": "如果賽事在發出第一個任意球後中斷，所有第一個任意球的注單將保持有效。",
                        "ART_ru_ft_H_a_3": "如果賽事在發出第一個任意球後中斷，所有最後一個任意球的注單將被取消。",
                        "ART_ru_ft_H_a_4": "如果賽事在沒有發出任何任意球前中斷，所有第一個和最後一個任意球的注單將被取消。",
                        "ART_ru_ft_H_a_5": "如果在90分鐘完場時間內並未發出任何任意球，所有第一個和最後一個任意球的注單將被取消。",
                    
                    
                        "ART_ru_ft_I": "射門",
                        "ART_ru_ft_I_a": "最先/最後球門球",
                        "ART_ru_ft_I_a_1": "預測在90分鐘完場時間內哪個球隊會發出第一或最後一個球門球。",
                        "ART_ru_ft_I_a_2": "如果賽事在發出第一個球門球後中斷，所有第一個球門球的注單將保持有效。",
                        "ART_ru_ft_I_a_3": "如果賽事在發出第一個球門球後中斷，所有最後一個球門球的注單將被取消。",
                        "ART_ru_ft_I_a_4": "如果賽事在沒有發出任何球門球前中斷，所有第一個和最後一個球門球的注單將被取消。",
                        "ART_ru_ft_I_a_5": "如果在90分鐘完場時間內並未發出任何球門球，所有第一個和最後一個球門球的注單將被取消。",
                    
                    
                        "ART_ru_ft_J": "界外球",
                        "ART_ru_ft_J_a": "最先/最後界外球",
                        "ART_ru_ft_J_a_1": "預測在90分鐘完場時間內哪個球隊會發出第一或最後一個界外球。",
                        "ART_ru_ft_J_a_2": "如果賽事在發出第一個界外球後中斷，所有第一個界外球的注單將保持有效。",
                        "ART_ru_ft_J_a_3": "如果賽事在發出第一個界外球後中斷，所有最後一個界外球的注單將被取消。",
                        "ART_ru_ft_J_a_4": "如果賽事在沒有發出任何界外球前中斷，所有第一個和最後一個界外球的注單將被取消。",
                        "ART_ru_ft_J_a_5": "如果在90分鐘完場時間內並未發出任何界外球，所有第一個和最後一個界外球的注單將被取消。",
                    
                    
                        "ART_ru_ft_K": "替換",
                        "ART_ru_ft_K_a": "最先/最後替補",
                        "ART_ru_ft_K_a_1": "預測在90分鐘完場時間內哪個球隊會最先或最後替補球員。",
                        "ART_ru_ft_K_a_2": "如果兩位或以上球員同時被替補，首先被裁判員出示替補的球員，將被視為\"優勝者\"為注單進行結算。",
                        "ART_ru_ft_K_a_3": "如果賽事在替補第一個球員後中斷，所有第一個替補的注單將保持有效。",
                        "ART_ru_ft_K_a_4": "如果賽事在替補第一個球員後中斷，所有最後一個替補的注單將被取消，除非在賽事中斷前，結果已經明確並且若之後有任何潛在替補將對盤口結算裁決沒有影響。此情況只有當雙方球隊都將已分配好的替補機會用完。若遇到任何其他情況，注單將一律被取消。",
                        "ART_ru_ft_K_a_5": "如果賽事在沒有任何替補前中斷，所有第一個和最後一個替補的注單將被取消。",
                        "ART_ru_ft_K_a_6": "如果在90分鐘完場時間內並未任何替補，所有第一個和最後一個替補的注單將被取消。",
                    
                    
                        "ART_ru_ft_L": "越位",
                        "ART_ru_ft_L_a": "最先/最後越位",
                        "ART_ru_ft_L_a_1": "預測在90分鐘完場時間內哪個球隊的球員會最先或最後越位。",
                        "ART_ru_ft_L_a_2": "如果賽事在第一個球員越位後中斷，所有第一個越位的注單將保持有效。",
                        "ART_ru_ft_L_a_3": "如果賽事在第一個球員越位後中斷，所有最後一個越位的注單將被取消。",
                        "ART_ru_ft_L_a_4": "如果賽事在沒有任何球員越位前中斷，所有第一個和最後一個越位的注單將被取消。",
                        "ART_ru_ft_L_a_5": "如果在90分鐘完場時間內並未有任何球員越位，所有第一個和最後一個越位的注單將被取消。",
                    
                    
                        "ART_ru_ft_M": "點球",
                        "ART_ru_ft_M_a": "一般規則",
                        "ART_ru_ft_M_a_1": "點球大戰將根據勝出回合(和已踢進的點球)來進行結算。",
                        "ART_ru_ft_M_a_2": "如果比賽規則註明必須完成全部點球，任何在已有明確勝出結果後的點球將不計於結算成績內。",
                    
                        "ART_ru_ft_M_b": "點球榮獲",
                        "ART_ru_ft_M_b_1": "預測在90分鐘完場時間內是否會罰點球。",
                    
                        "ART_ru_ft_M_c": "點球大戰 - 讓球",
                        "ART_ru_ft_M_c_1": "預測哪一支球隊根據盤口指定的讓球數在點球賽裡獲勝。",
                        "ART_ru_ft_M_c_2": "驟死賽得分也包括在點球讓球盤。",
                        "ART_ru_ft_M_c_3": "如果賽事並未進行點球，所有注單將被取消。",
                        "ART_ru_ft_M_c_4": "在90分鐘完場時間內以及加時賽踢進的點球將不計算在內。",
                    
                        "ART_ru_ft_M_d": "進球: 大 / 小",
                        "ART_ru_ft_M_d_1": "預測點球賽總入球數將大於或小於在盤口指定的大/小盤球數。",
                        "ART_ru_ft_M_d_2": "點球大小盤只以10個點球為準（每隊5球）。驟死賽得分不包括在點球大小盤。",
                        "ART_ru_ft_M_d_3": "範例：",
                        "ART_ru_ft_M_d_3_1": "利物浦 4-1托特納姆熱刺 – 大小球以5球結算。",
                        "ART_ru_ft_M_d_3_2": "利物浦6-5托特納姆熱刺（每隊踢5個點球後的結果為：利物浦4-4托特納姆熱刺）-大小盤在每隊踢5個點球後的8球得分結算。",
                        "ART_ru_ft_M_d_4": "如果賽事並未進行點球，所有注單將被取消。",
                        "ART_ru_ft_M_d_5": "在90分鐘完場時間內以及加時賽踢進的點球將不計算在內。",
                        "ART_ru_ft_M_d_6": "如果賽事在點球賽時中斷，而在賽事中斷前已有明確結果並且之後沒有任何顯著會影響投注結果的情況，大/小盤注單才會被結算。若遇到任何其他情況，注單將一律被取消。",
                    
                        "ART_ru_ft_M_e": "點球大戰 - 獨贏",
                        "ART_ru_ft_M_e_1": "預測哪一支球隊將在點球大戰勝出或和局。",
                        "ART_ru_ft_M_e_2": "驟死賽(第6回合起) 將不計算在內。",
                        "ART_ru_ft_M_e_3": "點球獨贏盤只計算球隊在前5回合的進球。",
                    
                        "ART_ru_ft_M_f": "點球：進球/無進球",
                        "ART_ru_ft_M_f_1": "預測特定的球隊是否會踢進指定的點球。",
                        "ART_ru_ft_M_f_2": "根據點球是否進球來進行結算。",
                    
                        "ART_ru_ft_M_g": "點球大戰",
                        "ART_ru_ft_M_g_1": "預測一場比賽是否會有點球大戰。",
                        "ART_ru_ft_M_g_2": "無論此前是否有進行加時賽， 將根據比賽是否有點球大戰來進行結算。",
                    
                        "ART_ru_ft_M_h": "點球大戰 – X 回合",
                        "ART_ru_ft_M_h_1": "預測哪一支球隊將在點球大戰的X回合勝出或和局。",
                        "ART_ru_ft_M_h_2": "X回合是指兩個球隊在該回合的點球比分。",
                        "ART_ru_ft_M_h_2_1": "範例1: (點球大戰開始) - A隊第一個點球和B隊第一個點球為第一回合。",
                        "ART_ru_ft_M_h_2_2": "範例2: (驟死賽開始) - A隊第六個點球和B隊第六個點球為第六回合。",
                        "ART_ru_ft_M_h_3": "根據點球大戰每個回合的所進的點球來進行結算。",
                        "ART_ru_ft_M_h_4": "如果點球大戰在指定回合前結束,投注將視為無效。",
                    
                        "ART_ru_ft_M_i": "點球大戰 – 結束回合",
                        "ART_ru_ft_M_i_1": "預測點球大戰將的結束回合。",
                        "ART_ru_ft_M_i_2": "根據點球大戰是在第三，第四，第五，第六或以後的回合來進行結算。",
                        "ART_ru_ft_M_i_3": "如果在賽果公佈之前比賽中斷，所有該盤口的投注將被視為無效。",
                    
                    
                        "ART_ru_ft_N": "比賽",
                        "ART_ru_ft_N_a": "聯賽：一般規則",
                        "ART_ru_ft_N_a_1": "賽果確認完成後將進行派彩。",
                        "ART_ru_ft_N_a_2": "聯賽的派彩將以官方來源或相關體育權威機構判定的結果為準。",
                        "ART_ru_ft_N_a_3": "所有聯賽的積分扣除都予以計算。",
                        "ART_ru_ft_N_a_4": "冠軍比賽規則適用。",
                    
                        "ART_ru_ft_N_b": "小組賽",
                        "ART_ru_ft_N_b_1": "預測整個賽季中排名最高的球隊。",
                    
                        "ART_ru_ft_N_c": "排名前4、6、10、等",
                        "ART_ru_ft_N_c_1": "預測整個賽季中排名在前4、6、10等的球隊。",
                    
                        "ART_ru_ft_N_e": "沒有球隊X的聯賽冠軍",
                        "ART_ru_ft_N_e_1": "預測整個賽季中，當所列出的球隊或某球隊從聯賽表中移除後，哪一支球隊將獲得冠軍。",
                    
                        "ART_ru_ft_N_d": "聯賽：賽季讓分盤",
                        "ART_ru_ft_N_d_1": "根據每一隊讓分盤口的差點預測哪支球隊將會獲勝。",
                        "ART_ru_ft_N_d_2": "球隊個別的讓分數將會添加到該隊賽季的最終積分里。",
                        "ART_ru_ft_N_d_3": "擁有最高綜合總分(讓分數和賽季最終積分)的球隊為贏家。",
                        "ART_ru_ft_N_d_4": "此盤口將採用並列名次規則。",
                        "ART_ru_ft_N_d_5": "球隊讓分數將不會在賽季中變更,然而賠率將會有所調整。",
                        "ART_ru_ft_N_d_6": "球隊(賽季前)讓分數將顯示在個別球隊名旁。",
                        "ART_ru_ft_N_d_7": "下列為5隊聯賽例子",
                        "ART_ru_ft_N_td_d7_1_1": "球隊",
                        "ART_ru_ft_N_td_d7_1_2": "賽季最終積分",
                        "ART_ru_ft_N_td_d7_1_3": "讓分數",
                        "ART_ru_ft_N_td_d7_1_4": "綜合總分",
                        "ART_ru_ft_N_td_d7_1_5": "最終排名",
                        "ART_ru_ft_N_td_d7_2_1": "球隊1",
                        "ART_ru_ft_N_td_d7_2_2": "90",
                        "ART_ru_ft_N_td_d7_2_3": "3",
                        "ART_ru_ft_N_td_d7_2_4": "93",
                        "ART_ru_ft_N_td_d7_2_5": "第2",
                        "ART_ru_ft_N_td_d7_3_1": "球隊2",
                        "ART_ru_ft_N_td_d7_3_2": "85",
                        "ART_ru_ft_N_td_d7_3_3": "0",
                        "ART_ru_ft_N_td_d7_3_4": "85",
                        "ART_ru_ft_N_td_d7_3_5": "第5",
                        "ART_ru_ft_N_td_d7_4_1": "球隊3",
                        "ART_ru_ft_N_td_d7_4_2": "82",
                        "ART_ru_ft_N_td_d7_4_3": "5",
                        "ART_ru_ft_N_td_d7_4_4": "87",
                        "ART_ru_ft_N_td_d7_4_5": "第4",
                        "ART_ru_ft_N_td_d7_5_1": "球隊4",
                        "ART_ru_ft_N_td_d7_5_2": "79",
                        "ART_ru_ft_N_td_d7_5_3": "15",
                        "ART_ru_ft_N_td_d7_5_4": "94",
                        "ART_ru_ft_N_td_d7_5_5": "第1",
                        "ART_ru_ft_N_td_d7_6_1": "球隊5",
                        "ART_ru_ft_N_td_d7_6_2": "79",
                        "ART_ru_ft_N_td_d7_6_3": "9",
                        "ART_ru_ft_N_td_d7_6_4": "88",
                        "ART_ru_ft_N_td_d7_6_5": "第3",
                    
                        "ART_ru_ft_N_f": "聯賽：最後一名球隊",
                        "ART_ru_ft_N_f_1": "預測整個賽季中哪一支球隊會成為最後一名。",
                        "ART_ru_ft_N_f_2": "此類投注也被稱為最低分。",
                    
                        "ART_ru_ft_N_g": "聯賽：被降級的球隊",
                        "ART_ru_ft_N_g_1": "預測在比賽中哪一支球隊會被降級。",
                        "ART_ru_ft_N_g_2": "所有被降級球隊將以全贏作為計算標準，比如：並列名次規則不適用。",
                        "ART_ru_ft_N_g_3": "如果一支球隊從聯賽中被移除或清除，投注在此球隊的注單將被視為無效。如果在賽季開始之前出現此情況，所有的投注都無效，將會另外開設盤口。",
                    
                        "ART_ru_ft_N_h": "聯賽：球隊保持原位",
                        "ART_ru_ft_N_h_1": "預測比賽中哪一支球隊不會被降級。",
                        "ART_ru_ft_N_h_2": "所有沒有被降級的球隊將以全贏作為計算標準，比如：並列名次規則不適用。",
                        "ART_ru_ft_N_h_3": "如果一支球隊從聯賽中被移除或清除，投注在此球隊的注單將被視為無效。如果在賽季開始之前出現此情況，所有的投注都無效，將會另外開設盤口。",
                    
                        "ART_ru_ft_N_i": "聯賽：球隊晉級",
                        "ART_ru_ft_N_i_1": "預測比賽中哪一支球隊會晉級。",
                        "ART_ru_ft_N_i_2": "投注包括自動晉級以及在特定比賽中通過加賽後的晉級。",
                        "ART_ru_ft_N_i_3": "所有晉級的球隊將以全贏作為計算標準，比如：並列名次規則不適用。",
                        "ART_ru_ft_N_i_4": "如果一支球隊從聯賽中被移除或清除，投注在此球隊的注單將被視為無效。如果在賽季開始之前出現此情況，所有的投注都無效，將會另外開設盤口。",
                    
                        "ART_ru_ft_N_j": "聯賽：最佳新秀",
                        "ART_ru_ft_N_j_1": "預測哪一支最新晉級的球隊將在賽季中獲得最高排名。",
                    
                        "ART_ru_ft_N_k": "比賽 - 進球最多的球隊",
                        "ART_ru_ft_N_k_1": "預測在比賽中哪一個球隊失球最多。",
                        "ART_ru_ft_N_k_2": "所有的投注以賽事官方90分鐘為完場時間，包括加時、傷停補時。",
                        "ART_ru_ft_N_k_3": "在點球中的失球不予計算。",
                        "ART_ru_ft_N_k_4": "如果賽事中斷，將以官方單位公佈的最後賽果為準，其中包括賽事重新開始或指定的分數。",
                    
                        "ART_ru_ft_N_l": "比賽 - 失球最多的球隊",
                        "ART_ru_ft_N_l_1": "預測在比賽中哪一個球隊失球最多。",
                        "ART_ru_ft_N_l_2": "所有的投注以賽事官方90分鐘為完場時間，包括加時、傷停補時。",
                        "ART_ru_ft_N_l_3": "在點球中的失球不予計算。",
                        "ART_ru_ft_N_l_4": "如果賽事中斷，將以官方單位公佈的最後賽果為準，其中包括賽事重新開始或指定的分數。",
                    
                        "ART_ru_ft_N_m": "比賽 – 總進球數",
                        "ART_ru_ft_N_m_1": "預測在比賽中進球的數量。",
                        "ART_ru_ft_N_m_2": "所有的投注以賽事官方90分鐘為完場時間，包括加時、傷停補時。",
                        "ART_ru_ft_N_m_3": "在比賽中點球的進球不予計算。",
                        "ART_ru_ft_N_m_4": "如果賽事中斷，將以官方單位公佈的最後賽果為準，其中包括賽事重新開始或指定的分數。",
                    
                        "ART_ru_ft_N_n": "比賽 - 帽子戲法",
                        "ART_ru_ft_N_n_1": "預測在比賽中任何一位球員進3個或以上的球。",
                        "ART_ru_ft_N_n_2": "所有的投注以賽事官方90分鐘為完場時間，包括加時、傷停補時。",
                        "ART_ru_ft_N_n_3": "帽子戲法不包含點球中的進球。",
                        "ART_ru_ft_N_n_4": "在一場比賽中如果一個球員進球3個或更多，即為帽子戲法。",
                        "ART_ru_ft_N_n_5": "如果賽事中斷，將以官方單位公佈的最後賽果為準，其中包括賽事重新開始或指定的得分。如果帽子戲法是在賽事中斷前，且賽事在0-0的情況下或者其它官方單位分配的比分下重新開始，將不予計算。",
                    
                        "ART_ru_ft_N_o": "比賽 - 總帽子戲法",
                        "ART_ru_ft_N_o_1": "預測在比賽中獲得了多少帽子戲法。",
                        "ART_ru_ft_N_o_2": "所有的投注以賽事官方90分鐘為完場時間，包括加時、傷停補時。",
                        "ART_ru_ft_N_o_3": "帽子戲法不包含點球中的進球。",
                        "ART_ru_ft_N_o_4": "在一場比賽中如果一個球員進球3個或更多，即為帽子戲法。",
                        "ART_ru_ft_N_o_5": "如果賽事中斷，將以官方單位公佈的最後賽果為準，其中包括賽事重新開始或指定的分數。如果帽子戲法是在賽事中斷前，且賽事在0-0的情況下或者其它官方單位分配的比分下重新開始，將不予計算。",
                    
                        "ART_ru_ft_N_p": "比賽 – 總紅卡數",
                        "ART_ru_ft_N_p_1": "預測在比賽中紅卡的數量。",
                        "ART_ru_ft_N_p_2": "所有的投注以賽事官方90分鐘為完場時間，包括加時、傷停補時。",
                        "ART_ru_ft_N_p_3": "任何非球員的紅卡（例如.經理、教練或替補）不予計算。",
                        "ART_ru_ft_N_p_4": "點球中的紅卡不予計算。",
                        "ART_ru_ft_N_p_5": "如果賽事在出現紅卡之後中斷，紅卡仍然計算在總紅卡數中。",
                    
                        "ART_ru_ft_N_q": "比賽 – 總黃卡數",
                        "ART_ru_ft_N_q_1": "預測在比賽中黃卡的數量。",
                        "ART_ru_ft_N_q_2": "所有的投注以賽事官方90分鐘為完場時間，包括加時、傷停補時。",
                        "ART_ru_ft_N_q_3": "任何非球員的黃卡（例如.經理、教練或替補）不予計算",
                        "ART_ru_ft_N_q_4": "點球中的黃卡不予計算",
                        "ART_ru_ft_N_q_5": "如果同個球員被出示第二張黃卡，第二張黃卡會被計算在內。",
                    
                        "ART_ru_ft_N_r": "比賽 – 進球最多的城市",
                        "ART_ru_ft_N_r_1": "預測在比賽中哪一個城市將會進球最多。",
                        "ART_ru_ft_N_r_2": "所有的投注以官方時間90分鐘為準，包括加時、傷停補時。",
                        "ART_ru_ft_N_r_3": "點球中的進球不予計算。",
                        "ART_ru_ft_N_r_4": "如果賽事中斷，將以官方單位公佈的最後賽果為準，其中包括賽事重新開始或指定的分數。",
                    
                        "ART_ru_ft_N_s": "比賽 – 獲勝小組",
                        "ART_ru_ft_N_s_1": "預測在比賽中哪一個小組將會獲勝。",
                        "ART_ru_ft_N_s_2": "冠軍比賽規則適用。",
                    
                        "ART_ru_ft_N_t": "錦標賽 – 小組最後一名球隊",
                        "ART_ru_ft_N_t_1": "預測哪一個球隊為最後一名。",
                        "ART_ru_ft_N_t_2": "冠軍比賽規則適用。",
                    
                        "ART_ru_ft_N_u": "冠軍所屬地",
                        "ART_ru_ft_N_u_1": "預測比賽的冠軍來自哪裡。",
                        "ART_ru_ft_N_u_2": "來源地可以是冠軍球隊的所屬地區、國家或洲。",
                        "ART_ru_ft_N_u_3": "冠軍比賽規則使用。",
                    
                        "ART_ru_ft_N_v": "比賽 - 晉級",
                        "ART_ru_ft_N_v_1": "預測那支隊伍會晉級去下一輪賽事。",
                        "ART_ru_ft_N_v_2": "投注包括自動晉級以及在加時賽與點球大戰后的晉級。",
                        "ART_ru_ft_N_v_3": "符合冠軍規則。",
                    
                        "ART_ru_ft_N_w": "比賽 - 階段淘汰",
                        "ART_ru_ft_N_w_1": "預測比賽中該球隊會在哪一個階段被淘汰。",
                        "ART_ru_ft_N_w_2": "冠軍比賽規則使用。",
                    
                        "ART_ru_ft_N_x": "比賽 - 提名入圍",
                        "ART_ru_ft_N_x_1": "預測哪一支球隊會進入決賽。",
                        "ART_ru_ft_N_x_2": "冠軍比賽規則適用。",
                    
                        "ART_ru_ft_N_y": "比賽 – 最終裁判員",
                        "ART_ru_ft_N_y_1": "預測決賽中的裁判員是哪一位。",
                        "ART_ru_ft_N_y_2": "無論此前是否有任何公告，將根據決賽開始後的裁判為派彩依據。",
                        "ART_ru_ft_N_y_3": "冠軍比賽規則適用。",
                    
                        "ART_ru_ft_N_z": "直接預測排名（聯賽、比賽）",
                        "ART_ru_ft_N_z_1": "預測在比賽或聯賽中哪兩個球隊獲得第1名和第2名的順序排名。",
                        "ART_ru_ft_N_z_2": "所有的投注以官方時間90分鐘為準，包括加時、傷停補時。",
                        "ART_ru_ft_N_z_3": "如果賽事中斷，將以官方單位公佈的最後賽果為準，其中包括賽事重新開始或指定的分數。",
                    
                        "ART_ru_ft_N_aa": "雙預測排名",
                        "ART_ru_ft_N_aa_1": "預測在比賽或聯賽中哪兩個球隊為前兩名的排名。",
                        "ART_ru_ft_N_aa_2": "所有的投注以官方時間90分鐘為準，包括加時、傷停補時。",
                        "ART_ru_ft_N_aa_3": "如果賽事中斷，將以官方單位公佈的最後賽果為準，其中包括賽事重新開始或指定的分數。",
                    
                        "ART_ru_ft_N_ab": "最佳射手",
                        "ART_ru_ft_N_ab_1": "預測在一場特定比賽中進球最多的球員。",
                        "ART_ru_ft_N_ab_2": "如果產生超過一個冠軍數量, 請以並列名次規則參考結算方式。",
                        "ART_ru_ft_N_ab_3": "投注在被列出的該球隊球員將被視為有效，無論他們是否受傷、暫停、不參與比賽或其它任何原因。",
                        "ART_ru_ft_N_ab_4": "如果聯賽中途有球員轉到同一個聯賽的另一個球隊, 球員在轉到另一個球隊前所進得球數將繼續計算在內。如果球員是轉到不同聯賽的球隊，在轉之前進得球數將不會繼續帶到新聯賽去。兩種情況下，投注此球員的注單將保持有效。",
                        "ART_ru_ft_N_ab_5": "烏龍球將不予計算在內。",
                        "ART_ru_ft_N_ab_6": "按照單純的聯賽比賽玩法，只有在聯賽中進得球才計算在內。在季後賽進得球將不予計算在內。",
                    
                        "ART_ru_ft_N_ac": "最佳射手球隊",
                        "ART_ru_ft_N_ac_1": "預測比賽中哪一個球員在所屬球隊中進球最多。",
                        "ART_ru_ft_N_ac_2": "所有的投注以官方時間90分鐘為準，包括加時、傷停補時。",
                        "ART_ru_ft_N_ac_3": "進球數不包括點球。",
                        "ART_ru_ft_N_ac_4": "投注適用於所有比賽的球隊。",
                        "ART_ru_ft_N_ac_5": "並列名次規則適用；任何用於決定和局的方法不可作為結算依據，比如：計數協助。",
                    
                        "ART_ru_ft_N_ad": "最佳射手 / 比賽雙贏",
                        "ART_ru_ft_N_ad_1": "預測比賽中哪一個球員進球最多和哪一支球隊獲勝。",
                        "ART_ru_ft_N_ad_2": "所有的投注以官方時間90分鐘為準，包括加時、傷停補時。",
                        "ART_ru_ft_N_ad_3": "進球數不包括點球。",
                        "ART_ru_ft_N_ad_4": "如果多於一個球員和最佳射手打平，並列名次規則適用；任何用於決定和局的方法不可作為結算依據，比如：計數協助。",
                    
                        "ART_ru_ft_N_ae": "進球最多的小組",
                        "ART_ru_ft_N_ae_1": "預測在比賽中哪一組進球最多。",
                        "ART_ru_ft_N_ae_2": "只計算在小組階段的進球。",
                        "ART_ru_ft_N_ae_3": "所有的投注以賽事官方單位90分鐘為完場時間，包括球員傷停補時。",
                        "ART_ru_ft_N_ae_4": "如果賽事中斷，將以官方單位公佈的最後賽果為準，其中包括賽事重新開始或指定的分數。",
                    
                        "ART_ru_ft_N_af": "加時賽",
                        "ART_ru_ft_N_af_1": "預測一場比賽是否會有加時賽。",
                        "ART_ru_ft_N_af_2": "根據比賽是否在正常的“90分鐘”結束，還是進行了加時賽結束，來進行結算。",
                    
                        "ART_ru_ft_N_ag": "比賽-季軍",
                        "ART_ru_ft_N_ag_1": "預測那支隊伍會在季軍戰勝出。",
                        "ART_ru_ft_N_ag_2": "投注包括自動晉級以及在加時賽與點球大戰後的晉級。",
                        "ART_ru_ft_N_ag_3": "符合冠軍規則。",
                    
                        "ART_ru_ft_N_ah": "比賽-分組賽冠軍",
                        "ART_ru_ft_N_ah_1": "從指定的兩個球隊預測選出誰將榮登小組榜首。",
                        "ART_ru_ft_N_ah_2": "結算以整個小組所有賽事結束後並且官方宣佈的結果為準。",
                        "ART_ru_ft_N_ah_3": "如果出現兩個球隊比分相同的情況，結果將以官方宣佈的獲勝者將為準（球分差異，淨勝球等等）。",
                        "ART_ru_ft_N_ah_4": "如果官方沒有宣佈獲勝者，所有投注將會被取消。",
                    
                    
                        "ART_ru_ft_O": "綜合市場",
                        "ART_ru_ft_O_a": "獨贏 & 進球 大/小",
                        "ART_ru_ft_O_a_1": "同時預測“90分鐘”後的比賽結果，以及賽事總入球數將大於或小於在盤口指定的大/小盤球數。",
                        "ART_ru_ft_O_a_2": "根據所選球隊的輸、贏或和局，以及全場比賽的總進球數，來進行結算。",
                        "ART_ru_ft_O_a_3": "如果在賽果公佈之前比賽中斷，所有該盤口的投注將被視為無效。",
                    
                        "ART_ru_ft_O_b": "獨贏 & 雙方球隊進球",
                        "ART_ru_ft_O_b_1": "同時預測“90分鐘”後的比賽結果，以及雙方球隊是否都有進球。",
                        "ART_ru_ft_O_b_2": "根據所選特定球隊的輸、贏或和局，以及每支球隊的進球數，來進行結算。",
                        "ART_ru_ft_O_b_3": "如果在賽果公佈之前比賽中斷，所有該盤口的投注將被視為無效。",
                    
                        "ART_ru_ft_O_c": "獨贏 & 最先進球",
                        "ART_ru_ft_O_c_1": "同時預測“90分鐘”後的比賽結果，以及哪支球隊將最先進球。",
                        "ART_ru_ft_O_c_2": "根據所選球隊的輸、贏或和局，以及是否正確的選擇了最先進球球隊，來進行結算。",
                        "ART_ru_ft_O_c_3": "如果在賽果公佈之前比賽中斷，所有該盤口的投注將被視為無效。",
                        "ART_ru_ft_O_c_4": "如果賽事沒有首個進球，所有投注將會以輸結算。",
                    
                        "ART_ru_ft_O_d": "獨贏 & 進球 單/雙",
                        "ART_ru_ft_O_d_1": "同時預測“90分鐘”後的比賽結果，以及雙方球隊總進球數的奇偶。",
                        "ART_ru_ft_O_d_2": "根據所選球隊的輸、贏或和局，以及雙方球隊總進球數的奇偶，來進行結算。",
                        "ART_ru_ft_O_d_3": "如果在賽果公佈之前比賽中斷，所有該盤口的投注將被視為無效。",
                    
                        "ART_ru_ft_O_e": "進球 大/小 & 雙方球隊進球",
                        "ART_ru_ft_O_e_1": "同時預測賽事總入球數將大於或小於在盤口指定的大/小盤球數，以及雙方球隊是否都有進球。",
                        "ART_ru_ft_O_e_2": "根據90分鐘後的總進球數，以及兩隊是否都有進球，來進行結算。",
                        "ART_ru_ft_O_e_3": "如果在賽果公佈之前比賽中斷，將根據以下規則進行處理：",
                        "ART_ru_ft_O_e_3_1": "如果在比賽中斷那一刻，雙方球隊都已經進1球或以上，並且總進球數大於盤口指定的大/小盤球數，投注將被視為有效。",
                        "ART_ru_ft_O_e_3_2": "如果在比賽中斷那一刻，雙方球隊沒有都進1球或以上，投注將被視為無效。",
                    
                        "ART_ru_ft_O_f": "進球 大/小 & 進球 單/雙",
                        "ART_ru_ft_O_f_1": "同時預測賽事總入球數將大於或小於在盤口指定的大/小盤球數，以及總進球數的奇偶。",
                        "ART_ru_ft_O_f_2": "根據90分鐘後的總進球數，以及總進球數的奇偶，來進行結算。",
                        "ART_ru_ft_O_f_3": "如果在賽果公佈之前比賽中斷，所有該盤口的投注將被視為無效。",
                    
                        "ART_ru_ft_O_g": "進球 大/小 & 最先進球",
                        "ART_ru_ft_O_g_1": "同時預測賽事總入球數將大於或小於在盤口指定的大/小盤球數，以及哪只球隊將成為首先進球球隊。",
                        "ART_ru_ft_O_g_2": "根據90分鐘後的總進球數，以及是否正確的選擇了最先進球球隊，來進行結算。",
                        "ART_ru_ft_O_g_3": "如果在賽果公佈之前比賽中斷，將根據以下規則進行處理：",
                        "ART_ru_ft_O_g_3_1": "如果在比賽中斷那一刻的總進球數大於指定的大/小盤球數，投注將被視為有效。",
                        "ART_ru_ft_O_g_3_2": "如果在比賽中斷那一刻的總進球數小於指定的大/小盤球數，投注將被視為無效。",
                        "ART_ru_ft_O_g_4": "如果賽事沒有首個進球，所有投注將會以輸結算。",
                    
                        "ART_ru_ft_O_h": "雙重機會 & 進球 大/小",
                        "ART_ru_ft_O_h_1": "從可選的結果中預測正確的結果，以及總進球數對比指定數值的大小。",
                        "ART_ru_ft_O_h_2": "根據是否正確的選擇了可能的結果，以及“90分鐘”後的總進球數，來進行結算。",
                        "ART_ru_ft_O_h_3": "3種可能的結果是：",
                        "ART_ru_ft_O_h_3_1": "主隊勝出或和局（1 & X）",
                        "ART_ru_ft_O_h_3_2": "客隊勝出或和局（X & 2）",
                        "ART_ru_ft_O_h_3_3": "主隊勝出或客隊勝出（1 & 2）",
                        "ART_ru_ft_O_h_4": "如果在賽果公佈之前比賽中斷，所有該盤口的投注將被視為無效。",
                    
                        "ART_ru_ft_O_i": "雙重機會 & 雙方球隊進球",
                        "ART_ru_ft_O_i_1": "從可選的結果中預測正確的結果以及兩隊是否都會得分。",
                        "ART_ru_ft_O_i_2": "根據是否在可能的結果中做出了正確的選擇以及兩隊是否都有進球，來進行結算。",
                        "ART_ru_ft_O_i_3": "3種可能的結果是：",
                        "ART_ru_ft_O_i_3_1": "主隊勝出或和局（1 & X）",
                        "ART_ru_ft_O_i_3_2": "客隊勝出或和局（X & 2）",
                        "ART_ru_ft_O_i_3_3": "主隊勝出或客隊勝出（1 & 2）",
                        "ART_ru_ft_O_i_4": "如果在賽果公佈之前比賽中斷，所有該盤口的投注將被視為無效。",
                    
                    
                        "ART_ru_ft_P": "其他",
                        "ART_ru_ft_P_a": "特定聯賽里主客隊的總進球數",
                        "ART_ru_ft_P_a_p": "本公司在某些聯賽里會提供某種結合性賽事結果的投注。盤口的玩法將結合主場與客場球隊在整個聯賽里的賽果之後分出勝負。中立場的比賽，第一個球隊被視為這一場賽事的主隊。以下列出所提供的個別替補玩法規則。",
                    
                        "ART_ru_ft_P_b": "特定聯賽里主客隊的總進球數：一般規則",
                        "ART_ru_ft_P_b_1": "如果聯賽中有一場賽事中斷或取消，所有特定聯賽里主客隊的總進球數注單將被取消。",
                        "ART_ru_ft_P_b_2": "比賽日程以及賽事場次將會明確的在盤口顯示。例如：",
                        "ART_ru_ft_P_b_2_1": "主隊-週五-3場賽事",
                        "ART_ru_ft_P_b_2_2": "客隊-週五-3場賽事",
                    
                        "ART_ru_ft_P_c": "在特定聯賽中的主隊和客隊進球數：獨贏和雙重機會",
                        "ART_ru_ft_P_c_1": "根據得分的進球數預測所有主隊對陣所有客隊的結果。 例如，如果主隊目標是6顆進球，客隊目標是8顆進球，那麼獲勝的選擇將是:",
                        "ART_ru_ft_P_c_1_1": "‘客隊’ (獨贏)",
                        "ART_ru_ft_P_c_1_2": "‘客隊 / 平局’ 和 ‘主隊 / 客隊’ (雙重機會)",
                    
                        "ART_ru_ft_P_d": "特定聯賽里主客隊的進球數：讓球",
                        "ART_ru_ft_P_d_1": "預測在90分鐘完場時間內哪一支球隊在結合整個聯賽里的賽果後在盤口指定的讓球數勝出。",
                    
                        "ART_ru_ft_P_e": "特定聯賽里主客隊的進球數：進球: 大 / 小",
                        "ART_ru_ft_P_e_1": "預測主客隊的總進球數將大於或小於在盤口指定的大/小盤牌數。",
                    
                    
                        "ART_ru_ft_Q": "奇幻賽事",
                        "ART_ru_ft_Q_a": "奇幻賽事",
                        "ART_ru_ft_Q_a_p": "奇幻賽事是以2個不同賽事的2場比賽為組合進行結果預測的競猜遊戲。",
                        "ART_ru_ft_Q_a_1": "奇幻賽事的競猜結果以選定的2場賽事的實際比賽結果為準。",
                        "ART_ru_ft_Q_a_2": "如兩場賽事中的任意一場（或兩場）被取消、終止或延長後的36個小時內無最終結果，奇幻賽事對應競猜遊戲的結果將以無效處理。",
                        "ART_ru_ft_Q_a_3": "如兩場賽事中的任意一場（或兩場）進行加時賽或點球大戰時，此次競猜將以正式比賽中的90分鐘賽事結果為準。",
                        "ART_ru_ft_Q_a_4": "主/客場因素將不作為影響奇幻賽事的影響因素。",
                        "ART_ru_ft_Q_a_5": "奇幻賽事所有內容將遵守以上賽事規則。",
                    
                        "ART_ru_ft_R": "電競足球賽事",
                        "ART_ru_ft_R_a_1": "比賽將以虛擬或真實玩家對決(PVP)模式開打。",
                        "ART_ru_ft_R_a_2": "盤口的比賽名稱將註明比賽時間(例如：12分鐘), 且作為最終結算根據。",
                        "ART_ru_ft_R_a_3": "比賽時間若無註明時，結算將以官方或相關體育權威機構數據結果為準。",
                        "ART_ru_ft_R_a_4": "如果比賽因突發情況重製且分隔時間不超過12小時，投注將根據官方結果進行結算。",
                        "ART_ru_ft_R_a_5": "主/客場排序將不影響結算。例：賽事註明一隊對壘二隊，但官方顯示二隊對壘一隊，投注仍視為有效。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_ft": "SOCCER",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "11/11/2020",
                    
                        "ART_ru_ft_A": "General Rules",
                        "ART_ru_ft_A_a_1": "Unless otherwise stated, all Football bets will be settled based on the scheduled \"90 minutes\" play.",
                        "ART_ru_ft_A_a_2": "The term \"90 minutes\" play includes any stoppage or injury time. This does not include the extra-time, golden goals, penalty shoot-outs, or a match result which was altered by the official referee or the relevant governing authority after the match.",
                        "ART_ru_ft_A_a_3": "All In Play bets will be settled based on the outcome at the end of the scheduled \"90 minutes\" play, unless otherwise stated in the individual rule for the bet type.",
                        "ART_ru_ft_A_a_4": "For certain competitions or friendly matches where the scheduled play is 80 Minutes (2 x 40 minute halves), bets will be settled based on the scheduled time.",
                        "ART_ru_ft_A_a_5": "Should there be any youth or friendly matches where play is set for 70 minutes (2 x 35 minute halves) or less, the company will announce before the start of the match. Otherwise all bets on these matches will be considered void.",
                        "ART_ru_ft_A_a_6": "If the match is suspended or postponed at any time during play, and fail to resume within 36 hours, all bets will be considered void, unless explicitly stated below or in the individual Bet Type rules.",
                        "ART_ru_ft_A_a_7": "If the match is declared abandoned, all bets will be considered void, unless explicitly stated below or in the individual Bet Type rules. If a match is abandoned during the 1st half, all 1st half bets are considered void. If a match is abandoned during the 2nd half, all 2nd half bets are considered void, unless otherwise stated in the individual bet type rules. All 1st half bets will still be valid.",
                        "ART_ru_ft_A_a_8": "Own goals are counted for settlement purpose, unless otherwise stated in the individual bet type rules.",
                        "ART_ru_ft_A_a_9": "If the scheduled venue is changed, all bets will be considered void if the original away team is now the home team.",
                        "ART_ru_ft_A_a_10": "For International matches, as long as the change in venue is within same country, all bets are considered valid.",
                        "ART_ru_ft_A_a_11": "For International competitions, as long as the venue is within the country or countries where the competition was originally scheduled to be held, all bets are considered valid.",
                        "ART_ru_ft_A_a_12": "We reserve the right to void all bets if we think other change of venues scenarios could affect the outcome of the event. ",
                        "ART_ru_ft_A_a_13": "Should the exact start time of a match be unknown (e.g. due to TV scheduling), we reserve the right to adjust the original stated time, once it is within 72 hours of the official start time.",
                    
                    
                        "ART_ru_ft_B": "Main Markets",
                        "ART_ru_ft_B_a": "Handicap",
                        "ART_ru_ft_B_b": "General Rules",
                        "ART_ru_ft_B_b_1": "Predict who will win the match / half / period with the indicated handicap applied. ",
                        "ART_ru_ft_B_b_2": "A \"Handicap\" means that a team receives a virtual head start, effectively leading the match by differing goals before it actually begins. ",
                        "ART_ru_ft_B_b_3": "All bets will be settled by factoring in the indicated handicap applied at the end of the bet type period. ",
                        "ART_ru_ft_B_b_4": "The favorite team, giving the handicap start, will be allocated the minus handicap and will be highlighted. ",
                        "ART_ru_ft_B_b_5": "A handicap can be:",
                        "ART_ru_ft_B_b_5_1": "a full goal start (e.g. -1, -2, -3, etc.)",
                        "ART_ru_ft_B_b_5_2": "a half goal start (e.g. -0.5, -1.5, -2.5, etc.), or",
                        "ART_ru_ft_B_b_5_3": "a split goal start (e.g. -0/0.5, -0.5/1, -1/1.5, etc.).",
                    
                        "ART_ru_ft_B_c": "Handicap",
                        "ART_ru_ft_B_c_1": "Predict who will win the match with the indicated handicap applied.",
                        "ART_ru_ft_B_c_2": "Bets are settled on the basis of \"90 minutes\" play.",
                        "ART_ru_ft_B_c_3": "If the match is abandoned, suspended, cancelled or aborted before the end of \"90minutes\" then all bets will be considered void.",
                    
                        "ART_ru_ft_B_d": "Handicap – 1st Half",
                        "ART_ru_ft_B_d_1": "All 1st half bets apply to the first half of play only. Bets are settled on the score at the end of the scheduled \"45 minutes\"",
                        "ART_ru_ft_B_d_2": "If the match is abandoned, suspended, cancelled or aborted for whatsoever reason during the 1st Half, all the first half bets will be considered void.",
                        "ART_ru_ft_B_d_3": "If the match is abandoned, suspended, cancelled or aborted for whatsoever reason during the 2nd Half or additional periods, all the first half bets will be considered valid.",
                    
                        "ART_ru_ft_B_e": "In-Play Handicap",
                        "ART_ru_ft_B_e_1": "All bets will be settled by factoring in the indicated handicap applied at the end of the bet type period.",
                        "ART_ru_ft_B_e_2": "Settlement is based on the score line, from when the bet was placed to the end of the match / period - i.e. the final score minus the current score of the match. For 1st Half Handicap bets, this is the final score at the end of the 1st Half.",
                    
                        "ART_ru_ft_B_f": "Extra Time - Handicap",
                        "ART_ru_ft_B_f_1": "All bets will be settled by factoring in the indicated handicap at the end of \"30 minutes\" Extra Time, including injury time.",
                        "ART_ru_ft_B_f_2": "If the match is abandoned, suspended, cancelled or aborted before Extra Time finishes, then all bets will be considered void",
                    
                        "ART_ru_ft_B_g": "Extra Time – Handicap – 1st Half",
                        "ART_ru_ft_B_g_1": "All bets will be settled by factoring in the indicated handicap at the end of \"15 minutes\" Extra Time, including injury time.",
                        "ART_ru_ft_B_g_2": "If the match is abandoned, suspended, cancelled or aborted for whatsoever reason during the 1st half of Extra Time, all the first half bets will be considered void.",
                        "ART_ru_ft_B_g_3": "If the match is abandoned, suspended, cancelled or aborted for whatsoever reason during the 2nd Extra Half or additional periods, all the first half bets will be considered valid.",
                    
                        "ART_ru_ft_B_h": "15 Minute Markets (Handicap)",
                        "ART_ru_ft_B_h_1": "Predict which team will win a 15 minute period of play with the indicated handicap applied.",
                        "ART_ru_ft_B_h_2": "At the beginning of each 15 minute period, both teams start the period as if it was a 0-0 score line, irrelevant of the current score to that point.",
                        "ART_ru_ft_B_h_3": "All bets will be settled by factoring in the handicap at the end of the stated period.",
                        "ART_ru_ft_B_h_4": "If a match is abandoned, all current 15 minute period bets and future 15 minute period bets will be considered void. Any 15 minute period bets, where the stated period is completed, will be considered valid.",
                        "ART_ru_ft_B_td_h4_1_1": "15 Minute - Period 1",
                        "ART_ru_ft_B_td_h4_1_2": "Start of 1st Half - 14:59 Minutes",
                        "ART_ru_ft_B_td_h4_2_1": "15 Minute - Period 2",
                        "ART_ru_ft_B_td_h4_2_2": "15:00 - 29:59 Minutes",
                        "ART_ru_ft_B_td_h4_3_1": "15 Minute - Period 3",
                        "ART_ru_ft_B_td_h4_3_2": "30:00 Minutes - Half Time",
                        "ART_ru_ft_B_td_h4_4_1": "15 Minute - Period 4",
                        "ART_ru_ft_B_td_h4_4_2": "Start of 2nd Half - 59:59 Minutes",
                        "ART_ru_ft_B_td_h4_5_1": "15 Minute - Period 5",
                        "ART_ru_ft_B_td_h4_5_2": "60:00 - 74:59 Minutes",
                        "ART_ru_ft_B_td_h4_6_1": "15 Minute - Period 6",
                        "ART_ru_ft_B_td_h4_6_2": "75:00 Min - Full Time",
                    
                        "ART_ru_ft_B_i": "Goals - Over / Under",
                        "ART_ru_ft_B_j": "General Rules",
                        "ART_ru_ft_B_j_1": "Predict whether the total number of goals will be Over or Under the indicated goal line.",
                        "ART_ru_ft_B_j_2": "If the total number of goals scored is more than the indicated line, the market is settled as \'Over\'. If the total number of goals scored is less than the indicated line, the market is settled as \'Under\'.",
                        "ART_ru_ft_B_j_3": "All Over / Under bets will be settled by factoring in the indicated ‘line’ at the end of the bet type period.",
                        "ART_ru_ft_B_j_4": "An Over / Under market line can be:",
                        "ART_ru_ft_B_j_4_1": "a full goal (e.g. 2, 3, 4, etc.),",
                        "ART_ru_ft_B_j_4_2": "a half goal (e.g. 1.5, 2.5, 3.5, etc.), or ",
                        "ART_ru_ft_B_j_4_3": "a split goal line (e.g. 1.5/2, 2.5/3, 3.5/4, etc.). ",
                        "ART_ru_ft_B_j_5": "If a match is abandoned, Over / Under bets will only be settled if the market has been unconditionally determined and any further goals have no affect on the market result. In all other scenarios, bets will be considered void. Please see the examples below:",
                        "ART_ru_ft_B_j_5_1": "Example 1: Member bets Over 2.5 Goals:",
                        "ART_ru_ft_B_j_5_1_1": "The match is abandoned when the score is 2 – 1",
                        "ART_ru_ft_B_j_5_1_2": "The member wins as, even though the match is abandoned, this market has been unconditionally determined and any other potential goals have no affect on the market result.",
                        "ART_ru_ft_B_j_5_2": "Example 2: Member bets Under 2.5 Goals:",
                        "ART_ru_ft_B_j_5_2_1": "The match is abandoned when the score is 2 - 1",
                        "ART_ru_ft_B_j_5_2_2": "The member\'s bet is a losing bet as, even though the match is abandoned, this market has been unconditionally determined and any other potential goals have no affect on the market result.",
                        "ART_ru_ft_B_j_5_3": "Example 3: Member bets Over 3.5 Goals:",
                        "ART_ru_ft_B_j_5_3_1": "The match is abandoned when the score is 2 - 1",
                        "ART_ru_ft_B_j_5_3_2": "The member\'s bet is considered void as the match was abandoned before the result of the market is unconditionally determined.",
                    
                        "ART_ru_ft_B_k": "Goals: Over / Under",
                        "ART_ru_ft_B_k_1": "All bets apply to both halves of play. Bets are settled on the score at the end of the scheduled \"90 minutes\"",
                        "ART_ru_ft_B_k_2": "If the match is abandoned, suspended, cancelled or aborted for whatsoever reason, all bets will be considered void, unless the market has been unconditionally determined.",
                    
                        "ART_ru_ft_B_l": "Goals: Over / Under – 1st Half",
                        "ART_ru_ft_B_l_1": "All 1st half bets apply to the first half of play only. Bets are settled on the score at the end of the scheduled \"45 minutes\".",
                        "ART_ru_ft_B_l_2": "If the match is abandoned, suspended, cancelled or aborted for whatsoever reason during the 1st Half, all the first half bets will be considered void, unless the market has been unconditionally determined.",
                        "ART_ru_ft_B_l_3": "If the match is abandoned, suspended, cancelled or aborted for whatsoever reason during the 2nd Half or additional periods, all the first half bets will be considered valid.",
                    
                        "ART_ru_ft_B_m": "In-Play Over / Under Goals",
                        "ART_ru_ft_B_m_1": "Settlement is based on the  final score and the goal line at time of bet placement as applied to  a 0-0 score line.",
                    
                        "ART_ru_ft_B_n": "Extra Time - Goals: Over / Under",
                        "ART_ru_ft_B_n_1": "Both teams will start Extra Time 0-0, contrary to any previous goals scored during the regular period of play.",
                        "ART_ru_ft_B_n_2": "All bets will be settled by factoring in the number of goals scored at the end of \"30 minutes\" Extra Time, including injury time.",
                        "ART_ru_ft_B_n_3": "If the match is abandoned, suspended, cancelled or aborted before Extra Time finishes, then all bets will be considered void.",
                    
                        "ART_ru_ft_B_o": "Extra Time - Goals: Over / Under – 1st Half",
                        "ART_ru_ft_B_o_1": "All bets will be settled by factoring in the number of goals scored at the end of \"15 minutes\" Extra Time, including injury time.",
                        "ART_ru_ft_B_o_2": "If the match is abandoned, suspended, cancelled or aborted for whatsoever reason during the 1st half of Extra Time, all the first half bets will be considered void.",
                        "ART_ru_ft_B_o_3": "If the match is abandoned, suspended, cancelled or aborted for whatsoever reason during the 2nd Extra Half or additional periods, all the first half bets will be considered valid.",
                    
                        "ART_ru_ft_B_p": "Team Goals – Over / Under",
                        "ART_ru_ft_B_p_1": "Predict whether the total number of goals, scored by the named team, will be over or under the indicated goal line for the relevant period in the specific match.",
                        "ART_ru_ft_B_p_2": "If the total number of goals scored is more than the indicated line, the market is settled as \'Over\'. If the total number of goals scored is less than the indicated line, the market is settled as \'Under\'.",
                        "ART_ru_ft_B_p_3": "If a match is abandoned, Single Team Over / Under bets will only be settled if the market has been unconditionally determined and any further goals have no affect on the market result. In all other scenarios, bets will be considered void.",
                    
                        "ART_ru_ft_B_q": "15 Minute Markets (Over / Under)",
                        "ART_ru_ft_B_q_1": "Predict whether the total number of goals will be Over or Under the indicated goal line.",
                        "ART_ru_ft_B_q_2": "If the total number of goals scored is more than the indicated line, the market is settled as \'Over\'. If the total number of goals scored is less than the indicated line, the market is settled as \'Under\'.",
                        "ART_ru_ft_B_q_3": "At the beginning of each 15 minute period, both teams start the period as if it was a 0-0 score line, irrelevant of the current score to that point.",
                        "ART_ru_ft_B_q_4": "If a match is abandoned, all future 15 minute period bets will be considered void. Any 15 minute period bets, where the stated period is completed, will be considered valid. If a match is abandoned in the current stated 15 minute period, Over / Under bets will only be settled if the market has been unconditionally determined and any further goals have no affect on the market result. In all other scenarios, bets will be considered void.",
                        "ART_ru_ft_B_td_q4_1_1": "15 Minute - Period 1",
                        "ART_ru_ft_B_td_q4_1_2": "Start of 1st Half - 14:59 Minutes",
                        "ART_ru_ft_B_td_q4_2_1": "15 Minute - Period 2",
                        "ART_ru_ft_B_td_q4_2_2": "15:00 - 29:59 Minutes",
                        "ART_ru_ft_B_td_q4_3_1": "15 Minute - Period 3",
                        "ART_ru_ft_B_td_q4_3_2": "30:00 Minutes - Half Time",
                        "ART_ru_ft_B_td_q4_4_1": "15 Minute - Period 4",
                        "ART_ru_ft_B_td_q4_4_2": "Start of 2nd Half - 59:59 Minutes",
                        "ART_ru_ft_B_td_q4_5_1": "15 Minute - Period 5",
                        "ART_ru_ft_B_td_q4_5_2": "60:00 - 74:59 Minutes",
                        "ART_ru_ft_B_td_q4_6_1": "15 Minute - Period 6",
                        "ART_ru_ft_B_td_q4_6_2": "75:00 Minutes - Full Time",
                    
                        "ART_ru_ft_B_r": "Extra Time - 5 Minute Goals (Over / Under)",
                        "ART_ru_ft_B_r_1": "Predict whether the total number of goals will be Over or Under the indicated goal line.",
                        "ART_ru_ft_B_r_2": "If the total number of goals scored is more than the indicated line, the market is settled as \'Over\'. If the total number of goals scored is less than the indicated line, the market is settled as \'Under\'.",
                        "ART_ru_ft_B_r_3": "At the beginning of each 5 minute period, both teams start the period as if it was a 0-0 score line, irrelevant of the current score to that point.",
                        "ART_ru_ft_B_r_4": "If a match is abandoned, all future 5 minute period bets will be considered void. Any 5 minute period bets, where the stated period is completed, will be considered valid. If a match is abandoned in the current stated 5 minute period, Over / Under bets will only be settled if the market has been unconditionally determined and any further goals have no effect on the market result. In all other scenarios, bets will be considered void.",
                        "ART_ru_ft_B_td_r4_1_1": "5 Minute - Period 1",
                        "ART_ru_ft_B_td_r4_1_2": "Start of Extra Time - 04:59 Minutes",
                        "ART_ru_ft_B_td_r4_2_1": "5 Minute - Period 2",
                        "ART_ru_ft_B_td_r4_2_2": "05:00 - 09:59 Minutes",
                        "ART_ru_ft_B_td_r4_3_1": "5 Minute - Period 3",
                        "ART_ru_ft_B_td_r4_3_2": "10:00 Minutes - Half Time",
                        "ART_ru_ft_B_td_r4_4_1": "5 Minute - Period 4",
                        "ART_ru_ft_B_td_r4_4_2": "Start of 2nd Half - 19:59 Minutes",
                        "ART_ru_ft_B_td_r4_5_1": "5 Minute - Period 5",
                        "ART_ru_ft_B_td_r4_5_2": "20:00 - 24:59 Minutes",
                        "ART_ru_ft_B_td_r4_6_1": "5 Minute - Period 6",
                        "ART_ru_ft_B_td_r4_6_2": "25:00 Min - Full Time",
                    
                        "ART_ru_ft_B_s": "1 X 2 (Match Betting)",
                    
                        "ART_ru_ft_B_t": "General Rules",
                        "ART_ru_ft_B_t_1": "Predict who will win the match. This market will contain the two teams and the draw as betting selections.",
                        "ART_ru_ft_B_t_2": "For bets to be valid, the match must start with a 0 - 0 score line.",
                    
                        "ART_ru_ft_B_u": "1 X 2",
                        "ART_ru_ft_B_u_1": "Predict who will win or whether the result between both teams will be a draw at the end of \"90 minutes\" play.",
                    
                        "ART_ru_ft_B_v": "1 X 2 – 1st Half",
                        "ART_ru_ft_B_v_1": "All 1st half bets apply to the first half of play only. Bets are settled on the score at the end of the scheduled \"45 minutes\".",
                    
                        "ART_ru_ft_B_w": "In-Play 1 X 2",
                        "ART_ru_ft_B_w_1": "Predict who will win the match while it is in-play.",
                        "ART_ru_ft_B_w_2": "Settlement is based on the winning selection at the end of the bet type period.",
                        "ART_ru_ft_B_w_3": "Here is an example of In-Play 1 X 2.",
                        "ART_ru_ft_B_td_w3_1_1": " ",
                        "ART_ru_ft_B_td_w3_1_2": "Current Score",
                        "ART_ru_ft_B_td_w3_1_3": "1 X 2 In-Play Price",
                        "ART_ru_ft_B_td_w3_2_1": "Arsenal (H)",
                        "ART_ru_ft_B_td_w3_2_2": "1",
                        "ART_ru_ft_B_td_w3_2_3": "1.61",
                        "ART_ru_ft_B_td_w3_3_1": "Manchester United",
                        "ART_ru_ft_B_td_w3_3_2": "0",
                        "ART_ru_ft_B_td_w3_3_3": "6.0",
                        "ART_ru_ft_B_td_w3_4_1": "Draw",
                        "ART_ru_ft_B_td_w3_4_2": " ",
                        "ART_ru_ft_B_td_w3_4_3": "3.8",
                        "ART_ru_ft_B_w_3_1": "Example 1: Member bets Arsenal when the score is Arsenal 1 - 0 Manchester United:",
                        "ART_ru_ft_B_w_3_1_1": "The final score is Arsenal 2 - 1 Manchester United.",
                        "ART_ru_ft_B_w_3_1_2": "The member wins as they bet Arsenal to win. All bets placed on Arsenal are winning bets.",
                        "ART_ru_ft_B_w_3_1_3": "All bets placed on Manchester United or the Draw when the score was 1 - 0 lose.",
                        "ART_ru_ft_B_w_3_2": "Example 2: Member bets Manchester United when the score is Arsenal 1 - 0 Manchester United:",
                        "ART_ru_ft_B_w_3_2_1": "The final score is Arsenal 1 - 1 Manchester United",
                        "ART_ru_ft_B_w_3_2_2": "The member loses as they bet Manchester United to win and the result was a draw. All bets placed on Arsenal and Manchester United are considered losing bets.",
                        "ART_ru_ft_B_w_3_2_3": "All bets placed on the Draw win.",
                        "ART_ru_ft_B_w_4": "In the event of extra time, a new market will be opened.",
                    
                        "ART_ru_ft_B_x": "Extra Time -  1 X 2",
                        "ART_ru_ft_B_x_1": "Predict who will win or whether the result between both teams will be a draw at the end of \"30 minutes\" Extra Time play, including any injury time.",
                        "ART_ru_ft_B_x_2": "If the match is abandoned, suspended, cancelled or aborted before Extra Time finishes, then all bets will be considered void.",
                    
                        "ART_ru_ft_B_y": "Extra Time - 1 X 2 – 1st Half",
                        "ART_ru_ft_B_y_1": "Predict who will win or whether the result between both teams will be a draw at the end of \"15 minutes\"  Extra Time play, including any injury time.",
                        "ART_ru_ft_B_y_2": "If the match is abandoned, suspended, cancelled or aborted for whatsoever reason during the 1st half of Extra Time, all the first half bets will be considered void.",
                        "ART_ru_ft_B_y_3": "If the match is abandoned, suspended, cancelled or aborted for whatsoever reason during the 2nd Extra Half or additional periods, all the first half bets will be considered valid.",
                    
                        "ART_ru_ft_B_z": "15 Minute Markets (1 X 2)",
                        "ART_ru_ft_B_z_1": "Predict who will win the stated period. The match will contain two teams and the draw as betting selections.",
                        "ART_ru_ft_B_z_2": "For bets to be valid, both teams must begin the period with a 0-0 score line.",
                        "ART_ru_ft_B_z_3": "If match is abandoned, all current 15 minute period bets and future 15 minute period bets will be considered void. Any 15 minute period bets, where the stated period is completed, will be considered valid.",
                        "ART_ru_ft_B_td_z3_1_1": "15 Minute - Period 1",
                        "ART_ru_ft_B_td_z3_1_2": "Start of 1st Half - 14:59 Minutes",
                        "ART_ru_ft_B_td_z3_2_1": "15 Minute - Period 2",
                        "ART_ru_ft_B_td_z3_2_2": "15:00 - 29:59 Minutes",
                        "ART_ru_ft_B_td_z3_3_1": "15 Minute - Period 3",
                        "ART_ru_ft_B_td_z3_3_2": "30:00 Minutes - Half Time",
                        "ART_ru_ft_B_td_z3_4_1": "15 Minute - Period 4",
                        "ART_ru_ft_B_td_z3_4_2": "Start of 2nd Half - 59:59 Minutes",
                        "ART_ru_ft_B_td_z3_5_1": "15 Minute - Period 5",
                        "ART_ru_ft_B_td_z3_5_2": "60:00 - 74:59 Minutes",
                        "ART_ru_ft_B_td_z3_6_1": "15 Minute - Period 6",
                        "ART_ru_ft_B_td_z3_6_2": "75:00 Minutes - Full Time",
                    
                        "ART_ru_ft_B_aa": "Goals - Odd / Even",
                        "ART_ru_ft_B_aa_1": "Goals: Odd / Even",
                        "ART_ru_ft_B_aa_1_1": "Predict whether the number of goals scored in a specific match will be Odd or Even at the end of \"90 minutes\" play.",
                        "ART_ru_ft_B_aa_1_2": "If the score finishes as 0-0 - \'Even\' will be settled as the winning selection.",
                        "ART_ru_ft_B_aa_2": "Goals: Odd / Even – 1st Half",
                        "ART_ru_ft_B_aa_2_1": "Predict whether the number of goals scored in a specific match will be Odd or Even at the end of \"45 minutes\".",
                        "ART_ru_ft_B_aa_2_2": "If the score finishes as 0-0 - \'Even\' will be settled as the winning selection.",
                        "ART_ru_ft_B_aa_3": "Extra Time - Goals: Odd / Even",
                        "ART_ru_ft_B_aa_3_1": "Predict whether the number of goals scored in a specific match will be Odd or Even at the end of \"30 minutes\" Extra Time play, including injury time.",
                        "ART_ru_ft_B_aa_3_2": "If the score finishes as 0-0 - \'Even\' will be settled as the winning selection.",
                        "ART_ru_ft_B_aa_4": "Extra Time - Goals: Odd / Even – 1st Half",
                        "ART_ru_ft_B_aa_4_1": "Predict whether the number of goals scored in a specific match will be Odd or Even at the end of \"15 minutes\" Extra Time play, including injury time.",
                        "ART_ru_ft_B_aa_4_2": "If the score finishes as 0-0 - \'Even\' will be settled as the winning selection.",
                    
                        "ART_ru_ft_B_aa_5": "15 Minute Markets (Odd / Even)",
                        "ART_ru_ft_B_aa_5_1": "Predict whether the number of goals scored in the stated 15 minutes of play will be Odd or Even.",
                        "ART_ru_ft_B_aa_5_2": "For bets to be valid, both teams must begin the period with a 0-0 score line.",
                        "ART_ru_ft_B_aa_5_3": "If match is abandoned, all current 15 minute period bets and future 15 minute period bets will be considered void. Any 15 minute period bets, where the stated period is completed, will be considered valid.",
                        "ART_ru_ft_B_td_aa5_1_1": "15 Minute - Period 1",
                        "ART_ru_ft_B_td_aa5_1_2": "Start of 1st Half - 14:59 Minutes",
                        "ART_ru_ft_B_td_aa5_2_1": "15 Minute - Period 2",
                        "ART_ru_ft_B_td_aa5_2_2": "15:00 - 29:59 Minutes",
                        "ART_ru_ft_B_td_aa5_3_1": "15 Minute - Period 3",
                        "ART_ru_ft_B_td_aa5_3_2": "30:00 Minutes - Half Time",
                        "ART_ru_ft_B_td_aa5_4_1": "15 Minute - Period 4",
                        "ART_ru_ft_B_td_aa5_4_2": "Start of 2nd Half - 59:59 Minutes",
                        "ART_ru_ft_B_td_aa5_5_1": "15 Minute - Period 5",
                        "ART_ru_ft_B_td_aa5_5_2": "60:00 - 74:59 Minutes",
                    
                        "ART_ru_ft_B_ab": "Correct Score",
                        "ART_ru_ft_B_ab_1": "Predict the correct score for the relevant period in the specific match.",
                        "ART_ru_ft_B_ab_2": "\"Any Other Score\" refers to any score line not listed as a selection in the market.",
                    
                        "ART_ru_ft_B_ab_3": "Correct Score",
                        "ART_ru_ft_B_ab_3_1": "Predict the full time Correct Score for the specific match.",
                        "ART_ru_ft_B_ab_3_2": "Full time Correct Score bets are settled according to the score after the full \"90 minutes\", excluding extra time or penalty shootouts.",
                        "ART_ru_ft_B_ab_3_3": "If a match is abandoned, suspended or postponed, only bets placed on markets that have been unconditionally determined will be considered valid.",
                    
                        "ART_ru_ft_B_ab_4": "Correct Score – 1st Half",
                        "ART_ru_ft_B_ab_4_1": "Predict the half time Correct Score for the specific match.",
                        "ART_ru_ft_B_ab_4_2": "Half time Correct Score bets apply to the first half of play only. Bets are settled on the score at the end of the scheduled \"45 minutes\", including injury time.",
                        "ART_ru_ft_B_ab_4_3": "If a match is abandoned during the 1st half, only bets placed on markets that have been unconditionally determined will be considered valid.",
                        "ART_ru_ft_B_ab_4_4": "If the match is abandoned during the 2nd Half or additional periods, all the half time Correct Score bets will be considered valid.",
                    
                        "ART_ru_ft_B_ac": "Half Time / Full Time",
                        "ART_ru_ft_B_ac_1": "Predict the Half Time and Full Time result in the specific match.",
                    
                        "ART_ru_ft_B_ad": "Winning Margin",
                        "ART_ru_ft_B_ad_1": "Predict the number of goals that separate the winning team from the losing team at the end of a specific match.",
                        "ART_ru_ft_B_ad_2": "Bets are settled on the basis of \"90 minutes\" play.",
                        "ART_ru_ft_B_ad_3": "Any match ending as a draw/ tie will be settled according to \'score draw\' or \'no score draw\'.",
                    
                        "ART_ru_ft_B_ae": "Extra Time - Winning Margin",
                        "ART_ru_ft_B_ae_1": "Predict the number of goals that separate the winning team from the losing team at the end of Extra Time.",
                        "ART_ru_ft_B_ae_2": "Bets are settled on the basis of \"30 minutes\" Extra Time play (including injury time) and do not include any subsequent Penalty Shootout.",
                        "ART_ru_ft_B_ae_3": "Any match ending as a draw/ tie will be settled according to \'Score Draw\' or \'No Goal\'.",
                    
                        "ART_ru_ft_B_af": "Double Chance",
                        "ART_ru_ft_B_af_1": "Bet on 2 of the 3 possible outcomes; home win and draw (1 & X), away win and draw (X & 2) or home win and away win (1 & 2).",
                        "ART_ru_ft_B_af_2": "The three options available are: 1 X, X 2, 1 2:",
                        "ART_ru_ft_B_af_2_1": "\"1\" indicates: Home win.",
                        "ART_ru_ft_B_af_2_2": "\"X\" indicates: Draw.",
                        "ART_ru_ft_B_af_2_3": "\"2\" indicates: Away win.",
                        "ART_ru_ft_B_af_3": "If a match venue is played at neutral ground, the team listed first is deemed the \"Home Team\" for betting purposes.",
                    
                        "ART_ru_ft_B_ag": "3-Way Handicap",
                        "ART_ru_ft_B_ag_1": "Predict who will win the match based on the assigned handicap, while also including the draw as a potential 3rd outcome.",
                        "ART_ru_ft_B_ag_2": "Settlements will be based on the team selected to include a draw and them subsequently obtaining result from the match.",
                        "ART_ru_ft_B_ag_3": "Draw  display handicap will always be Home Handicap.",
                        "ART_ru_ft_B_ag_4": "An Example of the selections are:",
                        "ART_ru_ft_B_ag_4_1": "Home  (-1) = Home Team Asian Handicap -1.5.",
                        "ART_ru_ft_B_ag_4_2": "Draw  (-1) = Home Team Wins By Exactly 1.",
                        "ART_ru_ft_B_ag_4_3": "Away  (+1) = Away Team Asian Handicap +0.5.",
                        "ART_ru_ft_B_ag_4_4": "Home  (+2) = Home Team Asian Handicap +1.5.",
                        "ART_ru_ft_B_ag_4_5": "Draw  (+2) = Away Team Wins By Exactly 2.",
                        "ART_ru_ft_B_ag_4_6": "Away  (-2) = Away Team Asian Handicap -2.5.",
                    
                        "ART_ru_ft_B_ah": "To Win From Behind",
                        "ART_ru_ft_B_ah_1": "Predict whether your selection will be losing at any stage of the match but still win at the end of \"90 minutes\" play.",
                        "ART_ru_ft_B_ah_2": "The selected team must be losing at any stage during the match but subsequently go on to win the match in \"90 minutes\".",
                        "ART_ru_ft_B_ah_3": "If the match is abandoned, all bets will be considered void.",
                    
                        "ART_ru_ft_B_ai": "Draw No Bet",
                        "ART_ru_ft_B_ai_1": "Predict the team to win the match and if the final result after the full \"90 minutes\" of play is a draw, all bets will be refunded.",
                    
                    
                        "ART_ru_ft_C": "Goal Markets",
                        "ART_ru_ft_C_a": "Total Goals",
                        "ART_ru_ft_C_a_1": "Total Goals",
                        "ART_ru_ft_C_a_1_1": "Predict the total number of goals scored between the two teams.",
                        "ART_ru_ft_C_a_1_2": "Should a game / event be abandoned, suspended or postponed, only bets placed on markets that have been unconditionally determined will be considered valid.",
                        "ART_ru_ft_C_a_2": "Total Goals – 1st Half",
                        "ART_ru_ft_C_a_1_1": "Predict the half time total number of goals scored between the two teams.",
                        "ART_ru_ft_C_a_1_2": "Should a game / event be abandoned, suspended or postponed, only bets placed on markets that have been unconditionally determined will be considered valid.",
                    
                        "ART_ru_ft_C_b": "Single Team Total Goals",
                        "ART_ru_ft_C_b_1": "Predict the full time total number of goals scored by the named team.",
                        "ART_ru_ft_C_b_2": "Should a game  /event be abandoned, suspended or postponed, only bets placed on markets that have been unconditionally determined will be considered void.",
                    
                        "ART_ru_ft_C_c": "First Goal / Last Goal",
                        "ART_ru_ft_C_c_1": "Predict the team to score the First / Last goal in a designated match within the official \"90 minutes\" play.",
                        "ART_ru_ft_C_c_2": "Please note that own goals are counted in favor of the team accredited with the score for the settlement of bets. For example Team A vs. Team B, Team B scores an own goal to make the score 1-0, the first team to score is Team A.",
                        "ART_ru_ft_C_c_3": "If a match is abandoned after the first goal is scored, all bets on First Team to Score will be considered valid.",
                        "ART_ru_ft_C_c_4": "If a match is abandoned, all bets on Last Team to Score will be considered void.",
                    
                        "ART_ru_ft_C_d": "X Goal (Next Goal)",
                        "ART_ru_ft_C_d_1": "Predict the next team to score in a designated match within the official \"90 minutes\" play.",
                        "ART_ru_ft_C_d_2": "If the company decides to offer the market for extra time, a new market will be opened.",
                        "ART_ru_ft_C_d_3": "Please note that own goals are counted in favor of the team accredited with the score for the settlement of bets. For example, in the case of Team A versus Team B - if Team A scores an own goal, then that goal is credited to Team B.",
                        "ART_ru_ft_C_d_4": "If a match is abandoned, all bets will be considered void unless the market has already been unconditionally determined.",
                    
                        "ART_ru_ft_C_e": "Both Teams to Score",
                        "ART_ru_ft_C_e_1": "Predict yes or no if both teams will score in the match after the full \"90 minutes\" play.",
                        "ART_ru_ft_C_e_2": "If a match is abandoned after both teams have scored, all bets will be considered valid.",
                        "ART_ru_ft_C_e_3": "Otherwise, if the match is postponed or abandoned without both teams scoring, all bets will be considered void.",
                        "ART_ru_ft_C_e_4": "Only own goals for the beneficiary team are counted for betting purposes.",
                    
                        "ART_ru_ft_C_f": "Both Teams to Score - 1st Half",
                        "ART_ru_ft_C_f_1": "Predict yes or no if both teams will score within the first \"45 minutes\" play.",
                        "ART_ru_ft_C_f_2": "If a match is abandoned in the first half after both teams have scored, all bets will be considered valid.",
                        "ART_ru_ft_C_f_3": "Otherwise, if the match is suspended or abandoned in the first half without both teams scoring, all bets will be considered void.",
                        "ART_ru_ft_C_f_4": "Only own goals for the beneficiary team are counted for betting purposes.",
                    
                        "ART_ru_ft_C_g": "Both Teams to Score - 2nd Half",
                        "ART_ru_ft_C_g_1": "Predict yes or no if both teams will score within the second \"45 minutes\" play.",
                        "ART_ru_ft_C_g_2": "If a match is abandoned after both teams have scored within the second half, all bets will be considered valid.",
                        "ART_ru_ft_C_g_3": "Otherwise, if the match is suspended or abandoned in the second half without both teams scoring, all bets will be considered void.",
                        "ART_ru_ft_C_g_4": "Only own goals for the beneficiary team are counted for betting purposes.",
                    
                        "ART_ru_ft_C_h": "Clean Sheet",
                        "ART_ru_ft_C_h_1": "Predict that a specific team will not concede any goals during a stated match. Market is based on \"90 minutes\" play.",
                        "ART_ru_ft_C_h_2": "The selected team chosen does not need to win the game for bet to be successful, i.e. 0-0, will be settled as a winning bet.",
                    
                        "ART_ru_ft_C_i": "To Win to Nil",
                        "ART_ru_ft_C_i_1": "Predict whether your selection can win the match without conceding a goal after the full \"90 minutes\" play.",
                        "ART_ru_ft_C_i_2": "The term \'Clean Sheet\' refers to a team who did not concede any goals in the specific match.",
                    
                        "ART_ru_ft_C_j": "Race to 2 Goals / 3 Goals",
                        "ART_ru_ft_C_j_1": "Predict the first team in the match to score two goals / three goals within the full \"90 minutes\".",
                        "ART_ru_ft_C_j_2": "If the match is abandoned after a team has scored 2 goals / 3 goals, then all bets for the market will be considered valid.",
                        "ART_ru_ft_C_j_3": "Should the selected team not score the stated number of goals, the bet will be settled as a loss.",
                    
                        "ART_ru_ft_C_k": "Half with Most Goals",
                        "ART_ru_ft_C_k_1": "Predict which half of \"45 minutes\" will have the most goals after the full \"90 minutes\".",
                        "ART_ru_ft_C_k_2": "This is a two selection market - if the number of goals scored in both halves are the same, bets will be void.",
                        "ART_ru_ft_C_k_3": "A breakdown of the selections are:",
                        "ART_ru_ft_C_k_3_1": "1st Half",
                        "ART_ru_ft_C_k_3_2": "2nd Half",
                    
                        "ART_ru_ft_C_l": "Half with Most Goals (1 X 2)",
                        "ART_ru_ft_C_l_1": "Predict which half of \"45minutes\" will have the most goals after the full \"90 minutes\".",
                        "ART_ru_ft_C_l_2": "This is a three selection market - if the number of goals scored in both halves is the same, the \'Tie\' will be settled as the winning selection.",
                        "ART_ru_ft_C_l_3": "A breakdown of the selections are:",
                        "ART_ru_ft_C_l_3_1": "1st Half",
                        "ART_ru_ft_C_l_3_2": "2nd Half",
                        "ART_ru_ft_C_l_3_3": "Tie",
                    
                        "ART_ru_ft_C_m": "To Score in Both Halves",
                        "ART_ru_ft_C_m_1": "Predict if the home / away team will score at least one goal in each half of the match after the full \"90 minutes\" play. ",
                        "ART_ru_ft_C_m_2": "If the selected team score in only one half or does not score at all, then all bets will be settled as losing bets. ",
                        "ART_ru_ft_C_m_3": "If an own goal is scored, only the team accredited with the goal will have it counted towards the respective bet.",
                        "ART_ru_ft_C_m_4": "In the event of a match being abandoned after the named team has scored in both halves, all bets on that team will be settled as a winning selection. ",
                        "ART_ru_ft_C_m_5": "In the event of a match being abandoned in the 2nd half, after the named team failed to score in the 1st half, all bets on that team will be settled as a losing selection. ",
                        "ART_ru_ft_C_m_6": "In the event of a match being abandoned in the 2nd half, after the named team scores in the 1st half, all bets on that team will be considered void. ",
                    
                        "ART_ru_ft_C_n": "First Goal Method",
                        "ART_ru_ft_C_n_1": "Predict what the method of the first goal will be.",
                        "ART_ru_ft_C_n_2": "If a match is abandoned after the first goal is scored, all bets will be considered valid.",
                        "ART_ru_ft_C_n_3": "A breakdown of the selections are:",
                        "ART_ru_ft_C_n_3_1": "Free Kick: The goal must be scored directly from the free kick. Deflected shots count provided the free-kick taker is awarded the goal. ",
                        "ART_ru_ft_C_n_3_2": "Penalty: The goal must be scored directly from the penalty, with the penalty taker as the named goal scorer. A goal as a result of rebound does not count, 	even if scored by the original penalty taker. ",
                        "ART_ru_ft_C_n_3_3": "Own Goal: The goal must be awarded as an own goal. ",
                        "ART_ru_ft_C_n_3_4": "Header: The goal scorer must clearly use their head to score the goal. ",
                        "ART_ru_ft_C_n_3_5": "Shot: All other methods of goal. All other goal types which are not included in the above 	methods are included here. ",
                        "ART_ru_ft_C_n_3_6": "No Goal: No goal is scored.",
                    
                        "ART_ru_ft_C_o": "Time of 1st Goal – 3-Way",
                        "ART_ru_ft_C_o_1": "Predict the time in which the first goal will be scored in the specific match within the full \"90 minutes\". The choice of No Goal is also optional within the betting market.",
                        "ART_ru_ft_C_o_2": "An example of the selections are:",
                        "ART_ru_ft_C_td_o2_1_1": "Option 1",
                        "ART_ru_ft_C_td_o2_1_2": "26 and Under Minutes",
                        "ART_ru_ft_C_td_o2_2_1": "Option 2",
                        "ART_ru_ft_C_td_o2_2_2": "27 + Minutes",
                        "ART_ru_ft_C_td_o2_3_1": "Option 3",
                        "ART_ru_ft_C_td_o2_3_2": "No Goal",
                        "ART_ru_ft_C_o_3": "For settlement purposes, the 1st minute of the match is from 1 second to 59 seconds. The 2nd minute is from 1 minute to 1 minute 59 seconds and so on. ",
                        "ART_ru_ft_C_o_4": "For example, if a bet is placed on the time of the first goal being between the 1st and the 26th minute and the first goal is scored at 26 minutes 49 seconds, the bet is a losing bet as this falls within the \"27th minute onwards\" selection. ",
                        "ART_ru_ft_C_o_5": "If the match is abandoned after the first goal is scored, all bets on \"Time of the First Goal\" will be valid. ",
                        "ART_ru_ft_C_o_6": "If the match is abandoned before the first goal is scored, all bets on \"Time of the First Goal\" will be considered void. ",
                        "ART_ru_ft_C_o_7": "The first goal has to stand to be valid. This includes own goals. Goals that are disallowed by the referee(s) will not be considered.",
                    
                        "ART_ru_ft_C_p": "Time of 1st Goal",
                        "ART_ru_ft_C_p_1": "Predict the time in which the first goal will be scored in the specific match within the full \"90 minutes\", excluding extra time or penalty shootouts.",
                        "ART_ru_ft_C_p_2": "An example of the selections are:",
                        "ART_ru_ft_c_td_p2_1_1": "15 Minute - Period 1",
                        "ART_ru_ft_c_td_p2_1_2": "Start of 1st Half - 14:59 Minutes",
                        "ART_ru_ft_c_td_p2_2_1": "15 Minute - Period 2",
                        "ART_ru_ft_c_td_p2_2_2": "15:00 - 29:59 Minutes",
                        "ART_ru_ft_c_td_p2_3_1": "15 Minute - Period 3",
                        "ART_ru_ft_c_td_p2_3_2": "30:00 Minutes - Half Time",
                        "ART_ru_ft_c_td_p2_4_1": "15 Minute - Period 4",
                        "ART_ru_ft_c_td_p2_4_2": "Start of 2nd Half - 59:59 Minutes",
                        "ART_ru_ft_c_td_p2_5_1": "15 Minute - Period 5",
                        "ART_ru_ft_c_td_p2_5_2": "60:00 - 74:59 Minutes",
                        "ART_ru_ft_c_td_p2_6_1": "15 Minute - Period 6",
                        "ART_ru_ft_c_td_p2_6_2": "75:00 Minutes - Full Time",
                        "ART_ru_ft_C_p_3": "For settlement purposes, the 1st minute of the match is from 1 second to 59 seconds. The 2nd minute is from 1 minute to 1 minute 59 seconds and so on. ",
                        "ART_ru_ft_C_p_4": "If the match is abandoned after the first goal is scored, all bets on \"Time of the First Goal\" will be valid. ",
                        "ART_ru_ft_C_p_5": "If the match is abandoned before the first goal is scored, all bets on \"Time of the First Goal\" will be considered void. ",
                        "ART_ru_ft_C_p_6": "The first goal has to stand to be valid. This includes own goals. Goals that are disallowed by the referee(s) will not be considered.",
                    
                        "ART_ru_ft_C_q": "Own Goal",
                        "ART_ru_ft_C_q_1": "Predict whether an own goal will be recorded within a specific game.",
                        "ART_ru_ft_C_q_2": "Settlement will be based on any active player from either team being recorded as scoring an own goal.",
                        "ART_ru_ft_C_q_3": "If the match is abandoned before any own goal is recorded, then any bets on this market will be considered void.",
                    
                    
                        "ART_ru_ft_D": "Player Markets",
                        "ART_ru_ft_D_a": "General Rules (First / Last / Anytime Goal Scorer)",
                        "ART_ru_ft_D_a_1": "\'Others\' selection refers to any player not named scoring a goal (not including an own goal) within the official \"90 minutes\"",
                        "ART_ru_ft_D_a_2": "\'No Goal\' selection refers to zero goals being scored by both teams within the official \"90 minutes\" (i.e. Full Time result of 0-0).",
                    
                        "ART_ru_ft_D_b": "First Goal Scorer",
                        "ART_ru_ft_D_b_1": "From the list of players offered, nominate the player to score the first goal of the match within the official \"90 minutes\". ",
                        "ART_ru_ft_D_b_2": "Own goals do not count for \"First Goal Scorer\" purposes and will be ignored. In the event of an own goal, the next goal will be taken into consideration. ",
                        "ART_ru_ft_D_b_3": "If an own goal is the only goal scored, \"Others\" will be settled as the winning goal scorer selection. ",
                        "ART_ru_ft_D_b_4": "For \"First Goal Scorer\", bets on players not taking part in the match and players coming on after the first goal is scored will be void. ",
                        "ART_ru_ft_D_b_5": "If the player you have bet on to be the first goal scorer is sent off or substituted by another player before the \"First Goal Scorer\" is decided, the bet will be rendered as a losing bet. ",
                        "ART_ru_ft_D_b_6": "If the match is abandoned after the first goal is scored, then all bets for \"First Goal Scorer\" will be considered valid. However, \"Last Goal Scorer\" will be considered void.",
                        "ART_ru_ft_D_b_7": "If the match is abandoned before the first goal is scored, all bets on \"First Goal Scorer\" will be considered void. ",
                    
                        "ART_ru_ft_D_c": "Last Goal Scorer",
                        "ART_ru_ft_D_c_1": "From the list of players offered, nominate the player to score the last goal of the match within the official \"90 minutes\" play.",
                        "ART_ru_ft_D_c_2": "Own goals do not count for \"Last Goal Scorer\" purposes and will be ignored. In the event of an own goal, the next or previous goal will be taken into consideration. ",
                        "ART_ru_ft_D_c_3": "If an own goal is the only goal scored, \"Others\" will be settled as the winning goal scorer selection. ",
                        "ART_ru_ft_D_c_4": "If the player you have bet on to be the last goal scorer is sent off or substituted for another player before the \"Last Goal Scorer\" is decided, the bet will be rendered as a losing bet. ",
                        "ART_ru_ft_D_c_5": "For \"Last Goal Scorer\", all players taking part in a match will be considered valid. ",
                        "ART_ru_ft_D_c_6": "If the match is abandoned then all bets on \"Last Goal Scorer\" will be considered void.",
                    
                        "ART_ru_ft_D_d": "Anytime Goal Scorer",
                        "ART_ru_ft_D_d_1": "From the list of players offered, nominate the player to score at anytime in the specific match within the official \"90 minutes\" play. ",
                        "ART_ru_ft_D_d_2": "Bets will be void if the selected player does not play in the match. ",
                        "ART_ru_ft_D_d_3": "Bets stand if the selected player is fielded at any time during the regular time of play. ",
                        "ART_ru_ft_D_d_4": "If the match is abandoned after a player has scored, then all bets for that player within the \"Anytime Goal Scorer\" market will be considered valid. ",
                        "ART_ru_ft_D_d_5": "If the match is abandoned, any bets on a nominated player yet to score will be considered void. However, if that nominated player had been red-carded before the abandonment of the match, then any relevant bets on that player will be considered losing bets. ",
                        "ART_ru_ft_D_d_6": "Own goal and goals scored during extra time or penalty shootouts do not count.",
                    
                        "ART_ru_ft_D_e": "Player  Specials (Goals)",
                        "ART_ru_ft_D_f": "General Rules",
                        "ART_ru_ft_D_f_1": "First Half bets will apply to \"45 minutes\".",
                        "ART_ru_ft_D_f_2": "ull Time bets will be settled over \"90 minutes\".",
                        "ART_ru_ft_D_f_3": "Both participants must be in the starting 11 of the match for bets to stand.",
                        "ART_ru_ft_D_f_4": "The markets only apply to the match the participants are competing in, on the indicated date.",
                        "ART_ru_ft_D_f_5": "Own goals do not count for \'Goal Scorer Head to Head\' purposes and will be ignored.",
                    
                        "ART_ru_ft_D_g": "Handicap",
                        "ART_ru_ft_D_g_1": "Predict which player will score the most goals after the assigned handicap has been applied.",
                        "ART_ru_ft_D_g_2": "If the game is abandoned or postponed, then all bets will be considered void unless the market has been unconditionally determined that no more goals 	will affect the market result.",
                    
                        "ART_ru_ft_D_h": "Over  / Under",
                        "ART_ru_ft_D_h_1": "Predict whether the number of goals scored by both players will be \'Over\' or  \'Under\' the goal line figure that has been applied.",
                        "ART_ru_ft_D_h_2": "If the game is abandoned or postponed, then all bets will be considered void unless the market has been unconditionally determined that no more goals will affect the market result.",
                    
                        "ART_ru_ft_D_i": "1 X 2",
                        "ART_ru_ft_D_i_1": "Predict which player will score the most goals. The draw / tie is also a betting option.",
                        "ART_ru_ft_D_i_2": "If the game is abandoned or postponed, then all bets will be considered void unless the market has been unconditionally determined that no more goals will affect the market result.",
                    
                        "ART_ru_ft_D_j": "Odd  / Even",
                        "ART_ru_ft_D_j_1": "Predict whether both players will score a combined total of \'Odd or \'Even\' goals.",
                        "ART_ru_ft_D_j_2": "If the game is abandoned or postponed, then all bets will be considered void unless the market has been unconditionally determined that no more goals will affect the market result.",
                        "ART_ru_ft_D_j_3": "If either player fails to score a goal, i.e. 0, then the market will be settled as \'Even\'.",
                    
                    
                        "ART_ru_ft_E": "Specials",
                        "ART_ru_ft_E_a": "Team to Kick Off",
                        "ART_ru_ft_E_a_1": "Predict which team will start the match by kicking off.",
                        "ART_ru_ft_E_a_2": "If the match is abandoned after kick off, all bets for \"Which Team to Kick Off\" will be considered valid.",
                    
                        "ART_ru_ft_E_b": "Winning Method",
                        "ART_ru_ft_E_b_1": "Predict the period in which either team will win the stated match and hence the tournament or competition.",
                        "ART_ru_ft_E_b_2": "Bets are settled according to the team selected winning the match within the period selected. The periods choices are \"90 Minutes\", Extra Time or Penalties.",
                    
                        "ART_ru_ft_E_c": "Qualifying Method",
                        "ART_ru_ft_E_c_1": "Predict the period in which either team will win the stated match and hence qualify to the next stage of the tournament or competition.",
                        "ART_ru_ft_E_c_2": "Bets are settled according the team selected winning the match within the period selected. The periods choices are \"90 Minutes\", Extra Time or Penalties.",
                        "ART_ru_ft_E_c_3": "The aggregate score from both legs of a match (including away goals rule) will count towards any settlement within \"90 Minutes\".",
                    
                        "ART_ru_ft_E_d": "To Win Both Halves",
                        "ART_ru_ft_E_d_1": "Predict whether your selection can score more goals than their opponent in each half, within the full \"90 minutes\" of play.",
                        "ART_ru_ft_E_d_2": "If a match is abandoned, all bets will be considered void.",
                        "ART_ru_ft_E_d_3": "If the result is a draw or no goal is scored in either one or both halves, all bets will be settled as losing selections.",
                    
                        "ART_ru_ft_E_e": "To Win Either Half",
                        "ART_ru_ft_E_e_1": "Predict whether your selection can score more goals than their opponent in one of the two halves, within the full \"90 minutes\" of play.",
                        "ART_ru_ft_E_e_2": "If a match is abandoned in the 2nd half, bets will be considered valid if one team wins the 1st half. If both teams draw in the 1st half, bets will be considered void.",
                        "ART_ru_ft_E_e_3": "If the result is a draw or no goal is scored in both halves, all bets will be settled as losing selections. However if both teams each win a half, then bets on both teams will be settled as winning selections.",
                    
                        "ART_ru_ft_E_f": "Total Shots on Target",
                        "ART_ru_ft_E_f_1": "Predict the total number of shots on target by both teams within the full \"90 minutes\".",
                        "ART_ru_ft_E_f_2": "All bets are settled based on the official results made available from the Football authority responsible for organising the match.",
                    
                        "ART_ru_ft_E_g": "First Half - First Action",
                        "ART_ru_ft_E_g_1": "Predict the first recorded action from a series of options within the first \"45 minutes\".",
                        "ART_ru_ft_E_g_2": "Choices may include Free Kick, Goal Kick, Throw In, Offside, Goal, Yellow Card amongst others.",
                        "ART_ru_ft_E_g_3": "If a match is abandoned in the 1st Half, all bets will be considered void unless \'First Action\' has been recorded. If a match is abandoned in the 2nd Half, all First Half bets will be valid.",
                        "ART_ru_ft_E_g_4": "All bets are settled based on the official statistics made available from the Football authority responsible for organizing the match.",
                    
                        "ART_ru_ft_E_h": "Second Half - First Action",
                        "ART_ru_ft_E_h_1": "Predict the first recorded action from a series of options within the second \"45 minutes\".",
                        "ART_ru_ft_E_h_2": "Choices may include Free Kick, Goal Kick, Throw In, Offside, Goal, Yellow Card amongst others.",
                        "ART_ru_ft_E_h_3": "If a match is abandoned in the 2nd Half, all bets will be considered void unless \'First Action\' in that half has been recorded.",
                        "ART_ru_ft_E_h_4": "All bets are settled based on the official statistics made available from the Football authority responsible for organizing the match.",
                    
                        "ART_ru_ft_E_i": "Injury Time Awarded at the  End of the Half",
                        "ART_ru_ft_E_i_1": "Predict how much injury / stoppage time will be added to the end of the specific half.",
                        "ART_ru_ft_E_i_2": "All bets are settled based on the injury time indicated by the match 4th Official at the end of the specific half.",
                        "ART_ru_ft_E_i_3": "Injury / stoppage time added to the end of each half in Extra Time does not count. This applies to the end of each half within the normal \"90 minutes\" of play.",
                    
                        "ART_ru_ft_E_j": "Injury Time Awarded at the  End of the 1st Half - Over / Under",
                        "ART_ru_ft_E_j_1": "Predict how much injury / stoppage time will be added to the end of the 1st half after the full official \"45 minutes\" of play. ",
                        "ART_ru_ft_E_j_2": "If the total is more than the Over / Under line then the winning result is \'Over\'. If the total is less than the Over / Under line then the winning result is \'Under\'. ",
                        "ART_ru_ft_E_j_3": "Bets are settled on the injury time awarded by the match fourth official after the full official \"45 minutes\" of play. ",
                        "ART_ru_ft_E_j_4": "If a match is abandoned anytime within the official \"45 minutes\" of play, all bets on \"Injury Time Awarded at the End of the 1st Half\" will be considered void. ",
                        "ART_ru_ft_E_j_5": "If a match is abandoned after the 1st Half has been completed, all bets on \"Injury Time Awarded at the End of the 1st Half\" will be considered valid. ",
                    
                        "ART_ru_ft_E_k": "Injury Time Awarded at  the End of the 2nd Half - Over / Under",
                        "ART_ru_ft_E_k_1": "Predict how much injury / stoppage time will be added to the end of the 2nd half after the full official \"90 minutes\" of play.",
                        "ART_ru_ft_E_k_2": "If the total is more than the Over / Under line then the winning result is \'Over\'. If the total is less than the Over / Under line then the winning result is \'Under\'.",
                        "ART_ru_ft_E_k_3": "Bets are settled on the injury time awarded by the match fourth official after the full official \"90 minutes\" of play.",
                        "ART_ru_ft_E_k_4": "If a match is abandoned anytime within the official \"90 minutes\" of play, all bets on \"Injury Time Awarded at the End of the 2nd Half\" will be considered void.",
                    
                        "ART_ru_ft_E_l": "Total Injury Time Awarded  for Both Halves - Over / Under",
                        "ART_ru_ft_E_l_1": "Predict how much injury / stoppage time will be added to the end of the 1st and 2nd halves. ",
                        "ART_ru_ft_E_l_2": "The total injury time awarded will be the combined injury time awarded at the end of the first and second halves by the match 4th official, once the full official \"90 minutes\" of play has been completed. ",
                        "ART_ru_ft_E_l_3": "If the total is more than the Over / Under line then the winning result is \'Over\'. If the total is less than the Over / Under line then the winning result is \'Under\'. ",
                        "ART_ru_ft_E_l_4": "If a match is abandoned anytime within the official \"90 minutes\" of play, all bets on \"Total Injury Time Awarded for Both Halves\" will be considered void. ",
                    
                    
                        "ART_ru_ft_F": "Corners",
                        "ART_ru_ft_F_a": "Corners: General Rules",
                        "ART_ru_ft_F_a_1": "For settlement purposes, corners awarded but not taken will not count.",
                        "ART_ru_ft_F_a_2": "All bets are settled based on the official results made available from the Football authority responsible for organising the match.",
                        "ART_ru_ft_F_a_3": "Retaken corners will only count once.",
                    
                        "ART_ru_ft_F_b": "Corners: Handicap",
                        "ART_ru_ft_F_b_1": "Predict which team will have taken the most corners with the indicated handicap applied through the full \"90 minutes\" of play.",
                        "ART_ru_ft_F_b_2": "Corners Handicap is similar to Match Handicap - all bets will be settled by factoring in the indicated handicap applied at the end of the bet type period.",
                    
                        "ART_ru_ft_F_c": "Corners: Handicap – 1st Half",
                        "ART_ru_ft_F_c_1": "Predict which team will have taken the most corners with the indicated handicap applied through \"45 minutes\".",
                        "ART_ru_ft_F_c_2": "Corners Handicap is similar to Match Handicap - all bets will be settled by factoring in the indicated handicap applied at the end of the bet type period.",
                    
                        "ART_ru_ft_F_d": "Corners: Over / Under",
                        "ART_ru_ft_F_d_1": "Predict whether the total number of corners taken will be Over or Under the indicated corner line after \"90 minutes\" play, including injury time.",
                        "ART_ru_ft_F_d_2": "Corners Over / Under is similar to Match Over / Under - if the total number of corners taken is more than the indicated line, the market is settled as \'Over\'. If the total number of corners taken is less than the indicated line, the market is settled as \'Under\'.",
                        "ART_ru_ft_F_d_3": "If a match is abandoned, Corners Over / Under bets will only be settled if the market has been unconditionally determined and any further Corners have no affect on the market result. In all other scenarios, bets will be considered void.",
                    
                        "ART_ru_ft_F_e": "Corners: Over / Under – 1st Half",
                        "ART_ru_ft_F_e_1": "Predict whether the total number of Corners taken will be \'Over\' or \'Under\' the indicated corner line for \"45 minutes\".",
                        "ART_ru_ft_F_e_2": "If the total number of Corners taken is more than the indicated line, the market is settled as \'Over\'. If the total number of corners taken is less than the indicated line, the market is settled as \'Under\'. ",
                        "ART_ru_ft_F_e_3": "If a match is abandoned in the first half, Corners Over / Under bets will only be settled if the market has been unconditionally determined and any further Corners have no affect on the market result. ",
                        "ART_ru_ft_F_e_4": "If a match is abandoned in the second half, all bets relating to first half Corners Over / Under will be considered valid. ",
                    
                        "ART_ru_ft_F_f": "Corners: 1 X 2",
                        "ART_ru_ft_F_f_1": "Predict the team that will record more Corners or the same number of Corners as their opponent, over the course of \"90 minutes\".",
                        "ART_ru_ft_F_f_2": "If a match is abandoned, Corners 1 X 2  bets will only be settled if the market has been unconditionally determined and any further Corners have no affect on the market result. In all other scenarios, bets will be considered void.",
                    
                        "ART_ru_ft_F_g": "Corners: 1 X 2 – 1st Half",
                        "ART_ru_ft_F_g_1": "Predict the team that will record more Corners or the same number of Corners as their opponent, over the course of \"45 minutes\"",
                        "ART_ru_ft_F_g_2": "If a match is abandoned in the first half, Corners 1 X 2 bets will only be settled if the market has been unconditionally determined and any further Corners have no affect on the market result.",
                        "ART_ru_ft_F_g_3": "If a match is abandoned in the second half, all bets relating to first half Corners 1 X 2 will be considered valid.",
                    
                        "ART_ru_ft_F_h": "Corners:  Odd / Even",
                        "ART_ru_ft_F_h_1": "Predict whether the total number of Corners taken will be Odd or Even over the course of \"90 minutes\" play.",
                        "ART_ru_ft_F_h_2": "If no Corners are taken, i.e. 0, then the market will be settled as \'Even\'",
                        "ART_ru_ft_F_h_3": "If a match is abandoned, all bets will be void, unless the market has been unconditionally determined and any further Corners have no affect on the market result.",
                    
                        "ART_ru_ft_F_i": "Corners: Odd / Even – 1st Half",
                        "ART_ru_ft_F_i_1": "Predict whether the total number of Corners taken will be Odd or Even over the course of \"45 minutes\" play.",
                        "ART_ru_ft_F_i_2": "If a match is abandoned in the first half, Corners Odd / Even bets will only be settled if the market has been unconditionally determined and any further Corners have no affect on the market result.",
                        "ART_ru_ft_F_i_3": "If a match is abandoned in the second half, all bets relating to first half Corners Odd / Even will be considered valid.",
                    
                        "ART_ru_ft_F_j": "First Corner / Last Corner",
                        "ART_ru_ft_F_j_1": "Predict the team to take the First or Last corner in a designated match within the official \"90 minutes\" play.",
                        "ART_ru_ft_F_j_2": "If a match is abandoned after the \"First Corner\" is taken, all bets on \"First Corner\" will be considered valid.",
                        "ART_ru_ft_F_j_3": "If a match is abandoned, all bets on \"Last Corner\" will be considered void.",
                        "ART_ru_ft_F_j_4": "If no corner is taken by either team within the bet type period, all bets on \"First Corner / Last Corner\" will be considered void.",
                    
                        "ART_ru_ft_F_k": "Half with Most Corners",
                        "ART_ru_ft_F_k_1": "Predict which half will have the most corners taken after the full \"90 minutes\".",
                        "ART_ru_ft_F_k_2": "If a match is abandoned, any Half with Most Corners bets will only be settled if the result is unconditionally determined and any further corners have no affect on the market result. In all other scenarios, bets will be considered void.",
                    
                        "ART_ru_ft_F_l": "Corners - X Corner",
                        "ART_ru_ft_F_l_1": "Predict which team will be recorded as taking a specific corner yet to happen.",
                        "ART_ru_ft_F_l_2": "The selections offered may be one corner or multiple corners ahead, e.g. 4th Corner or 4th and 5th Corner (each being separate markets)",
                        "ART_ru_ft_F_l_3": "Retaken corners will only count once.",
                        "ART_ru_ft_F_l_4": "If the match is abandoned before \'X Corner\' is taken, then any bet on that corner will be considered void. All corners recorded prior to abandonment will be considered valid.",
                    
                        "ART_ru_ft_F_m": "Time of the First Corner",
                        "ART_ru_ft_F_m_1": "Predict the time in which the first corner will be taken in the specific match.",
                        "ART_ru_ft_F_m_2": "An example of the selections are:",
                        "ART_ru_ft_F_m_2_1": "Up to and including the 8th Minute",
                        "ART_ru_ft_F_m_2_2": "9th minute onwards",
                        "ART_ru_ft_F_m_3": "For settlement purposes, the 1st minute of the match is from 1 second to 59 seconds. The 2nd minute is from 1 minute to 1 minute 59 seconds and so on. ",
                        "ART_ru_ft_F_m_4": "For example, if a bet is placed on the time of the first corner being between the 1st and the 8th minute and the first corner is taken (as opposed to awarded) at 8 minutes 49 seconds, the bet is a losing bet as this falls within the \"9th minute onwards\" selection. ",
                        "ART_ru_ft_F_m_5": "If the match is abandoned after the first corner is taken, all bets on \"Time of the First Corner\" will be valid. ",
                        "ART_ru_ft_F_m_6": "If the match is abandoned before the first corner is taken, all bets on \"Time of the First Corner\" will be considered void. ",
                        "ART_ru_ft_F_m_7": "If no corner is taken in the full \"90 minutes\" of play, all bets will be considered void. ",
                        "ART_ru_ft_F_m_8": "In the event that the 1st corner kick has to be retaken, the time that the corner is retaken at shall be deemed as the time of the first corner. ",
                    
                        "ART_ru_ft_F_n": "15  Minute Corners",
                        "ART_ru_ft_F_n_1": "In accordance with 15 Minute Rules as laid out in Main Markets above, predict which team will obtain the required winning statistic in either Handicap, 1 X 2, Over / Under or Odd / Even.",
                    
                        "ART_ru_ft_F_o": "Corners - Double Chance",
                        "ART_ru_ft_F_o_1": "Bet on 2 of the 3 possible outcomes; home win and draw (1 & X), away win and draw (X & 2) or home win and away win (1 & 2).",
                        "ART_ru_ft_F_o_2": "The three options available are: 1 X, X 2, 1 2:",
                        "ART_ru_ft_F_o_2_1": "\"1\" indicates: Home win.",
                        "ART_ru_ft_F_o_2_2": "\"X\" indicates: Draw.",
                        "ART_ru_ft_F_o_2_3": "\"2\" indicates: Away win.",
                    
                    
                        "ART_ru_ft_G": "Bookings / Cards",
                        "ART_ru_ft_G_a": "Bookings: General Rules",
                        "ART_ru_ft_G_a_1": "For settlement purposes, cards issued to non-players (e.g. managers or substitutes who play no subsequent part in the match) do not count.",
                        "ART_ru_ft_G_a_2": "A yellow card constitutes 1 point and a red card constitutes 2 points. If a player is issued with 2 yellow cards, the total bookings points received by the same player will be counted as 1 point for the yellow card and 2 points for the red card - giving a total of 3 points (a maximum of 3 points can be accumulated by an individual player per match).",
                        "ART_ru_ft_G_a_3": "All bets are settled based on the official results made available from the Football authority responsible for organising the match.",
                    
                        "ART_ru_ft_G_b": "Bookings: Handicap",
                        "ART_ru_ft_G_b_1": "Predict which team will receive the most bookings with the indicated handicap applied through the full \"90 minutes\".",
                        "ART_ru_ft_G_b_2": "Bookings Handicap is similar to Match Handicap - all bets will be settled by factoring in the indicated handicap applied at the end of the bet type period.",
                    
                        "ART_ru_ft_G_c": "Bookings: Handicap – 1st Half",
                        "ART_ru_ft_G_c_1": "Predict which team will receive the most bookings with the indicated handicap applied through \"45 minutes\".",
                        "ART_ru_ft_G_c_2": "Bookings Handicap is similar to Match Handicap - all bets will be settled by factoring in the indicated handicap applied at the end of the bet type period.",
                    
                        "ART_ru_ft_G_d": "Bookings: Over / Under",
                        "ART_ru_ft_G_d_1": "Predict whether the total number of Bookings will be \'Over\' or \'Under\' the indicated line at the end of \"90 minutes\" play.",
                        "ART_ru_ft_G_d_2": "Bookings Over / Under is similar to Match Over / Under - if the total number of bookings is more than the indicated line, the market is settled as \'Over\'. If the total number of bookings is less than the indicated line, the market is settled as \'Under\'.",
                        "ART_ru_ft_G_d_3": "If a match is abandoned, Bookings Over / Under bets will only be settled if the market has been unconditionally determined and any further Bookings have no affect on the market result. In all other scenarios, bets will be considered void.",
                    
                        "ART_ru_ft_G_e": "Bookings: Over / Under – 1st Half",
                        "ART_ru_ft_G_e_1": "Predict whether the total number of Bookings will be \'Over\' or \'Under\' the indicated line at the end of \"45 minutes\"",
                        "ART_ru_ft_G_e_2": "If the total number of Bookings is more than the indicated line, the market is settled as \'Over\'. If the total number of bookings is less than the indicated line, the market is settled as \'Under\'. ",
                        "ART_ru_ft_G_e_3": "If a match is abandoned in the first half, all bets will be considered void unless the market has been unconditionally determined as that no further Bookings will have an effect on the market result.",
                        "ART_ru_ft_G_e_4": "If a match is abandoned in the second half, all first half bets in respect of Bookings Over / Under will be considered valid. ",
                    
                        "ART_ru_ft_G_f": "Bookings:  1 X 2",
                        "ART_ru_ft_G_f_1": "Predict which team will record the most number of Bookings at the end of \"90 minutes\" or whether both will finish on with the same number.",
                        "ART_ru_ft_G_f_2": "If a match is abandoned at any stage, all bets will be considered void unless the market has been unconditionally determined as that no further bookings will have an effect on the market result.",
                    
                        "ART_ru_ft_G_g": "Bookings: 1 X 2 – 1st Half",
                        "ART_ru_ft_G_g_1": "Predict which team will record the most number of Bookings at the end of \"45 minutes\" or whether both will finish with the same number.",
                        "ART_ru_ft_G_g_2": "If a match is abandoned in the first half, all bets will be considered void unless the market has been unconditionally determined as that no further Bookings will have an effect on the market result.",
                        "ART_ru_ft_G_g_3": "If a match is abandoned in the second half, all first half bets in respect of Bookings 1 X 2 will be considered valid.",
                    
                        "ART_ru_ft_G_h": "Bookings:  Odd / Even",
                        "ART_ru_ft_G_h_1": "Predict whether the total number of bookings will be Odd / Even at the end of \"90 minutes\".",
                        "ART_ru_ft_G_h_2": "If a match is abandoned all bets will be considered void unless the market has been unconditionally determined as that no further bookings will have an effect on the market result.",
                        "ART_ru_ft_G_h_3": "If no Bookings are recorded, i.e. 0, then the market will be settled as \'Even\'.",
                    
                        "ART_ru_ft_G_i": "Bookings: Odd / Even – 1st Half",
                        "ART_ru_ft_G_i_1": "Predict whether the total number of Bookings will be Odd / Even at the end of \"45 minutes\".",
                        "ART_ru_ft_G_i_2": "If a match is abandoned in the first half, all bets will be considered void unless the market has been unconditionally determined as that no further bookings will have an effect on the market result.",
                        "ART_ru_ft_G_i_3": "If a match is abandoned in the second half, all first half bets in respect of Bookings Odd / Even will be considered valid.",
                        "ART_ru_ft_G_i_4": "If no Bookings are recorded, i.e. 0, then the market will be settled as \'Even\'.",
                    
                        "ART_ru_ft_G_j": "First Booking / Last  Booking",
                        "ART_ru_ft_G_j_1": "Predict whether the Home or Away team will have a player to be the first / last to receive any card (yellow or red) in a designated match within the full \"90 minutes\" of play.",
                        "ART_ru_ft_G_j_2": "In the event of two or more players receiving a booking for the same incident, then the player who is shown the first yellow / red card by the referee will be deemed the \"winner\" for settlement purposes.",
                        "ART_ru_ft_G_j_3": "Any cards issued to non-players (e.g. managers, coaches or substitutes) do not count.",
                        "ART_ru_ft_G_j_4": "If a match is abandoned after the first booking is issued, all bets on the \"First Booking\" will stand.",
                        "ART_ru_ft_G_j_5": "If a match is abandoned after the first booking is issued, all bets on the \"Last Booking\" will be considered void.",
                        "ART_ru_ft_G_j_6": "If a match is abandoned before the first booking is issued, all bets on the \"First Booking\" and \"Last Booking\" will be considered void.",
                        "ART_ru_ft_G_j_7": "If there is no card received by either team within the official \"90 minutes\" of play, all bets placed on the \"First / Last Booking\" markets will be considered void.",
                    
                        "ART_ru_ft_G_k": "Bookings - X Booking",
                        "ART_ru_ft_G_k_1": "Predict which team will be recorded as shown a specific booking yet to happen.",
                        "ART_ru_ft_G_k_2": "The selections offered may be one booking or multiple bookings ahead, e.g. 4th Booking or 4th and 5th Booking (each being separate markets)",
                        "ART_ru_ft_G_k_3": "If the match is abandoned before \'X Booking\' is recorded, then any bet on that booking will be considered void. All bookings recorded prior to abandonment will be considered valid.",
                    
                        "ART_ru_ft_G_l": "Team to Receive Most Bookings",
                        "ART_ru_ft_G_l_1": "Predict which team will accumulate the most points, based on the number of cards issued to each team.",
                        "ART_ru_ft_G_l_2": "Bets are settled on the team which receives the highest cumulative number of yellow and red cards in the full \"90 minutes\" of play.",
                        "ART_ru_ft_G_l_3": "An example of the selections are:",
                        "ART_ru_ft_G_l_3_1": "Team A",
                        "ART_ru_ft_G_l_3_2": "Team B",
                        "ART_ru_ft_G_l_3_3": "Tie",
                    
                        "ART_ru_ft_G_m": "Time of the First Booking",
                        "ART_ru_ft_G_m_1": "Predict the time in which the first booking will be issued in the specific match.",
                        "ART_ru_ft_G_m_2": "An example of the selections are:",
                        "ART_ru_ft_G_m_2_1": "Up to and including the 8th Minute",
                        "ART_ru_ft_G_m_2_2": "9th minute onwards",
                        "ART_ru_ft_G_m_3": "For settlement purposes, the 1st minute of the match is from 1 second to 59 seconds. The 2nd minute is from 1 minute to 1 minute 59 seconds and so on.",
                        "ART_ru_ft_G_m_4": "For example, if a bet is placed on the time of the first booking being between the 1st and the 8th minute and the first booking is issued at 8 minutes 49 seconds, the bet is a losing bet as this falls within the \"9th minute onwards\" selection.",
                        "ART_ru_ft_G_m_5": "Any cards issued to non-players (e.g. managers, coaches or substitutes) do not count.",
                        "ART_ru_ft_G_m_6": "If the match is abandoned after the first booking is issued, all bets on \"Time of the First Booking\" will be valid.",
                        "ART_ru_ft_G_m_7": "If the match is abandoned before the first booking is issued, all bets on \"Time of the First Booking\" will be considered void.",
                        "ART_ru_ft_G_m_8": "If no booking is issued in the full \"90 minutes\" of play, all bets will be considered void.",
                    
                        "ART_ru_ft_G_n": "Red Card (Player)",
                        "ART_ru_ft_G_n_1": "Predict whether a red card will be issued in the match within the full \"90 minutes\" of play.",
                        "ART_ru_ft_G_n_2": "Any cards issued to non-players (e.g. managers, coaches or substitutes) do not count.",
                        "ART_ru_ft_G_n_3": "If a match is abandoned after a red card is issued, all bets on the \"Red Card in the Match\" will stand.",
                        "ART_ru_ft_G_n_4": "If a match is abandoned before a red card is issued, all bets on the \"Red Card in the Match\" will be considered void.",
                    
                        "ART_ru_ft_G_o": "15  Minute Bookings",
                        "ART_ru_ft_G_o_1": "In accordance with 15 Minute Rules as laid out in Main Markets above, predict which team will obtain the required winning statistic in either Handicap, 1 X 2, Over / Under or Odd / Even.",
                    
                        "ART_ru_ft_G_p": "Bookings - Double Chance",
                        "ART_ru_ft_G_p_1": "Bet on 2 of the 3 possible outcomes; home win and draw (1 & X), away win and draw (X & 2) or home win and away win (1 & 2).",
                        "ART_ru_ft_G_p_2": "The three options available are: 1 X, X 2, 1 2:",
                        "ART_ru_ft_G_p_2_1": "\"1\" indicates: Home win.",
                        "ART_ru_ft_G_p_2_2": "\"X\" indicates: Draw.",
                        "ART_ru_ft_G_p_2_3": "\"2\" indicates: Away win.",
                    
                    
                        "ART_ru_ft_H": "Free Kicks",
                        "ART_ru_ft_H_a": "First Free Kick / Last  Free Kick",
                        "ART_ru_ft_H_a_1": "Predict whether the Home or Away team will take the first / last free kick in a designated match within the full \"90 minutes\" of play.",
                        "ART_ru_ft_H_a_2": "If a match is abandoned after the first free kick is taken, all bets on the \"First Free Kick\" will stand.",
                        "ART_ru_ft_H_a_3": "If a match is abandoned after the first free kick is taken, all bets on the \"Last Free Kick\" will be considered void.",
                        "ART_ru_ft_H_a_4": "If a match is abandoned before the first free kick is taken, all bets on the \"First Free Kick\" and \"Last Free Kick\" will be considered void.",
                        "ART_ru_ft_H_a_5": "If there is no free kick taken by either team within the official \"90 minutes\" of play, all bets placed on \"First/Last Free Kick\" markets will be considered void.",
                    
                    
                        "ART_ru_ft_I": "Goal Kicks",
                        "ART_ru_ft_I_a": "First Goal Kick / Last  Goal Kick",
                        "ART_ru_ft_I_a_1": "Predict whether the Home or Away team will take the first / last goal kick in a designated match within the full \"90 minutes\" of play.",
                        "ART_ru_ft_I_a_2": "If a match is abandoned after the first goal kick is taken, all bets on the \"First Goal Kick\" will stand.",
                        "ART_ru_ft_I_a_3": "If a match is abandoned after the first goal kick is taken, all bets on the \"Last Goal Kick\" will be considered void.",
                        "ART_ru_ft_I_a_4": "If a match is abandoned before the first goal kick is taken, all bets on the \"First Goal Kick\" and \"Last Goal Kick\" will be considered void.",
                        "ART_ru_ft_I_a_5": "If there is no goal kick taken by either team within the official \"90 minutes\" of play, all bets placed on the \"First / Last Goal Kick\" markets will be considered void.",
                    
                    
                        "ART_ru_ft_J": "Throw-Ins",
                        "ART_ru_ft_J_a": "First Throw-in / Last  Throw-in",
                        "ART_ru_ft_J_a_1": "Predict whether the Home or Away team will take the first / last throw-in in a designated match within the full \"90 minutes\" of play.",
                        "ART_ru_ft_J_a_2": "If a match is abandoned after the first throw-in is taken, all bets on the \"First Throw-in\" will stand.",
                        "ART_ru_ft_J_a_3": "If a match is abandoned after the first throw-in is taken, all bets on the \"Last Throw-in\" will be considered void.",
                        "ART_ru_ft_J_a_4": "If a match is abandoned before the first throw-in is taken, all bets on the \"First Throw-in\" and \"Last Throw-in\" will be considered void.",
                        "ART_ru_ft_J_a_5": "If there is no throw-in taken by either team within the official \"90 minutes\" of play, all bets placed on the \"First / Last Throw-in\" markets will be considered void.",
                    
                    
                        "ART_ru_ft_K": "Substitutions",
                        "ART_ru_ft_K_a": "First Substitution / Last  Substitution",
                        "ART_ru_ft_K_a_1": "Predict whether the Home or Away team will make the First / Last Substitution in a designated match within the full \"90 minutes\" of play.",
                        "ART_ru_ft_K_a_2": "In the event of more than two players being substituted at the same time, the player number that is shown first by the 4th official will be deemed the winning selection for settlement purposes.",
                        "ART_ru_ft_K_a_3": "If a match is abandoned after the first substitution is made, all bets on the \"First Substitution\" will stand.",
                        "ART_ru_ft_K_a_4": "If a match is abandoned, all bets on the \"Last Substitution\" will be considered void unless the result is unconditionally determined and any further substitutions have no affect on the market result. This can only happen when both teams have used their total allocated amount of substitutions for the match. In all other scenarios, bets will be considered void.",
                        "ART_ru_ft_K_a_5": "If a match is abandoned before the first substitution is made, all bets on the \"First Substitution\" and \"Last Substitution\" will be considered void.",
                        "ART_ru_ft_K_a_6": "If there is no substitution taken by either team within the official \"90 minutes\" of play, all bets placed on the \"First / Last Substitution\" markets will be considered void.",
                    
                    
                        "ART_ru_ft_L": "Offsides",
                        "ART_ru_ft_L_a": "First Offside / Last  Offside",
                        "ART_ru_ft_L_a_1": "Predict whether the Home or Away team will have the First / Last Offside in a designated match within the full \"90 minutes\" of play.",
                        "ART_ru_ft_L_a_2": "If a match is abandoned after the first offside, all bets on the \"First Offside\" will stand.",
                        "ART_ru_ft_L_a_3": "If a match is abandoned after the first offside, all bets on the \"Last Offside\" will be considered void.",
                        "ART_ru_ft_L_a_4": "If a match is abandoned before the first offside, all bets on the \"First Offside\" and \"Last Offside\" will be considered void.",
                        "ART_ru_ft_L_a_5": "If there are no offside\'s by either team within the official \"90 minutes\" of play, all bets placed on the \"First / Last Offside\" markets will be considered void.",
                    
                    
                        "ART_ru_ft_M": "Penalty Markets",
                        "ART_ru_ft_M_a": "General Rules",
                        "ART_ru_ft_M_a_1": "The settlement of Penalty Shootout markets is based on the round (and penalties scored) when a winner is determined.",
                        "ART_ru_ft_M_a_2": "Should a competition rule state that all penalties must be taken, any penalties taken after the winner is determined will be ignored for settlement purposes.",
                    
                        "ART_ru_ft_M_b": "Penalty Awarded",
                        "ART_ru_ft_M_b_1": "Predict whether a penalty is awarded, irrelevant of the outcome, within the full \"90 minutes\" of play.",
                    
                        "ART_ru_ft_M_c": "Penalty Shootout - Handicap",
                        "ART_ru_ft_M_c_1": "Predict who will win the penalty shootout with the indicated handicap applied.",
                        "ART_ru_ft_M_c_2": "Sudden death is included for Handicap betting in a penalty shoot-out market.",
                        "ART_ru_ft_M_c_3": "If the match does not go to a shootout, all bets will be void.",
                        "ART_ru_ft_M_c_4": "Penalties scored throughout the \"90 minutes\" play and during extra time will not be included for settlement purposes.",
                    
                        "ART_ru_ft_M_d": "Penalty Shootout – Goals: Over / Under",
                        "ART_ru_ft_M_d_1": "Predict whether the total number of penalties scored in the shootout will be Over or Under the indicated goal line.",
                        "ART_ru_ft_M_d_2": "Over / Under betting for a penalty shootout only includes the standard 10 penalties in a shoot-out (5 for each team). Sudden death penalties are not included.",
                        "ART_ru_ft_M_d_3": "Here is an example:",
                        "ART_ru_ft_M_d_3_1": "Liverpool 4 - 1 Tottenham - the Over / Under line is settled at 5.",
                        "ART_ru_ft_M_d_3_2": "Liverpool 6 - 5 Tottenham (Result after 5 penalties each: Liverpool 4 - 4 Tottenham) - the Over / Under line is settled at 8 as this is the total number of penalties scored after each team took 5 penalty kicks.",
                        "ART_ru_ft_M_d_4": "If the match does not go to a shootout, all bets will be void.",
                        "ART_ru_ft_M_d_5": "Penalties scored throughout the \"90 minutes\" play and during extra time will not be included for settlement purposes.",
                        "ART_ru_ft_M_d_6": "If a match is abandoned during a penalty shootout, Over / Under bets will only be settled when the market has been unconditionally determined and any penalties scored have no affect on the market result. In all other scenarios, bets will be considered void.",
                    
                        "ART_ru_ft_M_e": "Penalty Shootout – 1 X 2",
                        "ART_ru_ft_M_e_1": "Predict who will win the Penalty Shootout or whether the result will be a draw.",
                        "ART_ru_ft_M_e_2": "Sudden Death (Round 6 onwards) is not included.",
                        "ART_ru_ft_M_e_3": "Settlement will be based on number of goals recorded by each team, up to and including Round 5 of the Penalty Shootout.",
                    
                        "ART_ru_ft_M_f": "Penalty (Shootout) - Goal / No Goal",
                        "ART_ru_ft_M_f_1": "Predict whether the specified team will score the specified penalty within the Penalty Shootout.",
                        "ART_ru_ft_M_f_2": "Settlement will be based on the result of any penalty being declared a Goal or No Goal.",
                    
                        "ART_ru_ft_M_g": "Penalty Shootout",
                        "ART_ru_ft_M_g_1": "Predict Yes or No, as to whether a specific match will progress to a Penalty Shootout.",
                        "ART_ru_ft_M_g_2": "Settlement will be based on game progressing to a Penalty Shootout, irrespective of whether Extra Time may be played.",
                    
                        "ART_ru_ft_M_h": "Penalty Shootout – Round X",
                        "ART_ru_ft_M_h_1": "Predict who will win Round X or whether the result will be a draw.",
                        "ART_ru_ft_M_h_2": "Round X is defined as the combined result of both teams’ penalties for that round.",
                        "ART_ru_ft_M_h_2_1": "E.g. (Start of Penalty Shootout) - Team A’s 1st Penalty Kick and Team B’s 1st Penalty Kick = Round 1.",
                        "ART_ru_ft_M_h_2_2": "E.g. (Start of Sudden Death) – Team A’s 6th Penalty Kick and Team B’s 6th Penalty Kick = Round 6.",
                        "ART_ru_ft_M_h_3": "Settlement will be based on number of goals recorded by each team for each round.",
                        "ART_ru_ft_M_h_4": "If a Penalty Shootout does not progress to the round stated, then all bets will be void.",
                    
                        "ART_ru_ft_M_i": "Penalty Shootout – Finishing Round",
                        "ART_ru_ft_M_i_1": "Predict the round in which the Penalty Shootout will end.",
                        "ART_ru_ft_M_i_2": "Settlement will be based on the match ending in the 3rd, 4th, 5th or 6 (or later) round of a Penalty Shootout.",
                        "ART_ru_ft_M_i_3": "If the match is abandoned before any result has been declared, then any bets on this market will be considered void.",
                    
                    
                        "ART_ru_ft_N": "Competition Markets",
                        "ART_ru_ft_N_a": "League: General Rules",
                        "ART_ru_ft_N_a_1": "The market will be settled when the result is confirmed.",
                        "ART_ru_ft_N_a_2": "Markets will be settled based on the official result by the relevant governing body for the league.",
                        "ART_ru_ft_N_a_3": "Point\'s deductions will count for all league markets.",
                        "ART_ru_ft_N_a_4": "Outright Competition Rules apply.",
                    
                        "ART_ru_ft_N_b": "League: Group Betting",
                        "ART_ru_ft_N_b_1": "Predict which team from those stated will finish in the highest league position over the course of the league season.",
                    
                        "ART_ru_ft_N_c": "League: Top 4, 6, 10, etc.  Finish",
                        "ART_ru_ft_N_c_1": "Predict which team will finish in the top 4, 6, 10 etc. positions over the course of the league season.",
                    
                        "ART_ru_ft_N_e": "League: League Winner without Team X",
                        "ART_ru_ft_N_e_1": "Predict which team will finish top over the course of the league season after the stated Team or Teams have been removed from the league table.",
                    
                        "ART_ru_ft_N_d": "League: Season Handicap Markets",
                        "ART_ru_ft_N_d_1": "Predict which team will win the stated league based on handicap points being applied to all teams.",
                        "ART_ru_ft_N_d_2": "Handicap points are added to the real finishing points of each team in the stated league.",
                        "ART_ru_ft_N_d_3": "The team with most handicap points + real points (combined) will be declared the winner.",
                        "ART_ru_ft_N_d_4": "Dead Heat Rules apply.",
                        "ART_ru_ft_N_d_5": "Each teams Handicap points value will not change during the season, however prices (and place terms) will be adjusted.",
                        "ART_ru_ft_N_d_6": "The full list of Handicap points (pre-season) for each team will be displayed beside their selection names.",
                        "ART_ru_ft_N_d_7": "The following example is based on a league with 5 teams.",
                        "ART_ru_ft_N_td_d7_1_1": "Teams",
                        "ART_ru_ft_N_td_d7_1_2": "End of Season Points",
                        "ART_ru_ft_N_td_d7_1_3": "Handicap Points",
                        "ART_ru_ft_N_td_d7_1_4": "Combined Points",
                        "ART_ru_ft_N_td_d7_1_5": "Finishing Position",
                        "ART_ru_ft_N_td_d7_2_1": "Team1",
                        "ART_ru_ft_N_td_d7_2_2": "90",
                        "ART_ru_ft_N_td_d7_2_3": "3",
                        "ART_ru_ft_N_td_d7_2_4": "93",
                        "ART_ru_ft_N_td_d7_2_5": "2nd",
                        "ART_ru_ft_N_td_d7_3_1": "Team2",
                        "ART_ru_ft_N_td_d7_3_2": "85",
                        "ART_ru_ft_N_td_d7_3_3": "0",
                        "ART_ru_ft_N_td_d7_3_4": "85",
                        "ART_ru_ft_N_td_d7_3_5": "5th",
                        "ART_ru_ft_N_td_d7_4_1": "Team3",
                        "ART_ru_ft_N_td_d7_4_2": "82",
                        "ART_ru_ft_N_td_d7_4_3": "5",
                        "ART_ru_ft_N_td_d7_4_4": "87",
                        "ART_ru_ft_N_td_d7_4_5": "4th",
                        "ART_ru_ft_N_td_d7_5_1": "Team4",
                        "ART_ru_ft_N_td_d7_5_2": "79",
                        "ART_ru_ft_N_td_d7_5_3": "15",
                        "ART_ru_ft_N_td_d7_5_4": "94",
                        "ART_ru_ft_N_td_d7_5_5": "1st",
                        "ART_ru_ft_N_td_d7_6_1": "Team5",
                        "ART_ru_ft_N_td_d7_6_2": "79",
                        "ART_ru_ft_N_td_d7_6_3": "9",
                        "ART_ru_ft_N_td_d7_6_4": "88",
                        "ART_ru_ft_N_td_d7_6_5": "3rd",
                    
                        "ART_ru_ft_N_f": "League: Team to Finish  Bottom",
                        "ART_ru_ft_N_f_1": "Predict which team will finish bottom of the specific league over the course of the league season.",
                        "ART_ru_ft_N_f_2": "This market is also known as \'Rock Bottom\'.",
                    
                        "ART_ru_ft_N_g": "League: Team to be  Relegated",
                        "ART_ru_ft_N_g_1": "Predict which team will be relegated from the competition.",
                        "ART_ru_ft_N_g_2": "All relegated teams will be settled as full winning selections, i.e. dead heat rules do not apply.",
                        "ART_ru_ft_N_g_3": "If a team is removed from a league or liquidated, bets on that team will be void. If this happens before the start of the season the whole market will be void and a new market will be opened.",
                    
                        "ART_ru_ft_N_h": "League: Team to Stay Up",
                        "ART_ru_ft_N_h_1": "Predict which team will not be relegated from the competition.",
                        "ART_ru_ft_N_h_2": "All teams that are not relegated will be settled as full winning selections, i.e. dead heat rules do not apply.",
                        "ART_ru_ft_N_h_3": "If a team is removed from a league or liquidated, bets on that team will be void. If this happens before the start of the season the whole market will be void and a new market will be opened.",
                    
                        "ART_ru_ft_N_i": "League: Team to be Promoted",
                        "ART_ru_ft_N_i_1": "Predict which team will be promoted from the competition.",
                        "ART_ru_ft_N_i_2": "This market will include both automatic promotion positions as well as promotion via any play off structure used for the specified competition.",
                        "ART_ru_ft_N_i_3": "All teams that are promoted will be settled as full winning selections, i.e. dead heat rules do not apply.",
                        "ART_ru_ft_N_i_4": "If a team is removed from a league or liquidated, bets on that team will be void. If this happens before the start of the season the whole market will be void and a new market will be opened.",
                    
                        "ART_ru_ft_N_j": "League: Top Newcomer",
                        "ART_ru_ft_N_j_1": "Predict which team, of the newly promoted teams, will finish the season with the highest league position.",
                    
                        "ART_ru_ft_N_k": "Competition: Highest  Scoring Team",
                        "ART_ru_ft_N_k_1": "Predict which team will score the most goals during the competition.",
                        "ART_ru_ft_N_k_2": "All bets apply to \"90 minutes\" of play and extra time according to the match officials, plus any stoppage time.",
                        "ART_ru_ft_N_k_3": "Goals scored in Penalty Shootouts are not included.",
                        "ART_ru_ft_N_k_4": "If a match is abandoned, we will count the goals scored based on the official result by the governing body. This can include a restart of the match or an allocated score line.",
                    
                        "ART_ru_ft_N_l": "Competition: Team to  Concede the Most Goals",
                        "ART_ru_ft_N_l_1": "Predict which team will concede the most goals during the competition.",
                        "ART_ru_ft_N_l_2": "All bets apply to \"90 minutes\" of play and extra time according to the match officials, plus any stoppage time.",
                        "ART_ru_ft_N_l_3": "Goals conceded in Penalty Shootouts are not included.",
                        "ART_ru_ft_N_l_4": "If a match is abandoned, we will count the goals scored based on the official result by the governing body. This can include a restart of the match or an allocated score line.",
                    
                        "ART_ru_ft_N_m": "Competition: Total Goals",
                        "ART_ru_ft_N_m_1": "Predict how many goals will be scored during the competition.",
                        "ART_ru_ft_N_m_2": "All bets apply to \"90 minutes\" of play and extra time according to the match officials, plus any stoppage time.",
                        "ART_ru_ft_N_m_3": "Goals scored in Penalty Shootouts will not count for competition total goals.",
                        "ART_ru_ft_N_m_4": "If a match is abandoned, we will count the goals scored based on the official result by the governing body. This can include a restart of the match or an allocated score line.",
                    
                        "ART_ru_ft_N_n": "Competition: Will a  Hat-trick be Scored",
                        "ART_ru_ft_N_n_1": "Predict will any player score a Hat-trick during the competition.",
                        "ART_ru_ft_N_n_2": "All bets apply to \"90 minutes\" of play and extra time according to the match officials, plus any stoppage time.",
                        "ART_ru_ft_N_n_3": "Goals scored in Penalty Shootouts will not count towards a Hat-trick.",
                        "ART_ru_ft_N_n_4": "A Hat-trick will be achieved if a player scores 3 or more goals in a single match.",
                        "ART_ru_ft_N_n_5": "If a match is abandoned, we will count the goals scored based on the official result by the governing body. This can include a restart of the match or an allocated score line. If a hat-trick is scored before a match is abandoned and the match is restarted at 0-0 or a different score line is allocated by the governing body, the hat-trick will not count.",
                    
                        "ART_ru_ft_N_o": "Competition: Total  Hat-tricks",
                        "ART_ru_ft_N_o_1": "Predict how many Hat-tricks will be scored during the competition.",
                        "ART_ru_ft_N_o_2": "All bets apply to \"90 minutes\" of play and extra time according to the match officials, plus any stoppage time.",
                        "ART_ru_ft_N_o_3": "Goals scored in Penalty Shootouts will not count in the Hat-trick competition total.",
                        "ART_ru_ft_N_o_4": "A Hat-trick will be achieved if a player scores 3 or more goals in a single match.",
                        "ART_ru_ft_N_o_5": "If a match is abandoned, we will count the goals scored based on the official result by the governing body. This can include a restart of the match or an allocated score line. If a hat-trick is scored before a match is abandoned and the match is restarted at 0-0 or a different score line is allocated by the governing body, the hat-trick will not count.",
                    
                        "ART_ru_ft_N_p": "Competition: Total Red Cards",
                        "ART_ru_ft_N_p_1": "Predict how many Red Cards will be issued during the competition.",
                        "ART_ru_ft_N_p_2": "All bets apply to \"90 minutes\" of play and extra time according to the match officials, plus any stoppage time.",
                        "ART_ru_ft_N_p_3": "Any Red Card issued to non-players (e.g. managers, coaches or substitutes) do not count.",
                        "ART_ru_ft_N_p_4": "Red Cards issued during a Penalty Shootout do not count.",
                        "ART_ru_ft_N_p_5": "If a match is abandoned after a Red Card is issued, the Red Card will count in the \"Total Red Cards\" competition total.",
                    
                        "ART_ru_ft_N_q": "Competition - Total Yellow Cards",
                        "ART_ru_ft_N_q_1": "Predict how many Yellow Cards will be issued during the competition.",
                        "ART_ru_ft_N_q_2": "All bets apply to 90 minutes of play and extra time according to the match  officials, plus any stoppage time. ",
                        "ART_ru_ft_N_q_3": "Any Yellow Card issued to non-players (e.g. managers, coaches or substitutes) do  not count.",
                        "ART_ru_ft_N_q_4": "Yellow Card issued during a Penalty Shootout do not count.",
                        "ART_ru_ft_N_q_5": "If a same player received the second Yellow Card , the card will be counted.",
                    
                        "ART_ru_ft_N_r": "Competition: City with Most Goals",
                        "ART_ru_ft_N_r_1": "Predict which city will have the most goals during the competition.",
                        "ART_ru_ft_N_r_2": "All bets apply to \"90 minutes\" of play and extra time according to the match officials, plus any stoppage time.",
                        "ART_ru_ft_N_r_3": "Goals scored in Penalty Shootouts will not count towards the \'City with Most Goals\' total.",
                        "ART_ru_ft_N_r_4": "If a match is abandoned, we will count the goals scored based on the official result by the governing body. This can include a restart of the match or an allocated score line.",
                    
                        "ART_ru_ft_N_s": "Competition: Winning Group",
                        "ART_ru_ft_N_s_1": "Predict which team group will feature the winning team of the competition.",
                        "ART_ru_ft_N_s_2": "Outright Competition Rules apply.",
                    
                        "ART_ru_ft_N_t": "Competition: Team to Finish  Bottom of Group",
                        "ART_ru_ft_N_t_1": "Predict which team will finish bottom of the Group.",
                        "ART_ru_ft_N_t_2": "Outright Competition Rules apply.",
                    
                        "ART_ru_ft_N_u": "Competition: Origin of  Winner",
                        "ART_ru_ft_N_u_1": "Predict the origin of the winning of the competition.",
                        "ART_ru_ft_N_u_2": "The origin could be the region, country or continent of the winning team.",
                        "ART_ru_ft_N_u_3": "Outright Competition Rules apply.",
                    
                        "ART_ru_ft_N_v": "Competition: To Qualify",
                        "ART_ru_ft_N_v_1": "Predict which team will qualify and progress to the next round of stated competition.",
                        "ART_ru_ft_N_v_2": "Market is based on Full-Time score and includes any Extra Time or Penalties needed to declare a winner.",
                        "ART_ru_ft_N_v_3": "Outright Competition Rules apply.",
                    
                        "ART_ru_ft_N_w": "Competition: Stage of  Elimination",
                        "ART_ru_ft_N_w_1": "Predict at which stage the stated team will be eliminated from the competition.",
                        "ART_ru_ft_N_w_2": "Outright Competition Rules apply.",
                    
                        "ART_ru_ft_N_x": "ompetition: Nominate the  Finalists",
                        "ART_ru_ft_N_x_1": "Predict which teams will contest the final of the tournament.",
                        "ART_ru_ft_N_x_2": "Outright Competition Rules apply.",
                    
                        "ART_ru_ft_N_y": "Competition: Final Referee",
                        "ART_ru_ft_N_y_1": "Predict who will be the referee for the final of the competition.",
                        "ART_ru_ft_N_y_2": "The market will be settled after the start of the final, on the referee who starts the final, regardless of any previous announcements.",
                        "ART_ru_ft_N_y_3": "Outright Competition Rules apply.",
                    
                        "ART_ru_ft_N_z": "Straight  Forecast Finishing Order (League and Competition)",
                        "ART_ru_ft_N_z_1": "Predict which two selections will finish in 1st and 2nd, in the order named, for the stated league / competition.",
                        "ART_ru_ft_N_z_2": "All bets apply to \"90 minutes\" of play and extra time according to the match officials, plus any stoppage time.",
                        "ART_ru_ft_N_z_3": "If a match is abandoned, we will count the goals scored based on the official result by the governing body. This can include a restart of the match or an allocated score line.",
                    
                        "ART_ru_ft_N_aa": "Dual Forecast Finishing Order (League and Competition)",
                        "ART_ru_ft_N_aa_1": "Predict which two teams will finish in the top two positions, in any order, of the stated league / competition in which they are participating.",
                        "ART_ru_ft_N_aa_2": "All bets apply to \"90 minutes\" of play and extra time according to the match officials, plus any stoppage time.",
                        "ART_ru_ft_N_aa_3": "If a match is abandoned, we will count the goals scored based on the official result by the governing body. This can include a restart of the match or an allocated score line.",
                    
                        "ART_ru_ft_N_ab": "Top Goal Scorer",
                        "ART_ru_ft_N_ab_1": "Predict who will score the most goals in a specific competition.",
                        "ART_ru_ft_N_ab_2": "In the event of more than one player being top scorer, dead heat rules apply.",
                        "ART_ru_ft_N_ab_3": "Players who are listed to play for their teams are considered valid bets, regardless if they are injured, suspended or do not take part in the competition for whatever reason.",
                        "ART_ru_ft_N_ab_4": "In the event that a player is transferred to a different club within the same league, goals scored prior to the move will be counted. If a player is transferred to a club in another league, goals scored prior to the transfer will not be brought over to their new league. All bets will stand in both of the above scenarios. ",
                        "ART_ru_ft_N_ab_5": "Own goals do not count.",
                        "ART_ru_ft_N_ab_6": "For purely league competitions, only goals scored in the league determines the total number of goals scored by the player for that competition. Any goals scored in playoff matches do not count.",
                    
                        "ART_ru_ft_N_ac": "Top Team Goal Scorer",
                        "ART_ru_ft_N_ac_1": "Predict which player will score the most goals for their stated team during the competition.",
                        "ART_ru_ft_N_ac_2": "All bets apply to \"90 minutes\" of play and extra time according to the match officials, plus any stoppage time.",
                        "ART_ru_ft_N_ac_3": "Goals scored in Penalty Shootouts are not included.",
                        "ART_ru_ft_N_ac_4": "This market applies to all matches the team plays in the competition.",
                        "ART_ru_ft_N_ac_5": "Dead heat rules apply. Any method used to determine a tied result, e.g. counting assists, will not be used for settlement purposes.",
                    
                        "ART_ru_ft_N_ad": "Top Goal Scorer /  Competition Winner Double",
                        "ART_ru_ft_N_ad_1": "Predict which player will score the most goals and which team will win the stated competition.",
                        "ART_ru_ft_N_ad_2": "All bets apply to \"90 minutes\" of play and extra time according to the match officials, plus any stoppage time.",
                        "ART_ru_ft_N_ad_3": "Goals scored in Penalty Shootouts are not included.",
                        "ART_ru_ft_N_ad_4": "If more than one player is tied for Top Goal scorer, dead heat rules apply. Any method used to determine a tied result, e.g. counting assists, will not be used for settlement purposes.",
                    
                        "ART_ru_ft_N_ae": "Highest Scoring Group",
                        "ART_ru_ft_N_ae_1": "Predict in which group will the most goals be scored during the competition.",
                        "ART_ru_ft_N_ae_2": "Only goals scored in the Group Stages will count.",
                        "ART_ru_ft_N_ae_3": "All bets apply to \"90 minutes\" of play according to the match officials, plus any stoppage time.",
                        "ART_ru_ft_N_ae_4": "If a match is abandoned, we will count the goals scored based on the official result by the governing body. This can include a restart of the match or an allocated score line.",
                    
                        "ART_ru_ft_N_af": "Extra Time",
                        "ART_ru_ft_N_af_1": "Predict yes or no as to whether Extra Time period will apply to a specific game.",
                        "ART_ru_ft_N_af_2": "Settlement will be based on the result of the game finishing within the normal \"90 Minutes\" or progressing to Extra Time.",
                    
                        "ART_ru_ft_N_ag": "Competition: 3rd Place Winner",
                        "ART_ru_ft_N_ag_1": "Predict which team will win the 3rd Place Playoff event between the two teams listed.",
                        "ART_ru_ft_N_ag_2": "Settlement will be based on the result after Full Time, Extra Time or Penalty Shootout.",
                        "ART_ru_ft_N_ag_3": "Outright competition rules apply.",
                    
                        "ART_ru_ft_N_ah": "Competition: Group X Winner",
                        "ART_ru_ft_N_ah_1": "Predict which of the 2 teams listed will finish top of their respective group.",
                        "ART_ru_ft_N_ah_2": "Settlement will be based on all group matches being finished and a group winner being the declared by the official governing body.",
                        "ART_ru_ft_N_ah_3": "Should the two teams be tied, the official governing body’s determination of the winner will be used (Goal Difference, Head to Head etc.)",
                        "ART_ru_ft_N_ah_4": "Should no group winner be declared, all bets will be void.",
                    
                    
                        "ART_ru_ft_O": "Combined Markets",
                        "ART_ru_ft_O_a": "1 X 2 & Goals Over / Under",
                        "ART_ru_ft_O_a_1": "Predict the result of the match after \"90 Minutes\" as well as whether the total number of goals scored will be over or under a specified amount.",
                        "ART_ru_ft_O_a_2": "Settlement will be based on the selected result of Win, Lose or Draw for a specific team and the total number of goals scored within the match.",
                        "ART_ru_ft_O_a_3": "If the match is suspended or abandoned before any result has been declared, then any bets on this market will be considered void.",
                    
                        "ART_ru_ft_O_b": "1 X 2 & Both Teams To Score",
                        "ART_ru_ft_O_b_1": "Predict the result of the match after \"90 Minutes\" as well as whether both teams will score a goal in the game.",
                        "ART_ru_ft_O_b_2": "Settlement will be based on the selected result of Win, Lose or Draw for a specific team and the number of goals scored by each team.",
                        "ART_ru_ft_O_b_3": "If the match is suspended or abandoned before any result has been declared, then any bets on this market will be considered void.",
                    
                        "ART_ru_ft_O_c": "1 X 2 & 1st Team To Score",
                        "ART_ru_ft_O_c_1": "Predict the result of the match after \"90 Minutes\" as well as the team that will score the first goal scored.",
                        "ART_ru_ft_O_c_2": "Settlement will be based on the selected result of Win, Lose or Draw for a specific team as well as the correct selection of first team to score.",
                        "ART_ru_ft_O_c_3": "If the match is suspended or abandoned before any result has been declared, then any bets on this market will be considered void.",
                        "ART_ru_ft_O_c_4": "If no 1st Goal is scored in the game, then all bets will be settled as a loss.",
                    
                        "ART_ru_ft_O_d": "1 X 2 & Goals Odd / Even",
                        "ART_ru_ft_O_d_1": "Predict the result of the match after \"90 Minutes\" as well as whether the totals number of goals scored will be an odd or even amount.",
                        "ART_ru_ft_O_d_2": "Settlement will be based on the selected result of Win, Lose or Draw for a specific team and the total goals being odd or even.",
                        "ART_ru_ft_O_d_3": "If the match is suspended or abandoned before any result has been declared, then any bets on this market will be considered void.",
                    
                        "ART_ru_ft_O_e": "Goals Over / Under & Both Teams To Score",
                        "ART_ru_ft_O_e_1": "Predict whether the total number of goals recorded within the game will be over or under the stated amount as well as whether both teams score.",
                        "ART_ru_ft_O_e_2": "Settlement will be based on the total goals recorded after \"90 Minutes\" in addition to whether both teams have scored.",
                        "ART_ru_ft_O_e_3": "If the match is suspended or abandoned before any result has been declared, then the following conditions will apply:",
                        "ART_ru_ft_O_e_3_1": "If both teams have scored 1 or more goals and the total goals scored is greater than the stated \'line\', the bet will be considered valid.",
                        "ART_ru_ft_O_e_3_2": "If both teams have not scored 1 or more goals before the game is suspended or abandoned, the bet will be considered void.",
                    
                        "ART_ru_ft_O_f": "Goals Over / Under & Goal Odd / Even",
                        "ART_ru_ft_O_f_1": "Predict whether the total number of goals scored within the game will be over or under the stated amount as well whether the totals number of goals scored will be an odd or even amount.",
                        "ART_ru_ft_O_f_2": "Settlement will be based on the total goals recorded after \"90 Minutes\" in addition to whether the total goals recorded was odd or even.",
                        "ART_ru_ft_O_f_3": "If the match is suspended or abandoned before any result has been declared, then any bets on this market will be considered void.",
                    
                        "ART_ru_ft_O_g": "Goals Over / Under & 1st Team To Score",
                        "ART_ru_ft_O_g_1": "Predict whether the total number of goals scored within the game will be over or under the stated amount as well which team will score the first goal.",
                        "ART_ru_ft_O_g_2": "Settlement will be based on the total goals recorded after \"90 Minutes\" in addition to the correct selection of which team will record the first goal.",
                        "ART_ru_ft_O_g_3": "If the match is suspended or abandoned before any result has been declared, then the following conditions will apply:",
                        "ART_ru_ft_O_g_3_1": "If the total goals scored at time of suspension or abandonment is greater than the stated \'line\', the bet will be considered valid.",
                        "ART_ru_ft_O_g_3_2": "If the total goals scored at time of suspension or abandonment is less than the stated \'line\', the bet will be considered void.",
                        "ART_ru_ft_O_g_4": "If no 1st Goal is scored in the game, then all bets will be settled as a loss.",
                    
                        "ART_ru_ft_O_h": "Double Chance & Goals Over / Under",
                        "ART_ru_ft_O_h_1": "Predict the correct result from the outcomes available as well as whether the total goals scored in the game will be over or under a stated amount.",
                        "ART_ru_ft_O_h_2": "Settlement is based on the correct selection of possible outcomes (stated below) as well as the total number of goals recorded after \"90 Minutes\".",
                        "ART_ru_ft_O_h_3": "The 3 possible outcomes are:",
                        "ART_ru_ft_O_h_3_1": "Home Win and Draw (1 & X)",
                        "ART_ru_ft_O_h_3_2": "Away Win and Draw (X & 2)",
                        "ART_ru_ft_O_h_3_3": "Home Win and Away Win (1 & 2)",
                        "ART_ru_ft_O_h_4": "If the match is abandoned before any result has been declared, then any bets on this market will be considered void.",
                    
                        "ART_ru_ft_O_i": "Double Chance & Both Teams To Score",
                        "ART_ru_ft_O_i_1": "Predict the correct result from the outcomes available as well as whether both teams will score within the game.",
                        "ART_ru_ft_O_i_2": "Settlement is based on the correct selection of possible outcomes (stated below) as well as both teams recording a goal within the game.",
                        "ART_ru_ft_O_i_3": "The 3 possible outcomes are:",
                        "ART_ru_ft_O_i_3_1": "Home Win and Draw (1 & X)",
                        "ART_ru_ft_O_i_3_2": "Away Win and Draw (X & 2)",
                        "ART_ru_ft_O_i_3_3": "Home Win and Away Win (1 & 2)",
                        "ART_ru_ft_O_i_4": "If the match is abandoned before any result has been declared, then any bets on this market will be considered void.",
                    
                    
                        "ART_ru_ft_P": "Other Markets",
                        "ART_ru_ft_P_a": "Total Home and Away Team in  a Particular League",
                        "ART_ru_ft_P_a_p": "In certain leagues, the  company will offer the member the opportunity to bet across events to  determine the outcome of the events combined. This market combines  all the home team results against all the away team results. For  neutral matches, Team 1 will be considered the \'Home Team\' for this  market. Below is a breakdown of the rules for the individual bet  types we offer.",
                    
                        "ART_ru_ft_P_b": "Total Home and Away in a  Particular League: General Rules",
                        "ART_ru_ft_P_b_1": "If one match in the particular league is abandoned or cancelled, all bets on Total Home and Away team in a Particular League will be void.",
                        "ART_ru_ft_P_b_2": "The day that the matches take place and the number of matches will be clearly listed in the selection name, for example:",
                        "ART_ru_ft_P_b_2_1": "Home Team - Friday - 3 Games",
                        "ART_ru_ft_P_b_2_2": "Away Team - Friday - 3 Games",
                    
                        "ART_ru_ft_P_c": "Total Home and Away in a Particular League: 1 X 2 and Double Chance",
                        "ART_ru_ft_P_c_1": "Predict the result of all the home teams against all the away teams based on the number of goals scored. For example, if the combined Home Team Goals are 6 and the combined Away Team Goals are 8, then the winning selection will be:",
                        "ART_ru_ft_P_c_1_1": "‘Away Team’ (for 1 X 2)",
                        "ART_ru_ft_P_c_1_2": "‘Away Team / Draw’ and ‘Home Team / Away Team’ (for Double Chance)",
                    
                        "ART_ru_ft_P_d": "Total Home and Away in a Particular League: Handicap",
                        "ART_ru_ft_P_d_1": "Predict the result of all the home teams against all the away teams with the indicated handicap applied through the full \"90 minutes\" of play.",
                    
                        "ART_ru_ft_P_e": "Total Home and Away in a  Particular League: Goals - Over / Under",
                        "ART_ru_ft_P_e_1": "Predict whether the total number of goals for both selections will be over or under the indicated line.",
                    
                    
                        "ART_ru_ft_Q": "Fantasy Matches",
                        "ART_ru_ft_Q_a": "Fantasy Matches",
                        "ART_ru_ft_Q_a_p": "These are events where two teams, from two separate matches are paired together for predicting imaginary market type outcomes.",
                        "ART_ru_ft_Q_a_1": "Fantasy markets are settled on the basis of goals scored by each team in their respective match.",
                        "ART_ru_ft_Q_a_2": "Should one (or both) of the matches be abandoned, suspended or postponed and fail to resume within 36hrs, then all bets on that Fantasy Match will be void.",
                        "ART_ru_ft_Q_a_3": "Should one (or both) of the events progress to Extra Time or a Penalty Shootout only the Full-Time score at “90minutes” (including ‘Injury Time’) will apply.",
                        "ART_ru_ft_Q_a_4": "Home or Away venue has no consideration or impact on the result and settlement of a Fantasy Match.",
                        "ART_ru_ft_Q_a_5": "For any fantasy market offered, settlement will obey the specific market type rules listed above.",
                    
                        "ART_ru_ft_R": "E-Football Matches",
                        "ART_ru_ft_R_a_1": "These matches may be offered in virtual simulation or player v player format.",
                        "ART_ru_ft_R_a_2": "Settlement will be based on the official score at the end of the match duration stated within the Competition Name (e.g. 18 Mins Play)",
                        "ART_ru_ft_R_a_3": "Should no duration be stated, settlement will be based on the official score for the match under that specific competition.",
                        "ART_ru_ft_R_a_4": "In the event of a “Re-make” or “Re-creation” within 12 hours, bets will be settled based on the official result.",
                        "ART_ru_ft_R_a_5": "The ordering of team names (Home or Away) will not be relevant to E-Football Match settlement. For example, if our fixture states Team 1 vs Team 2, but the official competition states Team 2 vs Team 1, all wagers will be valid.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_ft": "足球",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "11/11/2020",
                    
                        "ART_ru_ft_A": "一般规则",
                        "ART_ru_ft_A_a_1": "除非另有注明，所有足球投注的结算皆以球赛所规定的完场时间90分钟为准。",
                        "ART_ru_ft_A_a_2": "完场时间90分钟包括球员伤停补时。加时赛、淘汰赛、点球，以及赛事后如果裁判或相关管理机构更改任何赛果则不计算在内。",
                        "ART_ru_ft_A_a_3": "除非在个别玩法规则另有注明，所有滚球投注的结算将以90分钟的赛果为准。 ",
                        "ART_ru_ft_A_a_4": "对于某些以全场完场时间为80分钟（2 x40分钟）的特定赛事或者友谊赛，所有投注的结算皆以完场时间为准。",
                        "ART_ru_ft_A_a_5": "若少年赛、友谊赛的完场时间为70分钟（2 x 35分钟）或更少，本公司将在开赛前做出公布，否则该场赛事的注单一律作废。",
                        "ART_ru_ft_A_a_6": "如果赛事中断或延迟，并且没有在36小时内重新开始，所有该场赛事的投注即被视为无效且取消，除非在个别投注类型规则里另有指定注明。 ",
                        "ART_ru_ft_A_a_7": "如果赛事确认取消，所有该场赛事的投注即被视为无效且取消，除非在个别投注类型规则里另有指定注明。如果赛事是在上半场中断，所有上半场的注单将被取消。如果赛事是在下半场中断所有上半场的投注保持有效，但所有下半场的注单将被取消，除非在个别玩法规则另有注明。",
                        "ART_ru_ft_A_a_8": "除非在个别玩法规则另有注明，乌龙球将予以计算在内。",
                        "ART_ru_ft_A_a_9": "如果比赛或赛事取消，中断或延迟并且没有在官方指定开球时间的36小时内重新开始，所有该场赛事的投注即被视为无效且取消，除非在个别体育规则里另有指定注明。 某些无条件终止的盘口将会相应地结算。单独的体育规则中对此类盘口的结算程序做了说明。公司取消该赛事所有注单的结果被视为最终决定，无需参考官方赛事裁判或相关部门的决定。连串投注将会继续按照注单剩余赛事的赛果结算，该取消赛事的赔率将会按照1计算。",
                        "ART_ru_ft_A_a_10": "对于国际赛事，只要变更的场地仍在同一个国家内，所有注单将保持有效。",
                        "ART_ru_ft_A_a_11": "对于国际赛事，只要变更的场地仍在联赛原定举办的国家内，所有注单将保持有效。",
                        "ART_ru_ft_A_a_12": "本公司保留权利取消任何因更换场地而可能对赛事结果有影响的注单。",
                        "ART_ru_ft_A_a_13": "若赛事的确切开赛时间不明（比如，由于电视直播时间安排的问题），要是在原本开赛时间的72小时之内，本平台保留调整该开赛时间的权利。",
                    
                    
                        "ART_ru_ft_B": "主要市场",
                        "ART_ru_ft_B_a": "让球盘",
                        "ART_ru_ft_B_b": "一般规则",
                        "ART_ru_ft_B_b_1": "预测哪一支球队在盘口指定的让球数在全场/半场/赛事某个时节赢得比赛。",
                        "ART_ru_ft_B_b_2": "\"让球盘\"则定义为在比赛正式开始前，一方球队已得到另一方让的虚拟分数，以领先的情况下开始比赛。",
                        "ART_ru_ft_B_b_3": "所有注单将按盘口开出的让球数在玩法的时节结束后结算。",
                        "ART_ru_ft_B_b_4": "让球队（优势球队）将给出让球，让球数将显示在赔率的左侧，让球队在盘面上也会以粗型字体显示",
                        "ART_ru_ft_B_b_5": "让球盘的玩法分为以下几种：",
                        "ART_ru_ft_B_b_5_1": "整数让球也或称为让&lsquo;一球&rsquo;（如：-1，-2，-3，等）",
                        "ART_ru_ft_B_b_5_2": "非整数让球也或称为&lsquo;半球&rsquo;（如：-0.5，-1.5，-2.5，等）",
                        "ART_ru_ft_B_b_5_3": "混合以上让&lsquo;半球/一球&rsquo;的方式（如：-0/0.5，-0.5/1，-1/1.5，等）",
                    
                        "ART_ru_ft_B_c": "让球",
                        "ART_ru_ft_B_c_1": "根据盘口让球信息预测最终获得胜利的球队。",
                        "ART_ru_ft_B_c_2": "投注的结算皆以球赛所规定的完场时间90分钟为准。",
                        "ART_ru_ft_B_c_3": "如果赛事在90分钟结束前取消或中断，所有注单将会被视为无效。",
                    
                        "ART_ru_ft_B_d": "让球 - 上半场",
                        "ART_ru_ft_B_d_1": "所有上半场的投注将以上半场45分钟其中包含伤停补时后的赛果结算。",
                        "ART_ru_ft_B_d_2": "如果赛事在上半场时节因任何理由取消或中断，所有上半场注单将被取消。",
                        "ART_ru_ft_B_d_3": "如果赛事在下半场或加时赛因任何理由取消或中断，所有上半场注单保持有效。",
                    
                        "ART_ru_ft_B_e": "滚球让球",
                        "ART_ru_ft_B_e_1": "所有注单将按照盘口开出让球信息，在相应投注类型结束后结算。",
                        "ART_ru_ft_B_e_2": "结算是以投注时到比赛/时节结束后的赛果做裁决。即是以赛事完场比分减去投注当时的比分。上半场的滚球让球投注将以上半场结束后的赛果结算。",
                    
                        "ART_ru_ft_B_f": "加时赛 - 让球",
                        "ART_ru_ft_B_f_1": "所有注单将按照盘口开出让球信息，在30分钟加时赛结束后计算，包含补时。",
                        "ART_ru_ft_B_f_2": "如果赛事在加时赛结束前取消或中断，所有注单将会被视为无效。",
                    
                        "ART_ru_ft_B_g": "加时赛 - 让球-上半场",
                        "ART_ru_ft_B_g_1": "所有注单将按照盘口开出让球信息，在15分钟加时赛结束后计算，包含补时。",
                        "ART_ru_ft_B_g_2": "加时赛中如果赛事在上半场取消或中断，所有上半场注单将会被视为无效。",
                        "ART_ru_ft_B_g_3": "加时赛中如果赛事在下半场或补时阶段取消或中断，所有上半场注单将会被视为有效。",
                    
                        "ART_ru_ft_B_h": "15 分钟盘口（让球）",
                        "ART_ru_ft_B_h_1": "根据盘口让球信息预测最终获得15分钟内比赛胜利的球队。",
                        "ART_ru_ft_B_h_2": "在每个15分钟开始，所有球队在开始此时段比赛都是0-0，之前的得分点是没有影响的。",
                        "ART_ru_ft_B_h_3": "所有的投注将以开始下个时节前的赛果结算。",
                        "ART_ru_ft_B_h_4": "如果赛事中断，所有当前15分钟时段的投注以及将要进行的下一个15分钟时段投注将视为无效，任何15分钟时段投注，如果该时段完整结束，注单将被视为有效。",
                        "ART_ru_ft_B_td_h4_1_1": "15分钟-时段1",
                        "ART_ru_ft_B_td_h4_1_2": "上半场开始-14分59秒",
                        "ART_ru_ft_B_td_h4_2_1": "15分钟-时段2",
                        "ART_ru_ft_B_td_h4_2_2": "15分钟-29分59秒",
                        "ART_ru_ft_B_td_h4_3_1": "15分钟-时段3",
                        "ART_ru_ft_B_td_h4_3_2": "30分钟-半场",
                        "ART_ru_ft_B_td_h4_4_1": "15分钟-时段4",
                        "ART_ru_ft_B_td_h4_4_2": "下半场开始-59分59秒",
                        "ART_ru_ft_B_td_h4_5_1": "15分钟-时段5",
                        "ART_ru_ft_B_td_h4_5_2": "60分钟-74分59秒",
                        "ART_ru_ft_B_td_h4_6_1": "15分钟-时段6",
                        "ART_ru_ft_B_td_h4_6_2": "75分钟-全场",
                    
                        "ART_ru_ft_B_i": "大小盘",
                        "ART_ru_ft_B_j": "一般规则",
                        "ART_ru_ft_B_j_1": "预测赛事总入球数将大于或小于在盘口指定的大/小盘球数。",
                        "ART_ru_ft_B_j_2": "如果赛事的总入球数多于盘口的大/小盘球数，则为大盘。如果少于盘口的大/小盘球数，则为小盘。",
                        "ART_ru_ft_B_j_3": "所有注单将按盘口开出的大/小盘球数在玩法的时节结束后结算。",
                        "ART_ru_ft_B_j_4": "大/小盘的玩法分为以下几种：",
                        "ART_ru_ft_B_j_4_1": "大/小于\'一球\'（如：2，3，4，等）",
                        "ART_ru_ft_B_j_4_2": "大/小于\'半球\'（如：1.5，2.5，3.5，等）",
                        "ART_ru_ft_B_j_4_3": "混合以上\'半球/一球\'的方式（如：1.5/2，2.5/3，3.5/4，等）",
                    
                        "ART_ru_ft_B_j_5": "如果赛事中断前已有明确结果并且之后没有任何显著会影响赛事结果的情况，大/小盘注单才会被结算。若遇到任何其他情况，注单将一律被取消。请参考以上范例：",
                        "ART_ru_ft_B_j_5_1": "范例1：会员投注大于2.5球：",
                        "ART_ru_ft_B_j_5_1_1": "赛事在比分2-1时中断。",
                        "ART_ru_ft_B_j_5_1_2": "尽管赛事中断，但因结果已经明确并且若之后有任何潜在进球将对盘口结算裁决没有影响，所有此会员注单结算为赢。",
                        "ART_ru_ft_B_j_5_2": "范例2：会员投注小于2.5球：",
                        "ART_ru_ft_B_j_5_2_1": "赛事在比分2-1时中断。",
                        "ART_ru_ft_B_j_5_2_2": "尽管赛事中断，但因结果已经明确并且若之后有任何潜在进球将对盘口结算裁决没有影响，所有此会员注单结算为输。",
                        "ART_ru_ft_B_j_5_3": "范例3：会员投注大于3.5球：",
                        "ART_ru_ft_B_j_5_3_1": "赛事在比分2-1时中断。",
                        "ART_ru_ft_B_j_5_3_2": "由于赛事在未有明确的结果能裁决会员的注单前中断，此会员的注单将被取消。",
                    
                        "ART_ru_ft_B_k": "进球: 大 / 小",
                        "ART_ru_ft_B_k_1": "所有上半场的投注将以上半场45分钟的赛果结算。",
                        "ART_ru_ft_B_k_2": "如果赛事在上半场时节因任何理由取消或中断，所有上半场注单将被取消。除非在赛事取消或中断前，结果已经明确。",
                    
                        "ART_ru_ft_B_l": "进球: 大 / 小 - 上半场",
                        "ART_ru_ft_B_l_1": "所有上半场的投注将以上半场45分钟的赛果结算。",
                        "ART_ru_ft_B_l_2": "如果赛事在上半场时节因任何理由取消或中断，所有上半场注单将被取消。除非在赛事取消或中断前，结果已经明确。",
                        "ART_ru_ft_B_l_3": "如果赛事在下半场或加时时段因任何理由取消或中断，所有上半场注单保持有效。",
                    
                        "ART_ru_ft_B_m": "滚球大小盘",
                        "ART_ru_ft_B_m_1": "结算是以比赛/时节结束后的总入球数做裁决。投注当时，赛事的比分将视为0-0来计算。",
                    
                        "ART_ru_ft_B_n": "加时赛 - 进球: 大 / 小",
                        "ART_ru_ft_B_n_1": "两支球队开始加时赛的比分为0-0，之前赛果属于常规时间内入球不会计算在内。",
                        "ART_ru_ft_B_n_2": "所有的投注将以30分钟加时赛后结果结算，包括补时。",
                        "ART_ru_ft_B_n_3": "在加时赛结束前如果比赛停止，取消或中断，所有投注将被视为无效，除非在赛事取消或中断前，结果已经明确。",
                    
                        "ART_ru_ft_B_o": "加时赛 - 进球: 大 / 小 - 上半场",
                        "ART_ru_ft_B_o_1": "所有投注将会按照15分钟赛事结束后赛果为准，包含补时。",
                        "ART_ru_ft_B_o_2": "如果比赛在上半场停止，取消或者中断，所有上半场注单将被视为无效。 ",
                        "ART_ru_ft_B_o_3": "如果比赛在下半场或补时期间停止，取消或者中断，所有上半场注单将被视为有效。",
                    
                        "ART_ru_ft_B_p": "球队进球数 - 大 / 小",
                        "ART_ru_ft_B_p_1": "预测在特定的比赛有关期间内，其中一支球队的总入球数将大于或小于在盘口指定的大/小盘球数。",
                        "ART_ru_ft_B_p_2": "如果赛事的总入球数多于盘口的大/小盘球数，则为大盘。如果少于盘口的大/小盘球数，则为小盘。",
                        "ART_ru_ft_B_p_3": "如果赛事中断前已有明确结果并且之后没有任何显著会影响赛事结果的情况，注单才会被结算。若遇到任何其他情况，注单将一律被取消。",
                    
                        "ART_ru_ft_B_q": "15 分钟盘口 (大 / 小)",
                        "ART_ru_ft_B_q_1": "预测赛事总入球数将大于或小于在盘口指定的大/小盘球数。",
                        "ART_ru_ft_B_q_2": "如果总进球数多于盘口的大/小盘牌数，则为大盘。如果少于盘口的大/小盘牌数，则为小盘。",
                        "ART_ru_ft_B_q_3": "在每个15分钟时开始，所有球队在开始此时节比赛都是0-0，之前的得分是没有影响的。",
                        "ART_ru_ft_B_q_4": "如果比赛被中断，所有将要进行的15分钟时段投注将被视为无效。任何15分钟时段投注，如果该时段中赛事进行完整，此注单将被视为有效。在15分钟时段中，如果赛事已有明确结果并且之后对赛事没有任何影响，总进球数大/小盘注单才会被结算。任何其他的情况，投注将被视为无效。",
                        "ART_ru_ft_B_td_q4_1_1": "15分钟-时段1",
                        "ART_ru_ft_B_td_q4_1_2": "上半场开始-14分59秒",
                        "ART_ru_ft_B_td_q4_2_1": "15分钟-时段2",
                        "ART_ru_ft_B_td_q4_2_2": "15分钟-29分59秒",
                        "ART_ru_ft_B_td_q4_3_1": "15分钟-时段3",
                        "ART_ru_ft_B_td_q4_3_2": "30分钟-半场结束",
                        "ART_ru_ft_B_td_q4_4_1": "15分钟-时段4",
                        "ART_ru_ft_B_td_q4_4_2": "下半场开始-59分59秒",
                        "ART_ru_ft_B_td_q4_5_1": "15分钟-时段5",
                        "ART_ru_ft_B_td_q4_5_2": "60分钟-74分59秒",
                        "ART_ru_ft_B_td_q4_6_1": "15分钟-时段6",
                        "ART_ru_ft_B_td_q4_6_2": "75分钟-全场结束",
                    
                        "ART_ru_ft_B_r": "加时赛 - 5 分钟进球数 (大 / 小)",
                        "ART_ru_ft_B_r_1": "预测赛事总入球数将大于或小于在盘口指定的大/小盘球数。",
                        "ART_ru_ft_B_r_2": "如果总进球数多于盘口的大/小盘牌数，则为大盘。如果少于盘口的大/小盘牌数，则为小盘。",
                        "ART_ru_ft_B_r_3": "在每个5分钟时开始，所有球队在开始此时节比赛都是0-0，之前的得分是没有影响的。",
                        "ART_ru_ft_B_r_4": "如果比赛被中断，所有将要进行的5分钟时段投注将被视为无效。任何5分钟时段投注，如果该时段中赛事进行完整，此注单将被视为有效。在5分钟时段中，如果赛事已有明确结果并且之后对赛事没有任何影响，总进球数大/小盘注单才会被结算。任何其他的情况，投注将被视为无效。",
                        "ART_ru_ft_B_td_r4_1_1": "5分钟-时段1",
                        "ART_ru_ft_B_td_r4_1_2": "上半场开始-04分59秒",
                        "ART_ru_ft_B_td_r4_2_1": "5分钟-时段2",
                        "ART_ru_ft_B_td_r4_2_2": "05分钟-09分59秒",
                        "ART_ru_ft_B_td_r4_3_1": "5分钟-时段3",
                        "ART_ru_ft_B_td_r4_3_2": "10分钟-半场结束",
                        "ART_ru_ft_B_td_r4_4_1": "5分钟-时段4",
                        "ART_ru_ft_B_td_r4_4_2": "下半场开始-19分59秒",
                        "ART_ru_ft_B_td_r4_5_1": "5分钟-时段5",
                        "ART_ru_ft_B_td_r4_5_2": "20分钟-24分59秒",
                        "ART_ru_ft_B_td_r4_6_1": "5分钟-时段6",
                        "ART_ru_ft_B_td_r4_6_2": "25分钟-全场结束",
                    
                        "ART_ru_ft_B_s": "1 X  2（独赢盘）",
                    
                        "ART_ru_ft_B_t": "一般规则",
                        "ART_ru_ft_B_t_1": "预测哪一支球队将在比赛胜出。盘口提供两支球队和平局为投注选项。",
                        "ART_ru_ft_B_t_2": "投注将以0-0的比分作为计算基础（让球并不计算在内）。",
                    
                        "ART_ru_ft_B_u": "独赢",
                        "ART_ru_ft_B_u_1": "预测哪一支球队将在90分钟比赛胜出或赛事和局。",
                    
                        "ART_ru_ft_B_v": "独赢 - 上半场",
                        "ART_ru_ft_B_v_1": "所有上半场的投注将以上半场45分钟赛果结算。",
                    
                        "ART_ru_ft_B_w": "滚球独赢",
                        "ART_ru_ft_B_w_1": "预测滚球时，哪一支球队胜出。",
                        "ART_ru_ft_B_w_2": "投注的结算将以90分钟完场赛果为准。",
                        "ART_ru_ft_B_w_3": "以下为滚球独赢盘范例。",
                        "ART_ru_ft_B_td_w3_1_1": " ",
                        "ART_ru_ft_B_td_w3_1_2": "目前得分",
                        "ART_ru_ft_B_td_w3_1_3": "赔率",
                        "ART_ru_ft_B_td_w3_2_1": "阿森纳（主）",
                        "ART_ru_ft_B_td_w3_2_2": "1",
                        "ART_ru_ft_B_td_w3_2_3": "1.61",
                        "ART_ru_ft_B_td_w3_3_1": "曼联",
                        "ART_ru_ft_B_td_w3_3_2": "0",
                        "ART_ru_ft_B_td_w3_3_3": "6.0",
                        "ART_ru_ft_B_td_w3_4_1": "和局",
                        "ART_ru_ft_B_td_w3_4_2": " ",
                        "ART_ru_ft_B_td_w3_4_3": "3.8",
                        "ART_ru_ft_B_w_3_1": "范例1：在赛事比分为阿森纳1-0曼联时，会员投注滚球独赢盘 – 阿森纳赢：",
                        "ART_ru_ft_B_w_3_1_1": "完场赛果为阿森纳2-1曼联。",
                        "ART_ru_ft_B_w_3_1_2": "因阿森纳在完场时胜出，所有投注阿森纳的注单结算为赢。",
                        "ART_ru_ft_B_w_3_1_3": "所有在比分1-0时投注曼联或平局的注单将结算为输。",
                        "ART_ru_ft_B_w_3_2": "范例2：在赛事比分为阿森纳1-0曼联时，会员投注滚球独赢盘 –曼联赢：",
                        "ART_ru_ft_B_w_3_2_1": "完场赛果为阿森纳1-1曼联。",
                        "ART_ru_ft_B_w_3_2_2": "因完场赛果为平局，所有投注曼联以及阿森纳的注单将结算为输。",
                        "ART_ru_ft_B_w_3_2_3": "所有投注平局的注单将结算为赢。",
                        "ART_ru_ft_B_w_4": "加时赛则视为一场新的赛事并且会开出加时赛盘口。投注将按加时赛时节的结果做结算。",
                    
                        "ART_ru_ft_B_x": "加时赛 - 独赢",
                        "ART_ru_ft_B_x_1": "预测哪一支球队将会在30分钟内胜出，或赛事平局，包含补时。",
                        "ART_ru_ft_B_x_2": "如果比赛在加时赛结束前暂停，取消或中止，所有投注将被视为无效。",
                    
                        "ART_ru_ft_B_y": "加时赛 - 独赢 - 上半场",
                        "ART_ru_ft_B_y_1": "预测哪一支球队将会在15分钟内胜出，或赛事平局，包含补时。",
                        "ART_ru_ft_B_y_2": "如果赛事在加时赛上半场取消或中断，所有上半场注单将会被取消。",
                        "ART_ru_ft_B_y_3": "如果赛事在加时赛下半场取消或中断，所有上半场注单将被会视为有效。",
                    
                        "ART_ru_ft_B_z": "15 分钟盘口 (独赢)",
                        "ART_ru_ft_B_z_1": "预测在规定时段内哪一支球队将会获胜，赛事盘口将会提供两支球队，以及和局。",
                        "ART_ru_ft_B_z_2": "所有两支球队在每时段开始时比分将按照0-0计算，之前比分不计算在内。",
                        "ART_ru_ft_B_z_3": "如果赛事中断，所有当前15分钟时段的投注以及将要进行的下一个15分钟时段投注将视为无效，任何15分钟时段投注，如果该时段完整结束，注单将被视为有效。",
                        "ART_ru_ft_B_td_z3_1_1": "15分钟-时段1",
                        "ART_ru_ft_B_td_z3_1_2": "上半场开始-14分59秒",
                        "ART_ru_ft_B_td_z3_2_1": "15分钟-时段2",
                        "ART_ru_ft_B_td_z3_2_2": "15分钟-29分59秒",
                        "ART_ru_ft_B_td_z3_3_1": "15分钟-时段3",
                        "ART_ru_ft_B_td_z3_3_2": "30分钟-半场",
                        "ART_ru_ft_B_td_z3_4_1": "15分钟-时段4",
                        "ART_ru_ft_B_td_z3_4_2": "下半场开始-59分59秒",
                        "ART_ru_ft_B_td_z3_5_1": "15分钟-时段5",
                        "ART_ru_ft_B_td_z3_5_2": "60分钟-74分59秒",
                        "ART_ru_ft_B_td_z3_6_1": "15分钟-时段6",
                        "ART_ru_ft_B_td_z3_6_2": "75分钟-全场结束",
                    
                        "ART_ru_ft_B_aa": "进球数 - 单 / 双",
                        "ART_ru_ft_B_aa_1": "进球数: 单 / 双",
                        "ART_ru_ft_B_aa_1_1": "预测90分钟内，赛事总入球对单或双。",
                        "ART_ru_ft_B_aa_1_2": "若最终比分为：0-0，将会按照‘双’来计算。",
                        "ART_ru_ft_B_aa_2": "进球数: 单 / 双 - 上半场",
                        "ART_ru_ft_B_aa_2_1": "预测45分钟赛事的总入球数是单数或双数。",
                        "ART_ru_ft_B_aa_2_2": "若最终比分为：0-0，将会按照‘双’来计算。",
                        "ART_ru_ft_B_aa_3": "加时赛 - 进球数: 单 / 双",
                        "ART_ru_ft_B_aa_3_1": "预测加时30分钟赛事的总入球数是单数或双数，包含补时。",
                        "ART_ru_ft_B_aa_3_2": "若最终比分为：0-0，将会按照‘双’来计算。",
                        "ART_ru_ft_B_aa_4": "加时赛 - 进球数: 单 / 双 -上半场",
                        "ART_ru_ft_B_aa_4_1": "预测加时赛15分钟内的总进球数是单数或双数，包括补时。",
                        "ART_ru_ft_B_aa_4_2": "若最终比分为：0-0，将会按照‘双’来计算。",
                    
                        "ART_ru_ft_B_aa_5": "15 分钟盘口 (单 / 双)",
                        "ART_ru_ft_B_aa_5_1": "预测在规定时间内进球数是单或双。",
                        "ART_ru_ft_B_aa_5_2": "所有两支球队在每时段开始时比分将按照0-0计算，之前比分不计算在内。",
                        "ART_ru_ft_B_aa_5_3": "如果赛事中断，所有当前15分钟时段的投注以及将要进行的下一个15分钟时段投注将视为无效，任何15分钟时段投注，如果该时段完整结束，注单将被视为有效。",
                        "ART_ru_ft_B_td_aa5_1_1": "15分钟-时段1",
                        "ART_ru_ft_B_td_aa5_1_2": "上半场开始-14分59秒",
                        "ART_ru_ft_B_td_aa5_2_1": "15分钟-时段2",
                        "ART_ru_ft_B_td_aa5_2_2": "15分钟-29分59秒",
                        "ART_ru_ft_B_td_aa5_3_1": "15分钟-时段3",
                        "ART_ru_ft_B_td_aa5_3_2": "30分钟-半场",
                        "ART_ru_ft_B_td_aa5_4_1": "15分钟-时段4",
                        "ART_ru_ft_B_td_aa5_4_2": "下半场开始-59分59秒",
                        "ART_ru_ft_B_td_aa5_5_1": "15分钟-时段5",
                        "ART_ru_ft_B_td_aa5_5_2": "60分钟-74分59秒",
                    
                        "ART_ru_ft_B_ab": "波胆",
                        "ART_ru_ft_B_ab_1": "预测一场特定赛事中相关时间段的准确比分。",
                        "ART_ru_ft_B_ab_2": "\"任何其他比分\"是指任何的比分，而不是一个市场选项列表类型。",
                    
                        "ART_ru_ft_B_ab_3": "波胆",
                        "ART_ru_ft_B_ab_3_1": "预测一场特定赛事的全场准确比分。",
                        "ART_ru_ft_B_ab_3_2": "全场波胆投注的结算根据90分钟完场比分做出裁决。",
                        "ART_ru_ft_B_ab_3_3": "如果注单在赛事中断前已得到明确的胜负，并且任何进一步的赛果均不会对注单结果产生影响的情况下，注单会被视为有效。",
                    
                        "ART_ru_ft_B_ab_4": "波胆 - 上半场",
                        "ART_ru_ft_B_ab_4_1": "预测一场特定赛事半场的准确比分。",
                        "ART_ru_ft_B_ab_4_2": "半场波胆投注是指投注上半场的比赛，投注的结算根据半场‘45分钟’结束后的比分做出裁决。",
                        "ART_ru_ft_B_ab_4_3": "如果注单在赛事中断前已得到明确的胜负，并且任何进一步的赛果均不会对注单结果产生影响的情况下，注单会被视为有效。",
                        "ART_ru_ft_B_ab_4_4": "如果赛事在下半场取消，所有半场波胆的投注被视为有效。",
                    
                        "ART_ru_ft_B_ac": "半场/全场",
                        "ART_ru_ft_B_ac_1": "预测赛事的半/全场结果。",
                    
                        "ART_ru_ft_B_ad": "净胜球数",
                        "ART_ru_ft_B_ad_1": "预测完场比赛结束后的净胜球数。",
                        "ART_ru_ft_B_ad_2": "投注的结算根据90分钟完场赛事比分的差别做裁决。",
                        "ART_ru_ft_B_ad_3": "比赛结束为平局将根据比分战平结算。",
                    
                        "ART_ru_ft_B_ae": "加时赛 - 净胜球数",
                        "ART_ru_ft_B_ae_1": "预测加时赛结束后的净胜球数。",
                        "ART_ru_ft_B_ae_2": "所有的投注将以30分钟加时赛后结果结算，包括补时。",
                        "ART_ru_ft_B_ae_3": "比赛结束为平局将根据比分战平结算。",
                    
                        "ART_ru_ft_B_af": "双重机会",
                        "ART_ru_ft_B_af_1": "在三种可能出现的赛果中选择两种进行投注; 主场赢或打平（1和X）, 客场赢或打平（2和X）或主场或客场赢（1和2）。",
                        "ART_ru_ft_B_af_2": "共有三种选择: 1 X, X 2, 1 2：",
                        "ART_ru_ft_B_af_2_1": "\"1\" 代表: 主场赢。",
                        "ART_ru_ft_B_af_2_2": "\"X\" 代表: 平手。",
                        "ART_ru_ft_B_af_2_3": "\"2\" 代表: 客场赢。",
                        "ART_ru_ft_B_af_3": "如果比赛在中立场进行﹐列在盘面的上方球队则被视为主队。",
                    
                        "ART_ru_ft_B_ag": "三项让球投注",
                        "ART_ru_ft_B_ag_1": "根据盘口开出信息预测最终获胜球队，包括和局以及第三个可能出现的结果。",
                        "ART_ru_ft_B_ag_2": "结算将会根据选择的球队包括和局，并最终在比赛中获得有利的结果。",
                        "ART_ru_ft_B_ag_3": "和局将会显示的主场让球盘， 用于区分作用",
                        "ART_ru_ft_B_ag_4": "选项可列为：",
                        "ART_ru_ft_B_ag_4_1": "主场[-1]=主场让一球半",
                        "ART_ru_ft_B_ag_4_2": "和局[-1]=主场净胜一球",
                        "ART_ru_ft_B_ag_4_3": "客场[+1]=客场受让半球",
                        "ART_ru_ft_B_ag_4_4": "主场[+2]=主场受让一球半",
                        "ART_ru_ft_B_ag_4_5": "和局[+2]=客场净胜二球",
                        "ART_ru_ft_B_ag_4_6": "客场[-2]=客场让二球半",
                    
                        "ART_ru_ft_B_ah": "落后反超获胜",
                        "ART_ru_ft_B_ah_1": "预测哪一支球队在比赛的任何时间里都为输，然而却在最后‘90分钟’反超为赢。",
                        "ART_ru_ft_B_ah_2": "选择的球队必须在比赛的任何时间里都为输，但是在接下来的最后‘90分钟’却获胜为赢。",
                        "ART_ru_ft_B_ah_3": "如果比赛被中断，所有的投注均视为无效。",
                    
                        "ART_ru_ft_B_ai": "平局退单",
                        "ART_ru_ft_B_ai_1": "预测哪一支球队将在比赛胜出。但若比赛结果为平局，所有投注将被取消。",
                    
                    
                        "ART_ru_ft_C": "进球集锦",
                        "ART_ru_ft_C_a": "总进球数",
                        "ART_ru_ft_C_a_1": "总进球数",
                        "ART_ru_ft_C_a_1_1": "预测全场两队的总入球数。",
                        "ART_ru_ft_C_a_1_2": "如果注单在赛事中断前已得到明确的胜负，并且任何进一步的赛果均不会对注单结果产生影响的情况下，注单会被视为有效。",
                        "ART_ru_ft_C_a_2": "总进球数 - 上半场",
                        "ART_ru_ft_C_a_1_1": "预测半场两队的总入球数。",
                        "ART_ru_ft_C_a_1_2": "如果注单在赛事中断前已得到明确的胜负，并且任何进一步的赛果均不会对注单结果产生影响的情况下，注单会被视为有效。",
                    
                        "ART_ru_ft_C_b": "单一球队总入球数",
                        "ART_ru_ft_C_b_1": "预测其中一支球队的总入球数。",
                        "ART_ru_ft_C_b_2": "如果赛事中断前，注单已得到明确结果并且之后没有任何显著会影响赛事结果的情况注单会有被结算  。若遇到任何其他情况，注单将一律被取消。",
                    
                        "ART_ru_ft_C_c": "最先/最后进球",
                        "ART_ru_ft_C_c_1": "在法定比赛90分钟内，预测最先或最后进球的球队。",
                        "ART_ru_ft_C_c_2": "乌龙球将予以计算为得分那方入球。比如: A队VS B队，B 队踢进一个乌龙球造成比分1-0，此球计为A队先进球。",
                        "ART_ru_ft_C_c_3": "如果赛事在有进球后中断，所有最先进球球队注单保持有效。",
                        "ART_ru_ft_C_c_4": "如果赛事中断，所有最后进球球队注单将被取消。",
                    
                        "ART_ru_ft_C_d": "X 进球 (下一个进球)",
                        "ART_ru_ft_C_d_1": "预测在比赛进行时，哪一支球队会进下一球。",
                        "ART_ru_ft_C_d_2": "加时赛则视为一场新的赛事并且会开出加时赛盘口。",
                        "ART_ru_ft_C_d_3": "乌龙球将予以计算为得分那方入球。例：A队VS B队，如A 队踢进一个乌龙球，此球计为B队的分数。",
                        "ART_ru_ft_C_d_4": "如果赛事在没有进球前中断或延后，所有注单将被取消。",
                    
                        "ART_ru_ft_C_e": "双方球队进球",
                        "ART_ru_ft_C_e_1": "预测双方球队在90分钟完场时间内是否进球。",
                        "ART_ru_ft_C_e_2": "如果赛事在双方球队都有进球后中断，所有注单保持有效。",
                        "ART_ru_ft_C_e_3": "如果赛事在没有进球前中断或延后，所有注单将被取消。",
                        "ART_ru_ft_C_e_4": "乌龙球将予以计算为得分那方入球。",
                    
                        "ART_ru_ft_C_f": "双方球队进球- 上半场",
                        "ART_ru_ft_C_f_1": "预测双方球队在第一个45分钟时间内是否进球。",
                        "ART_ru_ft_C_f_2": "如果赛事在上半场双方球队都有进球后中断，所有注单保持有效。",
                        "ART_ru_ft_C_f_3": "如果赛事在上半场双方球队没有进球前中断或延迟，所有注单将被取消。",
                        "ART_ru_ft_C_f_4": "乌龙球将予以计算为得分那方入球。",
                    
                        "ART_ru_ft_C_g": "双方球队进球- 下半场",
                        "ART_ru_ft_C_g_1": "预测双方球队在第二个45分钟时间内是否进球。",
                        "ART_ru_ft_C_g_2": "如果赛事在下半场双方球队都有进球后中断，所有注单保持有效。",
                        "ART_ru_ft_C_g_3": "如果赛事在下半场双方球队没有进球前中断或延迟，所有注单将被取消。",
                        "ART_ru_ft_C_g_4": "乌龙球将予以计算为得分那方入球。",
                    
                        "ART_ru_ft_C_h": "零失球",
                        "ART_ru_ft_C_h_1": "预测某个球队在90分钟的比赛中，没有任何进球。",
                        "ART_ru_ft_C_h_2": "选择投注球队不需要赢得比赛，例如：赛果 0-0，注单为赢。",
                    
                        "ART_ru_ft_C_i": "零失球获胜",
                        "ART_ru_ft_C_i_1": "预测您投注的球队在90分钟完场时间内没有失球及没让敌方攻入任何一球。",
                        "ART_ru_ft_C_i_2": "\'无失球\'是指球队在赛事中没让敌方攻入任何一球，争取完美防守。",
                    
                        "ART_ru_ft_C_j": "先进2球/3球的一方",
                        "ART_ru_ft_C_j_1": "预测在90分钟完场时间内哪个球队先进2/3球。",
                        "ART_ru_ft_C_j_2": "如果赛事在一方球队已经进2/3球后中断，所有注单将保持有效。",
                        "ART_ru_ft_C_j_3": "如果所选球队没有进球，则将被视为本注单为输。",
                    
                        "ART_ru_ft_C_k": "最多进球的半场",
                        "ART_ru_ft_C_k_1": "在赛事90分钟结束后，猜测哪个‘45分钟’半场入球最多。",
                        "ART_ru_ft_C_k_2": "盘口提供两种投注选择，如上下半场入球数一样，注单将被视为无效。",
                        "ART_ru_ft_C_k_3": "选项可列为：",
                        "ART_ru_ft_C_k_3_1": "上半场",
                        "ART_ru_ft_C_k_3_2": "下半场",
                    
                        "ART_ru_ft_C_l": "最多进球的半场 - 独赢",
                        "ART_ru_ft_C_l_1": "预测在90分钟完场时间内哪个半场将会进最多球。",
                        "ART_ru_ft_C_l_2": "盘口提供三种投注选择，如上下半场入球数一样，投注‘和’将会为赢。",
                        "ART_ru_ft_C_l_3": "选项可列为：",
                        "ART_ru_ft_C_l_3_1": "上半场",
                        "ART_ru_ft_C_l_3_2": "下半场",
                        "ART_ru_ft_C_l_3_3": "平局",
                    
                        "ART_ru_ft_C_m": "双半场进球",
                        "ART_ru_ft_C_m_1": "预测主队/客队在90分钟完场时间内是否在上下半场都至少进一球。",
                        "ART_ru_ft_C_m_2": "如果投注球队只有在一个半场有入球，或未入球，注单为输。",
                        "ART_ru_ft_C_m_3": "乌龙球将只会被计算在得分球队一方。",
                        "ART_ru_ft_C_m_4": "如果赛事在所投注的球队已在两个半场都进球后中断，所有投注此球队的注单将结算为赢。",
                        "ART_ru_ft_C_m_5": "如果赛事在下半场中断，并且所投注的球队并未在上半场进球，所有投注此球队的注单将结算为输。",
                        "ART_ru_ft_C_m_6": "如果上半场进球球队已经确认，而赛事在下半场中断，那么所有投注该球队注单将被视为有效。",
                    
                        "ART_ru_ft_C_n": "首个进球方式",
                        "ART_ru_ft_C_n_1": "预测首个进球的方式。",
                        "ART_ru_ft_C_n_2": "如果赛事在首个进球后中断，所有首个进球方式的注单将保持有效。",
                        "ART_ru_ft_C_n_3": "选项可列为：",
                        "ART_ru_ft_C_n_3_1": "任意球：球必须是直接踢进的方式。间接性的任意球如果最后是罚球者本人踢进则计算在内。",
                        "ART_ru_ft_C_n_3_2": "点球：球必须是由罚球者本人直接踢进的方式。若遇到补射的情况，即使是罚球者本人踢进也将不计算在内。",
                        "ART_ru_ft_C_n_3_3": "乌龙球：球必须授予为乌龙球。",
                        "ART_ru_ft_C_n_3_4": "头球：进球者必须明确的用头进球。",
                        "ART_ru_ft_C_n_3_5": "射门：所有其他的进球方式。除了以上所列出的方式，所有其他进球的方式都包含在此方式。",
                        "ART_ru_ft_C_n_3_6": "没有进球：赛事没有进球。",
                    
                        "ART_ru_ft_C_o": "首个进球时间-3项",
                        "ART_ru_ft_C_o_1": "预测在90分钟完场时间内首个进球时间，盘口提供无进球投注选项。",
                        "ART_ru_ft_C_o_2": "选项可列为：",
                        "ART_ru_ft_C_td_o2_1_1": "选项 1",
                        "ART_ru_ft_C_td_o2_1_2": "小于等于26分钟",
                        "ART_ru_ft_C_td_o2_2_1": "选项 2",
                        "ART_ru_ft_C_td_o2_2_2": "大于或等于27分钟",
                        "ART_ru_ft_C_td_o2_3_1": "选项 3",
                        "ART_ru_ft_C_td_o2_3_2": "没有进球",
                        "ART_ru_ft_C_o_3": "出于结算的用意，赛事的第一分钟是从1秒计算到59秒。第二分钟则是从1分钟计算到1分59秒，以此类推。",
                        "ART_ru_ft_C_o_4": "范例：如果投注首个进球时间的选项是‘赛事的第26分钟或之前’，而确实进球的时间为26分钟49秒，进球的范围属于’第27分钟后’，因此投注将结算为输。",
                        "ART_ru_ft_C_o_5": "如果赛事在首个进球后中断，所有首个进球时间的注单将保持有效。",
                        "ART_ru_ft_C_o_6": "如果赛事在没有进球前中断，所有首个进球时间的注单将被取消。",
                        "ART_ru_ft_C_o_7": "乌龙球将予以计算在内。裁判判定无效的进球是将不予以计算在内。",
                    
                        "ART_ru_ft_C_p": "首个进球时间",
                        "ART_ru_ft_C_p_1": "预测在90分钟完场时间内首个进球时间。",
                        "ART_ru_ft_C_p_2": "选项可列为：",
                        "ART_ru_ft_c_td_p2_1_1": "15分钟-时段1",
                        "ART_ru_ft_c_td_p2_1_2": "上半场开始-14分59秒",
                        "ART_ru_ft_c_td_p2_2_1": "15分钟-时段2",
                        "ART_ru_ft_c_td_p2_2_2": "15分钟-29分59秒",
                        "ART_ru_ft_c_td_p2_3_1": "15分钟-时段3",
                        "ART_ru_ft_c_td_p2_3_2": "30分钟-半场",
                        "ART_ru_ft_c_td_p2_4_1": "15分钟-时段4",
                        "ART_ru_ft_c_td_p2_4_2": "下半场开始-59分59秒",
                        "ART_ru_ft_c_td_p2_5_1": "15分钟-时段5",
                        "ART_ru_ft_c_td_p2_5_2": "60分钟-74分59秒",
                        "ART_ru_ft_c_td_p2_6_1": "15分钟-时段6",
                        "ART_ru_ft_c_td_p2_6_2": "75分钟-全场结束",
                        "ART_ru_ft_C_p_3": "出于结算的用意，赛事的第一分钟是从1秒计算到59秒。第二分钟则是从1分钟计算到1分59秒，以此类推。",
                        "ART_ru_ft_C_p_4": "如果赛事在首个进球后中断，所有首个进球时间的注单将保持有效。",
                        "ART_ru_ft_C_p_5": "如果赛事在没有进球前中断，所有首个进球时间的注单将被取消。",
                        "ART_ru_ft_C_p_6": "乌龙球将予以计算在内。裁判判定无效的进球是将不予以计算在内。",
                    
                        "ART_ru_ft_C_q": "乌龙球",
                        "ART_ru_ft_C_q_1": "预测一场比赛中是否会有乌龙球。",
                        "ART_ru_ft_C_q_2": "根据双方球队上场球员是否踢进乌龙球，来进行结算。",
                        "ART_ru_ft_C_q_3": "如果比赛在有乌龙球之前中断，所有该盘口的投注将被视为无效",
                    
                    
                        "ART_ru_ft_D": "球员",
                        "ART_ru_ft_D_a": "一般规则（第一/最后/任何时间进球得分）",
                        "ART_ru_ft_D_a_1": "“其他”选项是指在官方“90分钟”比赛内没有标注的进球数（不包括乌龙球）",
                        "ART_ru_ft_D_a_2": "\'没有进球\'的选项是指两队在官方“90分钟”内（即全场0-0）打入0球。",
                    
                        "ART_ru_ft_D_b": "最先进球球员",
                        "ART_ru_ft_D_b_1": "按盘口提供的球员出场名单中，预测在90分钟完场时间内最先入球的球员。",
                        "ART_ru_ft_D_b_2": "乌龙球不计于最先进的球。如果出现乌龙球，下一个或之前的进球才被视为有效。",
                        "ART_ru_ft_D_b_3": "如果赛事唯一的进球是乌龙球，盘口上\"其他\"的选项将结算为赢。",
                        "ART_ru_ft_D_b_4": "如果投注的最先进球球员没有参与该场赛事或在第一个进球后才进场，注单将被取消。",
                        "ART_ru_ft_D_b_5": "如果投注的最先进球球员在没有射入第一个球就被罚下场或被其他球员替代，注单将结算为输。",
                        "ART_ru_ft_D_b_6": "如果赛事在射入第一个球后中断，所有投注最先进球球员的注单将保持有效。",
                        "ART_ru_ft_D_b_7": "如果赛事在没有进球前中断，所有投注最先进球球员的注单将被取消。",
                    
                        "ART_ru_ft_D_c": "最后进球球员",
                        "ART_ru_ft_D_c_1": "按盘口提供的球员出场名单中，预测在90分钟完场时间内最后入球的球员。",
                        "ART_ru_ft_D_c_2": "乌龙球将不会被视为最后进球。如果出现乌龙球，下一个或之前的进球才被视为有效。",
                        "ART_ru_ft_D_c_3": "如果赛事唯一的进球是乌龙球，盘口上\"其他\"的选项将结算为赢",
                        "ART_ru_ft_D_c_4": "如果投注的最后进球球员在没有射入最后一个进球就被罚下场或被其他球员替代，注单将结算为输",
                        "ART_ru_ft_D_c_5": "任何参赛并且上场的球员都可能是最后进球球员。",
                        "ART_ru_ft_D_c_6": "如果赛事在没有进球前中断，所有投注最后进球球员的注单将被取消。",
                    
                        "ART_ru_ft_D_d": "任何时间进球球员",
                        "ART_ru_ft_D_d_1": "按盘口提供的球员出场名单中，预测在90分钟完场时间内哪位球员会进球。",
                        "ART_ru_ft_D_d_2": "如果投注的球员没有参与该场赛事，注单将被取消。",
                        "ART_ru_ft_D_d_3": "只要球员在比赛的90分钟完场时间内有上场参与比赛，注单则视为有效。",
                        "ART_ru_ft_D_d_4": "如果赛事在已有球员进球后中断，所有投注进球球员的注单将保持有效。",
                        "ART_ru_ft_D_d_5": "如果比赛被取消，所有投注在提名的球员的进球均视作无效。然而，如果提名的球员在比赛取消前被红卡罚下，那么所有与该球员相关的投注注单将视作输来结算。",
                        "ART_ru_ft_D_d_6": "乌龙球，加时赛进球和点球都不计于此玩法。",
                    
                        "ART_ru_ft_D_e": "球员特殊投注(进球数)",
                        "ART_ru_ft_D_f": "一般规则",
                        "ART_ru_ft_D_f_1": "上半场投注在45分钟进行。",
                        "ART_ru_ft_D_f_2": "全场投注在90分钟结算。",
                        "ART_ru_ft_D_f_3": "双方球员都必须是比赛先发的11名球员当中注单才视为有效。",
                        "ART_ru_ft_D_f_4": "提供的盘口仅限于球员将参与的指定比赛以及比赛日期。",
                        "ART_ru_ft_D_f_5": "乌龙球将不计算在内。",
                    
                        "ART_ru_ft_D_g": "让球",
                        "ART_ru_ft_D_g_1": "根据盘口开出信息预测哪一个球员入球最多。",
                        "ART_ru_ft_D_g_2": "如果赛事中断或推迟，所有注单将会被取消，除非赛事已有明确结果并且之后入球对赛事没有任何影响。除非赛事已有明确结果并且之后入球对赛事没有任何影响。",
                    
                        "ART_ru_ft_D_h": "大 / 小",
                        "ART_ru_ft_D_h_1": "预测赛事中不同球员总进球数将大于或小于在盘口指定的大/小盘数。",
                        "ART_ru_ft_D_h_2": "如果赛事中断或推迟，所有注单将会被取消，除非赛事已有明确结果并且之后入球对赛事没有任何影响。",
                    
                        "ART_ru_ft_D_i": "独赢",
                        "ART_ru_ft_D_i_1": "预测哪一个球员将在比赛中入球最多，盘口同样提供选择\"平局/和\"。",
                        "ART_ru_ft_D_i_2": "如果赛事中断或推迟，所有注单将会被取消，除非赛事已有明确结果并且之后入球对赛事没有任何影响。",
                    
                        "ART_ru_ft_D_j": "单 / 双",
                        "ART_ru_ft_D_j_1": "预测赛事中球员的总进球数是单数或双数。",
                        "ART_ru_ft_D_j_2": "如果赛事中断或推迟，所有注单将会被取消，除非赛事已有明确结果并且之后入球对赛事没有任何影响。",
                        "ART_ru_ft_D_j_3": "若比赛没有球员进球，赛果为0，投注’双’注单为赢。",
                    
                    
                        "ART_ru_ft_E": "特别",
                        "ART_ru_ft_E_a": "开球球队",
                        "ART_ru_ft_E_a_1": "预测在比赛先开球的球队。",
                        "ART_ru_ft_E_a_2": "如果赛事在开踢后中断，所有投注先开球球队的注单将保持有效。",
                    
                        "ART_ru_ft_E_b": "胜出方法",
                        "ART_ru_ft_E_b_1": "预测哪一支球队能在球赛中指定的时段内赢得比赛。",
                        "ART_ru_ft_E_b_2": "根据指定的球队能否在指定的时段内赢得比赛，来进行结算。时段可分为：“90分钟”，加时赛或点球大战。",
                    
                        "ART_ru_ft_E_c": "晋级方法",
                        "ART_ru_ft_E_c_1": "预测哪一支球队能在球赛中指定的时段内赢得比赛，从而晋级到联赛的下一阶段。",
                        "ART_ru_ft_E_c_2": "根据指定的球队能否在指定的时段内赢得比赛，来进行结算。时段可以选择：“90分钟”，加时赛或点球大战。",
                        "ART_ru_ft_E_c_3": "一场比赛的两个回合的总比分（包括客场进球规则）将计入“90分钟”结束的结算。",
                    
                        "ART_ru_ft_E_d": "赢得所有半场",
                        "ART_ru_ft_E_d_1": "预测选择的球队在90分钟完场时间内（不包括加时赛及点球赛）是否在上半场和下半场的进球数多于对手。",
                        "ART_ru_ft_E_d_2": "如果赛事中断，所有注单将被取消。",
                        "ART_ru_ft_E_d_3": "如果任何一个半场或上/下半场的结果是平局或没有进球，所有注单将结算为输。",
                    
                        "ART_ru_ft_E_e": "赢得任一半场",
                        "ART_ru_ft_E_e_1": "预测选择的球队在90分钟完场时间内（不包括加时赛及点球赛）是否在上/下半场的其中一个半场进球数多于对手。",
                        "ART_ru_ft_E_e_2": "如果赛事在下半场中断，但在上半场其中一方球队已经获胜，注单将保持有效。如果两支球队在上半场平局，注单将被取消。",
                        "ART_ru_ft_E_e_3": "如果赛事出现平局或上下半场均无进球，所有注单将视为输。如双方球队各赢半场，则投注两个球队注单为赢。",
                    
                        "ART_ru_ft_E_f": "射正次数",
                        "ART_ru_ft_E_f_1": "预测在90分钟完场时间内两个球队标射正次数。",
                        "ART_ru_ft_E_f_2": "注单的结算将根据官方赛果或赛事权威机构判定的结果为准。",
                    
                        "ART_ru_ft_E_g": "上半场 – 第一个行动",
                        "ART_ru_ft_E_g_1": "预测在45分钟完场时间内完成一系列的第一个行动。",
                        "ART_ru_ft_E_g_2": "选项有分为：任意球，球门球，界外球，越位，进球，罚牌和等等。",
                        "ART_ru_ft_E_g_3": "如果赛事在上半场中断，所有注单将被视为无效，除了第一个行动注单已有结果。如果赛事在下半场中断，所有上半场投注将会被视为有效。",
                        "ART_ru_ft_E_g_4": "全部的单子会依据赛事的官方数据结算。",
                    
                        "ART_ru_ft_E_h": "下半场 – 第一个行动",
                        "ART_ru_ft_E_h_1": "预测在第二段的45分钟完场时间内完成一系列的第一个行动。",
                        "ART_ru_ft_E_h_2": "选项有分为：任意球，球门球，界外球，越位，进球，罚牌和等等。",
                        "ART_ru_ft_E_h_3": "如果赛事在下半场中断，所有注单将被视为无效，除了第一个行动注单已有结果。",
                        "ART_ru_ft_E_h_4": "全部的单子会依据赛事的官方数据结算。",
                    
                        "ART_ru_ft_E_i": "半场伤停补时时间预测",
                        "ART_ru_ft_E_i_1": "预测半场结束伤停补时具体时间。",
                        "ART_ru_ft_E_i_2": "所有注单结算将会按照半场结束后第四裁判举牌补时的时间为准。",
                        "ART_ru_ft_E_i_3": "预测伤停补时时间，只计算在官方正常90分钟赛事内的补时，加时赛将不包含在内。",
                    
                        "ART_ru_ft_E_j": "上半场伤停补时大/小",
                        "ART_ru_ft_E_j_1": "预测上半场官方时间45分钟后的伤停补时时间。",
                        "ART_ru_ft_E_j_2": "如果补时总时间，多于盘口的大/小盘时间，则为大盘。如果少于盘口的大/小盘时间，则为小盘。",
                        "ART_ru_ft_E_j_3": "所有注单结算将会按照第四裁判举牌补时时间为准，在赛事正常45分钟结束后确定的补时时间。",
                        "ART_ru_ft_E_j_4": "如果赛事在官方时间45分钟之内中断，所有投注上半场伤停补时注单将会取消。",
                        "ART_ru_ft_E_j_5": "如果赛事是在上半场比赛确认结束后中断，所有投注上半场伤停补时将会被视为有效的。",
                    
                        "ART_ru_ft_E_k": "下半场伤停补时大/小",
                        "ART_ru_ft_E_k_1": "预测下半场的伤停补时时间。",
                        "ART_ru_ft_E_k_2": "如果补时总时间，多于盘口的大/小盘时间，则为大盘。如果少于盘口的大/小盘时间，则为小盘。",
                        "ART_ru_ft_E_k_3": "所有注单结算将会按照第四裁判举牌补时时间为准，在赛事正常90分钟结束后确定的补时时间。",
                        "ART_ru_ft_E_k_4": "如果赛事在官方时间90分钟之内中断，所有投注下半场伤停补时注单将会取消。",
                    
                        "ART_ru_ft_E_l": "双半场总伤停补时 — 大/小",
                        "ART_ru_ft_E_l_1": "预测上半场和下半场的伤停补时时间。",
                        "ART_ru_ft_E_l_2": "一旦赛事在官方时间90分钟完成，总伤停补时将会以上半场和下半场伤停补时之和为结果。",
                        "ART_ru_ft_E_l_3": "如果伤停补时时间多于盘口的大/小盘时间，则为大盘；如果少于盘口的大/小盘时间，则为小盘。",
                        "ART_ru_ft_E_l_4": "如果赛事在官方时间90分钟之内中断，所有投注双半场总伤停补时的注单将会取消。",
                    
                    
                        "ART_ru_ft_F": "角球",
                        "ART_ru_ft_F_a": "角球：一般规则",
                        "ART_ru_ft_F_a_1": "被裁定但并未实际执行的角球将不予以计算在内。",
                        "ART_ru_ft_F_a_2": "注单的结算将根据官方赛果或赛事权威机构判定的结果为准。",
                        "ART_ru_ft_F_a_3": "如果角球需重新进行(例如，在禁区内犯规)，重新进行的角球仍计为同一个角球。",
                    
                        "ART_ru_ft_F_b": "角球：让球",
                        "ART_ru_ft_F_b_1": "预测在90分钟完场时间内哪一支球队在盘口指定的让球数获得最多角球。",
                        "ART_ru_ft_F_b_2": "所有注单将按盘口开出的让球数在玩法的时节结束后结算。",
                    
                        "ART_ru_ft_F_c": "角球: 让球 - 上半场",
                        "ART_ru_ft_F_c_1": "预测在45分钟完场时间内哪一支球队在盘口指定的让球数获得最多角球。",
                        "ART_ru_ft_F_c_2": "所有注单将按盘口开出的让球数在玩法的时节结束后结算。",
                    
                        "ART_ru_ft_F_d": "角球: 大/小",
                        "ART_ru_ft_F_d_1": "预测在90分钟后完成时间内（包括伤停补时）总获得的角球将大于或小于在盘口指定的大/小盘球数。",
                        "ART_ru_ft_F_d_2": "如果赛事获得的总角球数多于盘口的大/小盘球数，则为大盘。如果少于盘口的大/小盘球数，则为小盘。",
                        "ART_ru_ft_F_d_3": "如果赛事中断前已有明确结果并且之后没有任何显著会影响投注结果的情况，角球的大/小盘注单才会被结算。若遇到任何其他情况，注单将一律被取消。",
                    
                        "ART_ru_ft_F_e": "角球: 大 / 小 - 上半场",
                        "ART_ru_ft_F_e_1": "预测在45分钟后完成时间内总获得的角球将大于或小于在盘口指定的大/小盘球数。",
                        "ART_ru_ft_F_e_2": "如果赛事获得的总角球数多于盘口的大/小盘球数，则为大盘。如果少于盘口的大/小盘球数，则为小盘。",
                        "ART_ru_ft_F_e_3": "如果赛事在上半场中断，所有注单将被视为无效，除非赛事已有明确结果并且之后角球对赛事没有任何影响。",
                        "ART_ru_ft_F_e_4": "如果赛事在下半场中断，所有投注上半场角球大/小盘将会被视为有效。",
                    
                        "ART_ru_ft_F_f": "角球：独赢",
                        "ART_ru_ft_F_f_1": "预测哪一支球队将在90分钟比赛内获得更多角球数，盘口提供两支球队和平局为投注选项。",
                        "ART_ru_ft_F_f_2": "如果赛事中断前已有明确结果并且之后角球对赛事没有任何影响，总角球数独赢盘注单将会被结算。若遇到任何其他情况，注单将一律被取消。",
                    
                        "ART_ru_ft_F_g": "角球: 独赢 - 上半场",
                        "ART_ru_ft_F_g_1": "预测哪一支球队将在45分钟比赛内获得更多角球数，盘口提供两支球队和平局为投注选项。",
                        "ART_ru_ft_F_g_2": "如果赛事在上半场中断，所有注单将被视为无效，除非赛事已有明确结果并且之后角球对赛事没有任何影响。",
                        "ART_ru_ft_F_g_3": "如果赛事在下半场中断，所有投注上半场角球独赢盘将会被视为有效。",
                    
                        "ART_ru_ft_F_h": "角球: 单 / 双",
                        "ART_ru_ft_F_h_1": "预测90分钟内赛事的总角球数是单数或双数。",
                        "ART_ru_ft_F_h_2": "若比赛没有角球，结果为0，投注’双’注单将会盈利。",
                        "ART_ru_ft_F_h_3": "如果赛事在上半场中断，所有注单将被视为无效，除非赛事已有明确结果并且之后角球对赛事没有任何影响。",
                    
                        "ART_ru_ft_F_i": "角球: 单 / 双 - 上半场",
                        "ART_ru_ft_F_i_1": "预测45分钟内赛事的总角球数是单数或双数。",
                        "ART_ru_ft_F_i_2": "如果赛事在上半场中断，所有注单将被视为无效，除非赛事已有明确结果并且之后角球对赛事没有任何影响。",
                        "ART_ru_ft_F_i_3": "如果赛事在下半场中断，所有投注上半场角球单/双盘将会被视为有效。",
                    
                        "ART_ru_ft_F_j": "最先/最后角球",
                        "ART_ru_ft_F_j_1": "预测在90分钟完场时间内，第一或最后获得角球的球队。",
                        "ART_ru_ft_F_j_2": "如果赛事在获得第一个角球后中断，所有第一个角球的注单将保持有效。",
                        "ART_ru_ft_F_j_3": "如果赛事中断，所有最后一个角球的注单将被取消。",
                        "ART_ru_ft_F_j_4": "如果赛事并没有获得角球，所有第一和最后一个角球的注单将被取消。",
                    
                        "ART_ru_ft_F_k": "最多角球的半场",
                        "ART_ru_ft_F_k_1": "预测在90分钟完场时间内哪个半场将会获得最多角球。",
                        "ART_ru_ft_F_k_2": "如果赛事中断前已有明确结果并且之后没有任何显著会影响赛事结果的情况，注单才会被结算。若遇到任何其他情况，注单将一律被取消。",
                    
                        "ART_ru_ft_F_l": "角球 - X角球",
                        "ART_ru_ft_F_l_1": "预测哪支球队将踢进指定的角球。",
                        "ART_ru_ft_F_l_2": "指定角球将提前提供一个或多个选择，例如，第四个角球或第四和第五个角球（各自为独立盘口）。",
                        "ART_ru_ft_F_l_3": "重踢的角球将只计算为一次。",
                        "ART_ru_ft_F_l_4": "如果在踢出指定的角球之前比赛中断，该角球的投注将被视为无效。所有比赛中断之前记录的角球将视为有效。",
                    
                        "ART_ru_ft_F_m": "首个角球时间",
                        "ART_ru_ft_F_m_1": "预测获得首个角球的时间。",
                        "ART_ru_ft_F_m_2": "选项可列为：",
                        "ART_ru_ft_F_m_2_1": "赛事的第8分钟或之前。",
                        "ART_ru_ft_F_m_2_2": "第9分钟后。",
                        "ART_ru_ft_F_m_3": "出于结算的用意，赛事的第一分钟是从1秒计算到59秒。第二分钟则是从1分钟计算到1分59秒，以此类推。",
                        "ART_ru_ft_F_m_4": "范例：如果投注首个角球时间的选项是’赛事的第8分钟或之前’，而确实踢角球的时间为8分钟49秒，踢角球时间的范围属于’第9分钟后’，因此投注将结算为输。",
                        "ART_ru_ft_F_m_5": "如果赛事在获得第一个角球后中断，所有首个角球时间的注单将保持有效。",
                        "ART_ru_ft_F_m_6": "如果赛事在没有获得角球前中断，所有首个角球时间的注单将被取消。",
                        "ART_ru_ft_F_m_7": "如果在90分钟完场时间内并未获得角球，所有首个角球时间的注单将被取消。",
                        "ART_ru_ft_F_m_8": "如果首个角球需重新进行，那首个角球时间将以重新进行的角球时间为准。",
                    
                        "ART_ru_ft_F_n": "15分钟角球数",
                        "ART_ru_ft_F_n_1": "依照以上主要市场陈列的15分钟规则，预测哪队将在让球，独赢，大小或单双盘口取得胜利。",
                    
                        "ART_ru_ft_F_o": "角球 - 双重机会",
                        "ART_ru_ft_F_o_1": "在三种可能出现的赛果中选择两种进行投注; 主场赢或打平（1和X）, 客场赢或打平（2和X）或主场或客场赢（1和2）。",
                        "ART_ru_ft_F_o_2": "共有三种选择: 1 X, X 2, 1 2：",
                        "ART_ru_ft_F_o_2_1": "\"1\" 代表: 主场赢。",
                        "ART_ru_ft_F_o_2_2": "\"X\" 代表: 平手。",
                        "ART_ru_ft_F_o_2_3": "\"2\" 代表: 客场赢。",
                    
                    
                        "ART_ru_ft_G": "牌/卡",
                        "ART_ru_ft_G_a": "罚牌：一般规则",
                        "ART_ru_ft_G_a_1": "针对非球员（例如：教练，没有比赛中替补出场的替补球员，管理人员等等）出示的任何罚牌将不计算在内。",
                        "ART_ru_ft_G_a_2": "黄卡将占1分，红卡占2分。如果球员获发两张黄卡，此球员所获发的总罚牌数将计算为黄卡占1分以及红卡占2分，总分三分。（单场赛事每个球员最高可计3分）",
                        "ART_ru_ft_G_a_3": "注单的结算将根据官方赛果或赛事权威机构判定的结果为准。",
                    
                        "ART_ru_ft_G_b": "罚牌数: 让球",
                        "ART_ru_ft_G_b_1": "预测在90分钟完场时间内哪一支球队根据盘口让牌信息获发最多罚牌。",
                        "ART_ru_ft_G_b_2": "所有注单将按盘口开出让牌信息，在相应投注类型结束后结算。",
                    
                        "ART_ru_ft_G_c": "罚牌数: 让球 - 上半场",
                        "ART_ru_ft_G_c_1": "预测在45分钟完场时间内哪一支球队在盘口指定的让球数获发最多罚牌。",
                        "ART_ru_ft_G_c_2": "所有注单将按盘口开出的让球数在玩法的时节结束后结算。",
                    
                        "ART_ru_ft_G_d": "罚牌数: 大 / 小",
                        "ART_ru_ft_G_d_1": "预测在90分钟比赛结束后总出示的罚牌数将大于或小于在盘口指定的大/小盘牌数。",
                        "ART_ru_ft_G_d_2": "如果出示的总罚牌数多于盘口的大/小盘牌数，则为大盘。如果少于盘口的大/小盘牌数，则为小盘。",
                        "ART_ru_ft_G_d_3": "如果赛事中断前已有明确结果并且之后没有任何显著会影响投注结果的情况，总罚牌的大/小盘注单才会被结算。若遇到任何其他情况，注单将一律被取消。",
                    
                        "ART_ru_ft_G_e": "罚牌数: 大 / 小 - 上半场",
                        "ART_ru_ft_G_e_1": "预测在半场\"45分钟\"比赛结束后总出示的罚牌将大于或小于在盘口指定的大/小盘牌数。",
                        "ART_ru_ft_G_e_2": "如果出示的总罚牌数多于盘口的大/小盘牌数，则为大盘。如果少于盘口的大/小盘牌数，则为小盘。",
                        "ART_ru_ft_G_e_3": "如果赛事在上半场中断，所有注单将会被取消，除非赛事已有明确结果并且之后罚牌对赛事没有任何影响。",
                        "ART_ru_ft_G_e_4": "如果赛事在下半场中断，那么所有投注上半场注单均视为有效。",
                    
                        "ART_ru_ft_G_f": "罚牌数: 独赢",
                        "ART_ru_ft_G_f_1": "预测哪一支球队将在90分钟比赛内获得最多罚牌，盘口提供两支球队和平局为投注选项。",
                        "ART_ru_ft_G_f_2": "如果赛事中断，所有注单将会被取消，除非赛事已有明确结果并且之后罚牌对赛事没有任何影响。",
                    
                        "ART_ru_ft_G_g": "罚牌数: 独赢 - 上半场",
                        "ART_ru_ft_G_g_1": "预测哪一支球队将在45分钟比赛内获得最多罚牌，盘口提供两支球队和平局为投注选项。",
                        "ART_ru_ft_G_g_2": "如果赛事在上半场中断，所有注单将会被取消，除非赛事已有明确结果并且之后罚牌对赛事没有任何影响。",
                        "ART_ru_ft_G_g_3": "如果赛事在下半场中断，那么所有投注上半场注单均视为有效。",
                    
                        "ART_ru_ft_G_h": "罚牌数: 单 / 双",
                        "ART_ru_ft_G_h_1": "预测90分钟内赛事的总罚牌数是单数或双数。",
                        "ART_ru_ft_G_h_2": "如果赛事中断，所有注单将会被取消，除非赛事已有明确结果并且之后罚牌对赛事没有任何影响。",
                        "ART_ru_ft_G_h_3": "如无红、黄牌出现，即’0’，此局可视为平局。",
                    
                        "ART_ru_ft_G_i": "罚牌数: 单 / 双 - 上半场",
                        "ART_ru_ft_G_i_1": "预测45分钟内赛事的总罚牌数是单数或双数。",
                        "ART_ru_ft_G_i_2": "如果赛事在上半场中断，所有注单将会被取消，除非赛事已有明确结果并且之后罚牌对赛事没有任何影响。",
                        "ART_ru_ft_G_i_3": "如果赛事在下半场中断，那么所有投注上半场注单均视为有效。",
                        "ART_ru_ft_G_i_4": "如无红、黄牌出现，即’0’，此局可视为平局。",
                    
                        "ART_ru_ft_G_j": "第一张/最后一张罚牌",
                        "ART_ru_ft_G_j_1": "预测在90分钟完场时间内主队或客队里的球员是否会收到首个或最后一个罚牌（黄卡或红卡）。",
                        "ART_ru_ft_G_j_2": "如果两位或以上球员因一个事件获发罚牌，首先被裁判员出示黄卡或红卡的球员，将被视为\"优胜者\"为注单进行结算。",
                        "ART_ru_ft_G_j_3": "针对非球员（例如：教练，没有比赛中替补出场的替补球员，管理人员等等）出示的任何罚牌将不计算在内。",
                        "ART_ru_ft_G_j_4": "如果赛事在出示首个罚牌后中断，所有首个罚牌的注单将保持有效。",
                        "ART_ru_ft_G_j_5": "如果赛事在出示首个罚牌后中断，所有最后一个罚牌的注单将被取消。",
                        "ART_ru_ft_G_j_6": "如果赛事在没有出示任何罚牌前中断，所有首个和最后一个罚牌的注单将被取消。",
                        "ART_ru_ft_G_j_7": "如果在90分钟完场时间内并未出示任何罚牌，所有首个和最后一个罚牌的注单将被取消。",
                    
                        "ART_ru_ft_G_k": "罚牌 – X罚牌",
                        "ART_ru_ft_G_k_1": "预测哪支球队将被判罚指定的罚牌。",
                        "ART_ru_ft_G_k_2": "指定罚牌将提前提供一张或多张选择，例如，第四张罚牌或第四和第五张罚牌（各自独立的盘口）",
                        "ART_ru_ft_G_k_3": "如果在指定的罚牌被记录之前比赛中断，该张罚牌的投注将被视为无效。所有比赛中断之前记录的罚牌将视为有效。",
                    
                        "ART_ru_ft_G_l": "罚牌最多的球队",
                        "ART_ru_ft_G_l_1": "预测哪一支球队将由获收的罚牌累积最多分数。",
                        "ART_ru_ft_G_l_2": "注单将按照90分钟完场赛事时间内所获收的黄卡和红卡累积最高分数的球队做结算。",
                        "ART_ru_ft_G_l_3": "选项可列为：",
                        "ART_ru_ft_G_l_3_1": "球队A",
                        "ART_ru_ft_G_l_3_2": "球队B",
                        "ART_ru_ft_G_l_3_3": "平局",
                    
                        "ART_ru_ft_G_m": "第一张罚牌时间",
                        "ART_ru_ft_G_m_1": "预测出示首个罚牌的时间。",
                        "ART_ru_ft_G_m_2": "选项可列为：",
                        "ART_ru_ft_G_m_2_1": "赛事的第8分钟或之前。",
                        "ART_ru_ft_G_m_2_2": "第9分钟后。",
                        "ART_ru_ft_G_m_3": "出于结算的用意，赛事的第一分钟是从1秒计算到59秒。第二分钟则是从1分钟计算到1分59秒，以此类推。",
                        "ART_ru_ft_G_m_4": "范例：如果投注第一张罚牌时间的选项是’赛事的第8分钟或之前’，而确实出示罚牌的时间为8分钟49秒，罚牌出示时间的范围属于’第9分钟后’，因此投注将结算为输。",
                        "ART_ru_ft_G_m_5": "针对非球员（例如：教练，没有比赛中替补出场的替补球员，管理人员等等）出示的任何罚牌将不计算在内。",
                        "ART_ru_ft_G_m_6": "如果赛事在出示首个罚牌后中断，所有第一张罚牌时间的注单将保持有效。",
                        "ART_ru_ft_G_m_7": "如果赛事在没有出示任何罚牌前中断，所有第一张罚牌时间的注单将被取消。",
                        "ART_ru_ft_G_m_8": "如果在90分钟完场时间内并未出示任何罚牌，所有第一张罚牌时间的注单将被取消。",
                    
                        "ART_ru_ft_G_n": "红卡（球员）",
                        "ART_ru_ft_G_n_1": "预测在90分钟完场时间内是否会出示红卡。",
                        "ART_ru_ft_G_n_2": "针对非球员（例如：教练，没有比赛中替补出场的替补球员，管理人员等等）出示的任何罚牌将不计算在内。",
                        "ART_ru_ft_G_n_3": "如果赛事在出示一个红卡后中断, 所有是否出示红卡的注单将保持有效。",
                        "ART_ru_ft_G_n_4": "如果赛事在没有红卡出示前中断， 所有是否出示红卡的注单将被取消。",
                    
                        "ART_ru_ft_G_o": "15 分钟罚牌数",
                        "ART_ru_ft_G_o_1": "依照以上主要市场陈列的15分钟规则，预测哪队将在让球，独赢，大小或单双盘口取得胜利。",
                    
                        "ART_ru_ft_G_p": "罚牌 - 双重机会",
                        "ART_ru_ft_G_p_1": "在三种可能出现的赛果中选择两种进行投注; 主场赢或打平（1和X）, 客场赢或打平（2和X）或主场或客场赢（1和2）。",
                        "ART_ru_ft_G_p_2": "共有三种选择: 1 X, X 2, 1 2：",
                        "ART_ru_ft_G_p_2_1": "\"1\" 代表: 主场赢。",
                        "ART_ru_ft_G_p_2_2": "\"X\" 代表: 平手。",
                        "ART_ru_ft_G_p_2_3": "\"2\" 代表: 客场赢。",
                    
                    
                        "ART_ru_ft_H": "任意球",
                        "ART_ru_ft_H_a": "最先/最后任意球",
                        "ART_ru_ft_H_a_1": "预测在90分钟完场时间内哪个球队会发出第一或最后一个任意球。",
                        "ART_ru_ft_H_a_2": "如果赛事在发出第一个任意球后中断，所有第一个任意球的注单将保持有效。",
                        "ART_ru_ft_H_a_3": "如果赛事在发出第一个任意球后中断，所有最后一个任意球的注单将被取消。",
                        "ART_ru_ft_H_a_4": "如果赛事在没有发出任何任意球前中断，所有第一个和最后一个任意球的注单将被取消。",
                        "ART_ru_ft_H_a_5": "如果在90分钟完场时间内并未发出任何任意球，所有第一个和最后一个任意球的注单将被取消。",
                    
                    
                        "ART_ru_ft_I": "射门",
                        "ART_ru_ft_I_a": "最先/最后球门球",
                        "ART_ru_ft_I_a_1": "预测在90分钟完场时间内哪个球队会发出第一或最后一个球门球。",
                        "ART_ru_ft_I_a_2": "如果赛事在发出第一个球门球后中断，所有第一个球门球的注单将保持有效。",
                        "ART_ru_ft_I_a_3": "如果赛事在发出第一个球门球后中断，所有最后一个球门球的注单将被取消。",
                        "ART_ru_ft_I_a_4": "如果赛事在没有发出任何球门球前中断，所有第一个和最后一个球门球的注单将被取消。",
                        "ART_ru_ft_I_a_5": "如果在90分钟完场时间内并未发出任何球门球，所有第一个和最后一个球门球的注单将被取消。",
                    
                    
                        "ART_ru_ft_J": "界外球",
                        "ART_ru_ft_J_a": "最先/最后界外球",
                        "ART_ru_ft_J_a_1": "预测在90分钟完场时间内哪个球队会发出第一或最后一个界外球。",
                        "ART_ru_ft_J_a_2": "如果赛事在发出第一个界外球后中断，所有第一个界外球的注单将保持有效。",
                        "ART_ru_ft_J_a_3": "如果赛事在发出第一个界外球后中断，所有最后一个界外球的注单将被取消。",
                        "ART_ru_ft_J_a_4": "如果赛事在没有发出任何界外球前中断，所有第一个和最后一个界外球的注单将被取消。",
                        "ART_ru_ft_J_a_5": "如果在90分钟完场时间内并未发出任何界外球，所有第一个和最后一个界外球的注单将被取消。",
                    
                    
                        "ART_ru_ft_K": "替换",
                        "ART_ru_ft_K_a": "最先/最后替补",
                        "ART_ru_ft_K_a_1": "预测在90分钟完场时间内哪个球队会最先或最后替补球员。",
                        "ART_ru_ft_K_a_2": "如果两位或以上球员同时被替补，首先被裁判员出示替补的球员，将被视为\"优胜者\"为注单进行结算。",
                        "ART_ru_ft_K_a_3": "如果赛事在替补第一个球员后中断，所有第一个替补的注单将保持有效。",
                        "ART_ru_ft_K_a_4": "如果赛事在替补第一个球员后中断，所有最后一个替补的注单将被取消，除非在赛事中断前，结果已经明确并且若之后有任何潜在替补将对盘口结算裁决没有影响。此情况只有当双方球队都将已分配好的替补机会用完。若遇到任何其他情况，注单将一律被取消。",
                        "ART_ru_ft_K_a_5": "如果赛事在没有任何替补前中断，所有第一个和最后一个替补的注单将被取消。",
                        "ART_ru_ft_K_a_6": "如果在90分钟完场时间内并未任何替补，所有第一个和最后一个替补的注单将被取消。",
                    
                    
                        "ART_ru_ft_L": "越位",
                        "ART_ru_ft_L_a": "最先/最后越位",
                        "ART_ru_ft_L_a_1": "预测在90分钟完场时间内哪个球队的球员会最先或最后越位。",
                        "ART_ru_ft_L_a_2": "如果赛事在第一个球员越位后中断，所有第一个越位的注单将保持有效。",
                        "ART_ru_ft_L_a_3": "如果赛事在第一个球员越位后中断，所有最后一个越位的注单将被取消。",
                        "ART_ru_ft_L_a_4": "如果赛事在没有任何球员越位前中断，所有第一个和最后一个越位的注单将被取消。",
                        "ART_ru_ft_L_a_5": "如果在90分钟完场时间内并未有任何球员越位，所有第一个和最后一个越位的注单将被取消。",
                    
                    
                        "ART_ru_ft_M": "点球",
                        "ART_ru_ft_M_a": "一般规则",
                        "ART_ru_ft_M_a_1": "点球大战将根据胜出回合(和已踢进的点球)来进行结算。",
                        "ART_ru_ft_M_a_2": "如果比赛规则注明必须完成全部点球，任何在已有明确胜出结果后的点球将不计于结算成绩内。",
                    
                        "ART_ru_ft_M_b": "点球荣获",
                        "ART_ru_ft_M_b_1": "预测在90分钟完场时间内是否会罚点球。",
                    
                        "ART_ru_ft_M_c": "点球大战 - 让球",
                        "ART_ru_ft_M_c_1": "预测哪一支球队根据盘口指定的让球数在点球赛里获胜。",
                        "ART_ru_ft_M_c_2": "骤死赛得分也包括在点球让球盘。",
                        "ART_ru_ft_M_c_3": "如果赛事并未进行点球，所有注单将被取消。",
                        "ART_ru_ft_M_c_4": "在90分钟完场时间内以及加时赛踢进的点球将不计算在内。",
                    
                        "ART_ru_ft_M_d": "进球: 大 / 小",
                        "ART_ru_ft_M_d_1": "预测点球赛总入球数将大于或小于在盘口指定的大/小盘球数。",
                        "ART_ru_ft_M_d_2": "点球大小盘只以10个点球为准（每队5球）。骤死赛得分不包括在点球大小盘。",
                        "ART_ru_ft_M_d_3": "范例：",
                        "ART_ru_ft_M_d_3_1": "利物浦 4-1托特纳姆热刺 – 大小球以5球结算。",
                        "ART_ru_ft_M_d_3_2": "利物浦6-5托特纳姆热刺（每队踢5个点球后的结果为：利物浦4-4托特纳姆热刺）-大小盘在每队踢5个点球后的8球得分结算。",
                        "ART_ru_ft_M_d_4": "如果赛事并未进行点球，所有注单将被取消。",
                        "ART_ru_ft_M_d_5": "在90分钟完场时间内以及加时赛踢进的点球将不计算在内。",
                        "ART_ru_ft_M_d_6": "如果赛事在点球赛时中断，而在赛事中断前已有明确结果并且之后没有任何显著会影响投注结果的情况，大/小盘注单才会被结算。若遇到任何其他情况，注单将一律被取消。",
                    
                        "ART_ru_ft_M_e": "点球大战 - 独赢",
                        "ART_ru_ft_M_e_1": "预测哪一支球队将在点球大战胜出或和局。",
                        "ART_ru_ft_M_e_2": "骤死赛(第6回合起) 将不计算在内。",
                        "ART_ru_ft_M_e_3": "点球独赢盘只计算球队在前5回合的进球。",
                    
                        "ART_ru_ft_M_f": "点球：进球/无进球",
                        "ART_ru_ft_M_f_1": "预测特定的球队是否会踢进指定的点球。",
                        "ART_ru_ft_M_f_2": "根据点球是否进球来进行结算。",
                    
                        "ART_ru_ft_M_g": "点球大战",
                        "ART_ru_ft_M_g_1": "预测一场比赛是否会有点球大战。",
                        "ART_ru_ft_M_g_2": "无论此前是否有进行加时赛， 将根据比赛是否有点球大战来进行结算。",
                    
                        "ART_ru_ft_M_h": "点球大战 – X 回合",
                        "ART_ru_ft_M_h_1": "预测哪一支球队将在点球大战的X回合胜出或和局。",
                        "ART_ru_ft_M_h_2": "X回合是指两个球队在该回合的点球比分。",
                        "ART_ru_ft_M_h_2_1": "范例1: (点球大战开始) - A队第一个点球和B队第一个点球为第一回合。",
                        "ART_ru_ft_M_h_2_2": "范例2: (骤死赛开始) - A队第六个点球和B队第六个点球为第六回合。",
                        "ART_ru_ft_M_h_3": "根据点球大战每个回合的所进的点球来进行结算。",
                        "ART_ru_ft_M_h_4": "如果点球大战在指定回合前结束,投注将视为无效。",
                    
                        "ART_ru_ft_M_i": "点球大战 – 结束回合",
                        "ART_ru_ft_M_i_1": "预测点球大战将的结束回合。",
                        "ART_ru_ft_M_i_2": "根据点球大战是在第三，第四，第五，第六或以后的回合来进行结算。",
                        "ART_ru_ft_M_i_3": "如果在赛果公布之前比赛中断，所有该盘口的投注将被视为无效。",
                    
                    
                        "ART_ru_ft_N": "比赛",
                        "ART_ru_ft_N_a": "联赛：一般规则",
                        "ART_ru_ft_N_a_1": "赛果确认完成后将进行派彩。",
                        "ART_ru_ft_N_a_2": "联赛的派彩将以官方来源或相关体育权威机构判定的结果为准。",
                        "ART_ru_ft_N_a_3": "所有联赛的积分扣除都予以计算。",
                        "ART_ru_ft_N_a_4": "冠军比赛规则适用。",
                    
                        "ART_ru_ft_N_b": "小组赛",
                        "ART_ru_ft_N_b_1": "预测整个赛季中排名最高的球队。",
                    
                        "ART_ru_ft_N_c": "排名前4、6、10、等",
                        "ART_ru_ft_N_c_1": "预测整个赛季中排名在前4、6、10等的球队。",
                    
                        "ART_ru_ft_N_e": "没有球队X的联赛冠军",
                        "ART_ru_ft_N_e_1": "预测整个赛季中，当所列出的球队或某球队从联赛表中移除后，哪一支球队将获得冠军。",
                    
                        "ART_ru_ft_N_d": "联赛：赛季让分盘",
                        "ART_ru_ft_N_d_1": "根据每一队让分盘口的差点预测哪支球队将会获胜。",
                        "ART_ru_ft_N_d_2": "球队个别的让分数将会添加到该队赛季的最终积分里。",
                        "ART_ru_ft_N_d_3": "拥有最高综合总分(让分数和赛季最终积分)的球队为赢家。",
                        "ART_ru_ft_N_d_4": "此盘口将采用并列名次规则。",
                        "ART_ru_ft_N_d_5": "球队让分数将不会在赛季中变更,然而赔率将会有所调整。",
                        "ART_ru_ft_N_d_6": "球队(赛季前)让分数将显示在个别球队名旁。",
                        "ART_ru_ft_N_d_7": "下列为5队联赛例子",
                        "ART_ru_ft_N_td_d7_1_1": "球队",
                        "ART_ru_ft_N_td_d7_1_2": "赛季最终积分",
                        "ART_ru_ft_N_td_d7_1_3": "让分数",
                        "ART_ru_ft_N_td_d7_1_4": "综合总分",
                        "ART_ru_ft_N_td_d7_1_5": "最终排名",
                        "ART_ru_ft_N_td_d7_2_1": "球队1",
                        "ART_ru_ft_N_td_d7_2_2": "90",
                        "ART_ru_ft_N_td_d7_2_3": "3",
                        "ART_ru_ft_N_td_d7_2_4": "93",
                        "ART_ru_ft_N_td_d7_2_5": "第2",
                        "ART_ru_ft_N_td_d7_3_1": "球队2",
                        "ART_ru_ft_N_td_d7_3_2": "85",
                        "ART_ru_ft_N_td_d7_3_3": "0",
                        "ART_ru_ft_N_td_d7_3_4": "85",
                        "ART_ru_ft_N_td_d7_3_5": "第5",
                        "ART_ru_ft_N_td_d7_4_1": "球队3",
                        "ART_ru_ft_N_td_d7_4_2": "82",
                        "ART_ru_ft_N_td_d7_4_3": "5",
                        "ART_ru_ft_N_td_d7_4_4": "87",
                        "ART_ru_ft_N_td_d7_4_5": "第4",
                        "ART_ru_ft_N_td_d7_5_1": "球队4",
                        "ART_ru_ft_N_td_d7_5_2": "79",
                        "ART_ru_ft_N_td_d7_5_3": "15",
                        "ART_ru_ft_N_td_d7_5_4": "94",
                        "ART_ru_ft_N_td_d7_5_5": "第1",
                        "ART_ru_ft_N_td_d7_6_1": "球队5",
                        "ART_ru_ft_N_td_d7_6_2": "79",
                        "ART_ru_ft_N_td_d7_6_3": "9",
                        "ART_ru_ft_N_td_d7_6_4": "88",
                        "ART_ru_ft_N_td_d7_6_5": "第3",
                    
                        "ART_ru_ft_N_f": "联赛：最后一名球队",
                        "ART_ru_ft_N_f_1": "预测整个赛季中哪一支球队会成为最后一名。",
                        "ART_ru_ft_N_f_2": "此类投注也被称为最低分。",
                    
                        "ART_ru_ft_N_g": "联赛：被降级的球队",
                        "ART_ru_ft_N_g_1": "预测在比赛中哪一支球队会被降级。",
                        "ART_ru_ft_N_g_2": "所有被降级球队将以全赢作为计算标准，比如：并列名次规则不适用。",
                        "ART_ru_ft_N_g_3": "如果一支球队从联赛中被移除或清除，投注在此球队的注单将被视为无效。如果在赛季开始之前出现此情况，所有的投注都无效，将会另外开设盘口。",
                    
                        "ART_ru_ft_N_h": "联赛：球队保持原位",
                        "ART_ru_ft_N_h_1": "预测比赛中哪一支球队不会被降级。",
                        "ART_ru_ft_N_h_2": "所有没有被降级的球队将以全赢作为计算标准，比如：并列名次规则不适用。",
                        "ART_ru_ft_N_h_3": "如果一支球队从联赛中被移除或清除，投注在此球队的注单将被视为无效。如果在赛季开始之前出现此情况，所有的投注都无效，将会另外开设盘口。",
                    
                        "ART_ru_ft_N_i": "联赛：球队晋级",
                        "ART_ru_ft_N_i_1": "预测比赛中哪一支球队会晋级。",
                        "ART_ru_ft_N_i_2": "投注包括自动晋级以及在特定比赛中通过加赛后的晋级。",
                        "ART_ru_ft_N_i_3": "所有晋级的球队将以全赢作为计算标准，比如：并列名次规则不适用。",
                        "ART_ru_ft_N_i_4": "如果一支球队从联赛中被移除或清除，投注在此球队的注单将被视为无效。如果在赛季开始之前出现此情况，所有的投注都无效，将会另外开设盘口。",
                    
                        "ART_ru_ft_N_j": "联赛：最佳新秀",
                        "ART_ru_ft_N_j_1": "预测哪一支最新晋级的球队将在赛季中获得最高排名。",
                    
                        "ART_ru_ft_N_k": "比赛 - 进球最多的球队",
                        "ART_ru_ft_N_k_1": "预测在比赛中哪一个球队失球最多。",
                        "ART_ru_ft_N_k_2": "所有的投注以赛事官方90分钟为完场时间，包括加时、伤停补时。",
                        "ART_ru_ft_N_k_3": "在点球中的失球不予计算。",
                        "ART_ru_ft_N_k_4": "如果赛事中断，将以官方单位公布的最后赛果为准，其中包括赛事重新开始或指定的分数。",
                    
                        "ART_ru_ft_N_l": "比赛 - 失球最多的球队",
                        "ART_ru_ft_N_l_1": "预测在比赛中哪一个球队失球最多。",
                        "ART_ru_ft_N_l_2": "所有的投注以赛事官方90分钟为完场时间，包括加时、伤停补时。",
                        "ART_ru_ft_N_l_3": "在点球中的失球不予计算。",
                        "ART_ru_ft_N_l_4": "如果赛事中断，将以官方单位公布的最后赛果为准，其中包括赛事重新开始或指定的分数。",
                    
                        "ART_ru_ft_N_m": "比赛 – 总进球数",
                        "ART_ru_ft_N_m_1": "预测在比赛中进球的数量。",
                        "ART_ru_ft_N_m_2": "所有的投注以赛事官方90分钟为完场时间，包括加时、伤停补时。",
                        "ART_ru_ft_N_m_3": "在比赛中点球的进球不予计算。",
                        "ART_ru_ft_N_m_4": "如果赛事中断，将以官方单位公布的最后赛果为准，其中包括赛事重新开始或指定的分数。",
                    
                        "ART_ru_ft_N_n": "比赛 - 帽子戏法",
                        "ART_ru_ft_N_n_1": "预测在比赛中任何一位球员进3个或以上的球。",
                        "ART_ru_ft_N_n_2": "所有的投注以赛事官方90分钟为完场时间，包括加时、伤停补时。",
                        "ART_ru_ft_N_n_3": "帽子戏法不包含点球中的进球。",
                        "ART_ru_ft_N_n_4": "在一场比赛中如果一个球员进球3个或更多，即为帽子戏法。",
                        "ART_ru_ft_N_n_5": "如果赛事中断，将以官方单位公布的最后赛果为准，其中包括赛事重新开始或指定的得分。如果帽子戏法是在赛事中断前，且赛事在0-0的情况下或者其它官方单位分配的比分下重新开始，将不予计算。",
                    
                        "ART_ru_ft_N_o": "比赛 - 总帽子戏法",
                        "ART_ru_ft_N_o_1": "预测在比赛中获得了多少帽子戏法。",
                        "ART_ru_ft_N_o_2": "所有的投注以赛事官方90分钟为完场时间，包括加时、伤停补时。",
                        "ART_ru_ft_N_o_3": "帽子戏法不包含点球中的进球。",
                        "ART_ru_ft_N_o_4": "在一场比赛中如果一个球员进球3个或更多，即为帽子戏法。",
                        "ART_ru_ft_N_o_5": "如果赛事中断，将以官方单位公布的最后赛果为准，其中包括赛事重新开始或指定的分数。如果帽子戏法是在赛事中断前，且赛事在0-0的情况下或者其它官方单位分配的比分下重新开始，将不予计算。",
                    
                        "ART_ru_ft_N_p": "比赛 – 总红卡数",
                        "ART_ru_ft_N_p_1": "预测在比赛中红卡的数量。",
                        "ART_ru_ft_N_p_2": "所有的投注以赛事官方90分钟为完场时间，包括加时、伤停补时。",
                        "ART_ru_ft_N_p_3": "任何非球员的红卡（例如.经理、教练或替补）不予计算。",
                        "ART_ru_ft_N_p_4": "点球中的红卡不予计算。",
                        "ART_ru_ft_N_p_5": "如果赛事在出现红卡之后中断，红卡仍然计算在总红卡数中。",
                    
                        "ART_ru_ft_N_q": "比赛 – 总黄卡数",
                        "ART_ru_ft_N_q_1": "预测在比赛中黄卡的数量。",
                        "ART_ru_ft_N_q_2": "所有的投注以赛事官方90分钟为完场时间，包括加时、伤停补时。",
                        "ART_ru_ft_N_q_3": "任何非球员的黄卡（例如.经理、教练或替补）不予计算",
                        "ART_ru_ft_N_q_4": "点球中的黄卡不予计算",
                        "ART_ru_ft_N_q_5": "如果同个球员被出示第二张黄卡，第二张黄卡会被计算在内。",
                    
                        "ART_ru_ft_N_r": "比赛 – 进球最多的城市",
                        "ART_ru_ft_N_r_1": "预测在比赛中哪一个城市将会进球最多。",
                        "ART_ru_ft_N_r_2": "所有的投注以官方时间90分钟为准，包括加时、伤停补时。",
                        "ART_ru_ft_N_r_3": "点球中的进球不予计算。",
                        "ART_ru_ft_N_r_4": "如果赛事中断，将以官方单位公布的最后赛果为准，其中包括赛事重新开始或指定的分数。",
                    
                        "ART_ru_ft_N_s": "比赛 – 获胜小组",
                        "ART_ru_ft_N_s_1": "预测在比赛中哪一个小组将会获胜。",
                        "ART_ru_ft_N_s_2": "冠军比赛规则适用。",
                    
                        "ART_ru_ft_N_t": "锦标赛 – 小组最后一名球队",
                        "ART_ru_ft_N_t_1": "预测哪一个球队为最后一名。",
                        "ART_ru_ft_N_t_2": "冠军比赛规则适用。",
                    
                        "ART_ru_ft_N_u": "冠军所属地",
                        "ART_ru_ft_N_u_1": "预测比赛的冠军来自哪里。",
                        "ART_ru_ft_N_u_2": "来源地可以是冠军球队的所属地区、国家或洲。",
                        "ART_ru_ft_N_u_3": "冠军比赛规则使用。",
                    
                        "ART_ru_ft_N_v": "比赛 - 晋级",
                        "ART_ru_ft_N_v_1": "预测那支队伍会晋级去下一轮赛事。",
                        "ART_ru_ft_N_v_2": "投注包括自动晋级以及在加时赛与点球大战后的晋级。",
                        "ART_ru_ft_N_v_3": "符合冠军规则。",
                    
                        "ART_ru_ft_N_w": "比赛 - 阶段淘汰",
                        "ART_ru_ft_N_w_1": "预测比赛中该球队会在哪一个阶段被淘汰。",
                        "ART_ru_ft_N_w_2": "冠军比赛规则使用。",
                    
                        "ART_ru_ft_N_x": "比赛 - 提名入围",
                        "ART_ru_ft_N_x_1": "预测哪一支球队会进入决赛。",
                        "ART_ru_ft_N_x_2": "冠军比赛规则适用。",
                    
                        "ART_ru_ft_N_y": "比赛 – 最终裁判员",
                        "ART_ru_ft_N_y_1": "预测决赛中的裁判员是哪一位。",
                        "ART_ru_ft_N_y_2": "无论此前是否有任何公告，将根据决赛开始后的裁判为派彩依据。",
                        "ART_ru_ft_N_y_3": "冠军比赛规则适用。",
                    
                        "ART_ru_ft_N_z": "直接预测排名（联赛、比赛）",
                        "ART_ru_ft_N_z_1": "预测在比赛或联赛中哪两个球队获得第1名和第2名的顺序排名。",
                        "ART_ru_ft_N_z_2": "所有的投注以官方时间90分钟为准，包括加时、伤停补时。",
                        "ART_ru_ft_N_z_3": "如果赛事中断，将以官方单位公布的最后赛果为准，其中包括赛事重新开始或指定的分数。",
                    
                        "ART_ru_ft_N_aa": "双预测排名",
                        "ART_ru_ft_N_aa_1": "预测在比赛或联赛中哪两个球队为前两名的排名。",
                        "ART_ru_ft_N_aa_2": "所有的投注以官方时间90分钟为准，包括加时、伤停补时。",
                        "ART_ru_ft_N_aa_3": "如果赛事中断，将以官方单位公布的最后赛果为准，其中包括赛事重新开始或指定的分数。",
                    
                        "ART_ru_ft_N_ab": "最佳射手",
                        "ART_ru_ft_N_ab_1": "预测在一场特定比赛中进球最多的球员。",
                        "ART_ru_ft_N_ab_2": "如果产生超过一个冠军数量, 请以并列名次规则参考结算方式。",
                        "ART_ru_ft_N_ab_3": "投注在被列出的该球队球员将被视为有效，无论他们是否受伤、暂停、不参与比赛或其它任何原因。",
                        "ART_ru_ft_N_ab_4": "如果联赛中途有球员转到同一个联赛的另一个球队, 球员在转到另一个球队前所进得球数将继续计算在内。如果球员是转到不同联赛的球队，在转之前进得球数将不会继续带到新联赛去。两种情况下，投注此球员的注单将保持有效。",
                        "ART_ru_ft_N_ab_5": "乌龙球将不予计算在内。",
                        "ART_ru_ft_N_ab_6": "按照单纯的联赛比赛玩法，只有在联赛中进得球才计算在内。在季后赛进得球将不予计算在内。",
                    
                        "ART_ru_ft_N_ac": "最佳射手球队",
                        "ART_ru_ft_N_ac_1": "预测比赛中哪一个球员在所属球队中进球最多。",
                        "ART_ru_ft_N_ac_2": "所有的投注以官方时间90分钟为准，包括加时、伤停补时。",
                        "ART_ru_ft_N_ac_3": "进球数不包括点球。",
                        "ART_ru_ft_N_ac_4": "投注适用于所有比赛的球队。",
                        "ART_ru_ft_N_ac_5": "并列名次规则适用；任何用于决定和局的方法不可作为结算依据，比如：计数协助。",
                    
                        "ART_ru_ft_N_ad": "最佳射手 / 比赛双赢",
                        "ART_ru_ft_N_ad_1": "预测比赛中哪一个球员进球最多和哪一支球队获胜。",
                        "ART_ru_ft_N_ad_2": "所有的投注以官方时间90分钟为准，包括加时、伤停补时。",
                        "ART_ru_ft_N_ad_3": "进球数不包括点球。",
                        "ART_ru_ft_N_ad_4": "如果多于一个球员和最佳射手打平，并列名次规则适用；任何用于决定和局的方法不可作为结算依据，比如：计数协助。",
                    
                        "ART_ru_ft_N_ae": "进球最多的小组",
                        "ART_ru_ft_N_ae_1": "预测在比赛中哪一组进球最多。",
                        "ART_ru_ft_N_ae_2": "只计算在小组阶段的进球。",
                        "ART_ru_ft_N_ae_3": "所有的投注以赛事官方单位90分钟为完场时间，包括球员伤停补时。",
                        "ART_ru_ft_N_ae_4": "如果赛事中断，将以官方单位公布的最后赛果为准，其中包括赛事重新开始或指定的分数。",
                    
                        "ART_ru_ft_N_af": "加时赛",
                        "ART_ru_ft_N_af_1": "预测一场比赛是否会有加时赛。",
                        "ART_ru_ft_N_af_2": "根据比赛是否在正常的“90分钟”结束，还是进行了加时赛结束，来进行结算。",
                    
                        "ART_ru_ft_N_ag": "比赛-季军",
                        "ART_ru_ft_N_ag_1": "预测那支队伍会在季军战胜出。",
                        "ART_ru_ft_N_ag_2": "投注包括自动晋级以及在加时赛与点球大战后的晋级。",
                        "ART_ru_ft_N_ag_3": "符合冠军规则。",
                    
                        "ART_ru_ft_N_ah": "比赛-分组赛冠军",
                        "ART_ru_ft_N_ah_1": "从指定的两个球队预测选出谁将荣登小组榜首。",
                        "ART_ru_ft_N_ah_2": "结算以整个小组所有赛事结束后并且官方宣布的结果为准。",
                        "ART_ru_ft_N_ah_3": "如果出现两个球队比分相同的情况，结果将以官方宣布的获胜者将为准（球分差异，净胜球等等）。",
                        "ART_ru_ft_N_ah_4": "如果官方没有宣布获胜者，所有投注将会被取消。",
                    
                    
                        "ART_ru_ft_O": "综合市场",
                        "ART_ru_ft_O_a": "独赢 & 进球 大/小",
                        "ART_ru_ft_O_a_1": "同时预测“90分钟”后的比赛结果，以及赛事总入球数将大于或小于在盘口指定的大/小盘球数。",
                        "ART_ru_ft_O_a_2": "根据所选球队的输、赢或和局，以及全场比赛的总进球数，来进行结算。",
                        "ART_ru_ft_O_a_3": "如果在赛果公布之前比赛中断，所有该盘口的投注将被视为无效。",
                    
                        "ART_ru_ft_O_b": "独赢 & 双方球队进球",
                        "ART_ru_ft_O_b_1": "同时预测“90分钟”后的比赛结果，以及双方球队是否都有进球。",
                        "ART_ru_ft_O_b_2": "根据所选特定球队的输、赢或和局，以及每支球队的进球数，来进行结算。",
                        "ART_ru_ft_O_b_3": "如果在赛果公布之前比赛中断，所有该盘口的投注将被视为无效。",
                    
                        "ART_ru_ft_O_c": "独赢 & 最先进球",
                        "ART_ru_ft_O_c_1": "同时预测“90分钟”后的比赛结果，以及哪支球队将最先进球。",
                        "ART_ru_ft_O_c_2": "根据所选球队的输、赢或和局，以及是否正确的选择了最先进球球队，来进行结算。",
                        "ART_ru_ft_O_c_3": "如果在赛果公布之前比赛中断，所有该盘口的投注将被视为无效。",
                        "ART_ru_ft_O_c_4": "如果赛事没有首个进球，所有投注将会以输结算。",
                    
                        "ART_ru_ft_O_d": "独赢 & 进球 单/双",
                        "ART_ru_ft_O_d_1": "同时预测“90分钟”后的比赛结果，以及双方球队总进球数的奇偶。",
                        "ART_ru_ft_O_d_2": "根据所选球队的输、赢或和局，以及双方球队总进球数的奇偶，来进行结算。",
                        "ART_ru_ft_O_d_3": "如果在赛果公布之前比赛中断，所有该盘口的投注将被视为无效。",
                    
                        "ART_ru_ft_O_e": "进球 大/小 & 双方球队进球",
                        "ART_ru_ft_O_e_1": "同时预测赛事总入球数将大于或小于在盘口指定的大/小盘球数，以及双方球队是否都有进球。",
                        "ART_ru_ft_O_e_2": "根据90分钟后的总进球数，以及两队是否都有进球，来进行结算。",
                        "ART_ru_ft_O_e_3": "如果在赛果公布之前比赛中断，将根据以下规则进行处理：",
                        "ART_ru_ft_O_e_3_1": "如果在比赛中断那一刻，双方球队都已经进1球或以上，并且总进球数大于盘口指定的大/小盘球数，投注将被视为有效。",
                        "ART_ru_ft_O_e_3_2": "如果在比赛中断那一刻，双方球队没有都进1球或以上，投注将被视为无效。",
                    
                        "ART_ru_ft_O_f": "进球 大/小 & 进球 单/双",
                        "ART_ru_ft_O_f_1": "同时预测赛事总入球数将大于或小于在盘口指定的大/小盘球数，以及总进球数的奇偶。",
                        "ART_ru_ft_O_f_2": "根据90分钟后的总进球数，以及总进球数的奇偶，来进行结算。",
                        "ART_ru_ft_O_f_3": "如果在赛果公布之前比赛中断，所有该盘口的投注将被视为无效。",
                    
                        "ART_ru_ft_O_g": "进球 大/小 & 最先进球",
                        "ART_ru_ft_O_g_1": "同时预测赛事总入球数将大于或小于在盘口指定的大/小盘球数，以及哪只球队将成为首先进球球队。",
                        "ART_ru_ft_O_g_2": "根据90分钟后的总进球数，以及是否正确的选择了最先进球球队，来进行结算。",
                        "ART_ru_ft_O_g_3": "如果在赛果公布之前比赛中断，将根据以下规则进行处理：",
                        "ART_ru_ft_O_g_3_1": "如果在比赛中断那一刻的总进球数大于指定的大/小盘球数，投注将被视为有效。",
                        "ART_ru_ft_O_g_3_2": "如果在比赛中断那一刻的总进球数小于指定的大/小盘球数，投注将被视为无效。",
                        "ART_ru_ft_O_g_4": "如果赛事没有首个进球，所有投注将会以输结算。",
                    
                        "ART_ru_ft_O_h": "双重机会 & 进球 大/小",
                        "ART_ru_ft_O_h_1": "从可选的结果中预测正确的结果，以及总进球数对比指定数值的大小。",
                        "ART_ru_ft_O_h_2": "根据是否正确的选择了可能的结果，以及“90分钟”后的总进球数，来进行结算。",
                        "ART_ru_ft_O_h_3": "3种可能的结果是：",
                        "ART_ru_ft_O_h_3_1": "主队胜出或和局（1 & X）",
                        "ART_ru_ft_O_h_3_2": "客队胜出或和局（X & 2）",
                        "ART_ru_ft_O_h_3_3": "主队胜出或客队胜出（1 & 2）",
                        "ART_ru_ft_O_h_4": "如果在赛果公布之前比赛中断，所有该盘口的投注将被视为无效。",
                    
                        "ART_ru_ft_O_i": "双重机会 & 双方球队进球",
                        "ART_ru_ft_O_i_1": "从可选的结果中预测正确的结果以及两队是否都会得分。",
                        "ART_ru_ft_O_i_2": "根据是否在可能的结果中做出了正确的选择以及两队是否都有进球，来进行结算。",
                        "ART_ru_ft_O_i_3": "3种可能的结果是：",
                        "ART_ru_ft_O_i_3_1": "主队胜出或和局（1 & X）",
                        "ART_ru_ft_O_i_3_2": "客队胜出或和局（X & 2）",
                        "ART_ru_ft_O_i_3_3": "主队胜出或客队胜出（1 & 2）",
                        "ART_ru_ft_O_i_4": "如果在赛果公布之前比赛中断，所有该盘口的投注将被视为无效。",
                    
                    
                        "ART_ru_ft_P": "其他",
                        "ART_ru_ft_P_a": "特定联赛里主客队的总进球数",
                        "ART_ru_ft_P_a_p": "本公司在某些联赛里会提供某种结合性赛事结果的投注。盘口的玩法将结合主场与客场球队在整个联赛里的赛果之后分出胜负。中立场的比赛，第一个球队被视为这一场赛事的主队。以下列出所提供的个别替补玩法规则。",
                    
                        "ART_ru_ft_P_b": "特定联赛里主客队的总进球数：一般规则",
                        "ART_ru_ft_P_b_1": "如果联赛中有一场赛事中断或取消，所有特定联赛里主客队的总进球数注单将被取消。",
                        "ART_ru_ft_P_b_2": "比赛日程以及赛事场次将会明确的在盘口显示。例如：",
                        "ART_ru_ft_P_b_2_1": "主队-周五-3场赛事",
                        "ART_ru_ft_P_b_2_2": "客队-周五-3场赛事",
                    
                        "ART_ru_ft_P_c": "在特定联赛中的主队和客队进球数：独赢和双重机会",
                        "ART_ru_ft_P_c_1": "根据得分的进球数预测所有主队对阵所有客队的结果。 例如，如果主队目标是6颗进球，客队目标是8颗进球，那么获胜的选择将是:",
                        "ART_ru_ft_P_c_1_1": "‘客队’ (独赢)",
                        "ART_ru_ft_P_c_1_2": "‘客队 / 平局’ 和 ‘主队 / 客队’ (双重机会)",
                    
                        "ART_ru_ft_P_d": "特定联赛里主客队的进球数：让球",
                        "ART_ru_ft_P_d_1": "预测在90分钟完场时间内哪一支球队在结合整个联赛里的赛果后在盘口指定的让球数胜出。",
                    
                        "ART_ru_ft_P_e": "特定联赛里主客队的进球数：进球: 大 / 小",
                        "ART_ru_ft_P_e_1": "预测主客队的总进球数将大于或小于在盘口指定的大/小盘牌数。",
                    
                    
                        "ART_ru_ft_Q": "奇幻赛事",
                        "ART_ru_ft_Q_a": "奇幻赛事",
                        "ART_ru_ft_Q_a_p": "奇幻赛事是以2个不同赛事的2场比赛为组合进行结果预测的竞猜游戏。",
                        "ART_ru_ft_Q_a_1": "奇幻赛事的竞猜结果以选定的2场赛事的实际比赛结果为准。",
                        "ART_ru_ft_Q_a_2": "如两场赛事中的任意一场（或两场）被取消、终止或延长后的36个小时内无最终结果，奇幻赛事对应竞猜游戏的结果将以无效处理。",
                        "ART_ru_ft_Q_a_3": "如两场赛事中的任意一场（或两场）进行加时赛或点球大战时，此次竞猜将以正式比赛中的90分钟赛事结果为准。",
                        "ART_ru_ft_Q_a_4": "主/客场因素将不作为影响奇幻赛事的影响因素。",
                        "ART_ru_ft_Q_a_5": "奇幻赛事所有内容将遵守以上赛事规则。",
                    
                        "ART_ru_ft_R": "电竞足球赛事",
                        "ART_ru_ft_R_a_1": "比赛将以虚拟或真实玩家对决(PVP)模式开打。",
                        "ART_ru_ft_R_a_2": "盘口的比赛名称将注明比赛时间(例如：12分钟), 且作为最终结算根据。",
                        "ART_ru_ft_R_a_3": "比赛时间若无注明时，结算将以官方或相关体育权威机构数据结果为准。",
                        "ART_ru_ft_R_a_4": "如果比赛因突发情况重制且分隔时间不超过12小时，投注将根据官方结果进行结算。",
                        "ART_ru_ft_R_a_5": "主/客场排序将不影响结算。例：赛事注明一队对垒二队，但官方显示二队对垒一队，投注仍视为有效。",
                        ';
                        break;
                }
                break;
            case "basketball":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_basketball": "籃球",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "08/05/2023",

                        "ART_ru_rule": "一般規則",
                        "ART_ru_basketball_a_1": "如果比賽場地有變更，所有註單將被取消。",
                        "ART_ru_basketball_a_2": "如果賽事是在上半場中斷，所有上半場的注單將被取消。如果賽事是在下半場中斷所有上半場的投注保持有效，但所有下半場的注單將被取消，除非在個別玩法規則另有註明。",
                        "ART_ru_basketball_a_3": "單節/半場的投注，比賽必須完成賽節注單才被視為有效，除非在個別玩法規則另有註明。",
                        "ART_ru_basketball_a_4": "美國大學籃球聯賽場地規則：盤口指示的\"主場\"和\"客場\"信息僅供參考。無論原定場地是否更改為\"主場\"，\"客場\"或\"中立場\"，所有註單將保持有效。",
                        "ART_ru_basketball_a_5": "如比賽在法定時間提前進行，在比賽開始前的投注依然有效，在比賽開始後的所有投注均視為無效(滾球投注另作別論)。",
                        "ART_ru_basketball_a_6": "對比賽的所有投注和下半場或兩回合制的投注都包括加時賽，除非另有註明。第四節投注不包括加時賽。",
                        "ART_ru_basketball_a_7": "對於3 x3籃球，結算將基於官方比賽規則。",

                        "ART_ru_bettype": "投注類型",
                        "ART_ru_basketball_b": "獨贏",
                        "ART_ru_basketball_b_1": "預測哪一支球隊將在比賽勝出。盤口提供兩支球隊為投注選項。",
                        "ART_ru_basketball_b_2": "賽事盤口包括全場、半場或單節投注。",

                        "ART_ru_basketball_c": "讓球",
                        "ART_ru_basketball_c_1": "預測哪一支球隊在盤口指定的讓分球數在半場/全場/賽事單節贏得比賽。",
                        "ART_ru_basketball_c_2": "如果賽事在下半場取消或中斷，所有上半場注單保持有效。",
                        "ART_ru_basketball_c_3": "如果賽事在下半場取消或中斷，所有下半場注單將被取消。",
                        "ART_ru_basketball_c_4": "賽事盤口包括全場、半場或單節投注。",

                        "ART_ru_basketball_d": "滾球讓球",
                        "ART_ru_basketball_d_1": "預測哪一支球隊在盤口指定的讓分數裡贏得半場/全場/賽事單節的比賽。",
                        "ART_ru_basketball_d_2": "賽事盤口包括全場、半場或單節投注。",

                        "ART_ru_basketball_e": "總分： 大 / 小",
                        "ART_ru_basketball_e_1": "預測賽事總比分將大於或小於在盤口指定的大/小盤分數。",
                        "ART_ru_basketball_e_2": "賽事盤口包括全場、半場或單節投注。",
                        "ART_ru_basketball_e_3": "如果賽事中斷前已有明確結果並且之後沒有任何顯著會影響賽事結果的情況，大/小盤注單才會被結算。若遇到任何其他情況，注單將一律被取消。",
                        "ART_ru_basketball_e_4": "如果賽事在上半場中斷，所有上半場注單將被取消，除非中斷前已有明確結果並且之後沒有任何顯著會影響賽事結果的情況注單才會被結算。",
                        "ART_ru_basketball_e_5": "如果賽事在下半場取消或中斷，所有上半場注單保持有效。",
                        "ART_ru_basketball_e_6": "如果賽事在下半場取消或中斷，所有下半場注單將被取消，除非中斷前已有明確結果並且之後沒有任何顯著會影響賽事結果的情況注單才會被結算。",
                        "ART_ru_basketball_e_7": "如果賽事中斷, 所有時節的注單將被取消除非遇到以下其中一個情況：",
                        "ART_ru_basketball_e_7_1": "投注的時節是在比賽中斷前。",
                        "ART_ru_basketball_e_7_2": "比賽中斷前已有明確結果並且之後沒有任何顯著會影響賽事結果的情況。",

                        "ART_ru_basketball_f": "滾球總分： 大 / 小",
                        "ART_ru_basketball_f_1": "預測賽事總比分將大於或小於在盤口指定的大/小盤分數。",
                        "ART_ru_basketball_f_2": "結算是以0-0的比分在比賽/時節結束後按盤口開出的讓分數做裁決。投注當時的比分對結算沒有影響。",
                        "ART_ru_basketball_f_3": "如果賽事中斷前已有明確結果並且之後沒有任何顯著會影響賽事結果的情況，大/小盤注單才會被結算。若遇到任何其他情況，注單將一律被取消。",

                        "ART_ru_basketball_g": "球隊得分 - 大 / 小",
                        "ART_ru_basketball_g_1": "預測賽事主隊/客隊的總分數將大於或小於在盤口指定的大/小盤分數。",
                        "ART_ru_basketball_g_2": "如果賽事取消，所有的注單將會被認為無效，除非注單在中斷前已經結算或者在中斷前已有明確的結果並且之後沒有任何顯著會影響賽事結果的情況注單才會被結算。",
                        "ART_ru_basketball_g_3": "所有注單的結算都是依據相關體育機構的官方統計數據為準。",

                        "ART_ru_basketball_h": "總分: 單 / 雙",
                        "ART_ru_basketball_h_1": "預測賽事的總比分是單數或雙數。",
                        "ART_ru_basketball_h_2": "賽事盤口包括全場、半場或單節投注。",

                        "ART_ru_basketball_i": "最先得分球隊",
                        "ART_ru_basketball_i_1": "預測最先得分的球隊。",
                        "ART_ru_basketball_i_2": "如果賽事在有得分後中斷，所有最先得分球隊的注單將保持有效。",
                        "ART_ru_basketball_i_3": "如果賽事在沒有球隊得分前中斷，所有最先得分球隊的注單將被取消。",
                        "ART_ru_basketball_i_4": "如果賽事在4節完場時間以及加時賽內沒有球隊得分，所有最先得分球隊的注單將被取消。",

                        "ART_ru_basketball_j": "最後得分球隊",
                        "ART_ru_basketball_j_1": "預測最後得分的球隊。",
                        "ART_ru_basketball_j_2": "如果賽事中斷， 所有最後得分球隊的注單將被取消。",
                        "ART_ru_basketball_j_3": "如果賽事在4節完場時間以及加時賽內沒有球隊得分，所有最後得分球隊的注單將被取消。",

                        "ART_ru_basketball_k": "單節最高得分球隊",
                        "ART_ru_basketball_k_1": "預測單節最高得分的球隊。",
                        "ART_ru_basketball_k_2": "加時賽不計算在內。",
                        "ART_ru_basketball_k_3": "如果賽事中斷，所有單節最高得分球隊的注單將被取消。",
                        "ART_ru_basketball_k_4": "如果賽事在4節完場時間以及加時賽內沒有球隊得分，所有最後單節最高得分球隊的注單將被取消。",

                        "ART_ru_basketball_l": "每節最先獲得20分的球隊",
                        "ART_ru_basketball_l_1": "預測每節最先得20分的球隊。",
                        "ART_ru_basketball_l_2": "加時賽不計算在內。",
                        "ART_ru_basketball_l_3": "如果賽事中斷前已有明確結果並且之後沒有任何顯著會影響賽事結果的情況，注單才會被結算。若遇到任何其他情況，注單將一律被取消。",
                        "ART_ru_basketball_l_4": "如果每節都沒有球隊獲得20分，所有註單將被取消。",
                        "ART_ru_basketball_l_5": "取決於賽事，玩法指定球隊需最先獲得的分數可能有變化，並且會清楚的顯示在盤口。",

                        "ART_ru_basketball_m": "籃球特別投注",
                        "ART_ru_basketball_m_1": "預測比分，搶斷，籃板，助攻，3分球等。",
                        "ART_ru_basketball_m_2": "雙方球員/球隊必須參與比賽，投注才被視為有效。",
                        "ART_ru_basketball_m_3": "如果一方或雙方球員/球隊沒有參與比賽，所有註單將被取消。",
                        "ART_ru_basketball_m_4": "注單的結算將根據NBA或特別官方機構公佈的結果為準，並且任何賽後更改的數據將被視為無效。",

                        "ART_ru_basketball_n": "球隊得分 – 最後一位數字",
                        "ART_ru_basketball_n_1": "預測主隊或客隊最終得分的最後一位數字。",

                        "ART_ru_basketball_o": "夢幻籃球遊戲規則",
                        "ART_ru_basketball_o_1": "夢幻籃球遊戲將從同一天的賽事中任意選擇兩個球隊（且原定不是在同一場賽事比賽的球隊）進行投注。",
                        "ART_ru_basketball_o_2": "夢幻比賽賽果會根據球隊真實的比分為準；夢幻比賽的讓分數則以球隊真實比分來計算。",
                        "ART_ru_basketball_o_3": "夢幻賽中的兩支球隊必須在同一天比賽，投注才被視為有效。",
                        "ART_ru_basketball_o_4": "如果球隊的比賽時間和本公司網站顯示的時間不同，所有涉及此球隊的夢幻賽注單將被視為無效。",
                        "ART_ru_basketball_o_5": "夢幻賽投注將不考慮賽事實際進行的場地。",
                        "ART_ru_basketball_o_6": "夢幻賽的舉例如下:",
                        "ART_ru_basketball_o_6_1": "波士頓凱爾特人101 – 98 芝加哥公牛，洛杉磯湖人118 – 101 奧蘭多魔術",
                        "ART_ru_basketball_o_6_2": "夢幻賽1： 波士頓凱爾特人vs 洛杉磯湖人",
                        "ART_ru_basketball_o_6_3": "夢幻賽賽果：波士頓凱爾特人101 – 118洛杉磯湖人",
                        "ART_ru_basketball_o_6_4": "夢幻賽的結算會根據各球隊原定比賽的真實得分為準。",
                        "ART_ru_basketball_o_7": "球隊一定要實際完成原定比賽並且已在賽事的官方機構（例如：NBA）留下賽果記錄，才能讓涉及此球隊的夢幻賽注單保持有效。如果球隊沒有完成原定比賽或最終賽果被官方否定，所有涉及此球隊的夢幻賽注單將被取消。",
                        "ART_ru_basketball_o_8": "所有夢幻賽都將按照籃球個別玩法的規則和標準裁決。",

                        "ART_ru_basketball_p": "淨勝球數",
                        "ART_ru_basketball_p_1": "預測在半場/全場/賽事單節的淨勝球數。",
                        "ART_ru_basketball_p_2": "賽事盤口包括全場、半場或單節投注。",

                        "ART_ru_basketball_q": "下一個3分球盤口 - 例如，第8個3分球命中",
                        "ART_ru_basketball_q_1": "預測哪支隊伍將取得指定的3分球命中。",
                        "ART_ru_basketball_q_2": "如果兩支隊伍都沒取得指定的3分球命中，該注單將被視為無效。",

                        "ART_ru_basketball_r": "3分球命中 –  讓球",
                        "ART_ru_basketball_r_1": "在整場比賽結束時，預測哪支隊伍將在3分球命中讓球盤口中獲勝。",

                        "ART_ru_basketball_s": "3分球命中 –大 / 小",
                        "ART_ru_basketball_s_1": "在整場比賽結束時，預測兩支隊伍的3分球命中是否會大於或小於指定的數量。",

                        "ART_ru_basketball_t": "3分球命中 - 獨贏",
                        "ART_ru_basketball_t_1": "預測哪支隊伍會在整場比賽結束時，獲得最多的3分球命中數。",
                        "ART_ru_basketball_t_2": "如果結果是平局，那麼注單將被視為“打平”，本金將被退還。",

                        "ART_ru_basketball_u": "隊伍3分球命中–大 /小",
                        "ART_ru_basketball_u_1": "預測在整場比賽結束時，指定隊伍的3分球命中是否會大於或小於指定的數量。",

                        "ART_ru_basketball_v": "電子籃球賽事",
                        "ART_ru_basketball_v_1": "比賽將以虛擬或真實玩家對決(PVP)模式開打。",
                        "ART_ru_basketball_v_2": "盤口的比賽名稱將註明比賽時間(例如：4x4、4x5分鐘), 且作為最終結算根據。",
                        "ART_ru_basketball_v_3": "比賽時間若無註明時，結算將以官方或相關體育權威機構數據結果為準。",
                        "ART_ru_basketball_v_4": "若由於技術或其他因素導致虛擬或真實玩家對戰比賽中斷且比賽無法繼續進行，所有投注將被取消。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_basketball": "BASKETBALL",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "08/05/2023",

                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_basketball_a_1": "If the scheduled venue is changed, all bets will be considered void.",
                        "ART_ru_basketball_a_2": "If a game is abandoned during the 1st half, all 1st half bets are considered void. If a game is abandoned during the 2nd half, all 2nd half bets are considered void, unless otherwise stated in the individual bet type rules. All 1st half bets will still be valid.",
                        "ART_ru_basketball_a_3": "For Quarter / Half Betting, the period must be completed for bets to be valid, unless explicitly stated below or in the individual Bet Type rules.",
                        "ART_ru_basketball_a_4": "NCAA Venue Rule: Please note, that the \"Home\" and \"Away\" venue indicated on the website is for reference only. Bets will stand regardless of change of venue, be it to the \"Home\" team\'s venue, the \"Away\" team\'s venue or to a \"Neutral\" venue.",
                        "ART_ru_basketball_a_5": "If the game starts before the scheduled time, only bets placed before the game commenced will be considered valid. Bets placed after the game commenced will be considered void. This excludes In-Play bet types.",
                        "ART_ru_basketball_a_6": "Overtime is included for any Game, 2nd Half betting or 2-leg tied match, unless otherwise stated. 4th Quarter betting does not include overtime.",
                        "ART_ru_basketball_a_7": "For 3 x 3 Basketball, settlement will be based on official competition rules especially for Streetball and Big3 match versions of the sport.",

                        "ART_ru_bettype": "BET TYPES",
                        "ART_ru_basketball_b": "Money Line",
                        "ART_ru_basketball_b_1": "Predict who will win the game. This market will contain the two teams.",
                        "ART_ru_basketball_b_2": "Markets offered may include Full Game, Match Halves or Quarter Betting.",

                        "ART_ru_basketball_c": "Handicap",
                        "ART_ru_basketball_c_1": "Predict who will win the game / period with the indicated handicap applied.",
                        "ART_ru_basketball_c_2": "If the game is suspended or cancelled during the 2nd half, all 1st half bets will still be valid.",
                        "ART_ru_basketball_c_3": "If the game is suspended or cancelled during the 2nd half, all 2nd half bets will be considered void.",
                        "ART_ru_basketball_c_4": "Markets offered may include Full Game, Match Halves or Quarter Betting.",

                        "ART_ru_basketball_d": "In-Play Handicap",
                        "ART_ru_basketball_d_1": "Predict who will win the game / period with the indicated handicap applied.",
                        "ART_ru_basketball_d_2": "Markets offered may include Full Game, Match Halves or Quarter Betting.",

                        "ART_ru_basketball_e": "Total Points: Over / Under",
                        "ART_ru_basketball_e_1": "Predict whether the total number of points scored will be over or under the indicated total line.",
                        "ART_ru_basketball_e_2": "Markets offered may include Full Game, Match Halves or Quarter Betting.",
                        "ART_ru_basketball_e_3": "If a game is abandoned, Over / Under bets will only be settled when the market has been unconditionally determined as any further potential points have no affect on the market result. In all other scenarios, bets will be considered void.",
                        "ART_ru_basketball_e_4": "If the game is abandoned during the 1st half, all 1st half bets will be void unless they have been unconditionally determined as any further potential points have no affect on the market result.",
                        "ART_ru_basketball_e_5": "If the game is abandoned during the 2nd half, all 1st half bets will still be valid.",
                        "ART_ru_basketball_e_6": "If the game is abandoned during the 2nd half, all 2nd half bets will be void unless they have been unconditionally determined as any further potential points have no affect on the market result.",
                        "ART_ru_basketball_e_7": "If the game is abandoned, all period bets will be void unless one of the two occurs:",
                        "ART_ru_basketball_e_7_1": "The period was already completed before the game was abandoned.",
                        "ART_ru_basketball_e_7_2": "The market has been unconditionally determined as any further potential points have no affect on the market result.",

                        "ART_ru_basketball_f": "Total Points: Over / Under (In Play)",
                        "ART_ru_basketball_f_1": "Predict whether the total number of points scored will be over or under the indicated total line.",
                        "ART_ru_basketball_f_2": "Settlement is based on the final score line and the total line is applied to a 0-0 score line.",
                        "ART_ru_basketball_f_3": "If a game is abandoned, Over / Under bets will only be settled when the market has been unconditionally determined as any further potential points have no affect on the market result. In all other scenarios, bets will be considered void.",

                        "ART_ru_basketball_g": "Team Points - Over / Under",
                        "ART_ru_basketball_g_1": "Predict whether the total number of points recorded by the stated team will be over or under the indicated line.",
                        "ART_ru_basketball_g_2": "Should the game be abandoned all bets will be considered void unless the market has been already settled or unconditionally determined as any further points will have no effect on the market result.",
                        "ART_ru_basketball_g_3": "All settlements will be based on post-match statistics provided by the relevant sporting body.",

                        "ART_ru_basketball_h": "Total Points: Odd / Even",
                        "ART_ru_basketball_h_1": "Predict whether the total number of points scored will be odd or even.",
                        "ART_ru_basketball_h_2": "Markets offered may include Full Game, Match Halves or Quarter Betting.",

                        "ART_ru_basketball_i": "Team to Score First",
                        "ART_ru_basketball_i_1": "Predict which team will score first in the game.",
                        "ART_ru_basketball_i_2": "If the game is abandoned at any time, and a team has already scored prior to the abandonment, all bets will stand.",
                        "ART_ru_basketball_i_3": "If neither team has scored at the time of abandonment, all bets are considered void.",
                        "ART_ru_basketball_i_4": "If neither team has scored after the scheduled 4 quarters of normal play and overtime, then bets are considered void.",

                        "ART_ru_basketball_j": "Team to Score Last",
                        "ART_ru_basketball_j_1": "Predict which team will score last in the game.",
                        "ART_ru_basketball_j_2": "If the game is abandoned at any time, then all bets will be considered void.",
                        "ART_ru_basketball_j_3": "If neither team has scored after the scheduled 4 quarters of normal play and overtime, then bets are considered void.",

                        "ART_ru_basketball_k": "Team with the Highest Scoring Quarter",
                        "ART_ru_basketball_k_1": "Predict which team will score the most in a single quarter.",
                        "ART_ru_basketball_k_2": "Overtime does not count.",
                        "ART_ru_basketball_k_3": "If the game is abandoned at any time, then all bets will be considered void.",
                        "ART_ru_basketball_k_4": "If neither team has scored after the scheduled 4 quarters of normal play, then bets are considered void.",

                        "ART_ru_basketball_l": "First Team to Score 20 Points in Each Quarter",
                        "ART_ru_basketball_l_1": "Predict which team will be the first to score 20 points in each quarter.",
                        "ART_ru_basketball_l_2": "Overtime does not count.",
                        "ART_ru_basketball_l_3": "If a game is abandoned, bets will only be settled when the market has been unconditionally determined as any further potential points have no affect on the market result. In all other scenarios, bets will be considered void.",
                        "ART_ru_basketball_l_4": "If neither team scores 20 points in each quarter, then bets are considered void.",
                        "ART_ru_basketball_l_5": "The number of points could vary, depending on the game. This will be clearly marked in the bet type.",

                        "ART_ru_basketball_m": "Basketball Specials",
                        "ART_ru_basketball_m_1": "Predict the number of points, steal ball, rebounds, assists, three points, etc.",
                        "ART_ru_basketball_m_2": "Both players / teams must play in the game for bets to be considered valid.",
                        "ART_ru_basketball_m_3": "If one or both players / teams do not take part in the game, all bets will be considered void.",
                        "ART_ru_basketball_m_4": "Bets will be settled according to the NBA or specific governing body\'s result announced at the end of the game and any subsequent changes to the statistics are considered invalid for betting purposes.",

                        "ART_ru_basketball_n": "Team Points - Last Digit",
                        "ART_ru_basketball_n_1": "Predict the last digit of the final score for the home or away team.",

                        "ART_ru_basketball_o": "Fantasy Basketball Game Rules",
                        "ART_ru_basketball_o_1": "Fantasy Basketball bets involve selecting any 2 teams out of any 2 matches (not playing in the same match) and playing on the same day.",
                        "ART_ru_basketball_o_2": "Fantasy match results will be based on the actual result of points scored; any handicap given for the basketball fantasy game will be taken into account for the final result of the fantasy match.",
                        "ART_ru_basketball_o_3": "The two teams involved in Fantasy matches must play on the same day for the bets to be considered valid.",
                        "ART_ru_basketball_o_4": "If a team\'s next fixture is played on a different day from that displayed in the company website, all Fantasy match-bets involving this team will be void. ",
                        "ART_ru_basketball_o_5": "The venues of these games are not considered in these fantasy game match ups.",
                        "ART_ru_basketball_o_6": "Here is an example of a Fantasy Game:",
                        "ART_ru_basketball_o_6_1": "Boston Celtic 101 - 98 Chicago Bulls, LA Lakers 118 - 101 Orlando Magic",
                        "ART_ru_basketball_o_6_2": "Fantasy Game 1: Boston Celtic vs LA Lakers ",
                        "ART_ru_basketball_o_6_3": "Boston Celtic 101 - LA Lakers 118",
                        "ART_ru_basketball_o_6_4": "The result will be based on the actual result of the respective matches.",
                        "ART_ru_basketball_o_7": "A team\'s next fixture must be completed and have its result upheld by the competition\'s official governing body (e.g. NBA) in order for Fantasy match-bets involving this team to stand. If a team\'s next fixture is not completed or its result is overturned by the competition\'s official governing body, bets on that team will not stand and shall be considered void.",
                        "ART_ru_basketball_o_8": "All fantasy matches will follow existing Basketball rules.",

                        "ART_ru_basketball_p": "Winning Margin",
                        "ART_ru_basketball_p_1": "Predict the number of points that separate the winning team from the losing team at the end of a specific period.",
                        "ART_ru_basketball_p_2": "Markets offered may include Full Game, Match Halves or Quarter Betting.",

                        "ART_ru_basketball_q": "Next 3 Point Markets – Example, 8th 3-Point Made (3PM) ",
                        "ART_ru_basketball_q_1": "Predict which Team will score the specific 3-Point Made (3PM) listed. ",
                        "ART_ru_basketball_q_2": "If neither team scores that specific 3-Point, then bets are considered void. ",

                        "ART_ru_basketball_r": "3 Points Made (3PM) – Handicap ",
                        "ART_ru_basketball_r_1": "Predict which Team will win the 3-Points Made market with the indicated Handicap applied at the end of the Full Game. ",

                        "ART_ru_basketball_s": "3 Points Made (3PM) – Over / Under ",
                        "ART_ru_basketball_s_1": "Predict whether the total 3-Points Made by both teams will be over or under the indicated line at the end of the Full Game. ",

                        "ART_ru_basketball_t": "3 Points Made (3PM) – Winner ",
                        "ART_ru_basketball_t_1": "Predict which team will record the most 3-Points Made at the end of the Full Game. ",
                        "ART_ru_basketball_t_2": "If the result is a draw then wagers will be considered a “push” and the stake will be refunded.",

                        "ART_ru_basketball_u": "Team 3 Points Made (3PM) – Over / Under ",
                        "ART_ru_basketball_u_1": "Predict whether the 3-Points Made for the specific team listed will be over or under the indicated line at the end of the Full Game. ",

                        "ART_ru_basketball_v": "E-BASKETBALL",
                        "ART_ru_basketball_v_1": "These matches may be offered in virtual simulation or player format.",
                        "ART_ru_basketball_v_2": "Settlement will be based on the official score at the end of the match duration stated within the Competition Name (e.g. 4x4, 4x5 Mins Play)",
                        "ART_ru_basketball_v_3": "Should no duration be stated, settlement will be based on the official score of the match under that specific competition.",
                        "ART_ru_basketball_v_4": "Should a virtual simulation or player v player match fail to finish due to technical or any other reason, all wagers will be considered void.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_basketball": "篮球",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "08/05/2023",

                        "ART_ru_rule": "一般规则",
                        "ART_ru_basketball_a_1": "如果比赛场地有变更，所有注单将被取消。",
                        "ART_ru_basketball_a_2": "如果赛事是在上半场中断，所有上半场的注单将被取消。如果赛事是在下半场中断所有上半场的投注保持有效，但所有下半场的注单将被取消，除非在个别玩法规则另有注明。",
                        "ART_ru_basketball_a_3": "单节/半场的投注，比赛必须完成赛节注单才被视为有效，除非在个别玩法规则另有注明。",
                        "ART_ru_basketball_a_4": "美国大学篮球联赛场地规则：盘口指示的\"主场\"和\"客场\"信息仅供参考。无论原定场地是否更改为\"主场\"，\"客场\"或\"中立场\"，所有注单将保持有效。",
                        "ART_ru_basketball_a_5": "如比赛在法定时间提前进行，在比赛开始前的投注依然有效，在比赛开始后的所有投注均视为无效(滚球投注另作别论)。",
                        "ART_ru_basketball_a_6": "对比赛的所有投注和下半场或两回合制的投注都包括加时赛，除非另有注明。第四节投注不包括加时赛。",
                        "ART_ru_basketball_a_7": "对于3 x3篮球，结算将基于官方比赛规则。",

                        "ART_ru_bettype": "投注类型",
                        "ART_ru_basketball_b": "独赢",
                        "ART_ru_basketball_b_1": "预测哪一支球队将在比赛胜出。盘口提供两支球队为投注选项。",
                        "ART_ru_basketball_b_2": "赛事盘口包括全场、半场或单节投注。",

                        "ART_ru_basketball_c": "让球",
                        "ART_ru_basketball_c_1": "预测哪一支球队在盘口指定的让分球数在半场/全场/赛事单节赢得比赛。",
                        "ART_ru_basketball_c_2": "如果赛事在下半场取消或中断，所有上半场注单保持有效。",
                        "ART_ru_basketball_c_3": "如果赛事在下半场取消或中断，所有下半场注单将被取消。",
                        "ART_ru_basketball_c_4": "赛事盘口包括全场、半场或单节投注。",

                        "ART_ru_basketball_d": "滚球让球",
                        "ART_ru_basketball_d_1": "预测哪一支球队在盘口指定的让分数里赢得半场/全场/赛事单节的比赛。",
                        "ART_ru_basketball_d_2": "赛事盘口包括全场、半场或单节投注。",

                        "ART_ru_basketball_e": "总分： 大 / 小",
                        "ART_ru_basketball_e_1": "预测赛事总比分将大于或小于在盘口指定的大/小盘分数。",
                        "ART_ru_basketball_e_2": "赛事盘口包括全场、半场或单节投注。",
                        "ART_ru_basketball_e_3": "如果赛事中断前已有明确结果并且之后没有任何显著会影响赛事结果的情况，大/小盘注单才会被结算。若遇到任何其他情况，注单将一律被取消。",
                        "ART_ru_basketball_e_4": "如果赛事在上半场中断，所有上半场注单将被取消，除非中断前已有明确结果并且之后没有任何显著会影响赛事结果的情况注单才会被结算。",
                        "ART_ru_basketball_e_5": "如果赛事在下半场取消或中断，所有上半场注单保持有效。",
                        "ART_ru_basketball_e_6": "如果赛事在下半场取消或中断，所有下半场注单将被取消，除非中断前已有明确结果并且之后没有任何显著会影响赛事结果的情况注单才会被结算。",
                        "ART_ru_basketball_e_7": "如果赛事中断, 所有时节的注单将被取消除非遇到以下其中一个情况：",
                        "ART_ru_basketball_e_7_1": "投注的时节是在比赛中断前。",
                        "ART_ru_basketball_e_7_2": "比赛中断前已有明确结果并且之后没有任何显著会影响赛事结果的情况。",

                        "ART_ru_basketball_f": "滚球总分： 大 / 小",
                        "ART_ru_basketball_f_1": "预测赛事总比分将大于或小于在盘口指定的大/小盘分数。",
                        "ART_ru_basketball_f_2": "结算是以0-0的比分在比赛/时节结束后按盘口开出的让分数做裁决。投注当时的比分对结算没有影响。",
                        "ART_ru_basketball_f_3": "如果赛事中断前已有明确结果并且之后没有任何显著会影响赛事结果的情况，大/小盘注单才会被结算。若遇到任何其他情况，注单将一律被取消。",

                        "ART_ru_basketball_g": "球队得分 - 大 / 小",
                        "ART_ru_basketball_g_1": "预测赛事主队/客队的总分数将大于或小于在盘口指定的大/小盘分数。",
                        "ART_ru_basketball_g_2": "如果赛事取消，所有的注单将会被认为无效，除非注单在中断前已经结算或者在中断前已有明确的结果并且之后没有任何显著会影响赛事结果的情况注单才会被结算。",
                        "ART_ru_basketball_g_3": "所有注单的结算都是依据相关体育机构的官方统计数据为准。",

                        "ART_ru_basketball_h": "总分: 单 / 双",
                        "ART_ru_basketball_h_1": "预测赛事的总比分是单数或双数。",
                        "ART_ru_basketball_h_2": "赛事盘口包括全场、半场或单节投注。",

                        "ART_ru_basketball_i": "最先得分球队",
                        "ART_ru_basketball_i_1": "预测最先得分的球队。",
                        "ART_ru_basketball_i_2": "如果赛事在有得分后中断，所有最先得分球队的注单将保持有效。",
                        "ART_ru_basketball_i_3": "如果赛事在没有球队得分前中断，所有最先得分球队的注单将被取消。",
                        "ART_ru_basketball_i_4": "如果赛事在4节完场时间以及加时赛内没有球队得分，所有最先得分球队的注单将被取消。",

                        "ART_ru_basketball_j": "最后得分球队",
                        "ART_ru_basketball_j_1": "预测最后得分的球队。",
                        "ART_ru_basketball_j_2": "如果赛事中断， 所有最后得分球队的注单将被取消。",
                        "ART_ru_basketball_j_3": "如果赛事在4节完场时间以及加时赛内没有球队得分，所有最后得分球队的注单将被取消。",

                        "ART_ru_basketball_k": "单节最高得分球队",
                        "ART_ru_basketball_k_1": "预测单节最高得分的球队。",
                        "ART_ru_basketball_k_2": "加时赛不计算在内。",
                        "ART_ru_basketball_k_3": "如果赛事中断，所有单节最高得分球队的注单将被取消。",
                        "ART_ru_basketball_k_4": "如果赛事在4节完场时间以及加时赛内没有球队得分，所有最后单节最高得分球队的注单将被取消。",

                        "ART_ru_basketball_l": "每节最先获得20分的球队",
                        "ART_ru_basketball_l_1": "预测每节最先得20分的球队。",
                        "ART_ru_basketball_l_2": "加时赛不计算在内。",
                        "ART_ru_basketball_l_3": "如果赛事中断前已有明确结果并且之后没有任何显著会影响赛事结果的情况，注单才会被结算。若遇到任何其他情况，注单将一律被取消。",
                        "ART_ru_basketball_l_4": "如果每节都没有球队获得20分，所有注单将被取消。",
                        "ART_ru_basketball_l_5": "取决于赛事，玩法指定球队需最先获得的分数可能有变化，并且会清楚的显示在盘口。",

                        "ART_ru_basketball_m": "篮球特别投注",
                        "ART_ru_basketball_m_1": "预测比分，抢断，篮板，助攻，3分球等。",
                        "ART_ru_basketball_m_2": "双方球员/球队必须参与比赛，投注才被视为有效。",
                        "ART_ru_basketball_m_3": "如果一方或双方球员/球队没有参与比赛，所有注单将被取消。",
                        "ART_ru_basketball_m_4": "注单的结算将根据NBA或特别官方机构公布的结果为准，并且任何赛后更改的数据将被视为无效。",

                        "ART_ru_basketball_n": "球队得分 – 最后一位数字",
                        "ART_ru_basketball_n_1": "预测主队或客队最终得分的最后一位数字。",

                        "ART_ru_basketball_o": "梦幻篮球游戏规则",
                        "ART_ru_basketball_o_1": "梦幻篮球游戏将从同一天的赛事中任意选择两个球队（且原定不是在同一场赛事比赛的球队）进行投注。",
                        "ART_ru_basketball_o_2": "梦幻比赛赛果会根据球队真实的比分为准；梦幻比赛的让分数则以球队真实比分来计算。",
                        "ART_ru_basketball_o_3": "梦幻赛中的两支球队必须在同一天比赛，投注才被视为有效。",
                        "ART_ru_basketball_o_4": "如果球队的比赛时间和本公司网站显示的时间不同，所有涉及此球队的梦幻赛注单将被视为无效。",
                        "ART_ru_basketball_o_5": "梦幻赛投注将不考虑赛事实际进行的场地。",
                        "ART_ru_basketball_o_6": "梦幻赛的举例如下:",
                        "ART_ru_basketball_o_6_1": "波士顿凯尔特人101 – 98 芝加哥公牛，洛杉矶湖人118 – 101 奥兰多魔术",
                        "ART_ru_basketball_o_6_2": "梦幻赛1： 波士顿凯尔特人vs 洛杉矶湖人",
                        "ART_ru_basketball_o_6_3": "梦幻赛赛果：波士顿凯尔特人101 – 118洛杉矶湖人",
                        "ART_ru_basketball_o_6_4": "梦幻赛的结算会根据各球队原定比赛的真实得分为准。",
                        "ART_ru_basketball_o_7": "球队一定要实际完成原定比赛并且已在赛事的官方机构（例如：NBA）留下赛果记录，才能让涉及此球队的梦幻赛注单保持有效。如果球队没有完成原定比赛或最终赛果被官方否定，所有涉及此球队的梦幻赛注单将被取消。",
                        "ART_ru_basketball_o_8": "所有梦幻赛都将按照篮球个别玩法的规则和标准裁决。",

                        "ART_ru_basketball_p": "净胜球数",
                        "ART_ru_basketball_p_1": "预测在半场/全场/赛事单节的净胜球数。",
                        "ART_ru_basketball_p_2": "赛事盘口包括全场、半场或单节投注。",

                        "ART_ru_basketball_q": "下一个3分球盘口 - 例如，第8个3分球命中",
                        "ART_ru_basketball_q_1": "预测哪支队伍将取得指定的3分球命中。",
                        "ART_ru_basketball_q_2": "如果两支队伍都没取得指定的3分球命中，该注单将被视为无效。",

                        "ART_ru_basketball_r": "3分球命中 –  让球",
                        "ART_ru_basketball_r_1": "在整场比赛结束时，预测哪支队伍将在3分球命中让球盘口中获胜。",

                        "ART_ru_basketball_s": "3分球命中 –大 / 小",
                        "ART_ru_basketball_s_1": "在整场比赛结束时，预测两支队伍的3分球命中是否会大于或小于指定的数量。",

                        "ART_ru_basketball_t": "3分球命中 - 独赢",
                        "ART_ru_basketball_t_1": "预测哪支队伍会在整场比赛结束时，获得最多的3分球命中数。",
                        "ART_ru_basketball_t_2": "如果结果是平局，那么注单将被视为“打平”，本金将被退还。",

                        "ART_ru_basketball_u": "队伍3分球命中–大 /小",
                        "ART_ru_basketball_u_1": "预测在整场比赛结束时，指定队伍的3分球命中是否会大于或小于指定的数量。",

                        "ART_ru_basketball_v": "电子篮球赛事",
                        "ART_ru_basketball_v_1": "比赛将以虚拟或真实玩家对决(PVP)模式开打。",
                        "ART_ru_basketball_v_2": "盘口的比赛名称将注明比赛时间(例如：4x4、4x5分钟), 且作为最终结算根据。",
                        "ART_ru_basketball_v_3": "比赛时间若无注明时，结算将以官方或相关体育权威机构数据结果为准。",
                        "ART_ru_basketball_v_4": "若由于技术或其他因素导致虚拟或真实玩家对战比赛中断且比赛无法继续进行，所有投注将被取消。",
                        ';
                        break;
                }
                break;
            case "tennis":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_tennis": "網球",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "09/06/2023",

                        "ART_ru_rule": "一般規則",
                        "ART_ru_tennis_a_1": "除非在個別投注類型規則中另有說明否則當比賽或指定時段未完全進行公司有權作出取消注單的權利。",
                        "ART_ru_tennis_a_2": "如果比賽的計分方式與原先指定不同，所有注單將被視為無效。",
                        "ART_ru_tennis_a_3": "如果在比賽前或比賽中突然更換球場，從室內到室外或反之，或地面，所有注單將被視為有效。",
                        "ART_ru_tennis_a_4": "如果比賽提前開賽，僅有在開賽之前投注的注單將視為有效投注。開賽後投注的注單將被視為無效，滾球玩法除外。",
                        "ART_ru_tennis_a_5": "搶七或搶十決勝局視為一局將計入結算範圍。",

                        "ART_ru_bettype": "投注類型",

                        "ART_ru_tennis_b": "獨贏",
                        "ART_ru_tennis_b_1": "預測哪個球員將會贏得比賽。",

                        "ART_ru_tennis_c": "讓盤",
                        "ART_ru_tennis_c_1": "預測哪一位球員在盤口指定的讓盤數贏得比賽。",

                        "ART_ru_tennis_d": "讓局",
                        "ART_ru_tennis_d_1": "預測哪一位球員在盤口指定的讓局數在某個時節（例如:全場比賽/第一盤/第二盤）贏得最多局。",

                        "ART_ru_tennis_e": "局獲勝者（獲勝者 – 盤X 局 X）",
                        "ART_ru_tennis_e_1": "預測指定盤的指定局誰將獲勝（例如第一盤第一局）。",

                        "ART_ru_tennis_f": "以對手15/30贏局 - 盤X,局Y",
                        "ART_ru_tennis_f_1": "預測在指定盤的指定局任何一個球員將與對手15分或30分贏局。<br><br>例如：",
                        "ART_ru_tennis_f_1_1": "第一盤,第一局:贏局-15或贏局-30。",
                        "ART_ru_tennis_f_1_2": "第一盤,第一局:15-贏局或30-贏局。",

                        "ART_ru_tennis_g": "盤X,局Y: 總得分數大/小",
                        "ART_ru_tennis_g_1": "預測在指定盤的指定局的總得分數 (例如:第一盤,第一局) 將大於或小於盤口指定的總得分數線。<br><br>例如：",
                        "ART_ru_tennis_g_1_1": "第一盤,第一局: 4-0(Win-0), 4-1(Win-15), 4-2(Win-30) 或5-3(Win-40)。",

                        "ART_ru_tennis_h": "總局數： 大 / 小",
                        "ART_ru_tennis_h_1": "預測比賽中的某個時節（例如:全場比賽/第一盤/第二盤）進行的總局數將大於或小於在盤口指定的大/小盤局數。",

                        "ART_ru_tennis_i": "總局數：單 / 雙",
                        "ART_ru_tennis_i_1": "預測比賽中的某個時節（例如:全場比賽/第一盤/第二盤）進行的總局數是單數或雙數。",

                        "ART_ru_tennis_j": "單盤投注",
                        "ART_ru_tennis_j_1": "預測單盤最終結果。",

                        "ART_ru_tennis_k": "波膽",
                        "ART_ru_tennis_k_1": "預測比賽的每盤比分。",

                        "ART_ru_tennis_l": "球員總場數-大/小",
                        "ART_ru_tennis_l_1": "預測哪一位球員或一對球員在比賽中贏得總場數將大於或小於盤口指定的總場數線。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_tennis": "TENNIS",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "26/06/2023",

                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_tennis_a_1": "Unless stated otherwise in the individual Bet Type Rules, the company reserves the right to void wagers if a match or a specific period of a match is not played to completion.",
                        "ART_ru_tennis_a_2": "If the scoring format of a match differs from what was originally indicated, all bets will be void.",
                        "ART_ru_tennis_a_3": "If there is a sudden change of venue (e.g., indoor to outdoor or vice versa) or court surface, before or during a match, all bets will be valid.",
                        "ART_ru_tennis_a_4": "If a match starts before schedule only the transactions before the first point of the match will be considered valid. Transactions after the first point of the match will be considered invalid. (Except in-play bet types)",
                        "ART_ru_tennis_a_5": "A ‘Super Tie-Break’ is considered as a game, for settlement purposes.",

                        "ART_ru_bettype": "BET TYPES",

                        "ART_ru_tennis_b": "Winner",
                        "ART_ru_tennis_b_1": "Predict who will win the match.",

                        "ART_ru_tennis_c": "Set Handicap",
                        "ART_ru_tennis_c_1": "Predict who will win the match with the indicated set handicap applied.",

                        "ART_ru_tennis_d": "Game Handicap",
                        "ART_ru_tennis_d_1": "Predict who will win more games in a specified period (e.g. Match, 1st Set, 2nd Set) after applying the indicated handicap.",

                        "ART_ru_tennis_e": "Game Winner (Winner – Set X Game X)",
                        "ART_ru_tennis_e_1": "Predict who will win a specific game of a specific set (e.g. Set 1 Game 1).",

                        "ART_ru_tennis_f": "Game at 15/30 - Set X, Game Y",
                        "ART_ru_tennis_f_1": "Predict whether the specified game (e.g., Set 1, Game 1) will end with either player winning the game, while their opponent scores only 15 or 30. E.g., Win-15, Win-30 or 15-Win, or 30-Win",

                        "ART_ru_tennis_g": "Total Points: Over / Under - Set X, Game Y",
                        "ART_ru_tennis_g_1": "Predict whether the total number of points played in a specified game (e.g., Set 1, Game 1) will be over or under the indicated line. E.g., 4-0 (Win-0), 4-1 (Win-15), 4-2 (Win-30).",

                        "ART_ru_tennis_h": "Total Games: Over / Under",
                        "ART_ru_tennis_h_1": "Predict whether the total number of games played in a specified period (e.g. Match, 1st Set, 2nd Set) will be over or under the indicated total line.",

                        "ART_ru_tennis_i": "Total Games: Odd / Even",
                        "ART_ru_tennis_i_1": "Predict whether the total number of games played in a specified period (e.g. Match, 1st Set, 2nd Set) will be odd or even.",

                        "ART_ru_tennis_j": "Set Betting Markets",
                        "ART_ru_tennis_j_1": "Predict the outcome of the specified set.",

                        "ART_ru_tennis_k": "Match Correct Score",
                        "ART_ru_tennis_k_1": "Predict the final sets score of the match.",

                        "ART_ru_tennis_l": "Total Points - Over / Under",
                        "ART_ru_tennis_l_1": "Predict whether the total number of points won by a player or pair of players in a match will be over or under the indicated total line.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_tennis": "网球",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "09/06/2023",

                        "ART_ru_rule": "一般规则",
                        "ART_ru_tennis_a_1": "除非在个别投注类型规则中另有说明否则当比赛或指定时段未完全进行公司有权作出取消注单的权利。",
                        "ART_ru_tennis_a_2": "如果比赛的计分方式与原先指定不同，所有注单将被视为无效。",
                        "ART_ru_tennis_a_3": "如果在比赛前或比赛中突然更换球场，从室内到室外或反之，或地面，所有注单将被视为有效。",
                        "ART_ru_tennis_a_4": "如果比赛提前开赛，仅有在开赛之前投注的注单将视为有效投注。开赛后投注的注单将被视为无效，滚球玩法除外。",
                        "ART_ru_tennis_a_5": "抢七或抢十决胜局视为一局将计入结算范围。",

                        "ART_ru_bettype": "投注类型",

                        "ART_ru_tennis_b": "独赢",
                        "ART_ru_tennis_b_1": "预测哪个球员将会赢得比赛。",

                        "ART_ru_tennis_c": "让盘",
                        "ART_ru_tennis_c_1": "预测哪一位球员在盘口指定的让盘数赢得比赛。",

                        "ART_ru_tennis_d": "让局",
                        "ART_ru_tennis_d_1": "预测哪一位球员在盘口指定的让局数在某个时节（例如:全场比赛/第一盘/第二盘）赢得最多局。",

                        "ART_ru_tennis_e": "局获胜者（获胜者 – 盘X 局 X）",
                        "ART_ru_tennis_e_1": "预测指定盘的指定局谁将获胜（例如第一盘第一局）。",

                        "ART_ru_tennis_f": "以对手15/30赢局 - 盘X,局Y",
                        "ART_ru_tennis_f_1": "预测在指定盘的指定局任何一个球员将与对手15分或30分赢局。<br><br>例如：",
                        "ART_ru_tennis_f_1_1": "第一盘,第一局:赢局-15或赢局-30。",
                        "ART_ru_tennis_f_1_2": "第一盘,第一局:15-赢局或30-赢局。",

                        "ART_ru_tennis_g": "盘X,局Y: 总得分数大/小",
                        "ART_ru_tennis_g_1": "预测在指定盘的指定局的总得分数 (例如:第一盘,第一局) 将大于或小于盘口指定的总得分数线。<br><br>例如：",
                        "ART_ru_tennis_g_1_1": "第一盘,第一局: 4-0(Win-0), 4-1(Win-15), 4-2(Win-30) 或5-3(Win-40)。",

                        "ART_ru_tennis_h": "总局数： 大 / 小",
                        "ART_ru_tennis_h_1": "预测比赛中的某个时节（例如:全场比赛/第一盘/第二盘）进行的总局数将大于或小于在盘口指定的大/小盘局数。",

                        "ART_ru_tennis_i": "总局数：单 / 双",
                        "ART_ru_tennis_i_1": "预测比赛中的某个时节（例如:全场比赛/第一盘/第二盘）进行的总局数是单数或双数。",

                        "ART_ru_tennis_j": "单盘投注",
                        "ART_ru_tennis_j_1": "预测单盘最终结果。",

                        "ART_ru_tennis_k": "波胆",
                        "ART_ru_tennis_k_1": "预测比赛的每盘比分。",

                        "ART_ru_tennis_l": "球员总场数-大/小",
                        "ART_ru_tennis_l_1": "预测哪一位球员或一对球员在比赛中赢得总场数将大于或小于盘口指定的总场数线。",
                        ';
                        break;
                }
                break;
            case "volleyball":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_volleyball": "排球",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "29/09/2016",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_volleyball_a_1": "所有註單都以全場賽事結束視為有效，除非另有特別說明。",
                        "ART_ru_volleyball_a_2": "賽事以五局三勝制，所有的投注都將​​依首先贏得三局的球隊為準。",
                        "ART_ru_volleyball_a_3": "如果比賽預定時間縮短，或者賽事獲勝要求比分提高，所有註單將被取消。",
                        "ART_ru_volleyball_a_4": "如果比賽提前開賽，只有在開賽之前投注的注單將為視為有效投注。在開賽後投注的注單將被視為無效， 滾球玩法除外。",
                    
                        "ART_ru_bettype": "投注類型",
                    
                        "ART_ru_volleyball_b": "獨贏",
                        "ART_ru_volleyball_b_1": "預測哪個球員將會贏取比賽的勝利。這個比賽包含雙方球員。",
                    
                        "ART_ru_volleyball_c": "讓盤 / 讓局",
                        "ART_ru_volleyball_c_1": "預測哪一位球員在盤口指定的讓盤/局數贏得比賽。",
                    
                        "ART_ru_volleyball_d": "總盤/總局數： 大 / 小",
                        "ART_ru_volleyball_d_1": "預測比賽進行的總盤/局數是大於或小於盤口指定的大小盤局數。",
                    
                        "ART_ru_volleyball_e": "讓分",
                        "ART_ru_volleyball_e_1": "預測在某個時節 哪一位球員在盤口指定的讓分數贏得比賽。",
                    
                        "ART_ru_volleyball_f": "總分： 大 / 小",
                        "ART_ru_volleyball_f_1": "預測提名的球員在某一特定的時間段內的個人總得分將大於或小於盤口指定的總分數線。",
                    
                        "ART_ru_volleyball_g": "球員/球隊得分 -大/小",
                        "ART_ru_volleyball_g_1": "預測主場或客場的總比分是大於還是小於指定盤口。",
                        "ART_ru_volleyball_g_2": "如果賽事中斷，除非市場已經派彩或任何將來的得分不會影響到賽果的投注有效，其他所有注單一律視為無效。",
                    
                        "ART_ru_volleyball_h": "波膽",
                        "ART_ru_volleyball_h_1": "預測一個特定賽事全場的正確比分。",
                        "ART_ru_volleyball_h_2": "結算將依據相關部門最終公佈的比分為準。",
                        "ART_ru_volleyball_h_3": "如果注單在賽事中斷前已得到明確的勝負，並且任何進一步的賽果均不會對注單結果產生影響的情況下，注單會被視為有效。",
                    
                        "ART_ru_volleyball_i": "單/雙",
                        "ART_ru_volleyball_i_1": "預測在某一特定的時間段內比賽進行的總局數、盤數或分數是單數還是雙數。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_volleyball": "VOLLEYBALL",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "29/09/2016",
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_volleyball_a_1": "All bets will be considered valid only when the match is finished, unless otherwise stated.",
                        "ART_ru_volleyball_a_2": "Bets will be settled based on the team that wins the first 3 sets out of the total 5 sets played.",
                        "ART_ru_volleyball_a_3": "If the scheduled duration of a match is reduced or if there is an increase in the number of points to win, all bets will be voided.",
                        "ART_ru_volleyball_a_4": "If a match starts before schedule, only the transactions before the game starts will be considered valid. The transactions after the match starts will be considered invalid. (Except in-play bet types).",
                    
                        "ART_ru_bettype": "BET TYPES",
                    
                        "ART_ru_volleyball_b": "Money Line / Winner",
                        "ART_ru_volleyball_b_1": "Predict who will win the match. This market will contain the two players.",
                    
                        "ART_ru_volleyball_c": "Set / Game - Handicap",
                        "ART_ru_volleyball_c_1": "Predict who will win the match with the indicated set / game handicap applied.",
                    
                        "ART_ru_volleyball_d": "Set / Game - Over / Under",
                        "ART_ru_volleyball_d_1": "Predict whether the number of sets / games will be over or under the indicated number.",
                    
                        "ART_ru_volleyball_e": "Point Handicap",
                        "ART_ru_volleyball_e_1": "Predict who will win more points in a specified period after applying the indicated point handicap.",
                    
                        "ART_ru_volleyball_f": "Total Points - Over / Under",
                        "ART_ru_volleyball_f_1": "Predict whether the total number of points won by a nominated player in a specific period will be over or under the indicated total line.",
                    
                        "ART_ru_volleyball_g": "Player / Team Points - Over / Under",
                        "ART_ru_volleyball_g_1": "Predict whether the total number of points recorded by the home or away team will be over or under the indicated line.",
                        "ART_ru_volleyball_g_2": "Should the game be abandoned all bets will be considered void unless the market has been already settled or unconditionally determined as any further points will have no effect on the market result.",
                    
                        "ART_ru_volleyball_h": "Match Correct Score",
                        "ART_ru_volleyball_h_1": "Predict the Correct Score at Full Time of a specified match.",
                        "ART_ru_volleyball_h_2": "Settlements we be based on the post match score as advertised by the relevant governing body.",
                        "ART_ru_volleyball_h_3": "If the match is abandoned, suspended or postponed, only bets placed on markets that have been unconditionally determined will be considered valid.",
                    
                        "ART_ru_volleyball_i": "Odd / Even",
                        "ART_ru_volleyball_i_1": "Predict whether the total number of games, sets or points played in a specific period will be odd or even.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_volleyball": "排球",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "29/09/2016",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_volleyball_a_1": "所有注单都以全场赛事结束视为有效，除非另有特别说明。",
                        "ART_ru_volleyball_a_2": "赛事以五局三胜制，所有的投注都将​​依首先赢得三局的球队为准。",
                        "ART_ru_volleyball_a_3": "如果比赛预定时间缩短，或者赛事获胜要求比分提高，所有注单将被取消。",
                        "ART_ru_volleyball_a_4": "如果比赛提前开赛，只有在开赛之前投注的注单将为视为有效投注。在开赛后投注的注单将被视为无效， 滚球玩法除外。",
                    
                        "ART_ru_bettype": "投注类型",
                    
                        "ART_ru_volleyball_b": "独赢",
                        "ART_ru_volleyball_b_1": "预测哪个球员将会赢取比赛的胜利。这个比赛包含双方球员。",
                    
                        "ART_ru_volleyball_c": "让盘 / 让局",
                        "ART_ru_volleyball_c_1": "预测哪一位球员在盘口指定的让盘/局数赢得比赛。",
                    
                        "ART_ru_volleyball_d": "总盘/总局数： 大 / 小",
                        "ART_ru_volleyball_d_1": "预测比赛进行的总盘/局数是大于或小于盘口指定的大小盘局数。",
                    
                        "ART_ru_volleyball_e": "让分",
                        "ART_ru_volleyball_e_1": "预测在某个时节 哪一位球员在盘口指定的让分数赢得比赛。",
                    
                        "ART_ru_volleyball_f": "总分： 大 / 小",
                        "ART_ru_volleyball_f_1": "预测提名的球员在某一特定的时间段内的个人总得分将大于或小于盘口指定的总分数线。",
                    
                        "ART_ru_volleyball_g": "球员/球队得分 -大/小",
                        "ART_ru_volleyball_g_1": "预测主场或客场的总比分是大于还是小于指定盘口。",
                        "ART_ru_volleyball_g_2": "如果赛事中断，除非市场已经派彩或任何将来的得分不会影响到赛果的投注有效，其他所有注单一律视为无效。",
                    
                        "ART_ru_volleyball_h": "波胆",
                        "ART_ru_volleyball_h_1": "预测一个特定赛事全场的正确比分。",
                        "ART_ru_volleyball_h_2": "结算将依据相关部门最终公布的比分为准。",
                        "ART_ru_volleyball_h_3": "如果注单在赛事中断前已得到明确的胜负，并且任何进一步的赛果均不会对注单结果产生影响的情况下，注单会被视为有效。",
                    
                        "ART_ru_volleyball_i": "单/双",
                        "ART_ru_volleyball_i_1": "预测在某一特定的时间段内比赛进行的总局数、盘数或分数是单数还是双数。",
                        ';
                        break;
                }
                break;
            case "badminton":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_badminton": "羽毛球",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "05/02/2021",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_badminton_a_1": "所有投注的注單均在比賽結束後才被視為有效，除非另有註明。",
                        "ART_ru_badminton_a_2": "如果投注的球員或組合沒有參與比賽，所有投注此球員的注單(排除獨贏)將被視為無效",
                        "ART_ru_badminton_a_3": "如果一名球員或組合在比賽未結束前退出或被取消資格，所有該場賽事的注單將被視為無效。",
                        "ART_ru_badminton_a_4": "如果比賽預定時間縮短或者需獲勝比賽的比分提高，所有注單將被視為無效。",
                        "ART_ru_badminton_a_5": "如果賽事延期或中斷，只要比賽最後有完成，所有投注將保持有效。",
                        "ART_ru_badminton_a_6": "如果比賽在法定時間提前進行，在比賽開始前的投注依然有效，在比賽開始後的所有投注均視為無效(滾球玩法除外)。",
                    
                        "ART_ru_bettype": "投注類型",
                        "ART_ru_badminton_b": "獨贏",
                        "ART_ru_badminton_b_1": "預測哪個球員將會贏取比賽的勝利。這個比賽包含雙方球員。",
                    
                        "ART_ru_badminton_j": "總分獲勝者（獲勝者 – 局X 分數 X）",
                        "ART_ru_badminton_j_1": "預測指定盤的指定分數誰將獲勝。（例如第一局第一分）",
                        "ART_ru_badminton_j_2": "如果某盤沒有進行指定分數，則該分數所有注單將被取消。（例如第一局,40分，但是該局結束於21-28）",
                        "ART_ru_badminton_j_3": "如果一名球員退出或被取消資格，任何沒有最終獲勝者的分數所有注單將被取消，已結束的分數注單將視為有效。",
                    
                        "ART_ru_badminton_k": "局 X- 先得 X 分數",
                        "ART_ru_badminton_k_1": "預測哪一位球員在賽事中最先達到指定的分數。(例如第一局，先得5分）",
                        "ART_ru_badminton_k_2": "如果一名球員退出或被取消資格，沒有最終獲勝者的所有注單將被取消，已結束的注單將視為有效。",
                    
                        "ART_ru_badminton_c": "讓盤 / 讓局",
                        "ART_ru_badminton_c_1": "預測哪一位球員在盤口指定的讓盤/局數贏得比賽。",
                    
                        "ART_ru_badminton_d": "總盤/總局數：大/小",
                        "ART_ru_badminton_d_1": "預測比賽進行的總盤/局數是大於或小於盤口指定的大小盤局數。",
                    
                        "ART_ru_badminton_e": "讓分",
                        "ART_ru_badminton_e_1": "預測在某個時節，哪一位球員在盤口指定的讓分數贏的比賽。",
                    
                        "ART_ru_badminton_f": "總分：大/小",
                        "ART_ru_badminton_f_1": "預測提名的球員在某一特定的時間段內的個人總得分將大於或小於盤口指定的總分數線。",
                    
                        "ART_ru_badminton_g": "球員/球隊得分 -大/小",
                        "ART_ru_badminton_g_1": "預測主場或客場的總比分是大於還是小於指定盤口。",
                        "ART_ru_badminton_g_2": "如果賽事中斷，除非市場已經派彩或任何將來的得分不會影響到賽果的投注有效，其他所有注單一律視為無效。",
                    
                        "ART_ru_badminton_h": "波膽",
                        "ART_ru_badminton_h_1": "預測一個特定賽事全場的正確比分。",
                        "ART_ru_badminton_h_2": "結算將依據相關部門最終公佈的比分為準。",
                        "ART_ru_badminton_h_3": "如果注單在賽事中斷前已得到明確的勝負，並且任何進一步的賽果均不會對注單結果產生影響的情況下，注單會被視為有效。",
                    
                        "ART_ru_badminton_i": "單/雙",
                        "ART_ru_badminton_i_1": "預測在某一特定的時間段內比賽進行的總局數、盤數或分數是單數還是雙數。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_badminton": "BADMINTON",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "05/02/2021",
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_badminton_a_1": "All bets will be considered valid only when the match is finished, unless otherwise stated.",
                        "ART_ru_badminton_a_2": "If a player or pairing fails to compete in any tournament or match, all bets on that player (excluding Outright Markets) will be voided.",
                        "ART_ru_badminton_a_3": "If a player or pairing retires or is disqualified during a match before its completion, all bets for the match will be voided.",
                        "ART_ru_badminton_a_4": "If the scheduled duration of a match is reduced or if there is an increase in the number of points to win, all bets will be voided.",
                        "ART_ru_badminton_a_5": "If a match is postponed or suspended all bets are still considered valid if the match is completed.",
                        "ART_ru_badminton_a_6": "If a match starts before schedule, only the transactions before the game starts will be considered valid. The transactions after the match starts will be considered invalid. (Except in-play bet types).",
                    
                        "ART_ru_bettype": "BET TYPES",
                        "ART_ru_badminton_b": "Money Line / Winner",
                        "ART_ru_badminton_b_1": "Predict who will win the match. This market will contain the two players.",
                    
                        "ART_ru_badminton_j": "Point Winner – Game X, Point X",
                        "ART_ru_badminton_j_1": "Predict who will win a specific point of a specific game (e.g. Game 1, Point 1).",
                        "ART_ru_badminton_j_2": "If a specific point is not reached within a game, all bets on that point will be voided (e.g. Game 1, Point 40, but the Game is won 21-18)",
                        "ART_ru_badminton_j_3": "If a player retires or is disqualified, bets on any point without a definitive winner will be voided. Bets on points completed will be valid.",
                    
                        "ART_ru_badminton_k": "Game X- Race to X Points",
                        "ART_ru_badminton_k_1": "Predict which participant will first reach the stated number of points within a game (e.g. Game 1, Race to 5).",
                        "ART_ru_badminton_k_2": "If a player retires or is disqualified, bets without a definitive winner will be voided. Bets on completed required points will be valid.",
                    
                        "ART_ru_badminton_c": "Set / Game - Handicap",
                        "ART_ru_badminton_c_1": "Predict who will win the match with the indicated set / game handicap applied.",
                    
                        "ART_ru_badminton_d": "Set / Game - Over / Under",
                        "ART_ru_badminton_d_1": "Predict whether the number of sets / games will be over or under the indicated number.",
                    
                        "ART_ru_badminton_e": "Point Handicap",
                        "ART_ru_badminton_e_1": "Predict who will win more points in a specified period after applying the indicated point handicap.",
                    
                        "ART_ru_badminton_f": "Total Points - Over / Under",
                        "ART_ru_badminton_f_1": "Predict whether the total number of points won by a nominated player in a specific period will be over or under the indicated total line.",
                    
                        "ART_ru_badminton_g": "Player / Team Points - Over / Under",
                        "ART_ru_badminton_g_1": "Predict whether the total number of points recorded by the home or away team will be over or under the indicated line.",
                        "ART_ru_badminton_g_2": "Should the game be abandoned all bets will be considered void unless the market has been already settled or unconditionally determined as any further points will have no effect on the market result.",
                    
                        "ART_ru_badminton_h": "Match Correct Score",
                        "ART_ru_badminton_h_1": "Predict the Correct Score at Full Time of a specified match.",
                        "ART_ru_badminton_h_2": "Settlements we be based on the post match score as advertised by the relevant governing body.",
                        "ART_ru_badminton_h_3": "Should a game / event be abandoned, suspended or postponed; only bets placed on markets that have been unconditionally determined will be considered valid.",
                    
                        "ART_ru_badminton_i": "Odd / Even",
                        "ART_ru_badminton_i_1": "Predict whether the total number of games played in a specified period (e.g. Match, 1st Set, 2nd Set) will be odd or even.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_badminton": "羽毛球",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "05/02/2021",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_badminton_a_1": "所有投注的注单均在比赛结束后才被视为有效，除非另有注明。",
                        "ART_ru_badminton_a_2": "如果投注的球员或组合没有参与比赛，所有投注此球员的注单(排除独赢)将被视为无效",
                        "ART_ru_badminton_a_3": "如果一名球员或组合在比赛未结束前退出或被取消资格，所有该场赛事的注单将被视为无效。",
                        "ART_ru_badminton_a_4": "如果比赛预定时间缩短或者需获胜比赛的比分提高，所有注单将被视为无效。",
                        "ART_ru_badminton_a_5": "如果赛事延期或中断，只要比赛最后有完成，所有投注将保持有效。",
                        "ART_ru_badminton_a_6": "如果比赛在法定时间提前进行，在比赛开始前的投注依然有效，在比赛开始后的所有投注均视为无效(滚球玩法除外)。",
                    
                        "ART_ru_bettype": "投注类型",
                        "ART_ru_badminton_b": "独赢",
                        "ART_ru_badminton_b_1": "预测哪个球员将会赢取比赛的胜利。这个比赛包含双方球员。",
                    
                        "ART_ru_badminton_j": "总分获胜者（获胜者 – 局X 分数 X）",
                        "ART_ru_badminton_j_1": "预测指定盘的指定分数谁将获胜。（例如第一局第一分）",
                        "ART_ru_badminton_j_2": "如果某盘没有进行指定分数，则该分数所有注单将被取消。（例如第一局,40分，但是该局结束于21-28）",
                        "ART_ru_badminton_j_3": "如果一名球员退出或被取消资格，任何没有最终获胜者的分数所有注单将被取消，已结束的分数注单将视为有效。",
                    
                        "ART_ru_badminton_k": "局 X- 先得 X 分数",
                        "ART_ru_badminton_k_1": "预测哪一位球员在赛事中最先达到指定的分数。(例如第一局，先得5分）",
                        "ART_ru_badminton_k_2": "如果一名球员退出或被取消资格，没有最终获胜者的所有注单将被取消，已结束的注单将视为有效。",
                    
                        "ART_ru_badminton_c": "让盘 / 让局",
                        "ART_ru_badminton_c_1": "预测哪一位球员在盘口指定的让盘/局数赢得比赛。",
                    
                        "ART_ru_badminton_d": "总盘/总局数：大/小",
                        "ART_ru_badminton_d_1": "预测比赛进行的总盘/局数是大于或小于盘口指定的大小盘局数。",
                    
                        "ART_ru_badminton_e": "让分",
                        "ART_ru_badminton_e_1": "预测在某个时节，哪一位球员在盘口指定的让分数赢的比赛。",
                    
                        "ART_ru_badminton_f": "总分：大/小",
                        "ART_ru_badminton_f_1": "预测提名的球员在某一特定的时间段内的个人总得分将大于或小于盘口指定的总分数线。",
                    
                        "ART_ru_badminton_g": "球员/球队得分 -大/小",
                        "ART_ru_badminton_g_1": "预测主场或客场的总比分是大于还是小于指定盘口。",
                        "ART_ru_badminton_g_2": "如果赛事中断，除非市场已经派彩或任何将来的得分不会影响到赛果的投注有效，其他所有注单一律视为无效。",
                    
                        "ART_ru_badminton_h": "波胆",
                        "ART_ru_badminton_h_1": "预测一个特定赛事全场的正确比分。",
                        "ART_ru_badminton_h_2": "结算将依据相关部门最终公布的比分为准。",
                        "ART_ru_badminton_h_3": "如果注单在赛事中断前已得到明确的胜负，并且任何进一步的赛果均不会对注单结果产生影响的情况下，注单会被视为有效。",
                    
                        "ART_ru_badminton_i": "单/双",
                        "ART_ru_badminton_i_1": "预测在某一特定的时间段内比赛进行的总局数、盘数或分数是单数还是双数。",
                        ';
                        break;
                }
                break;
            case "table_tennis":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_tabletennis": "乒乓球",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "29/09/2016",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_tabletennis_a_1": "所有註單必須以賽事結束方可視為有效，除非另有特別說明。",
                        "ART_ru_tabletennis_a_2": "如果比賽預定時間縮短，或者賽事獲勝要求比分提高，所有註單一律無效並取消。",
                        "ART_ru_tabletennis_a_3": "如果賽事延期或中斷，只要比賽最後有完成，所有投注將保持有效。",
                        "ART_ru_tabletennis_a_4": "如果比賽提前開賽，只有在開賽之前投注的注單將為視為有效投注。在開賽後投注的注單將被視為無效，滾球玩法除外。",
                    
                        "ART_ru_bettype": "投注類型",
                    
                        "ART_ru_tabletennis_b": "獨贏",
                        "ART_ru_tabletennis_b_1": "預測哪個球員將會贏取比賽的勝利。這個比賽包含雙方球員。",
                    
                        "ART_ru_tabletennis_c": "讓盤 / 讓局",
                        "ART_ru_tabletennis_c_1": "預測哪一位球員在盤口指定的讓盤/局數贏得比賽。",
                    
                        "ART_ru_tabletennis_d": "總盤/總局數： 大 / 小",
                        "ART_ru_tabletennis_d_1": "預測比賽進行的總盤/局數是大於或小於盤口指定的大小盤局數。",
                    
                        "ART_ru_tabletennis_e": "讓分",
                        "ART_ru_tabletennis_e_1": "預測在某個時節 哪一位球員在盤口指定的讓分數贏得比賽。",
                    
                        "ART_ru_tabletennis_f": "總分： 大 / 小",
                        "ART_ru_tabletennis_f_1": "預測提名的球員在某一特定的時間段內的個人總得分將大於或小於盤口指定的總分數線。",
                    
                        "ART_ru_tabletennis_g": "球員/球隊得分 -大/小",
                        "ART_ru_tabletennis_g_1": "預測主場或客場的總比分是大於還是小於指定盤口。",
                        "ART_ru_tabletennis_g_2": "如果賽事中斷，除非市場已經派彩或任何將來的得分不會影響到賽果的投注有效，其他所有注單一律視為無效。",
                    
                        "ART_ru_tabletennis_h": "波膽",
                        "ART_ru_tabletennis_h_1": "預測一個特定賽事全場的正確比分。",
                        "ART_ru_tabletennis_h_2": "結算將依據相關部門最終公佈的比分為準。",
                        "ART_ru_tabletennis_h_3": "如果注單在賽事中斷前已得到明確的勝負，並且任何進一步的賽果均不會對注單結果產生影響的情況下，注單會被視為有效。",
                    
                        "ART_ru_tabletennis_i": "單/雙",
                        "ART_ru_tabletennis_i_1": "預測在某一特定的時間段內比賽進行的總局數、盤數或分數是單數還是雙數。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_tabletennis": "TABLE TENNIS",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "29/09/2016",
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_tabletennis_a_1": "All bets will be considered valid only when the match is finished, unless otherwise stated.",
                        "ART_ru_tabletennis_a_2": "If the scheduled duration of a match is reduced or if there is an increase in the number of points to win, all bets will be voided.",
                        "ART_ru_tabletennis_a_3": "If a match is postponed or suspended all bets are still considered valid if the match is completed.",
                        "ART_ru_tabletennis_a_4": "If a match starts before schedule, only the transactions before the game starts will be considered valid. The transactions after the match starts will be considered invalid. (Except in-play bet types).",
                    
                        "ART_ru_bettype": "BET TYPES",
                    
                        "ART_ru_tabletennis_b": "Money Line / Winner",
                        "ART_ru_tabletennis_b_1": "Predict who will win the match. This market will contain the two players.",
                    
                        "ART_ru_tabletennis_c": "Set / Game - Handicap",
                        "ART_ru_tabletennis_c_1": "Predict who will win the match with the indicated set / game handicap applied.",
                    
                        "ART_ru_tabletennis_d": "Set / Game - Over / Under",
                        "ART_ru_tabletennis_d_1": "Predict whether the number of sets / games will be over or under the indicated number.",
                    
                        "ART_ru_tabletennis_e": "Point Handicap",
                        "ART_ru_tabletennis_e_1": "Predict who will win more points in a specified period after applying the indicated point handicap.",
                    
                        "ART_ru_tabletennis_f": "Total Points - Over / Under",
                        "ART_ru_tabletennis_f_1": "Predict whether the total number of points won by a nominated player in a specific period will be over or under the indicated total line.",
                    
                        "ART_ru_tabletennis_g": "Player / Team Points - Over / Under",
                        "ART_ru_tabletennis_g_1": "Predict whether the total number of points recorded by the home or away team will be over or under the indicated line.",
                        "ART_ru_tabletennis_g_2": "Should the game be abandoned all bets will be considered void unless the market has been already settled or unconditionally determined as any further points will have no effect on the market result.",
                    
                        "ART_ru_tabletennis_h": "Match Correct Score",
                        "ART_ru_tabletennis_h_1": "Predict the Correct Score at Full Time of a specified match.",
                        "ART_ru_tabletennis_h_2": "Settlements we be based on the post match score as advertised by the relevant governing body.",
                        "ART_ru_tabletennis_h_3": "If the match is abandoned, suspended or postponed, only bets placed on markets that have been unconditionally determined will be considered valid.",
                    
                        "ART_ru_tabletennis_i": "Odd / Even",
                        "ART_ru_tabletennis_i_1": "Predict whether the total number of games, sets or points played in a specific period will be odd or even.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_tabletennis": "乒乓球",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "29/09/2016",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_tabletennis_a_1": "所有注单必须以赛事结束方可视为有效，除非另有特别说明。",
                        "ART_ru_tabletennis_a_2": "如果比赛预定时间缩短，或者赛事获胜要求比分提高，所有注单一律无效并取消。",
                        "ART_ru_tabletennis_a_3": "如果赛事延期或中断，只要比赛最后有完成，所有投注将保持有效。",
                        "ART_ru_tabletennis_a_4": "如果比赛提前开赛，只有在开赛之前投注的注单将为视为有效投注。在开赛后投注的注单将被视为无效，滚球玩法除外。",
                    
                        "ART_ru_bettype": "投注类型",
                    
                        "ART_ru_tabletennis_b": "独赢",
                        "ART_ru_tabletennis_b_1": "预测哪个球员将会赢取比赛的胜利。这个比赛包含双方球员。",
                    
                        "ART_ru_tabletennis_c": "让盘 / 让局",
                        "ART_ru_tabletennis_c_1": "预测哪一位球员在盘口指定的让盘/局数赢得比赛。",
                    
                        "ART_ru_tabletennis_d": "总盘/总局数： 大 / 小",
                        "ART_ru_tabletennis_d_1": "预测比赛进行的总盘/局数是大于或小于盘口指定的大小盘局数。",
                    
                        "ART_ru_tabletennis_e": "让分",
                        "ART_ru_tabletennis_e_1": "预测在某个时节 哪一位球员在盘口指定的让分数赢得比赛。",
                    
                        "ART_ru_tabletennis_f": "总分： 大 / 小",
                        "ART_ru_tabletennis_f_1": "预测提名的球员在某一特定的时间段内的个人总得分将大于或小于盘口指定的总分数线。",
                    
                        "ART_ru_tabletennis_g": "球员/球队得分 -大/小",
                        "ART_ru_tabletennis_g_1": "预测主场或客场的总比分是大于还是小于指定盘口。",
                        "ART_ru_tabletennis_g_2": "如果赛事中断，除非市场已经派彩或任何将来的得分不会影响到赛果的投注有效，其他所有注单一律视为无效。",
                    
                        "ART_ru_tabletennis_h": "波胆",
                        "ART_ru_tabletennis_h_1": "预测一个特定赛事全场的正确比分。",
                        "ART_ru_tabletennis_h_2": "结算将依据相关部门最终公布的比分为准。",
                        "ART_ru_tabletennis_h_3": "如果注单在赛事中断前已得到明确的胜负，并且任何进一步的赛果均不会对注单结果产生影响的情况下，注单会被视为有效。",
                    
                        "ART_ru_tabletennis_i": "单/双",
                        "ART_ru_tabletennis_i_1": "预测在某一特定的时间段内比赛进行的总局数、盘数或分数是单数还是双数。",
                        ';
                        break;
                }
                break;
            case "baseball":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_baseball": "棒球",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "30/08/2016",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_baseball_a_1": "如果比賽場地有變更，所有註單將被取消。",
                        "ART_ru_baseball_a_2": "國際棒球比賽規則:如果比賽最少進行七局後有一隊領先10分，或最少進行五局後有一隊領先15分，賽事將會提早結束。如果遇此情況，所有的投注將繼續保持有效，包括獨贏盤，單/雙盤，讓分盤（讓壘盤）和大/小盤（總比分）。",
                        "ART_ru_baseball_a_3": "若投注讓分盤和大/小盤（總比分），比賽結果以9局後為準（如果對手已經領先，結果便以8局半為準）。如果賽事在加局賽時被保留或中斷，比分將以最後一局的結果為準，除非主隊打成平局，或在加局賽的下半場已經領先對手，比分將以比賽被保留時的結果為準。",
                        "ART_ru_baseball_a_4": "結算時, 加時(局)賽將計算在內，除非另有註明。",
                        "ART_ru_baseball_a_5": "上半場投注是按照第1局到第5局的結果為準。",
                        "ART_ru_baseball_a_6": "下半場投注是按照第6局到第9局的結果為準。出於結算的用意，下半場的加時(局)賽將計算在內。",
                        "ART_ru_baseball_a_7": "在不考慮第一投手的情況下，注單將保持有效。",
                        "ART_ru_baseball_a_8": "如果賽事是在下半場中斷所有上半場的投注保持有效。",
                        "ART_ru_baseball_a_9": "如果賽事是在下半場中斷，所有下半場和全場的注單將被取消，除非在個別玩法規則另有註明。",
                        "ART_ru_baseball_a_10": "如果比賽在法定時間提前進行，在比賽開始前的投注依然有效，在比賽開始後的所有投注均視為無效(滾球投注另作別論)。",
                    
                        "ART_ru_bettype": "投注類型",
                        "ART_ru_baseball_b": "獨贏",
                        "ART_ru_baseball_b_1": "預測哪一支球隊將在比賽勝出。",
                        "ART_ru_baseball_b_2": "結算時, 加時(局)賽將計算在內。",
                    
                        "ART_ru_baseball_c": "讓球",
                        "ART_ru_baseball_c_1": "預測哪一支球隊在盤口指定的讓分數贏得某個時節或全場比賽。",
                        "ART_ru_baseball_c_2": "結算時, 加時(局)賽將計算在內。",
                    
                        "ART_ru_baseball_d": "滾球讓球",
                        "ART_ru_baseball_d_1": "預測哪一支球隊在盤口指定的讓分數贏得某個時節或全場比賽。",
                        "ART_ru_baseball_d_2": "結算時, 加時(局)賽將計算在內。",
                    
                        "ART_ru_baseball_e": "總得分:  大 / 小",
                        "ART_ru_baseball_e_1": "預測賽事總比分將大於或小於在盤口指定的大/小盤分數。",
                        "ART_ru_baseball_e_2": "結算時, 加時(局)賽將計算在內。",
                        "ART_ru_baseball_e_3": "如果賽事中斷前已有明確結果並且之後沒有任何顯著會影響賽事結果的情況，大/小盤注單才會被結算。若遇到任何其他情況，注單將一律被取消。",
                        "ART_ru_baseball_e_4": "如果賽事在上半場中斷，所有註單將被取消，除非中斷前已有明確結果並且之後沒有任何顯著會影響賽事結果的情況注單才會被結算。",
                        "ART_ru_baseball_e_5": "如果賽事在下半場取消或中斷，所有上半場注單保持有效。",
                        "ART_ru_baseball_e_6": "如果賽事在下半場取消或中斷，所有下半場和全場注單將被取消，除非中斷前已有明確結果並且之後沒有任何顯著會影響賽事結果的情況注單才會被結算。",
                    
                        "ART_ru_baseball_f": "滾球總得分:  大 / 小",
                        "ART_ru_baseball_f_1": "預測賽事總比分將大於或小於在盤口指定的大/小盤分數。",
                        "ART_ru_baseball_f_2": "結算是以0-0的比分按盤口開出的大小盤讓分數做裁決。投注當時的比分對結算沒有影響。",
                        "ART_ru_baseball_f_3": "結算時, 加時(局)賽將計算在內。",
                    
                        "ART_ru_baseball_g": "總得分:  單 / 雙",
                        "ART_ru_baseball_g_1": "預測賽事的總比分是單數或雙數。",
                        "ART_ru_baseball_g_2": "結算時, 加時(局)賽將計算在內。",
                    
                        "ART_ru_baseball_h": "獨贏 - 前5局",
                        "ART_ru_baseball_h_1": "預測哪支球隊將在前5局結束時獲勝或者打平。",
                        "ART_ru_baseball_h_2": "只提供於此時間段，不適用於賽事結束時的最終比分",
                    
                        "ART_ru_baseball_i": "球隊得分 - 大/小盤",
                        "ART_ru_baseball_i_1": "預測指定的球隊總跑壘得分將大於或小於盤口指定的大/小盤分數。",
                        "ART_ru_baseball_i_2": "結算包括加時賽局",
                    
                        "ART_ru_baseball_j": "淨勝分數",
                        "ART_ru_baseball_j_1": "預測哪一支球隊將贏得這場比賽並比他們的對手多多少",
                        "ART_ru_baseball_j_2": "舉例：A隊最後得分是12，B隊最後得分是8，那麼“淨勝分數”就是4。",
                        "ART_ru_baseball_j_3": "結算包括加時賽局",
                    
                        "ART_ru_baseball_k": "加時賽",
                        "ART_ru_baseball_k_1": "預測賽事是否超出常規9局時間（除非另有說明）。",
                        "ART_ru_baseball_k_2": "出於結算的目的，任何常規的比賽延長到第10局或更多，將被視為進入“加時賽”。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_baseball_a_1": "If the scheduled venue is changed, all bets will be considered void.",
                        "ART_ru_baseball_a_2": "International Baseball Rules: Games will end early if a team is leading by 10 or more runs after the opposing team has batted in at least 7 innings, or if a team is leading by 15 or more runs after the opposing team has batted in at least 5 innings. If this happens, all bets will be considered valid, including Money Line, Odd / Even, Run Line and Total Runs (Over/Under).",
                        "ART_ru_baseball_a_3": "When betting on the Handicap and Total Runs (over/under) the game must conduct 9 innings (or 8.5 innings, when the 2nd batting team is already ahead) to have a result. If a game is called or suspended in an extra innings, the score will be determined after the last full inning unless the home team scores to tie, or takes the lead in the bottom half of the inning, in which case the score is determined at the time the game is called.",
                        "ART_ru_baseball_a_4": "Extra innings count for settlement purposes, unless otherwise specified.",
                        "ART_ru_baseball_a_5": "1st half betting is based on the result from the 1st to the end of the 5th period.",
                        "ART_ru_baseball_a_6": "2nd half betting is based on the result from the 6th period to the end of the 9th period. Extra innings count for settlement purposes on 2nd half betting.",
                        "ART_ru_baseball_a_7": "All Bets placed will remain valid regardless of the starting pitcher.",
                        "ART_ru_baseball_a_8": "If the game is suspended or cancelled during the 2nd half, all 1st half bets will still be valid.",
                        "ART_ru_baseball_a_9": "If the game is suspended or cancelled during the 2nd half, all 2nd half bets will be considered void, unless otherwise stated in the individual bet type rules.",
                        "ART_ru_baseball_a_10": "If the game starts before the scheduled time, only bets placed before the game commenced will be considered valid. Bets placed after the game commenced will be considered void. This excludes In-Play bet types.",
                    
                        "ART_ru_bettype": "BET TYPES",
                        "ART_ru_baseball_b": "Winner",
                        "ART_ru_baseball_b_1": "Predict who will win the game.",
                        "ART_ru_baseball_b_2": "Extra innings count for settlement purposes.",
                    
                        "ART_ru_baseball_c": "Handicap",
                        "ART_ru_baseball_c_1": "Predict who will win the game / period with the indicated handicap applied.",
                        "ART_ru_baseball_c_2": "Extra innings count for settlement purposes.",
                    
                        "ART_ru_baseball_d": "Handicap (In-Play)",
                        "ART_ru_baseball_d_1": "Predict who will win the game / period with the indicated handicap applied.",
                        "ART_ru_baseball_d_2": "Extra innings count for settlement purposes.",
                    
                        "ART_ru_baseball_e": "Total Runs: Over / Under",
                        "ART_ru_baseball_e_1": "Predict whether the total number of runs scored will be over or under the indicated total line.",
                        "ART_ru_baseball_e_2": "Extra innings count for settlement purposes.",
                        "ART_ru_baseball_e_3": "If a game is abandoned, Over / Under bets will only be settled when the market has been unconditionally determined as any further potential runs have no affect on the market result. In all other scenarios, bets will be considered void.",
                        "ART_ru_baseball_e_4": "If the game is abandoned during the 1st half, all 1st half bets will be void unless they have been unconditionally determined as any further potential runs have no affect on the market result.",
                        "ART_ru_baseball_e_5": "If the game is abandoned during the 2nd half, all 1st half bets will still be valid.",
                        "ART_ru_baseball_e_6": "If the game is abandoned during the 2nd half, all 2nd half bets will be void unless they have been unconditionally determined as any further potential runs have no affect on the market result.",
                    
                        "ART_ru_baseball_f": "Total Runs: Over / Under (In-Play)",
                        "ART_ru_baseball_f_1": "Predict whether the total number of runs scored will be over or under the indicated total line.",
                        "ART_ru_baseball_f_2": "Settlement is based on the final score line and the total line is applied to a 0-0 score line",
                        "ART_ru_baseball_f_3": "Extra innings count for settlement purposes.",
                    
                        "ART_ru_baseball_g": "Total Runs: Odd / Even",
                        "ART_ru_baseball_g_1": "Predict whether the total number of runs scored will be odd or even.",
                        "ART_ru_baseball_g_2": "Extra innings count for settlement purposes.",
                    
                        "ART_ru_baseball_h": "1 X 2 - 1st 5 Innings",
                        "ART_ru_baseball_h_1": "Predict which team will be winning at the end of the 1st 5 Innings or whether the result will be a draw.",
                        "ART_ru_baseball_h_2": "Market will only be offered for this period and not apply to the final score at the end of the game.",
                    
                        "ART_ru_baseball_i": "Team Runs – Over / Under",
                        "ART_ru_baseball_i_1": "Predict whether the total number of runs scored by the stated team will be over or under the indicated total line.",
                        "ART_ru_baseball_i_2": "Extra innings count for settlement purposes.",
                    
                        "ART_ru_baseball_j": "Winning Margin",
                        "ART_ru_baseball_j_1": "Predict which team will win the game and by how many runs more runs than their opponent.",
                        "ART_ru_baseball_j_2": "E.g. If Team A final score is 12 and Team B final score is 8, the ‘Winning Margin’ is 4 Runs.",
                        "ART_ru_baseball_j_3": "Extra innings count for settlement purposes.",
                    
                        "ART_ru_baseball_k": "Overtime",
                        "ART_ru_baseball_k_1": "Predict whether the game will be extended beyond the regular period of play (9 Innings unless otherwise stated).",
                        "ART_ru_baseball_k_2": "For settlement purposes, any regular game that extends to the 10th Innings or beyond will be considered as having entered ‘Overtime’.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_baseball": "棒球",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "30/08/2016",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_baseball_a_1": "如果比赛场地有变更，所有注单将被取消。",
                        "ART_ru_baseball_a_2": "国际棒球比赛规则:如果比赛最少进行七局后有一队领先10分，或最少进行五局后有一队领先15分，赛事将会提早结束。如果遇此情况，所有的投注将继续保持有效，包括独赢盘，单/双盘，让分盘（让垒盘）和大/小盘（总比分）。",
                        "ART_ru_baseball_a_3": "若投注让分盘和大/小盘（总比分），比赛结果以9局后为准（如果对手已经领先，结果便以8局半为准）。如果赛事在加局赛时被保留或中断，比分将以最后一局的结果为准，除非主队打成平局，或在加局赛的下半场已经领先对手，比分将以比赛被保留时的结果为准。",
                        "ART_ru_baseball_a_4": "结算时, 加时(局)赛将计算在内，除非另有注明。",
                        "ART_ru_baseball_a_5": "上半场投注是按照第1局到第5局的结果为准。",
                        "ART_ru_baseball_a_6": "下半场投注是按照第6局到第9局的结果为准。出于结算的用意，下半场的加时(局)赛将计算在内。",
                        "ART_ru_baseball_a_7": "在不考虑第一投手的情况下，注单将保持有效。",
                        "ART_ru_baseball_a_8": "如果赛事是在下半场中断所有上半场的投注保持有效。",
                        "ART_ru_baseball_a_9": "如果赛事是在下半场中断，所有下半场和全场的注单将被取消，除非在个别玩法规则另有注明。",
                        "ART_ru_baseball_a_10": "如果比赛在法定时间提前进行，在比赛开始前的投注依然有效，在比赛开始后的所有投注均视为无效(滚球投注另作别论)。",
                    
                        "ART_ru_bettype": "投注类型",
                        "ART_ru_baseball_b": "独赢",
                        "ART_ru_baseball_b_1": "预测哪一支球队将在比赛胜出。",
                        "ART_ru_baseball_b_2": "结算时, 加时(局)赛将计算在内。",
                    
                        "ART_ru_baseball_c": "让球",
                        "ART_ru_baseball_c_1": "预测哪一支球队在盘口指定的让分数赢得某个时节或全场比赛。",
                        "ART_ru_baseball_c_2": "结算时, 加时(局)赛将计算在内。",
                    
                        "ART_ru_baseball_d": "滚球让球",
                        "ART_ru_baseball_d_1": "预测哪一支球队在盘口指定的让分数赢得某个时节或全场比赛。",
                        "ART_ru_baseball_d_2": "结算时, 加时(局)赛将计算在内。",
                    
                        "ART_ru_baseball_e": "总得分:  大 / 小",
                        "ART_ru_baseball_e_1": "预测赛事总比分将大于或小于在盘口指定的大/小盘分数。",
                        "ART_ru_baseball_e_2": "结算时, 加时(局)赛将计算在内。",
                        "ART_ru_baseball_e_3": "如果赛事中断前已有明确结果并且之后没有任何显著会影响赛事结果的情况，大/小盘注单才会被结算。若遇到任何其他情况，注单将一律被取消。",
                        "ART_ru_baseball_e_4": "如果赛事在上半场中断，所有注单将被取消，除非中断前已有明确结果并且之后没有任何显著会影响赛事结果的情况注单才会被结算。",
                        "ART_ru_baseball_e_5": "如果赛事在下半场取消或中断，所有上半场注单保持有效。",
                        "ART_ru_baseball_e_6": "如果赛事在下半场取消或中断，所有下半场和全场注单将被取消，除非中断前已有明确结果并且之后没有任何显著会影响赛事结果的情况注单才会被结算。",
                    
                        "ART_ru_baseball_f": "滚球总得分:  大 / 小",
                        "ART_ru_baseball_f_1": "预测赛事总比分将大于或小于在盘口指定的大/小盘分数。",
                        "ART_ru_baseball_f_2": "结算是以0-0的比分按盘口开出的大小盘让分数做裁决。投注当时的比分对结算没有影响。",
                        "ART_ru_baseball_f_3": "结算时, 加时(局)赛将计算在内。",
                    
                        "ART_ru_baseball_g": "总得分:  单 / 双",
                        "ART_ru_baseball_g_1": "预测赛事的总比分是单数或双数。",
                        "ART_ru_baseball_g_2": "结算时, 加时(局)赛将计算在内。",
                    
                        "ART_ru_baseball_h": "独赢 - 前5局",
                        "ART_ru_baseball_h_1": "预测哪支球队将在前5局结束时获胜或者打平。",
                        "ART_ru_baseball_h_2": "只提供于此时间段，不适用于赛事结束时的最终比分",
                    
                        "ART_ru_baseball_i": "球队得分 - 大/小盘",
                        "ART_ru_baseball_i_1": "预测指定的球队总跑垒得分将大于或小于盘口指定的大/小盘分数。",
                        "ART_ru_baseball_i_2": "结算包括加时赛局",
                    
                        "ART_ru_baseball_j": "净胜分数",
                        "ART_ru_baseball_j_1": "预测哪一支球队将赢得这场比赛并比他们的对手多多少",
                        "ART_ru_baseball_j_2": "举例：A队最后得分是12，B队最后得分是8，那么“净胜分数”就是4。",
                        "ART_ru_baseball_j_3": "结算包括加时赛局",
                    
                        "ART_ru_baseball_k": "加时赛",
                        "ART_ru_baseball_k_1": "预测赛事是否超出常规9局时间（除非另有说明）。",
                        "ART_ru_baseball_k_2": "出于结算的目的，任何常规的比赛延长到第10局或更多，将被视为进入“加时赛”。",
                        ';
                        break;
                }
                break;
            case "snooker":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_snooker": "斯諾克 / 台球",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "17/10/2017",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_snooker_a_1": "如果比賽沒有完成，所有的投注將被視為無效，除非另有特別說明。",
                        "ART_ru_snooker_a_2": "如果選手未完成賽事，所有投注此選手注單無效。",
                        "ART_ru_snooker_a_3": "如果球員在比賽結束前棄權或取消參賽資格，所有投注此賽事的注單一律視為無效，除非在個別體育規則另有特別說明。",
                        "ART_ru_snooker_a_4": "如果賽事延期或中斷，只要比賽最後有完成，所有投注將保持有效。",
                        "ART_ru_snooker_a_5": "如果比賽提前開賽，只有在開賽之前投注的注單將為視為有效投注。在開賽後投注的注單將被視為無效， 滾球玩法除外。",
                    
                        "ART_ru_bettype": "投注類型",
                        "ART_ru_snooker_b": "獨贏盤",
                        "ART_ru_snooker_b_1": "預測哪個球員將贏取比賽勝利。這個比賽包含雙方球員。",
                    
                        "ART_ru_snooker_c": "讓分盤",
                        "ART_ru_snooker_c_1": "預測哪個球員將在指定的讓局比賽獲得勝利。",
                    
                        "ART_ru_snooker_d": "大/小",
                        "ART_ru_snooker_d_1": "預測預測賽事總比分將大於或小於指定的盤口。",
                        "ART_ru_snooker_d_2": "如果賽事中斷前已有明確結果並且之後沒有任何顯著會影響賽事結果的情況，大小球投注的注單才會被結算。若遇到任何其他情況，注單將一律被取消。",
                    
                        "ART_ru_snooker_e": "單/雙",
                        "ART_ru_snooker_e_1": "預測賽事的總比分是單數或雙數。",
                    
                        "ART_ru_snooker_f": "局數投注",
                        "ART_ru_snooker_f_1": "預測哪個球員將會贏得一場指定賽事特定局數的勝利。",
                        "ART_ru_snooker_f_2": "投注的結算將依據WPBSA最終公佈的局數獲勝者為準。",
                    
                        "ART_ru_snooker_g": "打滿比賽",
                        "ART_ru_snooker_g_1": "此規則適用於所有比賽，例如：”打滿八局”比賽最終結果可能是7-1或者4-4等。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_snooker": "SNOOKER / POOL",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "17/10/2017",
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_snooker_a_1": "All bets will be considered valid only when the match is finished, unless otherwise stated. ",
                        "ART_ru_snooker_a_2": "If a player fails to compete in a match, all bets on that player will be considered void.",
                        "ART_ru_snooker_a_3": "If a player retires or is disqualified during a match before its completion, all bets for the match will be considered void, unless explicitly stated in the individual Bet Type rules.",
                        "ART_ru_snooker_a_4": "If a match is postponed or suspended all bets are still considered valid if the match is completed.",
                        "ART_ru_snooker_a_5": "If a match starts before schedule, only the transactions before the game starts will be considered valid. The transactions after the match starts will be considered invalid. (Except in-play bet types).",
                    
                        "ART_ru_bettype": "BET TYPES",
                        "ART_ru_snooker_b": "Money Line / Winner",
                        "ART_ru_snooker_b_1": "Predict who will win the match. This market will contain the two players.",
                    
                        "ART_ru_snooker_c": "Handicap",
                        "ART_ru_snooker_c_1": "Predict who will win the match with the indicated frame / rack handicap applied.",
                    
                        "ART_ru_snooker_d": "Over / Under",
                        "ART_ru_snooker_d_1": "Predict whether the total number of frames / racks in a match will be over or under the indicated total line.",
                        "ART_ru_snooker_d_2": "If a match is abandoned, Over / Under bets will only be settled when the market has been unconditionally determined as any further potential frames / racks have no affect on the market result. In all other scenarios, bets will be considered void.",
                    
                        "ART_ru_snooker_e": "Odd / Even",
                        "ART_ru_snooker_e_1": "Predict whether the total number of frames / racks played in a match will be odd or even.",
                    
                        "ART_ru_snooker_f": "Frame Betting",
                        "ART_ru_snooker_f_1": "Predict which player will win a specific frame during a specified match.",
                        "ART_ru_snooker_f_2": "Bets will be settled post-frame according to the frame winner as declared by the WPBSA.",
                    
                        "ART_ru_snooker_g": "‘Play All’ Matches",
                        "ART_ru_snooker_g_1": "This match format is based on all frames being played. For example \'All Play 8\' means the final result could be 7-1 or 4-4 etc.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_snooker": "斯诺克 / 台球",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "17/10/2017",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_snooker_a_1": "如果比赛没有完成，所有的投注将被视为无效，除非另有特别说明。",
                        "ART_ru_snooker_a_2": "如果选手未完成赛事，所有投注此选手注单无效。",
                        "ART_ru_snooker_a_3": "如果球员在比赛结束前弃权或取消参赛资格，所有投注此赛事的注单一律视为无效，除非在个别体育规则另有特别说明。",
                        "ART_ru_snooker_a_4": "如果赛事延期或中断，只要比赛最后有完成，所有投注将保持有效。",
                        "ART_ru_snooker_a_5": "如果比赛提前开赛，只有在开赛之前投注的注单将为视为有效投注。在开赛后投注的注单将被视为无效， 滚球玩法除外。",
                    
                        "ART_ru_bettype": "投注类型",
                        "ART_ru_snooker_b": "独赢盘",
                        "ART_ru_snooker_b_1": "预测哪个球员将赢取比赛胜利。这个比赛包含双方球员。",
                    
                        "ART_ru_snooker_c": "让分盘",
                        "ART_ru_snooker_c_1": "预测哪个球员将在指定的让局比赛获得胜利。",
                    
                        "ART_ru_snooker_d": "大/小",
                        "ART_ru_snooker_d_1": "预测预测赛事总比分将大于或小于指定的盘口。",
                        "ART_ru_snooker_d_2": "如果赛事中断前已有明确结果并且之后没有任何显著会影响赛事结果的情况，大小球投注的注单才会被结算。若遇到任何其他情况，注单将一律被取消。",
                    
                        "ART_ru_snooker_e": "单/双",
                        "ART_ru_snooker_e_1": "预测赛事的总比分是单数或双数。",
                    
                        "ART_ru_snooker_f": "局数投注",
                        "ART_ru_snooker_f_1": "预测哪个球员将会赢得一场指定赛事特定局数的胜利。",
                        "ART_ru_snooker_f_2": "投注的结算将依据WPBSA最终公布的局数获胜者为准。",
                    
                        "ART_ru_snooker_g": "打满比赛",
                        "ART_ru_snooker_g_1": "此规则适用于所有比赛，例如：”打满八局”比赛最终结果可能是7-1或者4-4等。",
                        ';
                        break;
                }
                break;
            case "usa_football":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_usaft": "美式足球",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "08/12/2017",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_usaft_a_1": "最終賽果是以全場四節的比分為準（包括加時賽）。",
                        "ART_ru_usaft_a_2": "單節/半場的投注，必須在比賽賽節完成後注單才被視為有效。",
                        "ART_ru_usaft_a_3": "第四節投注不包括加時賽。",
                        "ART_ru_usaft_a_4": "美國大學美式足球聯賽場地規則：盤口指示的\"主場\"和\"客場\"信息僅供參考。無論原定場地是否更改為\"主場\"，\"客場\"或\"中立場\"，所有註單將保持有效。",
                        "ART_ru_usaft_a_5": "除非個別玩法規則另有註明，賽事完場時間將包括加時賽。",
                        "ART_ru_usaft_a_6": "如比賽在法定時間提前進行，在比賽開始前的投注依然有效，在比賽開始後的所有投注均視為無效(滾球投注另作別論)。",
                    
                        "ART_ru_bettype": "投注類型",
                    
                        "ART_ru_usaft_b": "獨贏",
                        "ART_ru_usaft_b_1": "預測哪一支球隊將在比賽勝出。盤口提供兩支球隊為投注選項。",
                    
                        "ART_ru_usaft_c": "讓球",
                        "ART_ru_usaft_c_1": "預測哪一支球隊在盤口指定的讓分數贏得某個時節或全場比賽。",
                    
                        "ART_ru_usaft_d": "滾球讓球",
                        "ART_ru_usaft_d_1": "預測哪一支球隊在盤口指定的讓分數贏得某個時節或全場比賽。",
                        "ART_ru_usaft_d_2": "結算是以0-0的比分在比賽結束後按盤口開出的讓分數做裁決。投注當時的比分對結算沒有影響。",
                    
                        "ART_ru_usaft_e": "大/小（總比分）",
                        "ART_ru_usaft_e_1": "預測賽事總比分將大於或小於在盤口指定的大/小盤分數。",
                    
                        "ART_ru_usaft_f": "滾球大/小（總比分）",
                        "ART_ru_usaft_f_1": "預測賽事總比分將大於或小於在盤口指定的大/小盤分數。",
                        "ART_ru_usaft_f_2": "結算是以0-0的比分在比賽結束後按盤口開出的讓分數做裁決。投注當時的比分對結算沒有影響。",
                    
                        "ART_ru_usaft_g": "單/雙",
                        "ART_ru_usaft_g_1": "預測賽事的總比分是單數或雙數。加時賽將包括在內。",
                    
                        "ART_ru_usaft_h": "半場/全場",
                        "ART_ru_usaft_h_1": "預測在全場四節的半全場優胜球隊。加時賽將包括在內。",
                        "ART_ru_usaft_h_2": "此盤口也被稱為\'雙重結果\'。",
                    
                        "ART_ru_usaft_i": "淨勝分數",
                        "ART_ru_usaft_i_1": "投注的結算根據全場四節兩支球隊比分的差別做裁決。加時賽將包括在內。",
                        "ART_ru_usaft_i_2": "如果比賽在任何時間中斷，所有註單將被取消。",
                    
                        "ART_ru_usaft_j": "最先得分球隊",
                        "ART_ru_usaft_j_1": "預測最先得分的球隊。",
                        "ART_ru_usaft_j_2": "如果賽事在有得分後中斷，所有最先得分球隊的注單將保持有效。",
                        "ART_ru_usaft_j_3": "如果賽事在沒有球隊得分前中斷，所有最先得分球隊的注單將被取消。",
                        "ART_ru_usaft_j_4": "如果賽事在4節完場時間以及加時賽內沒有球隊得分，所有最先得分球隊的注單將被取消。",
                    
                        "ART_ru_usaft_k": "最後得分球隊",
                        "ART_ru_usaft_k_1": "預測最後得分的球隊。",
                        "ART_ru_usaft_k_2": "如果賽事中斷，所有最後得分球隊的注單將被取消。",
                        "ART_ru_usaft_k_3": "如果賽事在4節完場時間以及加時賽內沒有球隊得分，所有最後得分球隊的注單將被取消。",
                    
                        "ART_ru_usaft_l": "單節最高得分球隊",
                        "ART_ru_usaft_l_1": "預測單節最高得分的球隊。",
                        "ART_ru_usaft_l_2": "加時賽不計算在內。",
                        "ART_ru_usaft_l_3": "如果賽事中斷，所有單節最高得分球隊的注單將被取消。",
                        "ART_ru_usaft_l_4": "如果賽事在4節完場時間內沒有球隊得分，所有單節最高得分球隊的注單將被取消。",
                    
                        "ART_ru_usaft_m": "每節最先獲得10分的球隊",
                        "ART_ru_usaft_m_1": "預測每節最先得10分的球隊。",
                        "ART_ru_usaft_m_2": "加時賽不計算在內。",
                        "ART_ru_usaft_m_3": "如果賽事中斷，所有每節最先獲得10分的球隊的注單將被取消。",
                        "ART_ru_usaft_m_4": "如果每節都沒有球隊獲得10分，所有註單將被取消。",
                        "ART_ru_usaft_m_5": "取決於賽事，玩法指定球隊需最先獲得的分數可能有變化，並且會清楚的顯示在盤口。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_usaft": "AMERICAN FOOTBALL",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "08/12/2017",
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_usaft_a_1": "The final result is the score after the four quarters, including overtime.",
                        "ART_ru_usaft_a_2": "For Quarter / Half Betting, the period must be completed for bets to be valid.",
                        "ART_ru_usaft_a_3": "4th Quarter betting does not include overtime.",
                        "ART_ru_usaft_a_4": "NCAA Venue Rule: Please note, that the \"Home\" and \"Away\" venue indicated on the website is for reference only. Bets will stand regardless of change of venue, be it to the \"Home\" team\'s venue, the \"Away\" team\'s venue or to a \"Neutral\" venue.",
                        "ART_ru_usaft_a_5": "Overtime counts unless otherwise stated in the bet type rules below.",
                        "ART_ru_usaft_a_6": "If the game starts before the scheduled time, only bets placed before the game commenced will be considered valid. Bets placed after the game commenced will be considered void. This excludes In-Play bet types.",
                    
                        "ART_ru_bettype": "BET TYPES",
                    
                        "ART_ru_usaft_b": "Money Line / Winner",
                        "ART_ru_usaft_b_1": "Predict who will win the game. This market will contain the two teams.",
                    
                        "ART_ru_usaft_c": "Handicap",
                        "ART_ru_usaft_c_1": "Predict who will win the game / period with the indicated handicap applied.",
                    
                        "ART_ru_usaft_d": "Handicap (In-Play)",
                        "ART_ru_usaft_d_1": "Predict who will win the game / period with the indicated handicap applied.",
                        "ART_ru_usaft_d_2": "Settlement is based on the final score line after the handicap is applied to a 0-0 score line. The current score, at the time of bet placement, is not factored into the bet.",
                    
                        "ART_ru_usaft_e": "Over / Under",
                        "ART_ru_usaft_e_1": "Predict whether the total number of points scored will be over or under the indicated total line.",
                    
                        "ART_ru_usaft_f": "Over / Under (In-Play)",
                        "ART_ru_usaft_f_1": "Predict whether the total number of points scored will be over or under the indicated total line.",
                        "ART_ru_usaft_f_2": "Settlement is based on the final score.The current score, at the time of bet placement, is not factored into the bet.",
                    
                        "ART_ru_usaft_g": "Odd / Even",
                        "ART_ru_usaft_g_1": "Predict whether the total number of points scored will be odd or even. Overtime counts.",
                    
                        "ART_ru_usaft_h": "Half Time / Full Time",
                        "ART_ru_usaft_h_1": "Predict the winning selection at both Half Time and Full Time after the four quarters in the game. Overtime counts.",
                        "ART_ru_usaft_h_2": "This market is also known as \"Double Result\".",
                    
                        "ART_ru_usaft_i": "Winning Margin",
                        "ART_ru_usaft_i_1": "This refers to the point difference between the 2 teams at the end of the 4 quarters. Overtime counts",
                        "ART_ru_usaft_i_2": "If the game is abandoned at any time, all bets are void.",
                    
                        "ART_ru_usaft_j": "Team to Score First",
                        "ART_ru_usaft_j_1": "Predict which team will score first in the game.",
                        "ART_ru_usaft_j_2": "If the game is abandoned at any time, and a team has already scored prior to the abandonment, all bets will stand.",
                        "ART_ru_usaft_j_3": "If neither team has scored at the time of abandonment, all bets are considered void.",
                        "ART_ru_usaft_j_4": "If neither team has scored after the scheduled 4 quarters of normal play and overtime, then bets are considered void.",
                    
                        "ART_ru_usaft_k": "Team to Score Last",
                        "ART_ru_usaft_k_1": "Predict which team will score last in the game.",
                        "ART_ru_usaft_k_2": "If the game is abandoned at any time, then all bets will be considered void.",
                        "ART_ru_usaft_k_3": "If neither team has scored after the scheduled 4 quarters of normal play and overtime, then bets are considered void.",
                    
                        "ART_ru_usaft_l": "Team with the Highest Scoring Quarter",
                        "ART_ru_usaft_l_1": "Predict which team will score the most in a single quarter.",
                        "ART_ru_usaft_l_2": "Overtime does not count.",
                        "ART_ru_usaft_l_3": "If the game is abandoned at any time, then all bets will be considered void.",
                        "ART_ru_usaft_l_4": "If neither team has scored after the scheduled 4 quarters of normal play, then bets are considered void.",
                    
                        "ART_ru_usaft_m": "First Team to Score 10 Points in Each Quarter",
                        "ART_ru_usaft_m_1": "Predict which team will be the first to score 10 points in each quarter.",
                        "ART_ru_usaft_m_2": "Overtime does not count.",
                        "ART_ru_usaft_m_3": "If the game is abandoned at any time, then all bets will be considered void.",
                        "ART_ru_usaft_m_4": "If neither team has scores 10 points in each quarter, then bets are considered void.",
                        "ART_ru_usaft_m_5": "The number of points could vary, depending on the game. This will be clearly marked in the bet type.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_usaft": "美式足球",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "08/12/2017",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_usaft_a_1": "最终赛果是以全场四节的比分为准（包括加时赛）。",
                        "ART_ru_usaft_a_2": "单节/半场的投注，必须在比赛赛节完成后注单才被视为有效。",
                        "ART_ru_usaft_a_3": "第四节投注不包括加时赛。",
                        "ART_ru_usaft_a_4": "美国大学美式足球联赛场地规则：盘口指示的\"主场\"和\"客场\"信息仅供参考。无论原定场地是否更改为\"主场\"，\"客场\"或\"中立场\"，所有注单将保持有效。",
                        "ART_ru_usaft_a_5": "除非个别玩法规则另有注明，赛事完场时间将包括加时赛。",
                        "ART_ru_usaft_a_6": "如比赛在法定时间提前进行，在比赛开始前的投注依然有效，在比赛开始后的所有投注均视为无效(滚球投注另作别论)。",
                    
                        "ART_ru_bettype": "投注类型",
                    
                        "ART_ru_usaft_b": "独赢",
                        "ART_ru_usaft_b_1": "预测哪一支球队将在比赛胜出。盘口提供两支球队为投注选项。",
                    
                        "ART_ru_usaft_c": "让球",
                        "ART_ru_usaft_c_1": "预测哪一支球队在盘口指定的让分数赢得某个时节或全场比赛。",
                    
                        "ART_ru_usaft_d": "滚球让球",
                        "ART_ru_usaft_d_1": "预测哪一支球队在盘口指定的让分数赢得某个时节或全场比赛。",
                        "ART_ru_usaft_d_2": "结算是以0-0的比分在比赛结束后按盘口开出的让分数做裁决。投注当时的比分对结算没有影响。",
                    
                        "ART_ru_usaft_e": "大/小（总比分）",
                        "ART_ru_usaft_e_1": "预测赛事总比分将大于或小于在盘口指定的大/小盘分数。",
                    
                        "ART_ru_usaft_f": "滚球大/小（总比分）",
                        "ART_ru_usaft_f_1": "预测赛事总比分将大于或小于在盘口指定的大/小盘分数。",
                        "ART_ru_usaft_f_2": "结算是以0-0的比分在比赛结束后按盘口开出的让分数做裁决。投注当时的比分对结算没有影响。",
                    
                        "ART_ru_usaft_g": "单/双",
                        "ART_ru_usaft_g_1": "预测赛事的总比分是单数或双数。加时赛将包括在内。",
                    
                        "ART_ru_usaft_h": "半场/全场",
                        "ART_ru_usaft_h_1": "预测在全场四节的半全场优胜球队。加时赛将包括在内。",
                        "ART_ru_usaft_h_2": "此盘口也被称为\'双重结果\'。",
                    
                        "ART_ru_usaft_i": "净胜分数",
                        "ART_ru_usaft_i_1": "投注的结算根据全场四节两支球队比分的差别做裁决。加时赛将包括在内。",
                        "ART_ru_usaft_i_2": "如果比赛在任何时间中断，所有注单将被取消。",
                    
                        "ART_ru_usaft_j": "最先得分球队",
                        "ART_ru_usaft_j_1": "预测最先得分的球队。",
                        "ART_ru_usaft_j_2": "如果赛事在有得分后中断，所有最先得分球队的注单将保持有效。",
                        "ART_ru_usaft_j_3": "如果赛事在没有球队得分前中断，所有最先得分球队的注单将被取消。",
                        "ART_ru_usaft_j_4": "如果赛事在4节完场时间以及加时赛内没有球队得分，所有最先得分球队的注单将被取消。",
                    
                        "ART_ru_usaft_k": "最后得分球队",
                        "ART_ru_usaft_k_1": "预测最后得分的球队。",
                        "ART_ru_usaft_k_2": "如果赛事中断，所有最后得分球队的注单将被取消。",
                        "ART_ru_usaft_k_3": "如果赛事在4节完场时间以及加时赛内没有球队得分，所有最后得分球队的注单将被取消。",
                    
                        "ART_ru_usaft_l": "单节最高得分球队",
                        "ART_ru_usaft_l_1": "预测单节最高得分的球队。",
                        "ART_ru_usaft_l_2": "加时赛不计算在内。",
                        "ART_ru_usaft_l_3": "如果赛事中断，所有单节最高得分球队的注单将被取消。",
                        "ART_ru_usaft_l_4": "如果赛事在4节完场时间内没有球队得分，所有单节最高得分球队的注单将被取消。",
                    
                        "ART_ru_usaft_m": "每节最先获得10分的球队",
                        "ART_ru_usaft_m_1": "预测每节最先得10分的球队。",
                        "ART_ru_usaft_m_2": "加时赛不计算在内。",
                        "ART_ru_usaft_m_3": "如果赛事中断，所有每节最先获得10分的球队的注单将被取消。",
                        "ART_ru_usaft_m_4": "如果每节都没有球队获得10分，所有注单将被取消。",
                        "ART_ru_usaft_m_5": "取决于赛事，玩法指定球队需最先获得的分数可能有变化，并且会清楚的显示在盘口。",
                        ';
                        break;
                }
                break;
            case "archery":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_archery": "射箭和射擊",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "04/03/2015",
                        "ART_ru_rule": "一般規則",
                    
                        "ART_ru_archery_a_1": "在賽事頒獎儀式上所授予的金牌，銀牌及銅牌被視為第一名，第二名及第三名。",
                        "ART_ru_archery_a_2": "頒獎儀式公佈的名次將視為官方結果，如之後發生取消資格或修改結果的情況將不予以考慮。",
                        "ART_ru_archery_a_3": "如果投注的團體或射擊手沒有參與比賽，所有註單將保持有效。",
                        "ART_ru_archery_a_4": "如比賽在法定時間提前進行，在比賽開始前的投注依然有效，在比賽開始後的所有投注均視為無效(滾球投注另作別論)。",
                        "ART_ru_archery_a_5": "注單的結算在比賽結束後將根據官方FITA（射箭）和ISSF（射擊）判定的賽果為準，有無頒獎儀式將不影響。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_archery": "ARCHERY",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "04/03/2015",
                        "ART_ru_rule": "GENERAL RULES",
                    
                        "ART_ru_archery_a_1": "For betting purposes, participants awarded Gold, Silver and Bronze at the medal ceremony will be deemed as the 1st, 2nd and 3rd place winner.",
                        "ART_ru_archery_a_2": "Podium positions will count as the official results, regardless of any subsequent disqualification or amendment to the result.",
                        "ART_ru_archery_a_3": "All bets will still stand even if a crew or individual competes or not.",
                        "ART_ru_archery_a_4": "If the event starts before the scheduled time, only bets placed before the event commenced will be considered valid. Bets placed after the event commenced will be considered void. This excludes In-Play bet types.",
                        "ART_ru_archery_a_5": "Bets will be settled according to the official F.I.T.A (Archery) and I.S.S.F (Shooting) results immediately at the end of the event, even in the absence of a medal ceremony.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_archery": "射箭和射击",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "04/03/2015",
                        "ART_ru_rule": "一般规则",
                    
                        "ART_ru_archery_a_1": "在赛事颁奖仪式上所授予的金牌，银牌及铜牌被视为第一名，第二名及第三名。",
                        "ART_ru_archery_a_2": "颁奖仪式公布的名次将视为官方结果，如之后发生取消资格或修改结果的情况将不予以考虑。",
                        "ART_ru_archery_a_3": "如果投注的团体或射击手没有参与比赛，所有注单将保持有效。",
                        "ART_ru_archery_a_4": "如比赛在法定时间提前进行，在比赛开始前的投注依然有效，在比赛开始后的所有投注均视为无效(滚球投注另作别论)。",
                        "ART_ru_archery_a_5": "注单的结算在比赛结束后将根据官方FITA（射箭）和ISSF（射击）判定的赛果为准，有无颁奖仪式将不影响。",
                        ';
                        break;
                }
                break;
            case "athletic":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_athletic": "田徑",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "04/03/2015",
                        "ART_ru_rule": "一般規則",
                    
                        "ART_ru_athletic_a_1": "在賽事頒獎儀式上所授予的金牌，銀牌及銅牌被視為第一名，第二名及第三名。",
                        "ART_ru_athletic_a_2": "頒獎儀式公佈的名次將視為官方結果，如之後發生取消資格或修改結果的情況將不予以考慮。",
                        "ART_ru_athletic_a_3": "除了投注在沒有參與第一輪預賽/資格賽的選手之外，所有註單將視為有效。",
                        "ART_ru_athletic_a_4": "如果該場賽事沒有第一輪預賽/資格賽，注單的結算將按照比賽的最終結果為準。",
                        "ART_ru_athletic_a_5": "如比賽在法定時間提前進行，在比賽開始前的投注依然有效，在比賽開始後的所有投注均視為無效(滾球投注另作別論)。",
                        "ART_ru_athletic_a_6": "注單的結算在比賽結束後將根據官方IAAF判定的賽果為準，有無頒獎儀式將不影響。",
                        "ART_ru_athletic_a_7": "投註二選一，賽事投注或三方對賽的盤口，以下規則將運用於此：",
                        "ART_ru_athletic_a_7_1_1": "如果只有一位選手晉級決賽，投注該選手的注單將結算為贏。",
                        "ART_ru_athletic_a_7_1_2": "如果沒有選手晉級至決賽，冠軍將根據(a.)完成最多回合，或(b.)資格賽中以最佳時間完成比賽的選手為準。",
                        "ART_ru_athletic_a_8": "(a) 回合-優勝者則是能晉級到下一回合的資格賽並且已將其他選手擊敗。",
                        "ART_ru_athletic_a_9": "(b) 最佳時間-用於當選手在同一個資格賽但不同場次進行比賽時。以最佳時間完成比賽的選手來決定優勝者，無論選手在該場次獲得的名次。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_athletic": "ATHLETICS",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "04/03/2015",
                        "ART_ru_rule": "GENERAL RULES",
                    
                        "ART_ru_athletic_a_1": "For betting purposes, participants awarded Gold, Silver and Bronze at the medal ceremony will be deemed as the 1st, 2nd and 3rd place winner.",
                        "ART_ru_athletic_a_2": "Podium positions will count as the official results, regardless of any subsequent disqualification or amendment to the result.",
                        "ART_ru_athletic_a_3": "All bets stand except for those placed on participants not competing in first round heats / qualification.",
                        "ART_ru_athletic_a_4": "If the event does not have any first round heats / qualification, the final competition will be taken as the final outcome of the match.",
                        "ART_ru_athletic_a_5": "If the event starts before the scheduled time, only bets placed before the event commenced will be considered valid. Bets placed after the event commenced will be considered void. This excludes In-Play bet types.",
                        "ART_ru_athletic_a_6": "Bets are settled according to the official I.A.A.F result immediately at the end of the event, even in the absence of a medal ceremony.",
                        "ART_ru_athletic_a_7": "For Head to Head, Match Bets or 3-Way Match Bets, the following rules apply:",
                        "ART_ru_athletic_a_7_1_1": "If only one of the contestants reaches the finals, bets on that selection will be settled as a winner.",
                        "ART_ru_athletic_a_7_1_2": "If none of the contestants make it to the finals, the winner will either be based on the rounds that have been completed or the best time achieved during the qualifying round\'s heats.",
                        "ART_ru_athletic_a_8": "Rounds - The winner will be the competitor who qualifies for the next qualifying round providing the other competitor(s) have been knocked out.",
                        "ART_ru_athletic_a_9": "Time – Applies when the contestants are competing in different heats within the same qualifying round. The best time will be used to decide the winner regardless on positions obtained in the run.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_athletic": "田径",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "04/03/2015",
                        "ART_ru_rule": "一般规则",
                    
                        "ART_ru_athletic_a_1": "在赛事颁奖仪式上所授予的金牌，银牌及铜牌被视为第一名，第二名及第三名。",
                        "ART_ru_athletic_a_2": "颁奖仪式公布的名次将视为官方结果，如之后发生取消资格或修改结果的情况将不予以考虑。",
                        "ART_ru_athletic_a_3": "除了投注在没有参与第一轮预赛/资格赛的选手之外，所有注单将视为有效。",
                        "ART_ru_athletic_a_4": "如果该场赛事没有第一轮预赛/资格赛，注单的结算将按照比赛的最终结果为准。",
                        "ART_ru_athletic_a_5": "如比赛在法定时间提前进行，在比赛开始前的投注依然有效，在比赛开始后的所有投注均视为无效(滚球投注另作别论)。",
                        "ART_ru_athletic_a_6": "注单的结算在比赛结束后将根据官方IAAF判定的赛果为准，有无颁奖仪式将不影响。",
                        "ART_ru_athletic_a_7": "投注二选一，赛事投注或三方对赛的盘口，以下规则将运用于此：",
                        "ART_ru_athletic_a_7_1_1": "如果只有一位选手晋级决赛，投注该选手的注单将结算为赢。",
                        "ART_ru_athletic_a_7_1_2": "如果没有选手晋级至决赛，冠军将根据(a.)完成最多回合，或(b.)资格赛中以最佳时间完成比赛的选手为准。",
                        "ART_ru_athletic_a_8": "(a) 回合-优胜者则是能晋级到下一回合的资格赛并且已将其他选手击败。",
                        "ART_ru_athletic_a_9": "(b) 最佳时间-用于当选手在同一个资格赛但不同场次进行比赛时。以最佳时间完成比赛的选手来决定优胜者，无论选手在该场次获得的名次。",
                        ';
                        break;
                }
                break;
            case "aussie":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_aussie": "澳式足球",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "18/07/2016",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_aussie_a_1": "如果比賽場地有變更，所有註單將被取消。",
                        "ART_ru_aussie_a_2": "除非另有註明，所有澳式足球投注的結算皆以球賽所規定的完場時間80分鐘為準。",
                        "ART_ru_aussie_a_3": "完場時間80分鐘包括球員傷停補時。",
                        "ART_ru_aussie_a_4": "如果賽事是在上半場中斷，所有上半場的注單將被取消。如果賽事是在下半場中斷所有上半場的投注保持有效，但所有下半場的注單將被取消，除非在個別玩法規則另有註明。",
                    
                        "ART_ru_bettype": "投注類型",
                        "ART_ru_aussie_b": "獨贏",
                        "ART_ru_aussie_b_1": "預測哪一支球隊將在比賽勝出。盤口提供兩支球隊為投注選項。如果賽事出現平局，所有投注此盤口的注單將被取消。",
                    
                        "ART_ru_aussie_c": "1 X 2",
                        "ART_ru_aussie_c_1": "預測哪一支球隊將在比賽勝出。盤口提供兩支球隊和平局為投注選項。",
                    
                        "ART_ru_aussie_d": "讓球",
                        "ART_ru_aussie_d_1": "預測哪一支球隊在盤口指定的讓球數贏得某個時節或全場比賽。",
                    
                        "ART_ru_aussie_e": "滾球讓球盤",
                        "ART_ru_aussie_e_1": "預測哪一支球隊在盤口指定的讓球數贏得某個時節或全場比賽。",
                        "ART_ru_aussie_e_2": "結算是以0-0的比分在比賽/時節結束後按盤口開出的讓球數做裁決。投注當時的比分對結算沒有影響。",
                    
                        "ART_ru_aussie_f": "大/小盤（總比分）",
                        "ART_ru_aussie_f_1": "預測賽事總比分將大於或小於在盤口指定的大/小盤分數。",
                        "ART_ru_aussie_f_2": "如果賽事中斷前已有明確結果並且之後沒有任何顯著會影響賽事結果的情況，大/小盤注單才會被結算。若遇到任何其他情況，注單將一律被取消。",
                        "ART_ru_aussie_f_3": "如果賽事在上半場中斷，所有上半場注單將被取消，除非中斷前已有明確結果並且之後沒有任何顯著會影響賽事結果的情況注單才會被結算。",
                        "ART_ru_aussie_f_4": "如果賽事在下半場取消或中斷，所有上半場注單保持有效。",
                        "ART_ru_aussie_f_5": "如果賽事在下半場取消或中斷，所有下半場注單將被取消，除非中斷前已有明確結果並且之後沒有任何顯著會影響賽事結果的情況注單才會被結算。",
                    
                        "ART_ru_aussie_g": "滾球大/小盤（總比分）",
                        "ART_ru_aussie_g_1": "預測賽事總比分將大於或小於在盤口指定的大/小盤分數。",
                        "ART_ru_aussie_g_2": "結算是以0-0的比分在比賽/時節結束後按盤口開出的讓分數做裁決。",
                    
                        "ART_ru_aussie_h": "單雙（總比分）",
                        "ART_ru_aussie_h_1": "預測賽事的總比分是單數或雙數。",
                    
                        "ART_ru_aussie_i": "最先得分球隊",
                        "ART_ru_aussie_i_1": "預測最先得分的球隊。",
                        "ART_ru_aussie_i_2": "如果賽事在有得分後中斷，所有最先得分球隊的注單將保持有效。",
                        "ART_ru_aussie_i_3": "如果賽事在沒有球隊得分前中斷，所有最先得分球隊的注單將被取消。",
                        "ART_ru_aussie_i_4": "如果賽事在80分鐘完場時間（包括傷停補時）內沒有球隊得分，所有最先得分球隊的注單將被取消。",
                    
                        "ART_ru_aussie_j": "最後得分球隊",
                        "ART_ru_aussie_j_1": "預測最後得分的球隊（包括罰球賽得分）。",
                        "ART_ru_aussie_j_2": "如果賽事中斷， 所有最後得分球隊的注單將被取消。",
                        "ART_ru_aussie_j_3": "如果賽事在80分鐘完場時間（包括傷停補時）內沒有球隊得分，所有最後得分球隊的注單將被取消。",
                    
                        "ART_ru_aussie_k": "單節最高得分球隊",
                        "ART_ru_aussie_k_1": "預測單節最高得分的球隊。",
                        "ART_ru_aussie_k_2": "如果賽事中斷，所有單節最高得分球隊的注單將被取消。",
                        "ART_ru_aussie_k_3": "如果賽事在4節完場時間內沒有球隊得分，所有單節最高得分球隊的注單將被取消。",
                    
                        "ART_ru_aussie_l": "最先獲得20分的球隊",
                        "ART_ru_aussie_l_1": "預測最先獲得20分的球隊。",
                        "ART_ru_aussie_l_2": "如果賽事中斷前已有明確結果並且之後沒有任何顯著會影響賽事結果的情況，注單才會被結算。若遇到任何其他情況，注單將一律被取消。",
                        "ART_ru_aussie_l_3": "如果沒有球隊獲得20分，所有註單將被取消。",
                        "ART_ru_aussie_l_4": "取決於賽事，玩法指定球隊需最先獲得的分數可能有變化，並且會清楚的顯示在盤口。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_aussie": "AUSSIE",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "18/07/2016",
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_aussie_a_1": "If the scheduled venue is changed, all bets will be considered void.",
                        "ART_ru_aussie_a_2": "Unless otherwise stated, all Aussie Rules bets are settled based on the scheduled \"80 minutes\" play.",
                        "ART_ru_aussie_a_3": "The term \"80 minutes\" play includes any stoppage time.",
                        "ART_ru_aussie_a_4": "If a game is abandoned during the 1st half, all 1st half bets are considered void. If a game is abandoned during the 2nd half, all 2nd half bets are considered void, unless otherwise stated in the individual bet type rules. All 1st half bets will still be valid.",
                    
                        "ART_ru_bettype": "BET TYPES",
                        "ART_ru_aussie_b": "Money Line",
                        "ART_ru_aussie_b_1": "Predict who will win the game. This market will contain the two teams as betting selections. In the event of a draw, bets will be refunded.",
                    
                        "ART_ru_aussie_c": "1 X 2",
                        "ART_ru_aussie_c_1": "Predict who will win the game. This market will contain the two teams and the ties as betting selections.",
                    
                        "ART_ru_aussie_d": "Handicap",
                        "ART_ru_aussie_d_1": "Predict who will win the game / period with the indicated handicap applied.",
                    
                        "ART_ru_aussie_e": "Handicap (In-Play)",
                        "ART_ru_aussie_e_1": "Predict who will win the game / period with the indicated handicap applied.",
                        "ART_ru_aussie_e_2": "Settlement is based on the final score after the handicap is applied to a 0-0 score line. The current score, at the time of bet placement, is not factored into the bet.",
                    
                        "ART_ru_aussie_f": "Total Points: Over / Under",
                        "ART_ru_aussie_f_1": "Predict whether the total number of points scored will be over or under the indicated total line.",
                        "ART_ru_aussie_f_2": "If a game is abandoned, Over / Under bets will only be settled when the market has been unconditionally determined as any further potential points have no affect on the market result. In all other scenarios, bets will be considered void.",
                        "ART_ru_aussie_f_3": "If the game is abandoned during the 1st half, all 1st half bets will be void unless they have been unconditionally determined as any further potential points have no affect on the market result.",
                        "ART_ru_aussie_f_4": "If the game is abandoned during the 2nd half, all 1st half bets will still be valid.",
                        "ART_ru_aussie_f_5": "If the game is abandoned during the 2nd half, all 2nd half bets will be void unless they have been unconditionally determined as any further potential points have no affect on the market result.",
                    
                        "ART_ru_aussie_g": "Total Points: Over / Under (In-Play)",
                        "ART_ru_aussie_g_1": "Predict whether the total number of points scored will be over or under the indicated total line.",
                        "ART_ru_aussie_g_2": "Settlement is based on the final score and the total line is applied to a 0-0 score line.",
                    
                        "ART_ru_aussie_h": "Total Points: Odd / Even",
                        "ART_ru_aussie_h_1": "Predict whether the total number of points scored will be odd or even.",
                    
                        "ART_ru_aussie_i": "Team to Score First",
                        "ART_ru_aussie_i_1": "Predict which team will score first in the game.",
                        "ART_ru_aussie_i_2": "If the game is abandoned at any time, and a team has already been scored prior to the abandonment, all bets will stand.",
                        "ART_ru_aussie_i_3": "If neither team has scored at the time of abandonment, all bets are considered void.",
                        "ART_ru_aussie_i_4": "If neither team has scored after the scheduled \"80 minutes\" of normal play and stoppage time, then bets are considered void.",
                    
                        "ART_ru_aussie_j": "Team to Score Last",
                        "ART_ru_aussie_j_1": "Predict which team will score last in the game. This includes penalty tries.",
                        "ART_ru_aussie_j_2": "If the game is abandoned at any time, then all bets will be considered void.",
                        "ART_ru_aussie_j_3": "If neither team has scored after the scheduled \"80 minutes\" of normal play and stoppage time, then bets are considered void.",
                    
                        "ART_ru_aussie_k": "Team with the Highest Scoring Quarter",
                        "ART_ru_aussie_k_1": "Predict which team will score the most in a single quarter.",
                        "ART_ru_aussie_k_2": "If the game is abandoned at any time, then all bets will be considered void.",
                        "ART_ru_aussie_k_3": "If neither team has scored after the scheduled 4 quarters of normal play, then bets are considered void.",
                    
                        "ART_ru_aussie_l": "First Team to Score 20 Points",
                        "ART_ru_aussie_l_1": "Predict which team will be the first to score 20 points.",
                        "ART_ru_aussie_l_2": "If a game is abandoned, bets will only be settled when the market has been unconditionally determined as any further potential points have no affect on the market result. In all other scenarios, bets will be considered void.",
                        "ART_ru_aussie_l_3": "If neither team scores 20 points, then bets are considered void.",
                        "ART_ru_aussie_l_4": "The number of points could vary, depending on the game. This will be clearly marked in the bet type.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_aussie": "澳式足球",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "18/07/2016",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_aussie_a_1": "如果比赛场地有变更，所有注单将被取消。",
                        "ART_ru_aussie_a_2": "除非另有注明，所有澳式足球投注的结算皆以球赛所规定的完场时间80分钟为准。",
                        "ART_ru_aussie_a_3": "完场时间80分钟包括球员伤停补时。",
                        "ART_ru_aussie_a_4": "如果赛事是在上半场中断，所有上半场的注单将被取消。如果赛事是在下半场中断所有上半场的投注保持有效，但所有下半场的注单将被取消，除非在个别玩法规则另有注明。",
                    
                        "ART_ru_bettype": "投注类型",
                        "ART_ru_aussie_b": "独赢",
                        "ART_ru_aussie_b_1": "预测哪一支球队将在比赛胜出。盘口提供两支球队为投注选项。如果赛事出现平局，所有投注此盘口的注单将被取消。",
                    
                        "ART_ru_aussie_c": "1 X 2",
                        "ART_ru_aussie_c_1": "预测哪一支球队将在比赛胜出。盘口提供两支球队和平局为投注选项。",
                    
                        "ART_ru_aussie_d": "让球",
                        "ART_ru_aussie_d_1": "预测哪一支球队在盘口指定的让球数赢得某个时节或全场比赛。",
                    
                        "ART_ru_aussie_e": "滚球让球盘",
                        "ART_ru_aussie_e_1": "预测哪一支球队在盘口指定的让球数赢得某个时节或全场比赛。",
                        "ART_ru_aussie_e_2": "结算是以0-0的比分在比赛/时节结束后按盘口开出的让球数做裁决。投注当时的比分对结算没有影响。",
                    
                        "ART_ru_aussie_f": "大/小盘（总比分）",
                        "ART_ru_aussie_f_1": "预测赛事总比分将大于或小于在盘口指定的大/小盘分数。",
                        "ART_ru_aussie_f_2": "如果赛事中断前已有明确结果并且之后没有任何显著会影响赛事结果的情况，大/小盘注单才会被结算。若遇到任何其他情况，注单将一律被取消。",
                        "ART_ru_aussie_f_3": "如果赛事在上半场中断，所有上半场注单将被取消，除非中断前已有明确结果并且之后没有任何显著会影响赛事结果的情况注单才会被结算。",
                        "ART_ru_aussie_f_4": "如果赛事在下半场取消或中断，所有上半场注单保持有效。",
                        "ART_ru_aussie_f_5": "如果赛事在下半场取消或中断，所有下半场注单将被取消，除非中断前已有明确结果并且之后没有任何显著会影响赛事结果的情况注单才会被结算。",
                    
                        "ART_ru_aussie_g": "滚球大/小盘（总比分）",
                        "ART_ru_aussie_g_1": "预测赛事总比分将大于或小于在盘口指定的大/小盘分数。",
                        "ART_ru_aussie_g_2": "结算是以0-0的比分在比赛/时节结束后按盘口开出的让分数做裁决。",
                    
                        "ART_ru_aussie_h": "单双（总比分）",
                        "ART_ru_aussie_h_1": "预测赛事的总比分是单数或双数。",
                    
                        "ART_ru_aussie_i": "最先得分球队",
                        "ART_ru_aussie_i_1": "预测最先得分的球队。",
                        "ART_ru_aussie_i_2": "如果赛事在有得分后中断，所有最先得分球队的注单将保持有效。",
                        "ART_ru_aussie_i_3": "如果赛事在没有球队得分前中断，所有最先得分球队的注单将被取消。",
                        "ART_ru_aussie_i_4": "如果赛事在80分钟完场时间（包括伤停补时）内没有球队得分，所有最先得分球队的注单将被取消。",
                    
                        "ART_ru_aussie_j": "最后得分球队",
                        "ART_ru_aussie_j_1": "预测最后得分的球队（包括罚球赛得分）。",
                        "ART_ru_aussie_j_2": "如果赛事中断， 所有最后得分球队的注单将被取消。",
                        "ART_ru_aussie_j_3": "如果赛事在80分钟完场时间（包括伤停补时）内没有球队得分，所有最后得分球队的注单将被取消。",
                    
                        "ART_ru_aussie_k": "单节最高得分球队",
                        "ART_ru_aussie_k_1": "预测单节最高得分的球队。",
                        "ART_ru_aussie_k_2": "如果赛事中断，所有单节最高得分球队的注单将被取消。",
                        "ART_ru_aussie_k_3": "如果赛事在4节完场时间内没有球队得分，所有单节最高得分球队的注单将被取消。",
                    
                        "ART_ru_aussie_l": "最先获得20分的球队",
                        "ART_ru_aussie_l_1": "预测最先获得20分的球队。",
                        "ART_ru_aussie_l_2": "如果赛事中断前已有明确结果并且之后没有任何显著会影响赛事结果的情况，注单才会被结算。若遇到任何其他情况，注单将一律被取消。",
                        "ART_ru_aussie_l_3": "如果没有球队获得20分，所有注单将被取消。",
                        "ART_ru_aussie_l_4": "取决于赛事，玩法指定球队需最先获得的分数可能有变化，并且会清楚的显示在盘口。",
                        ';
                        break;
                }
                break;
            case "beach_soccer":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_beach_soccer": "沙灘足球",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "18/07/2016",
                    
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_beach_ft_a_1": "如果比賽場地有變更，所有註單將被取消。",
                        "ART_ru_beach_ft_a_2": "除非另有註明，所有沙灘足球投注的結算皆以球賽在3節（每節12分鐘）完賽後的最終賽果為準。",
                        "ART_ru_beach_ft_a_3": "如比賽在法定時間提前進行，在比賽開始前的投注依然有效，在比賽開始後的所有投注均視為無效(滾球投注另作別論)。",
                    
                        "ART_ru_bettype": "投注類型",
                        "ART_ru_beach_ft_b": "獨贏",
                        "ART_ru_beach_ft_b_1": "預測哪一支球隊將在比賽勝出。盤口提供兩支球隊和平局為投注選項。",
                    
                        "ART_ru_beach_ft_c": "讓球",
                        "ART_ru_beach_ft_c_1": "預測哪一支球隊在盤口指定的讓球數贏得某個時節或全場比賽。",
                    
                        "ART_ru_beach_ft_d": "滾球讓球",
                        "ART_ru_beach_ft_d_1": "預測哪一支球隊在盤口指定的讓球數贏得某個時節或全場比賽。",
                        "ART_ru_beach_ft_d_2": "結算是以投注時到比賽/時節結束後的賽果做裁決。即是以賽事完場比分減去投注當時的比分。",
                    
                        "ART_ru_beach_ft_e": "進球: 大 / 小",
                        "ART_ru_beach_ft_e_1": "預測賽事總入球數將大於或小於在盤口指定的大/小盤球數。",
                        "ART_ru_beach_ft_e_2": "如果賽事中斷前已有明確結果並且之後沒有任何顯著會影響賽事結果的情況，大/小盤注單才會被結算。若遇到任何其他情況，注單將一律被取消。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_beach_soccer": "BEACH SOCCER",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "13/07/2017",
                    
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_beach_ft_a_1": "If the scheduled venue is changed, all bets will be considered void.",
                        "ART_ru_beach_ft_a_2": "Unless otherwise stated, all Beach Soccer bets are settled based on the result at the end of three periods (12 minutes each).",
                        "ART_ru_beach_ft_a_3": "If the match started earlier than the scheduled time, only bets before the match time will be accepted, otherwise bets will be considered void.",
                    
                        "ART_ru_bettype": "BET TYPES",
                        "ART_ru_beach_ft_b": "1X2",
                        "ART_ru_beach_ft_b_1": "Predict who will win the match. This market will contain the two teams and the draw as betting selections.",
                    
                        "ART_ru_beach_ft_c": "Handicap",
                        "ART_ru_beach_ft_c_1": "Predict who will win the match / period with the indicated handicap applied.",
                    
                        "ART_ru_beach_ft_d": "Handicap (In-Play)",
                        "ART_ru_beach_ft_d_1": "Predict who will win the match / period with the indicated handicap applied.",
                        "ART_ru_beach_ft_d_2": "Settlement is based on the score line, from when the bet was placed to the end of the match / period – i.e. the final score minus the current score of the match.",
                    
                        "ART_ru_beach_ft_e": "Total Goals: Over / Under",
                        "ART_ru_beach_ft_e_1": "Predict whether the total number of goals scored will be over or under the indicated goal line.",
                        "ART_ru_beach_ft_e_2": "If a match is abandoned, Over / Under bets will only be settled when the market has been unconditionally determined and any further goals have no affect on the market result. In all other scenarios, bets will be considered void.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_beach_soccer": "沙滩足球",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "18/07/2016",
	
                        "ART_ru_rule": "一般规则",
                        "ART_ru_beach_ft_a_1": "如果比赛场地有变更，所有注单将被取消。",
                        "ART_ru_beach_ft_a_2": "除非另有注明，所有沙滩足球投注的结算皆以球赛在3节（每节12分钟）完赛后的最终赛果为准。",
                        "ART_ru_beach_ft_a_3": "如比赛在法定时间提前进行，在比赛开始前的投注依然有效，在比赛开始后的所有投注均视为无效(滚球投注另作别论)。",
                    
                        "ART_ru_bettype": "投注类型",
                        "ART_ru_beach_ft_b": "独赢",
                        "ART_ru_beach_ft_b_1": "预测哪一支球队将在比赛胜出。盘口提供两支球队和平局为投注选项。",
                    
                        "ART_ru_beach_ft_c": "让球",
                        "ART_ru_beach_ft_c_1": "预测哪一支球队在盘口指定的让球数赢得某个时节或全场比赛。",
                    
                        "ART_ru_beach_ft_d": "滚球让球",
                        "ART_ru_beach_ft_d_1": "预测哪一支球队在盘口指定的让球数赢得某个时节或全场比赛。",
                        "ART_ru_beach_ft_d_2": "结算是以投注时到比赛/时节结束后的赛果做裁决。即是以赛事完场比分减去投注当时的比分。",
                    
                        "ART_ru_beach_ft_e": "进球: 大 / 小",
                        "ART_ru_beach_ft_e_1": "预测赛事总入球数将大于或小于在盘口指定的大/小盘球数。",
                        "ART_ru_beach_ft_e_2": "如果赛事中断前已有明确结果并且之后没有任何显著会影响赛事结果的情况，大/小盘注单才会被结算。若遇到任何其他情况，注单将一律被取消。",
                        ';
                        break;
                }
                break;
            case "beach_volleyball":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_beach_volleyball": "沙灘排球",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "19/07/2016",
                    
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_beach_vb_a_1": "如果比賽沒有完成，所有的投注將被視為無效，除非另有特別說明。",
                        "ART_ru_beach_vb_a_2": "如果開賽前球員的名字有更改，公司保留取消注單的權利。",
                        "ART_ru_beach_vb_a_3": "投注將會根據球隊三局兩勝制結算。",
                        "ART_ru_beach_vb_a_4": "如果比賽預定時間縮短，或者賽事獲勝要求比分提高，所有註單將被取消。",
                        "ART_ru_beach_vb_a_5": "如果比賽提前開賽，只有在開賽之前投注的注單將為視為有效投注。在開賽后投注的注單將被視為無效， 滾球玩法除外。",
                    
                        "ART_ru_bettype": "投注類型",
                        "ART_ru_beach_vb_b": "獨贏",
                        "ART_ru_beach_vb_b_1": "預測哪一方贏得比賽。",
                    
                        "ART_ru_beach_vb_c": "讓局",
                        "ART_ru_beach_vb_c_1": "預測哪一方在指定的讓分情況下贏得比賽。",
                    
                        "ART_ru_beach_vb_d": "讓分",
                        "ART_ru_beach_vb_d_1": "預測哪一方在指定的讓分局數中可以獲得更高的分數（例如：第一局，第二局）。",
                    
                        "ART_ru_beach_vb_e": "總分: 大 / 小",
                        "ART_ru_beach_vb_e_1": "預測在指定的局數中的總得分是大還是小，盤口中會有大小的分割線。（例如：第一局，第二局）。",
                    
                        "ART_ru_beach_vb_f": "單/雙",
                        "ART_ru_beach_vb_f_1": "預測在指定的局數中的總得分是單還是雙。（例如：第一局，第二局）",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_beach_volleyball": "BEACH VOLLEYBALL",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "08/09/2016",
                    
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_beach_vb_a_1": "All bets will be considered valid only when the match is finished, unless otherwise stated. ",
                        "ART_ru_beach_vb_a_2": "If any of the named players in a match changes before the match starts, the company reserved the right to void all bets.",
                        "ART_ru_beach_vb_a_3": "Bets will be settled based on the team that wins the first 2 sets out of the total 3 sets played.",
                        "ART_ru_beach_vb_a_4": "If the scheduled duration of a match is reduced or if there is an increase in the number of points to win, all bets will be considered void.",
                        "ART_ru_beach_vb_a_5": "If a match starts before schedule, only the transactions before the game starts will be considered valid. The transactions after the match starts will be considered invalid. (Except in-play bet types).",
                    
                        "ART_ru_bettype": "BET TYPES",
                        "ART_ru_beach_vb_b": "Money Line / Winner",
                        "ART_ru_beach_vb_b_1": "Predict who will win the match.",
                    
                        "ART_ru_beach_vb_c": "Set Handicap",
                        "ART_ru_beach_vb_c_1": "Predict who will win the match with the indicated set handicap applied.",
                    
                        "ART_ru_beach_vb_d": "Point Handicap",
                        "ART_ru_beach_vb_d_1": "Predict who will win more points in a specified period (e.g. Match, 1st Set, 2nd Set) after applying the indicated handicap.",
                    
                        "ART_ru_beach_vb_e": "Total Points: Over / Under",
                        "ART_ru_beach_vb_e_1": "Predict whether the total number of points in a specified period (e.g. Match, 1st Set, 2nd Set) will be over or under the indicated total line.",
                    
                        "ART_ru_beach_vb_f": "Odd / Even",
                        "ART_ru_beach_vb_f_1": "Predict whether the total number of points in a specified period (e.g. Match, 1st Set, 2nd Set) will be odd or even.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_beach_volleyball": "沙滩排球",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "19/07/2016",
                    
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_beach_vb_a_1": "如果比赛没有完成，所有的投注将被视为无效，除非另有特别说明。",
                        "ART_ru_beach_vb_a_2": "如果开赛前球员的名字有更改，公司保留取消注单的权利。",
                        "ART_ru_beach_vb_a_3": "投注将会根据球队三局两胜制结算。",
                        "ART_ru_beach_vb_a_4": "如果比赛预定时间缩短，或者赛事获胜要求比分提高，所有注单将被取消。",
                        "ART_ru_beach_vb_a_5": "如果比赛提前开赛，只有在开赛之前投注的注单将为视为有效投注。在开赛后投注的注单将被视为无效， 滚球玩法除外。",
                    
                        "ART_ru_bettype": "投注类型",
                        "ART_ru_beach_vb_b": "独赢",
                        "ART_ru_beach_vb_b_1": "预测哪一方赢得比赛。",
                    
                        "ART_ru_beach_vb_c": "让局",
                        "ART_ru_beach_vb_c_1": "预测哪一方在指定的让分情况下赢得比赛。",
                    
                        "ART_ru_beach_vb_d": "让分",
                        "ART_ru_beach_vb_d_1": "预测哪一方在指定的让分局数中可以获得更高的分数（例如：第一局，第二局）。",
                    
                        "ART_ru_beach_vb_e": "总分: 大 / 小",
                        "ART_ru_beach_vb_e_1": "预测在指定的局数中的总得分是大还是小，盘口中会有大小的分割线。（例如：第一局，第二局）。",
                    
                        "ART_ru_beach_vb_f": "单/双",
                        "ART_ru_beach_vb_f_1": "预测在指定的局数中的总得分是单还是双。（例如：第一局，第二局）",
                        ';
                        break;
                }
                break;
            case "boxing":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_boxing": "拳擊",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_boxing_date": "04/09/2019",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_boxing_a_1": "第一回合的鈴聲響起後，投注的注單將視為有效。",
                        "ART_ru_boxing_a_2": "每個回合的時長為3分鐘；大/小盤裡的\'半回合\'將以90秒為準。",
                        "ART_ru_boxing_a_3": "如果規定的回合數有所更改，所有投注大/小盤注單將被取消。",
                        "ART_ru_boxing_a_4": "如果賽事出現平局， 投注二選一（H2H）玩法的注單將被取消。",
                        "ART_ru_boxing_a_5": "注單的結算將根據比賽公佈的結果為準，比賽結果可以以點數，技術性擊倒，擊倒或剝奪資格來定義。",
                        "ART_ru_boxing_a_5_1": "KO（擊倒）包括TKO（技術性擊倒）和剝奪拳擊手資格。",
                        "ART_ru_boxing_a_5_2": "平局包括技術性打和。",
                        "ART_ru_boxing_a_5_3": "判決包括技術性判決。",
                        "ART_ru_boxing_a_6": "如果賽果在比賽結束並且拳擊手離開擂台後有任何修正或修改將被視為無效。",
                        "ART_ru_boxing_a_7": "如果供投注的拳手名單裡有拳手退賽或被替補，所有注單將被取消。",
                        "ART_ru_boxing_a_8": "如果官方宣布一方或雙方拳手都沒有達到比賽指定的體重要求，所有注單將被取消。",
                    
                        "ART_ru_h1_fighting": "搏鬥（綜合格鬥）",
                        "ART_ru_fighting_date": "04/09/2019",
                    
                        "ART_ru_fighting_a_1": "當裁判宣佈第一回合的開始後，投注的注單將視為有效。",
                        "ART_ru_fighting_a_2": "終極格鬥賽每一個回合的時長為5分鐘，大/小盤裡的‘半回合’將以150秒為準。",
                        "ART_ru_fighting_a_3": "每個冠軍頭銜爭奪戰有5個回合，非冠軍頭銜爭奪戰有3個回合。每回合當中的休息時間為1分鐘。",
                        "ART_ru_fighting_a_4": "比賽後公佈的結果將視為最終賽果並且可以以得分，降服，技術性擊倒，擊倒或剝奪資格來定義。如果賽果在比賽結束並且拳擊手離開擂台後有任何修正或修改將被視為無效。",
                        "ART_ru_fighting_a_4_1": "降服：其中一位拳手清楚地拍打地面或他的對手，或口頭方式告知裁判認輸。",
                        "ART_ru_fighting_a_4_2": "技術性擊倒：如果一位拳手無法繼續比賽，比賽將以技術性擊倒定義比賽結束。",
                        "ART_ru_fighting_a_4_3": "平局包括技術性打和。",
                        "ART_ru_fighting_a_4_4": "如果裁判認為選手存在惡意犯規或同時有多種犯規行為的話,可以取消其比賽資格。",
                        "ART_ru_fighting_a_5": "如果在比賽結束後裁判重新計算比分或官方更改賽果，將對注單的結算沒有影響。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_boxing": "BOXING",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_boxing_date": "04/09/2019",
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_boxing_a_1": "Upon the bell sound signaling the start of the first round, all bets will stand.",
                        "ART_ru_boxing_a_2": "The duration of each round is 3 minutes; 90 seconds will be used to determine the \"half\" round stated in over/under markets.",
                        "ART_ru_boxing_a_3": "Should there be any changes in the stipulated number of rounds, all over/under bets will be considered void and refunded. ",
                        "ART_ru_boxing_a_4": "For Head to Head (H2H) bet types, if the match ends in a draw, bets on both boxers will be considered void.",
                        "ART_ru_boxing_a_5": "Bets will be settled based on the results declared in the ring which can be determined by scorecard points, TKO, KO or disqualifications.",
                        "ART_ru_boxing_a_5_1": "KO (Knockout) includes TKO (Technical Knock Out) and disqualifications of a boxer.",
                        "ART_ru_boxing_a_5_2": "Draw includes technical draw.",
                        "ART_ru_boxing_a_5_3": "Decision includes technical decisions.",
                        "ART_ru_boxing_a_6": "Revision or amendments made to the results after the boxers leave the ring will not be considered.",
                        "ART_ru_boxing_a_7": "Should there be a withdrawal or a substitution of the listed boxers, all bets will be considered void.",
                        "ART_ru_boxing_a_8": "If it is announced that either or both of the boxers fail to meet the specified weight for the advertised contest, all bets on that match will be considered void.",
                    
                        "ART_ru_h1_fighting": "FIGHTING (MIXED MARTIAL ARTS)",
                        "ART_ru_fighting_date": "04/09/2019",
                    
                        "ART_ru_fighting_a_1": "All bets will be considered valid once an announcement indicating the start of round one has been made by the referee.",
                        "ART_ru_fighting_a_2": "For UFC, every round lasts 5 minutes; 150 seconds will be used to determine the \"half\" round stated in over/under markets.",
                        "ART_ru_fighting_a_3": "Each title match has five rounds, and non-title matches have three. There is a one minute rest period between rounds.",
                        "ART_ru_fighting_a_4": "The results obtained at the end of the match are considered final, which will include points, submission, TKO, KO or disqualification. Revision or amendments made to the results after the fighters have left the ring will not be considered valid.",
                        "ART_ru_fighting_a_4_1": "Submission: a fighter clearly taps on the mat or his opponent or verbally submits.",
                        "ART_ru_fighting_a_4_2": "Technical Knockout (TKO): If a fighter cannot continue, the fight is ended as a technical knockout.",
                        "ART_ru_fighting_a_4_3": "Draw includes Technical Draw.",
                        "ART_ru_fighting_a_4_4": "Disqualification may occur after any combination of fouls or after a flagrant foul at the discretion of the referee",
                        "ART_ru_fighting_a_5": "In events where there are any recounts of the judges\' scorecards or changes made by governing authorities after the match, such changes will be considered invalid for settlement purposes.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_boxing": "拳击",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_boxing_date": "04/09/2019",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_boxing_a_1": "第一回合的铃声响起后，投注的注单将视为有效。",
                        "ART_ru_boxing_a_2": "每个回合的时长为3分钟；大/小盘里的\'半回合\'将以90秒为准。",
                        "ART_ru_boxing_a_3": "如果规定的回合数有所更改，所有投注大/小盘注单将被取消。",
                        "ART_ru_boxing_a_4": "如果赛事出现平局， 投注二选一（H2H）玩法的注单将被取消。",
                        "ART_ru_boxing_a_5": "注单的结算将根据比赛公布的结果为准，比赛结果可以以点数，技术性击倒，击倒或剥夺资格来定义。",
                        "ART_ru_boxing_a_5_1": "KO（击倒）包括TKO（技术性击倒）和剥夺拳击手资格。",
                        "ART_ru_boxing_a_5_2": "平局包括技术性打和。",
                        "ART_ru_boxing_a_5_3": "判决包括技术性判决。",
                        "ART_ru_boxing_a_6": "如果赛果在比赛结束并且拳击手离开擂台后有任何修正或修改将被视为无效。",
                        "ART_ru_boxing_a_7": "如果供投注的拳手名单里有拳手退赛或被替补，所有注单将被取消。",
                        "ART_ru_boxing_a_8": "如果官方宣布一方或双方拳手都没有达到比赛指定的体重要求，所有注单将被取消。",
                    
                        "ART_ru_h1_fighting": "搏斗（综合格斗）",
                        "ART_ru_fighting_date": "04/09/2019",
                    
                        "ART_ru_fighting_a_1": "当裁判宣布第一回合的开始后，投注的注单将视为有效。",
                        "ART_ru_fighting_a_2": "终极格斗赛每一个回合的时长为5分钟，大/小盘里的‘半回合’将以150秒为准。",
                        "ART_ru_fighting_a_3": "每个冠军头衔争夺战有5个回合，非冠军头衔争夺战有3个回合。每回合当中的休息时间为1分钟。",
                        "ART_ru_fighting_a_4": "比赛后公布的结果将视为最终赛果并且可以以得分，降服，技术性击倒，击倒或剥夺资格来定义。如果赛果在比赛结束并且拳击手离开擂台后有任何修正或修改将被视为无效。",
                        "ART_ru_fighting_a_4_1": "降服：其中一位拳手清楚地拍打地面或他的对手，或口头方式告知裁判认输。",
                        "ART_ru_fighting_a_4_2": "技术性击倒：如果一位拳手无法继续比赛，比赛将以技术性击倒定义比赛结束。",
                        "ART_ru_fighting_a_4_3": "平局包括技术性打和。",
                        "ART_ru_fighting_a_4_4": "如果裁判认为选手存在恶意犯规或同时有多种犯规行为的话,可以取消其比赛资格。",
                        "ART_ru_fighting_a_5": "如果在比赛结束后裁判重新计算比分或官方更改赛果，将对注单的结算没有影响。",
                        ';
                        break;
                }
                break;
            case "cricket":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_cricket": "板球",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_boxing_date": "10/02/2020",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_cricket_b_1": "若比賽場地發生變化，只要主/客隊關係不變，所有已下投注依然成立。只要新的地點是在同一個國家，國際場館是可以改變。",
                        "ART_ru_cricket_b_2": "所有擊球手投注都會在該名擊球手得分跑後結算。當擊球手在擊球時，額外的記錄將不會歸入當局的跑壘次數。",
                    
                        "ART_ru_cricket_c": "對抗賽 & 郡級錦標賽",
                        "ART_ru_cricket_c_1": "如果比賽有至少一球擊殺，注單將被視為有效並且根據官方賽果結算。如果出現平局（Tie），並列第一規則將適用，並且和局（Draw）的注單將結算為輸。",
                        "ART_ru_cricket_c_1-1": "平局（Tie）vs.和局（Draw）",
                        "ART_ru_cricket_c_1_1": "當比賽結束時兩隊得分相同，賽果為平局（tie），但前提是最後的擊球方必須完成其指定局數（例如：完成所有賽局；或是在回合有限的情況下，完成指定回合數；或者由於天氣或光線不足而導致比賽終止）。",
                        "ART_ru_cricket_c_1_2": "和局（Draw）是指：當球隊未能在比賽結束時完成比賽所產生的不確認結果，僅適用於甲級板球比賽。",
                        "ART_ru_cricket_c_2": "如果比賽因下雨（或其他原因）而延遲，所有投注將根據官方結果進行結算。",
                        "ART_ru_cricket_c_3": "對抗賽中，”擊球手跑位得分”，”跑位得分”&”球員配對投注”均可成立，無論比賽時長、局數。",
                        "ART_ru_cricket_c_4": "如果賽事受到外來因素干擾而中斷，所有注單將被取消。",
                    
                        "ART_ru_cricket_d": "單日賽",
                        "ART_ru_cricket_d_1": "在單日賽中，如果比賽時間縮短或因天氣或因外來因素干擾而中斷，所有注單將按照官方板球比賽規則結算。包括賽事受達-路方法（D/L method）或Jayadevan系統（VJD）的影響。如果比賽的最終結果是以投殺出局或擲幣的方式裁決，則所有注單將被取消。",
                        "ART_ru_cricket_d_2": "如果比賽以平局（tie）結束並且官方結果或比賽規則未確定獲勝者，若本公司沒有提供平局（tie）的賠率，所有注單在獨贏盤將被取消。如果賽事由投殺出局或超級輪來決定獲勝者時，所有注單將被取消。",
                        "ART_ru_cricket_d_3": "如是採用達-路方法(Duckworth Lewis Method - DL)計算，所有投注在\"最多輪數\"，\"最高配對選手開場得分\"，“擊球手賽事”及“投球手賽事”的注單將被取消，除非在採用D/L計算方式前已有明確結果並且之後沒有任何顯著會影響賽事結果的情況。“擊球手”及“投球手”賽事在採用達-路方法(Duckworth Lewis Method - DL)之後所開的盤將由新的輪數來結算。",
                        "ART_ru_cricket_d_4": "如果在單日國際板球賽的當天需重新投硬幣決定發球權，所有在原訂開賽時間前45分鐘的注單將被取消。此規則將運用於所有盤口，除非盤口結算方式已有明確結果並且之後沒有任何顯著會影響賽事結果的情況，例如‘贏發球權’盤口。",
                    
                        "ART_ru_bettype": "投注類型",
                    
                        "ART_ru_cricket_e": "獨贏盤",
                        "ART_ru_cricket_e_1": "預測哪一支球隊將在比賽中勝出。此盤口會有兩個選項（隊伍）",
                        "ART_ru_cricket_e_2": "如果比賽以平局（tie）結束並且沒有宣佈正式獲勝者，並列第一規則適用。",
                        "ART_ru_cricket_e_3": "在甲級板球比賽中,如果比賽結果為和局（Draw），則所有注單將被視為無效。",
                        "ART_ru_cricket_e_4": "如果比賽沒有官方結果，則所有注單將被視為無效。",
                    
                        "ART_ru_cricket_f": "1 x 2",
                        "ART_ru_cricket_f_1": "預測哪一支球隊將會在比賽中勝出或者賽事是否會以和局結束。",
                        "ART_ru_cricket_f_2": "在單日賽中，平局（tie）將以和局（x）結算",
                        "ART_ru_cricket_f_3": "如果比賽沒有官方結果，則所有注單將被視為無效。",
                    
                        /*
                        "ART_ru_cricket_g": "獲勝者（並列第一規則）",
                        "ART_ru_cricket_g_1": "預測哪一支球隊將在比賽中勝出。",
                        "ART_ru_cricket_g_2": "如果賽果是平手，則所有投注會根據並列第一規則結算。",
                        */
                    
                        "ART_ru_cricket_h": "和局",
                        "ART_ru_cricket_h_1": "預測賽事是否會以和局結束。",
                        "ART_ru_cricket_h_2": "如果賽果是和局，則所有投注在“是”的注單將會贏利。",
                    
                        "ART_ru_cricket_i": "贏得發球權",
                        "ART_ru_cricket_i_1": "預測哪一支球隊將贏得發球權，優先開始比賽。",
                        "ART_ru_cricket_i_2": "如果結果沒有宣判，所有注單將會取消。",
                    
                        "ART_ru_cricket_j": "最佳擊球手",
                        "ART_ru_cricket_j_1": "以跑壘次數為基準，預測哪一位球員將會成為特定賽事中的最佳擊球手。",
                        "ART_ru_cricket_j_2": "投注的球員如果不在11名首發陣容中或提名為第12位後備球員，所有注單將被取消。",
                        "ART_ru_cricket_j_3": "在兩局賽制對賽里(甲級板球比賽)，除非另有注明，此盤口只以第一局的對賽結果為準。",
                        "ART_ru_cricket_j_4": "如果投注的球員沒有參與比賽，注單將結算為輸。",
                        "ART_ru_cricket_j_5": "如果比賽沒有宣判優勝者，注單將按並列第一規則結算。",
                    
                        "ART_ru_cricket_k": "最佳投球手",
                        "ART_ru_cricket_k_1": "以取得的三柱門次數為基準，預測哪一位球員將可以成為特定賽事中的最佳投球手。",
                        "ART_ru_cricket_k_2": "投注的球員如果不在11名首發陣容中或提名為第12位後備球員，所有注單將被取消。",
                        "ART_ru_cricket_k_3": "在兩局賽制對賽里(甲級板球比賽)，除非另有注明，此盤口只以第一局的對賽結果為準。",
                        "ART_ru_cricket_k_4": "如果投注的球員沒有參與比賽，注單將結算為輸。",
                        "ART_ru_cricket_k_5": "如果兩名球員取得三柱門的次數相同，跑壘次數較少的投手將視為獲勝者，不論球員個投出的輪數。如果比賽沒有宣判優勝者，注單將按並列第一規則結算。",
                    
                        "ART_ru_cricket_l": "最多四分的球隊",
                        "ART_ru_cricket_l_1": "預測哪一支球隊將會在比賽中獲得最多四分次數。",
                        "ART_ru_cricket_l_2": "平手將會是一個投注選項。",
                        "ART_ru_cricket_l_3": "如果必須完成的回合有減少，所有投注將會被取消。",
                    
                        "ART_ru_cricket_m": "最多六分的球隊",
                        "ART_ru_cricket_m_1": "預測哪一支球隊將會在比賽中獲得最多六分次數。",
                        "ART_ru_cricket_m_2": "平手將會是一個投注選項。",
                        "ART_ru_cricket_m_3": "如果預定的回合有減少，投注將會被取消。",
                    
                        "ART_ru_cricket_n": "最多得分的球隊",
                        "ART_ru_cricket_n_1": "預測哪一支球隊將會在比賽中獲得最多得分次數（四分和六分的組合）。",
                        "ART_ru_cricket_n_2": "平手將會是一個投注選項。",
                        "ART_ru_cricket_n_3": "如果必須完成的回合有減少，投注將會被取消。",
                    
                        "ART_ru_cricket_o": "配對選手開場得分最高的球隊",
                        "ART_ru_cricket_o_1": "預測哪一支球隊的配對選手開場得分最高。",
                        "ART_ru_cricket_o_2": "僅計算每支球隊的第一局。",
                        "ART_ru_cricket_o_3": "平手將會是一個投注選項。",
                    
                        "ART_ru_cricket_p": "首個三柱門被擊倒前跑位得分/第X個三柱門被擊倒前跑位得分",
                        "ART_ru_cricket_p_1": "預測擊球方的第一個（或下一個）擊球手在出局前的跑位得分。",
                        "ART_ru_cricket_p_2": "如果沒有出局，投注將會取消，除非已經無條件地確認。",
                        "ART_ru_cricket_p_3": "擊球隊的總積分將包括目標總數或總申報數。",
                    
                        "ART_ru_cricket_q": "首個“三柱門”方式",
                        "ART_ru_cricket_q_1": "預測第一個擊球手的出局方式。",
                        "ART_ru_cricket_q_2": "相應選項為接球出局和其他。",
                        "ART_ru_cricket_q_3": "如果投球方沒有擊中三柱門，則所有投注將會被取消。",
                    
                        "ART_ru_cricket_r": "下一位出局的球手",
                        "ART_ru_cricket_r_1": "預測兩個擊球員誰將會下一個出局。",
                        "ART_ru_cricket_r_2": "如果其中一名球員迫使退賽，所有注單將被取消。",
                    
                        "ART_ru_cricket_s": "第一個投球跑位得分",
                        "ART_ru_cricket_s_1": "預測賽事中第一個球擊出的跑位得分。",
                        "ART_ru_cricket_s_2": "如果賽事中沒有球被擊出，則所有投注均會被取消。",
                    
                        "ART_ru_cricket_t": "球隊得4分的總數",
                        "ART_ru_cricket_t_1": "預測球隊得4分的總數將會大於或小於指定的數值。",
                        "ART_ru_cricket_t_2": "如果必須完成的回合有減少，投注將會被取消。",
                    
                        "ART_ru_cricket_u": "球隊得6分的總數",
                        "ART_ru_cricket_u_1": "預測球隊得6分的總數將會大於或小於指定的數值。",
                        "ART_ru_cricket_u_2": "如果必須完成的回合有減少，投注將會被取消。",
                    
                        "ART_ru_cricket_v": "球隊得分的總數",
                        "ART_ru_cricket_v_1": "預測球隊得分的總數（4分和6分的組合）將會大於或小於指定的數值。",
                        "ART_ru_cricket_v_2": "如果必須完成的回合有減少，投注將會被取消。",
                    
                        "ART_ru_cricket_w": "球隊總跑位得分兩項投注（三項）",
                        "ART_ru_cricket_w_1": "預測當前擊球方的總跑位得分將會大於或小於指定的數值。",
                        "ART_ru_cricket_w_2": "如果必須完成的回合有減少，投注將會被取消。",
                    
                        "ART_ru_cricket_x": "X回合獲得最多跑位得分的球隊",
                        "ART_ru_cricket_x_1": "預測哪一支球隊將會在他們各自賽局的指定X回合獲得最多跑位得分。",
                        "ART_ru_cricket_x_2": "如果兩支球隊都未能完成指定的X回合，則所有投注均會取消，除非結果已經無條件確認。",
                        "ART_ru_cricket_x_3": "平手將會是一個投注選項。",
                    
                        "ART_ru_cricket_y": "首回合跑位得分（兩項投注）",
                        "ART_ru_cricket_y_1": "預測球隊在首回合的跑位得分將會大於或是小於指定數值。",
                        "ART_ru_cricket_y_2": "如果該球隊未能完成首回合，則所有投注將會取消，除非結果已經無條件確認。",
                    
                        "ART_ru_cricket_z": "首回合最高跑位得分",
                        "ART_ru_cricket_z_1": "預測哪一支球隊在他們各自的第一個賽局的首回合獲得最高跑位得分。",
                        "ART_ru_cricket_z_2": "如果兩支球隊均未能完成首回合，則所有投注將會被取消，除非結果已經無條件確認。",
                        "ART_ru_cricket_z_3": "平手將會是一個投注選項。",
                    
                        "ART_ru_cricket_aa": "球隊全部出局",
                        "ART_ru_cricket_aa_1": "預測擊球方是否會在第一個賽局宣告結束時失去所有10個三柱門。",
                        "ART_ru_cricket_aa_2": "如果賽事在第一個賽局結束前便已經取消，則所有投注將會被取消。",
                    
                        "ART_ru_cricket_ab": "擊球手投注",
                        "ART_ru_cricket_ab_1": "預測哪一個指定的擊球手可以獲得該局的最高跑位得分。",
                        "ART_ru_cricket_ab_2": "如果其中一個擊球手退賽，所有投注將會被取消。如果沒有球員出局，所有注單將被取消。",
                        "ART_ru_cricket_ab_3": "如果出現平手，並列第一規則適用。",
                    
                        "ART_ru_cricket_ac": "投球手投注",
                        "ART_ru_cricket_ac_1": "預測哪一個指定的投球手可以取得該局的最多三柱門。",
                        "ART_ru_cricket_ac_2": "每個球員都必須要至少投一次球，否則所有投注將會被取消。",
                        "ART_ru_cricket_ac_3": "如果出現平手，並列第一規則適用。",
                    
                        "ART_ru_cricket_ad": "X回合跑位得分（兩項投注）",
                        "ART_ru_cricket_ad_1": "預測特定期間（例如5個回合）的跑位總得分將會大於或是小於指定數值。",
                        "ART_ru_cricket_ad_2": "如果特定的期間沒有完全完成，則所有投注將會被取消，除非已經無條件地確認。",
                    
                        "ART_ru_cricket_ae": "X回合跑位得分（三項投注）",
                        "ART_ru_cricket_ae_1": "預測是否在規定時間達到得分總數,例如5,將預測小於或大於在指定的範圍值。",
                        "ART_ru_cricket_ae_2": "如果特定的期間沒有完全完成，則所有投注將會被取消，除非已經無條件地確認。",
                    
                        "ART_ru_cricket_af": "跑位得分總數兩項投注（球員）",
                        "ART_ru_cricket_af_1": "預測球員的跑位得分總數將會大於或小於指定數值。",
                        "ART_ru_cricket_af_2": "如果必須完成的回合有減少，所有投注將會被取消。",
                        "ART_ru_cricket_af_3": "如果一個擊球員因傷退賽並且沒有返回，所有投注將會被取消，除非已經無條件地確認。",
                        "ART_ru_cricket_af_4": "如果是在甲級板球賽事中提供，則僅計算指定賽局。",
                    
                        "ART_ru_cricket_ag": "跑位得分總數三項投注（球員）",
                        "ART_ru_cricket_ag_1": "預測球員的跑位得分總數將會大於、等於或小於指定數值範圍。",
                        "ART_ru_cricket_ag_2": "如果必須完成的回合有減少，所有投注將會被取消。",
                        "ART_ru_cricket_ag_3": "如果一個擊球員因傷退賽並且沒有返回，所有投注將會被取消，除非已經無條件地確認。",
                        "ART_ru_cricket_ag_4": "如果是在甲級板球賽事中提供，則僅計算指定賽局。",
                    
                        "ART_ru_cricket_ah": "跑位得分50/100/150/200（球员）",
                        "ART_ru_cricket_ah_1": "預測指定球員在某一局跑位得分是否可以達到50/100/150/200或是更多。",
                        "ART_ru_cricket_ah_2": "單日賽結算——除非無條件確定，否則投注將會由於下雨或任何延誤而無效。",
                        "ART_ru_cricket_ah_3": "甲級比賽結算——不管是否受到下雨或者其他因素影響，賭注將根據官方公佈的最終比分來確定。",
                        "ART_ru_cricket_ah_4": "如果是在甲級板球賽事中提供，則僅計算指定賽局。",
                    
                        "ART_ru_cricket_ai": "出局方式（下個三柱門）",
                        "ART_ru_cricket_ai_1": "預測下一個擊球員的出局方式。",
                        "ART_ru_cricket_ai_2": "可用的類型和數量選擇取決於板球比賽的形式（有限的回合或是甲級）以及在比賽期間的形式。",
                        "ART_ru_cricket_ai_3": "如果沒有更多的擊球員出局，所有投注將會被取消。",
                    
                        "ART_ru_cricket_aj": "球隊跑位總得分–單/雙",
                        "ART_ru_cricket_aj_1": "預測擊球隊的跑位總得分是單數還是雙數。",
                        "ART_ru_cricket_aj_2": "至少要有一球在局間被擊殺，否則投注將會被取消。",
                        "ART_ru_cricket_aj_3": "結算將依據官方管理機構公佈的該局比分進行。",
                    
                        "ART_ru_cricket_ak": "首回合跑位得分–單/雙",
                        "ART_ru_cricket_ak_1": "預測擊球隊在該局的首回合跑位得分是單數還是雙數。",
                        "ART_ru_cricket_ak_2": "至少要有一球在首回合被擊殺，否則投注將會被取消。",
                    
                        "ART_ru_cricket_al": "最多歪球次數",
                        "ART_ru_cricket_al_1": "預測哪一支球隊將會在比賽中獲得最多歪球。",
                        "ART_ru_cricket_al_2": "平手將會是一個投注選項。",
                        "ART_ru_cricket_al_3": "如果必須完成的回合有減少，所有投注將會被取消。",
                    
                        "ART_ru_cricket_am": "歪球的總數",
                        "ART_ru_cricket_am_1": "預測賽事中的歪球總數將會大於或是小於指定數值。",
                        "ART_ru_cricket_am_2": "如果必須完成的回合有減少，所有投注將會被取消。",
                    
                        "ART_ru_cricket_an": "被殺出局總數",
                        "ART_ru_cricket_an_1": "預測賽事的被殺出局總數將會大於或是小於指定數值。",
                        "ART_ru_cricket_an_2": "如果必須完成的回合有減少，所有投注將會被取消。",
                    
                        "ART_ru_cricket_ao": "最多擊殺次數",
                        "ART_ru_cricket_ao_1": "預測哪一支球隊將會在比賽中獲得最多擊殺次數。",
                        "ART_ru_cricket_ao_2": "平手將會是一個投注選項。",
                        "ART_ru_cricket_ao_3": "如果必須完成的回合有減少，所有投注將會被取消。",
                    
                        "ART_ru_cricket_ap": "擊殺總數",
                        "ART_ru_cricket_ap_1": "預測賽事中的擊殺總數將會大於或是小於指定數值。",
                        "ART_ru_cricket_ap_2": "如果必須完成的回合有減少，所有投注將會被取消。",
                    
                        "ART_ru_cricket_aq": "最多零分",
                        "ART_ru_cricket_aq_1": "預測哪一支球隊將會在比賽中獲得最多零分。",
                        "ART_ru_cricket_aq_2": "平手將會是一個投注選項。",
                        "ART_ru_cricket_aq_3": "如果必須完成的回合有減少，所有投注將會被取消。",
                    
                        "ART_ru_cricket_ar": "零分總數",
                        "ART_ru_cricket_ar_1": "預測賽事中零分的總次數將會大於或是小於指定數值。",
                        "ART_ru_cricket_ar_2": "如果必須完成的回合有減少，所有投注將會被取消。",
                    
                        "ART_ru_cricket_as": "第1局領先",
                        "ART_ru_cricket_as_1": "預測哪支球隊會在第一局領先。",
                        "ART_ru_cricket_as_2": "雙方球員都必須要完成第1局（包括被宣佈完成的），投注方為有效。",
                    
                        "ART_ru_cricket_at": "跑位得分兩項投注（三項投注）",
                        "ART_ru_cricket_at_1": "預測參賽的球員跑位得分總數將會大於或小於指定數值。",
                        "ART_ru_cricket_at_2": "如果比賽因為下雨或其他原因延誤，則使用以下條款：",
                        "ART_ru_cricket_at_2_1": "指定回合",
                        "ART_ru_cricket_at_2_2": "所有賭注將視為無效，除非已經確定結果的比賽。",
                        "ART_ru_cricket_at_2_3": "甲級賽事",
                        "ART_ru_cricket_at_2_4": "無論比賽因為下雨或其他原因延誤，所有賭注都將成立。",
                    
                        "ART_ru_cricket_au": "跑壘數",
                        "ART_ru_cricket_au_1": "預測當前跑壘得分的總數是否超過指定值。",
                        "ART_ru_cricket_au_2": "跑壘數必須超過20，投注方為有效。",

                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_cricket": "CRICKET",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_boxing_date": "10/02/2020",
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_cricket_b_1": "If the scheduled venue is changed, all bets will stand so long as the venue is not changed to an opponent’s ground. International venues may be changed, so long as the new venue is within the same country.",
                        "ART_ru_cricket_b_2": "All batsman markets will be settled on runs scored by the named batsman. Extra’s recorded while a batsmen is on strike will not be attributed their total number of runs in that Innings.",
                    
                        "ART_ru_cricket_c": "TEST MATCHES & COUNTY CHAMPIONSHIP MATCHES",
                        "ART_ru_cricket_c_1": "Bets will stand based on the official result provided at least one ball has been bowled. In the event of a tie, dead heat rules will apply and bets on the draw will be settled as losing bets.",
                        "ART_ru_cricket_c_1-1": "Tie vs. Draw",
                        "ART_ru_cricket_c_1_1": "The result of a match is ‘Tie’ when the scores are equal at the conclusion of play after both teams completed their innings, or, in Limited Overs Cricket, the set number of overs has been played, or play is terminally stopped by weather or bad light.",
                        "ART_ru_cricket_c_1_2": "‘Draw’ is the inconclusive result that occurs when a team does not complete its innings at the scheduled end of play. It only applies to First Class Cricket.",
                        "ART_ru_cricket_c_2": "If a match is delayed due to rain (or any other reason) all bets will be settled based on the official result.",
                        "ART_ru_cricket_c_3": "In Test matches, “Batsman Runs”, “Innings Runs” & “Player Match Bets” stand regardless of the length of the innings.",
                        "ART_ru_cricket_c_4": "If a match is abandoned due to external interference, bets will be considered void.",
                    
                        "ART_ru_cricket_d": "LIMITED OVERS MATCHES",
                        "ART_ru_cricket_d_1": "In one-day matches, if the match is cut short or abandoned due to weather or external interference, all bets will be settled according to the official competition rules. This includes matches affected by the Duckworth-Lewis Method (D/L Method) or the Jayadevan system (JVD). If the final result is determined by a bowl out or coin toss, all bets will be considered void.",
                        "ART_ru_cricket_d_2": "If the match ends in a tie and the official result or the competition rules do not determine a winner, then all bets on Winner will be void. In competitions where a bowl out or a super over determines a winner, all bets will be considered void.",
                        "ART_ru_cricket_d_3": "Where the Duckworth Lewis Method (D/L method) is used, all bets placed on \"Highest 10 over Total\", \"Highest Opening Partnership\", “Batsmen Match Bet” and “Bowler Match Bet” will be considered void, unless the market has been unconditionally determined before the D/L method was implemented. Batsmen/Bowler Match Bets offered after D/L method will be settled based on the new overs.",
                        "ART_ru_cricket_d_4": "Should a new toss take place on a scheduled reserve day for One Day International, all bets during the last 45 minutes to the start at the original scheduled first day match will be considered void. This rule applies to all markets, except those have been unconditionally determined, such as \"Win The Toss\"",
                    
                        "ART_ru_bettype": "BET TYPES",
                    
                        "ART_ru_cricket_e": "Winner",
                        "ART_ru_cricket_e_1": "Predict which team will win the match. This market will contain 2 teams.",
                        "ART_ru_cricket_e_2": "If the result is a tie and no official winner is declared, dead-heat rules will apply.",
                        "ART_ru_cricket_e_3": "In First Class Cricket, if the result of the match is a draw, all bets will be void.",
                        "ART_ru_cricket_e_4": "If there is no official result, all bets will be void.",
                    
                        "ART_ru_cricket_f": "1 x 2",
                        "ART_ru_cricket_f_1": "Predict which team will be the match winner or whether the match will end as a draw.",
                        "ART_ru_cricket_f_2": "In Limited Over, the draw (x) will be settled as tie.",
                        "ART_ru_cricket_f_3": "If there is no official result, all bets will be void.",
                    
                        /*
                        "ART_ru_cricket_g": "获胜者（并列第一规则）",
                        "ART_ru_cricket_g_1": "预测哪一支球队将在比赛中胜出。",
                        "ART_ru_cricket_g_2": "如果赛果是平手，则所有投注会根据并列第一规则结算。",
                        */
                    
                        "ART_ru_cricket_h": "Draw Result",
                        "ART_ru_cricket_h_1": "Predict whether the match will end as a draw.",
                        "ART_ru_cricket_h_2": "If the result of the match is a draw, then all ‘yes’ selections will be settled as winning bets.",
                    
                        "ART_ru_cricket_i": "To Win the Toss",
                        "ART_ru_cricket_i_1": "Predict which team will win the coin toss prior to the start of the match.",
                        "ART_ru_cricket_i_2": "If a result was not determined all bets will be void.",
                    
                        "ART_ru_cricket_j": "Top Team Batsman",
                        "ART_ru_cricket_j_1": "Predict who will be the top Batsman in a specific match based on the number of runs scored.",
                        "ART_ru_cricket_j_2": "Bets placed on any player not in the starting 11 or nominated as the designated substitute 12th man will then be considered void.",
                        "ART_ru_cricket_j_3": "In a 2-innings match (First Class Cricket), this market applies to the first innings only, unless otherwise stated.",
                        "ART_ru_cricket_j_4": "Bets placed on players who are selected but do not bat or do not field will be settled as losing bets.",
                        "ART_ru_cricket_j_5": "Dead-Heat rule applies if no winner has been determined.",
                    
                        "ART_ru_cricket_k": "Top Team Bowler",
                        "ART_ru_cricket_k_1": "Predict who will be the top Bowler in a specific match based on the number of wickets taken.",
                        "ART_ru_cricket_k_2": "Bets placed on any player not in the starting 11 or nominated as the designated substitute 12th man will then be considered void.",
                        "ART_ru_cricket_k_3": "In a 2-innings match (First Class Cricket), this market applies to the first innings only, unless otherwise stated.",
                        "ART_ru_cricket_k_4": "Bets placed on players who are selected but do not bat or do not field will be settled as losing bets.",
                        "ART_ru_cricket_k_5": "In the event of players taking the same number of wickets, the winner will be determined as the bowler that has conceded the least number of runs, irrespective of overs bowled by each player.",
                        //"ART_ru_cricket_k_6": "Dead-Heat rule applies if no winner has been determined.",
                    
                        "ART_ru_cricket_l": "Most Match Fours",
                        "ART_ru_cricket_l_1": "Predict which team will record the most fours in the match.",
                        "ART_ru_cricket_l_2": "The draw will also be a selection option.",
                        "ART_ru_cricket_l_3": "If there is any reduction in the scheduled number of overs played, then bets on this market will be void.",
                    
                        "ART_ru_cricket_m": "Most Match Sixes",
                        "ART_ru_cricket_m_1": "Predict which team will record the most sixes in the match.",
                        "ART_ru_cricket_m_2": "The draw will also be a selection option.",
                        "ART_ru_cricket_m_3": "If there is any reduction in the scheduled number of overs played, then bets on this market will be void.",
                    
                        "ART_ru_cricket_n": "Most Match Boundaries",
                        "ART_ru_cricket_n_1": "Predict which team will record the most match boundaries (fours and sixes combined) in the match.",
                        "ART_ru_cricket_n_2": "The draw will also be a selection option.",
                        "ART_ru_cricket_n_3": "If there is any reduction in the scheduled number of overs played, then bets on this market will be void.",
                    
                        "ART_ru_cricket_o": "Highest Opening Partnership",
                        "ART_ru_cricket_o_1": "Predict which team will record the highest opening partnership in the match.",
                        "ART_ru_cricket_o_2": "Only the 1st batting Innings for each team will count towards this market.",
                        "ART_ru_cricket_o_3": "The draw will also be a selection.",
                    
                        "ART_ru_cricket_p": "Runs before Fall of 1st Wicket / Runs before Fall of X (next) Wicket",
                        "ART_ru_cricket_p_1": "Predict the number of runs recorded before the batting team’s first (or next) player is dismissed.",
                        "ART_ru_cricket_p_2": "If no dismissal is recorded the bet will be void unless already unconditionally determined.",
                        "ART_ru_cricket_p_3": "Run totals for the batting team will include Target total or Declaration total.",
                    
                        "ART_ru_cricket_q": "1st Wicket Method",
                        "ART_ru_cricket_q_1": "Predict the method by which the first batsman will be dismissed.",
                        "ART_ru_cricket_q_2": "The selections for this market will be caught and other.",
                        "ART_ru_cricket_q_3": "If no wickets are recorded by the bowling team, then any bet on this market will be considered void.",
                    
                        "ART_ru_cricket_r": "Next Man Out",
                        "ART_ru_cricket_r_1": "Predict which of the two active batsmen will be dismissed next.",
                        "ART_ru_cricket_r_2": "If one batsman retires, all bets will be considered void.",
                    
                        "ART_ru_cricket_s": "Runs Scored from 1st Ball",
                        "ART_ru_cricket_s_1": "Predict the number of runs scored from 1st delivery bowled in the match.",
                        "ART_ru_cricket_s_2": "If no ball is bowled in the match, then all bets on this market will be considered void.",
                    
                        "ART_ru_cricket_t": "Total Team Fours",
                        "ART_ru_cricket_t_1": "Predict whether the total number of fours scored by the stated team will be over or under the value indicated.",
                        "ART_ru_cricket_t_2": "If there is any reduction in the scheduled number of overs played, then bets on this market will be void.",
                    
                        "ART_ru_cricket_u": "Total Team Sixes",
                        "ART_ru_cricket_u_1": "Predict whether the total number of sixes scored by the stated team will be over or under the value indicated.",
                        "ART_ru_cricket_u_2": "If there is any reduction in the scheduled number of overs played, then bets on this market will be void.",
                    
                        "ART_ru_cricket_v": "Total Match Boundaries",
                        "ART_ru_cricket_v_1": "Predict whether the total number of match boundaries (fours and sixes combined) scored by the stated team will be over or under the value indicated.",
                        "ART_ru_cricket_v_2": "If there is any reduction in the scheduled number of overs played, then bets on this market will be void.",
                    
                        "ART_ru_cricket_w": "Total Team Runs 2-Way (or 3-Way) ",
                        "ART_ru_cricket_w_1": "Predict whether the total number of runs scored by the current batting team will be over or under the value indicated.",
                        "ART_ru_cricket_w_2": "If there is any reduction in the scheduled number of overs played, then bets on this market will be void.",
                    
                        "ART_ru_cricket_x": "Team to Score Most Runs in X Over",
                        "ART_ru_cricket_x_1": "Predict which team will record the most number of runs from the stated over (X) of their respective Innings.",
                        "ART_ru_cricket_x_2": "If either team fails to complete the stated over (X), then all bets on this market will be considered void, unless the result has been unconditionally determined.",
                        "ART_ru_cricket_x_3": "The draw will also be a selection option.",
                    
                        "ART_ru_cricket_y": "1st Over Runs 2-Way",
                        "ART_ru_cricket_y_1": "Predict whether the total number of runs recorded by the stated team (within the 1st over) will be over or under the value indicated.",
                        "ART_ru_cricket_y_2": "If that team fails to complete the first over, then all bets on this market will be considered void, unless the result has been unconditionally determined.",
                    
                        "ART_ru_cricket_z": "Highest 1st Over",
                        "ART_ru_cricket_z_1": "Predict which team will record the most number of runs from the 1st over of their respective 1st Innings.",
                        "ART_ru_cricket_z_2": "If either team fails to complete a first over, then all bets on this market will be considered void, unless the result has been unconditionally determined.",
                        "ART_ru_cricket_z_3": "The draw will also be a selection option.",
                    
                        "ART_ru_cricket_aa": "Team All Out",
                        "ART_ru_cricket_aa_1": "Predict whether the active batting team will lose all 10 wickets before the 1st Innings is declared over.",
                        "ART_ru_cricket_aa_2": "If the match is abandoned before the end of the 1st Innings then all bets will be void.",
                    
                        "ART_ru_cricket_ab": "Batsmen Match Bet",
                        "ART_ru_cricket_ab_1": "Predict which of the batsmen stated will record the most runs in that innings.",
                        "ART_ru_cricket_ab_2": "If one batsman retires, all bets will be considered void. If neither batsman is dismissed then all bets will be considered void.",
                        "ART_ru_cricket_ab_3": "In the event of a tie, dead-heat rules will apply.",
                    
                        "ART_ru_cricket_ac": "Bowler Match Bet",
                        "ART_ru_cricket_ac_1": "Predict which of the bowlers stated will record the most wickets taken in that innings.",
                        "ART_ru_cricket_ac_2": "Each player must bowl at least one ball; otherwise any bets on this market will be void.",
                        "ART_ru_cricket_ac_3": "In the event of a tie, dead-heat rules will apply.",
                    
                        "ART_ru_cricket_ad": "X Over Runs 2-Way",
                        "ART_ru_cricket_ad_1": "Predict whether the total number of runs scored for the stated period, e.g. 5 overs, will be over or under the indicated value.",
                        "ART_ru_cricket_ad_2": "If the stated period is not fully completed, then all bets will be void, unless the market has been unconditionally determined.",
                    
                        "ART_ru_cricket_ae": "X Over Runs 3-Way",
                        "ART_ru_cricket_ae_1": "Predict whether the total number of runs scored for the stated period, e.g. 5 overs, will be under, between or over the indicated range of values.。",
                        "ART_ru_cricket_ae_2": "If the stated period is not fully completed, then all bets will be void, unless the market has been unconditionally determined.",
                    
                        "ART_ru_cricket_af": "Total Runs 2-Way (Player)",
                        "ART_ru_cricket_af_1": "Predict whether the stated player’s record runs will be over or under the indicated value.",
                        "ART_ru_cricket_af_2": "If there is any reduction in the scheduled number of overs played, then bets on this market will be void.",
                        "ART_ru_cricket_af_3": "If a batsman retires hurt and does not return, then all bets will be void unless the market has been unconditionally determined.",
                        "ART_ru_cricket_af_4": "If offered during a First Class Cricket match, then this proposition will only count for the Innings stated.",
                    
                        "ART_ru_cricket_ag": "Total Runs 3-Way (Player)",
                        "ART_ru_cricket_ag_1": "Predict whether the stated player’s recorded runs, will be under, between or under the indicated range of values.",
                        "ART_ru_cricket_ag_2": "If there is any reduction in the scheduled number of overs played, then bets on this market will be void.",
                        "ART_ru_cricket_ag_3": "If a batsman retires hurt and does not return, then all bets will be void unless the market has been unconditionally determined.",
                        "ART_ru_cricket_ag_4": "If offered during a First Class Cricket match, then this proposition will only count for the Innings stated.",
                    
                        "ART_ru_cricket_ah": "To Score 50 / 100 / 150 / 200 Runs (Player)",
                        "ART_ru_cricket_ah_1": "Predict whether a player will record an innings total of 50 / 100 / 150 / 200 or more runs.",
                        "ART_ru_cricket_ah_2": "Limited Over Settlement – Bets will be void for rain or any delay, unless unconditionally determined.",
                        "ART_ru_cricket_ah_3": "First Class Settlement – Bets will be settled based on the officially declared final score, irrespective of rain or any other delay.",
                        "ART_ru_cricket_ah_4": "If offered during a First Class Cricket match, then this proposition will only count for the Innings stated.",
                    
                        "ART_ru_cricket_ai": "Method of Dismissal (Next Wicket)",
                        "ART_ru_cricket_ai_1": "Predict the method by which the next batsman will be dismissed.",
                        "ART_ru_cricket_ai_2": "The types and numbers of selections available may depend on the form of Cricket match (Limited Overs or First Class) and the period of the match.",
                        "ART_ru_cricket_ai_3": "If no further batsman is dismissed then all bets on this market will be considered void.",
                    
                        "ART_ru_cricket_aj": "Total Team Runs – Odd / Even",
                        "ART_ru_cricket_aj_1": "Predict whether the total runs recorded by the active batting team will be odd or even.",
                        "ART_ru_cricket_aj_2": "One ball must be bowled in that Innings, otherwise bets on this market will be considered void.",
                        "ART_ru_cricket_aj_3": "Settlement will be based on the Innings score officially recorded by the governing body.",
                    
                        "ART_ru_cricket_ak": "1st Over Runs – Odd / Even",
                        "ART_ru_cricket_ak_1": "Predict whether the runs recorded by the active batting team in the 1st over of that Innings will be odd or even.",
                        "ART_ru_cricket_ak_2": "One ball must be bowled in the 1st over, otherwise bets on this market will be considered void.",
                    
                        "ART_ru_cricket_al": "Most Match Wides",
                        "ART_ru_cricket_al_1": "Predict which team will record the most wides in the match.",
                        "ART_ru_cricket_al_2": "The draw will also be a selection option.",
                        "ART_ru_cricket_al_3": "If there is any reduction in the scheduled number of overs played, then bets on this market will be void.",
                    
                        "ART_ru_cricket_am": "Total Match Wides",
                        "ART_ru_cricket_am_1": "Predict whether the recorded number of match wides will be over or under the indicated value.",
                        "ART_ru_cricket_am_2": "If there is any reduction in the scheduled number of overs played, then bets on this market will be void.",
                    
                        "ART_ru_cricket_an": "Total Match Run Outs",
                        "ART_ru_cricket_an_1": "Predict whether the recorded number of match run-outs will be over or under the indicated value.",
                        "ART_ru_cricket_an_2": "If there is any reduction in the scheduled number of overs played, then bets on this market will be void.",
                    
                        "ART_ru_cricket_ao": "Most Match Stumpings",
                        "ART_ru_cricket_ao_1": "Predict which team will record the most stumpings in the match.",
                        "ART_ru_cricket_ao_2": "The draw will also be a selection option.",
                        "ART_ru_cricket_ao_3": "If there is any reduction in the scheduled number of overs played, then bets on this market will be void.",
                    
                        "ART_ru_cricket_ap": "Total Match Stumpings",
                        "ART_ru_cricket_ap_1": "Predict whether the recorded number of match stumpings will be over or under the indicated value.",
                        "ART_ru_cricket_ap_2": "If there is any reduction in the scheduled number of overs played, then bets on this market will be void.",
                    
                        "ART_ru_cricket_aq": "Most Match Ducks",
                        "ART_ru_cricket_aq_1": "Predict which team will record the most ducks in the match.",
                        "ART_ru_cricket_aq_2": "The draw will also be a selection option.",
                        "ART_ru_cricket_aq_3": "If there is any reduction in the scheduled number of overs played, then bets on this market will be void.",
                    
                        "ART_ru_cricket_ar": "Total Match Ducks",
                        "ART_ru_cricket_ar_1": "Predict whether the recorded number of match ducks will be over or under the indicated value.",
                        "ART_ru_cricket_ar_2": "If there is any reduction in the scheduled number of overs played, then bets on this market will be void.",
                    
                        "ART_ru_cricket_as": "First Innings Lead",
                        "ART_ru_cricket_as_1": "Predict which team will lead after the First Innings has concluded.",
                        "ART_ru_cricket_as_2": "Both teams must complete their First Innings for bets to stand (including declarations).",
                    
                        "ART_ru_cricket_at": "lnnings Runs 2-Way (or 3-Way)",
                        "ART_ru_cricket_at_1": "Predict whether the selected participant’s recorded runs will be over or under the indicated value.",
                        "ART_ru_cricket_at_2": "If there is any reduction due to rain or any other delay, then the following conditions will apply.",
                        "ART_ru_cricket_at_2_1": "Limited Overs",
                        "ART_ru_cricket_at_2_2": "All bets will be void, unless already determined.",
                        "ART_ru_cricket_at_2_3": "First Class Matches",
                        "ART_ru_cricket_at_2_4": "All bets will stand, regardless of rain or any other delay.",
                    
                        "ART_ru_cricket_au": "Session Runs 2-Way",
                        "ART_ru_cricket_au_1": "Predict whether the total number of runs scored in the current session will be over or under the indicated value.",
                        "ART_ru_cricket_au_2": "A minimum of 20 overs must be completed for bets to stand.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_cricket": "板球",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_boxing_date": "10/02/2020",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_cricket_b_1": "若比赛场地发生变化，只要主/客队关系不变，所有已下投注依然成立。只要新的地点是在同一个国家，国际场馆是可以改变。",
                        "ART_ru_cricket_b_2": "所有击球手投注都会在该名击球手得分跑后结算。当击球手在击球时，额外的记录将不会归入当局的跑垒次数。",
                    
                        "ART_ru_cricket_c": "对抗赛 & 郡级锦标赛",
                        "ART_ru_cricket_c_1": "如果比赛有至少一球击杀，注单将被视为有效并且根据官方赛果结算。如果出现平局（Tie），并列第一规则将适用，并且和局（Draw）的注单将结算为输。",
                        "ART_ru_cricket_c_1-1": "平局（Tie）vs.和局（Draw）",
                        "ART_ru_cricket_c_1_1": "当比赛结束时两队得分相同，赛果为平局（tie），但前提是最后的击球方必须完成其指定局数（例如：完成所有赛局；或是在回合有限的情况下，完成指定回合数；或者由于天气或光线不足而导致比赛终止）。",
                        "ART_ru_cricket_c_1_2": "和局（Draw）是指：当球队未能在比赛结束时完成比赛所产生的不确认结果，仅适用于甲级板球比赛。",
                        "ART_ru_cricket_c_2": "如果比赛因下雨（或其他原因）而延迟，所有投注将根据官方结果进行结算。",
                        "ART_ru_cricket_c_3": "对抗赛中，”击球手跑位得分”，”跑位得分”&”球员配对投注”均可成立，无论比赛时长、局数。",
                        "ART_ru_cricket_c_4": "如果赛事受到外来因素干扰而中断，所有注单将被取消。",
                    
                        "ART_ru_cricket_d": "单日赛",
                        "ART_ru_cricket_d_1": "在单日赛中，如果比赛时间缩短或因天气或因外来因素干扰而中断，所有注单将按照官方板球比赛规则结算。包括赛事受达-路方法（D/L method）或Jayadevan系统（VJD）的影响。如果比赛的最终结果是以投杀出局或掷币的方式裁决，则所有注单将被取消。",
                        "ART_ru_cricket_d_2": "如果比赛以平局（tie）结束并且官方结果或比赛规则未确定获胜者，若本公司没有提供平局（tie）的赔率，所有注单在独赢盘将被取消。如果赛事由投杀出局或超级轮来决定获胜者时，所有注单将被取消。",
                        "ART_ru_cricket_d_3": "如是采用达-路方法(Duckworth Lewis Method - DL)计算，所有投注在\"最多轮数\"，\"最高配对选手开场得分\"，“击球手赛事”及“投球手赛事”的注单将被取消，除非在采用D/L计算方式前已有明确结果并且之后没有任何显著会影响赛事结果的情况。“击球手”及“投球手”赛事在采用达-路方法(Duckworth Lewis Method - DL)之后所开的盘将由新的轮数来结算。",
                        "ART_ru_cricket_d_4": "如果在单日国际板球赛的当天需重新投硬币决定发球权，所有在原订开赛时间前45分钟的注单将被取消。此规则将运用于所有盘口，除非盘口结算方式已有明确结果并且之后没有任何显著会影响赛事结果的情况，例如‘赢发球权’盘口。",
                    
                        "ART_ru_bettype": "投注类型",
                    
                        "ART_ru_cricket_e": "独赢盘",
                        "ART_ru_cricket_e_1": "预测哪一支球队将在比赛中胜出。此盘口会有两个选项（队伍）",
                        "ART_ru_cricket_e_2": "如果比赛以平局（tie）结束并且没有宣布正式获胜者，并列第一规则适用。",
                        "ART_ru_cricket_e_3": "在甲级板球比赛中,如果比赛结果为和局（Draw），则所有注单将被视为无效。",
                        "ART_ru_cricket_e_4": "如果比赛没有官方结果，则所有注单将被视为无效。",
                    
                        "ART_ru_cricket_f": "1 x 2",
                        "ART_ru_cricket_f_1": "预测哪一支球队将会在比赛中胜出或者赛事是否会以和局结束。",
                        "ART_ru_cricket_f_2": "在单日赛中，平局（tie）将以和局（x）结算",
                        "ART_ru_cricket_f_3": "如果比赛没有官方结果，则所有注单将被视为无效。",
                    
                        /*
                        "ART_ru_cricket_g": "获胜者（并列第一规则）",
                        "ART_ru_cricket_g_1": "预测哪一支球队将在比赛中胜出。",
                        "ART_ru_cricket_g_2": "如果赛果是平手，则所有投注会根据并列第一规则结算。",
                        */
                    
                        "ART_ru_cricket_h": "和局",
                        "ART_ru_cricket_h_1": "预测赛事是否会以和局结束。",
                        "ART_ru_cricket_h_2": "如果赛果是和局，则所有投注在“是”的注单将会赢利。",
                    
                        "ART_ru_cricket_i": "赢得发球权",
                        "ART_ru_cricket_i_1": "预测哪一支球队将赢得发球权，优先开始比赛。",
                        "ART_ru_cricket_i_2": "如果结果没有宣判，所有注单将会取消。",
                    
                        "ART_ru_cricket_j": "最佳击球手",
                        "ART_ru_cricket_j_1": "以跑垒次数为基准，预测哪一位球员将会成为特定赛事中的最佳击球手。",
                        "ART_ru_cricket_j_2": "投注的球员如果不在11名首发阵容中或提名为第12位后备球员，所有注单将被取消。",
                        "ART_ru_cricket_j_3": "在两局赛制对赛里(甲级板球比赛)，除非另有注明，此盘口只以第一局的对赛结果为准。",
                        "ART_ru_cricket_j_4": "如果投注的球员没有参与比赛，注单将结算为输。",
                        "ART_ru_cricket_j_5": "如果比赛没有宣判优胜者，注单将按并列第一规则结算。",
                    
                        "ART_ru_cricket_k": "最佳投球手",
                        "ART_ru_cricket_k_1": "以取得的三柱门次数为基准，预测哪一位球员将可以成为特定赛事中的最佳投球手。",
                        "ART_ru_cricket_k_2": "投注的球员如果不在11名首发阵容中或提名为第12位后备球员，所有注单将被取消。",
                        "ART_ru_cricket_k_3": "在两局赛制对赛里(甲级板球比赛)，除非另有注明，此盘口只以第一局的对赛结果为准。",
                        "ART_ru_cricket_k_4": "如果投注的球员没有参与比赛，注单将结算为输。",
                        "ART_ru_cricket_k_5": "如果两名球员取得三柱门的次数相同，跑垒次数较少的投手将视为获胜者，不论球员个投出的轮数。如果比赛没有宣判优胜者，注单将按并列第一规则结算。",
                    
                        "ART_ru_cricket_l": "最多四分的球队",
                        "ART_ru_cricket_l_1": "预测哪一支球队将会在比赛中获得最多四分次数。",
                        "ART_ru_cricket_l_2": "平手将会是一个投注选项。",
                        "ART_ru_cricket_l_3": "如果必须完成的回合有减少，所有投注将会被取消。",
                    
                        "ART_ru_cricket_m": "最多六分的球队",
                        "ART_ru_cricket_m_1": "预测哪一支球队将会在比赛中获得最多六分次数。",
                        "ART_ru_cricket_m_2": "平手将会是一个投注选项。",
                        "ART_ru_cricket_m_3": "如果预定的回合有减少，投注将会被取消。",
                    
                        "ART_ru_cricket_n": "最多得分的球队",
                        "ART_ru_cricket_n_1": "预测哪一支球队将会在比赛中获得最多得分次数（四分和六分的组合）。",
                        "ART_ru_cricket_n_2": "平手将会是一个投注选项。",
                        "ART_ru_cricket_n_3": "如果必须完成的回合有减少，投注将会被取消。",
                    
                        "ART_ru_cricket_o": "配对选手开场得分最高的球队",
                        "ART_ru_cricket_o_1": "预测哪一支球队的配对选手开场得分最高。",
                        "ART_ru_cricket_o_2": "仅计算每支球队的第一局。",
                        "ART_ru_cricket_o_3": "平手将会是一个投注选项。",
                    
                        "ART_ru_cricket_p": "首个三柱门被击倒前跑位得分/第X个三柱门被击倒前跑位得分",
                        "ART_ru_cricket_p_1": "预测击球方的第一个（或下一个）击球手在出局前的跑位得分。",
                        "ART_ru_cricket_p_2": "如果没有出局，投注将会取消，除非已经无条件地确认。",
                        "ART_ru_cricket_p_3": "击球队的总积分将包括目标总数或总申报数。",
                    
                        "ART_ru_cricket_q": "首个“三柱门”方式",
                        "ART_ru_cricket_q_1": "预测第一个击球手的出局方式。",
                        "ART_ru_cricket_q_2": "相应选项为接球出局和其他。",
                        "ART_ru_cricket_q_3": "如果投球方没有击中三柱门，则所有投注将会被取消。",
                    
                        "ART_ru_cricket_r": "下一位出局的球手",
                        "ART_ru_cricket_r_1": "预测两个击球员谁将会下一个出局。",
                        "ART_ru_cricket_r_2": "如果其中一名球员迫使退赛，所有注单将被取消。",
                    
                        "ART_ru_cricket_s": "第一个投球跑位得分",
                        "ART_ru_cricket_s_1": "预测赛事中第一个球击出的跑位得分。",
                        "ART_ru_cricket_s_2": "如果赛事中没有球被击出，则所有投注均会被取消。",
                    
                        "ART_ru_cricket_t": "球队得4分的总数",
                        "ART_ru_cricket_t_1": "预测球队得4分的总数将会大于或小于指定的数值。",
                        "ART_ru_cricket_t_2": "如果必须完成的回合有减少，投注将会被取消。",
                    
                        "ART_ru_cricket_u": "球队得6分的总数",
                        "ART_ru_cricket_u_1": "预测球队得6分的总数将会大于或小于指定的数值。",
                        "ART_ru_cricket_u_2": "如果必须完成的回合有减少，投注将会被取消。",
                    
                        "ART_ru_cricket_v": "球队得分的总数",
                        "ART_ru_cricket_v_1": "预测球队得分的总数（4分和6分的组合）将会大于或小于指定的数值。",
                        "ART_ru_cricket_v_2": "如果必须完成的回合有减少，投注将会被取消。",
                    
                        "ART_ru_cricket_w": "球队总跑位得分两项投注（三项）",
                        "ART_ru_cricket_w_1": "预测当前击球方的总跑位得分将会大于或小于指定的数值。",
                        "ART_ru_cricket_w_2": "如果必须完成的回合有减少，投注将会被取消。",
                    
                        "ART_ru_cricket_x": "X回合获得最多跑位得分的球队",
                        "ART_ru_cricket_x_1": "预测哪一支球队将会在他们各自赛局的指定X回合获得最多跑位得分。",
                        "ART_ru_cricket_x_2": "如果两支球队都未能完成指定的X回合，则所有投注均会取消，除非结果已经无条件确认。",
                        "ART_ru_cricket_x_3": "平手将会是一个投注选项。",
                    
                        "ART_ru_cricket_y": "首回合跑位得分（两项投注）",
                        "ART_ru_cricket_y_1": "预测球队在首回合的跑位得分将会大于或是小于指定数值。",
                        "ART_ru_cricket_y_2": "如果该球队未能完成首回合，则所有投注将会取消，除非结果已经无条件确认。",
                    
                        "ART_ru_cricket_z": "首回合最高跑位得分",
                        "ART_ru_cricket_z_1": "预测哪一支球队在他们各自的第一个赛局的首回合获得最高跑位得分。",
                        "ART_ru_cricket_z_2": "如果两支球队均未能完成首回合，则所有投注将会被取消，除非结果已经无条件确认。",
                        "ART_ru_cricket_z_3": "平手将会是一个投注选项。",
                    
                        "ART_ru_cricket_aa": "球队全部出局",
                        "ART_ru_cricket_aa_1": "预测击球方是否会在第一个赛局宣告结束时失去所有10个三柱门。",
                        "ART_ru_cricket_aa_2": "如果赛事在第一个赛局结束前便已经取消，则所有投注将会被取消。",
                    
                        "ART_ru_cricket_ab": "击球手投注",
                        "ART_ru_cricket_ab_1": "预测哪一个指定的击球手可以获得该局的最高跑位得分。",
                        "ART_ru_cricket_ab_2": "如果其中一个击球手退赛，所有投注将会被取消。如果没有球员出局，所有注单将被取消。",
                        "ART_ru_cricket_ab_3": "如果出现平手，并列第一规则适用。",
                    
                        "ART_ru_cricket_ac": "投球手投注",
                        "ART_ru_cricket_ac_1": "预测哪一个指定的投球手可以取得该局的最多三柱门。",
                        "ART_ru_cricket_ac_2": "每个球员都必须要至少投一次球，否则所有投注将会被取消。",
                        "ART_ru_cricket_ac_3": "如果出现平手，并列第一规则适用。",
                    
                        "ART_ru_cricket_ad": "X回合跑位得分（两项投注）",
                        "ART_ru_cricket_ad_1": "预测特定期间（例如5个回合）的跑位总得分将会大于或是小于指定数值。",
                        "ART_ru_cricket_ad_2": "如果特定的期间没有完全完成，则所有投注将会被取消，除非已经无条件地确认。",
                    
                        "ART_ru_cricket_ae": "X回合跑位得分（三项投注）",
                        "ART_ru_cricket_ae_1": "预测是否在规定时间达到得分总数,例如5,将预测小于或大于在指定的范围值。",
                        "ART_ru_cricket_ae_2": "如果特定的期间没有完全完成，则所有投注将会被取消，除非已经无条件地确认。",
                    
                        "ART_ru_cricket_af": "跑位得分总数两项投注（球员）",
                        "ART_ru_cricket_af_1": "预测球员的跑位得分总数将会大于或小于指定数值。",
                        "ART_ru_cricket_af_2": "如果必须完成的回合有减少，所有投注将会被取消。",
                        "ART_ru_cricket_af_3": "如果一个击球员因伤退赛并且没有返回，所有投注将会被取消，除非已经无条件地确认。",
                        "ART_ru_cricket_af_4": "如果是在甲级板球赛事中提供，则仅计算指定赛局。",
                    
                        "ART_ru_cricket_ag": "跑位得分总数三项投注（球员）",
                        "ART_ru_cricket_ag_1": "预测球员的跑位得分总数将会大于、等于或小于指定数值范围。",
                        "ART_ru_cricket_ag_2": "如果必须完成的回合有减少，所有投注将会被取消。",
                        "ART_ru_cricket_ag_3": "如果一个击球员因伤退赛并且没有返回，所有投注将会被取消，除非已经无条件地确认。",
                        "ART_ru_cricket_ag_4": "如果是在甲级板球赛事中提供，则仅计算指定赛局。",
                    
                        "ART_ru_cricket_ah": "跑位得分50/100/150/200（球员）",
                        "ART_ru_cricket_ah_1": "预测指定球员在某一局跑位得分是否可以达到50/100/150/200或是更多。",
                        "ART_ru_cricket_ah_2": "单日赛结算——除非无条件确定，否则投注将会由于下雨或任何延误而无效。",
                        "ART_ru_cricket_ah_3": "甲级比赛结算——不管是否受到下雨或者其他因素影响，赌注将根据官方公布的最终比分来确定。",
                        "ART_ru_cricket_ah_4": "如果是在甲级板球赛事中提供，则仅计算指定赛局。",
                    
                        "ART_ru_cricket_ai": "出局方式（下个三柱门）",
                        "ART_ru_cricket_ai_1": "预测下一个击球员的出局方式。",
                        "ART_ru_cricket_ai_2": "可用的类型和数量选择取决于板球比赛的形式（有限的回合或是甲级）以及在比赛期间的形式。",
                        "ART_ru_cricket_ai_3": "如果没有更多的击球员出局，所有投注将会被取消。",
                    
                        "ART_ru_cricket_aj": "球队跑位总得分–单/双",
                        "ART_ru_cricket_aj_1": "预测击球队的跑位总得分是单数还是双数。",
                        "ART_ru_cricket_aj_2": "至少要有一球在局间被击杀，否则投注将会被取消。",
                        "ART_ru_cricket_aj_3": "结算将依据官方管理机构公布的该局比分进行。",
                    
                        "ART_ru_cricket_ak": "首回合跑位得分–单/双",
                        "ART_ru_cricket_ak_1": "预测击球队在该局的首回合跑位得分是单数还是双数。",
                        "ART_ru_cricket_ak_2": "至少要有一球在首回合被击杀，否则投注将会被取消。",
                    
                        "ART_ru_cricket_al": "最多歪球次数",
                        "ART_ru_cricket_al_1": "预测哪一支球队将会在比赛中获得最多歪球。",
                        "ART_ru_cricket_al_2": "平手将会是一个投注选项。",
                        "ART_ru_cricket_al_3": "如果必须完成的回合有减少，所有投注将会被取消。",
                    
                        "ART_ru_cricket_am": "歪球的总数",
                        "ART_ru_cricket_am_1": "预测赛事中的歪球总数将会大于或是小于指定数值。",
                        "ART_ru_cricket_am_2": "如果必须完成的回合有减少，所有投注将会被取消。",
                    
                        "ART_ru_cricket_an": "被杀出局总数",
                        "ART_ru_cricket_an_1": "预测赛事的被杀出局总数将会大于或是小于指定数值。",
                        "ART_ru_cricket_an_2": "如果必须完成的回合有减少，所有投注将会被取消。",
                    
                        "ART_ru_cricket_ao": "最多击杀次数",
                        "ART_ru_cricket_ao_1": "预测哪一支球队将会在比赛中获得最多击杀次数。",
                        "ART_ru_cricket_ao_2": "平手将会是一个投注选项。",
                        "ART_ru_cricket_ao_3": "如果必须完成的回合有减少，所有投注将会被取消。",
                    
                        "ART_ru_cricket_ap": "击杀总数",
                        "ART_ru_cricket_ap_1": "预测赛事中的击杀总数将会大于或是小于指定数值。",
                        "ART_ru_cricket_ap_2": "如果必须完成的回合有减少，所有投注将会被取消。",
                    
                        "ART_ru_cricket_aq": "最多零分",
                        "ART_ru_cricket_aq_1": "预测哪一支球队将会在比赛中获得最多零分。",
                        "ART_ru_cricket_aq_2": "平手将会是一个投注选项。",
                        "ART_ru_cricket_aq_3": "如果必须完成的回合有减少，所有投注将会被取消。",
                    
                        "ART_ru_cricket_ar": "零分总数",
                        "ART_ru_cricket_ar_1": "预测赛事中零分的总次数将会大于或是小于指定数值。",
                        "ART_ru_cricket_ar_2": "如果必须完成的回合有减少，所有投注将会被取消。",
                    
                        "ART_ru_cricket_as": "第1局领先",
                        "ART_ru_cricket_as_1": "预测哪支球队会在第一局领先。",
                        "ART_ru_cricket_as_2": "双方球员都必须要完成第1局（包括被宣布完成的），投注方为有效。",
                    
                        "ART_ru_cricket_at": "跑位得分两项投注（三项投注）",
                        "ART_ru_cricket_at_1": "预测参赛的球员跑位得分总数将会大于或小于指定数值。",
                        "ART_ru_cricket_at_2": "如果比赛因为下雨或其他原因延误，则使用以下条款：",
                        "ART_ru_cricket_at_2_1": "指定回合",
                        "ART_ru_cricket_at_2_2": "所有赌注将视为无效，除非已经确定结果的比赛。",
                        "ART_ru_cricket_at_2_3": "甲级赛事",
                        "ART_ru_cricket_at_2_4": "无论比赛因为下雨或其他原因延误，所有赌注都将成立。",
                    
                        "ART_ru_cricket_au": "跑垒数",
                        "ART_ru_cricket_au_1": "预测当前跑垒得分的总数是否超过指定值。",
                        "ART_ru_cricket_au_2": "跑垒数必须超过20，投注方为有效。",
                        ';
                        break;
                }
                break;
            case "cycling":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_cycling": "自行車",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "04/09/2019",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_cycling_a_1": "頒獎儀式公佈的名次將視為官方結果，如之後發生取消資格或修改結果的情況將不予以計算考慮。",
                    
                        "ART_ru_bettype": "投注類型",
                        "ART_ru_cycling_b": "冠軍投注",
                        "ART_ru_cycling_b_1": "如果​​投注的車手未能出賽，所有注單將保持有效。",
                    
                        "ART_ru_cycling_c": "二選一投注",
                        "ART_ru_cycling_c_1": "如果任何一方車手未能出賽，所有注單將被取消。",
                        "ART_ru_cycling_c_2": "注單的結算將按照兩位車手在比賽后獲得的名次為準。",
                        "ART_ru_cycling_c_3": "如果兩位車手都無法完成比賽或比賽的某個階段，所有注單將被取消。",
                        "ART_ru_cycling_c_4": "如果任何一方車手在開賽后未能完成比賽或比賽的某個階段，另一位完成比賽或比賽的某個階段的車手將視為獲勝者。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_cycling": "CYCLING",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "04/09/2019",
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_cycling_a_1": "Podium positions will count as the official results, regardless of any subsequent disqualification or amendment to the result.",
                    
                        "ART_ru_bettype": "BET TYPES",
                        "ART_ru_cycling_b": "Outright",
                        "ART_ru_cycling_b_1": "If a cyclist fails to start the race, all bets will still be considered valid.",
                    
                        "ART_ru_cycling_c": "Head to Head",
                        "ART_ru_cycling_c_1": "If one of the two cyclists does not start the race, all bets will be void.",
                        "ART_ru_cycling_c_2": "Bets will be settled based upon one cyclist\'s ranking against the other cyclist after the specified race.",
                        "ART_ru_cycling_c_3": "If both cyclists start but both fail to finish a specific event / stage then bets will be void.",
                        "ART_ru_cycling_c_4": "If both cyclists start a specific event / stage and only one fails to finish, then the cyclist who completes the specific event / stage will be deemed the winner.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_cycling": "自行车",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "04/09/2019",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_cycling_a_1": "颁奖仪式公布的名次将视为官方结果，如之后发生取消资格或修改结果的情况将不予以计算考虑。",
                    
                        "ART_ru_bettype": "投注类型",
                        "ART_ru_cycling_b": "冠军投注",
                        "ART_ru_cycling_b_1": "如果​​投注的车手未能出赛，所有注单将保持有效。",
                    
                        "ART_ru_cycling_c": "二选一投注",
                        "ART_ru_cycling_c_1": "如果任何一方车手未能出赛，所有注单将被取消。",
                        "ART_ru_cycling_c_2": "注单的结算将按照两位车手在比赛后获得的名次为准。",
                        "ART_ru_cycling_c_3": "如果两位车手都无法完成比赛或比赛的某个阶段，所有注单将被取消。",
                        "ART_ru_cycling_c_4": "如果任何一方车手在开赛后未能完成比赛或比赛的某个阶段，另一位完成比赛或比赛的某个阶段的车手将视为获胜者。",
                        ';
                        break;
                }
                break;
            case "darts":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_darts": "飛鏢",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "08/12/2017",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_darts_a_1": "如果投注的選手沒有參與比賽，所有所有投注此選手的注意將被取消。",
                        "ART_ru_darts_a_2": "如果一個選手在比賽未結束前退出或被取消比賽資格，這場比賽的所有投注將視為無效，除非另有說明。",
                        "ART_ru_darts_a_3": "如果一個選手並未在比賽結束前退出或被取消比賽資格，所有投注在此賽事上的注單將視為無效，除非另有說明。",
                        "ART_ru_darts_a_4": "如果比賽在法定時間提前進行，只有在比賽開始前的投注仍然有效。比賽開始後的所有投注將被視為無效。（滾球投注另作別論）。",
                    
                        "ART_ru_bettype": "投注類型",
                    
                        "ART_ru_darts_b": "優勝者",
                        "ART_ru_darts_b_1": "預測哪一位選手將會在指定比賽中勝出。",
                        "ART_ru_darts_b_2": "如果比賽沒有完成，相關機構所宣佈的勝者玩家將會被視為優勝者。",
                        "ART_ru_darts_b_3": "這個市場根據賽事可提供二項或者三項選擇。",
                        "ART_ru_darts_b_4": "如果二項投注中出現平局,那麼所有注單將視為無效。",
                        "ART_ru_darts_b_4-1": "平局的選項將包含在三項投注的選項中。",
                    
                        "ART_ru_darts_c": "優勝者（盤）",
                        "ART_ru_darts_c_1": "預測哪一位選手將成為市場名單中指定盤的獲勝者。",
                        "ART_ru_darts_c_2": "如果指定盤未能完成，所有投注在該市場的注單將被視為無效。",
                        "ART_ru_darts_c_3": "如果指定盤已完成，但是賽事沒有完成，所有投注在這個市場的注單將被視為有效。",
                    
                        "ART_ru_darts_d": "(局) 優勝者",
                        "ART_ru_darts_d_1": "預測哪一位選手將是市場名單中指定局的獲勝者。",
                        "ART_ru_darts_d_2": "局可能是特定的賽事其中一局的局數或特定賽事其中一盤的局數。",
                        "ART_ru_darts_d_3": "如果指定局未能完成，所有在這個市場的投注將被視為無效。",
                        "ART_ru_darts_d_4": "如果指定盤已完成，但是賽事沒有完成，所有投注在這個市場的注單將被視為有效。",
                    
                        "ART_ru_darts_e": "波膽",
                        "ART_ru_darts_e_1": "在比賽結束時預測正確的比分。",
                        "ART_ru_darts_e_2": "如果比賽是基於“局”的話，每位選手的總局數記錄將被採用。",
                        "ART_ru_darts_e_3": "如果比賽是基於“盤“的話，每位選手的總盤數記錄將被採用。",
                        "ART_ru_darts_e_4": "如果全場比賽沒有完成，所有的投注將會被視為無效。",
                    
                        "ART_ru_darts_f": "讓球",
                        "ART_ru_darts_f_1": "預測賽事在盤口指定的讓球數上的結果。",
                        "ART_ru_darts_f_2": "如果賽事是以“局”為基礎，這個讓球的提供將以最後局的得分為基礎。",
                        "ART_ru_darts_f_3": "如果賽事是以“盤”為基礎，這個讓球的提供將以最後盤的得分為基礎",
                        "ART_ru_darts_f_4": "如果比賽沒有完成，那麼所有的賭注將是無效的，除非賽事已有明確結果。",
                    
                        "ART_ru_darts_g": "總局數：大/小",
                        "ART_ru_darts_g_1": "預測賽事的總局數將大於或小於賽事指定的大/小局分數。",
                        "ART_ru_darts_g_2": "如果比賽沒有完成，那麼所有的賭注將是無效的，除非賽事已有明確結果。",
                    
                        "ART_ru_darts_h": "總局數-X盤",
                        "ART_ru_darts_h_1": "預測在特定盤的範圍內的確切的局數。",
                        "ART_ru_darts_h_2": "如果特定的盤沒有完成，所有的投注是無效的。",
                        "ART_ru_darts_h_3": "如果特定盤有完成，但賽事並沒有完成，那麼所有投注在這個市場上的注單將被視為有效。",
                    
                        "ART_ru_darts_i": "總盤數：大/小",
                        "ART_ru_darts_i_1": "預測賽事的總盤數將大於或小於賽事指定的大/小盤分數。",
                        "ART_ru_darts_i_2": "如果賽事沒有完成，那麼所有的賭注將是無效的，除非賽事已有明確結果。",
                    
                        "ART_ru_darts_j": "首先達到3局",
                        "ART_ru_darts_j_1": "預測哪一個選手將先贏得3 局。",
                        "ART_ru_darts_j_2": "如果在比賽中沒有任何一方贏取3局，所有的投注將被視為無效。",
                    
                        "ART_ru_darts_k": "在4局後得分",
                        "ART_ru_darts_k_1": "預測在首4局已完成後的指定選手的正確得分。",
                        "ART_ru_darts_k_2": "如果比賽的首4局沒有完成，那麼所有的投注都將是無效的。",
                    
                        "ART_ru_darts_l": "在4局後領先",
                        "ART_ru_darts_l_1": "預測在比賽首4局已完成的情況下領先的選手。",
                        "ART_ru_darts_l_2": "平局也可以供選擇。",
                        "ART_ru_darts_l_3": "如果比賽的首4局沒有完成，所以的投注將被視為無效。",
                    
                        "ART_ru_darts_m": "波膽-X 盤",
                        "ART_ru_darts_m_1": "預測在特定盤結束後的局數正確的比分。",
                        "ART_ru_darts_m_2": "如果特定的盤沒有完成，所有的投注將會視為無效。",
                        "ART_ru_darts_m_3": "如果特定的盤完成，但是賽事沒有完成，在這個市場所有的投注將會被確認。",
                    
                        "ART_ru_darts_n": "180分",
                        "ART_ru_darts_n_1": "預測在特定時節內是否有180得分。",
                        "ART_ru_darts_n_2": "這個市場可能基於賽事所有局中特定局或賽事其中一盤中的特定局。",
                        "ART_ru_darts_n_3": "如果選手的名字沒有包含在市場名單裡面，這個結果將會基於任何一名選手的180分記錄。",
                        "ART_ru_darts_n_4": "如果球員名字在市場名稱內，賽果將以該玩家在比賽180分的記錄。",
                        "ART_ru_darts_n_5": "如果特定局沒有完成，所有這個市場的投注將被視為無效。",
                    
                        "ART_ru_darts_o": "180分－大/小盤",
                        "ART_ru_darts_o_1": "預測賽事的總180分記錄將大於或小於賽事指定的大/小180分記錄。",
                        "ART_ru_darts_o_2": "如果選手的名字沒有包含在市場名單裡面，結果將會基於兩名選手的180分記錄為准。",
                        "ART_ru_darts_o_3": "如果球員名稱在市場名稱內，賽果將基於該玩家在比賽180總分的記",
                        "ART_ru_darts_o_4": "如果比賽沒有完成，所有的投注將會被視為無效，除非賽事已有明確結果。",
                    
                        "ART_ru_darts_p": "180分-讓球",
                        "ART_ru_darts_p_1": "預測賽事盤口在每個選手指定的讓球數上的180分結果。",
                        "ART_ru_darts_p_2": "結算將基於賽事結束後每個選手的180分記錄總數為准。",
                        "ART_ru_darts_p_3": "如果比賽沒有完成，所有的投注將會被視為無效，除非賽事已有明確結果。",
                    
                        "ART_ru_darts_q": "獲得最多180分",
                        "ART_ru_darts_q_1": "預測在賽事中哪一位選手獲得最多180分記錄。",
                        "ART_ru_darts_q_2": "平局也包含在選項裡面。",
                        "ART_ru_darts_q_3": "如果比賽沒有完成，所有的投注將會被視為無效，除非賽事已有明確結果。",
                    
                        "ART_ru_darts_r": "決勝鏢盤口",
                        "ART_ru_darts_r_1": "預測哪一位選手將在賽事最後一局以決勝鏢取勝。",
                        "ART_ru_darts_r_2": "如果賽事沒有完成，所 有的投注將被視為無效。",
                    
                        "ART_ru_darts_s": "X 決勝鏢總數：大/小 X",
                        "ART_ru_darts_s_1": "預測賽事的特定局的決勝鏢總數大於或小於賽事指定的大/小決勝鏢總數。",
                        "ART_ru_darts_s_2": "如果賽事是以局為基準的，那麼市場的提供將會以特定的局為基準。",
                        "ART_ru_darts_s_3": "如果賽事是以盤為基準的，那市場的提供將會以這一盤的特定局為基準。",
                        "ART_ru_darts_s_4": "如果特定局沒有完成，所有的投注將被視為無效。",
                    
                        "ART_ru_darts_t": "決勝鏢總數：大/小（ X－X）",
                        "ART_ru_darts_t_1": "預測賽事中的特定局的決勝鏢總數是在數值範圍之間或決勝鏢總數是高於或低於該數值範圍。",
                        "ART_ru_darts_t_2": "如果賽事是以局為基準的， 那麼市場的提供將會以特定局為基準。",
                        "ART_ru_darts_t_3": "如果賽事是以盤為基準的，那麼市場的提供將會以這一局的特定局為基準。",
                        "ART_ru_darts_t_4": "如果特定局沒有完成，所有的投注將會被視為無效。",
                    
                        "ART_ru_darts_u": "最高決勝鏢：大/小 X",
                        "ART_ru_darts_u_1": "預測賽事的最高決勝鏢是大於或小於指定的大/小。 這個最高決勝鏢可能會是170。",
                        "ART_ru_darts_u_2": "如果一個選手的名字不在市場名單裡面，結果將是基於雙方選手的決勝鏢記錄結算。",
                        "ART_ru_darts_u_3": "如果選手的名字包含在市場名單裡面，這個結果將會基於特定選手的最高決勝鏢。",
                        "ART_ru_darts_u_4": "如果賽事沒有完成，那麼所有的賭注將是無效的，除非賽事已有明確結果。",
                    
                        "ART_ru_darts_v": "最高決勝鏢：大/小 （X－X）",
                        "ART_ru_darts_v_1": "預測賽事中的最高決勝鏢是在數值範圍之間或最高決勝鏢是高於或低於該數值範圍。這個最高決勝鏢可能會是170。",
                        "ART_ru_darts_v_2": "如果一個選手的名字不在市場名單裡面，結果將是基於雙方選手的決勝鏢記錄結算。",
                        "ART_ru_darts_v_3": "如果選手的名字是包含在市場名單裡面，結果將會以特定選手的最高決勝鏢結算。",
                        "ART_ru_darts_v_4": "如果賽事沒有完成，那麼所有的賭注將是無效的，除非賽事已有明確結果。",
                    
                        "ART_ru_darts_w": "決勝鏢顏色",
                        "ART_ru_darts_w_1": "預測在賽事特定期間的決勝鏢顏色（例如：最後一鏢）。",
                        "ART_ru_darts_w_2": "如果比賽是以“局”為基礎的，那麼這個市場的提供將會以特定的局為基準。",
                        "ART_ru_darts_w_3": "如果比賽是以“盤”為基礎的，那麼這個市場的提供將會以這一盤的特定局為基準。",
                        "ART_ru_darts_w_4": "所提供的選擇永遠是“紅色”或“綠色”。",
                        "ART_ru_darts_w_5": "如果特定局沒有完成，所有的投注將會被視為無效。",

                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_darts": "DARTS",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "08/12/2017",
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_darts_a_1": "All bets will be considered valid only when the match is finished, unless otherwise stated.",
                        "ART_ru_darts_a_2": "If a player fails to compete in a match, all bets on that player will be considered void.",
                        "ART_ru_darts_a_3": "If a player retires or is disqualified during a match before its completion, all bets for the match will be considered void, unless otherwise stated.",
                        "ART_ru_darts_a_4": "If a match starts before schedule, only the transactions before the game starts will be considered valid. The transactions after the match starts will be considered invalid. (Except in-play bet types).",
                    
                        "ART_ru_bettype": "BET TYPES",
                    
                        "ART_ru_darts_b": "Winner",
                        "ART_ru_darts_b_1": "Predict who will be the winner of the specified match.",
                        "ART_ru_darts_b_2": "If a match fails to finish, the player declared the winner by the relevant governing body will be used for settlement.",
                        "ART_ru_darts_b_3": "This market may be offered as 2-Way or 3-Way depending on the event.",
                        "ART_ru_darts_b_4": "If a 2-Way market results in a draw, then all bets will be void.",
                        "ART_ru_darts_b_4-1": "The option of draw will be included in 3-Way selections.",
                    
                        "ART_ru_darts_c": "Winner (Set)",
                        "ART_ru_darts_c_1": "Predict who will be the winner of a specified set stated in the market name.",
                        "ART_ru_darts_c_2": "If the specific set fails to finish, then all bets on this market will be considered void.",
                        "ART_ru_darts_c_3": "If the specific set does finish, but the match does not, then all bets on this market will stand.",
                    
                        "ART_ru_darts_d": "Winner (Leg) ",
                        "ART_ru_darts_d_1": "Predict who will be the winner of the specific leg stated in the market name.",
                        "ART_ru_darts_d_2": "The leg may be specific to a \'Legs\' match or as leg of a \'Sets\' match.",
                        "ART_ru_darts_d_3": "If the specific leg fails to finish, then all bets on this market will be considered void.",
                        "ART_ru_darts_d_4": "If the specific set does finish, but the match does not, then all bets on this market will stand.",
                    
                        "ART_ru_darts_e": "Match Correct Score",
                        "ART_ru_darts_e_1": "Predict the correct score at the end of the stated match.",
                        "ART_ru_darts_e_2": "If the match is based on \'Legs\', then the overall number of legs recorded by each player will apply.",
                        "ART_ru_darts_e_3": "If the match is based on \'Sets\', then the overall number of sets recorded by each player will apply.",
                        "ART_ru_darts_e_4": "If the match is not completed in full, then all bets will be void.",
                    
                        "ART_ru_darts_f": "Handicap",
                        "ART_ru_darts_f_1": "Predict the outcome of the match with the indicated handicap applied.",
                        "ART_ru_darts_f_2": "If the match is based on \'Legs\', then the handicap offered will be based on the final leg score.",
                        "ART_ru_darts_f_3": "If the match is based on \'Sets\', then the handicap offered will be based on the final set score.",
                        "ART_ru_darts_f_4": "If the match does not finish, then all bets will be void unless the market has been unconditionally determined.",
                    
                        "ART_ru_darts_g": "Total Legs: Over / Under",
                        "ART_ru_darts_g_1": "Predict whether to the total number of match legs will be over or under the stated value.",
                        "ART_ru_darts_g_2": "If the match does not finish, then all bets will be void unless the market has been unconditionally determined.",
                    
                        "ART_ru_darts_h": "Total Legs - X Set",
                        "ART_ru_darts_h_1": "Predict the exact number of legs played within the specific set stated.",
                        "ART_ru_darts_h_2": "If the specific set does not finish, then all bets will be void.",
                        "ART_ru_darts_h_3": "If the specific set does finish, but the match does not, then all bets on this market will stand.",
                    
                        "ART_ru_darts_i": "Total Sets: Over / Under",
                        "ART_ru_darts_i_1": "Predict whether to the total number of match sets will be over or under the stated value.",
                        "ART_ru_darts_i_2": "If the match does not finish, then all bets will be void unless the market has been unconditionally determined.",
                    
                        "ART_ru_darts_j": "Race to 3 Legs",
                        "ART_ru_darts_j_1": "Predict who will be the first player to record 3 winnings legs.",
                        "ART_ru_darts_j_2": "If either person fails to record 3 wining legs in the match, then all bets will be void.",
                    
                        "ART_ru_darts_k": "Score after 4 Legs",
                        "ART_ru_darts_k_1": "Predict the correct score for a specific player after the first 4 legs of the match have been played.",
                        "ART_ru_darts_k_2": "If the first 4 legs of the match are not completed, then all bets will be void.",
                    
                        "ART_ru_darts_l": "To Lead after 4 Legs",
                        "ART_ru_darts_l_1": "Predict the player to be leading, after the first 4 legs of the match have been played.",
                        "ART_ru_darts_l_2": "Draw will also be available for selection.",
                        "ART_ru_darts_l_3": "If the first 4 legs of the match are not completed, then all bets will be void.",
                    
                        "ART_ru_darts_m": "Correct Score - X Set",
                        "ART_ru_darts_m_1": "Predict the correct leg score at the end of the specific set stated.",
                        "ART_ru_darts_m_2": "If the specific set does not finish, then all bets will be void.",
                        "ART_ru_darts_m_3": "If the specific set does finish, but the match does not, then all bets on this market will stand.",
                    
                        "ART_ru_darts_n": "180 Scored",
                        "ART_ru_darts_n_1": "Predict whether a 180 will be scored in the specific period stated.",
                        "ART_ru_darts_n_2": "The market may be based on a specific leg of a \'Legs\' match or of a specific leg of a \'Sets\' match.",
                        "ART_ru_darts_n_3": "If a player\'s name is not stated in the market name, the result will be based on either player recording a 180.",
                        "ART_ru_darts_n_4": "If the players name is included in the market name, the result will be based on that player’s total 180’s in the match.",
                        "ART_ru_darts_n_5": "If the specific leg fails to finish, then all bets on that market will be considered void.",
                    
                        "ART_ru_darts_o": "Match 180\'s - Over / Under",
                        "ART_ru_darts_o_1": "Predict whether the total number of 180\'s recorded in the match will be over or under the value stated.",
                        "ART_ru_darts_o_2": "If a player\'s name is not stated in the market name, the result will be based on total 180\'s recorded by both players.",
                        "ART_ru_darts_o_3": "If the players name is included in the market name, the result will be based on that player’s total 180’s in the match.",
                        "ART_ru_darts_o_4": "If the match does not finish, then all bets will be void unless the market has been unconditionally determined.",
                    
                        "ART_ru_darts_p": "Match 180\'s - Player Handicap",
                        "ART_ru_darts_p_1": "Predict the outcome of match 180\'s with the indicated handicap applied to each player.",
                        "ART_ru_darts_p_2": "Settlement will be based on the total number of 180\'s recorded by each player at the end of the match.",
                        "ART_ru_darts_p_3": "If the match does not finish, then all bets will be void unless the market has been unconditionally determined.",
                    
                        "ART_ru_darts_q": "Most 180\'s Scored",
                        "ART_ru_darts_q_1": "Predict which player will record the higher number of 180\'s in the match.",
                        "ART_ru_darts_q_2": "The result of draw may also be included as a selection.",
                        "ART_ru_darts_q_3": "If the match does not finish, then all bets will be void unless the market has been unconditionally determined.",
                    
                        "ART_ru_darts_r": "Match Checkout",
                        "ART_ru_darts_r_1": "Predict which player will record the winning checkout in the final leg of the match.",
                        "ART_ru_darts_r_2": "If the match fails to finish, then all bets will be considered void.",
                    
                        "ART_ru_darts_s": "Checkout Total: Over / Under X",
                        "ART_ru_darts_s_1": "Predict if the checkout total for a specific leg of a match is over or under the value indicated.",
                        "ART_ru_darts_s_2": "If the match is based on \'Legs\', then the market offered will be based on a specific leg stated.",
                        "ART_ru_darts_s_3": "If the match is based on \'Sets\', then the market offered will be based on a specific leg within a set.",
                        "ART_ru_darts_s_4": "If the specific leg fails to finish, then all bets will be considered void.",
                    
                        "ART_ru_darts_t": "Checkout Total: Over / Under (X-X)",
                        "ART_ru_darts_t_1": "Predict if the checkout total for a specific leg of a match falls between the range stated (inclusive of both numbers) or whether the checkout total will be above or below that range.",
                        "ART_ru_darts_t_2": "If the match is based on \'Legs\', then the market offered will be based on a specific leg stated.",
                        "ART_ru_darts_t_3": "If the match is based on \'Sets\', then the market offered will be based on a specific leg within a set.",
                        "ART_ru_darts_t_4": "If the specific leg fails to finish, then all bets will be considered void.",
                    
                        "ART_ru_darts_u": "Highest Match Checkout: Over / Under X",
                        "ART_ru_darts_u_1": "Predict if the highest match checkout will be over or under the value stated. The highest possible checkout being 170.",
                        "ART_ru_darts_u_2": "If a player\'s name is not stated in the market name, the result will be based on checkouts recorded by both players.",
                        "ART_ru_darts_u_3": "If the players name is included in the market name, the result will be based on the specific player’s highest checkout.",
                        "ART_ru_darts_u_4": "If the match does not finish, then all bets will be void unless the market has been unconditionally determined.",
                    
                        "ART_ru_darts_v": "Highest Match Checkout: Over / Under (X-X)",
                        "ART_ru_darts_v_1": "Predict if the highest match checkout falls between the range stated (inclusive of both numbers) or whether the highest match checkout will be above or below that range. The highest possible checkout being 170.",
                        "ART_ru_darts_v_2": "If a player\'s name is not stated in the market name, the result will be based on checkouts recorded by both players.",
                        "ART_ru_darts_v_3": "If the players name is included in the market name, the result will be based on the specific player’s highest checkout.",
                        "ART_ru_darts_v_4": "If the match does not finish, then all bets will be void unless the market has been unconditionally determined.",
                    
                        "ART_ru_darts_w": "Checkout Colour",
                        "ART_ru_darts_w_1": "Predict the colour of the checkout dart (i.e. last dart) for the specific period of the match stated.",
                        "ART_ru_darts_w_2": "If the match is based on \'Legs\', then the market offered will be based on a specific leg stated.",
                        "ART_ru_darts_w_3": "If the match is based on \'Sets\', then the market offered will be based on a specific leg within a set.",
                        "ART_ru_darts_w_4": "The selections offered will always be \'Red\' or \'Green\' .",
                        "ART_ru_darts_w_5": "If the specific leg fails to finish, then all bets will be considered void.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_darts": "飞镖",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "08/12/2017",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_darts_a_1": "如果投注的选手没有参与比赛，所有所有投注此选手的注意将被取消。",
                        "ART_ru_darts_a_2": "如果一个选手在比赛未结束前退出或被取消比赛资格，这场比赛的所有投注将视为无效，除非另有说明。",
                        "ART_ru_darts_a_3": "如果一个选手并未在比赛结束前退出或被取消比赛资格，所有投注在此赛事上的注单将视为无效，除非另有说明。",
                        "ART_ru_darts_a_4": "如果比赛在法定时间提前进行，只有在比赛开始前的投注仍然有效。比赛开始后的所有投注将被视为无效。（滚球投注另作别论）。",
                    
                        "ART_ru_bettype": "投注类型",
                    
                        "ART_ru_darts_b": "优胜者",
                        "ART_ru_darts_b_1": "预测哪一位选手将会在指定比赛中胜出。",
                        "ART_ru_darts_b_2": "如果比赛没有完成，相关机构所宣布的胜者玩家将会被视为优胜者。",
                        "ART_ru_darts_b_3": "这个市场根据赛事可提供二项或者三项选择。",
                        "ART_ru_darts_b_4": "如果二项投注中出现平局,那么所有注单将视为无效。",
                        "ART_ru_darts_b_4-1": "平局的选项将包含在三项投注的选项中。",
                    
                        "ART_ru_darts_c": "优胜者（盘）",
                        "ART_ru_darts_c_1": "预测哪一位选手将成为市场名单中指定盘的获胜者。",
                        "ART_ru_darts_c_2": "如果指定盘未能完成，所有投注在该市场的注单将被视为无效。",
                        "ART_ru_darts_c_3": "如果指定盘已完成，但是赛事没有完成，所有投注在这个市场的注单将被视为有效。",
                    
                        "ART_ru_darts_d": "(局) 优胜者",
                        "ART_ru_darts_d_1": "预测哪一位选手将是市场名单中指定局的获胜者。",
                        "ART_ru_darts_d_2": "局可能是特定的赛事其中一局的局数或特定赛事其中一盘的局数。",
                        "ART_ru_darts_d_3": "如果指定局未能完成，所有在这个市场的投注将被视为无效。",
                        "ART_ru_darts_d_4": "如果指定盘已完成，但是赛事没有完成，所有投注在这个市场的注单将被视为有效。",
                    
                        "ART_ru_darts_e": "波胆",
                        "ART_ru_darts_e_1": "在比赛结束时预测正确的比分。",
                        "ART_ru_darts_e_2": "如果比赛是基于“局”的话，每位选手的总局数记录将被采用。",
                        "ART_ru_darts_e_3": "如果比赛是基于“盘“的话，每位选手的总盘数记录将被采用。",
                        "ART_ru_darts_e_4": "如果全场比赛没有完成，所有的投注将会被视为无效。",
                    
                        "ART_ru_darts_f": "让球",
                        "ART_ru_darts_f_1": "预测赛事在盘口指定的让球数上的结果。",
                        "ART_ru_darts_f_2": "如果赛事是以“局”为基础，这个让球的提供将以最后局的得分为基础。",
                        "ART_ru_darts_f_3": "如果赛事是以“盘”为基础，这个让球的提供将以最后盘的得分为基础",
                        "ART_ru_darts_f_4": "如果比赛没有完成，那么所有的赌注将是无效的，除非赛事已有明确结果。",
                    
                        "ART_ru_darts_g": "总局数：大/小",
                        "ART_ru_darts_g_1": "预测赛事的总局数将大于或小于赛事指定的大/小局分数。",
                        "ART_ru_darts_g_2": "如果比赛没有完成，那么所有的赌注将是无效的，除非赛事已有明确结果。",
                    
                        "ART_ru_darts_h": "总局数-X盘",
                        "ART_ru_darts_h_1": "预测在特定盘的范围内的确切的局数。",
                        "ART_ru_darts_h_2": "如果特定的盘没有完成，所有的投注是无效的。",
                        "ART_ru_darts_h_3": "如果特定盘有完成，但赛事并没有完成，那么所有投注在这个市场上的注单将被视为有效。",
                    
                        "ART_ru_darts_i": "总盘数：大/小",
                        "ART_ru_darts_i_1": "预测赛事的总盘数将大于或小于赛事指定的大/小盘分数。",
                        "ART_ru_darts_i_2": "如果赛事没有完成，那么所有的赌注将是无效的，除非赛事已有明确结果。",
                    
                        "ART_ru_darts_j": "首先达到3局",
                        "ART_ru_darts_j_1": "预测哪一个选手将先赢得3 局。",
                        "ART_ru_darts_j_2": "如果在比赛中没有任何一方赢取3局，所有的投注将被视为无效。",
                    
                        "ART_ru_darts_k": "在4局后得分",
                        "ART_ru_darts_k_1": "预测在首4局已完成后的指定选手的正确得分。",
                        "ART_ru_darts_k_2": "如果比赛的首4局没有完成，那么所有的投注都将是无效的。",
                    
                        "ART_ru_darts_l": "在4局后领先",
                        "ART_ru_darts_l_1": "预测在比赛首4局已完成的情况下领先的选手。",
                        "ART_ru_darts_l_2": "平局也可以供选择。",
                        "ART_ru_darts_l_3": "如果比赛的首4局没有完成，所以的投注将被视为无效。",
                    
                        "ART_ru_darts_m": "波胆-X 盘",
                        "ART_ru_darts_m_1": "预测在特定盘结束后的局数正确的比分。",
                        "ART_ru_darts_m_2": "如果特定的盘没有完成，所有的投注将会视为无效。",
                        "ART_ru_darts_m_3": "如果特定的盘完成，但是赛事没有完成，在这个市场所有的投注将会被确认。",
                    
                        "ART_ru_darts_n": "180分",
                        "ART_ru_darts_n_1": "预测在特定时节内是否有180得分。",
                        "ART_ru_darts_n_2": "这个市场可能基于赛事所有局中特定局或赛事其中一盘中的特定局。",
                        "ART_ru_darts_n_3": "如果选手的名字没有包含在市场名单里面，这个结果将会基于任何一名选手的180分记录。",
                        "ART_ru_darts_n_4": "如果球员名字在市场名称内，赛果将以该玩家在比赛180分的记录。",
                        "ART_ru_darts_n_5": "如果特定局没有完成，所有这个市场的投注将被视为无效。",
                    
                        "ART_ru_darts_o": "180分－大/小盘",
                        "ART_ru_darts_o_1": "预测赛事的总180分记录将大于或小于赛事指定的大/小180分记录。",
                        "ART_ru_darts_o_2": "如果选手的名字没有包含在市场名单里面，结果将会基于两名选手的180分记录为准。",
                        "ART_ru_darts_o_3": "如果球员名称在市场名称内，赛果将基于该玩家在比赛180总分的记",
                        "ART_ru_darts_o_4": "如果比赛没有完成，所有的投注将会被视为无效，除非赛事已有明确结果。",
                    
                        "ART_ru_darts_p": "180分-让球",
                        "ART_ru_darts_p_1": "预测赛事盘口在每个选手指定的让球数上的180分结果。",
                        "ART_ru_darts_p_2": "结算将基于赛事结束后每个选手的180分记录总数为准。",
                        "ART_ru_darts_p_3": "如果比赛没有完成，所有的投注将会被视为无效，除非赛事已有明确结果。",
                    
                        "ART_ru_darts_q": "获得最多180分",
                        "ART_ru_darts_q_1": "预测在赛事中哪一位选手获得最多180分记录。",
                        "ART_ru_darts_q_2": "平局也包含在选项里面。",
                        "ART_ru_darts_q_3": "如果比赛没有完成，所有的投注将会被视为无效，除非赛事已有明确结果。",
                    
                        "ART_ru_darts_r": "决胜镖盘口",
                        "ART_ru_darts_r_1": "预测哪一位选手将在赛事最后一局以决胜镖取胜。",
                        "ART_ru_darts_r_2": "如果赛事没有完成，所 有的投注将被视为无效。",
                    
                        "ART_ru_darts_s": "X 决胜镖总数：大/小 X",
                        "ART_ru_darts_s_1": "预测赛事的特定局的决胜镖总数大于或小于赛事指定的大/小决胜镖总数。",
                        "ART_ru_darts_s_2": "如果赛事是以局为基准的，那么市场的提供将会以特定的局为基准。",
                        "ART_ru_darts_s_3": "如果赛事是以盘为基准的，那市场的提供将会以这一盘的特定局为基准。",
                        "ART_ru_darts_s_4": "如果特定局没有完成，所有的投注将被视为无效。",
                    
                        "ART_ru_darts_t": "决胜镖总数：大/小（ X－X）",
                        "ART_ru_darts_t_1": "预测赛事中的特定局的决胜镖总数是在数值范围之间或决胜镖总数是高于或低于该数值范围。",
                        "ART_ru_darts_t_2": "如果赛事是以局为基准的， 那么市场的提供将会以特定局为基准。",
                        "ART_ru_darts_t_3": "如果赛事是以盘为基准的，那么市场的提供将会以这一局的特定局为基准。",
                        "ART_ru_darts_t_4": "如果特定局没有完成，所有的投注将会被视为无效。",
                    
                        "ART_ru_darts_u": "最高决胜镖：大/小 X",
                        "ART_ru_darts_u_1": "预测赛事的最高决胜镖是大于或小于指定的大/小。 这个最高决胜镖可能会是170。",
                        "ART_ru_darts_u_2": "如果一个选手的名字不在市场名单里面，结果将是基于双方选手的决胜镖记录结算。",
                        "ART_ru_darts_u_3": "如果选手的名字包含在市场名单里面，这个结果将会基于特定选手的最高决胜镖。",
                        "ART_ru_darts_u_4": "如果赛事没有完成，那么所有的赌注将是无效的，除非赛事已有明确结果。",
                    
                        "ART_ru_darts_v": "最高决胜镖：大/小 （X－X）",
                        "ART_ru_darts_v_1": "预测赛事中的最高决胜镖是在数值范围之间或最高决胜镖是高于或低于该数值范围。这个最高决胜镖可能会是170。",
                        "ART_ru_darts_v_2": "如果一个选手的名字不在市场名单里面，结果将是基于双方选手的决胜镖记录结算。",
                        "ART_ru_darts_v_3": "如果选手的名字是包含在市场名单里面，结果将会以特定选手的最高决胜镖结算。",
                        "ART_ru_darts_v_4": "如果赛事没有完成，那么所有的赌注将是无效的，除非赛事已有明确结果。",
                    
                        "ART_ru_darts_w": "决胜镖颜色",
                        "ART_ru_darts_w_1": "预测在赛事特定期间的决胜镖颜色（例如：最后一镖）。",
                        "ART_ru_darts_w_2": "如果比赛是以“局”为基础的，那么这个市场的提供将会以特定的局为基准。",
                        "ART_ru_darts_w_3": "如果比赛是以“盘”为基础的，那么这个市场的提供将会以这一盘的特定局为基准。",
                        "ART_ru_darts_w_4": "所提供的选择永远是“红色”或“绿色”。",
                        "ART_ru_darts_w_5": "如果特定局没有完成，所有的投注将会被视为无效。",
                        ';
                        break;
                }
                break;
            case "e_sports":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_rules_esports": "電子競技",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "08/01/2021",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_esports_a_1": "如果比賽在官方原定時間之前開始，在比賽開始後的所有注單將被視為無效，滾球投注除外。",
                        "ART_ru_esports_a_2": "如果地圖/回合的數量和該投注市場所顯示的不一致，則所有投注將被視為無效.",
                        "ART_ru_esports_a_3": "如果一個隊伍使用已知的暱稱並且和至少一個官方玩家進行比賽，所有的投注將被視為有效。",
                        "ART_ru_esports_a_4": "如果一個或兩個隊伍有較少隊員進行比賽，所有的投注將被視為有效。",
                        "ART_ru_esports_a_5": "如果比賽出現選手退賽或被取消資格，則所有投注將被視為無效，除非在個別投注類型規則中有明確說明。",
                        "ART_ru_esports_a_6": "如果比賽被重制，投注將根據官方結果進行結算。",
                        "ART_ru_esports_a_7": "比賽結果將在賽事結束時判定。在比賽結束後更改的結果將不被認可。",
                    
                        "ART_ru_bettype": "投注類型",
                        "ART_ru_esports_b": "獨贏",
                        "ART_ru_esports_b_1": "預測誰將會贏得這場比賽或指定的比賽/地圖。任何形式的加時或補時都將計算在內。",
                        "ART_ru_esports_b_2": "一旦指定的比賽/地圖完成，所有的投注將被視為有效。",
                    
                        "ART_ru_esports_c": "讓分",
                        "ART_ru_esports_c_1": "預測誰將會贏得這場比賽或指定的比賽/地圖。任何形式的加時或補時都將計算在內。",
                        "ART_ru_esports_c_2": "在電子競技比賽中的讓分可適用於地圖/回合/擊殺或其他計算方式。",
                    
                        "ART_ru_esports_d": "大/小",
                        "ART_ru_esports_d_1": "預測比賽中地圖/回合/擊殺或其他計算方式的總數是否大於或小於盤口數，任何形式的加時或補時都將計算在內。",
                        "ART_ru_esports_d_2": "如果比賽出現被取消資格或選手退賽，只有在市場在無條件確定結果的情況下才可結算大/小投注。在所有其他情況下，投注將被視為無效。",
                    
                        "ART_ru_esports_e": "滾球",
                        "ART_ru_esports_e_1": "結算是以0-0的比分在比賽結束後按盤口開出的讓回合或地圖數做裁決.投注當時的比分對結算沒有影響。",
                    
                        "ART_ru_esports_f": "加注/特別投注",
                        "ART_ru_esports_f_1": "如果比賽出現被取消資格或選手退賽，一旦有賽果，投注將被視為有效。",
                        "ART_ru_esports_f_2": "如果比賽被重新進行，投注將根據官方結果進行結算。",
                    
                        "ART_ru_livegame": "遊戲直播盤口規則",
                    
                        "ART_ru_esports_g": "一般規則",
                        "ART_ru_esports_g_1": "所有盤口將以協調世界時間 (UTC) 為準。",
                        "ART_ru_esports_g_2": "直播數據根據玩家遊戲中註冊的遊戲名進行記錄，而非直播ID名稱。",
                        "ART_ru_esports_g_3": "基於投注目的，遊戲回合排序23:59 (UTC) 之後重新安排。",
                        "ART_ru_esports_g_4": "遊戲編號涵蓋當天所有直播過的遊戲，且包含以下所有遊戲模式。",
                        "ART_ru_esports_g_5": "每場電子競技僅預定遊戲模式將計算在內。",
                        "ART_ru_esports_g_6": "具體規則將適用於每項電子競技。 ",
                    
                        "ART_ru_esports_h": "絕地求生",
                        "ART_ru_esports_h_1": "單人,雙人或四人遊戲將計算在內。",
                        "ART_ru_esports_h_2": "玩家擊殺數僅包括在單人模式下獲得的擊殺.雙人或四人模式下的擊殺將不計算在內。",
                        "ART_ru_esports_h_3": "玩家在多人模式排位盤口將以團隊排位為準。",
                    
                        "ART_ru_esports_i": "英雄聯盟(LOL)",
                        "ART_ru_esports_i_1": "僅單挑或隊列排位賽將計算在內。",
                        "ART_ru_esports_i_2": "在以下情況下投注將被視為無效：",
                        "ART_ru_esports_i_2_1": "玩家在遊戲結束之前退出。",
                        "ART_ru_esports_i_2_2": "遊戲時長少於5分鐘。",
                        "ART_ru_esports_i_2_3": "玩家邀請朋友參加單挑或隊列排位賽。",
                        "ART_ru_esports_i_3": "玩家擊殺數，死亡數和助攻數僅包括由玩家在單人模式下獲得。",
                        "ART_ru_esports_i_4": "KDA盤口，玩家KDA公式是(殺人數+助攻數)/死亡數。如果玩家在遊戲中沒有任何死亡數，玩家的KDA計算公式以殺人數與助攻數兩數相加。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_rules_esports": "E-SPORTS",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "08/01/2021",
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_esports_a_1": "If a match begins before the official scheduled time, all the bets placed after the match has started will be considered void, except for In-Play bets.",
                        "ART_ru_esports_a_2": "If the number of maps / rounds played is different from what is stated in the respective betting market, all bets will be considered void.",
                        "ART_ru_esports_a_3": "If a team uses a known alias to compete & play with at least one official player, all bets will stand.",
                        "ART_ru_esports_a_4": "If a match is played with lesser player on either or both teams, all bets will stand.",
                        "ART_ru_esports_a_5": "In the event of a walkover or disqualification, all bets will be considered void, unless explicitly stated in the individual Bet Type rules.",
                        "ART_ru_esports_a_6": "In the event of a “Re-make” or “Re-creation”, bets will be settled based on the official result. ",
                        "ART_ru_esports_a_7": "The result of an event will be determined at the time of conclusion. For betting purposes, overturned decisions will not be recognized after a match is concluded.",
                    
                        "ART_ru_bettype": "BET TYPES",
                        "ART_ru_esports_b": "Winner",
                        "ART_ru_esports_b_1": "Predict who will win the match or specified Game/ Map. Any form of extra time or overtime will count for settlement purposes.",
                        "ART_ru_esports_b_2": "Bets will stand once the specified Game/ Map has been completed.",
                    
                        "ART_ru_esports_c": "Handicap",
                        "ART_ru_esports_c_1": "Predict who will win with the indicated Handicap applied. Any form of extra time or overtime will count for settlement purposes.",
                        "ART_ru_esports_c_2": "The Handicap in an eSports match can apply to Maps / Rounds/ Kills or other counting measures specified.",
                    
                        "ART_ru_esports_d": "Over / Under",
                        "ART_ru_esports_d_1": "Predict whether the total number of Maps / Rounds/ Kills or other counting measures specified will be over or under the indicated line. Any form of extra time or overtime will count for settlement purposes.",
                        "ART_ru_esports_d_2": "In the event of Disqualification or Walkover, Over / Under bets will only be settled when the market has been unconditionally determined. In all other scenarios, bets will be considered void.",
                    
                        "ART_ru_esports_e": "In-Play",
                        "ART_ru_esports_e_1": "Settlement is based on the final score line after the handicap is applied to a 0-0 score line. The current score, at the time of bet placement, is not factored into the bet.",
                    
                        "ART_ru_esports_f": "Proposition / Specials",
                        "ART_ru_esports_f_1": "In the event of a Disqualification or Walkover, bets will stand once an event has occurred.",
                        "ART_ru_esports_f_2": "In the event of a “Re-make” or “Re-creation”, bets will be settled based on the official result.",
                    
                        "ART_ru_livegame": "Stream Based Betting Rules",
                    
                        "ART_ru_esports_g": "General Rules",
                        "ART_ru_esports_g_1": "These markets will be settled using data recorded in Coordinated Universal Time (UTC).",
                        "ART_ru_esports_g_2": "Data recorded for each streamer is based on their registered in-game name, not their streamer ID.",
                        "ART_ru_esports_g_3": "For betting purposes, the game number sequence will restart (from one) after 23:59 UTC.",
                        "ART_ru_esports_g_4": "The game number includes all games played by the streamer that day, irrespective of the game mode played.",
                        "ART_ru_esports_g_5": "Only predefined game modes per eSport will be counted.",
                        "ART_ru_esports_g_6": "Specific rules for each eSport will be followed.",
                    
                        "ART_ru_esports_h": "PlayerUnknown’s Battlegrounds (PUBG)",
                        "ART_ru_esports_h_1": "Single, Duo and Squad games will be counted.",
                        "ART_ru_esports_h_2": "Recorded kills will only include those singularly achieved by the streamer. It will not include kills recorded as part of duo or squad games.",
                        "ART_ru_esports_h_3": "For duo or squad games, the final match standing will be determined by team performance.",
                    
                        "ART_ru_esports_i": "League of Legends (LOL)",
                        "ART_ru_esports_i_1": "Only Ranked Solo/Duo Queue games will be counted.",
                        "ART_ru_esports_i_2": "The game will be voided if:",
                        "ART_ru_esports_i_2_1": "Streamer quits before the match ends.",
                        "ART_ru_esports_i_2_2": "Game duration is less than 5 minutes.",
                        "ART_ru_esports_i_2_3": "Streamer invites a friend on Ranked Solo/Duo games",
                        "ART_ru_esports_i_3": "Streamer Kills, Deaths, and Assists will only include those singularly achieved by the streamer.",
                        "ART_ru_esports_i_4": "For KDA markets, Streamer KDA is defined as (Kills + Assists) / Deaths. If the streamer did not die at any point in the game, his KDA is computed as Kills + Assists.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_rules_esports": "电子竞技",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "08/01/2021",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_esports_a_1": "如果比赛在官方原定时间之前开始，在比赛开始后的所有注单将被视为无效，滚球投注除外。",
                        "ART_ru_esports_a_2": "如果地图/回合的数量和该投注市场所显示的不一致，则所有投注将被视为无效.",
                        "ART_ru_esports_a_3": "如果一个队伍使用已知的昵称并且和至少一个官方玩家进行比赛，所有的投注将被视为有效。",
                        "ART_ru_esports_a_4": "如果一个或两个队伍有较少队员进行比赛，所有的投注将被视为有效。",
                        "ART_ru_esports_a_5": "如果比赛出现选手退赛或被取消资格，则所有投注将被视为无效，除非在个别投注类型规则中有明确说明。",
                        "ART_ru_esports_a_6": "如果比赛被重制，投注将根据官方结果进行结算。",
                        "ART_ru_esports_a_7": "比赛结果将在赛事结束时判定。在比赛结束后更改的结果将不被认可。",
                    
                        "ART_ru_bettype": "投注类型",
                        "ART_ru_esports_b": "独赢",
                        "ART_ru_esports_b_1": "预测谁将会赢得这场比赛或指定的比赛/地图。任何形式的加时或补时都将计算在内。",
                        "ART_ru_esports_b_2": "一旦指定的比赛/地图完成，所有的投注将被视为有效。",
                    
                        "ART_ru_esports_c": "让分",
                        "ART_ru_esports_c_1": "预测谁将会赢得这场比赛或指定的比赛/地图。任何形式的加时或补时都将计算在内。",
                        "ART_ru_esports_c_2": "在电子竞技比赛中的让分可适用于地图/回合/击杀或其他计算方式。",
                    
                        "ART_ru_esports_d": "大/小",
                        "ART_ru_esports_d_1": "预测比赛中地图/回合/击杀或其他计算方式的总数是否大于或小于盘口数，任何形式的加时或补时都将计算在内。",
                        "ART_ru_esports_d_2": "如果比赛出现被取消资格或选手退赛，只有在市场在无条件确定结果的情况下才可结算大/小投注。在所有其他情况下，投注将被视为无效。",
                    
                        "ART_ru_esports_e": "滚球",
                        "ART_ru_esports_e_1": "结算是以0-0的比分在比赛结束后按盘口开出的让回合或地图数做裁决.投注当时的比分对结算没有影响。",
                    
                        "ART_ru_esports_f": "加注/特别投注",
                        "ART_ru_esports_f_1": "如果比赛出现被取消资格或选手退赛，一旦有赛果，投注将被视为有效。",
                        "ART_ru_esports_f_2": "如果比赛被重新进行，投注将根据官方结果进行结算。",
                    
                        "ART_ru_livegame": "游戏直播盘口规则",
                    
                        "ART_ru_esports_g": "一般规则",
                        "ART_ru_esports_g_1": "所有盘口将以协调世界时间 (UTC) 为准。",
                        "ART_ru_esports_g_2": "直播数据根据玩家游戏中注册的游戏名进行记录，而非直播ID名称。",
                        "ART_ru_esports_g_3": "基于投注目的，游戏回合排序23:59 (UTC) 之后重新安排。",
                        "ART_ru_esports_g_4": "游戏编号涵盖当天所有直播过的游戏，且包含以下所有游戏模式。",
                        "ART_ru_esports_g_5": "每场电子竞技仅预定游戏模式将计算在内。",
                        "ART_ru_esports_g_6": "具体规则将适用于每项电子竞技。",
                    
                        "ART_ru_esports_h": "绝地求生",
                        "ART_ru_esports_h_1": "单人,双人或四人游戏将计算在内。",
                        "ART_ru_esports_h_2": "玩家击杀数仅包括在单人模式下获得的击杀.双人或四人模式下的击杀将不计算在内。",
                        "ART_ru_esports_h_3": "玩家在多人模式排位盘口将以团队排位为准。",
                    
                        "ART_ru_esports_i": "英雄联盟(LOL)",
                        "ART_ru_esports_i_1": "仅单挑或队列排位赛将计算在内。",
                        "ART_ru_esports_i_2": "在以下情況下投注将被视为无效：",
                        "ART_ru_esports_i_2_1": "玩家在游戏结束之前退出。",
                        "ART_ru_esports_i_2_2": "游戏时长少于5分钟。",
                        "ART_ru_esports_i_2_3": "玩家邀请朋友参加单挑或队列排位赛。",
                        "ART_ru_esports_i_3": "玩家击杀数，死亡数和助攻数仅包括由玩家在单人模式下获得。",
                        "ART_ru_esports_i_4": "KDA盘口，玩家KDA公式是(杀人数+助攻数)/死亡数。如果玩家在游戏中没有任何死亡数，玩家的KDA计算公式以杀人数与助攻数两数相加。",
                        ';
                        break;
                }
                break;
            case "field_hockey":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_fh": "曲棍球",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "05/03/2015",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_fh_a_1": "戶外曲棍球投注皆以完場4節 X 15 分鐘為准。",
                        "ART_ru_fh_a_2": "上半場投注將會根據前2節的賽果結算（例如：30分鐘包含傷停補時）投注上半場所有種類注單，均以上半場球賽結果為准（30 分鐘, 包括傷停時間）。",
                        "ART_ru_fh_a_3": "室內曲棍球投注皆以2半場 X 20 分鐘為准。",
                        "ART_ru_fh_a_4": "上半場投注將會根據第一半場的結果結算（例如：20分鐘包含傷停補時）",
                        "ART_ru_fh_a_5": "單節/半場的投注，必須在比賽賽節完成後注單才被視為有效",
                        "ART_ru_fh_a_6": "如果提前開賽，只有在開賽之前投注的注單將為視為有效投注。 在開賽後投注的注單將被視為無效，這裡不包括滾球投注類型。",
                        "ART_ru_fh_a_7": "除了在有特別說明的情況下,加時賽並不計算在內。",
                    
                        "ART_ru_bettype": "投注類型",
                    
                        "ART_ru_fh_b": "獨贏",
                        "ART_ru_fh_b_1": "預測哪一隊將贏取比賽事/賽節的勝利，此投注包含雙方球隊以及平局。",
                    
                        "ART_ru_fh_c": "讓球",
                        "ART_ru_fh_c_1": "預測哪一方將獲得讓球比賽/賽節的勝利。",
                    
                        "ART_ru_fh_d": "滾球讓球",
                        "ART_ru_fh_d_1": "預測哪一方將在讓球盤比賽/賽節的勝利。",
                    
                        "ART_ru_fh_e": "大/小(球)",
                        "ART_ru_fh_e_1": "預測賽事總進球數將大於或小於指定的賽事/賽節盤口。",
                        "ART_ru_fh_e_2": "如果賽事取消，大小球投注會賽事已經確認任何潛在因素並不會影響最總注單結果情況下結算。其他情況下，注單將一律取消。",
                    
                        "ART_ru_fh_f": "滾球大/小（球）",
                        "ART_ru_fh_f_1": "預測總進球數將大於或小於指定的賽事/賽節盤口。",
                    
                        "ART_ru_fh_g": "單/雙",
                        "ART_ru_fh_g_1": "預測賽事的總進球數是單數或雙數。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_fh": "FIELD HOCKEY",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "13/07/2016",
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_fh_a_1": "Outdoor Field Hockey bets will be settled on the basis of 4 X 15 minute periods.",
                        "ART_ru_fh_a_2": "First Half bets will be settled on the score at the end of Period 2 (i.e. \"30 minutes\" inc. stoppage time)",
                        "ART_ru_fh_a_3": "Indoor Field Hockey bets will be settled on the basis of 2 X 20 minute halves.",
                        "ART_ru_fh_a_4": "First Half bets will be settled on the score at the end of 1st Half (i.e. \"20 minutes\" inc. stoppage time)",
                        "ART_ru_fh_a_5": "For Quarter / Half betting, the period must be completed for bets to be valid.",
                        "ART_ru_fh_a_6": "If the match starts before the scheduled time, only bets placed before the match commenced will be considered valid. Bets placed after the match commenced will be considered void. This excludes In-Play bet types.",
                        "ART_ru_fh_a_7": "Overtime does not count unless otherwise stated.",
                    
                        "ART_ru_bettype": "BET TYPES",
                    
                        "ART_ru_fh_b": "1 X 2",
                        "ART_ru_fh_b_1": "Predict who will win the match / period. This market will contain the two teams and the draw as betting selections.",
                    
                        "ART_ru_fh_c": "Handicap",
                        "ART_ru_fh_c_1": "Predict who will win the match / period with the indicated handicap applied.",
                    
                        "ART_ru_fh_d": "Handicap (In-Play)",
                        "ART_ru_fh_d_1": "Predict who will win the match / period with the indicated handicap applied.",
                    
                        "ART_ru_fh_e": "Over / Under",
                        "ART_ru_fh_e_1": "Predict whether the total number of goals scored will be over or under the indicated total line for the match/ period.",
                        "ART_ru_fh_e_2": "If a match is abandoned, Over / Under bets will only be settled when the market has been unconditionally determined as any further potential goals have no affect on the market result. In all other scenarios, bets will be considered void.",
                    
                        "ART_ru_fh_f": "Over / Under (In-Play)",
                        "ART_ru_fh_f_1": "Predict whether the total number of goals scored will be over or under the indicated total line for the game/ period.",
                    
                        "ART_ru_fh_g": "Odd / Even",
                        "ART_ru_fh_g_1": "Predict whether the total number of goals scored will be odd or even.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_fh": "曲棍球",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "05/03/2015",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_fh_a_1": "户外曲棍球投注皆以完场4节 X 15 分钟为准。",
                        "ART_ru_fh_a_2": "上半场投注将会根据前2节的赛果结算（例如：30分钟包含伤停补时）投注上半场所有种类注单，均以上半场球赛结果为准（30 分钟, 包括伤停时间）。",
                        "ART_ru_fh_a_3": "室内曲棍球投注皆以2半场 X 20 分钟为准。",
                        "ART_ru_fh_a_4": "上半场投注将会根据第一半场的结果结算（例如：20分钟包含伤停补时）",
                        "ART_ru_fh_a_5": "单节/半场的投注，必须在比赛赛节完成后注单才被视为有效",
                        "ART_ru_fh_a_6": "如果提前开赛，只有在开赛之前投注的注单将为视为有效投注。 在开赛后投注的注单将被视为无效，这里不包括滚球投注类型。",
                        "ART_ru_fh_a_7": "除了在有特别说明的情况下,加时赛并不计算在内。",
                    
                        "ART_ru_bettype": "投注类型",
                    
                        "ART_ru_fh_b": "独赢",
                        "ART_ru_fh_b_1": "预测哪一队将赢取比赛事/赛节的胜利，此投注包含双方球队以及平局。",
                    
                        "ART_ru_fh_c": "让球",
                        "ART_ru_fh_c_1": "预测哪一方将获得让球比赛/赛节的胜利。",
                    
                        "ART_ru_fh_d": "滚球让球",
                        "ART_ru_fh_d_1": "预测哪一方将在让球盘比赛/赛节的胜利。",
                    
                        "ART_ru_fh_e": "大/小(球)",
                        "ART_ru_fh_e_1": "预测赛事总进球数将大于或小于指定的赛事/赛节盘口。",
                        "ART_ru_fh_e_2": "如果赛事取消，大小球投注会赛事已经确认任何潜在因素并不会影响最总注单结果情况下结算。其他情况下，注单将一律取消。",
                    
                        "ART_ru_fh_f": "滚球大/小（球）",
                        "ART_ru_fh_f_1": "预测总进球数将大于或小于指定的赛事/赛节盘口。",
                    
                        "ART_ru_fh_g": "单/双",
                        "ART_ru_fh_g_1": "预测赛事的总进球数是单数或双数。",
                        ';
                        break;
                }
                break;
            case "financial_bets":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_financial_bets": "金融投注",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "20/04/2020",
                        "ART_ru_rule": "一般規則",
                    
                        "ART_ru_financial_a_1": "金融投注是以預測金融市場收市價的數字作為投注的基礎。投注項目包括單/雙/較高及較低投注，但小數點後數字不包括在內。",
                        "ART_ru_financial_a_2": "最後的結果會根據官方的金融市場網站公佈為準。",
                        "ART_ru_financial_a_3": "投注結果以收市價的整位數目為準，但結果不包括小數位數目 。",
                        "ART_ru_financial_a_4": "投注時間是於官方金融市場收市時間的一小時前關閉。",
                        "ART_ru_financial_a_5": "如當天官方金融市場提早收市，所有於收市前一小時內的投注作廢。",
                        "ART_ru_financial_a_6": "如果在特定日期金融市場並未開盤，所有當日注單一律無效並取消。",
                        "ART_ru_financial_a_7": "因為市場暫停或因價格變動超過限制而限制交投，任何原因影響市場中斷，本公司經過慎重的考慮有權在通知或沒通知的情況下關閉、開盤、拒絶或取消任何投注。",
                        "ART_ru_financial_a_8": "單雙的定義如下:",
                    
                        "ART_ru_financial_a_8_1": "\"單\"的定義為所有數目的最後數字為1、3、5、7、9。",
                        "ART_ru_financial_a_8_2": "\"雙\"的定義為所有數目的最後數字為0、2、4、6、8。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_financial_bets": "FINANCIAL BETS",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "20/04/2020",

                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_financial_a_1": "Our Financial Bets allow members to predict the exact last digit of the closing indexes around the Asia markets. This includes Odd / Even and Higher / Lower selections, without decimal places.",
                        "ART_ru_financial_a_2": "The final results and settlement will be governed by the respective stock markets\' official websites.",
                        "ART_ru_financial_a_3": "The final result will be the last digit of the closing index in a whole number. Decimals do not count.",
                        "ART_ru_financial_a_4": "The bet types shall close one hour or earlier before the official market closing time.",
                        "ART_ru_financial_a_5": "In the event of a market closing early for that day, irrespective of the circumstances, all bets placed in the hour before an unscheduled market closed will be deemed void.",
                        "ART_ru_financial_a_6": "In the event that the market is not opened for the specific day, all bets placed on that market for the day will be considered void.",
                        "ART_ru_financial_a_7": "If any event disrupts the market, including the suspension of or limitation of trading by reason of movements in price exceeding limits permitted by the relevant exchange or any other event causing market disruption, the company may in its absolute discretion with or without notice to you close any or all open bets, refuse any bets, cancel any orders and fill any orders in each case at such level as it may consider in good faith to be appropriate in all the circumstances.",
                        "ART_ru_financial_a_8": "The definition of Odd and Even is as follow:",

                        "ART_ru_financial_a_8_1": "Any number ending with 1, 3, 5, 7, 9 is Odd.",
                        "ART_ru_financial_a_8_2": "Any number ending with 0, 2, 4, 6, 8 is Even.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_financial_bets": "金融投注",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "20/04/2020",
                        "ART_ru_rule": "一般规则",
                    
                        "ART_ru_financial_a_1": "金融投注是以预测金融市场收市价的数字作为投注的基础。投注项目包括单/双/较高及较低投注，但小数点后数字不包括在内。",
                        "ART_ru_financial_a_2": "最后的结果会根据官方的金融市场网站公布为准。",
                        "ART_ru_financial_a_3": "投注结果以收市价的整位数目为准，但结果不包括小数位数目 。",
                        "ART_ru_financial_a_4": "投注时间是于官方金融市场收市时间的一小时前关闭。",
                        "ART_ru_financial_a_5": "如当天官方金融市场提早收市，所有于收市前一小时内的投注作废。",
                        "ART_ru_financial_a_6": "如果在特定日期金融市场并未开盘，所有当日注单一律无效并取消。",
                        "ART_ru_financial_a_7": "因为市场暂停或因价格变动超过限制而限制交投，任何原因影响市场中断，本公司经过慎重的考虑有权在通知或没通知的情况下关闭、开盘、拒绝或取消任何投注。",
                        "ART_ru_financial_a_8": "单双的定义如下:",
                    
                        "ART_ru_financial_a_8_1": "\"单\"的定义为所有数目的最后数字为1、3、5、7、9。",
                        "ART_ru_financial_a_8_2": "\"双\"的定义为所有数目的最后数字为0、2、4、6、8。",
                        ';
                        break;
                }
                break;
            case "futsal":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_futsal": "室內足球",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "21/09/2016",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_futsal_a_1": "如果比賽場地有變更，所有註單將被取消。 ",
                        "ART_ru_futsal_a_2": "所有投注的結算皆以全場40分鐘完場時間後的最終賽果為準。",
                        "ART_ru_futsal_a_3": "除非另有注明，所有室內足球投注的結算皆以球賽下半場（每半場20分鐘）完賽後的最終賽果為準。",
                        "ART_ru_futsal_a_4": "如比賽在法定時間提前進行，在比賽開始前的投注依然有效，在比賽開始後的所有投注均視為無效(滾球投注另作別論)。",
                    
                        "ART_ru_bettype": "投注類型",
                        "ART_ru_futsal_b": "獨贏",
                        "ART_ru_futsal_b_1": "預測哪一支球隊將在比賽勝出。盤口提供兩支球隊和平局為投注選項。",
                    
                        "ART_ru_futsal_c": "讓球",
                        "ART_ru_futsal_c_1": "預測哪一支球隊在盤口指定的讓球數贏得某個時節或全場比賽。",
                    
                        "ART_ru_futsal_d": "滾球讓球",
                        "ART_ru_futsal_d_1": "預測哪一支球隊在盤口指定的讓球數贏得某個時節或全場比賽。",
                        "ART_ru_futsal_d_2": "結算是以投注時到比賽/時節結束後的賽果做裁決。即是以賽事完場比分減去投注當時的比分。",
                    
                        "ART_ru_futsal_e": "大/小",
                        "ART_ru_futsal_e_1": "預測賽事總入球數將大於或小於在盤口指定的大/小盤球數。",
                        "ART_ru_futsal_e_2": "如果賽事中斷前已有明確結果並且之後沒有任何顯著會影響賽事結果的情況，大/小盤注單才會被結算。若遇到任何其他情況，注單將一律被取消。",
                    
                        "ART_ru_futsal_f": "滾球大/小",
                        "ART_ru_futsal_f_1": "預測賽事總入球數將大於或小於在盤口指定的大/小盤球數。",
                        "ART_ru_futsal_f_2": "結算是以比賽/時節結束後的總入球數做裁決。投注當時，賽事的比分將視為0-0來計算。",
                    
                        "ART_ru_futsal_g": "單/雙",
                        "ART_ru_futsal_g_1": "預測賽事的總入球數是單數或雙數。",
                    
                        "ART_ru_futsal_h": "最先得分球隊",
                        "ART_ru_futsal_h_1": "預測最先進球的球隊。",
                        "ART_ru_futsal_h_2": "如果賽事在有進球後中斷，所有最先進球球隊的注單將保持有效。",
                        "ART_ru_futsal_h_3": "如果賽事在沒有球隊進球前中斷，所有最先進球球隊的注單將被取消。",
                        "ART_ru_futsal_h_4": "如果賽事在兩個半場結束後沒有球隊進球，所有最先進球球隊的注單將被取消。",
                    
                        "ART_ru_futsal_i": "最後得分球隊",
                        "ART_ru_futsal_i_1": "預測最後進球的球隊。",
                        "ART_ru_futsal_i_2": "如果賽事中斷，所有最後進球球隊的注單將被取消。",
                        "ART_ru_futsal_i_3": "如果賽事在兩個半場結束後沒有球隊進球，所有最後進球球隊的注單將被取消。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_futsal": "FUTSAL",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "21/09/2016",
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_futsal_a_1": "If the scheduled venue is changed, all bets will be considered void.",
                        "ART_ru_futsal_a_2": "All markets are settled after the full 40 minutes is played.",
                        "ART_ru_futsal_a_3": "All Futsal bets are settled based on the result at the end of 2 Halves (20 minutes each), unless otherwise stated.",
                        "ART_ru_futsal_a_4": "If the game starts before the scheduled time, only bets placed before the game commenced will be considered valid. Bets placed after the game commenced will be considered void. This excludes In-Play bet types.",
                    
                        "ART_ru_bettype": "BET TYPES",
                        "ART_ru_futsal_b": "1 X 2",
                        "ART_ru_futsal_b_1": "Predict who will win the game. This market will contain the two teams and the draw as betting selections.",
                    
                        "ART_ru_futsal_c": "Handicap",
                        "ART_ru_futsal_c_1": "Predict who will win the game / period with the indicated handicap applied.",
                    
                        "ART_ru_futsal_d": "Handicap (In-Play)",
                        "ART_ru_futsal_d_1": "Predict who will win the match / period with the indicated handicap applied.",
                        "ART_ru_futsal_d_2": "Settlement is based on the scoreline, from when the bet was placed to the end of the match / period - i.e. the final score minus the current score of the match.",
                    
                        "ART_ru_futsal_e": "Over / Under",
                        "ART_ru_futsal_e_1": "Predict whether the total number of goals scored will be over or under the indicated total line.",
                        "ART_ru_futsal_e_2": "If a game is abandoned, Over / Under bets will only be settled when the market has been unconditionally determined as any further potential points have no affect on the market result. In all other scenarios, bets will be considered void.",
                    
                        "ART_ru_futsal_f": "Over / Under (In-Play)",
                        "ART_ru_futsal_f_1": "Predict whether the total number of goals scored will be over or under the indicated total line.",
                        "ART_ru_futsal_f_2": "Settlement is based on the final score line and the total line as applied to a 0-0 score line.",
                    
                        "ART_ru_futsal_g": "Odd / Even",
                        "ART_ru_futsal_g_1": "Predict whether the total number of goals scored will be odd or even.",
                    
                        "ART_ru_futsal_h": "Team to Score First",
                        "ART_ru_futsal_h_1": "Predict which team will score first in the game.",
                        "ART_ru_futsal_h_2": "If the game is abandoned at any time, and a team has already been scored prior to the abandonment, all bets will stand.",
                        "ART_ru_futsal_h_3": "If neither team has scored at the time of abandonment, all bets are considered void.",
                        "ART_ru_futsal_h_4": "If neither team has scored after the scheduled 2 halves of normal play, then bets are considered void.",
                    
                        "ART_ru_futsal_i": "Team to Score Last",
                        "ART_ru_futsal_i_1": "Predict which team will score last in the game.",
                        "ART_ru_futsal_i_2": "If the game is abandoned at any time, then all bets will be considered void.",
                        "ART_ru_futsal_i_3": "If neither team has scored after the scheduled 2 halves of normal play, then bets are considered void.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_futsal": "室内足球",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "21/09/2016",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_futsal_a_1": "如果比赛场地有变更，所有注单将被取消。 ",
                        "ART_ru_futsal_a_2": "所有投注的结算皆以全场40分钟完场时间后的最终赛果为准。",
                        "ART_ru_futsal_a_3": "除非另有注明，所有室内足球投注的结算皆以球赛下半场（每半场20分钟）完赛后的最终赛果为准。",
                        "ART_ru_futsal_a_4": "如比赛在法定时间提前进行，在比赛开始前的投注依然有效，在比赛开始后的所有投注均视为无效(滚球投注另作别论)。",
                    
                        "ART_ru_bettype": "投注类型",
                        "ART_ru_futsal_b": "独赢",
                        "ART_ru_futsal_b_1": "预测哪一支球队将在比赛胜出。盘口提供两支球队和平局为投注选项。",
                    
                        "ART_ru_futsal_c": "让球",
                        "ART_ru_futsal_c_1": "预测哪一支球队在盘口指定的让球数赢得某个时节或全场比赛。",
                    
                        "ART_ru_futsal_d": "滚球让球",
                        "ART_ru_futsal_d_1": "预测哪一支球队在盘口指定的让球数赢得某个时节或全场比赛。",
                        "ART_ru_futsal_d_2": "结算是以投注时到比赛/时节结束后的赛果做裁决。即是以赛事完场比分减去投注当时的比分。",
                    
                        "ART_ru_futsal_e": "大/小",
                        "ART_ru_futsal_e_1": "预测赛事总入球数将大于或小于在盘口指定的大/小盘球数。",
                        "ART_ru_futsal_e_2": "如果赛事中断前已有明确结果并且之后没有任何显著会影响赛事结果的情况，大/小盘注单才会被结算。若遇到任何其他情况，注单将一律被取消。",
                    
                        "ART_ru_futsal_f": "滚球大/小",
                        "ART_ru_futsal_f_1": "预测赛事总入球数将大于或小于在盘口指定的大/小盘球数。",
                        "ART_ru_futsal_f_2": "结算是以比赛/时节结束后的总入球数做裁决。投注当时，赛事的比分将视为0-0来计算。",
                    
                        "ART_ru_futsal_g": "单/双",
                        "ART_ru_futsal_g_1": "预测赛事的总入球数是单数或双数。",
                    
                        "ART_ru_futsal_h": "最先得分球队",
                        "ART_ru_futsal_h_1": "预测最先进球的球队。",
                        "ART_ru_futsal_h_2": "如果赛事在有进球后中断，所有最先进球球队的注单将保持有效。",
                        "ART_ru_futsal_h_3": "如果赛事在没有球队进球前中断，所有最先进球球队的注单将被取消。",
                        "ART_ru_futsal_h_4": "如果赛事在两个半场结束后没有球队进球，所有最先进球球队的注单将被取消。",
                    
                        "ART_ru_futsal_i": "最后得分球队",
                        "ART_ru_futsal_i_1": "预测最后进球的球队。",
                        "ART_ru_futsal_i_2": "如果赛事中断，所有最后进球球队的注单将被取消。",
                        "ART_ru_futsal_i_3": "如果赛事在两个半场结束后没有球队进球，所有最后进球球队的注单将被取消。",
                        ';
                        break;
                }
                break;
            case "golf":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_golf": "高爾夫球",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "27/12/2019",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_golf_a_1": "如果比賽場地有更改，所有注單將被視為無效。",
                        "ART_ru_golf_a_2": "如果出現並列名次的情況，並列第一規則將運用於結算方式內。",
                        "ART_ru_golf_a_3": "如果錦標賽在法定比賽時間前結束並且已經頒奬，所有注單將視為有效。在比賽結束後投注的注單將被視為無效，除非之後繼續進行比賽並且對錦標賽的最終結果產生影響(淘汰賽/附加賽除外)。",
                    
                        "ART_ru_bettype": "投注類型",
                        "ART_ru_golf_b": "冠軍投注",
                        "ART_ru_golf_b_1": "預測哪位選手將會贏得錦標賽。",
                        "ART_ru_golf_b_2": "如果投注的選手在開始第一球前退出比賽, 這位選手所有注單將會被視為無效,這位選手所有注單將被取消和返還。",
                        "ART_ru_golf_b_3": "投注的選手在比賽開始後失去資格或退出比賽, 這位選手所有注單將會保持有效。",
                        "ART_ru_golf_b_4": "\"任何不在名單中的選手\"指的是所有不在冠軍盤口列出的選手。",
                        "ART_ru_golf_b_5": "所有冠軍盤投注的結算將以錦標賽的獲勝者為準，任何淘汰賽/附加賽也包括在內。",
                    
                        "ART_ru_golf_c": "配對賽 /2球/3球(18洞)",
                        "ART_ru_golf_c_1": "預測哪一位球員將以最少的桿數完成回合。 ",
                        "ART_ru_golf_c_2": "盤口將兩名球員配對在一起作為投注選項，但球員在實際比賽中未必是同組擊球。 ",
                        "ART_ru_golf_c_3": "優勝者則是以最少桿數打完18個洞的球​​員。 ",
                        "ART_ru_golf_c_4": "如果投注的球員沒有開始比賽，所有註單將被取消。",
                        "ART_ru_golf_c_5": "雙方球員都必須完成18個洞。如果球員中有協議或因受傷理由讓另一位球員提前結束比賽，所有的注單將被取消。 ",
                        "ART_ru_golf_c_6": "2球賽事，盤口將提供平局為投注選項。",
                        "ART_ru_golf_c_7": "3球賽事，盤口不提供平局為投注選項，若遇到打平的情況，並列第一規則的結算方式將運用於此。 ",
                    
                        "ART_ru_golf_d": "配對賽 /2球/3球(72洞/錦標賽配對投注)",
                        "ART_ru_golf_d_1": "預測哪一位球員將以最少的桿數完成錦標賽。",
                        "ART_ru_golf_d_2": "盤口將兩名球員配對在一起作為投注選項，但球員在實際比賽中未必是同組擊球。",
                        "ART_ru_golf_d_3": "優勝者是以最少桿數打完72個洞（淘汰賽/附加賽也包括在內）的選手。",
                        "ART_ru_golf_d_4": "如果投注的選手沒有從第一回合參與比賽，所有注單將被視為無效。",
                        "ART_ru_golf_d_5": "錦標賽配對投注兩方選手必須完成72個洞。如果球員中有協議或因受傷理由讓另一位球員提前結束比賽，所有的注單將會被視為無效。",
                        "ART_ru_golf_d_6": "2球賽事，盤口將提供平局投注選項。",
                        "ART_ru_golf_d_7": "3球賽事，盤口不提供平局為投注選項，若遇到打平的情況，並列第一規則的結算方式將運用於此。",
                    
                        "ART_ru_golf_e": "下一個洞的分數-單個選手市場",
                        "ART_ru_golf_e_1": "預測選手在下一個洞可以獲得的分數。（ 小鳥球或更好/ 標準桿/柏忌或更差 ）柏忌是指多標準桿數一桿。",
                        "ART_ru_golf_e_2": "如果投注的選手沒有參與投注球洞的擊球，所有的注單將會被視為無效。",
                        "ART_ru_golf_e_3": "一旦選手在規定的洞口開球，注單將被視為有效。如果玩家無法完成指定洞口（例如受傷離場），那麼將會獲取\"超過標準桿數\"奬勵。",
                        "ART_ru_golf_e_4": "投注的結算將依據相關機構（歐洲職業高爾夫球手協會）公佈的賽果為準。",
                    
                        "ART_ru_golf_f": "讓分盤",
                        "ART_ru_golf_f_1": "預測哪位選手將以最少的桿數完成回合或比賽。在比賽正式開始前， 一方選手已得到另一方讓的虛擬分數，在領先的情況下開始比賽。如果在考量盤口指定的讓分數後，雙方球員獲得同樣的分數，比賽結果將視為打平，所有注單將被返還。",
                    
                        "ART_ru_golf_g": "大/小盤（總比分）",
                        "ART_ru_golf_g_1": "預測雙方球員獲得的總比分將大於或小於在盤口指定的大/小盤分數。 ",
                        "ART_ru_golf_g_2": "如果賽事中斷，大/小盤將僅會結算任何將來的得分不會影響到賽果的注單。若遇到任何其它情況，注單將一律被視為無效。",
                    
                        "ART_ru_golf_h": "前5名/前10名",
                        "ART_ru_golf_h_1": "預測投注的球員是否會列入比賽的前5/10名優勝者。 ",
                        "ART_ru_golf_h_2": "並列第一規則的結算方式將運用於此盤口的注單。 ",
                        "ART_ru_golf_h_3": "投注的結算皆以法定比賽結束後的最終賽果為準。 ",
                    
                        "ART_ru_golf_i": "淨勝分數",
                        "ART_ru_golf_i_1": "預測冠軍和第二名優勝者在比賽結束後的桿數差別。 ",
                        "ART_ru_golf_i_2": "投注的結算皆以法定比賽結束後的最終賽果為準。 ",
                        "ART_ru_golf_i_3": "如果出現附加賽，附加賽的桿數將不計算為比賽的最終結果。 ",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_golf": "GOLF",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "27/12/2019",
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_golf_a_1": "If the scheduled venue is changed, all bets will be considered void.",
                        "ART_ru_golf_a_2": "Dead heat rules apply for settlement purposes.",
                        "ART_ru_golf_a_3": "If a tournament ends officially before the stipulated time and the trophy is awarded, all bets on the tournament are considered valid. Bets accepted after the play for the day has ended, are considered void, unless there is further play which contributes to the results of the tournament (playoffs not included).",
                        // "ART_ru_golf_a_4": "If a tournament is officially abandoned, all bets on the tournament are void, except markets that have already been decided.",
                    
                        "ART_ru_bettype": "BET TYPES",
                        "ART_ru_golf_b": "Outright",
                        "ART_ru_golf_b_1": "Predict who will win the tournament. Bets are settled based on which player is awarded the trophy.",
                        "ART_ru_golf_b_2": "Non-Runner no bet. If a player withdraws before teeing off in the first round, then all bets on this player will be void and the stake refunded.",
                        "ART_ru_golf_b_3": "A player is deemed to have started, once they have teed off. If a player later withdraws, retires or is disqualified, then all bets will be valid.",
                        "ART_ru_golf_b_4": "\"Any Other Player Not Listed\" refers to all golfers not named in the outright market. ",
                        "ART_ru_golf_b_5": "Outright markets are settled based on the tournament winner and any play-offs are taken into consideration in the final result.",
                    
                        "ART_ru_golf_c": "Head to Head / 2 Balls / 3 Balls (18 Holes)",
                        "ART_ru_golf_c_1": "Predict who will complete the round in the lowest score.",
                        "ART_ru_golf_c_2": "Players are paired for the purpose of the bet. They may or may not be playing together in the actual competition.",
                        "ART_ru_golf_c_3": "The winner will be the player with the lowest score over 18 holes.",
                        "ART_ru_golf_c_4": "If a player fails to start the round, all the bets will be considered void.",
                        "ART_ru_golf_c_5": "Both players must complete all 18 holes. If one of the players finishes early either by agreement of the players or through injury, all bets are considered void. ",
                        "ART_ru_golf_c_6": "For 2 Balls, the tie will be a betting selection. ",
                        "ART_ru_golf_c_7": "For 3 Balls, the tie will not be a betting selection. Instead, dead heat rules apply in the case of a tie.",
                    
                        "ART_ru_golf_d": "Head to Head / 2 Balls / 3 Balls (72 Holes / Tournament Match Bet)",
                        "ART_ru_golf_d_1": "Predict who will complete the tournament in the lowest score.",
                        "ART_ru_golf_d_2": "Players are paired for the purpose of the bet. They may or may not be playing together in the actual competition. ",
                        "ART_ru_golf_d_3": "The winner will be the player with the lowest score over 72 holes, including any playoff holes.",
                        "ART_ru_golf_d_4": "If a player fails to start the round, all the bets will be considered void.",
                        "ART_ru_golf_d_5": "Both players must complete all 72 holes. If one of the players finishes early either by agreement of the players or through injury, all bets are considered void.",
                        "ART_ru_golf_d_6": "For 2 Balls, the tie will be a betting selection.",
                        "ART_ru_golf_d_7": "For 3 Balls, the tie will not be a betting selection. Instead, dead heat rules apply in the case of a tie. ",
                    
                        "ART_ru_golf_e": "Next Hole Score - Single Player Market",
                        "ART_ru_golf_e_1": "Predict the Next Hole Score to be recorded by a given or selected player (Birdie or better / Par / Bogey or worse).",
                        "ART_ru_golf_e_2": "If a player fails to start the respective hole, then bets will be considered void.",
                        "ART_ru_golf_e_3": "Once the player has teed off for the stated hole, bets will be valid. If a player fails to finish the hole (injury withdrawal etc) then \'over-par\' score will be awarded.",
                        "ART_ru_golf_e_4": "Settlement will be based upon the official post-hole score as recorded by the relevant governing body (European Tour / PGA).",
                    
                        "ART_ru_golf_f": "Handicap",
                        "ART_ru_golf_f_1": "Predict who will complete the round / tournament in the lowest score. A virtual start is given to one player. If both players get the same scores after taking the handicap into consideration, it will be considered a tie. All stakes will then be returned.",
                    
                        "ART_ru_golf_g": "Over / Under (Score)",
                        "ART_ru_golf_g_1": "Predict whether the final score of both players will be over or under the indicated total line. ",
                        "ART_ru_golf_g_2": "In the case of abandonment, Over / Under bets will only be settled when the market has been unconditionally determined. In all other scenarios, bets will be considered void.",
                    
                        "ART_ru_golf_h": "Top 5 / 10 Finish",
                        "ART_ru_golf_h_1": "Predict if the player will finish in the top 5 / 10 in the specific tournament.",
                        "ART_ru_golf_h_2": "Dead-Heat rules apply. ",
                        "ART_ru_golf_h_3": "For betting purposes, bets will be settled at the end of the scheduled tournament.",
                    
                        "ART_ru_golf_i": "Winning Margin",
                        "ART_ru_golf_i_1": "Predict the difference in strokes between the winning player and the runner-up at the end of the tournament. ",
                        "ART_ru_golf_i_2": "For betting purposes, bets will be settled at the end of the scheduled tournament.",
                        "ART_ru_golf_i_3": "In the event of a playoff, results from the playoff will not be counted towards the final result.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_golf": "高尔夫球",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "27/12/2019",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_golf_a_1": "如果比赛场地有更改，所有注单将被视为无效。",
                        "ART_ru_golf_a_2": "如果出现并列名次的情况，并列第一规则将运用于结算方式内。",
                        "ART_ru_golf_a_3": "如果锦标赛在法定比赛时间前结束并且已经颁奖，所有注单将视为有效。在比赛结束后投注的注单将被视为无效，除非之后继续进行比赛并且对锦标赛的最终结果产生影响(淘汰赛/附加赛除外)。",
                    
                        "ART_ru_bettype": "投注类型",
                        "ART_ru_golf_b": "冠军投注",
                        "ART_ru_golf_b_1": "预测哪位选手将会赢得锦标赛。",
                        "ART_ru_golf_b_2": "如果投注的选手在开始第一球前退出比赛, 这位选手所有注单将会被视为无效,这位选手所有注单将被取消和返还。",
                        "ART_ru_golf_b_3": "投注的选手在比赛开始后失去资格或退出比赛, 这位选手所有注单将会保持有效。",
                        "ART_ru_golf_b_4": "\"任何不在名单中的选手\"指的是所有不在冠军盘口列出的选手。",
                        "ART_ru_golf_b_5": "所有冠军盘投注的结算将以锦标赛的获胜者为准，任何淘汰赛/附加赛也包括在内。",
                    
                        "ART_ru_golf_c": "配对赛 /2球/3球(18洞)",
                        "ART_ru_golf_c_1": "预测哪一位球员将以最少的杆数完成回合。 ",
                        "ART_ru_golf_c_2": "盘口将两名球员配对在一起作为投注选项，但球员在实际比赛中未必是同组击球。 ",
                        "ART_ru_golf_c_3": "优胜者则是以最少杆数打完18个洞的球​​员。 ",
                        "ART_ru_golf_c_4": "如果投注的球员没有开始比赛，所有注单将被取消。",
                        "ART_ru_golf_c_5": "双方球员都必须完成18个洞。如果球员中有协议或因受伤理由让另一位球员提前结束比赛，所有的注单将被取消。 ",
                        "ART_ru_golf_c_6": "2球赛事，盘口将提供平局为投注选项。",
                        "ART_ru_golf_c_7": "3球赛事，盘口不提供平局为投注选项，若遇到打平的情况，并列第一规则的结算方式将运用于此。 ",
                    
                        "ART_ru_golf_d": "配对赛 /2球/3球(72洞/锦标赛配对投注)",
                        "ART_ru_golf_d_1": "预测哪一位球员将以最少的杆数完成锦标赛。",
                        "ART_ru_golf_d_2": "盘口将两名球员配对在一起作为投注选项，但球员在实际比赛中未必是同组击球。",
                        "ART_ru_golf_d_3": "优胜者是以最少杆数打完72个洞（淘汰赛/附加赛也包括在内）的选手。",
                        "ART_ru_golf_d_4": "如果投注的选手没有从第一回合参与比赛，所有注单将被视为无效。",
                        "ART_ru_golf_d_5": "锦标赛配对投注两方选手必须完成72个洞。如果球员中有协议或因受伤理由让另一位球员提前结束比赛，所有的注单将会被视为无效。",
                        "ART_ru_golf_d_6": "2球赛事，盘口将提供平局投注选项。",
                        "ART_ru_golf_d_7": "3球赛事，盘口不提供平局为投注选项，若遇到打平的情况，并列第一规则的结算方式将运用于此。",
                    
                        "ART_ru_golf_e": "下一个洞的分数-单个选手市场",
                        "ART_ru_golf_e_1": "预测选手在下一个洞可以获得的分数。（ 小鸟球或更好/ 标准杆/柏忌或更差 ）柏忌是指多标准杆数一杆。",
                        "ART_ru_golf_e_2": "如果投注的选手没有参与投注球洞的击球，所有的注单将会被视为无效。",
                        "ART_ru_golf_e_3": "一旦选手在规定的洞口开球，注单将被视为有效。如果玩家无法完成指定洞口（例如受伤离场），那么将会获取\"超过标准杆数\"奖励。",
                        "ART_ru_golf_e_4": "投注的结算将依据相关机构（欧洲职业高尔夫球手协会）公布的赛果为准。",
                    
                        "ART_ru_golf_f": "让分盘",
                        "ART_ru_golf_f_1": "预测哪位选手将以最少的杆数完成回合或比赛。在比赛正式开始前， 一方选手已得到另一方让的虚拟分数，在领先的情况下开始比赛。如果在考量盘口指定的让分数后，双方球员获得同样的分数，比赛结果将视为打平，所有注单将被返还。",
                    
                        "ART_ru_golf_g": "大/小盘（总比分）",
                        "ART_ru_golf_g_1": "预测双方球员获得的总比分将大于或小于在盘口指定的大/小盘分数。 ",
                        "ART_ru_golf_g_2": "如果赛事中断，大/小盘将仅会结算任何将来的得分不会影响到赛果的注单。若遇到任何其它情况，注单将一律被视为无效。",
                    
                        "ART_ru_golf_h": "前5名/前10名",
                        "ART_ru_golf_h_1": "预测投注的球员是否会列入比赛的前5/10名优胜者。 ",
                        "ART_ru_golf_h_2": "并列第一规则的结算方式将运用于此盘口的注单。 ",
                        "ART_ru_golf_h_3": "投注的结算皆以法定比赛结束后的最终赛果为准。 ",
                    
                        "ART_ru_golf_i": "净胜分数",
                        "ART_ru_golf_i_1": "预测冠军和第二名优胜者在比赛结束后的杆数差别。 ",
                        "ART_ru_golf_i_2": "投注的结算皆以法定比赛结束后的最终赛果为准。 ",
                        "ART_ru_golf_i_3": "如果出现附加赛，附加赛的杆数将不计算为比赛的最终结果。 ",
                        ';
                        break;
                }
                break;
            case "gymnastics":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_gymnastics": "體操",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "04/03/2015",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_gymnastics_a_1": "參賽者獲得金，銀，銅牌將被視為第一，第二和第三名獲獎者。",
                        "ART_ru_gymnastics_a_2": "每場賽事的結果均以獎台上排名為最終結果。如之後發生喪失資格或結果修正將不予以計算。 ",
                        "ART_ru_gymnastics_a_3": "如投注的該選手有參與第一輪資格賽，所有註單都將視為有效。",
                        "ART_ru_gymnastics_a_4": "如投注的該選擇無參與第一輪資格賽，所有註單都將視為無效。",
                        "ART_ru_gymnastics_a_5": "如果比賽提前開賽，只有在開賽之前投注的注單將為視為有效投注。在開賽后投注的注單將被視為無效， 滾球玩法除外。",
                        "ART_ru_gymnastics_a_6": "即使該場賽事沒有舉行頒獎儀式，注單結果將依據F.I.G（國際體聯，或其他相應的權威機構）公佈的正式賽果而定。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_gymnastics": "GYMNASTICS",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "04/03/2015",
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_gymnastics_a_1": "For betting purposes, participants awarded Gold, Silver and Bronze at the medal ceremony will be deemed as the 1st, 2nd and 3rd place winner.",
                        "ART_ru_gymnastics_a_2": "Podium positions will count as the official results, regardless of any subsequent disqualification or amendment to the result. ",
                        "ART_ru_gymnastics_a_3": "Bets placed on participants competing in the first round qualifications will be considered valid.",
                        "ART_ru_gymnastics_a_4": "Bets placed on participants not competing in the first round qualifications will be considered void.",
                        "ART_ru_gymnastics_a_5": "If the event starts before the scheduled time, only bets placed before the event commenced will be considered valid. Bets placed after the event commenced will be considered void. This excludes In-Play bet types.",
                        "ART_ru_gymnastics_a_6": "Bets will be settled according to the official F.I.G result immediately at the end of the event, even in the absence of a medal ceremony.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_gymnastics": "体操",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "04/03/2015",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_gymnastics_a_1": "参赛者获得金，银，铜牌将被视为第一，第二和第三名获奖者。",
                        "ART_ru_gymnastics_a_2": "每场赛事的结果均以奖台上排名为最终结果。如之后发生丧失资格或结果修正将不予以计算。 ",
                        "ART_ru_gymnastics_a_3": "如投注的该选手有参与第一轮资格赛，所有注单都将视为有效。",
                        "ART_ru_gymnastics_a_4": "如投注的该选择无参与第一轮资格赛，所有注单都将视为无效。",
                        "ART_ru_gymnastics_a_5": "如果比赛提前开赛，只有在开赛之前投注的注单将为视为有效投注。在开赛后投注的注单将被视为无效， 滚球玩法除外。",
                        "ART_ru_gymnastics_a_6": "即使该场赛事没有举行颁奖仪式，注单结果将依据F.I.G（国际体联，或其他相应的权威机构）公布的正式赛果而定。",
                        ';
                        break;
                }
                break;
            case "handball":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_handball": "手球",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "17/10/2017",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_handball_a_1": "所有手球投註一律以六十分鐘的完場球賽賽果為準，除非另有特別說明，傷停補時計算在內。",
                        "ART_ru_handball_a_2": "如果比賽提前開賽，只有在開賽之前投注的注單被視為有效投注。在開賽之後投注的注單將被視為無效投注，滾球投注類型不包括在內。",
                        "ART_ru_handball_a_3": "對於任何使用“慈悲規則”的比賽, 所有投注將根據當時的結果來決定。",
                    
                        "ART_ru_bettype": "投注類型",
                        "ART_ru_handball_b": "獨贏",
                        "ART_ru_handball_b_1": "預測哪支球隊將贏得比賽，盤口將提供兩支球隊及平局作為投注選項。",
                    
                        "ART_ru_handball_c": "讓球",
                        "ART_ru_handball_c_1": "預測哪支球隊將獲得讓球比賽/賽節的勝利。",
                    
                        "ART_ru_handball_d": "滾球讓球",
                        "ART_ru_handball_d_1": "預測哪支球隊將獲得讓球比賽/賽節的勝利。",
                    
                        "ART_ru_handball_e": "大/小",
                        "ART_ru_handball_e_1": "預測賽事總進球數將大於或小於盤口分數。",
                    
                        "ART_ru_handball_f": "滾球大/小",
                        "ART_ru_handball_f_1": "預測賽事總進球數將大於或小於盤口分數。",
                        "ART_ru_handball_f_2": "如果賽事中斷前已有明確結果並且之後沒有任何顯著會影響賽事結果的情況，大小球投注的注單才會被結算。若遇到任何其他情況，注單將一律被取消。",
                        "ART_ru_handball_f_3": "滾球大小球比分以0-0開始計算，派彩是根據最終的比分為準。",
                    
                        "ART_ru_handball_g": "單/雙",
                        "ART_ru_handball_g_1": "預測賽事總進球數是單數或雙數。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_handball": "HANDBALL",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "17/10/2017",
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_handball_a_1": "Unless otherwise stated, all Handball bets will be settled based on the results of the full 60 minutes of play excluding overtime or penalty shootouts. This includes any additional stoppage time that maybe added at the end of the game.",
                        "ART_ru_handball_a_2": "If the game starts before the scheduled time, only bets placed before the game commenced will be considered valid. Bets placed after the game commenced will be considered void. This excludes In-Play bet types.",
                        "ART_ru_handball_a_3": "For any competition that uses a “Mercy Rule” all bets will stand according to the result at that time.",
                    
                        "ART_ru_bettype": "BET TYPES",
                        "ART_ru_handball_b": "1 X 2",
                        "ART_ru_handball_b_1": "Predict who will win the game. This market will contain the two teams and the draw as betting selections.",
                    
                        "ART_ru_handball_c": "Handicap",
                        "ART_ru_handball_c_1": "Predict who will win the game / period with the indicated handicap applied.",
                    
                        "ART_ru_handball_d": "In-Play Handicap",
                        "ART_ru_handball_d_1": "Predict who will win the match / period with the indicated handicap applied.",
                    
                        "ART_ru_handball_e": "Over / Under (Goals)",
                        "ART_ru_handball_e_1": "Predict whether the total number of goals scored will be over or under the indicated total line.",
                    
                        "ART_ru_handball_f": "In-Play Over / Under (Goals)/小",
                        "ART_ru_handball_f_1": "Predict whether the total number of goals scored will be over or under the indicated total line.",
                        "ART_ru_handball_f_2": "If a game is abandoned, Over / Under bets will only be settled when the market has been unconditionally determined as any further potential goals have no affect on the market result. In all other scenarios, bets will be considered void.",
                        "ART_ru_handball_f_3": "Settlement is based on the final score line and the total line is applied to a 0-0 score line.",
                    
                        "ART_ru_handball_g": "Odd / Even",
                        "ART_ru_handball_g_1": "Predict whether the total number of goals scored will be odd or even.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_handball": "手球",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "17/10/2017",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_handball_a_1": "所有手球投注一律以六十分钟的完场球赛赛果为准，除非另有特别说明，伤停补时计算在内。",
                        "ART_ru_handball_a_2": "如果比赛提前开赛，只有在开赛之前投注的注单被视为有效投注。在开赛之后投注的注单将被视为无效投注，滚球投注类型不包括在内。",
                        "ART_ru_handball_a_3": "对于任何使用“慈悲规则”的比赛, 所有投注将根据当时的结果来决定。",
                    
                        "ART_ru_bettype": "投注类型",
                        "ART_ru_handball_b": "独赢",
                        "ART_ru_handball_b_1": "预测哪支球队将赢得比赛，盘口将提供两支球队及平局作为投注选项。",
                    
                        "ART_ru_handball_c": "让球",
                        "ART_ru_handball_c_1": "预测哪支球队将获得让球比赛/赛节的胜利。",
                    
                        "ART_ru_handball_d": "滚球让球",
                        "ART_ru_handball_d_1": "预测哪支球队将获得让球比赛/赛节的胜利。",
                    
                        "ART_ru_handball_e": "大/小",
                        "ART_ru_handball_e_1": "预测赛事总进球数将大于或小于盘口分数。",
                    
                        "ART_ru_handball_f": "滚球大/小",
                        "ART_ru_handball_f_1": "预测赛事总进球数将大于或小于盘口分数。",
                        "ART_ru_handball_f_2": "如果赛事中断前已有明确结果并且之后没有任何显著会影响赛事结果的情况，大小球投注的注单才会被结算。若遇到任何其他情况，注单将一律被取消。",
                        "ART_ru_handball_f_3": "滚球大小球比分以0-0开始计算，派彩是根据最终的比分为准。",
                    
                        "ART_ru_handball_g": "单/双",
                        "ART_ru_handball_g_1": "预测赛事总进球数是单数或双数。",
                        ';
                        break;
                }
                break;
            case "ice_hockey":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_ice_hockey": "冰球",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "08/12/2017",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_ice_hockey_a_1": "如果原定比賽場地更改，所有的投注將被視為無效。",
                        "ART_ru_ice_hockey_a_2": "在罰球中，獲勝方會在賽事結束後的最終比分上加一分。",
                        "ART_ru_ice_hockey_a_3": "在賽節投注中，特殊的賽節必須全部完成則注單才被視為有效，除非有明確說明或者個別投注規則。其他情況下，注單將一律取消。",
                        "ART_ru_ice_hockey_a_4": "第三節賽節投注不包括加時賽和罰球賽。",
                        "ART_ru_ice_hockey_a_5": "如果比賽提前開賽，只有在開賽之前投注的注單被視為有效投注。在開賽後投注的注單將被視為無效投注，滾球投注類型不包括在內。",
                        "ART_ru_ice_hockey_a_6": "除了在有特別說明的情況下，加時賽並不計算在內。",
                    
                        "ART_ru_bettype": "投注類型",
                        "ART_ru_ice_hockey_b": "獨贏盤(優勝者)",
                        "ART_ru_ice_hockey_b_1": "預測哪支球隊將贏得比賽。",
                    
                        "ART_ru_ice_hockey_c": "1 X 2（獨贏盤）",
                        "ART_ru_ice_hockey_c_1": "預測哪支球隊將贏得比賽/賽節。盤口提供兩支球隊和平局為投注選項。加時賽並不計算在內。",
                    
                        "ART_ru_ice_hockey_d": "讓球",
                        "ART_ru_ice_hockey_d_1": "預測哪支球隊將獲得讓球比賽/賽節的勝利。",
                    
                        "ART_ru_ice_hockey_e": "滾球讓球",
                        "ART_ru_ice_hockey_e_1": "預測哪支球隊將獲得讓球比賽/賽節的勝利。",
                    
                        "ART_ru_ice_hockey_f": "大/小(球)",
                        "ART_ru_ice_hockey_f_1": "預測賽事/賽節總進球數將大於或小於盤口分數。",
                        "ART_ru_ice_hockey_f_2": "如果賽事中斷前已有明確結果並且之後沒有任何顯著會影響賽事結果的情況，大小球投注的注單才會被結算。 若遇到任何其他情況，注單將一律被取消。",
                    
                        "ART_ru_ice_hockey_g": "滾球大/小（球）",
                        "ART_ru_ice_hockey_g_1": "預測賽事/賽節總進球數將大於或小於盤口分數。",
                        "ART_ru_ice_hockey_g_2": "如果賽事中斷前已有明確結果並且之後沒有任何顯著會影響賽事結果的情況，大小球投注的注單才會被結算。若遇到任何其他情況，注單將一律被取消。",
                    
                        "ART_ru_ice_hockey_h": "單/雙",
                        "ART_ru_ice_hockey_h_1": "預測賽事/賽節總進球數為單或者雙。",
                    
                        "ART_ru_ice_hockey_i": "最先進球球隊",
                        "ART_ru_ice_hockey_i_1": "預測哪支球隊將最先得分。",
                        "ART_ru_ice_hockey_i_2": "無論賽事在任何時間點取消，只要有一隊在賽事取消前已經得分，所有的投注將被視為有效。",
                        "ART_ru_ice_hockey_i_3": "如果在賽事取消時未有任何一方得分，所有的注單將一律被取消。",
                    
                        "ART_ru_ice_hockey_j": "最後進球球隊",
                        "ART_ru_ice_hockey_j_1": "預測哪支球隊將最後得分。",
                        "ART_ru_ice_hockey_j_2": "如果在賽事取消時未有任何一方得分，所有的注單將一律被取消。",
                    
                        "ART_ru_ice_hockey_k": "球隊最高得分的賽節",
                        "ART_ru_ice_hockey_k_1": "預測哪支球隊在一場賽事中將獲得最高的賽節得分。",
                        "ART_ru_ice_hockey_k_2": "加時賽不計算在內。",
                        "ART_ru_ice_hockey_k_3": "如果賽事取消，所有注單將一律被取消。",
                        "ART_ru_ice_hockey_k_4": "如果賽事在3節正常比賽時間結束後未有任何一隊得分，所有的注單將一律被取消。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_ice_hockey": "ICE HOCKEY",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "08/12/2017",
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_ice_hockey_a_1": "If the scheduled venue is changed, all bets will be considered void.",
                        "ART_ru_ice_hockey_a_2": "For penalty shootouts, the winner will have 1 goal added to their score at the completion of the shoot out to determine the final score of the game.",
                        "ART_ru_ice_hockey_a_3": "For period betting, the specific period must be played in its entirety for bets to stand, unless explicitly stated below or in the individual Bet Type rules. In all other scenarios, bets will be considered void.",
                        "ART_ru_ice_hockey_a_4": "3rd Period betting does not include overtime or penalty shootouts.",
                        "ART_ru_ice_hockey_a_5": "If the game starts before the scheduled time, only bets placed before the game commenced will be considered valid. Bets placed after the game commenced will be considered void. This excludes In-Play bet types.",
                        "ART_ru_ice_hockey_a_6": "Overtime does not count unless otherwise stated.",
                    
                        "ART_ru_bettype": "BET TYPES",
                        "ART_ru_ice_hockey_b": "Money Line / Winner",
                        "ART_ru_ice_hockey_b_1": "Predict who will win the game.",
                    
                        "ART_ru_ice_hockey_c": "1 X 2",
                        "ART_ru_ice_hockey_c_1": "Predict who will win the game / period.This market will contain the two teams and the draw as betting selections.Overtime does not count.",
                    
                        "ART_ru_ice_hockey_d": "Handicap",
                        "ART_ru_ice_hockey_d_1": "Predict who will win the game / period with the indicated handicap applied.",
                    
                        "ART_ru_ice_hockey_e": "Handicap (In-Play)",
                        "ART_ru_ice_hockey_e_1": "Predict who will win the game / period with the indicated handicap applied.",
                    
                        "ART_ru_ice_hockey_f": "Goals: Over / Under",
                        "ART_ru_ice_hockey_f_1": "Predict whether the total number of goals scored will be over or under the indicated total line for the game/ period.",
                        "ART_ru_ice_hockey_f_2": "If a game is abandoned, Over / Under bets will only be settled when the market has been unconditionally determined as any further potential goals have no affect on the market result. In all other scenarios, bets will be considered void.",
                    
                        "ART_ru_ice_hockey_g": "Goals: Over / Under (In-Play)",
                        "ART_ru_ice_hockey_g_1": "Predict whether the total number of goals scored will be over or under the indicated total line for the game/ period.",
                        "ART_ru_ice_hockey_g_2": "If a game is abandoned, Over / Under bets will only be settled when the market has been unconditionally determined as any further potential goals have no affect on the market result. In all other scenarios, bets will be considered void.",
                    
                        "ART_ru_ice_hockey_h": "Goals: Odd / Even",
                        "ART_ru_ice_hockey_h_1": "Predict whether the total number of goals will be odd or even for the game/ period.",
                    
                        "ART_ru_ice_hockey_i": "Team to Score First",
                        "ART_ru_ice_hockey_i_1": "Predict which team will score first in the game.",
                        "ART_ru_ice_hockey_i_2": "If the game is abandoned at any time, and a team has already been scored prior to the abandonment, all bets will stand.",
                        "ART_ru_ice_hockey_i_3": "If neither team has scored at the time of abandonment, all bets are considered void.",
                    
                        "ART_ru_ice_hockey_j": "Team to Score Last",
                        "ART_ru_ice_hockey_j_1": "Predict which team will score last in the game.",
                        "ART_ru_ice_hockey_j_2": "If the game is abandoned at any time, then all bets will be considered void.",
                    
                        "ART_ru_ice_hockey_k": "Team with the Highest Scoring Period",
                        "ART_ru_ice_hockey_k_1": "Predict which team will score the most in a single period.",
                        "ART_ru_ice_hockey_k_2": "Overtime does not count.",
                        "ART_ru_ice_hockey_k_3": "If the game is abandoned at any time, then all bets will be considered void.",
                        "ART_ru_ice_hockey_k_4": "If neither team has scored after the scheduled 3 periods of normal play, then bets are considered void.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_ice_hockey": "冰球",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "08/12/2017",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_ice_hockey_a_1": "如果原定比赛场地更改，所有的投注将被视为无效。",
                        "ART_ru_ice_hockey_a_2": "在罚球中，获胜方会在赛事结束后的最终比分上加一分。",
                        "ART_ru_ice_hockey_a_3": "在赛节投注中，特殊的赛节必须全部完成则注单才被视为有效，除非有明确说明或者个别投注规则。其他情况下，注单将一律取消。",
                        "ART_ru_ice_hockey_a_4": "第三节赛节投注不包括加时赛和罚球赛。",
                        "ART_ru_ice_hockey_a_5": "如果比赛提前开赛，只有在开赛之前投注的注单被视为有效投注。在开赛后投注的注单将被视为无效投注，滚球投注类型不包括在内。",
                        "ART_ru_ice_hockey_a_6": "除了在有特别说明的情况下，加时赛并不计算在内。",
                    
                        "ART_ru_bettype": "投注类型",
                        "ART_ru_ice_hockey_b": "独赢盘(优胜者)",
                        "ART_ru_ice_hockey_b_1": "预测哪支球队将赢得比赛。",
                    
                        "ART_ru_ice_hockey_c": "1 X 2（独赢盘）",
                        "ART_ru_ice_hockey_c_1": "预测哪支球队将赢得比赛/赛节。盘口提供两支球队和平局为投注选项。加时赛并不计算在内。",
                    
                        "ART_ru_ice_hockey_d": "让球",
                        "ART_ru_ice_hockey_d_1": "预测哪支球队将获得让球比赛/赛节的胜利。",
                    
                        "ART_ru_ice_hockey_e": "滚球让球",
                        "ART_ru_ice_hockey_e_1": "预测哪支球队将获得让球比赛/赛节的胜利。",
                    
                        "ART_ru_ice_hockey_f": "大/小(球)",
                        "ART_ru_ice_hockey_f_1": "预测赛事/赛节总进球数将大于或小于盘口分数。",
                        "ART_ru_ice_hockey_f_2": "如果赛事中断前已有明确结果并且之后没有任何显著会影响赛事结果的情况，大小球投注的注单才会被结算。 若遇到任何其他情况，注单将一律被取消。",
                    
                        "ART_ru_ice_hockey_g": "滚球大/小（球）",
                        "ART_ru_ice_hockey_g_1": "预测赛事/赛节总进球数将大于或小于盘口分数。",
                        "ART_ru_ice_hockey_g_2": "如果赛事中断前已有明确结果并且之后没有任何显著会影响赛事结果的情况，大小球投注的注单才会被结算。若遇到任何其他情况，注单将一律被取消。",
                    
                        "ART_ru_ice_hockey_h": "单/双",
                        "ART_ru_ice_hockey_h_1": "预测赛事/赛节总进球数为单或者双。",
                    
                        "ART_ru_ice_hockey_i": "最先进球球队",
                        "ART_ru_ice_hockey_i_1": "预测哪支球队将最先得分。",
                        "ART_ru_ice_hockey_i_2": "无论赛事在任何时间点取消，只要有一队在赛事取消前已经得分，所有的投注将被视为有效。",
                        "ART_ru_ice_hockey_i_3": "如果在赛事取消时未有任何一方得分，所有的注单将一律被取消。",
                    
                        "ART_ru_ice_hockey_j": "最后进球球队",
                        "ART_ru_ice_hockey_j_1": "预测哪支球队将最后得分。",
                        "ART_ru_ice_hockey_j_2": "如果在赛事取消时未有任何一方得分，所有的注单将一律被取消。",
                    
                        "ART_ru_ice_hockey_k": "球队最高得分的赛节",
                        "ART_ru_ice_hockey_k_1": "预测哪支球队在一场赛事中将获得最高的赛节得分。",
                        "ART_ru_ice_hockey_k_2": "加时赛不计算在内。",
                        "ART_ru_ice_hockey_k_3": "如果赛事取消，所有注单将一律被取消。",
                        "ART_ru_ice_hockey_k_4": "如果赛事在3节正常比赛时间结束后未有任何一队得分，所有的注单将一律被取消。",
                        ';
                        break;
                }
                break;
            case "judo":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_judo": "柔道、摔跤、跆拳道",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "04/03/2015",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_judo_a_1": "選手在頒獎儀式上所授予的金牌，銀牌及銅牌分別認定為第一名，第二名及第三名。",
                        "ART_ru_judo_a_2": "每場賽事的結果均以獎台上排名為最終結果。如之後發生喪失資格或結果修正將不予以計算。",
                        "ART_ru_judo_a_3": "在投註二選一賽事時，只有雙方參賽者均參與比賽時，注單才被為有效。",
                        "ART_ru_judo_a_4": "如果比賽提前開賽，只有在開賽之前投注的注單被視為有效投注。在開賽之後投注的注單將被視為無效投注，滾球投注類型不包括在內。",
                        "ART_ru_judo_a_5": "如果該場賽事沒有舉行頒獎儀式，所有柔道投注的輸贏將依據 I.J.F（國際體聯）公佈的正式賽果而定。",
                        "ART_ru_judo_a_6": "如果該場賽事沒有舉行頒獎儀式，所有摔跤投注的輸贏將依據 F.​I.L.A（國際體聯）公佈的正式賽果而定。",
                        "ART_ru_judo_a_7": "如果該場賽事沒有舉行頒獎儀式，所有跆拳道投注的輸贏將依據 W.T.F（國際體聯）公佈的正式賽果而定。 ",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_judo": "JUDO",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "04/03/2015",
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_judo_a_1": "For betting purposes, participants awarded Gold, Silver and Bronze at the medal ceremony will be deemed as the 1st, 2nd and 3rd place winner.",
                        "ART_ru_judo_a_2": "Podium positions will count as the official results, regardless of any subsequent disqualification or amendment to the result.",
                        "ART_ru_judo_a_3": "In head to head events, both competitors must start the fight for the bets to stand.",
                        "ART_ru_judo_a_4": "If the event starts before the scheduled time, only bets placed before the event commenced will be considered valid. Bets placed after the event commenced will be considered void. This excludes In-Play bet types.",
                        "ART_ru_judo_a_5": "For Judo, bets will be settled according to the official I.J.F (Judo) result immediately at the end of the event, even in the absence of a medal ceremony.",
                        "ART_ru_judo_a_6": "For Wrestling, bets will be settled according to the F.I.L.A (Wrestling) result immediately at the end of the event, even in the absence of a medal ceremony.",
                        "ART_ru_judo_a_7": "For Taekwondo, bets will be settled according to the W.T.F (Taekwondo) result immediately at the end of the event, even in the absence of a medal ceremony",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_judo": "柔道、摔交、跆拳道",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "04/03/2015",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_judo_a_1": "选手在颁奖仪式上所授予的金牌，银牌及铜牌分别认定为第一名，第二名及第三名。",
                        "ART_ru_judo_a_2": "每场赛事的结果均以奖台上排名为最终结果。如之后发生丧失资格或结果修正将不予以计算。",
                        "ART_ru_judo_a_3": "在投注二选一赛事时，只有双方参赛者均参与比赛时，注单才被为有效。",
                        "ART_ru_judo_a_4": "如果比赛提前开赛，只有在开赛之前投注的注单被视为有效投注。在开赛之后投注的注单将被视为无效投注，滚球投注类型不包括在内。",
                        "ART_ru_judo_a_5": "如果该场赛事没有举行颁奖仪式，所有柔道投注的输赢将依据 I.J.F（国际体联）公布的正式赛果而定。",
                        "ART_ru_judo_a_6": "如果该场赛事没有举行颁奖仪式，所有摔交投注的输赢将依据 F.​I.L.A（国际体联）公布的正式赛果而定。",
                        "ART_ru_judo_a_7": "如果该场赛事没有举行颁奖仪式，所有跆拳道投注的输赢将依据 W.T.F（国际体联）公布的正式赛果而定。 ",
                        ';
                        break;
                }
                break;
            case "lacrosse":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_lacrosse": "長曲棍球",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "19/07/2016",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_lacrosse_a_1": "所有長曲棍球的投注均以完場60分鐘賽果為準，傷停補時計算在內，但不包括加時賽。除非另有特別說明。 ",
                        "ART_ru_lacrosse_a_2": "如果比賽提前開賽，只有在開賽之前投注的注單將被視為有效投注。在開賽之後投注的注單將被視為無效投注，滾球投注類型不包括在內。 ",
                    
                        "ART_ru_bettype": "投注類型",
                        "ART_ru_lacrosse_b": "投注",
                        "ART_ru_lacrosse_b_1": "預測哪支球隊將贏得比賽，盤口將提供兩支球隊作為投注選項。加時賽計算在內。",
                    
                        "ART_ru_lacrosse_c": "讓球盤",
                        "ART_ru_lacrosse_c_1": "預測哪支球隊將獲得讓球比賽/局的勝利。加時賽計算在內。",
                    
                        "ART_ru_lacrosse_d": "大/小",
                        "ART_ru_lacrosse_d_1": "預測賽事總進球數將大於或小於盤口分數。加時賽計算在內。",
                        "ART_ru_lacrosse_d_2": "如果賽事中斷前已有明確結果並且之後沒有任何顯著會影響賽事結果的情況，大小球投注的注單才會被結算。若遇到任何其他情況，注單將一律被取消。",
                    
                        "ART_ru_lacrosse_e": "單/雙",
                        "ART_ru_lacrosse_e_1": "預測賽事總進球數是單數或雙數。加時賽計算在內。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_lacrosse": "LACROSSE",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "04/03/2015",
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_lacrosse_a_1": "Unless otherwise stated, all Lacrosse bets will be settled based on the results of the full 60 minutes of play excluding overtime. This includes any additional stoppage time that maybe added at the end of the game.",
                        "ART_ru_lacrosse_a_2": "If the game starts before the scheduled time, only bets placed before the game commenced will be considered valid. Bets placed after the game commenced will be considered void. This excludes In-Play bet types.",
                    
                        "ART_ru_bettype": "BET TYPES",
                        "ART_ru_lacrosse_b": "Money Line",
                        "ART_ru_lacrosse_b_1": "Predict who will win the game. This market will contain the two teams. Overtime counts for settlement purposes.",
                    
                        "ART_ru_lacrosse_c": "Handicap",
                        "ART_ru_lacrosse_c_1": "Predict who will win the game / period with the indicated handicap applied. Overtime counts for settlement purposes.",
                    
                        "ART_ru_lacrosse_d": "Over / Under",
                        "ART_ru_lacrosse_d_1": "Predict whether the total number of goals scored will be over or under the indicated total line. Overtime counts for settlement purposes.",
                        "ART_ru_lacrosse_d_2": "If a game is abandoned, Over / Under bets will only be settled when the market has been unconditionally determined as any further potential goals have no affect on the market result. In all other scenarios, bets will be considered void.",
                    
                        "ART_ru_lacrosse_e": "Odd / Even",
                        "ART_ru_lacrosse_e_1": "Predict whether the total number of goals scored will be odd or even. Overtime counts for settlement purposes.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_lacrosse": "长曲棍球",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "19/07/2016",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_lacrosse_a_1": "所有长曲棍球的投注均以完场60分钟赛果为准，伤停补时计算在内，但不包括加时赛。除非另有特别说明。 ",
                        "ART_ru_lacrosse_a_2": "如果比赛提前开赛，只有在开赛之前投注的注单将被视为有效投注。在开赛之后投注的注单将被视为无效投注，滚球投注类型不包括在内。 ",
                    
                        "ART_ru_bettype": "投注类型",
                        "ART_ru_lacrosse_b": "投注",
                        "ART_ru_lacrosse_b_1": "预测哪支球队将赢得比赛，盘口将提供两支球队作为投注选项。加时赛计算在内。",
                    
                        "ART_ru_lacrosse_c": "让球盘",
                        "ART_ru_lacrosse_c_1": "预测哪支球队将获得让球比赛/局的胜利。加时赛计算在内。",
                    
                        "ART_ru_lacrosse_d": "大/小",
                        "ART_ru_lacrosse_d_1": "预测赛事总进球数将大于或小于盘口分数。加时赛计算在内。",
                        "ART_ru_lacrosse_d_2": "如果赛事中断前已有明确结果并且之后没有任何显著会影响赛事结果的情况，大小球投注的注单才会被结算。若遇到任何其他情况，注单将一律被取消。",
                    
                        "ART_ru_lacrosse_e": "单/双",
                        "ART_ru_lacrosse_e_1": "预测赛事总进球数是单数或双数。加时赛计算在内。",
                        ';
                        break;
                }
                break;
            case "medal_betting":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_medal_betting": "體育 / 獎章投注",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "04/03/2015",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_medal_betting_a_1": "選手在頒獎儀式上所授予的金牌，銀牌及銅牌分別認定為第一名，第二名及第三名。",
                        "ART_ru_medal_betting_a_2": "每場賽事的結果均以獎台上排名為最終結果。如之後發生喪失資格或結果修正將不予以計算。",
                        "ART_ru_medal_betting_a_3": "無論是團隊或個人是否參加比賽，所有的注單將一律被視為有效。",
                        "ART_ru_medal_betting_a_4": "如果比賽提前開賽，只有在開賽之前投注的注單將被視為有效投注。在開賽之後投注的注單將被視為無效投注，滾球投注類型不包括在內。",
                    
                        "ART_ru_medal_betting_b": "獎章投注",
                        "ART_ru_medal_betting_b_1": "所有投注將會在賽事結束後，依據官方公佈的獎牌榜數量結果進行結算（例如：奧運會，世界錦標賽等等。）",
                        "ART_ru_medal_betting_b_2": "如裁判或權威機構在賽事結束之後有更改賽果的，所有的注單都被視為無效。",
                        "ART_ru_medal_betting_b_3": "由團體或國家所贏得的獎牌，無論團隊成員數量，將僅算一枚。",
                    
                        "ART_ru_medal_betting_ps_1": "注: 在所有奧運賽事或國際性賽事中，香港特別行政區的選手及澳門特別行政區的選手將視為獨立的地方性代表，不隸屬於中國。除非另有特別說明。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_medal_betting": "MEDAL SPORTS / MEDAL BETTING",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "04/03/2015",
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_medal_betting_a_1": "For betting purposes, participants awarded Gold, Silver and Bronze at the medal ceremony will be deemed as the 1st, 2nd and 3rd place winner.",
                        "ART_ru_medal_betting_a_2": "Podium positions will count as the official results, regardless of any subsequent disqualification or amendment to the result.",
                        "ART_ru_medal_betting_a_3": "All bets will still stand even if a crew or individual competes or not.",
                        "ART_ru_medal_betting_a_4": "If the event starts before the scheduled time, only bets placed before the event commenced will be considered valid. Bets placed after the event commenced will be considered void. This excludes In-Play bet types.",
                    
                        "ART_ru_medal_betting_b": "MEDAL BETTING",
                        "ART_ru_medal_betting_b_1": "Bets will be settled according to the number of medals on the official medal table at the end of the event (e.g. Olympic games, World Championships, etc).",
                        "ART_ru_medal_betting_b_2": "Changes made by the event referee or relevant governing authorities at a later date do not count for betting purposes.",
                        "ART_ru_medal_betting_b_3": "Medals won by a team / nation in each competition will be counted as one medal, regardless of the number of team members present.",
                    
                        "ART_ru_medal_betting_ps_1": "Note: For betting purposes the Hong Kong Special Administrative Region and Macau Special Administrative Region is considered as separate delegation to the People\'s Republic of China and it is not considered under the People\'s Republic of China for Olympics Games and other international sport events unless stated otherwise.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_medal_betting": "体育 / 奖章投注",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "04/03/2015",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_medal_betting_a_1": "选手在颁奖仪式上所授予的金牌，银牌及铜牌分别认定为第一名，第二名及第三名。",
                        "ART_ru_medal_betting_a_2": "每场赛事的结果均以奖台上排名为最终结果。如之后发生丧失资格或结果修正将不予以计算。",
                        "ART_ru_medal_betting_a_3": "无论是团队或个人是否参加比赛，所有的注单将一律被视为有效。",
                        "ART_ru_medal_betting_a_4": "如果比赛提前开赛，只有在开赛之前投注的注单将被视为有效投注。在开赛之后投注的注单将被视为无效投注，滚球投注类型不包括在内。",
                    
                        "ART_ru_medal_betting_b": "奖章投注",
                        "ART_ru_medal_betting_b_1": "所有投注将会在赛事结束后，依据官方公布的奖牌榜数量结果进行结算（例如：奥运会，世界锦标赛等等。）",
                        "ART_ru_medal_betting_b_2": "如裁判或权威机构在赛事结束之后有更改赛果的，所有的注单都被视为无效。",
                        "ART_ru_medal_betting_b_3": "由团体或国家所赢得的奖牌，无论团队成员数量，将仅算一枚。",
                    
                        "ART_ru_medal_betting_ps_1": "注: 在所有奥运赛事或国际性赛事中，香港特别行政区的选手及澳门特别行政区的选手将视为独立的地方性代表，不隶属于中国。除非另有特别说明。",
                        ';
                        break;
                }
                break;
            case "motor_sports":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_motor_sports": "賽車",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "27/12/2019",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_motor_a_1": "如果原定比賽場地更改，所有的注單將被視為無效。",
                        "ART_ru_motor_a_2": "每場賽事的結果均以獎台上排名為最終結果。如之後發生喪失資格或修正結果將不予以計算。",
                        "ART_ru_motor_a_3": "所有註單均以FIA/FIM官方公佈的車手排位賽果為準。",
                    
                        "ART_ru_bettype": "投注類型",
                        "ART_ru_motor_b": "冠軍投注",
                        "ART_ru_motor_b_1": "如果車隊/車手無法進行比賽，所有註單仍然有效。",
                    
                        "ART_ru_motor_c": "二選一投注",
                        "ART_ru_motor_c_1": "若兩位配對車手其中一位缺席正式比賽﹐所有註單將一律被取消。",
                        "ART_ru_motor_c_2": "投注將以所投車手最終排名優於另一位車手的排名為贏。",
                        "ART_ru_motor_c_3": "如果雙方車手都未完成比賽，則所有註單將一律被取消。",
                        "ART_ru_motor_c_4": "如果雙方車手已經開始比賽，但其中一位車手未能完成比賽，則另一位完成比賽的車手將被視為勝者。",
                    
                        "ART_ru_motor_d": "讓位賽",
                        "ART_ru_motor_d_1": "讓排位數盤口即在比賽正式開始前， 一方駕駛人/車手已得到另一方所讓的虛擬排位數， 以領先的情況下開始比賽。",
                        "ART_ru_motor_d_2": "只有雙方駕駛人/車手的名字均在FIA/FIM官方公佈的賽果名單裡，投注才將被視為有效。",
                        "ART_ru_motor_d_3": "如果其中一方駕駛人/車手無法完成比賽，不論任何原因，投注都將被取消。",
                        "ART_ru_motor_d_4": "在計算讓位分數下，投注將以所投車手最終排名優於另一車手的排名為贏。",
                        "ART_ru_motor_d_4_1": "範例",
                    
                        "ART_ru_motor_d_td1_1": "賽事",
                        "ART_ru_motor_d_td1_2": "車手",
                        "ART_ru_motor_d_td1_3": "讓排位",
                        "ART_ru_motor_d_td2_1": "意大利大獎賽",
                        "ART_ru_motor_d_td2_2": "劉易斯•漢密爾頓",
                        "ART_ru_motor_d_td2_3": "1.5",
                        "ART_ru_motor_d_td2_4": "0.93",
                        "ART_ru_motor_d_td3_2": "費爾南多•阿隆索",
                        "ART_ru_motor_d_td3_3": "",
                        "ART_ru_motor_d_td3_4": "0.93",
                    
                        "ART_ru_motor_d_4_3_1": "賽果",
                        "ART_ru_motor_d_4_3_2": "劉易斯•漢密爾頓 第三名",
                        "ART_ru_motor_d_4_3_3": "費爾南多•阿隆索 第四名",
                        "ART_ru_motor_d_4_4_1": "注單結果",
                        "ART_ru_motor_d_4_4_2": "由於在讓位賽開始時，費爾南多•阿隆索已獲取1.5排位的讓位，所以他領先劉易斯•漢密爾頓。",
                    
                        "ART_ru_motor_e": "最快圈",
                        "ART_ru_motor_e_1": "預測哪位車手獲取正是比賽最快圈數的記錄。",
                        "ART_ru_motor_e_2": "排位圈和練習圈不予計算。",
                    
                        "ART_ru_motor_f": "達成成績或排名之車手數",
                        "ART_ru_motor_f_1": "預測會有多少位車手將完成最少90%或更多圈數並且被FIA視為排名完成者。",
                    
                        "ART_ru_motor_g": "安全車",
                        "ART_ru_motor_g_1": "預測安全車是否將會出現在比賽中。",
                        "ART_ru_motor_g_2": "如果比賽由安全車引領開始，所有安全車注單將將被取消。",
                        "ART_ru_motor_g_3": "VSC (虛擬安全車) 不算為安全車。",
                    
                        "ART_ru_motor_h": "輸贏比數",
                        "ART_ru_motor_h_1": "預測在比賽結束時，一名車手與第二名車手之間的時間差。",
                    
                        "ART_ru_motor_i": "前三名（頒獎台站位）",
                        "ART_ru_motor_i_1": "預測，在正式比賽中第一名，第二名以及第三車手獲得者。",
                        "ART_ru_motor_i_2": "每場賽事的結果均以獎台上排名為最終結果，如之後發生任何改變都不予以計算。",
                    
                        "ART_ru_motor_j": "單/雙",
                        "ART_ru_motor_j_1": "預測車手最總排位是單還是雙。",
                        "ART_ru_motor_j_2": "如果車手未完成比賽，所有註單一律取消。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_motor_sports": "MOTOR RACING EVENTS",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "27/12/2019",
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_motor_a_1": "If the scheduled venue is changed, all bets will be void.",
                        "ART_ru_motor_a_2": "Podium positions will count as the official results, regardless of any subsequent disqualification or amendment to the result.",
                        "ART_ru_motor_a_3": "Bets will be settled based on the driver / rider ranking after the specified race according to the official FIA / FIM results.",
                    
                        "ART_ru_bettype": "BET TYPES",
                        "ART_ru_motor_b": "Outright",
                        "ART_ru_motor_b_1": "If a driver / rider fails to start the race, all bets will still be considered valid.",
                    
                        "ART_ru_motor_c": "Head to Head",
                        "ART_ru_motor_c_1": "If one of the two drivers / riders does not start the race, all bets will be void",
                        "ART_ru_motor_c_2": "Bets will be settled based upon one driver\'s / rider\'s ranking against the other driver / rider after the specified race.",
                        "ART_ru_motor_c_3": "If both drivers / riders fail to finish a race, then bets will be void.",
                        "ART_ru_motor_c_4": "If both drivers / riders start a specific race and only one fails to finish, then the driver / rider who completes the race will be deemed the winner.",
                    
                        "ART_ru_motor_d": "Handicap",
                        "ART_ru_motor_d_1": "A Handicap market allows one driver / rider to get a virtual finishing position advantage over another driver / rider.",
                        "ART_ru_motor_d_2": "Both drivers / riders need to have a classified position based on the official FIA / FIM results in order for the bets to stand.",
                        "ART_ru_motor_d_3": "If either of the two drivers / riders are unable to complete the race, no matter what the reason, all bets will be considered void.",
                        "ART_ru_motor_d_4": "Bets will be settled based upon one driver\'s / rider\'s ranking against the other driver / rider after the specified race.",
                        "ART_ru_motor_d_4_1": "Here is an example of a Handicap market",
                    
                        "ART_ru_motor_d_td1_1": "League",
                        "ART_ru_motor_d_td1_2": "Home/Away",
                        "ART_ru_motor_d_td1_3": "Handicap",
                        "ART_ru_motor_d_td2_1": "F1 Italy GP",
                        "ART_ru_motor_d_td2_2": "Lewis Hamilton",
                        "ART_ru_motor_d_td2_3": "1.5",
                        "ART_ru_motor_d_td2_4": "0.93",
                        "ART_ru_motor_d_td3_2": "Fernando Alonso",
                        "ART_ru_motor_d_td3_3": "",
                        "ART_ru_motor_d_td3_4": "0.93",
                    
                        "ART_ru_motor_d_4_3_1": "Race Results",
                        "ART_ru_motor_d_4_3_2": "Lewis Hamilton 3rd Place",
                        "ART_ru_motor_d_4_3_3": "Fernando Alonso 4th Place",
                        "ART_ru_motor_d_4_4_1": "Bet Results",
                        "ART_ru_motor_d_4_4_2": "Fernando Alonso moves ahead of Lewis Hamilton, in the Handicap market, based on the 1.5 place advantage he received at the start of the race.",
                    
                        "ART_ru_motor_e": "Fastest Lap",
                        "ART_ru_motor_e_1": "Predict which driver will record the fastest lap in the specific race.",
                        "ART_ru_motor_e_2": "Qualifying and practice laps do not count.",
                    
                        "ART_ru_motor_f": "Number of Classified Finishers",
                        "ART_ru_motor_f_1": "Predict how many drivers / riders will complete at least 90% of the race and be regarded as classified finishers by FIA classification.",
                    
                        "ART_ru_motor_g": "Safety Car",
                        "ART_ru_motor_g_1": "Predict whether or not the Safety Car will be used in the race.",
                        "ART_ru_motor_g_2": "If the race starts under Safety Car conditions, all bets will be voided.",
                        "ART_ru_motor_g_3": "VSC (Virtual Safety Car) will not be regarded as a Safety Car.",
                    
                        "ART_ru_motor_h": "Winning Margin",
                        "ART_ru_motor_h_1": "Predict the time difference between the winning driver / rider and the runner-up at the end of the race.",
                    
                        "ART_ru_motor_i": "Top 3 Finishing Position (Podium Result)",
                        "ART_ru_motor_i_1": "Predict the first, second and third place drivers / riders in the specific race.",
                        "ART_ru_motor_i_2": "Podium positions are final and any change of result after the race will not count towards settlement.",
                    
                        "ART_ru_motor_j": "Odd / Even",
                        "ART_ru_motor_j_1": "Predict whether the driver\'s / rider\'s final position will be an odd or even number",
                        "ART_ru_motor_j_2": "If the driver / rider fails to complete the race, all bets will be void.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_motor_sports": "赛车",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "27/12/2019",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_motor_a_1": "如果原定比赛场地更改，所有的注单将被视为无效。",
                        "ART_ru_motor_a_2": "每场赛事的结果均以奖台上排名为最终结果。如之后发生丧失资格或修正结果将不予以计算。",
                        "ART_ru_motor_a_3": "所有注单均以FIA/FIM官方公布的车手排位赛果为准。",
                    
                        "ART_ru_bettype": "投注类型",
                        "ART_ru_motor_b": "冠军投注",
                        "ART_ru_motor_b_1": "如果车队/车手无法进行比赛，所有注单仍然有效。",
                    
                        "ART_ru_motor_c": "二选一投注",
                        "ART_ru_motor_c_1": "若两位配对车手其中一位缺席正式比赛﹐所有注单将一律被取消。",
                        "ART_ru_motor_c_2": "投注将以所投车手最终排名优于另一位车手的排名为赢。",
                        "ART_ru_motor_c_3": "如果双方车手都未完成比赛，则所有注单将一律被取消。",
                        "ART_ru_motor_c_4": "如果双方车手已经开始比赛，但其中一位车手未能完成比赛，则另一位完成比赛的车手将被视为胜者。",
                    
                        "ART_ru_motor_d": "让位赛",
                        "ART_ru_motor_d_1": "让排位数盘口即在比赛正式开始前， 一方驾驶人/车手已得到另一方所让的虚拟排位数， 以领先的情况下开始比赛。",
                        "ART_ru_motor_d_2": "只有双方驾驶人/车手的名字均在FIA/FIM官方公布的赛果名单里，投注才将被视为有效。",
                        "ART_ru_motor_d_3": "如果其中一方驾驶人/车手无法完成比赛，不论任何原因，投注都将被取消。",
                        "ART_ru_motor_d_4": "在计算让位分数下，投注将以所投车手最终排名优于另一车手的排名为赢。",
                        "ART_ru_motor_d_4_1": "范例",
                    
                        "ART_ru_motor_d_td1_1": "赛事",
                        "ART_ru_motor_d_td1_2": "车手",
                        "ART_ru_motor_d_td1_3": "让排位",
                        "ART_ru_motor_d_td2_1": "意大利大奖赛",
                        "ART_ru_motor_d_td2_2": "刘易斯•汉密尔顿",
                        "ART_ru_motor_d_td2_3": "1.5",
                        "ART_ru_motor_d_td2_4": "0.93",
                        "ART_ru_motor_d_td3_2": "费尔南多•阿隆索",
                        "ART_ru_motor_d_td3_3": "",
                        "ART_ru_motor_d_td3_4": "0.93",
                    
                        "ART_ru_motor_d_4_3_1": "赛果",
                        "ART_ru_motor_d_4_3_2": "刘易斯•汉密尔顿 第三名",
                        "ART_ru_motor_d_4_3_3": "费尔南多•阿隆索 第四名",
                        "ART_ru_motor_d_4_4_1": "注单结果",
                        "ART_ru_motor_d_4_4_2": "由于在让位赛开始时，费尔南多•阿隆索已获取1.5排位的让位，所以他领先刘易斯•汉密尔顿。",
                    
                        "ART_ru_motor_e": "最快圈",
                        "ART_ru_motor_e_1": "预测哪位车手获取正是比赛最快圈数的记录。",
                        "ART_ru_motor_e_2": "排位圈和练习圈不予计算。",
                    
                        "ART_ru_motor_f": "达成成绩或排名之车手数",
                        "ART_ru_motor_f_1": "预测会有多少位车手将完成最少90%或更多圈数并且被FIA视为排名完成者。",
                    
                        "ART_ru_motor_g": "安全车",
                        "ART_ru_motor_g_1": "预测安全车是否将会出现在比赛中。",
                        "ART_ru_motor_g_2": "如果比赛由安全车引领开始，所有安全车注单将将被取消。",
                        "ART_ru_motor_g_3": "VSC (虚拟安全车) 不算为安全车。",
                    
                        "ART_ru_motor_h": "输赢比数",
                        "ART_ru_motor_h_1": "预测在比赛结束时，一名车手与第二名车手之间的时间差。",
                    
                        "ART_ru_motor_i": "前三名（颁奖台站位）",
                        "ART_ru_motor_i_1": "预测，在正式比赛中第一名，第二名以及第三车手获得者。",
                        "ART_ru_motor_i_2": "每场赛事的结果均以奖台上排名为最终结果，如之后发生任何改变都不予以计算。",
                    
                        "ART_ru_motor_j": "单/双",
                        "ART_ru_motor_j_1": "预测车手最总排位是单还是双。",
                        "ART_ru_motor_j_2": "如果车手未完成比赛，所有注单一律取消。",
                        ';
                        break;
                }
                break;
            case "olympics":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_olympics": "奧林匹克或相關事件投注",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "04/03/2015",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_olympics_a_1": "如果是\"體育博彩規則\"內有的體育項目，則將依該項目規則為準，例如：足球依據足球規則、網球依據網球規則，拳擊依據拳擊規則等。 ",
                        "ART_ru_olympics_a_2": "\"常用規則\"將被應用於比賽，除非另有特別說明。",
                        "ART_ru_olympics_a_3": "參賽者獲得金，銀，銅牌將被視為第一，第二和第三名獲獎者。",
                        "ART_ru_olympics_a_4": "每場賽事的結果均以獎台上排名為最終結果。如之後發生喪失資格或結果修正將不予以計算。",
                        "ART_ru_olympics_a_5": "無論是團隊或個人是否參加比賽，所有的注單將一律被視為有效。",
                        "ART_ru_olympics_a_6": "若賽事未按照正常開賽時間進行，但在奧林匹克運動會結束的官方時間內完成，所有的冠軍投注仍然有效，投注的輸贏將根據國際奧林匹克委員會(IOC)官方公佈的賽果而定。若其中有一場賽事未徹底完成和官方未公佈結果，所有投注將被視為無效。",
                        "ART_ru_olympics_a_7": "如果比賽提前開賽，只有在開賽之前投注的注單將被視為有效投注。在開賽之後投注的注單將被視為無效投注，滾球投注類型不包括在內。",
                        "ART_ru_olympics_a_8": "如果該場賽事沒有舉行頒獎儀式，投注的輸贏將依據國際滑雪聯盟(FIS)、國際滑冰聯盟(ISU)、國際冬季兩項全能聯盟(IBU)、國際奧林匹克委員會(IOC) 或任何官方公佈的正式賽果而定。 ",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_olympics": "OLYMPICS",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "04/03/2015",
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_olympics_a_1": "Bets are subjected to rules which are applicable for each sport, (e.g. Soccer, Tennis, Bowling, Biathlon, Curling etc) found in our general sports rules.",
                        "ART_ru_olympics_a_2": "General betting rules are applicable to any situations not covered by these rules.",
                        "ART_ru_olympics_a_3": "For betting purposes, participants awarded Gold, Silver and Bronze at the medal ceremony will be deemed as the 1st, 2nd and 3rd place winner.",
                        "ART_ru_olympics_a_4": "Podium positions will count as the official results, regardless of any subsequent disqualification or amendment to the result.",
                        "ART_ru_olympics_a_5": "All bets will still stand even if an individual, team or crew competes or not.",
                        "ART_ru_olympics_a_6": "All Outright bets will be considered valid if the event is completed within the official period of the Olympic Games, irrespective of the actual start time. Bets will also be considered valid if an official result is declared by the Official International Olympic Committee (IOC). Should a match be uncompleted, and no official result is given, then all bets will be considered void and all wagers placed will be refunded.",
                        "ART_ru_olympics_a_7": "If the event starts before the scheduled time, only bets placed before the event commenced will be considered valid. Bets placed after the event commenced will be considered void. This excludes In-Play bet types.",
                        "ART_ru_olympics_a_8": "Bets are settled according to the official results of the International Olympic Committee (IOC) or any official body deemed to have such authority for competitions even in the absence of a medal ceremony.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_olympics": "奥林匹克或相关事件投注",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "04/03/2015",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_olympics_a_1": "如果是\"体育博彩规则\"内有的体育项目，则将依该项目规则为准，例如：足球依据足球规则、网球依据网球规则，拳击依据拳击规则等。 ",
                        "ART_ru_olympics_a_2": "\"常用规则\"将被应用于比赛，除非另有特别说明。",
                        "ART_ru_olympics_a_3": "参赛者获得金，银，铜牌将被视为第一，第二和第三名获奖者。",
                        "ART_ru_olympics_a_4": "每场赛事的结果均以奖台上排名为最终结果。如之后发生丧失资格或结果修正将不予以计算。",
                        "ART_ru_olympics_a_5": "无论是团队或个人是否参加比赛，所有的注单将一律被视为有效。",
                        "ART_ru_olympics_a_6": "若赛事未按照正常开赛时间进行，但在奥林匹克运动会结束的官方时间内完成，所有的冠军投注仍然有效，投注的输赢将根据国际奥林匹克委员会(IOC)官方公布的赛果而定。若其中有一场赛事未彻底完成和官方未公布结果，所有投注将被视为无效。",
                        "ART_ru_olympics_a_7": "如果比赛提前开赛，只有在开赛之前投注的注单将被视为有效投注。在开赛之后投注的注单将被视为无效投注，滚球投注类型不包括在内。",
                        "ART_ru_olympics_a_8": "如果该场赛事没有举行颁奖仪式，投注的输赢将依据国际滑雪联盟(FIS)、国际滑冰联盟(ISU)、国际冬季两项全能联盟(IBU)、国际奥林匹克委员会(IOC) 或任何官方公布的正式赛果而定。 ",
                        ';
                        break;
                }
                break;
            case "rowing":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_rowing": "賽艇和皮划艇",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "04/03/2015",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_rowing_a_1": "每場賽事的結果均以獎台上排名為最終結果。如之後發生喪失資格或結果修正將不予以計算。 ",
                        "ART_ru_rowing_a_2": "如賽事中斷，取消，暫停或者延期，同時直到官方開賽時間12小時後還沒有重新開始，賽果將被視為無效，並且所有的注單將被取消。公司最終決定取消所有的投注是不會參考官方裁判或相關管理機構的任何判決。",
                        "ART_ru_rowing_a_3": "如果該場賽事沒有舉行頒獎儀式，投注的輸贏將依據 F.​​I.S.A（國際體聯，賽艇）和 I.C.F（國際體聯，皮划艇）公佈的正式賽果而定。 ",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_rowing": "ROWING / CANOEING",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "04/03/2015",
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_rowing_a_1": "Podium positions will count as the official results, regardless of any subsequent disqualification or amendment to the result. ",
                        "ART_ru_rowing_a_2": "If the event starts before the scheduled time, only bets placed before the event commenced will be considered valid. Bets placed after the event commenced will be considered void. This excludes In-Play bet types.",
                        "ART_ru_rowing_a_3": "Bets will be settled according to the official F.I.S.A (Rowing) and I.C.F (Canoeing) result immediately at the end of the event, even in the absence of a medal ceremony.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_rowing": "赛艇和皮划艇",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "04/03/2015",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_rowing_a_1": "每场赛事的结果均以奖台上排名为最终结果。如之后发生丧失资格或结果修正将不予以计算。 ",
                        "ART_ru_rowing_a_2": "如赛事中断，取消，暂停或者延期，同时直到官方开赛时间12小时后还没有重新开始，赛果将被视为无效，并且所有的注单将被取消。公司最终决定取消所有的投注是不会参考官方裁判或相关管理机构的任何判决。",
                        "ART_ru_rowing_a_3": "如果该场赛事没有举行颁奖仪式，投注的输赢将依据 F.​​I.S.A（国际体联，赛艇）和 I.C.F（国际体联，皮划艇）公布的正式赛果而定。 ",
                        ';
                        break;
                }
                break;
            case "rugby_league":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_rugby_league": "橄欖球聯盟/英式橄欖球聯賽",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "27/10/2017",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_rugby_league_a_1": "如果比賽場地有變更，所有注單將被取消。",
                        "ART_ru_rugby_league_a_2": "除非另有注明, 所有英式橄欖球和聯盟式橄欖球注單的結算將以80分鐘完場時間的賽果為准。",
                        "ART_ru_rugby_league_a_3": "比賽的‘80分鐘’完場時間包括任何傷停補時。",
                        "ART_ru_rugby_league_a_4": "除非另有注明投注種類，所有比賽不包括加時時間。",
                        "ART_ru_rugby_league_a_5": "所有滾球投注的結算將以80分鐘完場時間的賽果為准。",
                        "ART_ru_rugby_league_a_6": "對於國際賽事，只要變更的場地仍在同一個國家內，所有注單將保持有效。",
                        "ART_ru_rugby_league_a_7": "所有上半場的投注將以上半場結束後的賽果結算。",
                        "ART_ru_rugby_league_a_8": "下半場的投注將以下半場（包括任何傷停補時或加時賽）後的賽果結算。",
                        "ART_ru_rugby_league_a_9": "如果賽事是在上半場中斷，所有上半場的注單將被取消。如果賽事是在下半場或加時賽中斷，所有上半場的投注保持有效，但所有下半場的注單將被取消。",
                    
                        "ART_ru_bettype": "投注類型",
                    
                        "ART_ru_rugby_league_b": "冠軍預測（平局退款）",
                        "ART_ru_rugby_league_b_1": "預測哪一支球隊在完場時間結束比賽勝出。",
                        "ART_ru_rugby_league_b_2": "如果比賽結果在完場時間後為平局，所有注單將被取消。",
                    
                        "ART_ru_rugby_league_c": "冠軍預測（包括加時賽）",
                        "ART_ru_rugby_league_c_1": "預測哪一支球隊將在比賽勝出。",
                        "ART_ru_rugby_league_c_2": "完場時間和加時賽的比賽結果適用。",
                        "ART_ru_rugby_league_c_3": "如果在完場時間和加時賽的結算後為平局，所有冠軍預測（包括加時賽）的注單將被取消。",
                    
                        "ART_ru_rugby_league_d": "獨贏",
                        "ART_ru_rugby_league_d_1": "預測哪一支球隊將在完場時間比賽勝出或平局。",
                        "ART_ru_rugby_league_d_1-1": "盤口提供兩支球隊和平局為投注選項。",
                    
                        "ART_ru_rugby_league_e": "獨贏 - 上半場",
                        "ART_ru_rugby_league_e_1": "預測哪一支球隊將在上半場比賽勝出或平局。",
                        "ART_ru_rugby_league_e_1-1": "盤口提供兩支球隊和平局為投注選項。",
                    
                        "ART_ru_rugby_league_f": "獨贏 - 下半場",
                        "ART_ru_rugby_league_f_1": "預測哪一支球隊將在下半場比賽勝出或平局。",
                        "ART_ru_rugby_league_f_1-1": "盤口提供兩支球隊和平局為投注選項。",
                    
                        "ART_ru_rugby_league_g": "讓球",
                        "ART_ru_rugby_league_g_1": "預測哪一支球隊在賽事指定的讓分數贏得比賽。",
                        "ART_ru_rugby_league_g_2": "結算是以完場時間結束後最終比分，包含下注時的當時比分。",
                    
                        "ART_ru_rugby_league_h": "讓球 - 上半場",
                        "ART_ru_rugby_league_h_1": "預測哪一支球隊在上半場中賽事指定的讓分數贏得比賽。",
                        "ART_ru_rugby_league_h_2": "結算是以上半場結束後最終比分，包含下注時的當時比分。",
                    
                        "ART_ru_rugby_league_i": "讓球（包括加時賽）",
                        "ART_ru_rugby_league_i_1": "預測哪一支球隊將在比賽勝出。",
                        "ART_ru_rugby_league_i_2": "完場時間和加時賽的比賽結果適用。",
                        "ART_ru_rugby_league_i_3": "結算是以包括加時賽最終比分（如果有注明），包含下注時的當時比分。",
                    
                        "ART_ru_rugby_league_j": "總分： 大 / 小",
                        "ART_ru_rugby_league_j_1": "預測賽事在完場時間，兩隊總比分將大於或小於在盤口指定的大/小盤分數。",
                        "ART_ru_rugby_league_j_2": "如果賽事在任何階段中斷並且之後沒有任何顯著會影響賽事結果的情況，大/小盤注單視為無效注單。",
                    
                        "ART_ru_rugby_league_k": "總分: 大 / 小 - 上半場",
                        "ART_ru_rugby_league_k_1": "預測賽事在上半場，兩隊總比分將大於或小於在盤口指定的大/小盤分數。",
                        "ART_ru_rugby_league_k_2": "如果賽事在上半場中斷並且之後沒有任何顯著會影響賽事結果的情況，大/小盤注單視為無效注單。",
                    
                        "ART_ru_rugby_league_l": "總分 - 3項投注：",
                        "ART_ru_rugby_league_l_1": "預測賽事在完場時間，兩隊總比分將大於或小於或在盤口指定的大/小盤比分範圍內。",
                        "ART_ru_rugby_league_l_2": "例如：如果提供的比分範圍是50-60，如果最後的比分是49或更少「小」會是一個成功的選擇，如果最後的比分是61以上或61內，相對於」大將是一個成功的選擇，如果投注區間，而最後的比分在50-60之間的任何地方，則會是一個成功的投注。",
                        "ART_ru_rugby_league_l_3": "如果賽事在任何階段中斷並且之後沒有任何顯著會影響賽事結果的情況，所有注單視為無效注單。",
                    
                        "ART_ru_rugby_league_m": "球隊得分：大/小",
                        "ART_ru_rugby_league_m_1": "預測賽事，指定的球隊總比分將大於或小於盤口指定的大/小盤口比分。",
                        "ART_ru_rugby_league_m_2": "如果賽事在任何階段中斷並且之後沒有任何顯著會影響賽事結果的情況，所有大/小盤注單視為無效注單。",
                    
                        "ART_ru_rugby_league_n": "球隊得分：大/小－上半場",
                        "ART_ru_rugby_league_n_1": "預測賽事，指定的球隊總比分將大於或小於盤口指定的大/小盤比分。",
                        "ART_ru_rugby_league_n_2": "如果賽事在上半場中斷並且之後沒有任何顯著會影響賽事結果的情況，所有大/小盤注單視為無效注單。",
                    
                        "ART_ru_rugby_league_o": "主隊得分：大/小－上半場",
                        "ART_ru_rugby_league_o_1": "預測賽事在上半場完場時間，主隊得分將大於或小於盤口指定的大/小盤比分。",
                        "ART_ru_rugby_league_o_2": "如果賽事在上半場中斷並且之後沒有任何顯著會影響賽事結果的情況，所有大/小盤注單視為無效注單。",
                    
                        "ART_ru_rugby_league_p": "客隊得分：大/小－上半場",
                        "ART_ru_rugby_league_p_1": "預測賽事在上半場完場時間，客隊得分將大於或小於盤口指定的大/小盤比分。",
                        "ART_ru_rugby_league_p_2": "如果賽事在上半場中斷並且之後沒有任何顯著會影響賽事結果的情況，所有大/小盤注單視為無效注單。",
                    
                        "ART_ru_rugby_league_q": "觸地得分",
                        "ART_ru_rugby_league_q_1": "預測比賽中哪一支球隊會成為下一個觸地得分的球隊。",
                        "ART_ru_rugby_league_q_2": "如果賽事在指定球隊觸地得分前中斷，則所有投注將被視為無效。",
                    
                        "ART_ru_rugby_league_r": "（觸地得分後再把球射中球門的）附加得分",
                        "ART_ru_rugby_league_r_1": "預測比賽中哪一支球隊會成為最後觸地得分的球隊。",
                        "ART_ru_rugby_league_r_2": "如果裁判命令轉換觸地得分球隊，則賽事結果將視為可接受的。",
                        "ART_ru_rugby_league_r_3": "如果最後觸地得分球隊放棄加踢射門，則所有注單將被視為無效。",
                        "ART_ru_rugby_league_r_4": "如果觸地得分是罰踢觸地得分，則盤口的注單將被取消。",
                    
                        "ART_ru_rugby_league_s": "觸地得分總分：大／小盤",
                        "ART_ru_rugby_league_s_1": "預測賽事，觸地得分總分將大於或小於盤口指定的大/小盤比分。",
                        "ART_ru_rugby_league_s_2": "如果賽事在任何階段中斷並且之後沒有任何顯著會影響賽事結果的情況，所有大/小盤注單視為無效注單。",
                    
                        "ART_ru_rugby_league_t": "觸地得分（球隊）：大／小盤",
                        "ART_ru_rugby_league_t_1": "預測賽事，觸地得分總分（主隊或客隊）將大於或小於盤口指定的大/小盤比分。",
                        "ART_ru_rugby_league_t_2": "如果賽事在任何階段中斷並且之後沒有任何顯著會影響賽事結果的情況，所有大/小盤注單視為無效注單。",
                    
                        "ART_ru_rugby_league_u": "主隊觸地得分",
                        "ART_ru_rugby_league_u_1": "預測賽事，主隊是否在任何完場時間內觸地多得一分或更多。",
                    
                        "ART_ru_rugby_league_v": "客隊觸地得分",
                        "ART_ru_rugby_league_v_1": "預測賽事，客隊是否在任何完場時間內觸地多得一分或更多。",
                    
                        "ART_ru_rugby_league_w": "主隊觸地得分二分或更多",
                        "ART_ru_rugby_league_w_1": "預測賽事，主隊是否在任何完場時間內觸地多得二分或更多。",
                    
                        "ART_ru_rugby_league_x": "客隊觸地得分二分或更多",
                        "ART_ru_rugby_league_x_1": "預測賽事，客隊是否在任何完場時間內觸地多得二分或更多。",
                    
                        "ART_ru_rugby_league_y": "主隊觸地得分三分或更多",
                        "ART_ru_rugby_league_y_1": "預測賽事，主隊是否在任何完場時間內觸地多得三分或更多。",
                    
                        "ART_ru_rugby_league_z": "客隊觸地得分三分或更多",
                        "ART_ru_rugby_league_z_1": "預測賽事，客隊是否在任何完場時間內觸地多得三分或更多。",
                    
                        "ART_ru_rugby_league_aa": "淨勝分數（）",
                        "ART_ru_rugby_league_aa_1": "預測哪一支球隊在完場時間結束後為淨勝分數球隊。",
                        "ART_ru_rugby_league_aa_2": "結算將根據完場時間結束時雙方球隊所獲得的最後得分。",
                        "ART_ru_rugby_league_aa_3": "提供3種不同的方式:",
                        "ART_ru_rugby_league_aa_3_1": "Variable Point Band, e.g. X-X points.",
                        "ART_ru_rugby_league_aa_3_2": "10 Point Bands, e.g. 01-10, 11- 20, 21-30 etc.",
                        "ART_ru_rugby_league_aa_3_3": "5 Point Bands, e.g. 01-5, 6-10, 11-15, 16-20 etc.",
                        "ART_ru_rugby_league_aa_4": "I如果賽事在任何時候中斷，所有該場賽事的投注即被視為無效且取消。",
                    
                        "ART_ru_rugby_league_ab": "首個觸地得分球員",
                        "ART_ru_rugby_league_ab_1": "預測在80分鐘完場時間內首個觸地得分的球員。",
                        "ART_ru_rugby_league_ab_2": "如果投注的球員在首個觸地得分前參與比賽，所有注單將視為有效。",
                        "ART_ru_rugby_league_ab_3": "如果投注的球員在首個觸地得分後才進入比賽，所有注單將被取消。",
                        "ART_ru_rugby_league_ab_4": "如果投注的球員沒有參與比賽，所有注單將被取消。",
                    
                        "ART_ru_rugby_league_ac": "最後觸地得分球員",
                        "ART_ru_rugby_league_ac_1": "預測在80分鐘完場時間內最後觸地得分的球員。",
                        "ART_ru_rugby_league_ac_2": "如果投注的球員在比賽所規定的80分鐘完場時間內參與比賽，所有注單將視為有效。",
                        "ART_ru_rugby_league_ac_3": "如果投注的球員沒有參與比賽，所有注單將被取消。",
                    
                        "ART_ru_rugby_league_ad": "觸地得分球員",
                        "ART_ru_rugby_league_ad_1": "預測在80分鐘完場時間內投注的球員是否會觸地得分。",
                        "ART_ru_rugby_league_ad_2": "如果投注的球員在比賽所ad定的80分鐘完場時間內參與比賽，所有注單將視為有效。",
                        "ART_ru_rugby_league_ad_3": "如果投注的球員沒有參與比賽，所有注單將被取消。",
                        "ART_ru_rugby_league_ad_4": "如果賽事在某個球員觸地得分後中斷，所有投注觸地得分球員的注單將保持有效。",
                    
                        "ART_ru_rugby_league_ae": "首個觸地得分球隊",
                        "ART_ru_rugby_league_ae_1": "預測首個觸地得分的球隊。",
                        "ART_ru_rugby_league_ae_2": "點球將不計算在內。",
                        "ART_ru_rugby_league_ae_2-1": "如果出現點球，下一個得分才被視為有效。",
                        "ART_ru_rugby_league_ae_3": "如果賽事在有得分後中斷，所有首個觸地得分球隊的注單將保持有效。",
                        "ART_ru_rugby_league_ae_4": "如果賽事在沒有球隊觸地得分前中斷，所有首個觸地得分球隊的注單將被取消。",
                        "ART_ru_rugby_league_ae_5": "如果賽事在80分鐘完場時間以及傷停補時內沒有球隊觸地得分，所有首個觸地得分球隊的注單將被取消。",
                    
                        "ART_ru_rugby_league_af": "最後觸地得分球隊",
                        "ART_ru_rugby_league_af_1": "預測最後觸地得分的球隊。",
                        "ART_ru_rugby_league_af_2": "點球將不計算在內。",
                        "ART_ru_rugby_league_af_2-1": "如果出現點球，下一個得分才被視為有效。",
                        "ART_ru_rugby_league_af_3": "如果賽事中斷，所有最後觸地得分球隊的注單將被取消。",
                        "ART_ru_rugby_league_af_4": "如果賽事在80分鐘完場時間以及傷停補時內沒有球隊觸地得分，所有最後觸地得分球隊的注單將被取消。",
                    
                        "ART_ru_rugby_league_ag": "首個得分球隊",
                        "ART_ru_rugby_league_ag_1": "預測在比賽時(包括點球賽)，首個得分的球隊。",
                        "ART_ru_rugby_league_ag_2": "如果賽事在有球隊得分後中斷，所有首個得分球隊的注單將保持有效。",
                        "ART_ru_rugby_league_ag_3": "如果賽事在沒有球隊得分前中斷，所有首個得分球隊的注單將被取消。",
                        "ART_ru_rugby_league_ag_4": "如果賽事在80分鐘完場時間以及傷停補時內沒有球隊得分，所有首個得分球隊的注單將被取消。",
                    
                        "ART_ru_rugby_league_ah": "最後得分球隊",
                        "ART_ru_rugby_league_ah_1": "預測在比賽時(包括點球賽)，最後得分的球隊。",
                        "ART_ru_rugby_league_ah_2": "如果賽事中斷，所有最後得分球隊的注單將被取消。",
                        "ART_ru_rugby_league_ah_3": "如果賽事在80分鐘完場時間以及傷停補時內沒有球隊得分，所有最後得分球隊的注單將被取消。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_rugby_league": "RUGBY UNION / RUGBY LEAGUE",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "27/10/2017",
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_rugby_league_a_1": "If the scheduled venue is changed, all bets will be considered void. ",
                        "ART_ru_rugby_league_a_2": "Unless otherwise stated, all Rugby Union and Rugby League bets are settled based on the scheduled \"80 minutes\" play. ",
                        "ART_ru_rugby_league_a_3": "Regular time refers to \"80 minutes\" play and includes any stoppage time.",
                        "ART_ru_rugby_league_a_4": "Matches do not include Extra Time unless otherwise stated in the bet type name.",
                        "ART_ru_rugby_league_a_5": "All In Play bets will be settled based on the outcome at the end of the scheduled \"80 minutes\" play. ",
                        "ART_ru_rugby_league_a_6": "For International matches, as long as the change in venue is within same country, all bets are considered valid. ",
                        "ART_ru_rugby_league_a_7": "For 1st half betting, bets are settled based on the result derived from the 1st half of the match. ",
                        "ART_ru_rugby_league_a_8": "For 2nd half betting, bets are settled based on the result derived from the 2nd half of the match, including any extra time. ",
                        "ART_ru_rugby_league_a_9": "If a match is abandoned during the 1st half, all 1st half bets are considered void. If a match is suspended abandoned during the 2nd half or during extra time, all 2nd half bets are considered void, unless otherwise stated in the individual bet type rules. All 1st half bets will still be valid. ",
                        "ART_ru_bettype": "BET TYPES",
                    
                        "ART_ru_rugby_league_b": "Winner (Draw No Bet)",
                        "ART_ru_rugby_league_b_1": "Predict who will be the match winner at the end of regular time.",
                        "ART_ru_rugby_league_b_2": "If the result of the match at the end of regular time is a draw, then all bets will be refunded.",
                    
                        "ART_ru_rugby_league_c": "Winner (including Extra Time)",
                        "ART_ru_rugby_league_c_1": "Predict who will be the match winner.",
                        "ART_ru_rugby_league_c_2": "Regular time and Extra time are applicable to the result of this market.",
                        "ART_ru_rugby_league_c_3": "If there is no winner after Extra Time and the result is declared a draw, then all bets will be refunded.",
                    
                        "ART_ru_rugby_league_d": "1 x 2",
                        "ART_ru_rugby_league_d_1": "Predict which team will be the match winner or whether the match will end as a draw after regular time.",
                        "ART_ru_rugby_league_d_1-1": "",
                    
                        "ART_ru_rugby_league_e": "1 x 2 – 1st Half",
                        "ART_ru_rugby_league_e_1": "Predict which team will be the match winner or whether the match will end as a draw after the 1st Half of regular time.",
                        "ART_ru_rugby_league_e_1-1": "",
                    
                        "ART_ru_rugby_league_f": "1 x 2 – 2nd Half",
                        "ART_ru_rugby_league_f_1": "Predict who will be the match winner or whether the match will end as a draw after the 2nd Half of regular time.",
                        "ART_ru_rugby_league_f_1-1": "",
                    
                        "ART_ru_rugby_league_g": "Handicap",
                        "ART_ru_rugby_league_g_1": "Predict the winner of the match with the indicated handicap applied.",
                        "ART_ru_rugby_league_g_2": "Settlement is based on the final score at the end of regular time, including the stated handicap applied to each team at time of bet placement.",
                    
                        "ART_ru_rugby_league_h": "Handicap – 1st Half",
                        "ART_ru_rugby_league_h_1": "Predict the winner of the 1st half of regular time with the indicated handicap applied.",
                        "ART_ru_rugby_league_h_2": "Settlement is based on the final score at the end of the 1st half, including the stated handicap applied to each team at time of bet placement.",
                    
                        "ART_ru_rugby_league_i": "Handicap (including Extra Time)",
                        "ART_ru_rugby_league_i_1": "Predict who will be the match winner.",
                        "ART_ru_rugby_league_i_2": "Regular time and Extra time are applicable to the result of this market.",
                        "ART_ru_rugby_league_i_3": "Settlement is based on the final score at the end of Extra Time (if required), including the stated handicap applied to each team at time of bet placement.",
                    
                        "ART_ru_rugby_league_j": "Total Points: Over / Under",
                        "ART_ru_rugby_league_j_1": "Predict whether the total number of points scored by both teams in regular time will be over or under the indicated total line.",
                        "ART_ru_rugby_league_j_2": "If a match is abandoned at any stage, all Over / Under bets will be considered void, unless the market has been unconditionally determined as any further potential points will have no affect on the market result.",
                    
                        "ART_ru_rugby_league_k": "Total Points: Over / Under – 1st Half",
                        "ART_ru_rugby_league_k_1": "Predict whether the total number of points scored by both teams in the 1st half will be over or under the indicated total line.",
                        "ART_ru_rugby_league_k_2": "If a match is abandoned in the 1st Half, all Over / Under bets will be considered void, unless the market has been unconditionally determined as any further potential points will have no effect on the market result.",
                    
                        "ART_ru_rugby_league_l": "Total Points 3-Way",
                        "ART_ru_rugby_league_l_1": "Predict whether the total number of points scored by both teams will be over, under or between the points range offered, at the end of regular time. ",
                        "ART_ru_rugby_league_l_2": "E.g. If the points range offered was 50-60, then ‘Under’ would be a winning bet if final score was 49 or less, ‘Over’ would be a winning bet if the final score was 61 or more and ‘Between’ would be a winning bet if the final score was anywhere between 50-60 (inclusive of both numbers). ",
                        "ART_ru_rugby_league_l_3": "If a match is abandoned at any stage, all bets will be considered void, unless the market has been unconditionally determined as any further potential points will have no affect on the market result. ",
                    
                        "ART_ru_rugby_league_m": "Team Points: Over / Under",
                        "ART_ru_rugby_league_m_1": "Predict whether the total number of points scored by the stated team will be over or under the indicated total line.",
                        "ART_ru_rugby_league_m_2": "If a match is abandoned at any stage, all Over / Under bets will be considered void, unless the market has been unconditionally determined as any further potential points will have no affect on the market result.",
                    
                        "ART_ru_rugby_league_n": "Team Points: Over / Under – 1st Half",
                        "ART_ru_rugby_league_n_1": "Predict whether the total number of points scored by the stated team will be over or under the indicated total line.",
                        "ART_ru_rugby_league_n_2": "If a match is abandoned in the 1st Half, all Over / Under bets will be considered void, unless the market has been unconditionally determined as any further potential points will have no effect on the market result.",
                    
                        "ART_ru_rugby_league_o": "Home Team Points: Over / Under – 1st Half",
                        "ART_ru_rugby_league_o_1": "Predict whether the total number of points scored by the home team will be over or under the indicated total line at the end of the 1st half of regular time.",
                        "ART_ru_rugby_league_o_2": "If a match is abandoned in the 1st Half, all Over / Under bets will be considered void, unless the market has been unconditionally determined as any further potential points will have no effect on the market result.",
                    
                        "ART_ru_rugby_league_p": "Away Team Points: Over / Under – 1st Half",
                        "ART_ru_rugby_league_p_1": "Predict whether the total number of points scored by the away team will be over or under the indicated total line at the end of the 1st half of regular time.",
                        "ART_ru_rugby_league_p_2": "If a match is abandoned in the 1st Half, all Over / Under bets will be considered void, unless the market has been unconditionally determined as any further potential points will have no effect on the market result.",
                    
                        "ART_ru_rugby_league_q": "Try",
                        "ART_ru_rugby_league_q_1": "Predict which team will score the next Try in the match.",
                        "ART_ru_rugby_league_q_2": "If the match is abandoned before the stated Try is scored then all bets will be considered void.",
                    
                        "ART_ru_rugby_league_r": "Try Converted",
                        "ART_ru_rugby_league_r_1": "Predict whether the last Try scored will be converted by the team who scored the Try.",
                        "ART_ru_rugby_league_r_2": "If the referee orders the conversion to be retaken, then the result will be based on the next or further attempt deemed acceptable.",
                        "ART_ru_rugby_league_r_3": "If the conversion is not attempted by the scoring team, then all bets will be considered void.",
                        "ART_ru_rugby_league_r_4": "For Rugby Union only, if the Try is a Penalty Try, all bets on this market will be void.",
                    
                        "ART_ru_rugby_league_s": "Total Match Tries: Over / Under",
                        "ART_ru_rugby_league_s_1": "Predict whether the total number of match tries will be over or under the total line stated.",
                        "ART_ru_rugby_league_s_2": "If a match is abandoned at any stage, all Over / Under bets will be considered void, unless the market has been unconditionally determined as any further potential points will have no affect on the market result.",
                    
                        "ART_ru_rugby_league_t": "Match Tries (Team): Over / Under",
                        "ART_ru_rugby_league_t_1": "Predict whether the total number of match tries for the stated team (Home or Away) will be over or under the total line stated.",
                        "ART_ru_rugby_league_t_2": "If a match is abandoned at any stage, all Over / Under bets will be considered void, unless the market has been unconditionally determined as any further potential points will have no affect on the market result.",
                    
                        "ART_ru_rugby_league_u": "Home Team to Score a Try",
                        "ART_ru_rugby_league_u_1": "Predict whether the Home Team will score a single Try or more, at any point during regular time.",
                    
                        "ART_ru_rugby_league_v": "Away Team to Score a Try",
                        "ART_ru_rugby_league_v_1": "Predict whether the Away Team will score a single Try or more, at any point during regular time.",
                    
                        "ART_ru_rugby_league_w": "Home Team to Score 2 or More Tries",
                        "ART_ru_rugby_league_w_1": "Predict whether the Home Team will score a 2 Tries or more, at any point during regular time.",
                    
                        "ART_ru_rugby_league_x": "Away Team to Score 2 or More Tries",
                        "ART_ru_rugby_league_x_1": "Predict whether the Away Team will score a 2 Tries or more, at any point during regular time.",
                    
                        "ART_ru_rugby_league_y": "Home Team to Score 3 or More Tries",
                        "ART_ru_rugby_league_y_1": "Predict whether the Home Team will score a 3 Tries or more, at any point during regular time.",
                    
                        "ART_ru_rugby_league_z": "Away Team to Score 3 or More Tries",
                        "ART_ru_rugby_league_z_1": "Predict whether the Away Team will score a 3 Tries or more, at any point during regular time.",
                    
                        "ART_ru_rugby_league_aa": "Winning Margin (Point Bands)",
                        "ART_ru_rugby_league_aa_1": "Predict the winning margin for the winning team at the end of regular time.",
                        "ART_ru_rugby_league_aa_2": "Settlement will be based on the final scores recorded by both teams at the end of regular time.",
                        "ART_ru_rugby_league_aa_3": "The market may be offered in 3 different ways:",
                        "ART_ru_rugby_league_aa_3_1": "Variable Point Band, e.g. X-X points.",
                        "ART_ru_rugby_league_aa_3_2": "10 Point Bands, e.g. 01-10, 11- 20, 21-30 etc.",
                        "ART_ru_rugby_league_aa_3_3": "5 Point Bands, e.g. 01-5, 6-10, 11-15, 16-20 etc.",
                        "ART_ru_rugby_league_aa_4": "If the match is abandoned at any time, then all bets will be void.",
                    
                        "ART_ru_rugby_league_ab": "First Try Scorer",
                        "ART_ru_rugby_league_ab_1": "Predict if the selection will score the first try in the game (\"80 Minutes play\" only)",
                        "ART_ru_rugby_league_ab_2": "If the player takes part in the match before the first try has been scored, bets will stand.",
                        "ART_ru_rugby_league_ab_3": "If the player takes to the field after the first try has been scored, all bets are considered void.",
                        "ART_ru_rugby_league_ab_4": "If the player does not take part in the match, all bets are considered void.",
                    
                        "ART_ru_rugby_league_ac": "Last Try Scorer",
                        "ART_ru_rugby_league_ac_1": "Predict if the selection will score the last try in the game (\"80 Minutes play\" only)",
                        "ART_ru_rugby_league_ac_2": "If the player takes part in the match at any point during the scheduled \"80 minutes\" play, bets will stand.",
                        "ART_ru_rugby_league_ac_3": "If the player does not take part in the match, all bets are considered void.",
                    
                        "ART_ru_rugby_league_ad": "Anytime Try Scorer",
                        "ART_ru_rugby_league_ad_1": "Predict if the selection will score a try at anytime during the game (\"80 Minutes play\" only).",
                        "ART_ru_rugby_league_ad_2": "If the player takes part in the match at any point during the scheduled \"80 minutes\" play, bets will stand.",
                        "ART_ru_rugby_league_ad_3": "If the player does not take part in the match, all bets are considered void.",
                        "ART_ru_rugby_league_ad_4": "If the match is abandoned after a player has scored, then all bets for that player within the \"Anytime Try Scorer\" market will be considered valid.",
                    
                        "ART_ru_rugby_league_ae": "Team to Score First Try",
                        "ART_ru_rugby_league_ae_1": "Predict which team will score the first try in the game.",
                        "ART_ru_rugby_league_ae_2": "Penalty tries do not count and bets apply to the next try.",
                        "ART_ru_rugby_league_ae_2-1": "",
                        "ART_ru_rugby_league_ae_3": "If the game is abandoned at any time, and the first try has already been scored prior to the abandonment, all bets will stand.",
                        "ART_ru_rugby_league_ae_4": "If no try has been scored at the time of abandonment, all bets are considered void.",
                        "ART_ru_rugby_league_ae_5": "If no try has been scored after the scheduled \"80 minutes\" of normal play and stoppage time, then bets are considered void.",
                    
                        "ART_ru_rugby_league_af": "Team to Score Last Try",
                        "ART_ru_rugby_league_af_1": "Predict which team will score the last try in the game.",
                        "ART_ru_rugby_league_af_2": "Penalty tries do not count and bets apply to the next try.",
                        "ART_ru_rugby_league_af_2-1": "",
                        "ART_ru_rugby_league_af_3": "If the game is abandoned at any time, then all bets will be considered void.",
                        "ART_ru_rugby_league_af_4": "If no try has been scored after the scheduled \"80 minutes\" of normal play and stoppage time, then bets are considered void.",
                    
                        "ART_ru_rugby_league_ag": "Team to Score First",
                        "ART_ru_rugby_league_ag_1": "Predict which team will score first in the game.",
                        "ART_ru_rugby_league_ag_2": "If the game is abandoned at any time, and a team has already scored prior to the abandonment, all bets will stand.",
                        "ART_ru_rugby_league_ag_3": "If neither team has scored at the time of abandonment, all bets are considered void.",
                        "ART_ru_rugby_league_ag_4": "If neither team has scored after the scheduled \"80 minutes\" of normal play and stoppage time, then bets are considered void.",
                    
                        "ART_ru_rugby_league_ah": "Team to Score Last",
                        "ART_ru_rugby_league_ah_1": "Predict which team will score last in the game.",
                        "ART_ru_rugby_league_ah_2": "If the game is abandoned at any time, then all bets will be considered void.",
                        "ART_ru_rugby_league_ah_3": "If neither team has scored after the scheduled \"80 minutes\" of normal play and stoppage time, then bets are considered void.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_rugby_league": "橄榄球联盟/英式橄榄球联赛",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "27/10/2017",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_rugby_league_a_1": "如果比赛场地有变更，所有注单将被取消。",
                        "ART_ru_rugby_league_a_2": "除非另有注明, 所有英式橄榄球和联盟式橄榄球注单的结算将以80分钟完场时间的赛果为准。",
                        "ART_ru_rugby_league_a_3": "比赛的‘80分钟’完场时间包括任何伤停补时。",
                        "ART_ru_rugby_league_a_4": "除非另有注明投注种类，所有比赛不包括加时时间。",
                        "ART_ru_rugby_league_a_5": "所有滚球投注的结算将以80分钟完场时间的赛果为准。",
                        "ART_ru_rugby_league_a_6": "对于国际赛事，只要变更的场地仍在同一个国家内，所有注单将保持有效。",
                        "ART_ru_rugby_league_a_7": "所有上半场的投注将以上半场结束后的赛果结算。",
                        "ART_ru_rugby_league_a_8": "下半场的投注将以下半场（包括任何伤停补时或加时赛）后的赛果结算。",
                        "ART_ru_rugby_league_a_9": "如果赛事是在上半场中断，所有上半场的注单将被取消。如果赛事是在下半场或加时赛中断，所有上半场的投注保持有效，但所有下半场的注单将被取消。",
                    
                        "ART_ru_bettype": "投注类型",
                    
                        "ART_ru_rugby_league_b": "冠军预测（平局退款）",
                        "ART_ru_rugby_league_b_1": "预测哪一支球队在完场时间结束比赛胜出。",
                        "ART_ru_rugby_league_b_2": "如果比赛结果在完场时间后为平局，所有注单将被取消。",
                    
                        "ART_ru_rugby_league_c": "冠军预测（包括加时赛）",
                        "ART_ru_rugby_league_c_1": "预测哪一支球队将在比赛胜出。",
                        "ART_ru_rugby_league_c_2": "完场时间和加时赛的比赛结果适用。",
                        "ART_ru_rugby_league_c_3": "如果在完场时间和加时赛的结算后为平局，所有冠军预测（包括加时赛）的注单将被取消。",
                    
                        "ART_ru_rugby_league_d": "独赢",
                        "ART_ru_rugby_league_d_1": "预测哪一支球队将在完场时间比赛胜出或平局。",
                        "ART_ru_rugby_league_d_1-1": "盘口提供两支球队和平局为投注选项。",
                    
                        "ART_ru_rugby_league_e": "独赢 - 上半场",
                        "ART_ru_rugby_league_e_1": "预测哪一支球队将在上半场比赛胜出或平局。",
                        "ART_ru_rugby_league_e_1-1": "盘口提供两支球队和平局为投注选项。",
                    
                        "ART_ru_rugby_league_f": "独赢 - 下半场",
                        "ART_ru_rugby_league_f_1": "预测哪一支球队将在下半场比赛胜出或平局。",
                        "ART_ru_rugby_league_f_1-1": "盘口提供两支球队和平局为投注选项。",
                    
                        "ART_ru_rugby_league_g": "让球",
                        "ART_ru_rugby_league_g_1": "预测哪一支球队在赛事指定的让分数赢得比赛。",
                        "ART_ru_rugby_league_g_2": "结算是以完场时间结束后最终比分，包含下注时的当时比分。",
                    
                        "ART_ru_rugby_league_h": "让球 - 上半场",
                        "ART_ru_rugby_league_h_1": "预测哪一支球队在上半场中赛事指定的让分数赢得比赛。",
                        "ART_ru_rugby_league_h_2": "结算是以上半场结束后最终比分，包含下注时的当时比分。",
                    
                        "ART_ru_rugby_league_i": "让球（包括加时赛）",
                        "ART_ru_rugby_league_i_1": "预测哪一支球队将在比赛胜出。",
                        "ART_ru_rugby_league_i_2": "完场时间和加时赛的比赛结果适用。",
                        "ART_ru_rugby_league_i_3": "结算是以包括加时赛最终比分（如果有注明），包含下注时的当时比分。",
                    
                        "ART_ru_rugby_league_j": "总分： 大 / 小",
                        "ART_ru_rugby_league_j_1": "预测赛事在完场时间，两队总比分将大于或小于在盘口指定的大/小盘分数。",
                        "ART_ru_rugby_league_j_2": "如果赛事在任何阶段中断并且之后没有任何显著会影响赛事结果的情况，大/小盘注单视为无效注单。",
                    
                        "ART_ru_rugby_league_k": "总分: 大 / 小 - 上半场",
                        "ART_ru_rugby_league_k_1": "预测赛事在上半场，两队总比分将大于或小于在盘口指定的大/小盘分数。",
                        "ART_ru_rugby_league_k_2": "如果赛事在上半场中断并且之后没有任何显著会影响赛事结果的情况，大/小盘注单视为无效注单。",
                    
                        "ART_ru_rugby_league_l": "总分 - 3项投注：",
                        "ART_ru_rugby_league_l_1": "预测赛事在完场时间，两队总比分将大于或小于或在盘口指定的大/小盘比分范围内。",
                        "ART_ru_rugby_league_l_2": "例如：如果提供的比分范围是50-60，如果最后的比分是49或更少“小”会是一个成功的选择，如果最后的比分是61以上或61内，相对于”大将是一个成功的选择，如果投注区间，而最后的比分在50-60之间的任何地方，则会是一个成功的投注。",
                        "ART_ru_rugby_league_l_3": "如果赛事在任何阶段中断并且之后没有任何显著会影响赛事结果的情况，所有注单视为无效注单。",
                    
                        "ART_ru_rugby_league_m": "球队得分：大/小",
                        "ART_ru_rugby_league_m_1": "预测赛事，指定的球队总比分将大于或小于盘口指定的大/小盘口比分。",
                        "ART_ru_rugby_league_m_2": "如果赛事在任何阶段中断并且之后没有任何显著会影响赛事结果的情况，所有大/小盘注单视为无效注单。",
                    
                        "ART_ru_rugby_league_n": "球队得分：大/小－上半场",
                        "ART_ru_rugby_league_n_1": "预测赛事，指定的球队总比分将大于或小于盘口指定的大/小盘比分。",
                        "ART_ru_rugby_league_n_2": "如果赛事在上半场中断并且之后没有任何显著会影响赛事结果的情况，所有大/小盘注单视为无效注单。",
                    
                        "ART_ru_rugby_league_o": "主队得分：大/小－上半场",
                        "ART_ru_rugby_league_o_1": "预测赛事在上半场完场时间，主队得分将大于或小于盘口指定的大/小盘比分。",
                        "ART_ru_rugby_league_o_2": "如果赛事在上半场中断并且之后没有任何显著会影响赛事结果的情况，所有大/小盘注单视为无效注单。",
                    
                        "ART_ru_rugby_league_p": "客队得分：大/小－上半场",
                        "ART_ru_rugby_league_p_1": "预测赛事在上半场完场时间，客队得分将大于或小于盘口指定的大/小盘比分。",
                        "ART_ru_rugby_league_p_2": "如果赛事在上半场中断并且之后没有任何显著会影响赛事结果的情况，所有大/小盘注单视为无效注单。",
                    
                        "ART_ru_rugby_league_q": "触地得分",
                        "ART_ru_rugby_league_q_1": "预测比赛中哪一支球队会成为下一个触地得分的球队。",
                        "ART_ru_rugby_league_q_2": "如果赛事在指定球队触地得分前中断，则所有投注将被视为无效。",
                    
                        "ART_ru_rugby_league_r": "（触地得分后再把球射中球门的）附加得分",
                        "ART_ru_rugby_league_r_1": "预测比赛中哪一支球队会成为最后触地得分的球队。",
                        "ART_ru_rugby_league_r_2": "如果裁判命令转换触地得分球队，则赛事结果将视为可接受的。",
                        "ART_ru_rugby_league_r_3": "如果最后触地得分球队放弃加踢射门，则所有注单将被视为无效。",
                        "ART_ru_rugby_league_r_4": "如果触地得分是罚踢触地得分，则盘口的注单将被取消。",
                    
                        "ART_ru_rugby_league_s": "触地得分总分：大／小盘",
                        "ART_ru_rugby_league_s_1": "预测赛事，触地得分总分将大于或小于盘口指定的大/小盘比分。",
                        "ART_ru_rugby_league_s_2": "如果赛事在任何阶段中断并且之后没有任何显著会影响赛事结果的情况，所有大/小盘注单视为无效注单。",
                    
                        "ART_ru_rugby_league_t": "触地得分（球队）：大／小盘",
                        "ART_ru_rugby_league_t_1": "预测赛事，触地得分总分（主队或客队）将大于或小于盘口指定的大/小盘比分。",
                        "ART_ru_rugby_league_t_2": "如果赛事在任何阶段中断并且之后没有任何显著会影响赛事结果的情况，所有大/小盘注单视为无效注单。",
                    
                        "ART_ru_rugby_league_u": "主队触地得分",
                        "ART_ru_rugby_league_u_1": "预测赛事，主队是否在任何完场时间内触地多得一分或更多。",
                    
                        "ART_ru_rugby_league_v": "客队触地得分",
                        "ART_ru_rugby_league_v_1": "预测赛事，客队是否在任何完场时间内触地多得一分或更多。",
                    
                        "ART_ru_rugby_league_w": "主队触地得分二分或更多",
                        "ART_ru_rugby_league_w_1": "预测赛事，主队是否在任何完场时间内触地多得二分或更多。",
                    
                        "ART_ru_rugby_league_x": "客队触地得分二分或更多",
                        "ART_ru_rugby_league_x_1": "预测赛事，客队是否在任何完场时间内触地多得二分或更多。",
                    
                        "ART_ru_rugby_league_y": "主队触地得分三分或更多",
                        "ART_ru_rugby_league_y_1": "预测赛事，主队是否在任何完场时间内触地多得三分或更多。",
                    
                        "ART_ru_rugby_league_z": "客队触地得分三分或更多",
                        "ART_ru_rugby_league_z_1": "预测赛事，客队是否在任何完场时间内触地多得三分或更多。",
                    
                        "ART_ru_rugby_league_aa": "净胜分数（）",
                        "ART_ru_rugby_league_aa_1": "预测哪一支球队在完场时间结束后为净胜分数球队。",
                        "ART_ru_rugby_league_aa_2": "结算将根据完场时间结束时双方球队所获得的最后得分。",
                        "ART_ru_rugby_league_aa_3": "提供3种不同的方式:",
                        "ART_ru_rugby_league_aa_3_1": "Variable Point Band, e.g. X-X points.",
                        "ART_ru_rugby_league_aa_3_2": "10 Point Bands, e.g. 01-10, 11- 20, 21-30 etc.",
                        "ART_ru_rugby_league_aa_3_3": "5 Point Bands, e.g. 01-5, 6-10, 11-15, 16-20 etc.",
                        "ART_ru_rugby_league_aa_4": "I如果赛事在任何时候中断，所有该场赛事的投注即被视为无效且取消。",
                    
                        "ART_ru_rugby_league_ab": "首个触地得分球员",
                        "ART_ru_rugby_league_ab_1": "预测在80分钟完场时间内首个触地得分的球员。",
                        "ART_ru_rugby_league_ab_2": "如果投注的球员在首个触地得分前参与比赛，所有注单将视为有效。",
                        "ART_ru_rugby_league_ab_3": "如果投注的球员在首个触地得分后才进入比赛，所有注单将被取消。",
                        "ART_ru_rugby_league_ab_4": "如果投注的球员没有参与比赛，所有注单将被取消。",
                    
                        "ART_ru_rugby_league_ac": "最后触地得分球员",
                        "ART_ru_rugby_league_ac_1": "预测在80分钟完场时间内最后触地得分的球员。",
                        "ART_ru_rugby_league_ac_2": "如果投注的球员在比赛所规定的80分钟完场时间内参与比赛，所有注单将视为有效。",
                        "ART_ru_rugby_league_ac_3": "如果投注的球员没有参与比赛，所有注单将被取消。",
                    
                        "ART_ru_rugby_league_ad": "触地得分球员",
                        "ART_ru_rugby_league_ad_1": "预测在80分钟完场时间内投注的球员是否会触地得分。",
                        "ART_ru_rugby_league_ad_2": "如果投注的球员在比赛所ad定的80分钟完场时间内参与比赛，所有注单将视为有效。",
                        "ART_ru_rugby_league_ad_3": "如果投注的球员没有参与比赛，所有注单将被取消。",
                        "ART_ru_rugby_league_ad_4": "如果赛事在某个球员触地得分后中断，所有投注触地得分球员的注单将保持有效。",
                    
                        "ART_ru_rugby_league_ae": "首个触地得分球队",
                        "ART_ru_rugby_league_ae_1": "预测首个触地得分的球队。",
                        "ART_ru_rugby_league_ae_2": "点球将不计算在内。",
                        "ART_ru_rugby_league_ae_2-1": "如果出现点球，下一个得分才被视为有效。",
                        "ART_ru_rugby_league_ae_3": "如果赛事在有得分后中断，所有首个触地得分球队的注单将保持有效。",
                        "ART_ru_rugby_league_ae_4": "如果赛事在没有球队触地得分前中断，所有首个触地得分球队的注单将被取消。",
                        "ART_ru_rugby_league_ae_5": "如果赛事在80分钟完场时间以及伤停补时内没有球队触地得分，所有首个触地得分球队的注单将被取消。",
                    
                        "ART_ru_rugby_league_af": "最后触地得分球队",
                        "ART_ru_rugby_league_af_1": "预测最后触地得分的球队。",
                        "ART_ru_rugby_league_af_2": "点球将不计算在内。",
                        "ART_ru_rugby_league_af_2-1": "如果出现点球，下一个得分才被视为有效。",
                        "ART_ru_rugby_league_af_3": "如果赛事中断，所有最后触地得分球队的注单将被取消。",
                        "ART_ru_rugby_league_af_4": "如果赛事在80分钟完场时间以及伤停补时内没有球队触地得分，所有最后触地得分球队的注单将被取消。",
                    
                        "ART_ru_rugby_league_ag": "首个得分球队",
                        "ART_ru_rugby_league_ag_1": "预测在比赛时(包括点球赛)，首个得分的球队。",
                        "ART_ru_rugby_league_ag_2": "如果赛事在有球队得分后中断，所有首个得分球队的注单将保持有效。",
                        "ART_ru_rugby_league_ag_3": "如果赛事在没有球队得分前中断，所有首个得分球队的注单将被取消。",
                        "ART_ru_rugby_league_ag_4": "如果赛事在80分钟完场时间以及伤停补时内没有球队得分，所有首个得分球队的注单将被取消。",
                    
                        "ART_ru_rugby_league_ah": "最后得分球队",
                        "ART_ru_rugby_league_ah_1": "预测在比赛时(包括点球赛)，最后得分的球队。",
                        "ART_ru_rugby_league_ah_2": "如果赛事中断，所有最后得分球队的注单将被取消。",
                        "ART_ru_rugby_league_ah_3": "如果赛事在80分钟完场时间以及伤停补时内没有球队得分，所有最后得分球队的注单将被取消。",
                        ';
                        break;
                }
                break;
            case "softball":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_softball": "壘球",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "19/07/2016",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_softball_a_1": "當投在比分線上和總分（大/小）比賽必須進行第七局（或者6.5局，當第二個擊球隊已經提前出線）獲取結果。如果比賽在加時賽暫停，比分將以最後一個完整局計算，除非主隊比分已經領先，或者在後面局領先，此時比分以比賽停止時間的比分為準。",
                        "ART_ru_softball_a_2": "所有投注都以官方公佈的最終結果為準，包括加時賽（使用時）。",
                        "ART_ru_softball_a_3": "如果原定比賽場地更改， 所有的投注將被視為無效。",
                        "ART_ru_softball_a_4": "如果比賽提前開賽，只有在開賽之前投注的注單將為視為有效投注。在開賽后投注的注單將被視為無效， 滾球玩法除外。",
                    
                        "ART_ru_bettype": "投注類型",
                    
                        "ART_ru_softball_b": "獨贏",
                        "ART_ru_softball_b_1": "預測誰將贏取比賽的勝利。",
                        "ART_ru_softball_b_2": "加時賽計算在內。",
                    
                        "ART_ru_softball_c": "讓分",
                        "ART_ru_softball_c_1": "預測誰將獲取讓分盤的比賽/賽節的勝利。",
                        "ART_ru_softball_c_2": "加時賽計算在內。",
                    
                        "ART_ru_softball_d": "大小分",
                        "ART_ru_softball_d_1": "預測賽事總得分將大於或小於指定的盤口。",
                        "ART_ru_softball_d_2": "加時賽計算在內。",
                        "ART_ru_softball_d_3": "如果賽事中斷前已有明確結果並且之後沒有任何顯著會影響賽事結果的情況，大小分投注的注單才會被結算。若遇到任何其他情況，注單將一律被取消。",
                    
                        "ART_ru_softball_e": "單/雙",
                        "ART_ru_softball_e_1": "預測賽事的總得分是單數或雙數。",
                        "ART_ru_softball_e_2": "加時賽計算在內。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_softball": "SOFTBALL",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "13/07/2016",
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_softball_a_1": "When betting on the Run Line and Total Runs (over/under) the game must conduct 7 innings (or 6.5 innings, when the 2nd batting team is already ahead) to have a result. If a game is called or suspended in an extra innings, the score will be determined after the last full inning unless the home team scores to tie, or takes the lead in the bottom half of the inning, in which case the score is determined at the time the game is called.",
                        "ART_ru_softball_a_2": "The result is based on the official outright result of the match, including extra innings (when applicable).",
                        "ART_ru_softball_a_3": "If the scheduled venue is changed, all bets will be considered void.",
                        "ART_ru_softball_a_4": "If the game starts before the scheduled time, only bets placed before the game commenced will be considered valid. Bets placed after the game commenced will be considered void. This excludes In-Play bet types.",
                    
                        "ART_ru_bettype": "BET TYPES",
                    
                        "ART_ru_softball_b": "Money Line / Winner",
                        "ART_ru_softball_b_1": "Predict who will win the game.",
                        "ART_ru_softball_b_2": "Extra innings count for settlement purposes.",
                    
                        "ART_ru_softball_c": "Handicap",
                        "ART_ru_softball_c_1": "Predict who will win the game / period with the indicated handicap applied.",
                        "ART_ru_softball_c_2": "Extra innings count for settlement purposes.",
                    
                        "ART_ru_softball_d": "Over / Under",
                        "ART_ru_softball_d_1": "Predict whether the total number of runs scored will be over or under the indicated total line.",
                        "ART_ru_softball_d_2": "Extra innings count for settlement purposes.",
                        "ART_ru_softball_d_3": "If a game is abandoned, Over / Under bets will only be settled when the market has been unconditionally determined as any further potential runs have no affect on the market result. In all other scenarios, bets will be considered void.",
                    
                        "ART_ru_softball_e": "Odd / Even",
                        "ART_ru_softball_e_1": "Predict whether the total number of runs scored will be odd or even.",
                        "ART_ru_softball_e_2": "Extra innings count for settlement purposes.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_softball": "垒球",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "19/07/2016",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_softball_a_1": "当投在比分线上和总分（大/小）比赛必须进行第七局（或者6.5局，当第二个击球队已经提前出线）获取结果。如果比赛在加时赛暂停，比分将以最后一个完整局计算，除非主队比分已经领先，或者在后面局领先，此时比分以比赛停止时间的比分为准。",
                        "ART_ru_softball_a_2": "所有投注都以官方公布的最终结果为准，包括加时赛（使用时）。",
                        "ART_ru_softball_a_3": "如果原定比赛场地更改， 所有的投注将被视为无效。",
                        "ART_ru_softball_a_4": "如果比赛提前开赛，只有在开赛之前投注的注单将为视为有效投注。在开赛后投注的注单将被视为无效， 滚球玩法除外。",
                    
                        "ART_ru_bettype": "投注类型",
                    
                        "ART_ru_softball_b": "独赢",
                        "ART_ru_softball_b_1": "预测谁将赢取比赛的胜利。",
                        "ART_ru_softball_b_2": "加时赛计算在内。",
                    
                        "ART_ru_softball_c": "让分",
                        "ART_ru_softball_c_1": "预测谁将获取让分盘的比赛/赛节的胜利。",
                        "ART_ru_softball_c_2": "加时赛计算在内。",
                    
                        "ART_ru_softball_d": "大小分",
                        "ART_ru_softball_d_1": "预测赛事总得分将大于或小于指定的盘口。",
                        "ART_ru_softball_d_2": "加时赛计算在内。",
                        "ART_ru_softball_d_3": "如果赛事中断前已有明确结果并且之后没有任何显著会影响赛事结果的情况，大小分投注的注单才会被结算。若遇到任何其他情况，注单将一律被取消。",
                    
                        "ART_ru_softball_e": "单/双",
                        "ART_ru_softball_e_1": "预测赛事的总得分是单数或双数。",
                        "ART_ru_softball_e_2": "加时赛计算在内。",
                        ';
                        break;
                }
                break;
            case "tamp":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_tamp": "三項全能和現代五項運動",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "04/03/2015",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_tamp_a_1": "選手在頒獎儀式上所授予的金牌，銀牌及銅牌分別認定為第一名，第二名及第三名。",
                        "ART_ru_tamp_a_2": "頒獎台上的位次將視為官方賽果，賽后的懲處或修正都不會更改注單的輸贏結果。",
                        "ART_ru_tamp_a_3": "在投註二選一賽事時，只有雙方參賽者均參與比賽時，注單才視為有效。",
                        "ART_ru_tamp_a_4": "如果比賽提前開賽，只有在開賽之前投注的注單將為視為有效投注。在開賽后投注的注單將被視為無效， 滾球玩法除外。",
                        "ART_ru_tamp_a_5": "即使該場賽事沒有舉行頒獎儀式，注單結果將依據 I.T.U 及 U.I.P.M（國際鐵人三項聯合會、國際現代五項聯盟，或其他相應的權威機構）公佈的正式賽果為準。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_tamp": "TRIATHLON AND MODERN PENTAHLON",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "04/03/2015",
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_tamp_a_1": "For betting purposes, participants awarded Gold, Silver and Bronze at the medal ceremony will be deemed as the 1st, 2nd and 3rd place winner.",
                        "ART_ru_tamp_a_2": "Podium positions will count as the official results, regardless of any subsequent disqualification or amendment to the result.",
                        "ART_ru_tamp_a_3": "In head to head events, both competitors must start the fight for the bets to stand.",
                        "ART_ru_tamp_a_4": "If the event starts before the scheduled time, only bets placed before the event commenced will be considered valid. Bets placed after the event commenced will be considered void. This excludes In-Play bet types.",
                        "ART_ru_tamp_a_5": "Bets will be settled according to the official I.T.U (Triathlon) and U.I.P.M (Modern Pentathlon) results immediately at the end of the event, even in the absence of a medal ceremony.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_tamp": "三项全能和现代五项运动",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "04/03/2015",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_tamp_a_1": "选手在颁奖仪式上所授予的金牌，银牌及铜牌分别认定为第一名，第二名及第三名。",
                        "ART_ru_tamp_a_2": "颁奖台上的位次将视为官方赛果，赛后的惩处或修正都不会更改注单的输赢结果。",
                        "ART_ru_tamp_a_3": "在投注二选一赛事时，只有双方参赛者均参与比赛时，注单才视为有效。",
                        "ART_ru_tamp_a_4": "如果比赛提前开赛，只有在开赛之前投注的注单将为视为有效投注。在开赛后投注的注单将被视为无效， 滚球玩法除外。",
                        "ART_ru_tamp_a_5": "即使该场赛事没有举行颁奖仪式，注单结果将依据 I.T.U 及 U.I.P.M（国际铁人三项联合会、国际现代五项联盟，或其他相应的权威机构）公布的正式赛果为准。",
                        ';
                        break;
                }
                break;
            case "water_polo":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_waterpolo": "水球",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "04/03/2015",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_waterpolo_a_1": "在沒有特別說明的情況下，所有的投注皆以在32分鐘完場時間所產生的賽果而定，不包括加時或罰球。",
                        "ART_ru_waterpolo_a_2": "如果比賽提前開賽，只有在開賽之前投注的注單將為視為有效投注。在開賽后投注的注單將被視為無效，滾球玩法除外。",
                        "ART_ru_waterpolo_a_3": "如果原定比賽場地更改，所有的投注將被視為無效。",
                    
                    
                        "ART_ru_bettype": "投注類型",
                    
                        "ART_ru_waterpolo_b": "1 x 2獨贏",
                        "ART_ru_waterpolo_b_1": "預測哪一方將獲得比賽的勝利。這個投注方式將包含2個球隊和平局的投注選項。",
                    
                        "ART_ru_waterpolo_c": "讓球",
                        "ART_ru_waterpolo_c_1": "預測哪一方將獲得讓球比賽/賽節的勝利。",
                    
                        "ART_ru_waterpolo_d": "滾球讓球",
                        "ART_ru_waterpolo_d_1": "預測哪一方將在讓球盤比賽/賽節的勝利。",
                        "ART_ru_waterpolo_d_2": "滾球讓球盤的輸贏是以比賽最終比分減去投注當時的比賽比分，在計算讓球分數下根據比分差來評判輸贏。",
                    
                        "ART_ru_waterpolo_e": "大/小(球)",
                        "ART_ru_waterpolo_e_1": "預測賽事總進球數將大於或小於指定的盤口。",
                        "ART_ru_waterpolo_e_2": "如果賽事取消，大小球投注會賽事已經確認任何潛在因素並不會影響最總賽果情況下結算。其他情況下，注單將一律取消。",
                    
                        "ART_ru_waterpolo_f": "滾球大/小（球）",
                        "ART_ru_waterpolo_f_1": "預測總進球數將大於或小於指定的盤口。",
                        "ART_ru_waterpolo_f_2": "滾球大小球比分以0-0開始計算，派彩是根據最終的比分為準，投注時的比分是不計算在內的。 ",
                    
                        "ART_ru_waterpolo_g": "單/雙",
                        "ART_ru_waterpolo_g_1": "預測賽事的總進球數是單數或雙數。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_waterpolo": "WATER POLO",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "04/03/2015",
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_waterpolo_a_1": "Unless otherwise stated, all Water Polo bets will be settled based on the results of the full 32 minute of play. This excludes any overtime and penalty shootouts unless otherwise stated.",
                        "ART_ru_waterpolo_a_2": "If the game starts before the scheduled time, only bets placed before the game commenced will be considered valid. Bets placed after the game commenced will be considered void. This excludes In-Play bet types.",
                        "ART_ru_waterpolo_a_3": "If the scheduled venue is changed, all bets will be considered void.",
                    
                    
                        "ART_ru_bettype": "BET TYPES",
                    
                        "ART_ru_waterpolo_b": "1 X 2",
                        "ART_ru_waterpolo_b_1": "Predict who will win the game. This market will contain the two teams and the draw as betting selections.",
                    
                        "ART_ru_waterpolo_c": "Handicap",
                        "ART_ru_waterpolo_c_1": "Predict who will win the game / period with the indicated handicap applied.",
                    
                        "ART_ru_waterpolo_d": "In-Play Handicap",
                        "ART_ru_waterpolo_d_1": "Predict who will win the game / period with the indicated handicap applied.",
                        "ART_ru_waterpolo_d_2": "Settlement is based on the score line, from when the bet was placed to the end of the game / period.",
                    
                        "ART_ru_waterpolo_e": "Over / Under (Goals)",
                        "ART_ru_waterpolo_e_1": "Predict whether the total number of goals scored will be over or under the indicated total line.",
                        "ART_ru_waterpolo_e_2": "If a game is abandoned, Over / Under bets will only be settled when the market has been unconditionally determined as any further potential goals have no affect on the market result. In all other scenarios, bets will be considered void.",
                    
                        "ART_ru_waterpolo_f": "In-Play Over / Under (Goals)",
                        "ART_ru_waterpolo_f_1": "Predict whether the total number of goals scored will be over or under the indicated total line.",
                        "ART_ru_waterpolo_f_2": "Settlement is based on the final score line and the total line is applied to a 0-0 score line. The current score, at the time of bet placement, is not factored into the bet.",
                    
                        "ART_ru_waterpolo_g": "Odd / Even",
                        "ART_ru_waterpolo_g_1": "Predict whether the total number of goals scored will be odd or even.",
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_waterpolo": "水球",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "04/03/2015",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_waterpolo_a_1": "在没有特别说明的情况下，所有的投注皆以在32分钟完场时间所产生的赛果而定，不包括加时或罚球。",
                        "ART_ru_waterpolo_a_2": "如果比赛提前开赛，只有在开赛之前投注的注单将为视为有效投注。在开赛后投注的注单将被视为无效，滚球玩法除外。",
                        "ART_ru_waterpolo_a_3": "如果原定比赛场地更改，所有的投注将被视为无效。",
                    
                    
                        "ART_ru_bettype": "投注类型",
                    
                        "ART_ru_waterpolo_b": "1 x 2独赢",
                        "ART_ru_waterpolo_b_1": "预测哪一方将获得比赛的胜利。这个投注方式将包含2个球队和平局的投注选项。",
                    
                        "ART_ru_waterpolo_c": "让球",
                        "ART_ru_waterpolo_c_1": "预测哪一方将获得让球比赛/赛节的胜利。",
                    
                        "ART_ru_waterpolo_d": "滚球让球",
                        "ART_ru_waterpolo_d_1": "预测哪一方将在让球盘比赛/赛节的胜利。",
                        "ART_ru_waterpolo_d_2": "滚球让球盘的输赢是以比赛最终比分减去投注当时的比赛比分，在计算让球分数下根据比分差来评判输赢。",
                    
                        "ART_ru_waterpolo_e": "大/小(球)",
                        "ART_ru_waterpolo_e_1": "预测赛事总进球数将大于或小于指定的盘口。",
                        "ART_ru_waterpolo_e_2": "如果赛事取消，大小球投注会赛事已经确认任何潜在因素并不会影响最总赛果情况下结算。其他情况下，注单将一律取消。",
                    
                        "ART_ru_waterpolo_f": "滚球大/小（球）",
                        "ART_ru_waterpolo_f_1": "预测总进球数将大于或小于指定的盘口。",
                        "ART_ru_waterpolo_f_2": "滚球大小球比分以0-0开始计算，派彩是根据最终的比分为准，投注时的比分是不计算在内的。",
                    
                        "ART_ru_waterpolo_g": "单/双",
                        "ART_ru_waterpolo_g_1": "预测赛事的总进球数是单数或双数。",
                        ';
                        break;
                }
                break;
            case "weightlifting":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_weightlifting": "舉重",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "04/03/2015",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_weightlifting_a_1": "參賽者獲得金，銀，銅牌將被視為第一，第二和第三名獲獎者。",
                        "ART_ru_weightlifting_a_2": "每場賽事的結果均以獎台上排名為最終結果。如之後發生喪失資格或結果修正將不予以計算。",
                        "ART_ru_weightlifting_a_3": "在投註二選一賽事時，只有雙方參賽者均參與比賽時，注單才被為有效。",
                        "ART_ru_weightlifting_a_4": "如果比賽提前開賽，只有在開賽之前投注的注單將為視為有效投注。在開賽后投注的注單將被視為無效，滾球投注類型不包括在內。",
                        "ART_ru_weightlifting_a_5": "即使該場賽事沒有舉行頒獎儀式，注單結果將依據國際舉聯（IWF）公佈的正式賽果為準。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_weightlifting_a_1": "For betting purposes, participants awarded Gold, Silver and Bronze at the medal ceremony will be deemed as the 1st, 2nd and 3rd place winner.",
                        "ART_ru_weightlifting_a_2": "Podium positions will count as the official results, regardless of any subsequent disqualification or amendment to the result.",
                        "ART_ru_weightlifting_a_3": "In head to head events, both competitors must start the fight for the bets to stand.",
                        "ART_ru_weightlifting_a_4": "If the event starts before the scheduled time, only bets placed before the event commenced will be considered valid. Bets placed after the event commenced will be considered void. This excludes In-Play bet types.",
                        "ART_ru_weightlifting_a_5": "Bets will be settled according to the official I.W.F result immediately at the end of the event, even in the absence of a medal ceremony.",                                   
                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_weightlifting": "举重",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "04/03/2015",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_weightlifting_a_1": "参赛者获得金，银，铜牌将被视为第一，第二和第三名获奖者。",
                        "ART_ru_weightlifting_a_2": "每场赛事的结果均以奖台上排名为最终结果。如之后发生丧失资格或结果修正将不予以计算。",
                        "ART_ru_weightlifting_a_3": "在投注二选一赛事时，只有双方参赛者均参与比赛时，注单才被为有效。",
                        "ART_ru_weightlifting_a_4": "如果比赛提前开赛，只有在开赛之前投注的注单将为视为有效投注。在开赛后投注的注单将被视为无效，滚球投注类型不包括在内。",
                        "ART_ru_weightlifting_a_5": "即使该场赛事没有举行颁奖仪式，注单结果将依据国际举联（IWF）公布的正式赛果为准。",
                        ';
                        break;
                }
                break;
            case "wintersports":
                switch ($langx){
                    case "zh-tw":
                        $js.= '
                        "ART_ru_h1_wintersports": "冬季運動 & 冬季奧運會/比賽",
                        "ART_ru_lastdate": "最後更新日期:",
                        "ART_ru_date": "04/03/2015",
                    
                        "ART_ru_rule": "一般規則",
                        "ART_ru_wintersports_a_1": "參賽者獲得金，銀，銅牌將被視為第一，第二和第三名獲獎者。",
                        "ART_ru_wintersports_a_2": "每場賽事的結果均以獎台上排名為最終結果。如之後發生喪失資格或結果修正將不予以計算。",
                        "ART_ru_wintersports_a_3": "無論是團隊或個人是否比賽，所有註單將被視為一律有效。",
                        "ART_ru_wintersports_a_4": "如果比賽提前開賽，只有在開賽之前投注的注單將為視為有效投注。在開賽后投注的注單將被視為無效，滾球玩法除外。",
                        "ART_ru_wintersports_a_5": "如果官方對特定賽事原本列出的條款進行更改，所有此特定賽事注單將被視為無效。",
                        "ART_ru_wintersports_a_6": "官方賽程距離更改- 如果公佈的官方賽程距離有更改，並與公司網站公佈的賽程距離不符，所有註單將被視為無效。",
                        "ART_ru_wintersports_a_7": "即使該場賽事沒有舉行頒獎儀式，注單結果將依據，國際滑雪聯盟（FIS）、國際滑冰聯盟（ISU）、國際冬季兩項全能聯盟（IBU）、國際奧林匹克委員會（IOC） 或任何官方組織公佈的正式賽果而定。",
                        "ART_ru_wintersports_a_8": "這些規則適用於以下賽事：",
                        "ART_ru_wintersports_a_8_1": "高山滑雪",
                        "ART_ru_wintersports_a_8_2": "冬季兩項",
                        "ART_ru_wintersports_a_8_3": "越野滑雪",
                        "ART_ru_wintersports_a_8_4": "自由式滑雪",
                        "ART_ru_wintersports_a_8_5": "無舵雪橇",
                        "ART_ru_wintersports_a_8_6": "北歐兩項",
                        "ART_ru_wintersports_a_8_7": "滑冰（冬）滑冰（冬季）",
                        "ART_ru_wintersports_a_8_8": "山地雪橇滑雪/平底雪橇滑雪",
                        "ART_ru_wintersports_a_8_9": "跳台滑雪",
                        "ART_ru_wintersports_a_8_10": "雪板",
                        "ART_ru_wintersports_a_8_11": "短道速滑/速度滑冰",
                        "ART_ru_wintersports_a_8_12": "有舵雪橇",
                        "ART_ru_wintersports_a_8_13": "花樣滑冰",
                    
                        "ART_ru_wintersports_b": "二選一對賽",
                        "ART_ru_wintersports_b_1": "所有投注都以雙方選手離開起跑線/門視為有效，如果賽事只是單輪比賽，注單結果將依據官方公佈為準。",
                        "ART_ru_wintersports_b_2": "選手獲取更高的排位或獲取更高的比分將視為獲勝選手。當遇到無法判別哪位選手獲取更高的排位或比分時，所有註單將被視為無效。",
                        "ART_ru_wintersports_b_3": "在多輪賽事，如果雙方選手都未能晉級下一輪比賽，所有註單將視為無效。如果雙方選手都晉級下一輪比賽，但是並未完成比賽，獲得最短記錄時間或者最高比分的選手將為獲勝選手。",
                    
                        "ART_ru_wintersports_c": "單項體育規則",
                        "ART_ru_wintersports_c_1": "冰壺",
                        "ART_ru_wintersports_c_1_1": "所有投注都以最終賽果為準，包括附加局。賽事必須決出勝負注單方可視為有效。對於未能夠完成的賽事，所有註單一律視為無效。",
                        "ART_ru_wintersports_c_1_2": "指定局獲勝方：這種投注是指在指定局中的獲勝者。各個指定局必須完成比賽,注單方可視為有效。",
                    
                        "ART_ru_wintersports_c_2": "冬季兩項賽",
                        "ART_ru_wintersports_c_2_1": "射擊比賽（包括對決賽）如果冬季兩項賽已經開賽，但是其中一位選手未能完成剩下的比賽，則所有註單一律取消，除非在比賽未完成時，投注項目的結果已經明確，並且之後沒有任何顯著會影響賽事結果的情況，注單才會被結算。",
                    
                        "ART_ru_wintersports_c_3": "高山滑雪",
                        "ART_ru_wintersports_c_3_1": "對決賽：選手在更高的位置滑出即視為獲勝者。如果其中一位選手未能參加比賽，所有註單一律視為無效。如果其中一位選手無論由於任何原因，取消參賽資格或者未能完成比賽，則另一選手將視為獲勝者。正式比賽官方公佈名單的獲勝選手，才能被視為正式的優勝者。 （如：在障礙滑雪或者大迴轉滑雪賽中，雙方選手必須完成賽事規定項目）如果雙方選手不管任何原因都未能完成比賽，則以通過第一障礙時間計算最短時間差者為獲勝方，不考慮雙方選手通過多少障礙。",
                        ';
                        break;
                    case "en-us":
                        $js.= '
                        "ART_ru_h1_wintersports": "WINTER SPORTS & WINTER OLYMPICS / GAMES",
                        "ART_ru_lastdate": "Last Update:",
                        "ART_ru_date": "04/03/2015",
                    
                        "ART_ru_rule": "GENERAL RULES",
                        "ART_ru_wintersports_a_1": "For betting purposes, participants awarded Gold, Silver and Bronze at the medal ceremony will be deemed as the 1st, 2nd and 3rd place winner.",
                        "ART_ru_wintersports_a_2": "Podium positions will count as the official results, regardless of any subsequent disqualification or amendment to the result.",
                        "ART_ru_wintersports_a_3": "All bets will still stand even if a crew or individual competes or not.",
                        "ART_ru_wintersports_a_4": "If the event starts before the scheduled time, only bets placed before the event commenced will be considered valid. Bets placed after the event commenced will be considered void. This excludes In-Play bet types.",
                        "ART_ru_wintersports_a_5": "If the conditions of a specific event have changed from those originally listed by the Official Governing Body, all bets on the event will be considered void.",
                        "ART_ru_wintersports_a_6": "Altered official distance Note: For Cross-Country and Biathlon, if the listed official distance changes and is different from the published distance on our website, all bets will be considered void.",
                        "ART_ru_wintersports_a_7": "Bets are settled according to the official results of the International Ski Federation (FIS), the International Skating Union (ISU), the International Biathlon Union (IBU), the Official International Olympic Committee (IOC) or any official body deemed to have such authority for competitions even in the absence of a medal ceremony.",
                        "ART_ru_wintersports_a_8": "These rules cover the following:",
                        "ART_ru_wintersports_a_8_1": "Alpine Skiing",
                        "ART_ru_wintersports_a_8_2": "Biathlon",
                        "ART_ru_wintersports_a_8_3": "Cross-Country Skiing",
                        "ART_ru_wintersports_a_8_4": "Freestyle Skiing",
                        "ART_ru_wintersports_a_8_5": "Luge",
                        "ART_ru_wintersports_a_8_6": "Nordic Combined",
                        "ART_ru_wintersports_a_8_7": "Skating (Winter)",
                        "ART_ru_wintersports_a_8_8": "Skeleton / Tobogganing",
                        "ART_ru_wintersports_a_8_9": "Ski Jumping",
                        "ART_ru_wintersports_a_8_10": "Snowboarding",
                        "ART_ru_wintersports_a_8_11": "Short Track Speed Skating / Speed Skating",
                        "ART_ru_wintersports_a_8_12": "Bobsleigh",
                        "ART_ru_wintersports_a_8_13": "Figure Skating",
                    
                        "ART_ru_wintersports_b": "GENERAL HEAD TO HEAD RULES",
                        "ART_ru_wintersports_b_1": "Both participants must leave the start line / gate for bets to stand. If an event comprises of just one round, then official results from that round will be used for settlement purposes.",
                        "ART_ru_wintersports_b_2": "The player that qualifies with a higher position or scores more points is deemed the winner. In the event that there is no way to discern which player places in a higher position or scores more points, all bets will be considered void.",
                        "ART_ru_wintersports_b_3": "For multiple round events, if both participants fail to qualify for the next round, all bets will be considered void. If both participants qualify for the next round but none make to the completion of the event, the participant with the fastest recorded time or scores more points in the previous round is deemed the winner.",
                    
                        "ART_ru_wintersports_c": "INDIVIDUAL SPORT RULES",
                        "ART_ru_wintersports_c_1": "Curling",
                        "ART_ru_wintersports_c_1_1": "Bets will be settled according to the final score including extra \"ends\". The match must be completed or conceded by the losing team for bets to stand. In the event that the match does not fully complete, all bets will be considered void.",
                        "ART_ru_wintersports_c_1_2": "Specific End Winner: This bet refers to winner of a specific \"end\". The respective \"end\" must be completed for bets to be considered valid.",
                    
                        "ART_ru_wintersports_c_2": "Biathlon",
                        "ART_ru_wintersports_c_2_1": "For shooting performance (including head to head) if a biathlete starts but fails to finish a race then bets will be voided except for those bets of which the outcome has already been determined at the time the athlete fails to finish.",
                    
                        "ART_ru_wintersports_c_3": "Alpine Skiing",
                        "ART_ru_wintersports_c_3_1": "Head to Head: The winner will be the skier who is placed higher in the race. If one of the skiers does not take part in the race, all bets are void. If a skier is disqualified or does not finish the race for any reason, then the other skier is deemed the winner. A skier can only be deemed a winner if they are listed in the official race classification (e.g. in the case of Slalom or Giant Slalom, both runs must be completed as specified in the event rules). If both skiers do not finish the race for any reason, the shortest time difference based on the first time check will determine the winner regardless of numbers of time check done by both skiers.",

                        ';
                        break;
                    default:
                        $js.= '
                        "ART_ru_h1_wintersports": "冬季运动 & 冬季奥运会/比赛",
                        "ART_ru_lastdate": "最后更新日期:",
                        "ART_ru_date": "04/03/2015",
                    
                        "ART_ru_rule": "一般规则",
                        "ART_ru_wintersports_a_1": "参赛者获得金，银，铜牌将被视为第一，第二和第三名获奖者。",
                        "ART_ru_wintersports_a_2": "每场赛事的结果均以奖台上排名为最终结果。如之后发生丧失资格或结果修正将不予以计算。",
                        "ART_ru_wintersports_a_3": "无论是团队或个人是否比赛，所有注单将被视为一律有效。",
                        "ART_ru_wintersports_a_4": "如果比赛提前开赛，只有在开赛之前投注的注单将为视为有效投注。在开赛后投注的注单将被视为无效，滚球玩法除外。",
                        "ART_ru_wintersports_a_5": "如果官方对特定赛事原本列出的条款进行更改，所有此特定赛事注单将被视为无效。",
                        "ART_ru_wintersports_a_6": "官方赛程距离更改- 如果公布的官方赛程距离有更改，并与公司网站公布的赛程距离不符，所有注单将被视为无效。",
                        "ART_ru_wintersports_a_7": "即使该场赛事没有举行颁奖仪式，注单结果将依据，国际滑雪联盟（FIS）、国际滑冰联盟（ISU）、国际冬季两项全能联盟（IBU）、国际奥林匹克委员会（IOC） 或任何官方组织公布的正式赛果而定。",
                        "ART_ru_wintersports_a_8": "这些规则适用于以下赛事：",
                        "ART_ru_wintersports_a_8_1": "高山滑雪",
                        "ART_ru_wintersports_a_8_2": "冬季两项",
                        "ART_ru_wintersports_a_8_3": "越野滑雪",
                        "ART_ru_wintersports_a_8_4": "自由式滑雪",
                        "ART_ru_wintersports_a_8_5": "无舵雪橇",
                        "ART_ru_wintersports_a_8_6": "北欧两项",
                        "ART_ru_wintersports_a_8_7": "滑冰（冬）滑冰（冬季）",
                        "ART_ru_wintersports_a_8_8": "山地雪橇滑雪/平底雪橇滑雪",
                        "ART_ru_wintersports_a_8_9": "跳台滑雪",
                        "ART_ru_wintersports_a_8_10": "雪板",
                        "ART_ru_wintersports_a_8_11": "短道速滑/速度滑冰",
                        "ART_ru_wintersports_a_8_12": "有舵雪橇",
                        "ART_ru_wintersports_a_8_13": "花样滑冰",
                    
                        "ART_ru_wintersports_b": "二选一对赛",
                        "ART_ru_wintersports_b_1": "所有投注都以双方选手离开起跑线/门视为有效，如果赛事只是单轮比赛，注单结果将依据官方公布为准。",
                        "ART_ru_wintersports_b_2": "选手获取更高的排位或获取更高的比分将视为获胜选手。当遇到无法判别哪位选手获取更高的排位或比分时，所有注单将被视为无效。",
                        "ART_ru_wintersports_b_3": "在多轮赛事，如果双方选手都未能晋级下一轮比赛，所有注单将视为无效。如果双方选手都晋级下一轮比赛，但是并未完成比赛，获得最短记录时间或者最高比分的选手将为获胜选手。",
                    
                        "ART_ru_wintersports_c": "单项体育规则",
                        "ART_ru_wintersports_c_1": "冰壶",
                        "ART_ru_wintersports_c_1_1": "所有投注都以最终赛果为准，包括附加局。赛事必须决出胜负注单方可视为有效。对于未能够完成的赛事，所有注单一律视为无效。",
                        "ART_ru_wintersports_c_1_2": "指定局获胜方：这种投注是指在指定局中的获胜者。各个指定局必须完成比赛,注单方可视为有效。",
                    
                        "ART_ru_wintersports_c_2": "冬季两项赛",
                        "ART_ru_wintersports_c_2_1": "射击比赛（包括对决赛）如果冬季两项赛已经开赛，但是其中一位选手未能完成剩下的比赛，则所有注单一律取消，除非在比赛未完成时，投注项目的结果已经明确，并且之后没有任何显著会影响赛事结果的情况，注单才会被结算。",
                    
                        "ART_ru_wintersports_c_3": "高山滑雪",
                        "ART_ru_wintersports_c_3_1": "对决赛：选手在更高的位置滑出即视为获胜者。如果其中一位选手未能参加比赛，所有注单一律视为无效。如果其中一位选手无论由于任何原因，取消参赛资格或者未能完成比赛，则另一选手将视为获胜者。正式比赛官方公布名单的获胜选手，才能被视为正式的优胜者。 （如：在障碍滑雪或者大回转滑雪赛中，双方选手必须完成赛事规定项目）如果双方选手不管任何原因都未能完成比赛，则以通过第一障碍时间计算最短时间差者为获胜方，不考虑双方选手通过多少障碍。",

                        ';
                        break;
                }
                break;
        default:
            $js.= '
                "ART_ru_h1_general": "'.$artjson["ART_ru_h1_general"].'",
                "ART_ru_lastdate": "'.$artjson["ART_ru_lastdate"].'",
                "ART_ru_date": "'.$artjson["ART_ru_date"].'",
            
                "ART_ru_overview": "'.$artjson["ART_ru_overview"].'",
                "ART_ru_general_a_1": "'.$artjson["ART_ru_general_a_1"].'",
                "ART_ru_general_a_2": "'.$artjson["ART_ru_general_a_2"].'",
                "ART_ru_general_a_3": "'.$artjson["ART_ru_general_a_3"].'",
            
                "ART_ru_general_b": "'.$artjson["ART_ru_general_b"].'",
                "ART_ru_general_b_p": "'.$artjson["ART_ru_general_b_p"].'",
                "ART_ru_general_b_1": "'.$artjson["ART_ru_general_b_1"].'",
                "ART_ru_general_b_2": "'.$artjson["ART_ru_general_b_2"].'",
                "ART_ru_general_b_3": \''.$artjson["ART_ru_general_b_3"].'\',
                "ART_ru_general_b_4": "'.$artjson["ART_ru_general_b_4"].'",
                "ART_ru_general_b_5": "'.$artjson["ART_ru_general_b_5"].'",
                "ART_ru_general_b_6": "'.$artjson["ART_ru_general_b_6"].'",
                "ART_ru_general_b_7": \''.$artjson["ART_ru_general_b_7"].'\',
                "ART_ru_general_b_8": "'.$artjson["ART_ru_general_b_8"].'",
                "ART_ru_general_b_9": "'.$artjson["ART_ru_general_b_9"].'",
                "ART_ru_general_b_10": "'.$artjson["ART_ru_general_b_10"].'",
                "ART_ru_general_b_11": "'.$artjson["ART_ru_general_b_11"].'",
                "ART_ru_general_b_12": "'.$artjson["ART_ru_general_b_12"].'",
                "ART_ru_general_b_12_1": "'.$artjson["ART_ru_general_b_12_1"].'",
                "ART_ru_general_b_12_2": "'.$artjson["ART_ru_general_b_12_2"].'",
                "ART_ru_general_b_12_3": "'.$artjson["ART_ru_general_b_12_3"].'",
                "ART_ru_general_b_12_4": "'.$artjson["ART_ru_general_b_12_4"].'",
                "ART_ru_general_b_13": "'.$artjson["ART_ru_general_b_13"].'",
                "ART_ru_general_b_14": "'.$artjson["ART_ru_general_b_14"].'",
            
                "ART_ru_general_c": "'.$artjson["ART_ru_general_c"].'",
                "ART_ru_general_c_1": "'.$artjson["ART_ru_general_c_1"].'",
                "ART_ru_general_c_2": "'.$artjson["ART_ru_general_c_2"].'",
                "ART_ru_general_c_3": "'.$artjson["ART_ru_general_c_3"].'",
                "ART_ru_general_c_4": "'.$artjson["ART_ru_general_c_4"].'",
            
                "ART_ru_general_d": "'.$artjson["ART_ru_general_d"].'",
                "ART_ru_general_d_p": "'.$artjson["ART_ru_general_d_p"].'",
                "ART_ru_general_d_1": "'.$artjson["ART_ru_general_d_1"].'",
                "ART_ru_general_d_2": \''.$artjson["ART_ru_general_d_2"].'\',
                "ART_ru_general_d_3": "'.$artjson["ART_ru_general_d_3"].'",
                "ART_ru_general_d_3_1": "'.$artjson["ART_ru_general_d_3_1"].'",
                "ART_ru_general_d_3_2": "'.$artjson["ART_ru_general_d_3_2"].'",
                "ART_ru_general_d_4": "'.$artjson["ART_ru_general_d_4"].'",
                "ART_ru_general_d_5": "'.$artjson["ART_ru_general_d_5"].'",
                "ART_ru_general_d_5_1": \''.$artjson["ART_ru_general_d_5_1"].'\',
                "ART_ru_general_d_5_2": "'.$artjson["ART_ru_general_d_5_2"].'",
                "ART_ru_general_d_5_3": "'.$artjson["ART_ru_general_d_5_3"].'",
            
                "ART_ru_general_e": "'.$artjson["ART_ru_general_e"].'",
                "ART_ru_general_e_1": "'.$artjson["ART_ru_general_e_1"].'",
                "ART_ru_general_e_2": "'.$artjson["ART_ru_general_e_2"].'",
                "ART_ru_general_e_3": "'.$artjson["ART_ru_general_e_3"].'",
            
                "ART_ru_general_f": "'.$artjson["ART_ru_general_f"].'",
                "ART_ru_general_f_1": "'.$artjson["ART_ru_general_f_1"].'",
                "ART_ru_general_f_2": "'.$artjson["ART_ru_general_f_2"].'",
                "ART_ru_general_f_2_1": "'.$artjson["ART_ru_general_f_2_1"].'",
                "ART_ru_general_f_2_2": "'.$artjson["ART_ru_general_f_2_2"].'",
                "ART_ru_general_f_2_3": "'.$artjson["ART_ru_general_f_2_3"].'",
                "ART_ru_general_f_2_4": "'.$artjson["ART_ru_general_f_2_4"].'",
                "ART_ru_general_f_2_5": "'.$artjson["ART_ru_general_f_2_5"].'",
                "ART_ru_general_f_3": "'.$artjson["ART_ru_general_f_3"].'",
            
                "ART_ru_general_g": "'.$artjson["ART_ru_general_g"].'",
                "ART_ru_general_g_1": "'.$artjson["ART_ru_general_g_1"].'",
                "ART_ru_general_g_2": "'.$artjson["ART_ru_general_g_2"].'",
                "ART_ru_general_g_3": "'.$artjson["ART_ru_general_g_3"].'",
                "ART_ru_general_g_4": "'.$artjson["ART_ru_general_g_4"].'",
            
                "ART_ru_general_h": "'.$artjson["ART_ru_general_h"].'",
                "ART_ru_general_h_1": "'.$artjson["ART_ru_general_h_1"].'",
                "ART_ru_general_h_1_1": "'.$artjson["ART_ru_general_h_1_1"].'",
                "ART_ru_general_h_1_2": "'.$artjson["ART_ru_general_h_1_2"].'",
                "ART_ru_general_h_1_3": "'.$artjson["ART_ru_general_h_1_3"].'",
                "ART_ru_general_h_2": "'.$artjson["ART_ru_general_h_2"].'",
            
                "ART_ru_general_i": "'.$artjson["ART_ru_general_i"].'",
                "ART_ru_general_i_1": "'.$artjson["ART_ru_general_i_1"].'",
                    
                ';
            break;
    }
    $js .= "};";
    return $js;
}