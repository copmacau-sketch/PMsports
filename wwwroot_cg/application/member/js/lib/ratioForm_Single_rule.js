function ratioForm_Single_rule() {
                var _self = this;
                _self.addZero = function(code, b) {
                    code += "";
                    var str = "";
                    var index = code.indexOf(".");
                    if (index == -1) {
                        code += ".";
                        index = code.length - 1
                    }
                    var r = b * 1 - (code.length - index - 1);
                    for (var i = 0; i < r; i++)
                        str += "0";
                    str = code + str;
                    return str
                }
                ;
                _self.formatNumber = function(num, b, add) {
                    var point = b;
                    var t = 1;
                    for (; b > 0; t *= 10,
                    b--)
                        ;
                    var n = b == 0 ? 0 : 1 / t;
                    if (num * 1 >= 0)
                        if (add)
                            return _self.addZero(Math.round(num * t + n) / t, point);
                        else
                            return Math.round(num * t + n) / t;
                    else if (add)
                        return _self.addZero(Math.round(num * t - n) / t, point);
                    else
                        return Math.round(num * t + n) / t
                }
                ;
                _self.chgForm_Single_ratio = function(odds, wtype) {
                    odds = odds * 1;
                    var isM = _self.chkIsM(wtype);
                    var isFS = _self.chkIsFS(wtype);
                    var isRorOU = _self.chkIsRorOU(wtype);
                    if (isRorOU)
                        return _self.formatNumber(odds, 2, 2);
                    else {
                        if (!(isM || isFS) && odds == 0)
                            return odds.toFixed(0);
                        else if ((isM || isFS) && 10 <= odds && odds < 98.5)
                            return odds.toFixed(1);
                        else if (!(isM || isFS) && 5 <= odds && odds < 20)
                            return odds.toFixed(1);
                        else if (!(isM || isFS) && 20 <= odds)
                            return odds.toFixed(0);
                        else if ((isM || isFS) && 101 <= odds)
                            return odds.toFixed(0);
                        return odds.toFixed(2)
                    }
                }
                ;
                _self.chkIsFS = function(wtype) {
                    var isFS = false;
                    var ary = new Array;
                    ary["FS"] = true;
                    ary["SFS"] = true;
                    if (ary[wtype])
                        isFS = true;
                    return isFS
                }
                ;
                _self.chkIsM = function(rtype) {
                    try {
                        rtype = rtype.toUpperCase()
                    } catch (e) {}
                    var isM = false;
                    var M_wtype = new Array("A","B","C","D","E","F");
                    var F_wtype = new Array("01","02");
                    var RF_wtype = new Array("01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35");
                    var RPX_wtype = new Array("A","B","C","D","E","F","G","H","I","J","K","L","M","N","O");
                    var ary = new Array;
                    ary["M"] = true;
                    ary["HM"] = true;
                    ary["RM"] = true;
                    ary["HRM"] = true;
                    for (var i = 0; i < M_wtype.length; i++) {
                        ary[M_wtype[i] + "M"] = true;
                        ary[M_wtype[i] + "RM"] = true
                    }
                    for (var i = 0; i < F_wtype.length; i++)
                        ary["F" + F_wtype[i]] = true;
                    for (var i = 0; i < RF_wtype.length; i++)
                        ary["RF" + RF_wtype[i]] = true;
                    for (var i = 0; i < RPX_wtype.length; i++)
                        ary["RPX" + RPX_wtype[i]] = true;
                    if (ary[rtype])
                        isM = true;
                    if (rtype.match(/^(RF|RGA|RGOU)(A|B|C|D|E)[0-5][0-9]$/g))
                        isM = true;
                    return isM
                }
                ;
                _self.chkIsRorOU = function(wtype) {
                    try {
                        wtype = wtype.toUpperCase()
                    } catch (e) {}
                    var isRorOU = false;
                    var OU = new Array("OU","ROU","HOU","HROU","OUH","OUC","ROUH","ROUC","HOUH","HOUC","HROUH","HROUC","POU","HPOU","POUH","POUC","HPOUH","HPOUC");
                    var R = new Array("R","RE","HR","HRE","RH","RC","REH","REC","HRH","HRC","HREH","HREC","PR","HPR","PRH","PRC","HPRH","HPRC");
                    var DOUBLE = new Array("TARU","TARUO","TARUU","TBRU","TBRUO","TBRUU","TDRU","TDRUO","TDRUU","TERU","TERUO","TERUU","EO","HEO","REO","HREO","EOH","EOC","HEOH","HEOC","EOO","EOE","HEOO","HEOE","REOO","REOE","HREOO","HREOE","RSH1","RSH2","RSH3","RSH4","RSH5","RSH6","RSH7","RSH8","RSH9","RSHA","RSHB","RSHC","RSHD","RSHE","RSHF","RSHG","RSHH","RSHI","RSHJ","RSHK","RSHL","RSHM","RSHN","RSHO","RSHP","RSHQ","RSHR","RSHS","RSHT","RSHU","RSC1","RSC2","RSC3","RSC4","RSC5","RSC6","RSC7","RSC8","RSC9","RSCA","RSCB","RSCC","RSCD","RSCE","RSCF","RSCG","RSCH","RSCI","RSCJ","RSCK","RSCL","RSCM","RSCN","RSCO","RSCP","RSCQ","RSCR","RSCS","RSCT","RSCU","RNB1","RNB2","RNB3","RNB4","RNB5","RNB6","RNB7","RNB8","RNB9","RNBA","RNBB","RNBC","RNBD","RNBE","RNBF","RNBG","RNBH","RNBI","RNBJ","RNBK","RNBL","RNBM","RNBN","RNBO","RNBP","RNBQ","RNBR","RNBS","RNBT","RNBU","RNC1","RNC2","RNC3","RNC4","RNC5","RNC6","RNC7","RNC8","RNC9","RNCA","RNCB","RNCC","RNCD","RNCE","RNCF","RNCG","RNCH","RNCI","RNCJ","RNCK","RNCL","RNCM","RNCN","RNCO","RNCP","RNCQ","RNCR","RNCS","RNCT","RNCU","PEO","HPEO","PREO","HPREO","PEOH","PEOC","HPEOH","HPEOC","PEOO","PEOE","HPEOO","HPEOE");
                    var OU15 = new Array("AOU","BOU","COU","DOU","EOU","FOU","APOU","BPOU","CPOU","DPOU","EPOU","FPOU","PAOU","PBOU","PCOU","PDOU","PEOU","PFOU");
                    var R15 = new Array("AR","BR","CR","DR","ER","FR","APR","BPR","CPR","DPR","EPR","FPR","PAR","PBR","PCR","PDR","PER","PFR");
                    var ROU15 = new Array("AROU","BROU","CROU","DROU","EROU","FROU");
                    var ROUHC = new Array("ROUH","ROUC","HRUH","HRUC");
                    var ary = new Array;
                    for (var i = 0; i < R.length; i++)
                        ary[R[i]] = true;
                    for (var i = 0; i < OU.length; i++)
                        ary[OU[i]] = true;
                    for (var i = 0; i < DOUBLE.length; i++)
                        ary[DOUBLE[i]] = true;
                    for (var i = 0; i < OU15.length; i++)
                        ary[OU15[i]] = true;
                    for (var i = 0; i < R15.length; i++)
                        ary[R15[i]] = true;
                    for (var i = 0; i < ROU15.length; i++)
                        ary[ROU15[i]] = true;
                    for (var i = 0; i < ROUHC.length; i++)
                        ary[ROUHC[i]] = true;
                    if (ary[wtype])
                        isRorOU = true;
                    return isRorOU
                }
            }
            ;