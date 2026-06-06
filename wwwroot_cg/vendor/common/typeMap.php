<?php
$typeMap = [];
$typeMap["FT"] = [];
$typeMap["FT"]["P3"] = ["FT_P"];
$typeMap["FT"]["R"] = ["FT_R","FT_HR","FT_RE","FT_HRE"];
$typeMap["FT"]["OU"] = ["FT_OU","FT_HOU","FT_ROU","FT_HROU"];
$typeMap["FT"]["M"] = ["FT_M","FT_HM","FT_RM","FT_HRM"];
$typeMap["FT"]["PD"] = ["FT_PD","FT_HPD","FT_RPD","FT_HRPD"];
$typeMap["FT"]["M15"] = ["FT_AR","FT_BR","FT_CR","FT_DR","FT_ER","FT_FR","FT_AOU","FT_BOU","FT_COU","FT_DOU","FT_EOU","FT_FOU",
    "FT_AM","FT_BM","FT_CM","FT_DM","FT_EM","FT_FM","FT_ARE","FT_BRE","FT_CRE","FT_DRE","FT_ERE","FT_FRE",
    "FT_AROU","FT_BROU","FT_CROU","FT_DROU","FT_EROU","FT_FROU","FT_ARM","FT_BRM","FT_CRM","FT_DRM","FT_ERM","FT_FRM"];
$typeMap["FT"]["T"] = ["FT_T","FT_HT","FT_RT","FT_HRT"];
$typeMap["FT"]["OUALL"] = ["FT_OUH","FT_OUC","FT_HOUH","FT_HOUC","FT_ROUH","FT_ROUC","FT_HRUH","FT_HRUC"];
$typeMap["FT"]["EO"] = ["FT_ODD","FT_EVEN","FT_HODD","FT_HEVEN","FT_RODD","FT_REVEN","FT_HRODD","FT_HREVEN"];
$typeMap["FT"]["F"] = ["FT_F","FT_RF"];
$typeMap["FT"]["WM"] = ["FT_WM","FT_RWM"];
$typeMap["FT"]["DC"] = ["FT_DC","FT_RDC"];
$typeMap["FT"]["FS"] = ["FT_FS"];
$typeMap["FT"]["CS"] = ["FT_CS","FT_RCS"];
$typeMap["FT"]["WN"] = ["FT_WN","FT_RWN"];
$typeMap["FT"]["RCD"] = ["FT_RCD"];
$typeMap["FT"]["F2G"] = ["FT_F2G"];
$typeMap["FT"]["F3G"] = ["FT_F3G"];
$typeMap["FT"]["HMG"] = ["FT_HG","FT_MG","FT_RHG","FT_RMG"];
$typeMap["FT"]["SB"] = ["FT_SB","FT_RSB"];
$typeMap["FT"]["FG"] = ["FT_FG"];
$typeMap["FT"]["T1G"] = ["FT_T1G","FT_RT1G"];
$typeMap["FT"]["T3G"] = ["FT_T3G","FT_RT3G"];
$typeMap["FT"]["W3"] = ["FT_W3"];
$typeMap["FT"]["BH"] = ["FT_BH"];
$typeMap["FT"]["WE"] = ["FT_WE","FT_RWE"];
$typeMap["FT"]["WB"] = ["FT_WB","FT_RWB"];
$typeMap["FT"]["TK"] = ["FT_TK"];
$typeMap["FT"]["PA"] = ["FT_PA"];
$typeMap["FT"]["ST"] = ["FT_STFH","FT_STFC","FT_STFN","FT_STLH","FT_STLC","FT_STLN"];
$typeMap["FT"]["OS"] = ["FT_OSFH","FT_OSFC","FT_OSFN","FT_OSLH","FT_OSLC","FT_OSLN"];

