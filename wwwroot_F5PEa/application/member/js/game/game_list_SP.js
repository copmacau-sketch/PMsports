function game_list_SP(_win, _dom, _post) {
    var _self = this;
    var classname = "game_list_SP";
    var gameInfo = new Object;
    gameInfo["rb"] = new Array("RETIMESET", "MIDFIELD_SHOW", "RB_SHOW", "RED_CLASS_H", "RED_CLASS_C", "REDCARD_H", "REDCARD_C", "SCORE_H", "SCORE_C", "TEAM_H", "TEAM_C", "ECID", "DISPLAY_TV", "TV_STYLE", "MORE", "STRONG_H", "STRONG_C", "LASTESTSCORE_H", "LASTESTSCORE_C", "INFO_SHOW");
    gameInfo["r"] = new Array("DATETIME", "MIDFIELD_SHOW", "RB_SHOW", "REDCARD_H", "REDCARD_C", "SCORE_H", "SCORE_C", "TEAM_H", "TEAM_C", "ECID", "DISPLAY_TV",
        "TV_STYLE", "MORE", "STRONG_H", "STRONG_C", "LASTESTSCORE_H", "LASTESTSCORE_C", "INFO_SHOW");
    gameInfo["rpd"] = new Array("RETIMESET", "MIDFIELD_SHOW", "RB_SHOW", "RED_CLASS_H", "RED_CLASS_C", "REDCARD_H", "REDCARD_C", "SCORE_H", "SCORE_C", "TEAM_H", "TEAM_C", "ECID", "DISPLAY_TV", "TV_STYLE", "MORE", "STRONG_H", "STRONG_C", "LASTESTSCORE_H", "LASTESTSCORE_C", "INFO_SHOW");
    gameInfo["pd"] = new Array("RETIMESET", "DATETIME", "MIDFIELD_SHOW", "RB_SHOW", "REDCARD_H", "REDCARD_C", "SCORE_H", "SCORE_C", "TEAM_H", "TEAM_C", "ECID", "DISPLAY_TV",
        "TV_STYLE", "MORE", "STRONG_H", "STRONG_C", "LASTESTSCORE_H", "LASTESTSCORE_C", "INFO_SHOW");
    gameInfo["p3pd"] = new Array("RETIMESET", "MIDFIELD_SHOW", "RB_SHOW", "RED_CLASS_H", "RED_CLASS_C", "REDCARD_H", "REDCARD_C", "SCORE_H", "SCORE_C", "TEAM_H", "TEAM_C", "ECID", "DISPLAY_TV", "TV_STYLE", "MORE", "STRONG_H", "STRONG_C", "LASTESTSCORE_H", "LASTESTSCORE_C", "INFO_SHOW");
    var GameRatio = new Object;
    GameRatio["rb"] = new Array("ECID", "GID", "GID2", "HGID", "TEAM_H", "TEAM_C", "PTYPE_SHOW", "RATIO_REH", "RATIO_REC", "IOR_REH", "IOR_REC",
        "RATIO_ROUO", "RATIO_ROUU", "IOR_ROUH", "IOR_ROUC", "RATIO_HREH", "RATIO_HREC", "IOR_HREH", "IOR_HREC", "RATIO_HROUO", "RATIO_HROUU", "IOR_HROUH", "IOR_HROUC", "IOR_RMH", "IOR_RMC", "IOR_RMN", "IOR_HRMH", "IOR_HRMC", "IOR_HRMN", "IOR_REOO", "IOR_REOE", "RATIO_ROUHO", "RATIO_ROUHU", "IOR_ROUHO", "IOR_ROUHU", "RATIO_ROUCO", "RATIO_ROUCU", "IOR_ROUCO", "IOR_ROUCU", "WTYPE_RG", "IOR_RGH", "IOR_RGC", "IOR_RGN", "WTYPE_RPX", "IOR_RPXH", "IOR_RPXC", "IOR_RPXN", "WTYPE_RSH", "IOR_RSHY", "IOR_RSHN", "WTYPE_RSC", "IOR_RSCY", "IOR_RSCN", "IOR_RTSY",
        "IOR_RTSN");
    GameRatio["r"] = new Array("ECID", "GID", "GID2", "HGID", "TEAM_H", "TEAM_C", "PTYPE_SHOW", "RATIO_RH", "RATIO_RC", "IOR_RH", "IOR_RC", "RATIO_OUO", "RATIO_OUU", "IOR_OUH", "IOR_OUC", "RATIO_HRH", "RATIO_HRC", "IOR_HRH", "IOR_HRC", "RATIO_HOUO", "RATIO_HOUU", "IOR_HOUH", "IOR_HOUC", "IOR_MH", "IOR_MC", "IOR_MN", "IOR_HMH", "IOR_HMC", "IOR_HMN", "IOR_EOO", "IOR_EOE", "IOR_TSY", "IOR_TSN");
    GameRatio["rpd"] = new Array("ECID", "GID", "IOR_RH1C0", "IOR_RH2C0", "IOR_RH2C1", "IOR_RH3C0", "IOR_RH3C1", "IOR_RH3C2", "IOR_RH4C0", "IOR_RH4C1",
        "IOR_RH4C2", "IOR_RH4C3", "IOR_RH0C0", "IOR_RH1C1", "IOR_RH2C2", "IOR_RH3C3", "IOR_RH4C4", "IOR_ROVH", "IOR_RH0C1", "IOR_RH0C2", "IOR_RH1C2", "IOR_RH0C3", "IOR_RH1C3", "IOR_RH2C3", "IOR_RH0C4", "IOR_RH1C4", "IOR_RH2C4", "IOR_RH3C4", "IOR_ROVH");
    GameRatio["pd"] = new Array("ECID", "GID", "IOR_H1C0", "IOR_H2C0", "IOR_H2C1", "IOR_H3C0", "IOR_H3C1", "IOR_H3C2", "IOR_H4C0", "IOR_H4C1", "IOR_H4C2", "IOR_H4C3", "IOR_H0C0", "IOR_H1C1", "IOR_H2C2", "IOR_H3C3", "IOR_H4C4", "IOR_ROVH", "IOR_H0C1", "IOR_H0C2", "IOR_H1C2", "IOR_H0C3", "IOR_H1C3", "IOR_H2C3",
        "IOR_H0C4", "IOR_H1C4", "IOR_H2C4", "IOR_H3C4", "IOR_OVH");
    GameRatio["p3pd"] = new Array("ECID", "GID", "IOR_RH1C0", "IOR_RH2C0", "IOR_RH2C1", "IOR_RH3C0", "IOR_RH3C1", "IOR_RH3C2", "IOR_RH4C0", "IOR_RH4C1", "IOR_RH4C2", "IOR_RH4C3", "IOR_RH0C0", "IOR_RH1C1", "IOR_RH2C2", "IOR_RH3C3", "IOR_RH4C4", "IOR_ROVH", "IOR_RH0C1", "IOR_RH0C2", "IOR_RH1C2", "IOR_RH0C3", "IOR_RH1C3", "IOR_RH2C3", "IOR_RH0C4", "IOR_RH1C4", "IOR_RH2C4", "IOR_RH3C4", "IOR_ROVH");
    var OBT = new Object;
    OBT["RE_rb"] = new Array("ECID", "GID", "TEAM_H", "TEAM_C", "RATIO_REH",
        "RATIO_REC", "IOR_REH", "IOR_REC");
    OBT["ROU_rb"] = new Array("ECID", "GID", "TEAM_H", "TEAM_C", "RATIO_ROUO", "RATIO_ROUU", "IOR_ROUH", "IOR_ROUC");
    OBT["HRE_rb"] = new Array("ECID", "GID", "HGID", "TEAM_H", "TEAM_C", "RATIO_HREH", "RATIO_HREC", "IOR_HREH", "IOR_HREC");
    OBT["HROU_rb"] = new Array("ECID", "GID", "HGID", "TEAM_H", "TEAM_C", "RATIO_HROUO", "RATIO_HROUU", "IOR_HROUH", "IOR_HROUC");
    OBT["CN_rb"] = new Array("ECID", "GID", "HGID", "STRONG_H", "STRONG_C", "TEAM_H", "TEAM_C", "RATIO_REH", "RATIO_REC", "IOR_REH", "IOR_REC", "RATIO_HREH",
        "RATIO_HREC", "IOR_HREH", "IOR_HREC", "RATIO_ROUO", "RATIO_ROUU", "IOR_ROUH", "IOR_ROUC", "RATIO_HROUO", "RATIO_HROUU", "IOR_HROUH", "IOR_HROUC", "IOR_RMH", "IOR_RMC", "IOR_RMN", "IOR_HRMH", "IOR_HRMC", "IOR_HRMN", "WTYPE_CN", "IOR_RNCH", "IOR_RNCC", "IOR_REOO", "IOR_REOE", "IOR_HREOO", "IOR_HREOE", "SCORE_H", "SCORE_C", "LASTESTSCORE_H", "LASTESTSCORE_C");
    OBT["RN_rb"] = new Array("ECID", "GID", "HGID", "STRONG_H", "STRONG_C", "TEAM_H", "TEAM_C", "RATIO_REH", "RATIO_REC", "IOR_REH", "IOR_REC", "IOR_RMH", "IOR_RMC", "IOR_RMN", "RATIO_HROUO",
        "RATIO_HROUU", "IOR_HROUH", "IOR_HROUC", "RATIO_ROUO", "RATIO_ROUU", "IOR_ROUH", "IOR_ROUC", "RATIO_HREH", "RATIO_HREC", "IOR_HREH", "IOR_HREC", "IOR_HRMH", "IOR_HRMC", "IOR_HRMN", "WTYPE_RN", "IOR_RNBH", "IOR_RNBC", "IOR_REOO", "IOR_REOE", "IOR_HREOO", "IOR_HREOE", "SCORE_H", "SCORE_C", "LASTESTSCORE_H", "LASTESTSCORE_C");
    OBT["ETCN_rb"] = OBT["CN_rb"];
    OBT["ETRN_rb"] = OBT["RN_rb"];
    OBT["WI_rb"] = new Array("ECID", "GID", "TEAM_H", "TEAM_C", "RATIO_REH", "RATIO_REC", "IOR_REH", "IOR_REC");
    OBT["ET_rb"] = new Array("ECID", "GID", "HGID", "STRONG_H",
        "STRONG_C", "TEAM_H", "TEAM_C", "RATIO_REH", "RATIO_REC", "IOR_REH", "IOR_REC", "RATIO_ROUO", "RATIO_ROUU", "IOR_ROUH", "IOR_ROUC", "IOR_RMH", "IOR_RMC", "IOR_RMN", "RATIO_HREH", "RATIO_HREC", "IOR_HREH", "IOR_HREC", "RATIO_HROUO", "RATIO_HROUU", "IOR_HROUH", "IOR_HROUC", "IOR_HRMH", "IOR_HRMC", "IOR_HRMN", "WTYPE_RG", "IOR_RGH", "IOR_RGC", "IOR_RGN", "IOR_RTSY", "IOR_RTSN");
    OBT["PK_rb"] = new Array("ECID", "GID", "GID2", "STRONG_H", "STRONG_C", "TEAM_H", "TEAM_C", "PEN_STR", "RATIO_REH", "RATIO_REC", "IOR_REH", "IOR_REC", "RATIO_ROUO", "RATIO_ROUU",
        "IOR_ROUH", "IOR_ROUC", "IOR_RMH", "IOR_RMC", "IOR_RMN", "WTYPE_RPX", "IOR_RPXH", "IOR_RPXC", "IOR_RPXN", "WTYPE_RSH", "IOR_RSHY", "IOR_RSCY", "IOR_RSHN", "IOR_RSCN");
    OBT["R_r"] = new Array("ECID", "GID", "TEAM_H", "TEAM_C", "RATIO_RH", "RATIO_RC", "IOR_RH", "IOR_RC");
    OBT["OU_r"] = new Array("ECID", "GID", "TEAM_H", "TEAM_C", "RATIO_OUO", "RATIO_OUU", "IOR_OUH", "IOR_OUC");
    OBT["HR_r"] = new Array("ECID", "GID", "HGID", "TEAM_H", "TEAM_C", "RATIO_HRH", "RATIO_HRC", "IOR_HRH", "IOR_HRC");
    OBT["HOU_r"] = new Array("ECID", "GID", "HGID", "TEAM_H",
        "TEAM_C", "RATIO_HOUO", "RATIO_HOUU", "IOR_HOUH", "IOR_HOUC");
    OBT["CN_r"] = new Array("ECID", "GID", "HGID", "STRONG_H", "STRONG_C", "TEAM_H", "TEAM_C", "RATIO_RH", "RATIO_RC", "IOR_RH", "IOR_RC", "RATIO_OUO", "RATIO_OUU", "IOR_OUH", "IOR_OUC", "IOR_MH", "IOR_MC", "IOR_MN", "RATIO_HRH", "RATIO_HRC", "IOR_HRH", "IOR_HRC", "RATIO_HOUO", "RATIO_HOUU", "IOR_HOUH", "IOR_HOUC", "IOR_HMH", "IOR_HMC", "IOR_HMN");
    OBT["RN_r"] = OBT["CN_r"];
    OBT["WI_r"] = new Array("ECID", "GID", "TEAM_H", "TEAM_C", "RATIO_RH", "RATIO_RC", "IOR_RH", "IOR_RC");
    OBT["MIX_rb"] =
        new Array("ECID", "GID", "TEAM_H", "TEAM_C", "STRONG", "RATIO_REH", "RATIO_REC", "IOR_REH", "IOR_REC", "RATIO_ROUO", "RATIO_ROUU", "IOR_ROUH", "IOR_ROUC");
    OBT["MIX_r"] = new Array("ECID", "GID", "TEAM_H", "TEAM_C", "STRONG", "RATIO_RH", "RATIO_RC", "IOR_RH", "IOR_RC", "RATIO_OUO", "RATIO_OUU", "IOR_OUH", "IOR_OUC");
    OBT["HMIX_rb"] = new Array("ECID", "GID", "HGID", "HSTRONG", "TEAM_H", "TEAM_C", "RATIO_HREH", "RATIO_HREC", "IOR_HREH", "IOR_HREC", "RATIO_HROUO", "RATIO_HROUU", "IOR_HROUH", "IOR_HROUC");
    OBT["HMIX_r"] = new Array("ECID", "GID",
        "HGID", "HSTRONG", "TEAM_H", "TEAM_C", "RATIO_HRH", "RATIO_HRC", "IOR_HRH", "IOR_HRC", "RATIO_HOUO", "RATIO_HOUU", "IOR_HOUH", "IOR_HOUC");
    var PK = new Array("PK_METHOD", "GAMESET", "GAMESET_CLASS", "SCORE_1_H", "SCORE_2_H", "SCORE_3_H", "SCORE_4_H", "SCORE_5_H", "SCORE_1_C", "SCORE_2_C", "SCORE_3_C", "SCORE_4_C", "SCORE_5_C");
    var IOR_rb = new Object;
    IOR_rb["RE"] = new Array("REH", "REC");
    IOR_rb["HRE"] = new Array("HREH", "HREC");
    IOR_rb["ROU"] = new Array("ROUH", "ROUC");
    IOR_rb["HROU"] = new Array("HROUH", "HROUC");
    IOR_rb["RM"] = new Array("RMH",
        "RMC", "RMN");
    IOR_rb["HRM"] = new Array("HRMH", "HRMC", "HRMN");
    IOR_rb["REO"] = new Array("REOO", "REOE");
    IOR_rb["HREO"] = new Array("HREOO", "HREOE");
    IOR_rb["RSH"] = new Array("RSHY", "RSHN");
    IOR_rb["RSC"] = new Array("RSCY", "RSCN");
    IOR_rb["RTS"] = new Array("RTSY", "RTSN");
    IOR_rb["RNB"] = new Array("RNBH", "RNBC");
    IOR_rb["RNC"] = new Array("RNCH", "RNCC");
    IOR_rb["RPX"] = new Array("RPXH", "RPXC", "RPXN");
    IOR_rb["RG"] = new Array("RGH", "RGC", "RGN");
    IOR_rb["ROUH"] = new Array("ROUHO", "ROUHU");
    IOR_rb["ROUC"] = new Array("ROUCO", "ROUCU");
    var IOR_rpd = new Object;
    IOR_rpd["RPD"] = new Array("RH1C0", "RH2C0", "RH2C1", "RH3C0", "RH3C1", "RH3C2", "RH4C0", "RH4C1", "RH4C2", "RH4C3", "RH0C0", "RH1C1", "RH2C2", "RH3C3", "RH4C4", "RH0C1", "RH0C2", "RH1C2", "RH0C3", "RH1C3", "RH2C3", "RH0C4", "RH1C4", "RH2C4", "RH3C4", "ROVH");
    var IOR_r = new Object;
    IOR_r["R"] = new Array("RH", "RC");
    IOR_r["HR"] = new Array("HRH", "HRC");
    IOR_r["OU"] = new Array("OUH", "OUC");
    IOR_r["HOU"] = new Array("HOUH", "HOUC");
    IOR_r["M"] = new Array("MH", "MC", "MN");
    IOR_r["HM"] = new Array("HMH", "HMC", "HMN");
    IOR_r["EO"] =
        new Array("EOO", "EOE");
    IOR_r["HEO"] = new Array("HEOO", "HEOE");
    IOR_r["TS"] = new Array("TSY", "TSN");
    var IOR_pd = new Object;
    IOR_pd["PD"] = new Array("H1C0", "H2C0", "H2C1", "H3C0", "H3C1", "H3C2", "H4C0", "H4C1", "H4C2", "H4C3", "H0C0", "H1C1", "H2C2", "H3C3", "H4C4", "H0C1", "H0C2", "H1C2", "H0C3", "H1C3", "H2C3", "H0C4", "H1C4", "H2C4", "H3C4", "OVH");
    var IOR_obt_r = new Object;
    IOR_obt_r["R"] = new Array("RH", "RC");
    var IOR_obt_wi = IOR_obt_r;
    var IOR_obt_wi_p = new Object;
    IOR_obt_wi_p["RE"] = new Array("REH", "REC");
    var IOR_obt_hr = new Object;
    IOR_obt_hr["HR"] = new Array("HRH", "HRC");
    var IOR_obt_ou = new Object;
    IOR_obt_ou["OU"] = new Array("OUH", "OUC");
    var IOR_obt_hou = new Object;
    IOR_obt_hou["HOU"] = new Array("HOUH", "HOUC");
    var IOR_obt_cn = new Object;
    IOR_obt_cn["R"] = new Array("RH", "RC");
    IOR_obt_cn["OU"] = new Array("OUH", "OUC");
    IOR_obt_cn["M"] = new Array("MH", "MC", "MN");
    IOR_obt_cn["HM"] = new Array("HMH", "HMC", "HMN");
    IOR_obt_cn["HR"] = new Array("HRH", "HRC");
    IOR_obt_cn["HOU"] = new Array("HOUH", "HOUC");
    var IOR_obt_cn_p = new Object;
    IOR_obt_cn_p["RE"] = new Array("REH",
        "REC");
    IOR_obt_cn_p["ROU"] = new Array("ROUH", "ROUC");
    IOR_obt_cn_p["RM"] = new Array("RMH", "RMC", "RMN");
    IOR_obt_cn_p["HRM"] = new Array("HRMH", "HRMC", "HRMN");
    IOR_obt_cn_p["HRE"] = new Array("HREH", "HREC");
    IOR_obt_cn_p["HROU"] = new Array("HROUH", "HROUC");
    var IOR_obt_rn = new Object;
    IOR_obt_rn["R"] = new Array("RH", "RC");
    IOR_obt_rn["OU"] = new Array("OUH", "OUC");
    IOR_obt_rn["M"] = new Array("MH", "MC", "MN");
    IOR_obt_rn["HM"] = new Array("HMH", "HMC", "HMN");
    IOR_obt_rn["HR"] = new Array("HRH", "HRC");
    IOR_obt_rn["HOU"] = new Array("HOUH",
        "HOUC");
    var IOR_obt_rn_p = new Object;
    IOR_obt_rn_p["RE"] = new Array("REH", "REC");
    IOR_obt_rn_p["ROU"] = new Array("ROUH", "ROUC");
    IOR_obt_rn_p["RM"] = new Array("RMH", "RMC", "RMN");
    IOR_obt_rn_p["HRM"] = new Array("HRMH", "HRMC", "HRMN");
    IOR_obt_rn_p["HRE"] = new Array("HREH", "HREC");
    IOR_obt_rn_p["HROU"] = new Array("HROUH", "HROUC");
    var IOR_obt_mix = new Object;
    var IOR_obt_hmix = new Object;
    var IOR_obt_live_mix = new Object;
    var IOR_obt_live_hmix = new Object;
    IOR_obt_live_mix["MIX"] = new Array("REH", "REC", "ROUH", "ROUC");
    IOR_obt_live_hmix["HMIX"] =
        new Array("HREH", "HREC", "HROUH", "HROUC");
    IOR_obt_mix["MIX"] = new Array("RH", "RC", "OUH", "OUC");
    IOR_obt_hmix["HMIX"] = new Array("HRH", "HRC", "HOUH", "HOUC");
    var IOR_obt_re = new Object;
    IOR_obt_re["RE"] = new Array("REH", "REC");
    var IOR_obt_hre = new Object;
    IOR_obt_hre["HRE"] = new Array("HREH", "HREC");
    var IOR_obt_rou = new Object;
    IOR_obt_rou["ROU"] = new Array("ROUH", "ROUC");
    var IOR_obt_hrou = new Object;
    IOR_obt_hrou["HROU"] = new Array("HROUH", "HROUC");
    var IOR_obt_rcn = new Object;
    IOR_obt_rcn["ROU"] = new Array("ROUH", "ROUC");
    IOR_obt_rcn["RNC"] = new Array("RNCH", "RNCC");
    IOR_obt_rcn["REO"] = new Array("REOO", "REOE");
    IOR_obt_rcn["HROU"] = new Array("HROUH", "HROUC");
    IOR_obt_rcn["HREO"] = new Array("HREOO", "HREOE");
    var IOR_obt_rrn = new Object;
    IOR_obt_rrn["ROU"] = new Array("ROUH", "ROUC");
    IOR_obt_rrn["RNB"] = new Array("RNBH", "RNBC");
    IOR_obt_rrn["REO"] = new Array("REOO", "REOE");
    IOR_obt_rrn["HROU"] = new Array("HROUH", "HROUC");
    IOR_obt_rrn["HREO"] = new Array("HREOO", "HREOE");
    var IOR_obt_rwi = new Object;
    IOR_obt_rwi["RE"] = new Array("REH", "REC");
    var IOR_obt_ret = new Object;
    IOR_obt_ret["RE"] = new Array("REH", "REC");
    IOR_obt_ret["ROU"] = new Array("ROUH", "ROUC");
    IOR_obt_ret["RM"] = new Array("RMH", "RMC", "RMN");
    IOR_obt_ret["HRM"] = new Array("HRMH", "HRMC", "HRMN");
    IOR_obt_ret["HRE"] = new Array("HREH", "HREC");
    IOR_obt_ret["HROU"] = new Array("HROUH", "HROUC");
    IOR_obt_ret["RG"] = new Array("RGH", "RGC", "RGN");
    IOR_obt_ret["RTS"] = new Array("RTSY", "RTSN");
    var IOR_obt_rpk = new Object;
    IOR_obt_rpk["RE"] = new Array("REH", "REC");
    IOR_obt_rpk["ROU"] = new Array("ROUH", "ROUC");
    IOR_obt_rpk["RM"] = new Array("RMH", "RMC", "RMN");
    IOR_obt_rpk["RPX"] = new Array("RPXH", "RPXC", "RPXN");
    IOR_obt_rpk["RSH"] = new Array("RSHY", "RSHN");
    IOR_obt_rpk["RSC"] = new Array("RSCY", "RSCN");
    var IOR = new Object;
    IOR["rb"] = IOR_rb;
    IOR["r"] = IOR_r;
    IOR["rpd"] = IOR_rpd;
    IOR["pd"] = IOR_pd;
    IOR["p3pd"] = IOR_rpd;
    IOR["OBT_LIVE_mix"] = IOR_obt_live_mix;
    IOR["OBT_LIVE_hmix"] = IOR_obt_live_hmix;
    IOR["OBT_LIVE_etmix"] = IOR["OBT_LIVE_mix"];
    IOR["OBT_LIVE_ethmix"] = IOR["OBT_LIVE_hmix"];
    IOR["OBT_mix"] = IOR_obt_mix;
    IOR["OBT_hmix"] = IOR_obt_hmix;
    IOR["OBT_re"] = IOR_obt_re;
    IOR["OBT_hre"] = IOR_obt_hre;
    IOR["OBT_rou"] = IOR_obt_rou;
    IOR["OBT_hrou"] = IOR_obt_hrou;
    IOR["OBT_rcn"] = IOR_obt_rcn;
    IOR["OBT_rrn"] = IOR_obt_rrn;
    IOR["OBT_rwi"] = IOR_obt_rwi;
    IOR["OBT_ret"] = IOR_obt_ret;
    IOR["OBT_rpk"] = IOR_obt_rpk;
    IOR["OBT_r"] = IOR_obt_r;
    IOR["OBT_ou"] = IOR_obt_ou;
    IOR["OBT_hr"] = IOR_obt_hr;
    IOR["OBT_hou"] = IOR_obt_hou;
    IOR["OBT_cn"] = IOR_obt_cn;
    IOR["OBT_cn_p"] = IOR_obt_cn_p;
    IOR["OBT_rn"] = IOR_obt_rn;
    IOR["OBT_rn_p"] = IOR_obt_rn_p;
    IOR["OBT_wi"] = IOR_obt_wi;
    IOR["OBT_wi_p"] = IOR_obt_wi_p;
    IOR["OBT_etre"] = IOR["OBT_re"];
    IOR["OBT_ethre"] = IOR["OBT_hre"];
    IOR["OBT_etrou"] = IOR["OBT_rou"];
    IOR["OBT_ethrou"] = IOR["OBT_hrou"];
    IOR["OBT_etrn"] = IOR["OBT_rrn"];
    IOR["OBT_etcn"] = IOR["OBT_rcn"];
    IOR["OBT_etwi"] = IOR["OBT_rwi"];
    IOR["OBT_etpk"] = IOR["OBT_rpk"];
    _self.init = function () {
        _self.reInit(_self, classname, gameInfo, GameRatio, OBT, PK, IOR)
    }
};