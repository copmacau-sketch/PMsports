
 function game_list_TN(_win, _dom, _post) {
                var _self = this;
                var classname = "game_list_TN";
                var gameInfo = new Object;
                gameInfo["rb"] = new Array("ECID","DATETIME","MIDFIELD_SHOW","PTYPE","SHOWDELAY","RB_SHOW","SERVE","RBICON_SHOW","SCORE_H","SCORE_C","TEAM_H","TEAM_C","DISPLAY_TV","TV_STYLE","MORE","STRONG_H","STRONG_C","LASTESTSCORE_H","LASTESTSCORE_C","INFO_SHOW","BEST","RETIMESET","SCOREGAMEH","SCORESETH","SCOREPOINTH","SCOREGAMEC","SCORESETC","SCOREPOINTC");
                gameInfo["r"] = new Array("ECID","DATETIME","MIDFIELD_SHOW","PTYPE","RB_SHOW","RBICON_SHOW","SCORE_H","SCORE_C","TEAM_H","TEAM_C","DISPLAY_TV","TV_STYLE","MORE","STRONG_H","STRONG_C","LASTESTSCORE_H","LASTESTSCORE_C","INFO_SHOW","BEST");
                var GameRatio = new Object;
                GameRatio["rb"] = new Array("ECID","GID","GIDM","HGID","STR_RF","STR_MS","NOWGAME","WTYPE_RF","WTYPE_RGA","PLAYS");
                GameRatio["r"] = new Array("ECID","GID","GIDM","HGID","STR_MS","PLAYS");
                var IOR_rb = new Object;
                IOR_rb["RM"] = new Array("RMH","RMC");
                IOR_rb["RE"] = new Array("REH","REC");
                IOR_rb["ROU"] = new Array("ROUH","ROUC");
                IOR_rb["RF"] = new Array("RFH","RFC");
                IOR_rb["RGA"] = new Array("RGAY","RGAN");
                var IOR_r = new Object;
                IOR_r["M"] = new Array("MH","MC","MN");
                IOR_r["R"] = new Array("RH","RC");
                IOR_r["OU"] = new Array("OUH","OUC");
                var IOR = new Object;
                IOR["rb"] = IOR_rb;
                IOR["r"] = IOR_r;
                _self.init = function() {
                    _self.reInit(_self, classname, gameInfo, GameRatio, null, null, IOR)
                }
            }
            ;