//2016 新玩法 & 修正
$typeMap["FT"]["TS"] = ["FT_TS","FT_RTS","FT_HTS","FT_RTS2"];
$typeMap["FT"]["EOALL"] = ["FT_EOH","FT_EOC","FT_HEOH","FT_HEOC"];
$typeMap["FT"]["PG"] = ["FT_PGFH","FT_PGFC","FT_PGFN","FT_PGLH","FT_PGLC","FT_PGLN",
    "FT_ARG","FT_BRG","FT_CRG","FT_DRG","FT_ERG","FT_FRG","FT_GRG","FT_HRG","FT_IRG","FT_JRG"];
$typeMap["FT"]["MQ"] = ["FT_MQ","FT_MW"];
$typeMap["FT"]["MOU"] = ["FT_MOUA","FT_MOUB","FT_MOUC","FT_MOUD","FT_RMUA","FT_RMUB","FT_RMUC","FT_RMUD"];
$typeMap["FT"]["MPG"] = ["FT_MPG","FT_RMPG"];
$typeMap["FT"]["MTS"] = ["FT_MTS","FT_RMTS"];
$typeMap["FT"]["OUT"] = ["FT_OUTA","FT_OUTB","FT_OUTC","FT_OUTD","FT_RUTA","FT_RUTB","FT_RUTC","FT_RUTD"];
$typeMap["FT"]["RSX"] = ["FT_RSHA","FT_RSHB","FT_RSHC","FT_RSHD","FT_RSHE","FT_RSHF","FT_RSHG","FT_RSHH","FT_RSHI","FT_RSHJ","FT_RSHK","FT_RSHL","FT_RSHM","FT_RSHN","FT_RSHO",
    "FT_RSCA","FT_RSCB","FT_RSCC","FT_RSCD","FT_RSCE","FT_RSCF","FT_RSCG","FT_RSCH","FT_RSCI","FT_RSCJ","FT_RSCK","FT_RSCL","FT_RSCM","FT_RSCN","FT_RSCO"];
$typeMap["FT"]["CN"] = ["FT_CNFH","FT_CNFC","FT_CNFN","FT_CNLH","FT_CNLC","FT_CNLN",
    "FT_RNC1","FT_RNC2","FT_RNC3","FT_RNC4","FT_RNC5","FT_RNC6","FT_RNC7","FT_RNC8","FT_RNC9","FT_RNCA",
    "FT_RNCB","FT_RNCC","FT_RNCD","FT_RNCE","FT_RNCF","FT_RNCG","FT_RNCH","FT_RNCI","FT_RNCJ","FT_RNCK",
    "FT_RNCL","FT_RNCM","FT_RNCN","FT_RNCO","FT_RNCP","FT_RNCQ","FT_RNCR","FT_RNCS","FT_RNCT","FT_RNCU"];
$typeMap["FT"]["CD"] = ["FT_CDFH","FT_CDFC","FT_CDFN","FT_CDLH","FT_CDLC","FT_CDLN",
    "FT_RNBA","FT_RNBB","FT_RNBC","FT_RNBD","FT_RNBE","FT_RNBF","FT_RNBG","FT_RNBH","FT_RNBI","FT_RNBJ","FT_RNBK","FT_RNBL","FT_RNBM","FT_RNBN","FT_RNBO"];
$typeMap["FT"]["OG"] = ["FT_OG"];
$typeMap["FT"]["OUE"] = ["FT_OUEA","FT_OUEB","FT_OUEC","FT_OUED","FT_RUEA","FT_RUEB","FT_RUEC","FT_RUED"];
$typeMap["FT"]["OUP"] = ["FT_OUPA","FT_OUPB","FT_OUPC","FT_OUPD","FT_RUPA","FT_RUPB","FT_RUPC","FT_RUPD"];
$typeMap["FT"]["DU"] = ["FT_DUA","FT_DUB","FT_DUC","FT_DUD","FT_RDUA","FT_RDUB","FT_RDUC","FT_RDUD"];
$typeMap["FT"]["DS"] = ["FT_DS","FT_RDS"];
$typeMap["FT"]["DG"] = ["FT_DG","FT_RDG"];
$typeMap["FT"]["OT"] = ["FT_OT","FT_ROT"];
$typeMap["FT"]["YC"] = ["FT_YCFH","FT_YCFC","FT_YCFN","FT_YCLH","FT_YCLC","FT_YCLN"];
$typeMap["FT"]["RC"] = ["FT_RCFH","FT_RCFC","FT_RCFN","FT_RCLH","FT_RCLC","FT_RCLN"];
$typeMap["FT"]["GA"] = ["FT_GAFH","FT_GAFC","FT_GAFN","FT_GALH","FT_GALC","FT_GALN"];
$typeMap["FT"]["ET5"] = ["FT_TARU","FT_TBRU","FT_TCRU","FT_TDRU","FT_TERU","FT_TFRU"];
$typeMap["FT"]["RPX"] = ["FT_RPXA","FT_RPXB","FT_RPXC","FT_RPXD","FT_RPXE","FT_RPXF"];
$typeMap["FT"]["RTW"] = ["FT_RTW"];
$typeMap["FT"]["RPF"] = ["FT_RPF"];
$typeMap["FT"]["RPS"] = ["FT_RPS"];


