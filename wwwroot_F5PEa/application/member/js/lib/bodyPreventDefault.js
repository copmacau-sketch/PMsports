function bodyPreventDefault(){
    var _self = this;
    var ts = new Object;
    var now_msg = document.getElementById("now_msg");
    var fixY = 15;
                            
    _self.init = function(){
        _self.blockMovedownRefresh(window, document, "body_show");
    }

    _self.blockMovedownRefresh = function (win, doc, lock_tag) {

        var isWindowTop = false;
        var isWindowBottom = false;
        var startTouchY = 0;

        var touchStartHandler = function(e) {
            if (e.touches.length !== 1) return;
            startTouchY = e.touches[0].clientY;

            var scrollObj = getScrollObj(e);
            if(scrollObj==null) return;

            var urlHeight= document.documentElement.scrollTop || document.body.scrollTop;

            isWindowTop = (scrollObj.scrollTop+urlHeight <= 0);
            isWindowBottom = (scrollObj.scrollTop + scrollObj.clientHeight >= scrollObj.scrollHeight);
        };

        var getScrollObj = function(e){
            var obj = e.target;
            return checkParentNode(obj);
        }

        var checkParentNode = function(obj){
            if (obj.getAttribute && obj.getAttribute("id") == lock_tag){
                return obj;
            } else if (obj["body_show"] == true){
                return obj;
            }else{
                obj = getParentNode(obj);
                if(obj==null) return null;
                return checkParentNode(obj);
            }
        }

        var getParentNode = function(_node){
            return _node.parentNode;
        }

        var touchMoveHandler = function(e) {
            var nowTouchY = e.touches[0].clientY;
            
            if (isWindowTop) {
                if( startTouchY < nowTouchY - fixY){  //往下
                    e.preventDefault();
                    _self.androidBlock(true);
                    return false;
                }
            }
            if (isWindowBottom) {
                if (startTouchY > nowTouchY + fixY) {
                    e.preventDefault();
                    _self.androidBlock(true);
                    return false;
                }
            }
        }

        var touchEndHandler = function(e) {
            _self.androidBlock(false);
        }

        doc.body.addEventListener('touchstart', touchStartHandler, false);
        doc.body.addEventListener('touchmove', touchMoveHandler, {passive: false});
        doc.body.addEventListener('touchend', touchEndHandler, false);

    }

    _self.androidBlock=function(isBlock){
        var sty = document.body.getAttribute("style") || "";
        sty = sty.replace(/touch-action:none;/gi,"");
        var blk = (isBlock)? "touch-action:none;" : "";
        document.body.setAttribute("style", sty+blk);
    }
}

//function get_other_ioratio(odd_type,iorH,iorC,showior,iorpoints){var out=new Array;if(iorH!=""||iorC!="")out=chg_ior(odd_type,iorH,iorC,showior,iorpoints);else{out[0]=iorH;out[1]=iorC}return out}
//function chg_ior(odd_f,iorH,iorC,showior,iorpoints){iorH=Math.floor(iorH*1E3+.001)/1E3;iorC=Math.floor(iorC*1E3+.001)/1E3;var ior=new Array;if(iorH<11)iorH*=1E3;if(iorC<11)iorC*=1E3;iorH=parseFloat(iorH);iorC=parseFloat(iorC);switch(odd_f){case "H":ior=get_HK_ior(iorH,iorC);break;case "M":ior=get_MA_ior(iorH,iorC);break;case "I":ior=get_IND_ior(iorH,iorC);break;case "E":ior=get_EU_ior(iorH,iorC);break;default:ior[0]=iorH;ior[1]=iorC}ior[0]/=1E3;ior[1]/=1E3;ior[0]=printf(Decimal_point(ior[0],showior),
 //   iorpoints);ior[1]=printf(Decimal_point(ior[1],showior),iorpoints);return ior}
//unction get_HK_ior(H_ratio,C_ratio){var out_ior=new Array;var line,lowRatio,nowRatio,highRatio;var nowType="";if(H_ratio<=1E3&&C_ratio<=1E3){out_ior[0]=Math.floor(H_ratio/10+1E-4)*10;out_ior[1]=Math.floor(C_ratio/10+1E-4)*10;return out_ior}line=2E3-(H_ratio+C_ratio);if(H_ratio>C_ratio){lowRatio=C_ratio;nowType="C"}else{lowRatio=H_ratio;nowType="H"}if(2E3-line-lowRatio>1E3)nowRatio=(lowRatio+line)*-1;else nowRatio=2E3-line-lowRatio;if(nowRatio<0)highRatio=Math.floor(Math.abs(1E3/nowRatio)*1E3);else highRatio=
 //   2E3-line-nowRatio;if(nowType=="H"){out_ior[0]=Math.floor(lowRatio/10+1E-4)*10;out_ior[1]=Math.floor(highRatio/10+1E-4)*10}else{out_ior[0]=Math.floor(highRatio/10+1E-4)*10;out_ior[1]=Math.floor(lowRatio/10+1E-4)*10}return out_ior}
