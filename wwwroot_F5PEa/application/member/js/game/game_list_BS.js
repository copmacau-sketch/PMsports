function game_list_BS(_win, _dom, _post){ //extends game_list
    var _self = this;
    var classname = "game_list_BS";
    // 應該要使用ecid 目前Server尚未回傳 先使用gid
    var gameInfo = new Object();
    gameInfo["rb"] = new Array("ECID","DATETIME","MIDFIELD_SHOW","PTYPE","RB_SHOW","RBICON_SHOW","SCORE_H","SCORE_C","TEAM_H","TEAM_C","DISPLAY_TV","TV_STYLE",
    "MORE","STRONG_H","STRONG_C","LASTESTSCORE_H","LASTESTSCORE_C","INFO_SHOW","RETIMESET","PART","OUTCOUNT","BS_ICON");
    gameInfo["r"] = new Array("ECID","DATETIME","MIDFIELD_SHOW","PTYPE","RB_SHOW","RBICON_SHOW","SCORE_H","SCORE_C","TEAM_H","TEAM_C","DISPLAY_TV","TV_STYLE",
    "MORE","STRONG_H","STRONG_C","LASTESTSCORE_H","LASTESTSCORE_C","INFO_SHOW");

    var GameRatio = new Object();
    GameRatio["rb"] = new Array("ECID","GID","MS_GID","GIDM","HGID","IOR_RMH","IOR_RMC","STR_MS","MS_IOR_RMH","MS_IOR_RMC","MS_IOR_RMN","RATIO_REH","RATIO_REC","IOR_REH","IOR_REC","RATIO_ROUO","RATIO_ROUU","IOR_ROUH","IOR_ROUC","RATIO_ROUO","RATIO_ROUU","IOR_ROUC","IOR_ROUH","RATIO_ROUHO","RATIO_ROUHU","IOR_ROUHO","IOR_ROUHU","RATIO_ROUCO","RATIO_ROUCU","IOR_ROUCO","IOR_ROUCU");
    GameRatio["r"] = new Array("ECID","GID","MS_GID","GIDM","HGID","RATIO_RH","RATIO_RC","IOR_RH","IOR_RC","IOR_MH","IOR_MC","IOR_MN","RATIO_OUO","RATIO_OUU","IOR_OUH","IOR_OUC","STR_MS","MS_IOR_MH","MS_IOR_MC","MS_IOR_MN","RATIO_OUHO","RATIO_OUHU","IOR_OUHO","IOR_OUHU","RATIO_OUCO","RATIO_OUCU","IOR_OUCO","IOR_OUCU");

    var IOR_rb = new Object();
    IOR_rb["RM"] = new Array("RMH","RMC","RMN");
    IOR_rb["RE"] = new Array("REH","REC");
    IOR_rb["ROU"] = new Array("ROUH","ROUC");
    IOR_rb["ROUH"] = new Array("ROUHO","ROUHU");
    IOR_rb["ROUC"] = new Array("ROUCO","ROUCU");

    var IOR_r = new Object();
    IOR_r["R"] = new Array("RH","RC");
    IOR_r["OU"] = new Array("OUH","OUC");
    IOR_r["M"] = new Array("MH","MC","MN");
    IOR_r["OUH"] = new Array("OUHO","OUHU");
    IOR_r["OUC"] = new Array("OUCO","OUCU");

    var IOR = new Object();
    IOR["rb"] = IOR_rb;
    IOR["r"] = IOR_r;

    _self.init=function(){
        _self.reInit(_self, classname, gameInfo, GameRatio, null, null, IOR);
    }
}