$typeMap["BK"] = [];
$typeMap["BK"]["R"] = ["BK_R","BK_RE"];
$typeMap["BK"]["OU"] = ["BK_OU","BK_ROU"];
$typeMap["BK"]["OUALL"] = ["BK_OUH","BK_OUC","BK_ROUH","BK_ROUC"];
$typeMap["BK"]["PDALL"] = ["BK_PD","BK_RPD"];
$typeMap["BK"]["M"] = ["BK_M","BK_RM"];
$typeMap["BK"]["EO"] = ["BK_ODD","BK_EVEN","BK_RODD","BK_REVEN"];
$typeMap["BK"]["P3"] = ["BK_P"];

$typeMap["BM"] = [];
$typeMap["BM"]["M"] = ["BM_M","BM_RM"];
$typeMap["BM"]["R"] = ["BM_R","BM_RE"];
$typeMap["BM"]["OU"] = ["BM_OU","BM_ROU"];
$typeMap["BM"]["Rms"] = ["BM_Rms","BM_REms"];
$typeMap["BM"]["OUms"] = ["BM_OUms","BM_ROUms"];
$typeMap["BM"]["OUALL"] = ["BM_OUH","BM_OUC","BM_ROUH","BM_ROUC"];
$typeMap["BM"]["PDALL"] = ["BM_PD3","BM_PD5","BM_RPD3","BM_RPD5"];
$typeMap["BM"]["EO"] = ["BM_ODD","BM_EVEN","BM_RODD","BM_REVEN"];
$typeMap["BM"]["EOms"] = ["BM_ODDms","BM_EVENms","BM_RODDms","BM_REVENms"];
$typeMap["BM"]["P3"] = ["BM_P"];

$typeMap["TT"] = [];
$typeMap["TT"]["M"] = ["TT_M","TT_RM"];
$typeMap["TT"]["R"] = ["TT_R","TT_RE"];
$typeMap["TT"]["OU"] = ["TT_OU","TT_ROU"];
$typeMap["TT"]["Rms"] = ["TT_Rms","TT_REms"];
$typeMap["TT"]["OUms"] = ["TT_OUms","TT_ROUms"];
$typeMap["TT"]["OUALL"] = ["TT_OUH","TT_OUC","TT_ROUH","TT_ROUC"];
$typeMap["TT"]["PDALL"] = ["TT_PD3","TT_PD5","TT_RPD3","TT_RPD5"];
$typeMap["TT"]["EO"] = ["TT_ODD","TT_EVEN","TT_RODD","TT_REVEN"];
$typeMap["TT"]["EOms"] = ["TT_ODDms","TT_EVENms","TT_RODDms","TT_REVENms"];
$typeMap["TT"]["P3"] = ["TT_P"];

