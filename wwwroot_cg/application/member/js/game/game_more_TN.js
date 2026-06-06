 function game_more_TN(_win, _dom, _post) {
                var classname = "game_more_TN";
                var _self = this;
                var win = _win;
                var dom = _dom;
                var postHash = _post;
                var parentClass;
                var tv;
                var mt;
                var LS_game;
                var _xmlnode;
                var scDataObj;
                var over1024 = getView().viewportwidth >= 1024;
                var util = new win.Util(win,dom);
                var util_game = new win.Util_game(win,dom);
                var wtypeFun = new Object;
                var rtypeFun = new Object;
                var wtypeHash = new Array;
                var rtypeHash = new Object;
                var showtype = postHash["showtype"];
                var def_league = postHash["league"];
                var def_team_h = postHash["team_h"];
                var def_team_c = postHash["team_c"];
                var def_retime = postHash["retime"];
                var def_datetime = postHash["datetime"];
                var hasRightPanel = false;
                var sc_game_H = "";
                var sc_game_A = "";
                var total_H = "";
                var total_A = "";
                var set_name = "";
                _self.init = function() {
                    LS_game = _self.new_eval("new LS_game_" + ls + "();");
                    LS_game.init();
                    _self.initFun();
                    _self.getHash();
                    _self.reInit(_self, classname, wtypeHash, rtypeHash, _self.getDataComplete, _self.getXmlNode);
                    parentClass = _self._super.parentClass;
                    util = _self._super.util;
                    util_game = _self._super.util_game;
                    tv = _self._super.tv;
                    mt = _self._super.mt
                }
                ;
                _self.initFun = function() {
                    wtypeFun["live"] = _self.getWtypeRB;
                    wtypeFun["today"] = _self.getWtypeFT;
                    wtypeFun["early"] = wtypeFun["today"];
                    wtypeFun["parlay"] = wtypeFun["today"];
                    rtypeFun["live"] = _self.getRtypeRB;
                    rtypeFun["today"] = _self.getRtypeFT;
                    rtypeFun["early"] = rtypeFun["today"];
                    rtypeFun["parlay"] = rtypeFun["today"]
                }
                ;
                _self.getHash = function() {
                    try {
                        wtypeHash = wtypeFun[showtype]();
                        rtypeHash = rtypeFun[showtype]()
                    } catch (e) {}
                }
                ;
                _self.getWtypeRB = function() {
                    var ary = new Object;
                    ary["FT"] = _self.getWtypeRB_FT();
                    return ary
                }
                ;
                _self.getWtypeFT = function() {
                    var ary = new Object;
                    ary["FT"] = _self.getWtypeFT_FT();
                    return ary
                }
                ;
                _self.getWtypeRB_FT = function() {
                    var ary = new Array;
                    for (var a = 65; a <= 69; a++)
                        for (var i = 1; i <= 50; i++)
                            if (String.fromCharCode(a) == "A" || String.fromCharCode(a) == "B" || String.fromCharCode(a) == "D") {
                                if (i > 13)
                                    continue;
                                ary.push("0_RF" + String.fromCharCode(a) + _self.checkNum(i));
                                ary.push("0_RGA" + String.fromCharCode(a) + _self.checkNum(i));
                                ary.push("0_RGOU" + String.fromCharCode(a) + _self.checkNum(i))
                            } else {
                                ary.push("0_RF" + String.fromCharCode(a) + _self.checkNum(i));
                                ary.push("0_RGA" + String.fromCharCode(a) + _self.checkNum(i));
                                ary.push("0_RGOU" + String.fromCharCode(a) + _self.checkNum(i))
                            }
                    ary.push("0_RM");
                    ary.push("6_RE");
                    ary.push("6_ROU");
                    ary.push("0_RE");
                    ary.push("1_RM");
                    ary.push("1_RE");
                    ary.push("1_ROU");
                    ary.push("2_RM");
                    ary.push("2_RE");
                    ary.push("2_ROU");
                    ary.push("3_RM");
                    ary.push("3_RE");
                    ary.push("3_ROU");
                    ary.push("4_RM");
                    ary.push("4_RE");
                    ary.push("4_ROU");
                    ary.push("5_RM");
                    ary.push("5_RE");
                    ary.push("5_ROU");
                    ary.push("0_ROUH");
                    ary.push("0_ROUC");
                    ary.push("0_ROU");
                    ary.push("0_REO");
                    ary.push("6_REO");
                    ary.push("1_REO");
                    ary.push("2_REO");
                    ary.push("3_REO");
                    ary.push("4_REO");
                    ary.push("5_REO");
                    ary.push("0_RPD3");
                    ary.push("0_RPD5");
                    return ary
                }
                ;
                _self.getRtypeRB = function() {
                    var ary = new Object;
                    ary["RGAA01"] = new Array("RGAA01Y","RGAA01N");
                    ary["RGAA02"] = new Array("RGAA02Y","RGAA02N");
                    ary["RGAA03"] = new Array("RGAA03Y","RGAA03N");
                    ary["RGAA04"] = new Array("RGAA04Y","RGAA04N");
                    ary["RGAA05"] = new Array("RGAA05Y","RGAA05N");
                    ary["RGAA06"] = new Array("RGAA06Y","RGAA06N");
                    ary["RGAA07"] = new Array("RGAA07Y","RGAA07N");
                    ary["RGAA08"] = new Array("RGAA08Y","RGAA08N");
                    ary["RGAA09"] = new Array("RGAA09Y","RGAA09N");
                    ary["RGAA10"] = new Array("RGAA10Y","RGAA10N");
                    ary["RGAA11"] = new Array("RGAA11Y","RGAA11N");
                    ary["RGAA12"] = new Array("RGAA12Y","RGAA12N");
                    ary["RGAA13"] = new Array("RGAA13Y","RGAA13N");
                    ary["RGAB01"] = new Array("RGAB01Y","RGAB01N");
                    ary["RGAB02"] = new Array("RGAB02Y","RGAB02N");
                    ary["RGAB03"] = new Array("RGAB03Y","RGAB03N");
                    ary["RGAB04"] = new Array("RGAB04Y","RGAB04N");
                    ary["RGAB05"] = new Array("RGAB05Y","RGAB05N");
                    ary["RGAB06"] = new Array("RGAB06Y","RGAB06N");
                    ary["RGAB07"] = new Array("RGAB07Y","RGAB07N");
                    ary["RGAB08"] = new Array("RGAB08Y","RGAB08N");
                    ary["RGAB09"] = new Array("RGAB09Y","RGAB09N");
                    ary["RGAB10"] = new Array("RGAB10Y","RGAB10N");
                    ary["RGAB11"] = new Array("RGAB11Y","RGAB11N");
                    ary["RGAB12"] = new Array("RGAB12Y","RGAB12N");
                    ary["RGAB13"] = new Array("RGAB13Y","RGAB13N");
                    ary["RGAC01"] = new Array("RGAC01Y","RGAC01N");
                    ary["RGAC02"] = new Array("RGAC02Y","RGAC02N");
                    ary["RGAC03"] = new Array("RGAC03Y","RGAC03N");
                    ary["RGAC04"] = new Array("RGAC04Y","RGAC04N");
                    ary["RGAC05"] = new Array("RGAC05Y","RGAC05N");
                    ary["RGAC06"] = new Array("RGAC06Y","RGAC06N");
                    ary["RGAC07"] = new Array("RGAC07Y","RGAC07N");
                    ary["RGAC08"] = new Array("RGAC08Y","RGAC08N");
                    ary["RGAC09"] = new Array("RGAC09Y","RGAC09N");
                    ary["RGAC10"] = new Array("RGAC10Y","RGAC10N");
                    ary["RGAC11"] = new Array("RGAC11Y","RGAC11N");
                    ary["RGAC12"] = new Array("RGAC12Y","RGAC12N");
                    ary["RGAC13"] = new Array("RGAC13Y","RGAC13N");
                    ary["RGAC14"] = new Array("RGAC14Y","RGAC14N");
                    ary["RGAC15"] = new Array("RGAC15Y","RGAC15N");
                    ary["RGAC16"] = new Array("RGAC16Y","RGAC16N");
                    ary["RGAC17"] = new Array("RGAC17Y","RGAC17N");
                    ary["RGAC18"] = new Array("RGAC18Y","RGAC18N");
                    ary["RGAC19"] = new Array("RGAC19Y","RGAC19N");
                    ary["RGAC20"] = new Array("RGAC20Y","RGAC20N");
                    ary["RGAC21"] = new Array("RGAC21Y","RGAC21N");
                    ary["RGAC22"] = new Array("RGAC22Y","RGAC22N");
                    ary["RGAC23"] = new Array("RGAC23Y","RGAC23N");
                    ary["RGAC24"] = new Array("RGAC24Y","RGAC24N");
                    ary["RGAC25"] = new Array("RGAC25Y","RGAC25N");
                    ary["RGAC26"] = new Array("RGAC26Y","RGAC26N");
                    ary["RGAC27"] = new Array("RGAC27Y","RGAC27N");
                    ary["RGAC28"] = new Array("RGAC28Y","RGAC28N");
                    ary["RGAC29"] = new Array("RGAC29Y","RGAC29N");
                    ary["RGAC30"] = new Array("RGAC30Y","RGAC30N");
                    ary["RGAC31"] = new Array("RGAC31Y","RGAC31N");
                    ary["RGAC32"] = new Array("RGAC32Y","RGAC32N");
                    ary["RGAC33"] = new Array("RGAC33Y","RGAC33N");
                    ary["RGAC34"] = new Array("RGAC34Y","RGAC34N");
                    ary["RGAC35"] = new Array("RGAC35Y","RGAC35N");
                    ary["RGAC36"] = new Array("RGAC36Y","RGAC36N");
                    ary["RGAC37"] = new Array("RGAC37Y","RGAC37N");
                    ary["RGAC38"] = new Array("RGAC38Y","RGAC38N");
                    ary["RGAC39"] = new Array("RGAC39Y","RGAC39N");
                    ary["RGAC40"] = new Array("RGAC40Y","RGAC40N");
                    ary["RGAC41"] = new Array("RGAC41Y","RGAC41N");
                    ary["RGAC42"] = new Array("RGAC42Y","RGAC42N");
                    ary["RGAC43"] = new Array("RGAC43Y","RGAC43N");
                    ary["RGAC44"] = new Array("RGAC44Y","RGAC44N");
                    ary["RGAC45"] = new Array("RGAC45Y","RGAC45N");
                    ary["RGAC46"] = new Array("RGAC46Y","RGAC46N");
                    ary["RGAC47"] = new Array("RGAC47Y","RGAC47N");
                    ary["RGAC48"] = new Array("RGAC48Y","RGAC48N");
                    ary["RGAC49"] = new Array("RGAC49Y","RGAC49N");
                    ary["RGAC50"] = new Array("RGAC50Y","RGAC50N");
                    ary["RGAD01"] = new Array("RGAD01Y","RGAD01N");
                    ary["RGAD02"] = new Array("RGAD02Y","RGAD02N");
                    ary["RGAD03"] = new Array("RGAD03Y","RGAD03N");
                    ary["RGAD04"] = new Array("RGAD04Y","RGAD04N");
                    ary["RGAD05"] = new Array("RGAD05Y","RGAD05N");
                    ary["RGAD06"] = new Array("RGAD06Y","RGAD06N");
                    ary["RGAD07"] = new Array("RGAD07Y","RGAD07N");
                    ary["RGAD08"] = new Array("RGAD08Y","RGAD08N");
                    ary["RGAD09"] = new Array("RGAD09Y","RGAD09N");
                    ary["RGAD10"] = new Array("RGAD10Y","RGAD10N");
                    ary["RGAD11"] = new Array("RGAD11Y","RGAD11N");
                    ary["RGAD12"] = new Array("RGAD12Y","RGAD12N");
                    ary["RGAD13"] = new Array("RGAD13Y","RGAD13N");
                    ary["RGAE01"] = new Array("RGAE01Y","RGAE01N");
                    ary["RGAE02"] = new Array("RGAE02Y","RGAE02N");
                    ary["RGAE03"] = new Array("RGAE03Y","RGAE03N");
                    ary["RGAE04"] = new Array("RGAE04Y","RGAE04N");
                    ary["RGAE05"] = new Array("RGAE05Y","RGAE05N");
                    ary["RGAE06"] = new Array("RGAE06Y","RGAE06N");
                    ary["RGAE07"] = new Array("RGAE07Y","RGAE07N");
                    ary["RGAE08"] = new Array("RGAE08Y","RGAE08N");
                    ary["RGAE09"] = new Array("RGAE09Y","RGAE09N");
                    ary["RGAE10"] = new Array("RGAE10Y","RGAE10N");
                    ary["RGAE11"] = new Array("RGAE11Y","RGAE11N");
                    ary["RGAE12"] = new Array("RGAE12Y","RGAE12N");
                    ary["RGAE13"] = new Array("RGAE13Y","RGAE13N");
                    ary["RGAE14"] = new Array("RGAE14Y","RGAE14N");
                    ary["RGAE15"] = new Array("RGAE15Y","RGAE15N");
                    ary["RGAE16"] = new Array("RGAE16Y","RGAE16N");
                    ary["RGAE17"] = new Array("RGAE17Y","RGAE17N");
                    ary["RGAE18"] = new Array("RGAE18Y","RGAE18N");
                    ary["RGAE19"] = new Array("RGAE19Y","RGAE19N");
                    ary["RGAE20"] = new Array("RGAE20Y","RGAE20N");
                    ary["RGAE21"] = new Array("RGAE21Y","RGAE21N");
                    ary["RGAE22"] = new Array("RGAE22Y","RGAE22N");
                    ary["RGAE23"] = new Array("RGAE23Y","RGAE23N");
                    ary["RGAE24"] = new Array("RGAE24Y","RGAE24N");
                    ary["RGAE25"] = new Array("RGAE25Y","RGAE25N");
                    ary["RGAE26"] = new Array("RGAE26Y","RGAE26N");
                    ary["RGAE27"] = new Array("RGAE27Y","RGAE27N");
                    ary["RGAE28"] = new Array("RGAE28Y","RGAE28N");
                    ary["RGAE29"] = new Array("RGAE29Y","RGAE29N");
                    ary["RGAE30"] = new Array("RGAE30Y","RGAE30N");
                    ary["RGAE31"] = new Array("RGAE31Y","RGAE31N");
                    ary["RGAE32"] = new Array("RGAE32Y","RGAE32N");
                    ary["RGAE33"] = new Array("RGAE33Y","RGAE33N");
                    ary["RGAE34"] = new Array("RGAE34Y","RGAE34N");
                    ary["RGAE35"] = new Array("RGAE35Y","RGAE35N");
                    ary["RGAE36"] = new Array("RGAE36Y","RGAE36N");
                    ary["RGAE37"] = new Array("RGAE37Y","RGAE37N");
                    ary["RGAE38"] = new Array("RGAE38Y","RGAE38N");
                    ary["RGAE39"] = new Array("RGAE39Y","RGAE39N");
                    ary["RGAE40"] = new Array("RGAE40Y","RGAE40N");
                    ary["RGAE41"] = new Array("RGAE41Y","RGAE41N");
                    ary["RGAE42"] = new Array("RGAE42Y","RGAE42N");
                    ary["RGAE43"] = new Array("RGAE43Y","RGAE43N");
                    ary["RGAE44"] = new Array("RGAE44Y","RGAE44N");
                    ary["RGAE45"] = new Array("RGAE45Y","RGAE45N");
                    ary["RGAE46"] = new Array("RGAE46Y","RGAE46N");
                    ary["RGAE47"] = new Array("RGAE47Y","RGAE47N");
                    ary["RGAE48"] = new Array("RGAE48Y","RGAE48N");
                    ary["RGAE49"] = new Array("RGAE49Y","RGAE49N");
                    ary["RGAE50"] = new Array("RGAE50Y","RGAE50N");
                    ary["RGOUA01"] = new Array("RGOUA01O","RGOUA01U");
                    ary["RGOUA02"] = new Array("RGOUA02O","RGOUA02U");
                    ary["RGOUA03"] = new Array("RGOUA03O","RGOUA03U");
                    ary["RGOUA04"] = new Array("RGOUA04O","RGOUA04U");
                    ary["RGOUA05"] = new Array("RGOUA05O","RGOUA05U");
                    ary["RGOUA06"] = new Array("RGOUA06O","RGOUA06U");
                    ary["RGOUA07"] = new Array("RGOUA07O","RGOUA07U");
                    ary["RGOUA08"] = new Array("RGOUA08O","RGOUA08U");
                    ary["RGOUA09"] = new Array("RGOUA09O","RGOUA09U");
                    ary["RGOUA10"] = new Array("RGOUA10O","RGOUA10U");
                    ary["RGOUA11"] = new Array("RGOUA11O","RGOUA11U");
                    ary["RGOUA12"] = new Array("RGOUA12O","RGOUA12U");
                    ary["RGOUA13"] = new Array("RGOUA13O","RGOUA13U");
                    ary["RGOUB01"] = new Array("RGOUB01O","RGOUB01U");
                    ary["RGOUB02"] = new Array("RGOUB02O","RGOUB02U");
                    ary["RGOUB03"] = new Array("RGOUB03O","RGOUB03U");
                    ary["RGOUB04"] = new Array("RGOUB04O","RGOUB04U");
                    ary["RGOUB05"] = new Array("RGOUB05O","RGOUB05U");
                    ary["RGOUB06"] = new Array("RGOUB06O","RGOUB06U");
                    ary["RGOUB07"] = new Array("RGOUB07O","RGOUB07U");
                    ary["RGOUB08"] = new Array("RGOUB08O","RGOUB08U");
                    ary["RGOUB09"] = new Array("RGOUB09O","RGOUB09U");
                    ary["RGOUB10"] = new Array("RGOUB10O","RGOUB10U");
                    ary["RGOUB11"] = new Array("RGOUB11O","RGOUB11U");
                    ary["RGOUB12"] = new Array("RGOUB12O","RGOUB12U");
                    ary["RGOUB13"] = new Array("RGOUB13O","RGOUB13U");
                    ary["RGOUC01"] = new Array("RGOUC01O","RGOUC01U");
                    ary["RGOUC02"] = new Array("RGOUC02O","RGOUC02U");
                    ary["RGOUC03"] = new Array("RGOUC03O","RGOUC03U");
                    ary["RGOUC04"] = new Array("RGOUC04O","RGOUC04U");
                    ary["RGOUC05"] = new Array("RGOUC05O","RGOUC05U");
                    ary["RGOUC06"] = new Array("RGOUC06O","RGOUC06U");
                    ary["RGOUC07"] = new Array("RGOUC07O","RGOUC07U");
                    ary["RGOUC08"] = new Array("RGOUC08O","RGOUC08U");
                    ary["RGOUC09"] = new Array("RGOUC09O","RGOUC09U");
                    ary["RGOUC10"] = new Array("RGOUC10O","RGOUC10U");
                    ary["RGOUC11"] = new Array("RGOUC11O","RGOUC11U");
                    ary["RGOUC12"] = new Array("RGOUC12O","RGOUC12U");
                    ary["RGOUC13"] = new Array("RGOUC13O","RGOUC13U");
                    ary["RGOUC14"] = new Array("RGOUC14O","RGOUC14U");
                    ary["RGOUC15"] = new Array("RGOUC15O","RGOUC15U");
                    ary["RGOUC16"] = new Array("RGOUC16O","RGOUC16U");
                    ary["RGOUC17"] = new Array("RGOUC17O","RGOUC17U");
                    ary["RGOUC18"] = new Array("RGOUC18O","RGOUC18U");
                    ary["RGOUC19"] = new Array("RGOUC19O","RGOUC19U");
                    ary["RGOUC20"] = new Array("RGOUC20O","RGOUC20U");
                    ary["RGOUC21"] = new Array("RGOUC21O","RGOUC21U");
                    ary["RGOUC22"] = new Array("RGOUC22O","RGOUC22U");
                    ary["RGOUC23"] = new Array("RGOUC23O","RGOUC23U");
                    ary["RGOUC24"] = new Array("RGOUC24O","RGOUC24U");
                    ary["RGOUC25"] = new Array("RGOUC25O","RGOUC25U");
                    ary["RGOUC26"] = new Array("RGOUC26O","RGOUC26U");
                    ary["RGOUC27"] = new Array("RGOUC27O","RGOUC27U");
                    ary["RGOUC28"] = new Array("RGOUC28O","RGOUC28U");
                    ary["RGOUC29"] = new Array("RGOUC29O","RGOUC29U");
                    ary["RGOUC30"] = new Array("RGOUC30O","RGOUC30U");
                    ary["RGOUC31"] = new Array("RGOUC31O","RGOUC31U");
                    ary["RGOUC32"] = new Array("RGOUC32O","RGOUC32U");
                    ary["RGOUC33"] = new Array("RGOUC33O","RGOUC33U");
                    ary["RGOUC34"] = new Array("RGOUC34O","RGOUC34U");
                    ary["RGOUC35"] = new Array("RGOUC35O","RGOUC35U");
                    ary["RGOUC36"] = new Array("RGOUC36O","RGOUC36U");
                    ary["RGOUC37"] = new Array("RGOUC37O","RGOUC37U");
                    ary["RGOUC38"] = new Array("RGOUC38O","RGOUC38U");
                    ary["RGOUC39"] = new Array("RGOUC39O","RGOUC39U");
                    ary["RGOUC40"] = new Array("RGOUC40O","RGOUC40U");
                    ary["RGOUC41"] = new Array("RGOUC41O","RGOUC41U");
                    ary["RGOUC42"] = new Array("RGOUC42O","RGOUC42U");
                    ary["RGOUC43"] = new Array("RGOUC43O","RGOUC43U");
                    ary["RGOUC44"] = new Array("RGOUC44O","RGOUC44U");
                    ary["RGOUC45"] = new Array("RGOUC45O","RGOUC45U");
                    ary["RGOUC46"] = new Array("RGOUC46O","RGOUC46U");
                    ary["RGOUC47"] = new Array("RGOUC47O","RGOUC47U");
                    ary["RGOUC48"] = new Array("RGOUC48O","RGOUC48U");
                    ary["RGOUC49"] = new Array("RGOUC49O","RGOUC49U");
                    ary["RGOUC50"] = new Array("RGOUC50O","RGOUC50U");
                    ary["RGOUD01"] = new Array("RGOUD01O","RGOUD01U");
                    ary["RGOUD02"] = new Array("RGOUD02O","RGOUD02U");
                    ary["RGOUD03"] = new Array("RGOUD03O","RGOUD03U");
                    ary["RGOUD04"] = new Array("RGOUD04O","RGOUD04U");
                    ary["RGOUD05"] = new Array("RGOUD05O","RGOUD05U");
                    ary["RGOUD06"] = new Array("RGOUD06O","RGOUD06U");
                    ary["RGOUD07"] = new Array("RGOUD07O","RGOUD07U");
                    ary["RGOUD08"] = new Array("RGOUD08O","RGOUD08U");
                    ary["RGOUD09"] = new Array("RGOUD09O","RGOUD09U");
                    ary["RGOUD10"] = new Array("RGOUD10O","RGOUD10U");
                    ary["RGOUD11"] = new Array("RGOUD11O","RGOUD11U");
                    ary["RGOUD12"] = new Array("RGOUD12O","RGOUD12U");
                    ary["RGOUD13"] = new Array("RGOUD13O","RGOUD13U");
                    ary["RGOUE01"] = new Array("RGOUE01O","RGOUE01U");
                    ary["RGOUE02"] = new Array("RGOUE02O","RGOUE02U");
                    ary["RGOUE03"] = new Array("RGOUE03O","RGOUE03U");
                    ary["RGOUE04"] = new Array("RGOUE04O","RGOUE04U");
                    ary["RGOUE05"] = new Array("RGOUE05O","RGOUE05U");
                    ary["RGOUE06"] = new Array("RGOUE06O","RGOUE06U");
                    ary["RGOUE07"] = new Array("RGOUE07O","RGOUE07U");
                    ary["RGOUE08"] = new Array("RGOUE08O","RGOUE08U");
                    ary["RGOUE09"] = new Array("RGOUE09O","RGOUE09U");
                    ary["RGOUE10"] = new Array("RGOUE10O","RGOUE10U");
                    ary["RGOUE11"] = new Array("RGOUE11O","RGOUE11U");
                    ary["RGOUE12"] = new Array("RGOUE12O","RGOUE12U");
                    ary["RGOUE13"] = new Array("RGOUE13O","RGOUE13U");
                    ary["RGOUE14"] = new Array("RGOUE14O","RGOUE14U");
                    ary["RGOUE15"] = new Array("RGOUE15O","RGOUE15U");
                    ary["RGOUE16"] = new Array("RGOUE16O","RGOUE16U");
                    ary["RGOUE17"] = new Array("RGOUE17O","RGOUE17U");
                    ary["RGOUE18"] = new Array("RGOUE18O","RGOUE18U");
                    ary["RGOUE19"] = new Array("RGOUE19O","RGOUE19U");
                    ary["RGOUE20"] = new Array("RGOUE20O","RGOUE20U");
                    ary["RGOUE21"] = new Array("RGOUE21O","RGOUE21U");
                    ary["RGOUE22"] = new Array("RGOUE22O","RGOUE22U");
                    ary["RGOUE23"] = new Array("RGOUE23O","RGOUE23U");
                    ary["RGOUE24"] = new Array("RGOUE24O","RGOUE24U");
                    ary["RGOUE25"] = new Array("RGOUE25O","RGOUE25U");
                    ary["RGOUE26"] = new Array("RGOUE26O","RGOUE26U");
                    ary["RGOUE27"] = new Array("RGOUE27O","RGOUE27U");
                    ary["RGOUE28"] = new Array("RGOUE28O","RGOUE28U");
                    ary["RGOUE29"] = new Array("RGOUE29O","RGOUE29U");
                    ary["RGOUE30"] = new Array("RGOUE30O","RGOUE30U");
                    ary["RGOUE31"] = new Array("RGOUE31O","RGOUE31U");
                    ary["RGOUE32"] = new Array("RGOUE32O","RGOUE32U");
                    ary["RGOUE33"] = new Array("RGOUE33O","RGOUE33U");
                    ary["RGOUE34"] = new Array("RGOUE34O","RGOUE34U");
                    ary["RGOUE35"] = new Array("RGOUE35O","RGOUE35U");
                    ary["RGOUE36"] = new Array("RGOUE36O","RGOUE36U");
                    ary["RGOUE37"] = new Array("RGOUE37O","RGOUE37U");
                    ary["RGOUE38"] = new Array("RGOUE38O","RGOUE38U");
                    ary["RGOUE39"] = new Array("RGOUE39O","RGOUE39U");
                    ary["RGOUE40"] = new Array("RGOUE40O","RGOUE40U");
                    ary["RGOUE41"] = new Array("RGOUE41O","RGOUE41U");
                    ary["RGOUE42"] = new Array("RGOUE42O","RGOUE42U");
                    ary["RGOUE43"] = new Array("RGOUE43O","RGOUE43U");
                    ary["RGOUE44"] = new Array("RGOUE44O","RGOUE44U");
                    ary["RGOUE45"] = new Array("RGOUE45O","RGOUE45U");
                    ary["RGOUE46"] = new Array("RGOUE46O","RGOUE46U");
                    ary["RGOUE47"] = new Array("RGOUE47O","RGOUE47U");
                    ary["RGOUE48"] = new Array("RGOUE48O","RGOUE48U");
                    ary["RGOUE49"] = new Array("RGOUE49O","RGOUE49U");
                    ary["RGOUE50"] = new Array("RGOUE50O","RGOUE50U");
                    ary["RFA01"] = new Array("RFA01H","RFA01C");
                    ary["RFA02"] = new Array("RFA02H","RFA02C");
                    ary["RFA03"] = new Array("RFA03H","RFA03C");
                    ary["RFA04"] = new Array("RFA04H","RFA04C");
                    ary["RFA05"] = new Array("RFA05H","RFA05C");
                    ary["RFA06"] = new Array("RFA06H","RFA06C");
                    ary["RFA07"] = new Array("RFA07H","RFA07C");
                    ary["RFA08"] = new Array("RFA08H","RFA08C");
                    ary["RFA09"] = new Array("RFA09H","RFA09C");
                    ary["RFA10"] = new Array("RFA10H","RFA10C");
                    ary["RFA11"] = new Array("RFA11H","RFA11C");
                    ary["RFA12"] = new Array("RFA12H","RFA12C");
                    ary["RFA13"] = new Array("RFA13H","RFA13C");
                    ary["RFB01"] = new Array("RFB01H","RFB01C");
                    ary["RFB02"] = new Array("RFB02H","RFB02C");
                    ary["RFB03"] = new Array("RFB03H","RFB03C");
                    ary["RFB04"] = new Array("RFB04H","RFB04C");
                    ary["RFB05"] = new Array("RFB05H","RFB05C");
                    ary["RFB06"] = new Array("RFB06H","RFB06C");
                    ary["RFB07"] = new Array("RFB07H","RFB07C");
                    ary["RFB08"] = new Array("RFB08H","RFB08C");
                    ary["RFB09"] = new Array("RFB09H","RFB09C");
                    ary["RFB10"] = new Array("RFB10H","RFB10C");
                    ary["RFB11"] = new Array("RFB11H","RFB11C");
                    ary["RFB12"] = new Array("RFB12H","RFB12C");
                    ary["RFB13"] = new Array("RFB13H","RFB13C");
                    ary["RFC01"] = new Array("RFC01H","RFC01C");
                    ary["RFC02"] = new Array("RFC02H","RFC02C");
                    ary["RFC03"] = new Array("RFC03H","RFC03C");
                    ary["RFC04"] = new Array("RFC04H","RFC04C");
                    ary["RFC05"] = new Array("RFC05H","RFC05C");
                    ary["RFC06"] = new Array("RFC06H","RFC06C");
                    ary["RFC07"] = new Array("RFC07H","RFC07C");
                    ary["RFC08"] = new Array("RFC08H","RFC08C");
                    ary["RFC09"] = new Array("RFC09H","RFC09C");
                    ary["RFC10"] = new Array("RFC10H","RFC10C");
                    ary["RFC11"] = new Array("RFC11H","RFC11C");
                    ary["RFC12"] = new Array("RFC12H","RFC12C");
                    ary["RFC13"] = new Array("RFC13H","RFC13C");
                    ary["RFC14"] = new Array("RFC14H","RFC14C");
                    ary["RFC15"] = new Array("RFC15H","RFC15C");
                    ary["RFC16"] = new Array("RFC16H","RFC16C");
                    ary["RFC17"] = new Array("RFC17H","RFC17C");
                    ary["RFC18"] = new Array("RFC18H","RFC18C");
                    ary["RFC19"] = new Array("RFC19H","RFC19C");
                    ary["RFC20"] = new Array("RFC20H","RFC20C");
                    ary["RFC21"] = new Array("RFC21H","RFC21C");
                    ary["RFC22"] = new Array("RFC22H","RFC22C");
                    ary["RFC23"] = new Array("RFC23H","RFC23C");
                    ary["RFC24"] = new Array("RFC24H","RFC24C");
                    ary["RFC25"] = new Array("RFC25H","RFC25C");
                    ary["RFC26"] = new Array("RFC26H","RFC26C");
                    ary["RFC27"] = new Array("RFC27H","RFC27C");
                    ary["RFC28"] = new Array("RFC28H","RFC28C");
                    ary["RFC29"] = new Array("RFC29H","RFC29C");
                    ary["RFC30"] = new Array("RFC30H","RFC30C");
                    ary["RFC31"] = new Array("RFC31H","RFC31C");
                    ary["RFC32"] = new Array("RFC32H","RFC32C");
                    ary["RFC33"] = new Array("RFC33H","RFC33C");
                    ary["RFC34"] = new Array("RFC34H","RFC34C");
                    ary["RFC35"] = new Array("RFC35H","RFC35C");
                    ary["RFC36"] = new Array("RFC36H","RFC36C");
                    ary["RFC37"] = new Array("RFC37H","RFC37C");
                    ary["RFC38"] = new Array("RFC38H","RFC38C");
                    ary["RFC39"] = new Array("RFC39H","RFC39C");
                    ary["RFC40"] = new Array("RFC40H","RFC40C");
                    ary["RFC41"] = new Array("RFC41H","RFC41C");
                    ary["RFC42"] = new Array("RFC42H","RFC42C");
                    ary["RFC43"] = new Array("RFC43H","RFC43C");
                    ary["RFC44"] = new Array("RFC44H","RFC44C");
                    ary["RFC45"] = new Array("RFC45H","RFC45C");
                    ary["RFC46"] = new Array("RFC46H","RFC46C");
                    ary["RFC47"] = new Array("RFC47H","RFC47C");
                    ary["RFC48"] = new Array("RFC48H","RFC48C");
                    ary["RFC49"] = new Array("RFC49H","RFC49C");
                    ary["RFC50"] = new Array("RFC50H","RFC50C");
                    ary["RFD01"] = new Array("RFD01H","RFD01C");
                    ary["RFD02"] = new Array("RFD02H","RFD02C");
                    ary["RFD03"] = new Array("RFD03H","RFD03C");
                    ary["RFD04"] = new Array("RFD04H","RFD04C");
                    ary["RFD05"] = new Array("RFD05H","RFD05C");
                    ary["RFD06"] = new Array("RFD06H","RFD06C");
                    ary["RFD07"] = new Array("RFD07H","RFD07C");
                    ary["RFD08"] = new Array("RFD08H","RFD08C");
                    ary["RFD09"] = new Array("RFD09H","RFD09C");
                    ary["RFD10"] = new Array("RFD10H","RFD10C");
                    ary["RFD11"] = new Array("RFD11H","RFD11C");
                    ary["RFD12"] = new Array("RFD12H","RFD12C");
                    ary["RFD13"] = new Array("RFD13H","RFD13C");
                    ary["RFE01"] = new Array("RFE01H","RFE01C");
                    ary["RFE02"] = new Array("RFE02H","RFE02C");
                    ary["RFE03"] = new Array("RFE03H","RFE03C");
                    ary["RFE04"] = new Array("RFE04H","RFE04C");
                    ary["RFE05"] = new Array("RFE05H","RFE05C");
                    ary["RFE06"] = new Array("RFE06H","RFE06C");
                    ary["RFE07"] = new Array("RFE07H","RFE07C");
                    ary["RFE08"] = new Array("RFE08H","RFE08C");
                    ary["RFE09"] = new Array("RFE09H","RFE09C");
                    ary["RFE10"] = new Array("RFE10H","RFE10C");
                    ary["RFE11"] = new Array("RFE11H","RFE11C");
                    ary["RFE12"] = new Array("RFE12H","RFE12C");
                    ary["RFE13"] = new Array("RFE13H","RFE13C");
                    ary["RFE14"] = new Array("RFE14H","RFE14C");
                    ary["RFE15"] = new Array("RFE15H","RFE15C");
                    ary["RFE16"] = new Array("RFE16H","RFE16C");
                    ary["RFE17"] = new Array("RFE17H","RFE17C");
                    ary["RFE18"] = new Array("RFE18H","RFE18C");
                    ary["RFE19"] = new Array("RFE19H","RFE19C");
                    ary["RFE20"] = new Array("RFE20H","RFE20C");
                    ary["RFE21"] = new Array("RFE21H","RFE21C");
                    ary["RFE22"] = new Array("RFE22H","RFE22C");
                    ary["RFE23"] = new Array("RFE23H","RFE23C");
                    ary["RFE24"] = new Array("RFE24H","RFE24C");
                    ary["RFE25"] = new Array("RFE25H","RFE25C");
                    ary["RFE26"] = new Array("RFE26H","RFE26C");
                    ary["RFE27"] = new Array("RFE27H","RFE27C");
                    ary["RFE28"] = new Array("RFE28H","RFE28C");
                    ary["RFE29"] = new Array("RFE29H","RFE29C");
                    ary["RFE30"] = new Array("RFE30H","RFE30C");
                    ary["RFE31"] = new Array("RFE31H","RFE31C");
                    ary["RFE32"] = new Array("RFE32H","RFE32C");
                    ary["RFE33"] = new Array("RFE33H","RFE33C");
                    ary["RFE34"] = new Array("RFE34H","RFE34C");
                    ary["RFE35"] = new Array("RFE35H","RFE35C");
                    ary["RFE36"] = new Array("RFE36H","RFE36C");
                    ary["RFE37"] = new Array("RFE37H","RFE37C");
                    ary["RFE38"] = new Array("RFE38H","RFE38C");
                    ary["RFE39"] = new Array("RFE39H","RFE39C");
                    ary["RFE40"] = new Array("RFE40H","RFE40C");
                    ary["RFE41"] = new Array("RFE41H","RFE41C");
                    ary["RFE42"] = new Array("RFE42H","RFE42C");
                    ary["RFE43"] = new Array("RFE43H","RFE43C");
                    ary["RFE44"] = new Array("RFE44H","RFE44C");
                    ary["RFE45"] = new Array("RFE45H","RFE45C");
                    ary["RFE46"] = new Array("RFE46H","RFE46C");
                    ary["RFE47"] = new Array("RFE47H","RFE47C");
                    ary["RFE48"] = new Array("RFE48H","RFE48C");
                    ary["RFE49"] = new Array("RFE49H","RFE49C");
                    ary["RFE50"] = new Array("RFE50H","RFE50C");
                    ary["RM"] = new Array("RMH","RMC");
                    ary["RE"] = new Array("REH","REC");
                    ary["ROU"] = new Array("ROUH","ROUC");
                    ary["RPD3"] = new Array("RPD320","RPD321","RPD302","RPD312");
                    ary["RPD5"] = new Array("RPD530","RPD531","RPD532","RPD503","RPD513","RPD523");
                    ary["ROUH"] = new Array("ROUHO","ROUHU");
                    ary["ROUC"] = new Array("ROUCO","ROUCU");
                    ary["REO"] = new Array("REOO","REOE");
                    return ary
                }
                ;
                _self.getWtypeFT_FT = function() {
                    var ary = new Array;
                    ary.push("0_M");
                    ary.push("0_R");
                    ary.push("6_R");
                    ary.push("6_OU");
                    ary.push("1_M");
                    ary.push("1_R");
                    ary.push("1_OU");
                    ary.push("2_M");
                    ary.push("2_R");
                    ary.push("2_OU");
                    ary.push("3_M");
                    ary.push("3_R");
                    ary.push("3_OU");
                    ary.push("4_M");
                    ary.push("4_R");
                    ary.push("4_OU");
                    ary.push("5_M");
                    ary.push("5_R");
                    ary.push("5_OU");
                    ary.push("0_OUH");
                    ary.push("0_OUC");
                    ary.push("0_OU");
                    ary.push("0_EO");
                    ary.push("6_EO");
                    ary.push("1_EO");
                    ary.push("2_EO");
                    ary.push("3_EO");
                    ary.push("4_EO");
                    ary.push("5_EO");
                    ary.push("0_PD3");
                    ary.push("0_PD5");
                    return ary
                }
                ;
                _self.getRtypeFT = function() {
                    var ary = new Object;
                    ary["M"] = new Array("MH","MC");
                    ary["R"] = new Array("RH","RC");
                    ary["OU"] = new Array("OUH","OUC");
                    ary["PD3"] = new Array("PD320","PD321","PD302","PD312");
                    ary["PD5"] = new Array("PD530","PD531","PD532","PD503","PD513","PD523");
                    ary["OUH"] = new Array("OUHO","OUHU");
                    ary["OUC"] = new Array("OUCO","OUCU");
                    ary["EO"] = new Array("EOO","EOE");
                    return ary
                }
                ;
                _self.getXmlNode = function() {
                    return _xmlnode
                }
                ;
                _self.getDataComplete = function(jsonData, OuterOpen, nowfilter) {
                    var errorMsg = util.showConnectMsg(jsonData);
                    if (util.alertConnectMsg(errorMsg))
                        return;
                    var parseJson = JSON.parse(jsonData);
                    var code = parseJson["code"];
                    if (code == "Its not special") {
                        _self.checkHasGame(false);
                        if (top.rightECID != "")
                            parentClass.dispatchEvent("noGameCheckLive", {
                                "eventid_ph": "",
                                "center_tv": ""
                            });
                        return
                    }
                    var status = parseJson["status"];
                    var dataObj = parseJson["response"];
                    var gameObj = parseJson["response"]["GAMES"];
                    var scoreObj = new Array;
                    var videoObj = parseJson["response"]["VIDEO"];
                    var phpData = parseJson["phpData"];
                    var game = new Array;
                    var gameHash = new Array;
                    var mainGame = null;
                    if (status == "success") {
                        _self.setJSON(jsonData);
                        _self.setVIDEOobj(videoObj);
                        for (var g = 0; g < util.countSize(gameObj); g++) {
                            var tmpGameObj = gameObj["GAME" + g];
                            game.push(tmpGameObj);
                            if (tmpGameObj["IS_MASTER"] == "Y") {
                                mainGame = tmpGameObj;
                                scoreObj = mainGame["SCORE"]
                            }
                        }
                        if (mainGame == null)
                            mainGame = gameObj["GAME0"];
                        var filter = nowfilter ? nowfilter : phpData["filter"];
                        var tmpTS = dataObj["ts"];
                        var gidm = mainGame["GIDM"];
                        var hasGame = false;
                        var _id, gdata, playData;
                        if (game.length > 0) {
                            var gidHash = new Object;
                            for (var i = 0; i < game.length; i++) {
                                var tmp_ms = game[i]["MS"];
                                var gidm = game[i]["GIDM"];
                                var ms = tmp_ms != "" && tmp_ms != null ? tmp_ms.split("_")[1] : "0";
                                gdata = game[i];
                                _id = gdata["GID"];
                                if (gidHash[ms] == null)
                                    gidHash[ms] = new Array;
                                gameHash[_id] = gdata;
                                gidHash[ms].push(_id)
                            }
                            top.resize_mainGame = mainGame;
                            top.rightFrom = "game_more";
                            var intoRB = _self.checkIntoRB(null, mainGame);
                            if (intoRB)
                                return;
                            var gopen = mainGame["GOPEN"];
                            var Live = mainGame["IS_LIVE"];
                            scDataObj = _self.setScoreBoard(mainGame, showtype, gopen, Live, OuterOpen, LS_game, scoreObj);
                            top.scDataObj = scDataObj;
                            _self.setObj(scDataObj);
                            _self.parseScoreBoard(scDataObj, "More");
                            if (getView().viewportwidth >= 1024) {
                                parentClass.dispatchEvent("parseRightScoreBoard", scDataObj);
                                parentClass.dispatchEvent("checkRightLive", {
                                    "videoObj": videoObj,
                                    "mainGame": mainGame,
                                    "format": "json"
                                });
                                parentClass.dispatchEvent("setRightLoading", {
                                    "isShow": false
                                })
                            } else if (showtype == "live")
                                _self.checkLiveJson(videoObj, mainGame, tv, mt);
                            else
                                _self.checkLiveJson(videoObj, mainGame, tv, mt, "game_more");
                            var parseParam = {
                                "id": gidm,
                                "nowMode": "FT",
                                "gidHash": gidHash,
                                "game": game,
                                "ts": tmpTS,
                                "gameHash": gameHash
                            };
                            _self.setParseParam(parseParam);
                            if (dataObj["ALL_CLOSE"] != "Y")
                                hasGame = _self.parseJsonData(parseParam);
                            else
                                hasGame = false;
                            _self.setScrollToTop()
                        } else {
                            var defObj = new Object;
                            defObj.def_league = def_league;
                            defObj.def_team_h = def_team_h;
                            defObj.def_team_c = def_team_c;
                            defObj.def_datetime = def_datetime;
                            _self.parseNoGameScoreBoard(defObj);
                            top.resize_mainGame = null;
                            top.scDataObj = null;
                            var eventid_ph = videoObj["TV_ID"];
                            var center_tv = videoObj["CENTER_TV"];
                            var eventid_mt = videoObj["MT_ID"];
                            var mtgtype = videoObj["MT_GTYPE"];
                            var mtspid = videoObj["MT_SID"];
                            var lineups = videoObj["MT_LINEUPS"];
                            var MT_data = new Object;
                            MT_data["gtype"] = mtgtype;
                            MT_data["spid"] = mtspid;
                            if (getView().viewportwidth >= 1024) {
                                parentClass.dispatchEvent("parseNoGameRightScoreBoard", defObj);
                                parentClass.dispatchEvent("noGameCheckLive", {
                                    "eventid_ph": eventid_ph,
                                    "center_tv": center_tv,
                                    "eventid_mt": eventid_mt,
                                    "MT_data": MT_data,
                                    "lineups": lineups,
                                    "from": "game_more"
                                })
                            } else
                                _self.checkLiveProc(eventid_ph, center_tv, eventid_mt, MT_data, lineups, tv, mt)
                        }
                        _self.checkHasGame(hasGame)
                    } else {
                        var defObj = new Object;
                        defObj.def_league = def_league;
                        defObj.def_team_h = def_team_h;
                        defObj.def_team_c = def_team_c;
                        defObj.def_datetime = def_datetime;
                        _self.parseNoGameScoreBoard(defObj);
                        top.resize_mainGame = null;
                        top.scDataObj = null
                    }
                    parentClass.dispatchEvent("showLoading", {
                        "isShow": false,
                        "from": classname
                    })
                }
                ;
                _self.parseNoGameScoreBoard = function(obj) {
                    sc_game_H = "";
                    sc_game_A = "";
                    total_H = "";
                    total_A = "";
                    set_name = "";
                    if (get("league"))
                        get("league").innerHTML = util_game.showTxt(obj.def_league);
                    get("team_h").innerHTML = util_game.showTxt(obj.def_team_h);
                    get("team_c").innerHTML = util_game.showTxt(obj.def_team_c);
                    get("midfield").style.display = "none";
                    if (showtype == "live") {
                        get("set_name").innerHTML = util_game.showTxt(set_name);
                        get("sc_game_H").innerHTML = util_game.showTxt(sc_game_H);
                        get("sc_game_A").innerHTML = util_game.showTxt(sc_game_A);
                        get("total_H").innerHTML = util_game.showTxt(total_H);
                        get("total_A").innerHTML = util_game.showTxt(total_A);
                        if (sc_game_H == "") {
                            get("box_sco_tn").style.display = "none";
                            get("box_sco_point").style.display = "none";
                            if (dom.getElementById("R_score_h"))
                                dom.getElementById("R_score_h").style.display = "none";
                            if (dom.getElementById("R_score_c"))
                                dom.getElementById("R_score_c").style.display = "none"
                        } else {
                            get("box_sco_tn").style.display = "";
                            get("box_sco_point").style.display = ""
                        }
                    } else
                        get("game_time").innerHTML = util_game.showTxt(obj.def_datetime)
                }
                ;
                _self.setScoreBoard = function(mainGame, showtype, gopen, Live, OuterOpen, LS_game, scoreObj) {
                    if (mainGame != null) {
                        var league = mainGame["LEAGUE"];
                        var midfield = mainGame["MIDFIELD"];
                        var team_h = mainGame["TEAM_H"];
                        var team_c = mainGame["TEAM_C"];
                        var limit_min = mainGame["LIMIT_MIN"];
                        var best = mainGame["BEST"];
                        var max_set = best.substr(best.length - 1, 1) * 1;
                        var sc_set_H = "";
                        var sc_set_A = "";
                        var nowGame = mainGame["NOWGAME"];
                        var server_sw = mainGame["SERVE"];
                        if (scoreObj) {
                            sc_set_H = scoreObj["SC_SET_H"];
                            sc_set_A = scoreObj["SC_SET_A"];
                            sc_game_H = scoreObj["SC_GAME_H"];
                            sc_game_A = scoreObj["SC_GAME_A"]
                        }
                        var w_delay = mainGame["W_DELAY"];
                        var datetime = mainGame["DATETIME"];
                        var tmpDate = datetime.split(" ")[0];
                        var tmpTime = datetime.split(" ")[1];
                        var str_M = tmpDate.split("-")[1];
                        var str_D = tmpDate.split("-")[2];
                        var str_H = tmpTime.split(":")[0];
                        var str_Min = tmpTime.split(":")[1];
                        var isToday = util_game.isToday(tmpDate);
                        var diff = util.getTimeDiff(top["userData"].timetype);
                        if (Math.abs(diff) > 0) {
                            var _tmpDate = new Date(datetime.replace(/-/g, "/"));
                            var newDate = new Date(_tmpDate.getTime() + diff * 60 * 60 * 1E3);
                            var newMonth = util.setZero(newDate.getMonth() + 1);
                            var newDay = util.setZero(newDate.getDate());
                            var newHour = util.setZero(newDate.getHours());
                            var newMin = util.setZero(newDate.getMinutes());
                            if (newDay != str_D * 1)
                                var newDatetime = top.langx == "en-us" ? newDay + " " + LS_game.get("mon_" + newMonth) + "<b></b>" + newHour + ":" + newMin : newMonth + LS_game.get("mon_str") + newDay + LS_game.get("day_str") + "<b></b>" + newHour + ":" + newMin;
                            else {
                                var earlyDateTime = top.langx == "en-us" ? newDay + " " + LS_game.get("mon_" + newMonth) + "<b></b>" + newHour + ":" + newMin : newMonth + LS_game.get("mon_str") + newDay + LS_game.get("day_str") + "<b></b>" + newHour + ":" + newMin;
                                var newDatetime = isToday ? LS_game.get("showtype_today") + "<b></b>" + newHour + ":" + newMin : earlyDateTime
                            }
                        } else {
                            var earlyDateTime = top.langx == "en-us" ? str_D + " " + LS_game.get("mon_" + str_M) + "<b></b>" + str_H + ":" + str_Min : str_M + LS_game.get("mon_str") + str_D + LS_game.get("day_str") + "<b></b>" + str_H + ":" + str_Min;
                            var newDatetime = isToday ? LS_game.get("showtype_today") + "<b></b>" + str_H + ":" + str_Min : earlyDateTime
                        }
                        var obj = new Object;
                        obj.mainGame = mainGame;
                        obj.LS_game = LS_game;
                        obj.gtype = "tn";
                        obj.showtype = showtype;
                        obj.gopen = gopen;
                        obj.Live = Live;
                        obj.league = league;
                        obj.midfield = midfield;
                        obj.team_h = team_h;
                        obj.team_c = team_c;
                        obj.def_league = def_league;
                        obj.def_team_h = def_team_h;
                        obj.def_team_c = def_team_c;
                        obj.max_set = max_set;
                        obj.sc_set_H = sc_set_H;
                        obj.sc_set_A = sc_set_A;
                        obj.server_sw = server_sw;
                        obj.sc_game_H = sc_game_H;
                        obj.sc_game_A = sc_game_A;
                        obj.w_delay = w_delay;
                        obj.limit_min = limit_min;
                        obj.OuterOpen = OuterOpen;
                        obj.newDatetime = newDatetime;
                        obj.nowGame = nowGame;
                        obj.scoreObj = scoreObj;
                        return obj
                    }
                }
                ;
                _self.parseScoreBoard = function(obj) {
                    try {
                        if (get("league"))
                            get("league").innerHTML = obj.league == null ? util_game.showTxt(obj.def_league) : util_game.showTxt(obj.league);
                        get("midfield").style.display = obj.midfield == "Y" ? "" : "none";
                        get("team_h").innerHTML = obj.team_h == null ? util_game.showTxt(obj.def_team_h) : util_game.showTxt(obj.team_h);
                        get("team_c").innerHTML = obj.team_c == null ? util_game.showTxt(obj.def_team_c) : util_game.showTxt(obj.team_c);
                        if (obj.gopen != "N" && obj.showtype == "parlay") {
                            if (get("game_parlay"))
                                get("game_parlay").innerHTML = util_game.showTxt(obj.limit_min);
                            if (get("showPLimit"))
                                get("showPLimit").style.display = ""
                        }
                        if (obj.showtype == "live")
                            if (obj.gopen == "N" && obj.Live == "N") {
                                if (obj.OuterOpen) {
                                    get("box_scostate").style.display = "none";
                                    get("box_sco_tn").style.display = "none";
                                    get("box_sco_point").style.display = "none"
                                }
                            } else {
                                var set_ary = new Array("sc_1st","sc_2nd","sc_3th","sc_4th","sc_5th","sc_6th");
                                for (var d = 0; d < set_ary.length; d++) {
                                    if (get(set_ary[d]).classList.contains("last"))
                                        get(set_ary[d]).classList.remove("last");
                                    if (get(set_ary[d] + "_H").classList.contains("last"))
                                        get(set_ary[d] + "_H").classList.remove("last");
                                    if (get(set_ary[d] + "_A").classList.contains("last"))
                                        get(set_ary[d] + "_A").classList.remove("last")
                                }
                                if (obj.max_set == 3) {
                                    get(set_ary[obj.max_set]).classList.add("last");
                                    get(set_ary[obj.max_set] + "_H").classList.add("last");
                                    get(set_ary[obj.max_set] + "_A").classList.add("last");
                                    for (var x = obj.max_set + 1; x < set_ary.length; x++) {
                                        get(set_ary[x]).style.display = "none";
                                        get("320_" + set_ary[x]).style.display = "none";
                                        get(set_ary[x] + "_H").style.display = "none";
                                        get(set_ary[x] + "_A").style.display = "none"
                                    }
                                } else {
                                    get(set_ary[obj.max_set]).classList.add("last");
                                    get(set_ary[obj.max_set] + "_H").classList.add("last");
                                    get(set_ary[obj.max_set] + "_A").classList.add("last");
                                    for (var x = 0; x < set_ary.length; x++) {
                                        get(set_ary[x]).style.display = "";
                                        get("320_" + set_ary[x]).style.display = "";
                                        get(set_ary[x] + "_H").style.display = "";
                                        get(set_ary[x] + "_A").style.display = ""
                                    }
                                }
                                sc_set_H = obj.sc_set_H == "" ? 0 : obj.sc_set_H * 1;
                                sc_set_A = obj.sc_set_A == "" ? 0 : obj.sc_set_A * 1;
                                get("sc_set_H").innerHTML = util_game.showTxt(sc_set_H);
                                get("sc_set_A").innerHTML = util_game.showTxt(sc_set_A);
                                var se_now = sc_set_H + sc_set_A + 1;
                                if (se_now >= obj.max_set && obj.max_set > 0)
                                    se_now = obj.max_set;
                                var sc_now_H = obj.scoreObj[set_ary[se_now - 1].toUpperCase() + "_H"] * 1;
                                var sc_now_A = obj.scoreObj[set_ary[se_now - 1].toUpperCase() + "_A"] * 1;
                                sc_now_H = sc_now_H == "" ? "0" : sc_now_H;
                                sc_now_A = sc_now_A == "" ? "0" : sc_now_A;
                                var serveTeam = new Array("serve_h","serve_c");
                                for (var b = 0; b < serveTeam.length; b++)
                                    if (get(serveTeam[b]).classList.contains("on"))
                                        get(serveTeam[b]).classList.remove("on");
                                if (obj.server_sw != "2") {
                                    var team = obj.server_sw == "1" ? "h" : "c";
                                    get("serve_" + team).classList.add("on")
                                }
                                total_H = 0;
                                total_A = 0;
                                for (var t = 0; t < set_ary.length; t++) {
                                    var _name = set_ary[t];
                                    var sc_H = util_game.showTxt(obj.scoreObj[_name.toUpperCase() + "_H"] * 1);
                                    var sc_A = util_game.showTxt(obj.scoreObj[_name.toUpperCase() + "_A"] * 1);
                                    if (t == 5) {
                                        sc_H = 0;
                                        sc_A = 0
                                    }
                                    get("320_" + _name).style.display = "none";
                                    var se_640 = se_now;
                                    var se_320 = se_now - 1;
                                    if (t < se_640) {
                                        get(_name + "_H").innerHTML = sc_H;
                                        get(_name + "_A").innerHTML = sc_A
                                    } else {
                                        get(_name + "_H").innerHTML = "";
                                        get(_name + "_A").innerHTML = ""
                                    }
                                    if (t < se_320) {
                                        get("320_" + _name).style.display = "";
                                        get("320_" + _name + "_H").innerHTML = sc_H;
                                        get("320_" + _name + "_A").innerHTML = sc_A
                                    } else
                                        get("320_" + _name).style.display = "none";
                                    total_H += sc_H;
                                    total_A += sc_A;
                                    if (get(_name + "_H").classList.contains("on"))
                                        get(_name + "_H").classList.remove("on");
                                    if (get(_name + "_A").classList.contains("on"))
                                        get(_name + "_A").classList.remove("on");
                                    if (get("320_" + _name).classList.contains("on"))
                                        get("320_" + _name).classList.remove("on")
                                }
                                get("total_H").innerHTML = util_game.showTxt(total_H);
                                get("total_A").innerHTML = util_game.showTxt(total_A);
                                get(set_ary[se_now - 1] + "_H").classList.add("on");
                                get(set_ary[se_now - 1] + "_A").classList.add("on");
                                get("320_" + set_ary[se_now - 1]).classList.add("on");
                                sc_game_H = obj.sc_game_H == "" ? "0" : util_game.util_AdvToA(obj.sc_game_H);
                                sc_game_A = obj.sc_game_A == "" ? "0" : util_game.util_AdvToA(obj.sc_game_A);
                                get("sc_game_H").innerHTML = util_game.showTxt(sc_game_H);
                                get("sc_game_A").innerHTML = util_game.showTxt(sc_game_A);
                                if (se_now > obj.max_set)
                                    se_now = obj.max_set;
                                set_name = util_game.showTxt(obj.LS_game.get("TN_" + se_now + "_nowPlay")) + " / " + util_game.showTxt(obj.max_set) + "<b></b>" + util_game.showTxt(obj.LS_game.get("TN_" + obj.nowGame + "_nowGame"));
                                get("set_name").innerHTML = set_name;
                                if (obj.w_delay == "Y") {
                                    get("w_delay").style.display = "";
                                    get("set_name").style.display = "none"
                                } else {
                                    get("w_delay").style.display = "none";
                                    get("set_name").style.display = ""
                                }
                                if (top.resizePage != "home")
                                    get("div_matches").style.display = ""
                            }
                        else {
                            if (top.resizePage != "home")
                                get("div_matches").style.display = "";
                            get("game_time").innerHTML = util_game.showTxt(obj.newDatetime)
                        }
                    } catch (e) {
                        console.log("parseScoreBoard_TN error", e)
                    }
                }
                ;
                function get(_id) {
                    if (hasRightPanel)
                        _id = "R_" + _id;
                    return dom.getElementById(_id)
                }
                _self.setHasRightPanel = function() {
                    hasRightPanel = true
                }
                ;
                _self.new_eval = function(str) {
                    var fn = Function;
                    return (new fn("return " + str))()
                }
                ;
                _self.checkNum = function(num) {
                    return parseInt(num) < 10 ? "0" + num : num
                }
            }
            ;