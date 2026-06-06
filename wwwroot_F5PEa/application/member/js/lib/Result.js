function Result() {
    var _self = this;
    var max_wingold = 1E6;
    var twinWtypeHash = ["R", "OU", "HR", "HOU", "RE", "ROU", "HRE", "HROU", "OUH", "OUC", "HOUH", "HOUC", "ROUH", "ROUC", "HRUH", "HRUC", "AR", "AOU", "ARE", "AROU", "BR", "BOU", "BRE", "BROU", "CR", "COU", "CRE", "CROU", "DR", "DOU", "DRE", "DROU", "ER", "EOU", "ERE", "EROU", "FR", "FOU", "FRE", "FROU", "TARU", "TBRU", "TCRU", "TDRU", "TERU", "TFRU", "RNC1", "RNC2", "RNC3", "RNC4", "RNC5", "RNC6", "RNC7", "RNC8", "RNC9", "RNCA", "RNCB", "RNCC", "RNCD", "RNCE", "RNCF", "RNCG", "RNCH", "RNCI", "RNCJ", "RNCK", "RNCL", "RNCM", "RNCN", "RNCO", "RNCP", "RNCQ", "RNCR", "RNCS", "RNCT", "RNCU", "RNBA", "RNBB", "RNBC", "RNBD", "RNBE", "RNBF", "RNBG", "RNBH", "RNBI", "RNBJ", "RNBK", "RNBL", "RNBM", "RNBN", "RNBO", "RSHA", "RSHB", "RSHC", "RSHD", "RSHE", "RSHF", "RSHG", "RSHH", "RSHI", "RSHJ", "RSHK", "RSHL", "RSHM", "RSHN", "RSHO", "RSCA", "RSCB", "RSCC", "RSCD", "RSCE", "RSCF", "RSCG", "RSCH", "RSCI", "RSCJ", "RSCK", "RSCL", "RSCM", "RSCN", "RSCO"];
    var eoFamily = ["EVEN", "ODD", "HODD", "HEVEN", "REVEN", "RODD", "HRODD", "HREVEN", "EOHO", "EOHE", "HEOHO", "HEOHE", "EOCO", "EOCE", "HEOCO", "HEOCE"];
    _self.init = function() {}
    ;
    _self.getResult = function(scores, tickets, games) {
        echo("[Result][getResult]scores", scores);
        echo("[Result][getResult]tickets", tickets);
        echo("[Result][getResult]games", games);
        var hash = {};
        var winloss = {};
        for (var i = 0; i < scores.length; i++) {
            var _scores = scores[i];
            hash[_scores] = {
                "wingold": 0,
                "tickets": {}
            };
            for (var j = 0; j < tickets.length; j++) {
                var ticket = tickets[j];
                var resultAry = _self.calculateResult(_scores, ticket, games);
                var result = resultAry.result;
                var str_result = result;
                var wingold = 0;
                if (result != "") {
                    var _key = ticket.id + "_" + result;
                    if (!winloss[_key]) {
                        var gold = _self.getWinGold(ticket, result);
                        winloss[_key] = gold
                    }
                    wingold = winloss[_key];
                    hash[_scores]["wingold"] += wingold
                } else
                    str_result = "not calculate";
                var cor = result == "W" ? "#19805c" : result == "L" ? "#ce3636" : "yellow";
                echo("[Result][getResult]%c" + ticket.id + " " + str_result + " " + wingold + " " + hash[_scores]["wingold"], "color:" + cor);
                hash[_scores]["tickets"][ticket.id] = {
                    "tid": ticket.id,
                    "result": str_result,
                    "wingold": wingold,
                    "display": resultAry.display
                }
            }
            hash[_scores]["wingold"] = _self.sprintf(2, hash[_scores]["wingold"])
        }
        return hash
    }
    ;
    _self.calculateResult = function(score, ticket, games) {
        var ret = {
            "result": "",
            "display": ""
        };
        var result = "";
        var display = "";
        var gtype = ticket.gtype;
        var gid = ticket.gid;
        var wtype = ticket.wtype;
        var rtype = ticket.rtype;
        var type = ticket.type;
        var adddate = ticket.adddate;
        var concede = parseFloat(ticket.concede);
        var ratio = parseFloat(ticket.ratio) / 100;
        var ptype = ticket.ptype ? ticket.ptype : games[ticket.gid] ? games[ticket.gid].ptype_h : "0";
        var scoreArray = games[ticket.gid] ? games[ticket.gid].scoreArray : [];
        var tmp_scroe = score.split(":");
        var score_h = parseInt(tmp_scroe[0]);
        var score_c = parseInt(tmp_scroe[1]);
        var _result = 0;
        echo("[Result][calculateResult][" + ticket.id + "][" + score + "]============ start ============");
        if (wtype.match(/^H?RE?$/g)) {
            var result_h = 0
                , result_c = 0;
            var points_dif = 0;
            if (wtype.match(/^H?RE$/g)) {
                var reScore = _self.getReScore(scoreArray, adddate);
                result_h = parseInt(reScore["result_h"]);
                result_c = parseInt(reScore["result_c"]);
                echo("[Result][calculateResult]adddate=" + adddate + ",rh=" + result_h + ",rc=" + result_c)
            }
            if (type == "H")
                points_dif = score_h - result_h - (score_c - result_c);
            else
                points_dif = score_c - result_c - (score_h - result_h);
            echo("[Result][calculateResult][" + gtype + "][" + wtype + "][" + type + "]points_dif = (" + score_h + " - " + result_h + " ) " + " - ( " + score_c + " - " + result_c + " ) = " + points_dif);
            result = _self.resultR(concede, ratio, points_dif)
        } else if (wtype.match(/^H?R?M$/g))
            result = _self.resultM(type, score_h, score_c);
        else if (wtype.match(/^H?R?OU$/g)) {
            _result = score_h + score_c;
            if (type == "H" || type == "U")
                _result *= -1;
            echo("[Result][calculateResult][" + gtype + "][" + wtype + "][" + type + "]_result=" + _result);
            result = _self.resultR(concede, ratio, _result)
        } else if (wtype.match(/^R?OUH$/g) || wtype == "HOUH" || wtype == "HRUH") {
            _result = score_h;
            if (type == "U")
                _result *= -1;
            result = _self.resultR(concede, ratio, _result)
        } else if (wtype.match(/^R?OUC$/g) || wtype == "HOUC" || wtype == "HRUC") {
            _result = score_c;
            if (type == "U")
                _result *= -1;
            result = _self.resultR(concede, ratio, _result)
        } else if (wtype.match(/^HR?PD$/g))
            result = _self.resultHPD(rtype, score_h, score_c);
        else if (wtype.match(/^R?PD$/g))
            result = _self.resultPD(rtype, score_h, score_c, ptype);
        else if (wtype.match(/^H?R?T$/g) || wtype.match(/^H?R?EO$/g)) {
            _result = score_h + score_c;
            result = _self.resultT(rtype, _result)
        } else if (wtype == "W3")
            result = _self.resultW3(wtype + type, concede, score_h, score_c);
        else if (wtype.match(/^R?WM$/g))
            result = _self.resultWM(rtype, score_h, score_c);
        else if (wtype.match(/^R?DC$/g))
            result = _self.resultDC(rtype, score_h, score_c);
        else if (wtype.match(/^R?CS$/g))
            result = _self.resultCS(rtype, score_h, score_c);
        else if (wtype.match(/^R?WN$/g))
            result = _self.resultWN(rtype, score_h, score_c);
        else if (wtype.match(/^R?H?TS$/g))
            result = _self.resultTS(rtype, score_h, score_c);
        else if (wtype == "RDT") {
            _result = score_h + score_c;
            result = _self.resultRDT(rtype, _result)
        } else if (wtype == "RTW")
            result = _self.resultRTW(rtype, score_h, score_c);
        echo("[Result][calculateResult][" + gtype + "][" + wtype + "][" + rtype + "][" + type + "]gid=" + gid + " ,concede=" + concede + " ,ratio=" + ratio);
        if (result == "")
            display = "none";
        if (ticket.result != "0")
            result = "";
        if (ticket.ball_act != "0" && !(ticket.ball_map == "" || ticket.ball_map == "A"))
            result = "";
        ret.result = result;
        ret.display = display;
        return ret
    }
    ;
    _self.getWinGold = function(ticket, result) {
        var ret = 0;
        var wingold = 0;
        var wtype = ticket.wtype;
        var rtype = ticket.rtype;
        var odd_f = ticket.odd_f;
        var gold = parseInt(ticket.gold);
        var ioratio = parseFloat(ticket.ioratio);
        var ratio = parseFloat(ticket.ratio / 100);
        var code_value = parseFloat(ticket.code_value);
        if (twinWtypeHash.indexOf(wtype) == -1)
            ioratio -= 1;
        else if (odd_f == "E")
            ioratio -= 1;
        switch (result) {
            case "W":
                if (ioratio < 0)
                    ioratio = 1;
                break;
            case "LW":
                if (ioratio > 0)
                    ioratio *= ratio;
                else
                    ioratio = ratio;
                break;
            case "LL":
                if (ioratio < 0) {
                    ioratio = Math.abs(ioratio);
                    ioratio *= ratio;
                    if (ioratio >= 0)
                        ioratio *= -1
                } else
                    ioratio = ratio;
                break;
            case "L":
                if (ioratio < 0)
                    ioratio = ioratio;
                else
                    ioratio = -1;
                break
        }
        wingold = gold * ioratio;
        if (eoFamily.indexOf(rtype) == -1)
            if (wingold * code_value > max_wingold)
                wingold = max_wingold / code_value;
        if (result != "")
            ret = _self.sprintf(1, wingold);
        echo("[Result][getWinGold]ioratio=" + ioratio + " ,isEO=" + (eoFamily.indexOf(rtype) != -1) + " ,wingold=" + wingold + " ,ret=" + ret);
        return ret
    }
    ;
    _self.getReScore = function(scoreArray, ticketDateTime) {
        var getScore = {
            "result_h": "0",
            "result_c": "0"
        };
        if (scoreArray.length == 0)
            return getScore;
        scoreArray.sort((a,b)=>a.datetime > b.datetime ? 1 : -1);
        for (var i = 0; i < scoreArray.length; i++) {
            var obj = scoreArray[i];
            var datetime = obj["datetime"];
            var result_h = obj["result_h"];
            var result_c = obj["result_c"];
            if (datetime < ticketDateTime) {
                getScore["result_h"] = result_h;
                getScore["result_c"] = result_c
            }
        }
        return getScore
    }
    ;
    _self.resultR = function(concede, ratio, result) {
        var results = "";
        if (concede == result)
            if (ratio < 0) {
                results = "LL";
                if (ratio == -1)
                    results = "L"
            } else {
                results = "LW";
                if (ratio == 1)
                    results = "W"
            }
        else {
            if (result > concede)
                results = "W";
            if (result < concede)
                results = "L"
        }
        return results
    }
    ;
    _self.resultM = function(type, h, c) {
        var results = "L";
        if (h > c && type == "H")
            results = "W";
        else if (h < c && type == "C")
            results = "W";
        else if (h == c && type == "N")
            results = "W";
        return results
    }
    ;
    _self.resultHPD = function(rtype, h, c) {
        var results = "L";
        var tmp_rtype = "";
        rtype = rtype.replace("R", "");
        if (rtype == "OVH" && (h >= 4 || c >= 4))
            results = "W";
        else {
            tmp_rtype = "H" + h + "C" + c;
            if (rtype == tmp_rtype)
                results = "W"
        }
        return results
    }
    ;
    _self.resultPD = function(rtype, h, c, ptype) {
        var results = "L";
        var tmp_rtype = "";
        rtype = rtype.replace("R", "");
        if (rtype == "OVH" && (ptype == "779" && (h >= 4 || c >= 4) || !ptype != "779" && (h >= 5 || c >= 5)))
            results = "W";
        else {
            tmp_rtype = "H" + h + "C" + c;
            if (rtype == tmp_rtype)
                results = "W"
        }
        return results
    }
    ;
    _self.resultT = function(rtype, result) {
        var results = "L";
        if (rtype.match(/^H?R?(EVEN|EOE)$/g)) {
            if (result % 2 == 0)
                results = "W"
        } else if (rtype.match(/^H?R?(ODD|EOO)$/g)) {
            if (result % 2 == 1)
                results = "W"
        } else if (rtype.match(/^R?OVER$/g)) {
            if (result >= 7)
                results = "W"
        } else if (rtype.match(/^HR?TOV$/g)) {
            if (result >= 3)
                results = "W"
        } else if (rtype.indexOf("~") > -1) {
            rtype = rtype.replace("R", "");
            var tmp = rtype.split("~");
            var low = parseInt(tmp[0]);
            var up = parseInt(tmp[1]);
            if (result >= low && result <= up)
                results = "W"
        } else if (rtype == "HT" + result || rtype == "HRT" + result)
            results = "W";
        return results
    }
    ;
    _self.resultW3 = function(rtype, concede, h, c) {
        var results = "L";
        if (rtype == "W3H" || rtype == "W3N")
            h -= concede;
        else
            h += concede;
        if (h > c)
            if (rtype == "W3H")
                results = "W";
        if (h < c)
            if (rtype == "W3C")
                results = "W";
        if (h == c)
            if (rtype == "W3N")
                results = "W";
        return results
    }
    ;
    _self.resultWM = function(rtype, h, c) {
        var results = "L";
        var score = h - c;
        rtype = rtype.replace("R", "");
        if (rtype == "WMHOV" && score >= 4)
            results = "W";
        else if (rtype == "WMH3" && score == 3)
            results = "W";
        else if (rtype == "WMH2" && score == 2)
            results = "W";
        else if (rtype == "WMH1" && score == 1)
            results = "W";
        else if (rtype == "WMCOV" && score <= -4)
            results = "W";
        else if (rtype == "WMC3" && score == -3)
            results = "W";
        else if (rtype == "WMC2" && score == -2)
            results = "W";
        else if (rtype == "WMC1" && score == -1)
            results = "W";
        else if (rtype == "WMN" && h != 0 && score == 0)
            results = "W";
        else if (rtype == "WM0" && h == 0 && score == 0)
            results = "W";
        return results
    }
    ;
    _self.resultDC = function(rtype, h, c) {
        var results = "L";
        if (h > c) {
            if (rtype.match(/^R?DCH(N|C)$/g))
                results = "W"
        } else if (h < c) {
            if (rtype.match(/^R?DC(CN|HC)$/g))
                results = "W"
        } else if (h == c)
            if (rtype.match(/^R?DC(H|C)N$/g))
                results = "W";
        return results
    }
    ;
    _self.resultCS = function(rtype, h, c) {
        var results = "L";
        if (rtype.match(/^R?CSH$/g) && c == 0)
            results = "W";
        else if (rtype.match(/^R?CSC$/g) && h == 0)
            results = "W";
        return results
    }
    ;
    _self.resultWN = function(rtype, h, c) {
        var results = "L";
        if (rtype.match(/^R?WNH$/g) && c == 0 && h > 0)
            results = "W";
        else if (rtype.match(/^R?WNC$/g) && h == 0 && c > 0)
            results = "W";
        return results
    }
    ;
    _self.resultTS = function(rtype, h, c) {
        var results = "L";
        if (rtype.match(/^R?H?TSY$/g) && (h > 0 && c > 0))
            results = "W";
        else if (rtype.match(/^R?H?TSN$/g) && !(h > 0 && c > 0))
            results = "W";
        return results
    }
    ;
    _self.resultRDT = function(rtype, result) {
        var results = "L";
        if (rtype == "RDTOV") {
            if (result >= 3)
                results = "W"
        } else if (rtype == "RDT" + result)
            results = "W";
        return results
    }
    ;
    _self.resultRTW = function(rtype, h, c) {
        var results = "L";
        var score = h - c;
        if (rtype == "RTWHOV" && score >= 3)
            results = "W";
        else if (rtype == "RTWH2" && score == 2)
            results = "W";
        else if (rtype == "RTWH1" && score == 1)
            results = "W";
        else if (rtype == "RTWCOV" && score <= -3)
            results = "W";
        else if (rtype == "RTWC2" && score == -2)
            results = "W";
        else if (rtype == "RTWC1" && score == -1)
            results = "W";
        else if (rtype == "RTWN" && h != 0 && score == 0)
            results = "W";
        else if (rtype == "RTW0" && h == 0 && score == 0)
            results = "W";
        return results
    }
    ;
    _self.sprintf = function(points, vals) {
        var cal = 1;
        var keep = 1;
        if (vals < 0)
            keep = -1;
        vals = Math.abs(vals);
        for (var i = 0; i < points; i++)
            cal = cal * 10;
        return Math.round(vals * cal + 1 / (cal * 1E3)) / cal * keep
    }
    ;
    var echo = function() {};
    if (typeof autoLogin != "undefined")
        echo = console.log
}
;