//function get_MA_ior(H_ratio,C_ratio){var out_ior=new Array;var line,lowRatio,highRatio;var nowType="";if(H_ratio<=1E3&&C_ratio<=1E3){out_ior[0]=H_ratio;out_ior[1]=C_ratio;return out_ior}line=2E3-(H_ratio+C_ratio);if(H_ratio>C_ratio){lowRatio=C_ratio;nowType="C"}else{lowRatio=H_ratio;nowType="H"}highRatio=(lowRatio+line)*-1;if(nowType=="H"){out_ior[0]=lowRatio;out_ior[1]=highRatio}else{out_ior[0]=highRatio;out_ior[1]=lowRatio}return out_ior}
//function get_IND_ior(H_ratio,C_ratio){var out_ior=new Array;out_ior=get_HK_ior(H_ratio,C_ratio);H_ratio=out_ior[0];C_ratio=out_ior[1];H_ratio/=1E3;C_ratio/=1E3;if(H_ratio<1)H_ratio=-1/H_ratio;if(C_ratio<1)C_ratio=-1/C_ratio;out_ior[0]=H_ratio*1E3;out_ior[1]=C_ratio*1E3;return out_ior}function get_EU_ior(H_ratio,C_ratio){var out_ior=new Array;out_ior=get_HK_ior(H_ratio,C_ratio);H_ratio=out_ior[0];C_ratio=out_ior[1];out_ior[0]=H_ratio+1E3;out_ior[1]=C_ratio+1E3;return out_ior}
//function Decimal_point(tmpior,show){var sign="";sign=tmpior<0?"Y":"N";tmpior=Math.floor(Math.abs(tmpior)*show+1/show)/show;return tmpior*(sign=="Y"?-1:1)}function printf(vals,points){vals=""+vals;var cmd=new Array;cmd=vals.split(".");if(cmd.length>1)for(ii=0;ii<points-cmd[1].length;ii++)vals=vals+"0";else{vals=vals+".";for(ii=0;ii<points;ii++)vals=vals+"0"}return vals};
function get_other_ioratio(odd_type, iorH, iorC, showior, iorpoints) {
                var out = new Array;
                if (iorH != "" || iorC != "")
                    out = chg_ior(odd_type, iorH, iorC, showior, iorpoints);
                else {
                    out[0] = iorH;
                    out[1] = iorC
                }
                return out
            }
            function chg_ior(odd_f, iorH, iorC, showior, iorpoints) {
                iorH = Math.floor(iorH * 1E3 + .001) / 1E3;
                iorC = Math.floor(iorC * 1E3 + .001) / 1E3;
                var ior = new Array;
                if (iorH < 11)
                    iorH *= 1E3;
                if (iorC < 11)
                    iorC *= 1E3;
                iorH = parseFloat(iorH);
                iorC = parseFloat(iorC);
                switch (odd_f) {
                case "H":
                    ior = get_HK_ior(iorH, iorC);
                    break;
                case "M":
                    ior = get_MA_ior(iorH, iorC);
                    break;
                case "I":
                    ior = get_IND_ior_new(iorH, iorC);
                    break;
                case "E":
                    ior = get_EU_ior(iorH, iorC);
                    break;
                default:
                    ior[0] = iorH;
                    ior[1] = iorC
                }
                ior[0] /= 1E3;
                ior[1] /= 1E3;
                ior[0] = printf(Decimal_point(ior[0], showior), iorpoints);
                ior[1] = printf(Decimal_point(ior[1], showior), iorpoints);
                return ior
            }
            function get_HK_ior(H_ratio, C_ratio) {
                var out_ior = new Array;
                var line, lowRatio, nowRatio, highRatio;
                var nowType = "";
                if (H_ratio <= 1E3 && C_ratio <= 1E3) {
                    out_ior[0] = Math.floor(H_ratio / 10 + 1E-4) * 10;
                    out_ior[1] = Math.floor(C_ratio / 10 + 1E-4) * 10;
                    return out_ior
                }
                line = 2E3 - (H_ratio + C_ratio);
                if (H_ratio > C_ratio) {
                    lowRatio = C_ratio;
                    nowType = "C"
                } else {
                    lowRatio = H_ratio;
                    nowType = "H"
                }
                if (2E3 - line - lowRatio > 1E3)
                    nowRatio = (lowRatio + line) * -1;
                else
                    nowRatio = 2E3 - line - lowRatio;
                if (nowRatio < 0)
                    highRatio = Math.floor(Math.abs(1E3 / nowRatio) * 1E3);
                else
                    highRatio = 2E3 - line - nowRatio;
                if (nowType == "H") {
                    out_ior[0] = Math.floor(lowRatio / 10 + 1E-4) * 10;
                    out_ior[1] = Math.floor(highRatio / 10 + 1E-4) * 10
                } else {
                    out_ior[0] = Math.floor(highRatio / 10 + 1E-4) * 10;
                    out_ior[1] = Math.floor(lowRatio / 10 + 1E-4) * 10
                }
                return out_ior
            }
            function get_MA_ior(H_ratio, C_ratio) {
                var out_ior = new Array;
                var line, lowRatio, highRatio;
                var nowType = "";
                if (H_ratio <= 1E3 && C_ratio <= 1E3) {
                    out_ior[0] = H_ratio;
                    out_ior[1] = C_ratio;
                    return out_ior
                }
                line = 2E3 - (H_ratio + C_ratio);
                if (H_ratio > C_ratio) {
                    lowRatio = C_ratio;
                    nowType = "C"
                } else {
                    lowRatio = H_ratio;
                    nowType = "H"
                }
                highRatio = (lowRatio + line) * -1;
                if (nowType == "H") {
                    out_ior[0] = lowRatio;
                    out_ior[1] = highRatio
                } else {
                    out_ior[0] = highRatio;
                    out_ior[1] = lowRatio
                }
                return out_ior
            }
            function get_IND_ior(H_ratio, C_ratio) {
                var out_ior = new Array;
                out_ior = get_HK_ior(H_ratio, C_ratio);
                H_ratio = out_ior[0];
                C_ratio = out_ior[1];
                H_ratio /= 1E3;
                C_ratio /= 1E3;
                if (H_ratio < 1)
                    H_ratio = -1 / H_ratio;
                if (C_ratio < 1)
                    C_ratio = -1 / C_ratio;
                out_ior[0] = H_ratio * 1E3;
                out_ior[1] = C_ratio * 1E3;
                return out_ior
            }
            function get_IND_ior_new(H_ratio, C_ratio) {
                var out_ior = new Array;
                H_ratio += "";
                C_ratio += "";
                H_ratio = H_ratio.substr(0, H_ratio.length - 1) + "0";
                C_ratio = C_ratio.substr(0, C_ratio.length - 1) + "0";
                H_ratio *= 1;
                C_ratio *= 1;
                out_ior = get_MA_ior(H_ratio, C_ratio);
                H_ratio = out_ior[0];
                C_ratio = out_ior[1];
                H_ratio /= 1E3;
                C_ratio /= 1E3;
                if (H_ratio != 1)
                    H_ratio = Math.floor(-1 / H_ratio * 100 + 1E-4) / 100;
                if (C_ratio != 1)
                    C_ratio = Math.floor(-1 / C_ratio * 100 + 1E-4) / 100;
                out_ior[0] = H_ratio * 1E3;
                out_ior[1] = C_ratio * 1E3;
                return out_ior
            }
            function get_EU_ior(H_ratio, C_ratio) {
                var out_ior = new Array;
                out_ior = get_HK_ior(H_ratio, C_ratio);
                H_ratio = out_ior[0];
                C_ratio = out_ior[1];
                out_ior[0] = H_ratio + 1E3;
                out_ior[1] = C_ratio + 1E3;
                return out_ior
            }
            function Decimal_point(tmpior, show) {
                var sign = "";
                sign = tmpior < 0 ? "Y" : "N";
                tmpior = Math.floor(Math.abs(tmpior) * show + 1 / show) / show;
                return tmpior * (sign == "Y" ? -1 : 1)
            }
            function printf(vals, points) {
                vals = "" + vals;
                var cmd = new Array;
                cmd = vals.split(".");
                if (cmd.length > 1)
                    for (ii = 0; ii < points - cmd[1].length; ii++)
                        vals = vals + "0";
                else {
                    vals = vals + ".";
                    for (ii = 0; ii < points; ii++)
                        vals = vals + "0"
                }
                return vals
            }
            ;