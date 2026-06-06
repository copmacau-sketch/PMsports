function game_more_BM(_win, _dom, _post) {
                var classname = "game_more_BM";
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
                var team_RegExp = new RegExp(" - \([^\)]+\)");
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
                var sc_game_H = "";
                var sc_game_A = "";
                var total_H = "";
                var total_A = "";
                var set_name = "";
                var hasRightPanel = false;
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
                    ary.push("0_RPTWA01");
                    ary.push("0_RPTWA02");
                    ary.push("0_RPTWA03");
                    ary.push("0_RPTWA04");
                    ary.push("0_RPTWA05");
                    ary.push("0_RPTWA06");
                    ary.push("0_RPTWA07");
                    ary.push("0_RPTWA08");
                    ary.push("0_RPTWA09");
                    ary.push("0_RPTWA10");
                    ary.push("0_RPTWA11");
                    ary.push("0_RPTWA12");
                    ary.push("0_RPTWA13");
                    ary.push("0_RPTWA14");
                    ary.push("0_RPTWA15");
                    ary.push("0_RPTWA16");
                    ary.push("0_RPTWA17");
                    ary.push("0_RPTWA18");
                    ary.push("0_RPTWA19");
                    ary.push("0_RPTWA20");
                    ary.push("0_RPTWA21");
                    ary.push("0_RPTWA22");
                    ary.push("0_RPTWA23");
                    ary.push("0_RPTWA24");
                    ary.push("0_RPTWA25");
                    ary.push("0_RPTWA26");
                    ary.push("0_RPTWA27");
                    ary.push("0_RPTWA28");
                    ary.push("0_RPTWA29");
                    ary.push("0_RPTWA30");
                    ary.push("0_RPTWA31");
                    ary.push("0_RPTWA32");
                    ary.push("0_RPTWA33");
                    ary.push("0_RPTWA34");
                    ary.push("0_RPTWA35");
                    ary.push("0_RPTWA36");
                    ary.push("0_RPTWA37");
                    ary.push("0_RPTWA38");
                    ary.push("0_RPTWA39");
                    ary.push("0_RPTWA40");
                    ary.push("0_RPTWA41");
                    ary.push("0_RPTWA42");
                    ary.push("0_RPTWA43");
                    ary.push("0_RPTWA44");
                    ary.push("0_RPTWA45");
                    ary.push("0_RPTWA46");
                    ary.push("0_RPTWA47");
                    ary.push("0_RPTWA48");
                    ary.push("0_RPTWA49");
                    ary.push("0_RPTWA50");
                    ary.push("0_RPTWA51");
                    ary.push("0_RPTWA52");
                    ary.push("0_RPTWA53");
                    ary.push("0_RPTWA54");
                    ary.push("0_RPTWA55");
                    ary.push("0_RPTWA56");
                    ary.push("0_RPTWA57");
                    ary.push("0_RPTWA58");
                    ary.push("0_RPTWA59");
                    ary.push("0_RWXPA05");
                    ary.push("0_RWXPA10");
                    ary.push("0_RWXPA15");
                    ary.push("0_RPTWB01");
                    ary.push("0_RPTWB02");
                    ary.push("0_RPTWB03");
                    ary.push("0_RPTWB04");
                    ary.push("0_RPTWB05");
                    ary.push("0_RPTWB06");
                    ary.push("0_RPTWB07");
                    ary.push("0_RPTWB08");
                    ary.push("0_RPTWB09");
                    ary.push("0_RPTWB10");
                    ary.push("0_RPTWB11");
                    ary.push("0_RPTWB12");
                    ary.push("0_RPTWB13");
                    ary.push("0_RPTWB14");
                    ary.push("0_RPTWB15");
                    ary.push("0_RPTWB16");
                    ary.push("0_RPTWB17");
                    ary.push("0_RPTWB18");
                    ary.push("0_RPTWB19");
                    ary.push("0_RPTWB20");
                    ary.push("0_RPTWB21");
                    ary.push("0_RPTWB22");
                    ary.push("0_RPTWB23");
                    ary.push("0_RPTWB24");
                    ary.push("0_RPTWB25");
                    ary.push("0_RPTWB26");
                    ary.push("0_RPTWB27");
                    ary.push("0_RPTWB28");
                    ary.push("0_RPTWB29");
                    ary.push("0_RPTWB30");
                    ary.push("0_RPTWB31");
                    ary.push("0_RPTWB32");
                    ary.push("0_RPTWB33");
                    ary.push("0_RPTWB34");
                    ary.push("0_RPTWB35");
                    ary.push("0_RPTWB36");
                    ary.push("0_RPTWB37");
                    ary.push("0_RPTWB38");
                    ary.push("0_RPTWB39");
                    ary.push("0_RPTWB40");
                    ary.push("0_RPTWB41");
                    ary.push("0_RPTWB42");
                    ary.push("0_RPTWB43");
                    ary.push("0_RPTWB44");
                    ary.push("0_RPTWB45");
                    ary.push("0_RPTWB46");
                    ary.push("0_RPTWB47");
                    ary.push("0_RPTWB48");
                    ary.push("0_RPTWB49");
                    ary.push("0_RPTWB50");
                    ary.push("0_RPTWB51");
                    ary.push("0_RPTWB52");
                    ary.push("0_RPTWB53");
                    ary.push("0_RPTWB54");
                    ary.push("0_RPTWB55");
                    ary.push("0_RPTWB56");
                    ary.push("0_RPTWB57");
                    ary.push("0_RPTWB58");
                    ary.push("0_RPTWB59");
                    ary.push("0_RWXPB05");
                    ary.push("0_RWXPB10");
                    ary.push("0_RWXPB15");
                    ary.push("0_RPTWC01");
                    ary.push("0_RPTWC02");
                    ary.push("0_RPTWC03");
                    ary.push("0_RPTWC04");
                    ary.push("0_RPTWC05");
                    ary.push("0_RPTWC06");
                    ary.push("0_RPTWC07");
                    ary.push("0_RPTWC08");
                    ary.push("0_RPTWC09");
                    ary.push("0_RPTWC10");
                    ary.push("0_RPTWC11");
                    ary.push("0_RPTWC12");
                    ary.push("0_RPTWC13");
                    ary.push("0_RPTWC14");
                    ary.push("0_RPTWC15");
                    ary.push("0_RPTWC16");
                    ary.push("0_RPTWC17");
                    ary.push("0_RPTWC18");
                    ary.push("0_RPTWC19");
                    ary.push("0_RPTWC20");
                    ary.push("0_RPTWC21");
                    ary.push("0_RPTWC22");
                    ary.push("0_RPTWC23");
                    ary.push("0_RPTWC24");
                    ary.push("0_RPTWC25");
                    ary.push("0_RPTWC26");
                    ary.push("0_RPTWC27");
                    ary.push("0_RPTWC28");
                    ary.push("0_RPTWC29");
                    ary.push("0_RPTWC30");
                    ary.push("0_RPTWC31");
                    ary.push("0_RPTWC32");
                    ary.push("0_RPTWC33");
                    ary.push("0_RPTWC34");
                    ary.push("0_RPTWC35");
                    ary.push("0_RPTWC36");
                    ary.push("0_RPTWC37");
                    ary.push("0_RPTWC38");
                    ary.push("0_RPTWC39");
                    ary.push("0_RPTWC40");
                    ary.push("0_RPTWC41");
                    ary.push("0_RPTWC42");
                    ary.push("0_RPTWC43");
                    ary.push("0_RPTWC44");
                    ary.push("0_RPTWC45");
                    ary.push("0_RPTWC46");
                    ary.push("0_RPTWC47");
                    ary.push("0_RPTWC48");
                    ary.push("0_RPTWC49");
                    ary.push("0_RPTWC50");
                    ary.push("0_RPTWC51");
                    ary.push("0_RPTWC52");
                    ary.push("0_RPTWC53");
                    ary.push("0_RPTWC54");
                    ary.push("0_RPTWC55");
                    ary.push("0_RPTWC56");
                    ary.push("0_RPTWC57");
                    ary.push("0_RPTWC58");
                    ary.push("0_RPTWC59");
                    ary.push("0_RWXPC05");
                    ary.push("0_RWXPC10");
                    ary.push("0_RWXPC15");
                    ary.push("0_RPTWD01");
                    ary.push("0_RPTWD02");
                    ary.push("0_RPTWD03");
                    ary.push("0_RPTWD04");
                    ary.push("0_RPTWD05");
                    ary.push("0_RPTWD06");
                    ary.push("0_RPTWD07");
                    ary.push("0_RPTWD08");
                    ary.push("0_RPTWD09");
                    ary.push("0_RPTWD10");
                    ary.push("0_RPTWD11");
                    ary.push("0_RPTWD12");
                    ary.push("0_RPTWD13");
                    ary.push("0_RPTWD14");
                    ary.push("0_RPTWD15");
                    ary.push("0_RPTWD16");
                    ary.push("0_RPTWD17");
                    ary.push("0_RPTWD18");
                    ary.push("0_RPTWD19");
                    ary.push("0_RPTWD20");
                    ary.push("0_RPTWD21");
                    ary.push("0_RPTWD22");
                    ary.push("0_RPTWD23");
                    ary.push("0_RPTWD24");
                    ary.push("0_RPTWD25");
                    ary.push("0_RPTWD26");
                    ary.push("0_RPTWD27");
                    ary.push("0_RPTWD28");
                    ary.push("0_RPTWD29");
                    ary.push("0_RWXPD05");
                    ary.push("0_RWXPD10");
                    ary.push("0_RWXPD15");
                    ary.push("0_RPTWE01");
                    ary.push("0_RPTWE02");
                    ary.push("0_RPTWE03");
                    ary.push("0_RPTWE04");
                    ary.push("0_RPTWE05");
                    ary.push("0_RPTWE06");
                    ary.push("0_RPTWE07");
                    ary.push("0_RPTWE08");
                    ary.push("0_RPTWE09");
                    ary.push("0_RPTWE10");
                    ary.push("0_RPTWE11");
                    ary.push("0_RPTWE12");
                    ary.push("0_RPTWE13");
                    ary.push("0_RPTWE14");
                    ary.push("0_RPTWE15");
                    ary.push("0_RPTWE16");
                    ary.push("0_RPTWE17");
                    ary.push("0_RPTWE18");
                    ary.push("0_RPTWE19");
                    ary.push("0_RPTWE20");
                    ary.push("0_RPTWE21");
                    ary.push("0_RPTWE22");
                    ary.push("0_RPTWE23");
                    ary.push("0_RPTWE24");
                    ary.push("0_RPTWE25");
                    ary.push("0_RPTWE26");
                    ary.push("0_RPTWE27");
                    ary.push("0_RPTWE28");
                    ary.push("0_RPTWE29");
                    ary.push("0_RWXPE05");
                    ary.push("0_RWXPE10");
                    ary.push("0_RWXPE15");
                    ary.push("0_RM");
                    ary.push("1_RE");
                    ary.push("0_RE");
                    ary.push("2_RE");
                    ary.push("2_RM");
                    ary.push("2_ROU");
                    ary.push("3_RE");
                    ary.push("3_RM");
                    ary.push("3_ROU");
                    ary.push("4_RE");
                    ary.push("4_RM");
                    ary.push("4_ROU");
                    ary.push("1_ROU");
                    ary.push("5_RE");
                    ary.push("5_RM");
                    ary.push("5_ROU");
                    ary.push("6_RE");
                    ary.push("6_RM");
                    ary.push("6_ROU");
                    ary.push("7_RE");
                    ary.push("7_RM");
                    ary.push("7_ROU");
                    ary.push("8_RE");
                    ary.push("8_RM");
                    ary.push("8_ROU");
                    ary.push("0_ROUH");
                    ary.push("0_ROUC");
                    ary.push("2_ROUH");
                    ary.push("2_ROUC");
                    ary.push("3_ROUH");
                    ary.push("3_ROUC");
                    ary.push("4_ROUH");
                    ary.push("4_ROUC");
                    ary.push("5_ROUH");
                    ary.push("5_ROUC");
                    ary.push("6_ROUH");
                    ary.push("6_ROUC");
                    ary.push("7_ROUH");
                    ary.push("7_ROUC");
                    ary.push("8_ROUH");
                    ary.push("8_ROUC");
                    ary.push("0_ROU");
                    ary.push("0_REO");
                    ary.push("1_REO");
                    ary.push("2_REO");
                    ary.push("3_REO");
                    ary.push("4_REO");
                    ary.push("5_REO");
                    ary.push("6_REO");
                    ary.push("7_REO");
                    ary.push("8_REO");
                    ary.push("0_RPD3");
                    ary.push("0_RPD5");
                    ary.push("0_RPD7");
                    return ary
                }
                ;
                _self.getRtypeRB = function() {
                    var ary = new Object;
                    ary["RE"] = new Array("REH","REC");
                    ary["ROU"] = new Array("ROUH","ROUC");
                    ary["ROUH"] = new Array("ROUHO","ROUHU");
                    ary["ROUC"] = new Array("ROUCO","ROUCU");
                    ary["RPD3"] = new Array("RPD320","RPD321","RPD302","RPD312");
                    ary["RPD5"] = new Array("RPD530","RPD531","RPD532","RPD503","RPD513","RPD523");
                    ary["RM"] = new Array("RMH","RMC");
                    ary["REO"] = new Array("REOO","REOE");
                    ary["RPTWA01"] = new Array("RPTWA01H","RPTWA01C");
                    ary["RPTWA02"] = new Array("RPTWA02H","RPTWA02C");
                    ary["RPTWA03"] = new Array("RPTWA03H","RPTWA03C");
                    ary["RPTWA04"] = new Array("RPTWA04H","RPTWA04C");
                    ary["RPTWA05"] = new Array("RPTWA05H","RPTWA05C");
                    ary["RPTWA06"] = new Array("RPTWA06H","RPTWA06C");
                    ary["RPTWA07"] = new Array("RPTWA07H","RPTWA07C");
                    ary["RPTWA08"] = new Array("RPTWA08H","RPTWA08C");
                    ary["RPTWA09"] = new Array("RPTWA09H","RPTWA09C");
                    ary["RPTWA10"] = new Array("RPTWA10H","RPTWA10C");
                    ary["RPTWA11"] = new Array("RPTWA11H","RPTWA11C");
                    ary["RPTWA12"] = new Array("RPTWA12H","RPTWA12C");
                    ary["RPTWA13"] = new Array("RPTWA13H","RPTWA13C");
                    ary["RPTWA14"] = new Array("RPTWA14H","RPTWA14C");
                    ary["RPTWA15"] = new Array("RPTWA15H","RPTWA15C");
                    ary["RPTWA16"] = new Array("RPTWA16H","RPTWA16C");
                    ary["RPTWA17"] = new Array("RPTWA17H","RPTWA17C");
                    ary["RPTWA18"] = new Array("RPTWA18H","RPTWA18C");
                    ary["RPTWA19"] = new Array("RPTWA19H","RPTWA19C");
                    ary["RPTWA20"] = new Array("RPTWA20H","RPTWA20C");
                    ary["RPTWA21"] = new Array("RPTWA21H","RPTWA21C");
                    ary["RPTWA22"] = new Array("RPTWA22H","RPTWA22C");
                    ary["RPTWA23"] = new Array("RPTWA23H","RPTWA23C");
                    ary["RPTWA24"] = new Array("RPTWA24H","RPTWA24C");
                    ary["RPTWA25"] = new Array("RPTWA25H","RPTWA25C");
                    ary["RPTWA26"] = new Array("RPTWA26H","RPTWA26C");
                    ary["RPTWA27"] = new Array("RPTWA27H","RPTWA27C");
                    ary["RPTWA28"] = new Array("RPTWA28H","RPTWA28C");
                    ary["RPTWA29"] = new Array("RPTWA29H","RPTWA29C");
                    ary["RPTWA30"] = new Array("RPTWA30H","RPTWA30C");
                    ary["RPTWA31"] = new Array("RPTWA31H","RPTWA31C");
                    ary["RPTWA32"] = new Array("RPTWA32H","RPTWA32C");
                    ary["RPTWA33"] = new Array("RPTWA33H","RPTWA33C");
                    ary["RPTWA34"] = new Array("RPTWA34H","RPTWA34C");
                    ary["RPTWA35"] = new Array("RPTWA35H","RPTWA35C");
                    ary["RPTWA36"] = new Array("RPTWA36H","RPTWA36C");
                    ary["RPTWA37"] = new Array("RPTWA37H","RPTWA37C");
                    ary["RPTWA38"] = new Array("RPTWA38H","RPTWA38C");
                    ary["RPTWA39"] = new Array("RPTWA39H","RPTWA39C");
                    ary["RPTWA40"] = new Array("RPTWA40H","RPTWA40C");
                    ary["RPTWA41"] = new Array("RPTWA41H","RPTWA41C");
                    ary["RPTWA42"] = new Array("RPTWA42H","RPTWA42C");
                    ary["RPTWA43"] = new Array("RPTWA43H","RPTWA43C");
                    ary["RPTWA44"] = new Array("RPTWA44H","RPTWA44C");
                    ary["RPTWA45"] = new Array("RPTWA45H","RPTWA45C");
                    ary["RPTWA46"] = new Array("RPTWA46H","RPTWA46C");
                    ary["RPTWA47"] = new Array("RPTWA47H","RPTWA47C");
                    ary["RPTWA48"] = new Array("RPTWA48H","RPTWA48C");
                    ary["RPTWA49"] = new Array("RPTWA49H","RPTWA49C");
                    ary["RPTWA50"] = new Array("RPTWA50H","RPTWA50C");
                    ary["RPTWA51"] = new Array("RPTWA51H","RPTWA51C");
                    ary["RPTWA52"] = new Array("RPTWA52H","RPTWA52C");
                    ary["RPTWA53"] = new Array("RPTWA53H","RPTWA53C");
                    ary["RPTWA54"] = new Array("RPTWA54H","RPTWA54C");
                    ary["RPTWA55"] = new Array("RPTWA55H","RPTWA55C");
                    ary["RPTWA56"] = new Array("RPTWA56H","RPTWA56C");
                    ary["RPTWA57"] = new Array("RPTWA57H","RPTWA57C");
                    ary["RPTWA58"] = new Array("RPTWA58H","RPTWA58C");
                    ary["RPTWA59"] = new Array("RPTWA59H","RPTWA59C");
                    ary["RPTWB01"] = new Array("RPTWB01H","RPTWB01C");
                    ary["RPTWB02"] = new Array("RPTWB02H","RPTWB02C");
                    ary["RPTWB03"] = new Array("RPTWB03H","RPTWB03C");
                    ary["RPTWB04"] = new Array("RPTWB04H","RPTWB04C");
                    ary["RPTWB05"] = new Array("RPTWB05H","RPTWB05C");
                    ary["RPTWB06"] = new Array("RPTWB06H","RPTWB06C");
                    ary["RPTWB07"] = new Array("RPTWB07H","RPTWB07C");
                    ary["RPTWB08"] = new Array("RPTWB08H","RPTWB08C");
                    ary["RPTWB09"] = new Array("RPTWB09H","RPTWB09C");
                    ary["RPTWB10"] = new Array("RPTWB10H","RPTWB10C");
                    ary["RPTWB11"] = new Array("RPTWB11H","RPTWB11C");
                    ary["RPTWB12"] = new Array("RPTWB12H","RPTWB12C");
                    ary["RPTWB13"] = new Array("RPTWB13H","RPTWB13C");
                    ary["RPTWB14"] = new Array("RPTWB14H","RPTWB14C");
                    ary["RPTWB15"] = new Array("RPTWB15H","RPTWB15C");
                    ary["RPTWB16"] = new Array("RPTWB16H","RPTWB16C");
                    ary["RPTWB17"] = new Array("RPTWB17H","RPTWB17C");
                    ary["RPTWB18"] = new Array("RPTWB18H","RPTWB18C");
                    ary["RPTWB19"] = new Array("RPTWB19H","RPTWB19C");
                    ary["RPTWB20"] = new Array("RPTWB20H","RPTWB20C");
                    ary["RPTWB21"] = new Array("RPTWB21H","RPTWB21C");
                    ary["RPTWB22"] = new Array("RPTWB22H","RPTWB22C");
                    ary["RPTWB23"] = new Array("RPTWB23H","RPTWB23C");
                    ary["RPTWB24"] = new Array("RPTWB24H","RPTWB24C");
                    ary["RPTWB25"] = new Array("RPTWB25H","RPTWB25C");
                    ary["RPTWB26"] = new Array("RPTWB26H","RPTWB26C");
                    ary["RPTWB27"] = new Array("RPTWB27H","RPTWB27C");
                    ary["RPTWB28"] = new Array("RPTWB28H","RPTWB28C");
                    ary["RPTWB29"] = new Array("RPTWB29H","RPTWB29C");
                    ary["RPTWB30"] = new Array("RPTWB30H","RPTWB30C");
                    ary["RPTWB31"] = new Array("RPTWB31H","RPTWB31C");
                    ary["RPTWB32"] = new Array("RPTWB32H","RPTWB32C");
                    ary["RPTWB33"] = new Array("RPTWB33H","RPTWB33C");
                    ary["RPTWB34"] = new Array("RPTWB34H","RPTWB34C");
                    ary["RPTWB35"] = new Array("RPTWB35H","RPTWB35C");
                    ary["RPTWB36"] = new Array("RPTWB36H","RPTWB36C");
                    ary["RPTWB37"] = new Array("RPTWB37H","RPTWB37C");
                    ary["RPTWB38"] = new Array("RPTWB38H","RPTWB38C");
                    ary["RPTWB39"] = new Array("RPTWB39H","RPTWB39C");
                    ary["RPTWB40"] = new Array("RPTWB40H","RPTWB40C");
                    ary["RPTWB41"] = new Array("RPTWB41H","RPTWB41C");
                    ary["RPTWB42"] = new Array("RPTWB42H","RPTWB42C");
                    ary["RPTWB43"] = new Array("RPTWB43H","RPTWB43C");
                    ary["RPTWB44"] = new Array("RPTWB44H","RPTWB44C");
                    ary["RPTWB45"] = new Array("RPTWB45H","RPTWB45C");
                    ary["RPTWB46"] = new Array("RPTWB46H","RPTWB46C");
                    ary["RPTWB47"] = new Array("RPTWB47H","RPTWB47C");
                    ary["RPTWB48"] = new Array("RPTWB48H","RPTWB48C");
                    ary["RPTWB49"] = new Array("RPTWB49H","RPTWB49C");
                    ary["RPTWB50"] = new Array("RPTWB50H","RPTWB50C");
                    ary["RPTWB51"] = new Array("RPTWB51H","RPTWB51C");
                    ary["RPTWB52"] = new Array("RPTWB52H","RPTWB52C");
                    ary["RPTWB53"] = new Array("RPTWB53H","RPTWB53C");
                    ary["RPTWB54"] = new Array("RPTWB54H","RPTWB54C");
                    ary["RPTWB55"] = new Array("RPTWB55H","RPTWB55C");
                    ary["RPTWB56"] = new Array("RPTWB56H","RPTWB56C");
                    ary["RPTWB57"] = new Array("RPTWB57H","RPTWB57C");
                    ary["RPTWB58"] = new Array("RPTWB58H","RPTWB58C");
                    ary["RPTWB59"] = new Array("RPTWB59H","RPTWB59C");
                    ary["RPTWC01"] = new Array("RPTWC01H","RPTWC01C");
                    ary["RPTWC02"] = new Array("RPTWC02H","RPTWC02C");
                    ary["RPTWC03"] = new Array("RPTWC03H","RPTWC03C");
                    ary["RPTWC04"] = new Array("RPTWC04H","RPTWC04C");
                    ary["RPTWC05"] = new Array("RPTWC05H","RPTWC05C");
                    ary["RPTWC06"] = new Array("RPTWC06H","RPTWC06C");
                    ary["RPTWC07"] = new Array("RPTWC07H","RPTWC07C");
                    ary["RPTWC08"] = new Array("RPTWC08H","RPTWC08C");
                    ary["RPTWC09"] = new Array("RPTWC09H","RPTWC09C");
                    ary["RPTWC10"] = new Array("RPTWC10H","RPTWC10C");
                    ary["RPTWC11"] = new Array("RPTWC11H","RPTWC11C");
                    ary["RPTWC12"] = new Array("RPTWC12H","RPTWC12C");
                    ary["RPTWC13"] = new Array("RPTWC13H","RPTWC13C");
                    ary["RPTWC14"] = new Array("RPTWC14H","RPTWC14C");
                    ary["RPTWC15"] = new Array("RPTWC15H","RPTWC15C");
                    ary["RPTWC16"] = new Array("RPTWC16H","RPTWC16C");
                    ary["RPTWC17"] = new Array("RPTWC17H","RPTWC17C");
                    ary["RPTWC18"] = new Array("RPTWC18H","RPTWC18C");
                    ary["RPTWC19"] = new Array("RPTWC19H","RPTWC19C");
                    ary["RPTWC20"] = new Array("RPTWC20H","RPTWC20C");
                    ary["RPTWC21"] = new Array("RPTWC21H","RPTWC21C");
                    ary["RPTWC22"] = new Array("RPTWC22H","RPTWC22C");
                    ary["RPTWC23"] = new Array("RPTWC23H","RPTWC23C");
                    ary["RPTWC24"] = new Array("RPTWC24H","RPTWC24C");
                    ary["RPTWC25"] = new Array("RPTWC25H","RPTWC25C");
                    ary["RPTWC26"] = new Array("RPTWC26H","RPTWC26C");
                    ary["RPTWC27"] = new Array("RPTWC27H","RPTWC27C");
                    ary["RPTWC28"] = new Array("RPTWC28H","RPTWC28C");
                    ary["RPTWC29"] = new Array("RPTWC29H","RPTWC29C");
                    ary["RPTWC30"] = new Array("RPTWC30H","RPTWC30C");
                    ary["RPTWC31"] = new Array("RPTWC31H","RPTWC31C");
                    ary["RPTWC32"] = new Array("RPTWC32H","RPTWC32C");
                    ary["RPTWC33"] = new Array("RPTWC33H","RPTWC33C");
                    ary["RPTWC34"] = new Array("RPTWC34H","RPTWC34C");
                    ary["RPTWC35"] = new Array("RPTWC35H","RPTWC35C");
                    ary["RPTWC36"] = new Array("RPTWC36H","RPTWC36C");
                    ary["RPTWC37"] = new Array("RPTWC37H","RPTWC37C");
                    ary["RPTWC38"] = new Array("RPTWC38H","RPTWC38C");
                    ary["RPTWC39"] = new Array("RPTWC39H","RPTWC39C");
                    ary["RPTWC40"] = new Array("RPTWC40H","RPTWC40C");
                    ary["RPTWC41"] = new Array("RPTWC41H","RPTWC41C");
                    ary["RPTWC42"] = new Array("RPTWC42H","RPTWC42C");
                    ary["RPTWC43"] = new Array("RPTWC43H","RPTWC43C");
                    ary["RPTWC44"] = new Array("RPTWC44H","RPTWC44C");
                    ary["RPTWC45"] = new Array("RPTWC45H","RPTWC45C");
                    ary["RPTWC46"] = new Array("RPTWC46H","RPTWC46C");
                    ary["RPTWC47"] = new Array("RPTWC47H","RPTWC47C");
                    ary["RPTWC48"] = new Array("RPTWC48H","RPTWC48C");
                    ary["RPTWC49"] = new Array("RPTWC49H","RPTWC49C");
                    ary["RPTWC50"] = new Array("RPTWC50H","RPTWC50C");
                    ary["RPTWC51"] = new Array("RPTWC51H","RPTWC51C");
                    ary["RPTWC52"] = new Array("RPTWC52H","RPTWC52C");
                    ary["RPTWC53"] = new Array("RPTWC53H","RPTWC53C");
                    ary["RPTWC54"] = new Array("RPTWC54H","RPTWC54C");
                    ary["RPTWC55"] = new Array("RPTWC55H","RPTWC55C");
                    ary["RPTWC56"] = new Array("RPTWC56H","RPTWC56C");
                    ary["RPTWC57"] = new Array("RPTWC57H","RPTWC57C");
                    ary["RPTWC58"] = new Array("RPTWC58H","RPTWC58C");
                    ary["RPTWC59"] = new Array("RPTWC59H","RPTWC59C");
                    ary["RPTWD01"] = new Array("RPTWD01H","RPTWD01C");
                    ary["RPTWD02"] = new Array("RPTWD02H","RPTWD02C");
                    ary["RPTWD03"] = new Array("RPTWD03H","RPTWD03C");
                    ary["RPTWD04"] = new Array("RPTWD04H","RPTWD04C");
                    ary["RPTWD05"] = new Array("RPTWD05H","RPTWD05C");
                    ary["RPTWD06"] = new Array("RPTWD06H","RPTWD06C");
                    ary["RPTWD07"] = new Array("RPTWD07H","RPTWD07C");
                    ary["RPTWD08"] = new Array("RPTWD08H","RPTWD08C");
                    ary["RPTWD09"] = new Array("RPTWD09H","RPTWD09C");
                    ary["RPTWD10"] = new Array("RPTWD10H","RPTWD10C");
                    ary["RPTWD11"] = new Array("RPTWD11H","RPTWD11C");
                    ary["RPTWD12"] = new Array("RPTWD12H","RPTWD12C");
                    ary["RPTWD13"] = new Array("RPTWD13H","RPTWD13C");
                    ary["RPTWD14"] = new Array("RPTWD14H","RPTWD14C");
                    ary["RPTWD15"] = new Array("RPTWD15H","RPTWD15C");
                    ary["RPTWD16"] = new Array("RPTWD16H","RPTWD16C");
                    ary["RPTWD17"] = new Array("RPTWD17H","RPTWD17C");
                    ary["RPTWD18"] = new Array("RPTWD18H","RPTWD18C");
                    ary["RPTWD19"] = new Array("RPTWD19H","RPTWD19C");
                    ary["RPTWD20"] = new Array("RPTWD20H","RPTWD20C");
                    ary["RPTWD21"] = new Array("RPTWD21H","RPTWD21C");
                    ary["RPTWD22"] = new Array("RPTWD22H","RPTWD22C");
                    ary["RPTWD23"] = new Array("RPTWD23H","RPTWD23C");
                    ary["RPTWD24"] = new Array("RPTWD24H","RPTWD24C");
                    ary["RPTWD25"] = new Array("RPTWD25H","RPTWD25C");
                    ary["RPTWD26"] = new Array("RPTWD26H","RPTWD26C");
                    ary["RPTWD27"] = new Array("RPTWD27H","RPTWD27C");
                    ary["RPTWD28"] = new Array("RPTWD28H","RPTWD28C");
                    ary["RPTWD29"] = new Array("RPTWD29H","RPTWD29C");
                    ary["RPTWE01"] = new Array("RPTWE01H","RPTWE01C");
                    ary["RPTWE02"] = new Array("RPTWE02H","RPTWE02C");
                    ary["RPTWE03"] = new Array("RPTWE03H","RPTWE03C");
                    ary["RPTWE04"] = new Array("RPTWE04H","RPTWE04C");
                    ary["RPTWE05"] = new Array("RPTWE05H","RPTWE05C");
                    ary["RPTWE06"] = new Array("RPTWE06H","RPTWE06C");
                    ary["RPTWE07"] = new Array("RPTWE07H","RPTWE07C");
                    ary["RPTWE08"] = new Array("RPTWE08H","RPTWE08C");
                    ary["RPTWE09"] = new Array("RPTWE09H","RPTWE09C");
                    ary["RPTWE10"] = new Array("RPTWE10H","RPTWE10C");
                    ary["RPTWE11"] = new Array("RPTWE11H","RPTWE11C");
                    ary["RPTWE12"] = new Array("RPTWE12H","RPTWE12C");
                    ary["RPTWE13"] = new Array("RPTWE13H","RPTWE13C");
                    ary["RPTWE14"] = new Array("RPTWE14H","RPTWE14C");
                    ary["RPTWE15"] = new Array("RPTWE15H","RPTWE15C");
                    ary["RPTWE16"] = new Array("RPTWE16H","RPTWE16C");
                    ary["RPTWE17"] = new Array("RPTWE17H","RPTWE17C");
                    ary["RPTWE18"] = new Array("RPTWE18H","RPTWE18C");
                    ary["RPTWE19"] = new Array("RPTWE19H","RPTWE19C");
                    ary["RPTWE20"] = new Array("RPTWE20H","RPTWE20C");
                    ary["RPTWE21"] = new Array("RPTWE21H","RPTWE21C");
                    ary["RPTWE22"] = new Array("RPTWE22H","RPTWE22C");
                    ary["RPTWE23"] = new Array("RPTWE23H","RPTWE23C");
                    ary["RPTWE24"] = new Array("RPTWE24H","RPTWE24C");
                    ary["RPTWE25"] = new Array("RPTWE25H","RPTWE25C");
                    ary["RPTWE26"] = new Array("RPTWE26H","RPTWE26C");
                    ary["RPTWE27"] = new Array("RPTWE27H","RPTWE27C");
                    ary["RPTWE28"] = new Array("RPTWE28H","RPTWE28C");
                    ary["RPTWE29"] = new Array("RPTWE29H","RPTWE29C");
                    ary["RWXPA05"] = new Array("RWXPA05H","RWXPA05C");
                    ary["RWXPA10"] = new Array("RWXPA10H","RWXPA10C");
                    ary["RWXPA15"] = new Array("RWXPA15H","RWXPA15C");
                    ary["RWXPB05"] = new Array("RWXPB05H","RWXPB05C");
                    ary["RWXPB10"] = new Array("RWXPB10H","RWXPB10C");
                    ary["RWXPB15"] = new Array("RWXPB15H","RWXPB15C");
                    ary["RWXPC05"] = new Array("RWXPC05H","RWXPC05C");
                    ary["RWXPC10"] = new Array("RWXPC10H","RWXPC10C");
                    ary["RWXPC15"] = new Array("RWXPC15H","RWXPC15C");
                    ary["RWXPD05"] = new Array("RWXPD05H","RWXPD05C");
                    ary["RWXPD10"] = new Array("RWXPD10H","RWXPD10C");
                    ary["RWXPD15"] = new Array("RWXPD15H","RWXPD15C");
                    ary["RWXPE05"] = new Array("RWXPE05H","RWXPE05C");
                    ary["RWXPE10"] = new Array("RWXPE10H","RWXPE10C");
                    ary["RWXPE15"] = new Array("RWXPE15H","RWXPE15C");
                    return ary
                }
                ;
                _self.getWtypeFT_FT = function() {
                    var ary = new Array;
                    ary.push("0_PTWA01");
                    ary.push("0_PTWA02");
                    ary.push("0_PTWA03");
                    ary.push("0_WXPA05");
                    ary.push("0_WXPA10");
                    ary.push("0_WXPA15");
                    ary.push("0_M");
                    ary.push("1_R");
                    ary.push("1_OU");
                    ary.push("0_R");
                    ary.push("2_R");
                    ary.push("2_M");
                    ary.push("2_OU");
                    ary.push("3_R");
                    ary.push("3_M");
                    ary.push("3_OU");
                    ary.push("4_R");
                    ary.push("4_M");
                    ary.push("4_OU");
                    ary.push("5_R");
                    ary.push("5_M");
                    ary.push("5_OU");
                    ary.push("6_R");
                    ary.push("6_M");
                    ary.push("6_OU");
                    ary.push("7_R");
                    ary.push("7_M");
                    ary.push("7_OU");
                    ary.push("8_R");
                    ary.push("8_M");
                    ary.push("8_OU");
                    ary.push("0_OUH");
                    ary.push("0_OUC");
                    ary.push("2_OUH");
                    ary.push("2_OUC");
                    ary.push("3_OUH");
                    ary.push("3_OUC");
                    ary.push("4_OUH");
                    ary.push("4_OUC");
                    ary.push("5_OUH");
                    ary.push("5_OUC");
                    ary.push("6_OUH");
                    ary.push("6_OUC");
                    ary.push("7_OUH");
                    ary.push("7_OUC");
                    ary.push("8_OUH");
                    ary.push("8_OUC");
                    ary.push("0_OU");
                    ary.push("0_EO");
                    ary.push("1_EO");
                    ary.push("2_EO");
                    ary.push("3_EO");
                    ary.push("4_EO");
                    ary.push("5_EO");
                    ary.push("6_EO");
                    ary.push("7_EO");
                    ary.push("8_EO");
                    ary.push("0_PD3");
                    ary.push("0_PD5");
                    ary.push("0_PD7");
                    return ary
                }
                ;
                _self.getRtypeFT = function() {
                    var ary = new Object;
                    ary["R"] = new Array("RH","RC");
                    ary["OU"] = new Array("OUH","OUC");
                    ary["OUH"] = new Array("OUHO","OUHU");
                    ary["OUC"] = new Array("OUCO","OUCU");
                    ary["PD3"] = new Array("PD320","PD321","PD302","PD312");
                    ary["PD5"] = new Array("PD530","PD531","PD532","PD503","PD513","PD523");
                    ary["M"] = new Array("MH","MC");
                    ary["EO"] = new Array("EOO","EOE");
                    ary["PTWA01"] = new Array("PTWA01H","PTWA01C");
                    ary["PTWA02"] = new Array("PTWA02H","PTWA02C");
                    ary["PTWA03"] = new Array("PTWA03H","PTWA03C");
                    ary["WXPA05"] = new Array("WXPA05H","WXPA05C");
                    ary["WXPA10"] = new Array("WXPA10H","WXPA10C");
                    ary["WXPA15"] = new Array("WXPA15H","WXPA15C");
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
                    var serveTeam = new Array("serve_h","serve_c");
                    for (var b = 0; b < serveTeam.length; b++)
                        if (get(serveTeam[b]).classList.contains("on"))
                            get(serveTeam[b]).classList.remove("on");
                    var set_ary = new Array("sc_1st","sc_2nd","sc_3th","sc_4th","sc_5th","sc_6th");
                    for (var x = 0; x < set_ary.length; x++) {
                        get(set_ary[x]).style.display = "none";
                        get("320_" + set_ary[x]).style.display = "none";
                        get(set_ary[x] + "_H").style.display = "none";
                        get(set_ary[x] + "_A").style.display = "none"
                    }
                    if (showtype == "live") {
                        get("set_name").innerHTML = util_game.showTxt(set_name);
                        get("sc_game_H").innerHTML = util_game.showTxt(sc_game_H);
                        get("sc_game_A").innerHTML = util_game.showTxt(sc_game_A);
                        get("total_H").innerHTML = util_game.showTxt(total_H);
                        get("total_A").innerHTML = util_game.showTxt(total_A);
                        if (sc_game_H == "") {
                            get("box_sco_bm").style.display = "none";
                            get("box_sco_point").style.display = "none"
                        } else {
                            get("box_sco_bm").style.display = "";
                            get("box_sco_point").style.display = ""
                        }
                    } else
                        get("game_time").innerHTML = util_game.showTxt(obj.def_datetime)
                }
                ;
                _self.setScoreBoard = function(mainGame, showtype, gopen, Live, OuterOpen, LS_game, scoreObj) {
                    if (mainGame != null) {
                        total_H = 0;
                        total_A = 0;
                        var league = mainGame["LEAGUE"];
                        var midfield = mainGame["MIDFIELD"];
                        var team_h = mainGame["TEAM_H"];
                        var team_c = mainGame["TEAM_C"];
                        var limit_min = mainGame["LIMIT_MIN"];
                        var best = mainGame["BEST"];
                        var playSet = playSet = best.split(" ");
                        var max_set = max_set = playSet[2] * 1;
                        var playDeuce = playSet[3] != null;
                        if (scoreObj) {
                            sc_game_H = scoreObj["SC_GAME_H"] * 1;
                            sc_game_A = scoreObj["SC_GAME_A"] * 1
                        }
                        var server_sw = mainGame["SERVE"];
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
                        obj.gtype = "bm";
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
                        obj.playDeuce = playDeuce;
                        obj.sc_game_H = sc_game_H;
                        obj.sc_game_A = sc_game_A;
                        obj.server_sw = server_sw;
                        obj.limit_min = limit_min;
                        obj.OuterOpen = OuterOpen;
                        obj.newDatetime = newDatetime;
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
                        var check_h = obj.team_h == null ? util_game.showTxt(obj.def_team_h) : util_game.showTxt(obj.team_h);
                        var check_c = obj.team_c == null ? util_game.showTxt(obj.def_team_c) : util_game.showTxt(obj.team_c);
                        get("team_h").innerHTML = check_h.toString().replace(team_RegExp, "");
                        get("team_c").innerHTML = check_c.toString().replace(team_RegExp, "");
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
                                    get("box_sco_bm").style.display = "none";
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
                                sc_game_H = obj.sc_game_H == "" ? "0" : util_game.util_AdvToA(obj.sc_game_H) * 1;
                                sc_game_A = obj.sc_game_A == "" ? "0" : util_game.util_AdvToA(obj.sc_game_A) * 1;
                                get("sc_game_H").innerHTML = util_game.showTxt(sc_game_H);
                                get("sc_game_A").innerHTML = util_game.showTxt(sc_game_A);
                                var se_now = Number(sc_game_H) + Number(sc_game_A) + 1;
                                if (se_now >= obj.max_set && obj.max_set > 0)
                                    se_now = obj.max_set;
                                var _sc_now = set_ary[se_now - 1];
                                var sc_now_H = obj.scoreObj[_sc_now.toUpperCase() + "_H"];
                                var sc_now_A = obj.scoreObj[_sc_now.toUpperCase() + "_A"];
                                var range = Math.abs(sc_now_A - sc_now_H);
                                var isDeuce = range == 2;
                                game_over = false;
                                if (obj.max_set == 3) {
                                    var deuce_over21 = (sc_now_H > 21 || sc_now_A > 21) && isDeuce;
                                    var normal_over21 = (sc_now_H == 21 || sc_now_A == 21) && range > 1;
                                    var game_over30 = sc_now_H == 30 || sc_now_A == 30;
                                    if (deuce_over21 || normal_over21 || game_over30) {
                                        sc_now_H = 0;
                                        sc_now_A = 0;
                                        game_over = true
                                    }
                                } else if (obj.playDeuce) {
                                    var deuce_over11 = (sc_now_H > 11 || sc_now_A > 11) && isDeuce;
                                    var normal_over11 = (sc_now_H == 11 || sc_now_A == 11) && range > 1;
                                    if (deuce_over11 || normal_over11) {
                                        sc_now_H = 0;
                                        sc_now_A = 0;
                                        game_over = true
                                    }
                                } else {
                                    var set_over = obj.max_set == Number(sc_game_H) + Number(sc_game_A);
                                    var noDeuce_over = sc_now_H == 11 || sc_now_A == 11;
                                    if (noDeuce_over || set_over) {
                                        sc_now_H = 0;
                                        sc_now_A = 0;
                                        game_over = true
                                    }
                                }
                                sc_now_H = sc_now_H == "" ? "0" : sc_now_H;
                                sc_now_A = sc_now_A == "" ? "0" : sc_now_A;
                                var serveTeam = new Array("serve_h","serve_c");
                                for (var b = 0; b < serveTeam.length; b++)
                                    if (get(serveTeam[b]).classList.contains("on"))
                                        get(serveTeam[b]).classList.remove("on");
                                if (obj.server_sw != "2") {
                                    var team = obj.server_sw == "0" ? "h" : "c";
                                    get("serve_" + team).classList.add("on")
                                }
                                var total_H = 0;
                                var total_A = 0;
                                var i = 1;
                                for (var t = 0; t < set_ary.length; t++) {
                                    var _name = set_ary[t];
                                    var sc_H = util_game.showTxt(obj.scoreObj[_name.toUpperCase() + "_H"] * 1);
                                    var sc_A = util_game.showTxt(obj.scoreObj[_name.toUpperCase() + "_A"] * 1);
                                    if (t == 5) {
                                        sc_H = 0;
                                        sc_A = 0
                                    }
                                    if (obj.max_set == "5")
                                        if (se_now == "5" && game_over != false)
                                            se_now = 6;
                                    if (obj.max_set == "3")
                                        if (se_now == "3" && game_over != false)
                                            se_now = 4;
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
                                if (get(set_ary[se_now - 1] + "_H") != null)
                                    get(set_ary[se_now - 1] + "_H").classList.add("on");
                                if (get(set_ary[se_now - 1] + "_A") != null)
                                    get(set_ary[se_now - 1] + "_A").classList.add("on");
                                if (get("320_" + set_ary[se_now - 1]) != null)
                                    get("320_" + set_ary[se_now - 1]).classList.add("on");
                                if (se_now > obj.max_set)
                                    se_now = obj.max_set;
                                set_name = util_game.showTxt(obj.LS_game.get("BM_" + se_now + "_nowPlay")) + " / " + util_game.showTxt(obj.max_set);
                                get("set_name").innerHTML = set_name;
                                if (top.resizePage != "home")
                                    get("div_matches").style.display = ""
                            }
                        else {
                            if (top.resizePage != "home")
                                get("div_matches").style.display = "";
                            get("game_time").innerHTML = util_game.showTxt(obj.newDatetime)
                        }
                    } catch (e) {
                        console.log("parseScoreBoard_BM error", e)
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
            }
            ;