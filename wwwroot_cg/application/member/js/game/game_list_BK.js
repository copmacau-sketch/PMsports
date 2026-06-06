function game_list_BK(_win, _dom, _post){
    var _self = this;
    var classname = "game_list_BK";
    var gameInfo = new Object();
    gameInfo["rb"] = new Array("ECID","DATETIME","MIDFIELD_SHOW","PTYPE","RB_SHOW","RBICON_SHOW","SCORE_H","SCORE_C","TEAM_H","TEAM_C","DISPLAY_TV","TV_STYLE",
    "MORE","STRONG_H","STRONG_C","LASTESTSCORE_H","LASTESTSCORE_C","INFO_SHOW","RETIMESET");
    gameInfo["r"] = new Array("ECID","DATETIME","MIDFIELD_SHOW","PTYPE","RB_SHOW","RBICON_SHOW","SCORE_H","SCORE_C","TEAM_H","TEAM_C","DISPLAY_TV","TV_STYLE",
    "MORE","STRONG_H","STRONG_C","LASTESTSCORE_H","LASTESTSCORE_C","INFO_SHOW");

    var GameRatio = new Object();
    
    GameRatio["rb"] = new Array("ECID","GID","GIDM","STR_HALF","STR_MS","PLAYS");//"HALF_GID","MS_GID","R","OU","OUH","OUC","HALF_R","HALF_OU","MS_R","MS_OU","RATIO_REH","RATIO_REC","IOR_REH","IOR_REC","RATIO_ROUO","RATIO_ROUU","IOR_ROUC","IOR_ROUH","RATIO_ROUHO","RATIO_ROUHU","IOR_ROUHO","IOR_ROUHU","RATIO_ROUCO","RATIO_ROUCU","IOR_ROUCO","IOR_ROUCU","HALF_RATIO_REH","HALF_RATIO_REC","HALF_IOR_REH","HALF_IOR_REC","HALF_RATIO_ROUO","HALF_RATIO_ROUU","HALF_IOR_ROUH","HALF_IOR_ROUC","MS_RATIO_REH","MS_RATIO_REC","MS_IOR_REH","MS_IOR_REC","MS_RATIO_ROUO","MS_RATIO_ROUU","MS_IOR_ROUH","MS_IOR_ROUC"
    GameRatio["r"] = new Array("ECID","GID","GIDM","STR_HALF","PLAYS");//"HALF_GID","MS_GID","R","OU","OUH","OUC","HALF_R","HALF_OU","HALF_OUH","HALF_OUC","RATIO_RH","RATIO_RC","IOR_RH","IOR_RC","RATIO_OUO","RATIO_OUU","IOR_OUH","IOR_OUC","RATIO_OUHO","RATIO_OUHU","IOR_OUHO","IOR_OUHU","RATIO_OUCO","RATIO_OUCU","IOR_OUCO","IOR_OUCU","HALF_RATIO_RH","HALF_RATIO_RC","HALF_IOR_RH","HALF_IOR_RC","HALF_RATIO_OUO","HALF_RATIO_OUU","HALF_IOR_OUH","HALF_IOR_OUC","HALF_RATIO_OUHO","HALF_RATIO_OUHU","HALF_IOR_OUHO","HALF_IOR_OUHU","HALF_RATIO_OUCO","HALF_RATIO_OUCU","HALF_IOR_OUCO","HALF_IOR_OUCU"

    var IOR_rb = new Object();
    IOR_rb["RE"] = new Array("REH","REC");
    IOR_rb["ROU"] = new Array("ROUH","ROUC");
    IOR_rb["ROUH"] = new Array("ROUHO","ROUHU");
    IOR_rb["ROUC"] = new Array("ROUCO","ROUCU");


    var IOR_r = new Object();
    IOR_r["R"] = new Array("RH","RC");
    IOR_r["OU"] = new Array("OUH","OUC");
    IOR_r["OUH"] = new Array("OUHO","OUHU");
    IOR_r["OUC"] = new Array("OUCO","OUCU");


    var IOR = new Object();
    IOR["rb"] = IOR_rb;
    IOR["r"] = IOR_r;

    _self.init=function(){
        _self.reInit(_self, classname, gameInfo, GameRatio, null, null, IOR);
    }
}