$typeMap["TN"] = [];
$typeMap["TN"]["M"] = ["TN_M","TN_RM"];
$typeMap["TN"]["R"] = ["TN_R","TN_RE"];
$typeMap["TN"]["OU"] = ["TN_OU","TN_ROU"];
$typeMap["TN"]["Rms"] = ["TN_Rms","TN_REms"];
$typeMap["TN"]["OUms"] = ["TN_OUms","TN_ROUms"];
$typeMap["TN"]["OUALL"] = ["TN_OUH","TN_OUC","TN_ROUH","TN_ROUC"];
$typeMap["TN"]["PDALL"] = ["TN_PD5","TN_PD7","TN_RPD5","TN_RPD7"];
$typeMap["TN"]["EO"] = ["TN_ODD","TN_EVEN","TN_RODD","TN_REVEN"];
$typeMap["TN"]["EOms"] = ["TN_ODDms","TN_EVENms","TN_RODDms","TN_REVENms"];
$typeMap["TN"]["P3"] = ["TN_P"];

$typeMap["VB"] = [];
$typeMap["VB"]["M"] = ["VB_M","VB_RM"];
$typeMap["VB"]["R"] = ["VB_R","VB_RE"];
$typeMap["VB"]["OU"] = ["VB_OU","VB_ROU"];
$typeMap["VB"]["Rms"] = ["VB_Rms","VB_REms"];
$typeMap["VB"]["OUms"] = ["VB_OUms","VB_ROUms"];
$typeMap["VB"]["OUALL"] = ["VB_OUH","VB_OUC","VB_ROUH","VB_ROUC"];
$typeMap["VB"]["PDALL"] = ["VB_PD3","VB_PD5","VB_RPD3","VB_RPD5"];
$typeMap["VB"]["EO"] = ["VB_ODD","VB_EVEN","VB_RODD","VB_REVEN"];
$typeMap["VB"]["EOms"] = ["VB_ODDms","VB_EVENms","VB_RODDms","VB_REVENms"];
$typeMap["VB"]["P3"] = ["VB_P"];

$typeMap["BS"] = [];
$typeMap["BS"]["R"] = ["BS_R","BS_RE","BS_HR","BS_HRE"];
$typeMap["BS"]["OU"] = ["BS_OU","BS_ROU","BS_HOU","BS_HROU"];
$typeMap["BS"]["M"] = ["BS_M","BS_RM","BS_HM","BS_HRM"];
$typeMap["BS"]["EO"] = ["BS_EOO","BS_EOE","BS_REOO","BS_REOE"];
$typeMap["BS"]["OUALL"] = ["BS_OUH","BS_OUC","BS_ROUH","BS_ROUC","BS_HOUH","BS_HOUC","BS_HRUH","BS_HRUC"];
$typeMap["BS"]["WM"] = ["BS_WM","BS_RWM","BS_HWM","BS_HRWM"];
$typeMap["BS"]["OT"] = ["BS_OT","BS_ROT"];
$typeMap["BS"]["P3"] = ["BS_P"];

$typeMap["OP"] = [];
$typeMap["OP"]["R"] = ["OP_R","OP_RE"];
$typeMap["OP"]["OU"] = ["OP_OU","OP_ROU"];
$typeMap["OP"]["M"] = ["OP_M","OP_RM"];
$typeMap["OP"]["EO"] = ["OP_ODD","OP_EVEN","OP_RODD","OP_REVEN"];
$typeMap["OP"]["P3"] = ["OP_P"];

$typeMap["SK"] = [];
$typeMap["SK"]["R"] = ["OP_R","OP_RE"];
$typeMap["SK"]["OU"] = ["OP_OU","OP_ROU"];
$typeMap["SK"]["M"] = ["OP_M","OP_RM"];
$typeMap["SK"]["EO"] = ["OP_EOO","OP_EOE","OP_REOO","OP_REOE"];
$typeMap["SK"]["FALL"] = ["F01","F02","RF01","RF02","RF03","RF04","RF05","RF06","RF07","RF08","RF09","RF10",
    "RF11","RF12","RF13","RF14","RF15","RF16","RF17","RF18","RF19","RF20","RF21","RF22",
    "RF23","RF24","RF25","RF26","RF27","RF28","RF29","RF30","RF31","RF32","RF33","RF34","RF35"];
$typeMap["SK"]["P3"] = ["OP_P"];